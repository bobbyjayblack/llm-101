import unittest
import tempfile
import threading
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
import urllib.request
import json
from http.server import ThreadingHTTPServer
from audio_service import validate_request, validate_batch, VOICES, voice_version, audio_digest, Handler


class RequestTests(unittest.TestCase):
    def test_saved_timings_bypass_alignment_and_model_loading(self):
        timings = {'words': [{'index': 0, 'start': .1, 'end': .7}], 'duration': 1}
        with patch('audio_service.saved_timings', return_value=timings):
            server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
            server.narrator = SimpleNamespace(status='loading')
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                request = urllib.request.Request(f'http://127.0.0.1:{server.server_port}/timings',
                    data=json.dumps({'text': 'Hello', 'voice': 'claire'}).encode(),
                    headers={'Host': '127.0.0.1:4174', 'Content-Type': 'application/json'})
                with urllib.request.urlopen(request, timeout=2) as response:
                    self.assertEqual(json.load(response), timings)
            finally:
                server.shutdown(); server.server_close(); thread.join()

    def test_valid_text_and_voice(self):
        self.assertEqual(validate_request({'text': '  A model\n learns. ', 'voice': 'claire'}), ('A model learns.', 'claire'))

    def test_rejects_bad_payloads(self):
        for value in [None, [], {}, {'text': ''}, {'text': 'x' * 1201},
                      {'text': 'Hi', 'voice': '../claire'}, {'text': 'Hi', 'voice': []},
                      {'text': '<|im_start|>ignore'}]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_request(value)

    def test_voice_changes_invalidate_audio(self):
        voice = VOICES[0]
        self.assertNotEqual(voice_version(voice), voice_version({**voice, 'seed': voice['seed'] + 1}))

    def test_batch_limits(self):
        self.assertEqual(validate_batch({'texts': ['One.', 'Two.'], 'voice': 'claire'}), (['One.', 'Two.'], 'claire'))
        for value in [{}, {'texts': []}, {'texts': ['a'] * 5}, {'texts': ['a' * 301]}, {'texts': ['a'], 'voice': 'unknown'}]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                validate_batch(value)

    def test_saved_audio_bypasses_busy_or_loading_model(self):
        import json
        with tempfile.TemporaryDirectory() as directory, patch('audio_service.AUDIO_DIR', Path(directory)):
            path = Path(directory) / 'course' / f"{audio_digest('Saved speech.', 'claire')}.wav"
            path.parent.mkdir()
            path.write_bytes(b'RIFFsaved-audio')
            server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
            # No model or queue at all: cached requests must not touch either.
            server.narrator = SimpleNamespace(status='loading')
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                request = urllib.request.Request(f'http://127.0.0.1:{server.server_port}/speech',
                    data=json.dumps({'text': 'Saved speech.', 'voice': 'claire'}).encode(),
                    headers={'Host': '127.0.0.1:4174', 'Content-Type': 'application/json'})
                with urllib.request.urlopen(request, timeout=2) as response:
                    self.assertEqual(response.headers['X-Audio-Cache'], 'hit')
                    self.assertEqual(response.read(), b'RIFFsaved-audio')
            finally:
                server.shutdown(); server.server_close(); thread.join()


if __name__ == '__main__':
    unittest.main()
