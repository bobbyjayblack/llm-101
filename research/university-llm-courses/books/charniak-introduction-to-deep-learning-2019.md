# [BOOK] Eugene Charniak — Introduction to Deep Learning

## Identification and access

- Author: Eugene Charniak.
- Edition: illustrated reprint, MIT Press, January 29, 2019, ISBN 9780262039512; 192 pages.
- Official publisher record: [MIT Press book page](https://mitpress.ublish.com/book/introduction-to-deep-learning).
- Public bibliographic/preview record: [Google Books](https://books.google.com/books/about/Introduction_to_Deep_Learning.html?id=LrT4DwAAQBAJ).
- Status: the publisher page and Google Books expose the contents and book description; Google Books labels the volume as limited preview. The full book was not treated as publicly accessible for this review.

## Table of contents and chapter review

The seven chapter assessments below are **TOC plus publisher/limited-preview reviews**. They summarize the public descriptions and chapter titles; they do not claim to have read chapters that are behind the publisher’s or Google Books’ access limits. MIT Press says the book teaches through TensorFlow programs, projects, exercises, and references, and names the major architecture families covered.

1. **Feed-Forward Neural Nets** (starts p. 1) — **TOC/publisher description**. Establishes the basic feed-forward network and the terminology needed for later code. It can reinforce lessons 7–9, especially the shape, forward-pass, and optimization explanations. The public source does not expose enough chapter text to assess every derivation or implementation choice.
2. **TensorFlow** (starts p. 29) — **TOC/publisher description**. Introduces TensorFlow and its Python interface as the implementation environment. LLM 101 deliberately uses plain JavaScript and Node labs, so this chapter is useful for discussing framework abstractions and tensor execution but should not be copied as a setup dependency. A small “framework versus scalar reference” comparison could clarify what a library automates.
3. **Convolutional Neural Networks** (starts p. 51) — **TOC/publisher description**. Covers convolutional architectures for vision. It gives optional context for lesson 25’s image-generation unit and lesson 26’s video-restoration discussion; the current course does not implement a CNN lab, so any addition should remain a compact receptive-field exercise.
4. **Word Embeddings and Recurrent NNs** (starts p. 71) — **TOC/publisher description**. Connects distributed word representations with recurrent sequence models. This is a useful bridge after lesson 13, *Train a tiny language model*, because the current count model has no embedding representation and only one-token history. An embedding-distance or recurrent-memory toy example would make that transition concrete, while explaining that decoder-only Transformers supersede RNNs for the main LLM path.
5. **Sequence-to-Sequence Learning** (starts p. 95) — **TOC/publisher description**. Introduces encoder-decoder sequence transformation, relevant to translation and other conditional generation tasks. It is comparative background for lessons 13–14 and 24, but it is outside the current bounded extractive capstone; adding it should be optional unless a future generative tutor is approved.
6. **Deep Reinforcement Learning** (starts p. 113) — **TOC/publisher description**. Covers deep RL concepts and reward-driven learning. It can provide historical context for lesson 18, *Preferences, rewards, and distillation*, but LLM 101 currently teaches preference/alignment concepts without training an RL agent. A paper-and-numbers reward-loop exercise is safer than implying full RL training is in scope.
7. **Unsupervised Neural-Network Models** (starts p. 137) — **TOC/publisher description**. Surveys unsupervised representation-learning models. It can deepen lesson 24, *Autoencoders, GANs, and diffusion*, by separating reconstruction or representation objectives from supervised labels. The public TOC and publisher summary do not support a more granular chapter claim.

The public record also lists **References and Further Readings** (p. 157), selected-exercise answers (p. 159), bibliography (p. 165), and index (p. 169). These are supporting matter, not additional chapters.

## Relevance to LLM 101

Charniak’s project-driven framing is a useful structural model for the course: each chapter reportedly includes a programming project and exercises, and the book requires Python plus linear algebra, multivariate calculus, and probability/statistics. LLM 101 can borrow the pattern by adding one small, inspectable implementation checkpoint to Units 2–5 while keeping the current browser/Node runtime and complete spoken text alternative.

The book is a 2019 fundamentals text rather than a modern LLM systems guide. It does not supply the current course’s Transformer attention, large-scale pretraining, scaling laws, parameter-efficient adaptation, retrieval, evaluation, or production-serving coverage. Its TensorFlow examples should be treated as historical framework context; use JavaScript reference calculations or optional Python notebooks if a future implementation track is approved.

## Sources and limits

1. [MIT Press official book page](https://mitpress.ublish.com/book/introduction-to-deep-learning) — author, ISBN, publication details, scope, and official table of contents; accessed 2026-09-07.
2. [MIT Press catalog page](https://mitpress.mit.edu/9780262039512/introduction-to-deep-learning/) — publisher description and additional-materials link; accessed 2026-09-07.
3. [Google Books bibliographic and limited-preview record](https://books.google.com/books/about/Introduction_to_Deep_Learning.html?id=LrT4DwAAQBAJ) — page starts, contents, length, publication data, and public preview metadata; accessed 2026-09-07.

No paywall or access control was bypassed. The chapter reviews remain deliberately at TOC/publisher-description granularity; they should not be presented as full-text reading notes.
