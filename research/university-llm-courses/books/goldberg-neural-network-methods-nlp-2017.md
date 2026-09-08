# [BOOK] Yoav Goldberg — Neural Network Methods for Natural Language Processing

## Identification and distinction from the primer

- Author: Yoav Goldberg.
- Edition: first edition, Morgan & Claypool / Springer Synthesis Lectures on Human Language Technologies, 2017; print ISBN 978-3-031-01037-8 and online ISBN 978-3-031-02165-7.
- Official publisher records: [Springer book page](https://link.springer.com/book/10.1007/978-3-031-02165-7) and [Morgan & Claypool catalog](https://www.morganclaypoolpublishers.com/catalog_orig/product_info_cpath-22-products_id-1056.html).
- The Stanford CS224N reference label should be checked against the archived page. Goldberg’s 2015 work titled *A Primer on Neural Network Models for Natural Language Processing* is a distinct 76-page draft/tutorial ([author PDF](https://u.cs.biu.ac.il/~yogo/nnlp.pdf), [arXiv record](https://arxiv.org/abs/1510.00726)). This dossier covers the 2017 book *Neural Network Methods for Natural Language Processing* and does not conflate the two.
- Evidence tier: Springer exposes chapter titles, page ranges, abstracts for some chapters, and subscription-gated previews. The chapter notes below are **publisher-TOC/abstract reviews**, with no claim of reading subscription-only full chapters. The separate 2015 primer is full-text accessible but is not silently substituted for the book.

## Table of contents and chapter review

The 2017 book has four parts and 21 numbered content chapters: an Introduction followed by 20 named chapters, plus front matter. The publisher’s TOC and description establish the sequence; chapter URLs are included where Springer provides them.

### Introduction

1. **Introduction** (pp. 1–9) — **publisher chapter page/preview tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_1)). Positions neural NLP as a move from sparse symbolic features to dense representations and previews the computation-graph approach. It bridges LLM 101’s data/representation orientation to its learned-model units.

### Part I — Supervised Classification and Feed-forward Neural Networks

2. **Learning Basics and Linear Models** (pp. 13–35) — **publisher abstract tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_2)). Establishes supervised-learning terminology and linear/log-linear binary and multiclass classification. It supports Unit 2’s numerical foundations and Unit 3’s baseline comparison.
3. **From Linear Models to Multi-layer Perceptrons** (pp. 37–39) — **TOC tier**. Shows the transition from linear prediction to layered nonlinear computation. Use as a short conceptual bridge before lesson 9’s network; no full chapter text was publicly available in the source consulted.
4. **Feed-forward Neural Networks** (pp. 41–49) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_4)). Covers feed-forward architectures in the book’s supervised-learning progression. It reinforces the current small-network lab, but the subscription page did not expose chapter text for a more detailed claim.
5. **Neural Network Training** (pp. 51–61) — **TOC tier**. Applies computation graphs and training procedures to neural models. It maps to backpropagation and optimization in lessons 8–9; exact derivation coverage remains unverified without subscription access.

### Part II — Working with Natural Language Data

6. **Features for Textual Data** (pp. 65–76) — **publisher abstract tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_6)). Explains converting discrete language sequences into numerical vectors and the role of feature representation. This directly motivates an explicit tokenization/representation lab before the current count model.
7. **Case Studies of NLP Features** (pp. 77–87) — **TOC tier**. Supplies applied feature examples; useful for showing how a modeling result depends on representation choices, but the chapter’s particular cases were not accessible.
8. **From Textual Features to Inputs** (pp. 89–103) — **TOC tier**. Links engineered features to neural input layers. It can deepen lesson 3 and Unit 5’s representation story; chapter details remain behind the publisher access boundary.
9. **Language Modeling** (pp. 105–113) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_9)). Introduces neural language-model framing within the feature-to-input progression. It is relevant to lesson 13’s count model as a historical neural contrast, but the source did not expose full chapter text.
10. **Pre-trained Word Representations** (pp. 115–134) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_10)). Covers pretrained word representations according to the official TOC. It supports an embedding comparison in Units 5 or 9; model details need a current source.
11. **Using Word Embeddings** (pp. 135–140) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_11)). Applies embedding vectors to downstream NLP. It provides a clear candidate for a cosine-similarity and retrieval exercise, while avoiding the claim that static embeddings behave like contextual Transformer states.
12. **Case Study: A Feed-forward Architecture for Sentence Meaning Inference** (pp. 141–145) — **TOC tier**. Shows a concrete sentence-level application of the preceding representations. It could supply a bounded evidence-classification example, but chapter text was not accessible.

