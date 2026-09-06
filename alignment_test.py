import unittest
import numpy as np
from alignment import ctc_path, normalized_words


class AlignmentTests(unittest.TestCase):
    def test_ctc_repeated_letters_require_a_blank(self):
        # Silence, L, silence, L, O, trailing silence. A repeat must not collapse.
        expected = [0, 1, 0, 1, 2, 0]
        emissions = np.full((6, 3), -20.0)
        for frame, label in enumerate(expected):
            emissions[frame, label] = 0
        self.assertEqual(ctc_path(emissions, [1, 1, 2]), [(1, 0), (3, 1), (4, 2)])

    def test_impossible_alignment_is_rejected(self):
        with self.assertRaises(ValueError):
            ctc_path(np.zeros((1, 3)), [1, 1, 2])

    def test_word_indices_survive_punctuation_and_numbers(self):
        words = normalized_words("AI isn’t magic; 1.8 is data-driven — really.")
        self.assertEqual(len(words), 8)
        self.assertEqual(words[1], "ISN'T")
        self.assertEqual(words[3], 'ONE|POINT|EIGHT')
        self.assertEqual(words[5], 'DATA|DRIVEN')
        self.assertEqual(words[6], '')


if __name__ == '__main__':
    unittest.main()
