"""Local Qwen3-TTS narration. No network access is needed after --prepare."""
import argparse
import gc
import hashlib
import json
import logging
import os
from pathlib import Path
import re
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / '.models'
AUDIO_DIR = ROOT / '.audio'
VOICES = json.loads((ROOT / 'voices.json').read_text(encoding='utf-8'))
VOICE_MAP = {voice['id']: voice for voice in VOICES}
APP_ID = hashlib.sha256(str(ROOT).lower().encode()).hexdigest()[:16]
REFERENCE_TEXT = ('Welcome. Let us take this one idea at a time. A model learns patterns '
                  'from examples, while the surrounding software helps us use those patterns. '
                  'There is no need to rush. We can pause, try an experiment, and come back '
                  'to anything that needs a little more explanation.')
MODELS = {
    'design': ('Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign', '5ecdb67327fd37bb2e042aab12ff7391903235d3'),
    'base': ('Qwen/Qwen3-TTS-12Hz-1.7B-Base', 'fd4b254389122332181a7c3db7f27e918eec64e3'),
}
os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY', '1')
os.environ.setdefault('HF_HUB_DISABLE_SYMLINKS_WARNING', '1')
os.environ.setdefault('TOKENIZERS_PARALLELISM', 'false')
log = logging.getLogger('narration')


def voice_version(voice):
    return hashlib.sha256(json.dumps([voice, REFERENCE_TEXT, MODELS], sort_keys=True).encode()).hexdigest()[:20]


def reference_path(voice):
    return AUDIO_DIR / 'voices' / f"{voice['id']}-{voice_version(voice)}.wav"


def validate_request(value):
    if not isinstance(value, dict):
        raise ValueError('Expected a JSON object.')
    text, voice = value.get('text'), value.get('voice', 'claire')
    if not isinstance(text, str) or not text.strip() or len(text) > 1200:
        raise ValueError('Text must contain between 1 and 1200 characters.')
    if not isinstance(voice, str) or voice not in VOICE_MAP:
        raise ValueError('Unknown narrator.')
    # Do not pass model control tokens through to the speech model.
    if '<|' in text or '|>' in text:
        raise ValueError('Speech text must not contain model control tokens.')
    return re.sub(r'\s+', ' ', text).strip(), voice


def load_model(kind):
    import torch
    from qwen_tts import Qwen3TTSModel
    if not torch.cuda.is_available():
        raise RuntimeError('CUDA is unavailable. Run setup-audio.ps1 with an NVIDIA GPU and current driver.')
    # SDPA works on native Windows without compiling FlashAttention.
    torch.set_num_threads(8)
    return Qwen3TTSModel.from_pretrained(
        str(MODEL_DIR / kind), device_map='cuda:0', dtype=torch.bfloat16,
        attn_implementation='sdpa', local_files_only=True,
    )


def write_audio(path, samples, sample_rate):
    import numpy as np
    import soundfile as sf
    if not len(samples) or not np.isfinite(samples).all() or np.max(np.abs(samples)) < 1e-5:
        raise RuntimeError('The speech model returned empty or invalid audio. Please retry.')
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    sf.write(str(temporary), samples, sample_rate, format='WAV', subtype='PCM_16')
    temporary.replace(path)


def prepare():
    import torch
    from huggingface_hub import snapshot_download
    for name, (repo, revision) in MODELS.items():
        log.info('Downloading/verifying %s', repo)
        snapshot_download(repo, revision=revision, local_dir=str(MODEL_DIR / name),
                          ignore_patterns=['*.md', '*.gitattributes'], max_workers=4)
    missing = [voice for voice in VOICES if not reference_path(voice).exists()]
    if missing:
        log.info('Loading VoiceDesign to create %s original narrator voices', len(missing))
        model = load_model('design')
        for voice in missing:
            log.info('Designing %s', voice['name'])
            torch.manual_seed(voice['seed'])
            with torch.inference_mode():
                wavs, sr = model.generate_voice_design(
                    text=REFERENCE_TEXT, language='English', instruct=voice['description'],
                    max_new_tokens=1500,
                )
            write_audio(reference_path(voice), wavs[0], sr)
        del model
        gc.collect()
        torch.cuda.empty_cache()
    log.info('Models and narrator references are ready.')


