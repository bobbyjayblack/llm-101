import unittest
from audio_service import validate_request, VOICES, voice_version


class RequestTests(unittest.TestCase):
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


if __name__ == '__main__':
    unittest.main()
