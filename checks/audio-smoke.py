"""Run against start.bat's real local model; save samples and timings outside Git."""
import json
from pathlib import Path
import time
import urllib.request
import wave
import io

root = Path(__file__).resolve().parent.parent
sample = 'Welcome. Let us take this one idea at a time. We can pause, try an experiment, and come back to anything that needs a little more explanation.'
results = []
for voice in ['claire', 'grace', 'helen']:
    data = json.dumps({'text': sample, 'voice': voice}).encode()
    request = urllib.request.Request('http://127.0.0.1:4173/api/audio/speech', data=data, headers={'Content-Type': 'application/json'})
    started = time.perf_counter()
    with urllib.request.urlopen(request, timeout=180) as response:
        audio = response.read()
        cache = response.headers.get('X-Audio-Cache')
    elapsed = time.perf_counter() - started
    with wave.open(io.BytesIO(audio)) as wav:
        duration = wav.getnframes() / wav.getframerate()
        assert wav.getframerate() == 24000 and 3 < duration < 40
    (root / '.service' / f'{voice}-sample.wav').write_bytes(audio)
    started = time.perf_counter()
    with urllib.request.urlopen(request, timeout=10) as response:
        assert response.headers['X-Audio-Cache'] == 'hit'
        assert response.read() == audio
    result = {'voice': voice, 'generation_seconds': round(elapsed, 2), 'duration_seconds': round(duration, 2), 'cache': cache, 'replay_seconds': round(time.perf_counter()-started, 3)}
    results.append(result)
    print(json.dumps(result), flush=True)
(root / '.service' / 'audio-verification.json').write_text(json.dumps(results, indent=2))