class Narrator:
    def __init__(self):
        self.status = 'loading'
        self.error = None
        self.model = None
        self.prompts = {}
        self.lock = threading.Lock()
        # One generation and one look-ahead request; never an unbounded GPU queue.
        self.slots = threading.BoundedSemaphore(2)

    def load(self):
        try:
            import soundfile as sf
            os.environ['HF_HUB_OFFLINE'] = '1'
            os.environ['TRANSFORMERS_OFFLINE'] = '1'
            self.model = load_model('base')
            for voice in VOICES:
                samples, sr = sf.read(reference_path(voice), dtype='float32')
                self.prompts[voice['id']] = self.model.create_voice_clone_prompt(
                    ref_audio=(samples, sr), ref_text=REFERENCE_TEXT, x_vector_only_mode=False,
                )
            self.status = 'ready'
            log.info('Qwen3-TTS ready on CUDA. Narrators: %s', ', '.join(self.prompts))
        except Exception as exc:
            self.error = str(exc)
            self.status = 'error'
            log.exception('Unable to load local narration')

    def speech(self, text, voice):
        import torch
        fingerprint = json.dumps([text, voice_version(VOICE_MAP[voice]), 'speech-v1'], ensure_ascii=False)
        digest = hashlib.sha256(fingerprint.encode()).hexdigest()
        path = AUDIO_DIR / 'cache' / f'{digest}.wav'
        with self.lock:
            if path.exists():
                return path.read_bytes(), True
            log.info('Generating %s: %s characters', voice, len(text))
            torch.manual_seed(int(digest[:8], 16))
            with torch.inference_mode():
                wavs, sr = self.model.generate_voice_clone(
                    text=text, language='English', voice_clone_prompt=self.prompts[voice],
                    max_new_tokens=2048,
                )
            write_audio(path, wavs[0], sr)
            # Bound the disposable narration cache to approximately 1 GB.
            cached = sorted(path.parent.glob('*.wav'), key=lambda item: item.stat().st_mtime)
            total = sum(item.stat().st_size for item in cached)
            for old in cached:
                if total <= 1024 ** 3:
                    break
                if old != path:
                    total -= old.stat().st_size
                    old.unlink()
            return path.read_bytes(), False


class Handler(BaseHTTPRequestHandler):
    def respond(self, code, data, content_type='application/json', extra=None):
        body = json.dumps(data).encode() if content_type == 'application/json' else data
        try:
            self.send_response(code)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            for key, value in (extra or {}).items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass  # Listener stopped or navigated away during generation.

    def allowed(self):
        # No cross-origin model access or DNS-rebinding hostnames.
        if self.headers.get('Host') not in ('127.0.0.1:4174', 'localhost:4174'):
            self.respond(403, {'error': 'Local access only.'})
            return False
        if self.headers.get('Origin') not in (None, 'http://127.0.0.1:4173', 'http://localhost:4173'):
            self.respond(403, {'error': 'Origin is not allowed.'})
            return False
        return True

    def do_GET(self):
        if not self.allowed():
            return
        if self.path == '/health':
            self.respond(200, {'service': 'llm101-audio', 'appId': APP_ID,
                              'status': self.server.narrator.status, 'error': self.server.narrator.error,
                              'voices': [{'id': v['id'], 'name': v['name']} for v in VOICES]})
        else:
            self.respond(404, {'error': 'Not found.'})

    def do_POST(self):
        if not self.allowed():
            return
        if self.path != '/speech':
            self.respond(404, {'error': 'Not found.'})
            return
        if self.headers.get('Content-Type', '').split(';')[0] != 'application/json':
            self.respond(415, {'error': 'Use application/json.'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 10000:
                raise ValueError('Request body is too large or missing.')
            self.connection.settimeout(10)
            text, voice = validate_request(json.loads(self.rfile.read(length)))
        except (ValueError, UnicodeError, TimeoutError) as exc:
            self.respond(400, {'error': str(exc)})
            return
        narrator = self.server.narrator
        if narrator.status != 'ready':
            self.respond(503, {'error': 'Local narrator is not ready. Run start.bat and check the audio log.'})
            return
        if not narrator.slots.acquire(blocking=False):
            self.respond(429, {'error': 'Narrator is busy. Please try again shortly.'})
            return
        try:
            audio, cached = narrator.speech(text, voice)
            self.respond(200, audio, 'audio/wav', {'X-Audio-Cache': 'hit' if cached else 'miss'})
        except Exception:
            log.exception('Speech generation failed')
            self.respond(500, {'error': 'Speech generation failed. See .service/audio-stderr.log, then retry.'})
        finally:
            narrator.slots.release()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare', action='store_true')
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    if args.prepare:
        prepare()
        return
    server = ThreadingHTTPServer(('127.0.0.1', 4174), Handler)
    server.daemon_threads = True
    server.narrator = Narrator()
    threading.Thread(target=server.narrator.load, daemon=True).start()
    log.info('Audio service listening at http://127.0.0.1:4174')
    server.serve_forever()


if __name__ == '__main__':
    main()