### Part III — Specialized Architectures

13. **Ngram Detectors: Convolutional Neural Networks** (pp. 151–162) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_13)). Introduces one-dimensional convolutions for local n-gram patterns. It is optional historical context for Unit 11 and could motivate a tiny receptive-field lab.
14. **Recurrent Neural Networks: Modeling Sequences and Stacks** (pp. 163–175) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_14)). Covers recurrent processing of sequences/stacks. It gives a useful pre-Transformer comparison for lessons 13–14, but chapter text was not available to verify equations or implementation details.
15. **Concrete Recurrent Neural Network Architectures** (pp. 177–184) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_15)). Surveys concrete RNN designs. Use only as optional architecture history; no subscription chapter text was read.
16. **Modeling with Recurrent Networks** (pp. 185–193) — **TOC tier** ([chapter](https://link.springer.com/chapter/10.1007/978-3-031-02165-7_16)). Applies recurrent models to sequence tasks. It can contrast recurrence with causal self-attention, but detailed content remains inaccessible in the public source.
17. **Conditioned Generation** (TOC-listed in Part IV) — **TOC tier**. Covers generation conditioned on an input sequence or representation. It is relevant to the future generative-tutor option, not the present extractive capstone; exact page and chapter text should be verified against an accessible institutional copy.

### Part IV — Additional Topics

18. **Modeling Trees with Recursive Neural Networks** — **TOC tier**. Extends composition to tree-structured inputs. It is optional historical context for structured language representations and is outside the current lesson sequence.
19. **Structured Output Prediction** — **TOC tier**. Addresses outputs with dependencies rather than independent labels. It could deepen Unit 12’s evaluation framing, but no public chapter text was available for a detailed assessment.
20. **Cascaded, Multi-task and Semi-supervised Learning** — **TOC tier**. Surveys combining task stages, tasks, and labeled/unlabeled data. It maps to future multi-task or data-efficiency examples and remains optional for LLM 101.
21. **Conclusion** — **TOC tier**. Summarizes the neural-NLP progression and its open prospects. It is useful for a dated historical perspective, not a modern LLM roadmap.

The publisher’s catalog also lists bibliography and author biography. The numbered content sequence is Introduction plus 20 named chapters; publisher navigation may display front matter alongside those chapters. This distinction avoids treating front matter as a technical chapter.

## Relevance to LLM 101

The book’s strongest contributions are the representation-to-model bridge: linear baselines, computation graphs, textual feature extraction, language modeling, pretrained embeddings, and the historical path from CNN/RNN to conditioned generation. Those topics support lessons 7–14 and a proposed Unit 5 embedding/tokenization lab. They also offer a principled explanation of what static word representations cannot establish about current contextual LLMs.

The 2017 publication predates today’s decoder-only Transformer practice, instruction tuning, large-scale pretraining, RAG, and modern alignment. It should be paired with current Transformer and LLM sources. The 2015 *Primer* is a separate, accessible tutorial; if the final course source explicitly names that title instead, create a separate dossier rather than merging it into this book.

## Sources and limits

1. [Springer official book page](https://link.springer.com/book/10.1007/978-3-031-02165-7) — publication data, official TOC, chapter page links, and book overview; accessed 2026-09-07.
2. [Morgan & Claypool official catalog](https://www.morganclaypoolpublishers.com/catalog_orig/product_info_cpath-22-products_id-1056.html) — ISBNs, 2017 publication data, complete contents, scope, and publisher review; accessed 2026-09-07.
3. [Goldberg’s distinct 2015 Primer PDF](https://u.cs.biu.ac.il/~yogo/nnlp.pdf) and [arXiv record](https://arxiv.org/abs/1510.00726) — identity, date, scope, and distinction from the 2017 book; accessed 2026-09-07.

Springer chapter pages are subscription previews. This dossier therefore labels most chapter claims at TOC tier and does not claim to have read inaccessible full chapters. No paywall was bypassed and no copyrighted chapter text is reproduced.
