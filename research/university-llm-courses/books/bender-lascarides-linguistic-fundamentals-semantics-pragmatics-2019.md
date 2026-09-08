# *Linguistic Fundamentals for Natural Language Processing II: 100 Essentials from Semantics and Pragmatics* (2019)

## Bibliographic and course scope

- **Authors:** Emily M. Bender and Alex Lascarides.
- **Edition:** First edition, 2019, Synthesis Lectures on Human Language Technologies #43. Original Morgan & Claypool print ISBN 978-1-68173-073-8; Springer’s current record lists softcover ISBN 978-3-031-01044-6 (published 2019) and eBook ISBN 978-3-031-02172-5 (2022 platform edition), with copyright information recorded as 2020.
- **Why it appears here:** MIT 24.S90’s Fall 2024 syllabus lists this as an optional technical supplement. No chapters are required by that syllabus.
- **Sources and access date:** [Springer bibliographic/TOC record](https://link.springer.com/book/10.1007/978-3-031-02172-5), [author’s public ACL tutorial based on the draft](https://faculty.washington.edu/ebender/100things-sem_prag.html), [LINGUIST List review](https://linguistlist.org/issues/32/1088/), and [University of Edinburgh record](https://www.research.ed.ac.uk/en/publications/linguistic-fundamentals-for-natural-language-processing-ii-100-es/), checked 2026-09-07.

## Table of contents

The publisher’s record lists the following fourteen numbered content chapters (plus front matter and back matter). Page ranges are from the first-edition record.

1. **Introduction** (pp. 1–3)
2. **What is Meaning?** (pp. 5–30)
3. **Lexical Semantics: Overview** (pp. 31–33)
4. **Lexical Semantics: Senses** (pp. 35–54)
5. **Semantic Roles** (pp. 55–62)
6. **Collocations and Other Multiword Expressions** (pp. 63–72)
7. **Compositional Semantics** (pp. 73–94)
8. **Compositional Semantics beyond Predicate-Argument Structure** (pp. 95–105)
9. **Beyond Sentences** (pp. 107–121)
10. **Reference Resolution** (pp. 123–135)
11. **Presupposition** (pp. 137–149)
12. **Information Status and Information Structure** (pp. 151–162)
13. **Implicature and Dialogue** (pp. 163–175)
14. **Resources** (pp. 177–185)

Back matter runs pp. 187–250 and includes bibliography, biographies, and indexes. The public ACL tutorial groups the book’s ideas into six accessible themes: meaning, lexical semantics, phrase composition, meaning beyond the sentence, presupposition/implicature, and resources.

## Chapter review

Springer chapter pages expose titles, page ranges, author metadata, and subscription-preview status; the inspected pages did not expose the full text. Chapters 1–14 therefore carry **publisher TOC + public tutorial/secondary review** evidence, rather than a claim of full-text reading. The LLM 101 applications are original assessments grounded in those public descriptions. The chapter mapping follows the publisher’s edition-specific TOC.

| Chapter | Evidence tier | Concept assessment and LLM 101 use |
|---|---|---|
| 1. Introduction | Publisher TOC + public tutorial | Frames semantics and pragmatics as necessary for NLP systems that interpret and produce language in context. Open LLM 101’s evaluation unit with the distinction between a well-formed response and an appropriate/useful response. |
| 2. What is Meaning? | Publisher TOC + tutorial/review | Separates sentence meaning from speaker/utterance meaning and relates formal meaning to inference, common ground, and communicative goals. Use an ambiguity probe where the same prompt supports multiple intentions; require the learner to state which evidence resolves it. |
| 3. Lexical Semantics: Overview | Publisher TOC + tutorial/review | Maps levels of lexical meaning and motivates precise representations for NLP. Add a “word versus use” exercise with polysemous terms and retrieval evidence; explain why embedding similarity is an incomplete account of meaning. |
| 4. Lexical Semantics: Senses | Publisher TOC + tutorial/review | Examines senses, polysemy, lexical relations, and how context chooses an interpretation. Build a sense-disambiguation benchmark from the project’s bounded documents and compare a context-free lookup with an LLM answer that cites a span. |
| 5. Semantic Roles | Publisher TOC + tutorial/review | Organizes who did what to whom through roles and links roles to extraction and inference. Add role-labeled answer checks for active/passive alternations, with explicit “unknown” when a document does not state a role. |
| 6. Collocations and Other Multiword Expressions | Publisher TOC + tutorial/review | Treats idioms/collocations as partly conventionalized units whose meaning and flexibility vary. Add phrase-boundary and idiom examples to tokenization/retrieval lessons; warn that literal composition can produce confident nonsense. |
| 7. Compositional Semantics | Publisher TOC + tutorial/review | Develops predicate–argument composition, logical forms, scope, quantifiers, negation, and related sentence-level interpretation, with links to distributional approaches. Use a small truth-condition exercise and an LLM comparison that distinguishes logical entailment from plausible continuation. |
| 8. Compositional Semantics beyond Predicate-Argument Structure | Publisher TOC + tutorial/review | Extends composition to phenomena such as coordination, comparison, and other structures that simple predicate–argument templates miss. Create a benchmark with conjunction, comparison, and quantifier scope; score each interpretation against annotated alternatives. |
| 9. Beyond Sentences | Publisher TOC + tutorial/review | Moves from sentence meaning to discourse coherence and context, including discourse relations and interaction. Add a two-document context lab where learners identify which claims are supported, contradicted, or unrelated before asking an LLM. |
| 10. Reference Resolution | Publisher TOC + tutorial/review | Connects referring expressions to discourse entities and discusses grammatical/semantic cues for antecedent choice. Extend the extractive assistant with coreference-aware evidence windows and a test where pronouns cross sentence boundaries. |
| 11. Presupposition | Publisher TOC + tutorial/review | Distinguishes presupposed content from entailment and assertion, with triggers that survive under negation or questioning. Add a “what the prompt assumes” checklist to prevent an assistant from presenting presuppositions as sourced facts. |
| 12. Information Status and Information Structure | Publisher TOC + tutorial/review | Addresses how discourse packages given/new, topic/focus, and related information-status distinctions. Use answer-generation prompts that mark the question focus and compare whether the retrieved span supplies new evidence or repeats the premise. |
| 13. Implicature and Dialogue | Publisher TOC + tutorial/review | Covers conversational versus conventional implicature, Gricean reasoning, indirect meaning, dialogue, and interactional context. Add a lab where learners identify a response’s literal content, likely implication, and evidence; explicitly allow “no safe inference.” |
| 14. Resources | Publisher TOC + tutorial/review | Catalogues resources for lexical meaning, syntax, discourse, and annotated data. Make a project resource card with dataset purpose, language/domain coverage, annotation scheme, license, and known bias; connect resource selection to evaluation validity. |

## Recommendation for LLM 101

This is the strongest MIT supplement for explaining why LLM output should be checked against context and communicative intent. Use Chapters 2, 4–7, 9–13 around lessons on grounding, extraction, ambiguity, dialogue, and hallucination. Pair it with explicit prompt/output examples and a bounded evidence protocol. The book does not provide a modern LLM engineering path, so it needs companion coverage of tokenization, Transformer attention, decoding, retrieval, and model/version drift.

## Limitations

The publisher marks the volume as subscription content and only exposes metadata/TOC in the inspected public pages. The tutorial and independent review support the thematic assessments but are secondary sources; no chapter is claimed as fully read. Publication metadata varies between the original 2019 Morgan & Claypool release and Springer’s 2020/2022 records; the course’s 2019 citation is retained.
