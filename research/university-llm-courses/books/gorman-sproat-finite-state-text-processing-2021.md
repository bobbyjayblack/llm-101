# *Finite-State Text Processing* (2021)

## Bibliographic and course scope

- **Authors:** Kyle Gorman and Richard Sproat.
- **Edition:** First edition, Synthesis Lectures on Human Language Technologies, 2021. Springer’s record lists softcover ISBN 978-3-031-01051-4 (published 26 May 2021) and eBook ISBN 978-3-031-02179-4 (2022 platform edition), 140 pages including front/back matter.
- **Why it appears here:** MIT 24.S90’s Fall 2024 syllabus lists it as an optional technical supplement. No chapters are required by that syllabus.
- **Sources and access date:** [Springer bibliographic/TOC record](https://link.springer.com/book/10.1007/978-3-031-02179-4), [Springer’s public Chapter 1 abstract](https://link.springer.com/chapter/10.1007/978-3-031-02179-4_1), and Michael B. Maxwell’s [public LINGUIST List review](https://linguistlist.org/issues/33/496/), checked 2026-09-07.

## Table of contents

The publisher’s edition-specific TOC contains eight content chapters:

1. **Finite-State Machines** (pp. 1–15)
2. **The Pynini Library** (pp. 17–29)
3. **Basic Algorithms** (pp. 31–42)
4. **Advanced Algorithms** (pp. 43–47)
5. **Rewrite Rules** (pp. 49–75)
6. **Morphological Analysis and Generation** (pp. 77–92)
7. **Text Generation and Processing** (pp. 93–103)
8. **The Future** (pp. 105–108)

Front matter is pp. i–xvii; back matter is pp. 109–140. The public publisher description identifies weighted finite-state transducers (WFSTs), Pynini, context-dependent rewrite rules, morphological analyzers/generators, and text-generation/processing case studies as the book’s central arc.

## Chapter review

Springer exposes the complete edition-specific TOC and a public abstract for Chapter 1, but the chapter pages require subscription access. Maxwell’s public 2022 review discusses every content chapter and reports on installation and examples; the evidence tier below is therefore **publisher abstract/TOC + detailed secondary review**, not a claim of unrestricted full-text reading. The LLM 101 applications are original.

| Chapter | Evidence tier | Concept assessment and LLM 101 use |
|---|---|---|
| 1. Finite-State Machines | Publisher chapter abstract + detailed public review | Introduces automata/transducers and weights as a compact way to recognize, generate, rank, and transform strings. Use a tiny deterministic normalization/transduction lab before model calls; show how a verified finite-state rule can constrain dates, units, or names in an assistant. |
| 2. The Pynini Library | Publisher TOC + detailed public review | Presents the Python interface to OpenFst, string maps, encoding, and library conventions. LLM 101 can use a small Python bridge for deterministic text normalization, while documenting Unicode and error-message pitfalls; keep this optional for non-programmers. |
| 3. Basic Algorithms | Publisher TOC + detailed public review | Covers operations such as union, concatenation, intersection, composition, difference, and reversal at a mathematical/implementation level. Build an example that composes a tokenizer or normalization rule with a vocabulary filter; explain why deterministic composition is easier to audit than a free-form generation. |
| 4. Advanced Algorithms | Publisher TOC + detailed public review | Focuses on optimization, path length, and weighted search, with links to speech recognition and spelling correction. Add a weighted candidate-ranking exercise for normalizing noisy input; make the lesson explicit that shortest path is an engineering objective, not semantic truth. |
| 5. Rewrite Rules | Publisher TOC + detailed public review | Turns finite-state operations toward context-dependent rewrite rules, with case studies such as grapheme-to-phoneme conversion, vowel harmony, and number/currency normalization. This is directly useful for LLM 101’s audio-first interface: normalize dates, abbreviations, and symbols before narration, and test reversibility where possible. |
| 6. Morphological Analysis and Generation | Publisher TOC + detailed public review | Applies weighted transducers to morphological analyzers/generators and paradigms. Add a bounded multilingual morphology example to expose vocabulary/tokenization gaps; preserve an explicit “unsupported language/form” result instead of silently generating a plausible form. |
| 7. Text Generation and Processing | Publisher TOC + detailed public review | Applies Pynini/FST composition to practical text processing and generation. Pair a deterministic templated response with an LLM response on the same facts, then compare controllability, coverage, and failure behavior; use the FST path as a safe guardrail for structured fields. |
| 8. The Future | Publisher TOC + detailed public review | Discusses whether finite-state methods remain useful alongside machine learning and neural architectures. Use it to teach hybrid system design: deterministic preprocessing/validation around a probabilistic model. The chapter is historically dated by the 2021 publication and should be updated with current tokenizer and tool-calling constraints. |

## Recommendation for LLM 101

Use Chapters 1, 5, 6, and 7 as optional “reliable text plumbing” lessons. They can improve examples for normalization, token boundaries, structured fields, and audio narration. Finite-state tools should be framed as complements to LLMs: excellent where rules are explicit and testable, insufficient for open-ended semantic interpretation. A modern update should include Unicode normalization, subword tokenization, JSON/schema validation, and model-output sanitization.

## Limitations

The publisher’s chapter pages are subscription previews; the only public chapter abstract inspected was Chapter 1. The detailed secondary review provides chapter-by-chapter discussion and reports practical installation/tests, but this dossier does not claim unrestricted full-text review. The book is a 2021 snapshot and does not discuss current LLM tool calling or structured-output APIs.
