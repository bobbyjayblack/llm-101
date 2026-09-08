# [BOOK] Jacob Eisenstein — Introduction to Natural Language Processing

## Identification and access

- Author: Jacob Eisenstein.
- Edition: first edition, MIT Press, October 1, 2019; hardcover ISBN 9780262042840 and eBook ISBN 9780262354578; 536 pages.
- Official publisher page and table of contents: [MIT Press](https://mitpress.mit.edu/9780262042840/introduction-to-natural-language-processing/).
- Public author-hosted draft: [November 13, 2018 PDF](https://cseweb.ucsd.edu/~nnakashole/teaching/eisenstein-nov18.pdf). This is the open-access manuscript associated with the published text; it is labeled as a draft and carries the author’s CC-BY-NC-ND notice.
- Evidence tier: the chapter notes below are **full-text draft reviews**. The draft was read for chapter purpose and teaching sequence. The publication page and official TOC were used to verify bibliographic details and chapter ordering.

## Table of contents and chapter review

The book is organized into four parts: Learning; Sequences and trees; Meaning; and Applications. The page numbers below are from the author-hosted draft and may differ slightly from the final typeset edition. Asterisks in the draft mark optional or more advanced sections; they are not omitted chapters.

### Part I — Learning

1. **Introduction** (p. 1). Frames NLP as the intersection of learning and knowledge, search and learning, and relational/compositional/distributional views. It is a useful orientation for lesson 1, *The model and the system*, because it keeps language software broader than a single generative model.
2. **Linear text classification** (p. 13). Develops bag-of-words, Naive Bayes, perceptrons, large-margin methods, logistic regression, regularization, gradients, and batch/online optimization. It deepens lessons 7–10 and suggests a valuable baseline lab before the existing nonlinear network.
3. **Nonlinear classification** (p. 47). Introduces feed-forward networks, activation and output choices, lookup layers, backpropagation, dropout, and convolutional networks. It maps directly to lesson 9, *Train a small neural network*, and could add a text-input example alongside the current numerical curve.
4. **Linguistic applications of classification** (p. 69). Uses sentiment and word-sense tasks to discuss feature choices, classifier evaluation, statistical significance, and dataset construction. It connects to lesson 10’s baselines and lesson 11, *Build a documented dataset*, especially the distinction between a score and evidence about a task.
5. **Learning without supervision** (p. 95). Covers clustering, expectation-maximization, semi-supervised learning, latent variables, and domain adaptation. It offers optional depth for lessons 9–12 and a way to explain why unlabeled pretraining and domain shift need separate evaluation; it is not a substitute for modern Transformer pretraining.

### Part II — Sequences and trees

6. **Language models** (p. 125). Covers n-gram models, smoothing/discounting, recurrent neural language models, backpropagation through time, held-out likelihood, perplexity, and out-of-vocabulary words. This is a direct extension of lesson 13, *Train a tiny language model*, and should inform a future lab that compares count models, RNN memory, and token/OOV policies.
7. **Sequence labeling** (p. 145). Presents structured prediction, Viterbi decoding, hidden Markov models, discriminative models, CRFs, and neural sequence labeling. It is optional background for the course’s data/evaluation units and would clarify why token-level tagging differs from next-token generation.
8. **Applications of sequence labeling** (p. 175). Applies sequence methods to part-of-speech tagging, morphosyntactic attributes, named entities, tokenization, code switching, and dialogue acts. Its tokenization chapter is particularly relevant to the missing explicit tokenization exercise in Unit 5; the other applications can remain optional.
9. **Formal language theory** (p. 191). Introduces regular, context-free, and mildly context-sensitive languages, finite-state devices, and grammar representations. It gives useful contrast for the lesson 3 claim that neural models operate over sequences, but it is outside the core LLM implementation path.
10. **Context-free parsing** (p. 225). Develops parsing algorithms, ambiguity, weighted grammars, probabilistic grammars, neural grammars, complexity, and reranking. It is optional structure/evaluation depth, with no direct requirement for the bounded extractive capstone.
11. **Dependency parsing** (p. 257). Models heads and dependents with graph- and transition-based algorithms and learning. It supports CS224N-style historical NLP context and can serve as an example of structured prediction, but it need not expand the current 30-lesson core.

### Part III — Meaning

12. **Logical semantics** (p. 285). Covers denotation, propositional and first-order logic, lambda calculus, quantification, and learning semantic parsers. It is a useful counterweight to treating fluent LLM text as formal reasoning; a small entailment/logic contrast could enrich Unit 12.
13. **Predicate-argument semantics** (p. 305). Introduces semantic roles, VerbNet/PropBank/FrameNet, semantic role labeling, constrained optimization, and Abstract Meaning Representation. It provides an optional structured-evidence vocabulary for the capstone.
14. **Distributional and distributed semantics** (p. 325). Explains distributional hypotheses, representation choices, LSA, Brown clusters, CBOW/skip-gram, embedding evaluation, fairness/bias, and compositional representations. This is a strong source for a proposed embedding-distance and bias-awareness lab in Unit 5 or Unit 9.
15. **Reference resolution** (p. 351). Covers referring expressions, coreference algorithms, mention/entity representations, and evaluation. It can deepen retrieval and document-context discussions, while the current lexical assistant does not implement coreference.
16. **Discourse** (p. 379). Treats segmentation, entities/reference, discourse relations, argumentation, and applications. It supports a future generated-answer evaluation track but should remain optional while the capstone returns authored evidence.

### Part IV — Applications

17. **Information extraction** (p. 403). Covers entity linking and ranking, relation and event extraction, hedges/denials/hypotheticals, question answering, and machine reading. This is directly relevant to Unit 9 and the extractive assistant: it suggests distinguishing evidence selection, extraction, and answer generation in the trace.
18. **Machine translation** (p. 431). Surveys task/data/evaluation choices, statistical translation, neural encoder-decoder models, attention, non-recurrent translation, OOV handling, decoding, and metric-targeted training. It gives historical context for attention and decoding in lesson 14 and Unit 8, but is not required for the English-only capstone.
19. **Text generation** (p. 457). Covers data-to-text, latent alignment, neural generation, abstractive summarization, sentence fusion, dialogue systems, decoding, and neural chatbots. The chapter’s treatment of extractive versus abstractive output is especially useful for making the current capstone boundary explicit and for scoping a future generative tutor as a separate option.

The draft also contains appendices on probability (p. 475), modeling and estimation (p. 453 in the contents ordering), bibliography, and index. These are supporting material rather than additional core chapters; the official publisher TOC should be consulted for the final pagination.

## Relevance to LLM 101

This is a broad NLP foundation text rather than an LLM-only book. The highest-value additions are Chapter 2’s interpretable linear baseline, Chapter 6’s language-model evaluation and OOV treatment, Chapter 8’s tokenization, Chapter 14’s embeddings and fairness, Chapter 17’s information extraction/QA, and Chapter 19’s extractive-versus-abstractive distinction. Together they give the course more explicit bridges from symbolic/feature-based methods to neural systems and make the bounded capstone’s design choices easier to defend.

The text predates the current Transformer/LLM wave in several places. Its neural language-model, attention, and generation sections provide historical mechanisms; they should be paired with the course’s Transformer and post-training references for modern decoder-only models, scaling, alignment, and serving. The author-hosted draft is openly readable under a noncommercial/no-derivatives license; the project should link and paraphrase rather than copy chapters.

## Sources and limits

1. [MIT Press official page](https://mitpress.mit.edu/9780262042840/introduction-to-natural-language-processing/) — publication data, scope, license, and publisher TOC link; accessed 2026-09-07.
2. [Author-hosted November 13, 2018 draft](https://cseweb.ucsd.edu/~nnakashole/teaching/eisenstein-nov18.pdf) — full readable manuscript, detailed contents, chapter text, exercises, and draft status; accessed 2026-09-07.
3. [MIT Press table-of-contents PDF](https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/11568/Toc.pdf?dl=1) — official chapter ordering and sections; accessed 2026-09-07.

The chapter review uses the accessible draft, not a claim that every final-edition sentence is identical. Technical methods and examples are dated to the manuscript/publication era and need current sources for modern model behavior.
