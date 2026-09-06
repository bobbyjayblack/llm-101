"""Offline acoustic word alignment for existing WAVs; never changes the voice."""
import io
import json
import re
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODEL = ('facebook/wav2vec2-base-960h', '22aad52d435eb6dbaf354bdad9b0da84ce7d6156')
MODEL_DIR = ROOT / '.models' / 'alignment'
VERSION = 'ctc-words-v2'


def saved_timings(digest):
    try:
        return json.loads((ROOT / '.audio' / 'timings' / f'{digest}-{VERSION}.json').read_text(encoding='utf-8'))
    except FileNotFoundError:
        return None


def prepare():
    from huggingface_hub import snapshot_download
    snapshot_download(MODEL[0], revision=MODEL[1], local_dir=str(MODEL_DIR),
                      allow_patterns=['*.json', 'model.safetensors', 'README.md'])


def normalized_words(text):
    from num2words import num2words
    words = []
    for match in re.finditer(r'\S+', text):
        word = match.group().replace('’', "'")
        word = re.sub(r'\d+(?:\.\d+)?', lambda m: num2words(m.group()), word)
        word = re.sub(r'[^A-Za-z\s\']', ' ', word).upper()
        words.append('|'.join(word.split()))
    return words


def ctc_path(emissions, tokens, blank=0):
    """Viterbi path through CTC blank/token states, including repeated letters."""
    import numpy as np
    labels = np.full(2 * len(tokens) + 1, blank, dtype=np.int64)
    labels[1::2] = tokens
    skip = np.zeros(len(labels), dtype=bool)
    skip[2:] = (labels[2:] != blank) & (labels[2:] != labels[:-2])
    scores = np.full(len(labels), -np.inf)
    scores[0] = 0
    history = np.zeros((len(emissions), len(labels)), dtype=np.uint8)
    for frame, emission in enumerate(emissions):
        advance = np.r_[-np.inf, scores[:-1]]
        jump = np.r_[-np.inf, -np.inf, scores[:-2]]
        jump[~skip] = -np.inf
        choices = np.stack([scores, advance, jump])
        history[frame] = choices.argmax(axis=0)
        scores = choices.max(axis=0) + emission[labels]
    state = len(labels) - 1 if scores[-1] >= scores[-2] else len(labels) - 2
    if not np.isfinite(scores[state]):
        raise ValueError('Audio is too short to align this transcript.')
    path = []
    for frame in range(len(emissions) - 1, -1, -1):
        if state % 2:
            path.append((frame, state // 2))
        state -= int(history[frame, state])
    return list(reversed(path))


class WordAligner:
    def __init__(self):
        self.lock = threading.Lock()
        self.model = None

    def align(self, text, audio, digest):
        import soundfile as sf
        import torch
        from scipy.signal import resample_poly
        from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
        path = ROOT / '.audio' / 'timings' / f'{digest}-{VERSION}.json'
        result = saved_timings(digest)
        if result is not None:
            return result
        with self.lock:
            result = saved_timings(digest)
            if result is not None:
                return result
            if self.model is None:
                self.processor = Wav2Vec2Processor.from_pretrained(str(MODEL_DIR), local_files_only=True)
                self.model = Wav2Vec2ForCTC.from_pretrained(str(MODEL_DIR), local_files_only=True).eval()
            samples, rate = sf.read(io.BytesIO(audio), dtype='float32')
            if samples.ndim > 1:
                samples = samples.mean(axis=1)
            duration = len(samples) / rate
            samples = resample_poly(samples, 16000, rate)
            inputs = self.processor(samples, sampling_rate=16000, return_tensors='pt').input_values
            with torch.inference_mode():
                emissions = self.model(inputs).logits[0].log_softmax(-1).numpy()
            vocab = self.processor.tokenizer.get_vocab()
            tokens, owners = [], []
            for index, word in enumerate(normalized_words(text)):
                if not word:
                    continue
                if tokens:
                    tokens.append(vocab['|']); owners.append(None)
                for char in word:
                    tokens.append(vocab[char]); owners.append(index if char != '|' else None)
            if not tokens:
                result = {'words': [], 'duration': duration}
            else:
                frames = {}
                for frame, token in ctc_path(emissions, tokens, self.model.config.pad_token_id):
                    owner = owners[token]
                    if owner is not None:
                        frames.setdefault(owner, []).append(frame)
                # Acoustic frames are 20 ms apart. Preserve real silences between words.
                scale = duration / len(emissions)
                words = [{'index': index, 'start': round(min(times)*scale, 3),
                          'end': round((max(times)+1)*scale, 3)} for index, times in sorted(frames.items())]
                # Hold through tiny connected-speech gaps to avoid flickering,
                # but clear during longer pauses instead of advancing early.
                for word, following in zip(words, words[1:]):
                    if following['start'] - word['end'] <= .25:
                        word['end'] = following['start']
                result = {'words': words, 'duration': duration}
            path.parent.mkdir(parents=True, exist_ok=True)
            temporary = path.with_suffix('.tmp')
            temporary.write_text(json.dumps(result), encoding='utf-8')
            temporary.replace(path)
            return result


if __name__ == '__main__':
    prepare()
