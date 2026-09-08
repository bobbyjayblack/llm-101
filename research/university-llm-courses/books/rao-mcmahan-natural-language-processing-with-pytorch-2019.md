# [BOOK] Rao and McMahan — Natural Language Processing with PyTorch (2019)

Research date: 2026-09-07

## Identification and relationship to Stanford CS224N

- Authors: Delip Rao and Brian McMahan.
- Edition: first edition, O’Reilly Media, February 2019 (ISBN 9781491978221; 254–256 pages depending on catalog metadata).
- Course relationship: Stanford CS224N Winter 2025 lists this title among useful reference texts and says none of its reference texts is required.
- [O’Reilly title page and contents preview](https://www.oreilly.com/library/view/natural-language-processing/9781491978221/).
- [Publisher copyright/revision page](https://www.oreilly.com/library/view/natural-language-processing/9781491978221/copyright-page01.html).
- [Authors’ companion repository](https://github.com/delip/PyTorchNLPBook), which exposes notebooks and a chapter outline.

The book is an applied, code-first introduction to neural NLP using the PyTorch APIs of its 2019 release. O’Reilly exposes chapter contents and selected text, while the companion repository exposes runnable examples; neither is evidence that the entire copyrighted book is freely readable. Chapter reviews below therefore identify evidence as **preview/companion** and avoid claiming a complete close reading.

## Table of contents

1. Introduction
2. A Quick Tour of Traditional NLP
3. Foundational Components of Neural Networks
4. Feed-forward Networks for Natural Language Processing
5. Embedding Words and Types
6. Sequence Modeling for Natural Language Processing
7. Intermediate Sequence Modeling for Natural Language Processing
8. Advanced Sequence Modeling for Natural Language Processing
9. Classics, Frontiers, and Next Steps

The companion repository’s outline adds the main practical examples: PyTorch basics; traditional token and POS/NER concepts; perceptron/MLP/CNN surname classification; pretrained and CBOW embeddings; sequence representations and surname generation; sequence-to-sequence, attention, and neural machine translation. The O’Reilly preview also lists exercises, summaries, and references for chapters.

## Chapter review and LLM 101 mapping

1. **Introduction — Preview/companion evidence.** Establishes supervised learning, one-hot/TF/TF-IDF representations, computational graphs, tensors, and CUDA tensors. It is a good bridge from classical features to learnable representations; LLM 101 could adapt the tensor and vocabulary setup into an audio-described “same text, different representation” lab. Limitation: 2019 PyTorch installation/API guidance is dated and the publicly visible material is a preview.
2. **A Quick Tour of Traditional NLP — Preview/companion evidence.** Surveys corpora, tokens/types, n-grams, lemmas/stems, POS tagging, chunking, named entities, syntax, and word meaning. Use it to give learners a compact map of NLP before LLMs and to motivate tokenization and extraction; pair with an authored corpus that learners can inspect. Limitation: the survey predates current subword and instruction-tuned practice and is not a modern LLM treatment.
3. **Foundational Components of Neural Networks — Preview/companion evidence.** Builds perceptrons, activation functions, softmax, loss, gradient-based training, evaluation splits, hyperparameters, and regularization. This supports LLM 101’s math and training units through small numeric examples; a tiny sentiment classifier can make loss and overfitting concrete. Limitation: chapter content and code target older PyTorch conventions; full text is not publicly accessible.
4. **Feed-forward Networks for NLP — Preview/companion evidence.** Extends the perceptron to MLPs and CNNs and demonstrates surname classification with PyTorch datasets, vectorizers, and data loaders. It gives a useful staged project structure and a clear contrast between local convolution and later sequence models. LLM 101 can reuse its dataset/vectorizer pattern for a bounded classifier lab, but should explain why this is not a causal language model.
5. **Embedding Words and Types — Preview/companion evidence.** Covers pretrained embeddings, continuous bag-of-words, and transfer learning with embeddings. This maps to LLM 101’s representation and retrieval foundations; add a nearest-neighbor/bias inspection and compare static vectors with contextual Transformer representations. Limitation: today’s embedding APIs, model sizes, and tokenizer behavior require supplements.
6. **Sequence Modeling for NLP — Preview/companion evidence.** Introduces representing variable-length sequences and recurrent sequence prediction, using a surname dataset as a manageable generative example. The progression makes hidden state and sampling tangible; LLM 101 can use it as historical scaffolding before attention. Limitation: RNN-first presentation is no longer the default engineering path for LLMs.
7. **Intermediate Sequence Modeling for NLP — Preview/companion evidence.** Builds conditioned and unconditioned surname generation from sequence representations. This is a safe, small example of generation, conditioning, vocabulary handling, and sampling; adapt it to let learners compare prompt-conditioned and unconditional outputs. Limitation: the example domain is narrow and the implementation predates modern decoding and Transformer tooling.
8. **Advanced Sequence Modeling for NLP — Preview/companion evidence.** Covers packed sequences, encoder-decoder models, attention, and neural machine translation, with a vectorization pipeline and training routine. It supplies the conceptual predecessor to Transformer attention and a useful translation lab; LLM 101 can include one attention alignment visualization. Limitation: it does not cover self-attention, large-scale pretraining, RAG, or post-training.
9. **Classics, Frontiers, and Next Steps — Preview/companion evidence.** Surveys dialogue, discourse, information extraction, document analysis/retrieval, production NLP design patterns, and future directions. It can seed LLM 101’s application-systems and evaluation units, especially by connecting model output to production constraints. Limitation: this 2019 “frontier” predates the current LLM ecosystem, so its deployment and model references require a dated update.

## Assessment for LLM 101

The book’s strongest contribution is a coherent path from tensors and traditional features to complete, inspectable PyTorch applications. LLM 101 can borrow its vocabulary/vectorizer/data-loader pattern, staged experiments, and small generative examples while preserving its own plain-browser and audio-first constraints. A useful adaptation is a three-stage lab: TF-IDF baseline → tiny embedding classifier → tiny causal next-token model, with the same held-out examples and an explicit evaluation worksheet.

The book should be treated as a code-pattern reference rather than a current LLM textbook. Add Transformer self-attention, tokenization tradeoffs, scaling/data quality, RAG provenance, instruction tuning, preference methods, safety, and current library versions. Keep old code in a dated optional appendix or translate concepts into dependency-light JavaScript demonstrations.

## Sources and limitations

1. [O’Reilly title page](https://www.oreilly.com/library/view/natural-language-processing/9781491978221/) — authors, date, publisher, contents preview; accessed 2026-09-07.
2. [O’Reilly copyright/contents page](https://www.oreilly.com/library/view/natural-language-processing/9781491978221/copyright-page01.html) — first-edition metadata and chapter preview; accessed 2026-09-07.
3. [Google Books record](https://books.google.com/books/about/Natural_Language_Processing_with_PyTorch.html?id=Gh-EDwAAQBAJ) — chapter list and pagination; accessed 2026-09-07.
4. [Official companion repository](https://github.com/delip/PyTorchNLPBook) — chapter outline and runnable examples; accessed 2026-09-07.
5. [Stanford CS224N Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) — lists the book as a useful, non-required reference; accessed 2026-09-07.

The chapter assessments are original summaries based on public publisher previews and the companion outline. The full book was not claimed as freely readable or read line by line; no copyrighted chapter prose is reproduced.
