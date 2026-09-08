# *Linguistic Fundamentals for Natural Language Processing: 100 Essentials from Morphology and Syntax* (2013)

## Bibliographic and course scope

- **Author:** Emily M. Bender.
- **Edition:** First edition, 2013, Synthesis Lectures on Human Language Technologies #20. The work was issued by Morgan & Claypool (original print ISBN 978-1-62705-011-1; eBook ISBN 978-1-62705-012-8); Springer’s current record preserves the 2013 copyright and lists print ISBN 978-3-031-01022-4 and eBook ISBN 978-3-031-02150-3 (a 2022 electronic platform edition).
- **Why it appears here:** MIT 24.S90’s Fall 2024 syllabus lists it as an optional technical supplement. It is not a required textbook and the syllabus assigns no chapters.
- **Sources and access date:** [Springer bibliographic/TOC record](https://link.springer.com/book/10.1007/978-3-031-02150-3), [ACL Computational Linguistics review by Chris Dyer](https://aclanthology.org/J15-1007.pdf), and [author publication record](https://faculty.washington.edu/ebender/publications/), checked 2026-09-07.

## Table of contents

The chapter names and pages below follow the publisher record. The book contains 100 short numbered essentials distributed across ten numbered chapters; front matter, resources, bibliography, and indexes are supporting matter.

1. **Introduction/motivation** (pp. 1–10): why linguistic structure matters for NLP, including cross-linguistic variation, feature design, and error analysis.
2. **Morphology: Introduction** (pp. 11–27): word structure, morphemes, roots, derivation, inflection, compounding, and cliticization.
3. **Morphophonology** (pp. 29–33): how morphological and phonological structure interact, including alternations and rewrite-style descriptions.
4. **Morphosyntax** (pp. 35–52): grammatical functions and the morphology that marks tense, aspect, mood, negation, evidentiality, person, number, gender, case, definiteness, possession, and agreement.
5. **Syntax: Introduction** (pp. 53–55): grammaticality, syntactic structure, and the relationship between structure and interpretation.
6. **Parts of speech** (pp. 57–60): distributional categories and why part-of-speech categories vary across analyses and languages.
7. **Heads, arguments and adjuncts** (pp. 61–77): headed phrases, selection, argumenthood, adjuncts, and links to resources such as FrameNet and PropBank.
8. **Argument types and grammatical functions** (pp. 79–99): syntactic functions and the semantic roles or argument types they realize across languages.
9. **Mismatches between syntactic position and semantic roles** (pp. 101–122): passives, dative shift, expletives, raising, control, long-distance dependencies, and cross-linguistic causatives.
10. **Resources** (pp. 123–126): linguistic resources and databases useful for applying the preceding concepts.

Back matter includes examples/resources, bibliography, author biography, general index, and index of languages (pp. 127–166 in the Springer record).

## Chapter review

The publisher chapter pages are subscription previews, so no chapter is represented here as fully read. Chapters 1–9 are additionally informed by Dyer’s public ACL review, which discusses their arguments and examples; Chapter 10 is **TOC-only**. The “LLM 101 use” column is an original application assessment.

| Chapter | Evidence tier | Concept assessment and LLM 101 use |
|---|---|---|
| 1. Introduction/motivation | Public secondary review + publisher TOC | Establishes the case that structure improves feature design, error analysis, and multilingual robustness. Use a before/after analysis of a bag-of-words classifier and a structured error report; label the linguistic claim as a reason to inspect data, not a guarantee that a grammar is needed. |
| 2. Morphology: Introduction | Public secondary review + publisher TOC | Organizes word-internal meaning/function changes around roots, derivation, inflection, compounding, and clitics, with typologically varied examples. Add a tokenization lab contrasting English, an agglutinative language, and a clitic-rich example; connect segmentation choices to retrieval misses and vocabulary growth. |
| 3. Morphophonology | Public secondary review + publisher TOC | Shows that surface forms can vary when morphology meets sound/orthography and that competing formalisms imply different computational implementations. Use spelling/normalization examples and explain why a tokenizer can lose the relation between related forms; do not imply LLM tokenizers model phonology. |
| 4. Morphosyntax | Public secondary review + publisher TOC | Surveys grammatical functions marked by morphology, including tense/aspect, negation, evidentiality, case, possession, and agreement. Add a small agreement benchmark with counterexamples and dialect/language variation; use it to teach that fluency does not establish grammatical generalization. |
| 5. Syntax: Introduction | Public secondary review + publisher TOC | Introduces grammaticality and the idea that structural relations contribute to interpretation. Make a minimal-pair activity where learners change word order or attachment and predict extraction/answering failures; keep the activity observational rather than presenting one theory as universal. |
| 6. Parts of speech | Public secondary review + publisher TOC | Treats parts of speech as clusters of distributional regularities while acknowledging analytical variation. Use ambiguous words (“record,” “light”) to compare a tagger, an LLM explanation, and evidence from context; require learners to separate labels from justifications. |
| 7. Heads, arguments and adjuncts | Public secondary review + publisher TOC | Gives diagnostics for headed phrases, selection, arguments, and adjuncts and relates them to FrameNet/PropBank. Build an information-extraction schema that marks who did what to whom and records uncertain attachments; this directly strengthens LLM 101’s bounded extractive assistant. |
| 8. Argument types and grammatical functions | Public secondary review + publisher TOC | Separates syntactic function from semantic argument type and emphasizes cross-linguistic realization. Add a cross-language slot-filling comparison and test whether a prompt’s labels survive changes in word order or case marking. |
| 9. Mismatches between syntactic position and semantic roles | Public secondary review + publisher TOC | Uses passives, dative shift, expletives, raising, control, movement, and causatives to show that surface position is not a reliable proxy for “who did what.” Create adversarial extractive questions around passive and raising constructions; score exact evidence spans and explanations separately. |
| 10. Resources | TOC-only | The chapter’s title indicates a practical resource inventory, but the chapter text was not publicly accessible in the inspected source. LLM 101 should add a resource card for treebanks, FrameNet/PropBank, morphology tools, and language documentation, each with provenance, license, language coverage, and known annotation limits. |

## Recommendation for LLM 101

Use selected ideas from Chapters 1, 2, 4, 7, and 9 in short, audio-friendly lessons on tokenization, multilingual variation, extraction, and failure analysis. This supplement is especially useful for showing why an answer’s surface fluency is weak evidence of structural correctness. It should be paired with modern tokenizer and Transformer material because the 2013 book does not cover subword tokenization, contextual embeddings, attention, instruction tuning, or current LLM evaluation.

## Limitations

The accessible publisher record exposes the TOC and book description, while the ACL review gives a detailed but secondary account of Chapters 1–9. Chapter 10 is not represented as read. Edition metadata differs by platform (2013 original versus Springer’s 2022 eBook record); the syllabus’s citation is retained as 2013.
