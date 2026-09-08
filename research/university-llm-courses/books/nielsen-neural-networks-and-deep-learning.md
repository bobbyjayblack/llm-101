# [BOOK] Michael Nielsen — Neural Networks and Deep Learning

## Identification and access

- Author: Michael A. Nielsen.
- Edition/status: 2015 online edition, Determination Press; the author’s site identifies the last update as December 26, 2019.
- Access: the author provides the complete six-chapter book online under a Creative Commons Attribution-NonCommercial 3.0 Unported license. The chapter links below are the primary reading sources.
- Official book site and contents: [neuralnetworksanddeeplearning.com](https://neuralnetworksanddeeplearning.com/).
- Citation and license information: [official about page](https://neuralnetworksanddeeplearning.com/about.html).

## Table of contents and chapter review

The six chapter reviews below are **full-text reviews**: each chapter is available on the author’s official site and was assessed for its concepts and teaching arc. The book is an introductory neural-network text centered on handwritten-digit classification; it predates Transformers and modern LLM training.

1. **Using neural nets to recognize handwritten digits** — [Chapter 1](https://neuralnetworksanddeeplearning.com/chap1.html). Introduces perceptrons, sigmoid units, network architecture, a small MNIST classifier, gradient descent, and an executable implementation. This is a strong model-to-code bridge for lesson 9, *Train a small neural network*, and could supply a second worked forward-pass example. It does not teach language modeling or tokenization.
2. **How the backpropagation algorithm works** — [Chapter 2](https://neuralnetworksanddeeplearning.com/chap2.html). Derives the four backpropagation equations, explains matrix/Hadamard notation, and connects the derivation to an efficient implementation. It deepens lesson 8, *Probability, loss, and gradients*, and lesson 9’s training loop. The notation needs an audio-first glossary and a small numerical check before learners read it aloud.
3. **Improving the way neural networks learn** — [Chapter 3](https://neuralnetworksanddeeplearning.com/chap3.html). Covers cross-entropy, overfitting, regularization, weight initialization, hyperparameter selection, and practical improvements to the MNIST code. It maps directly to lesson 10, *Generalization, baselines, and diagnosis*, and would support a lab comparing regularization or initialization rather than only label corruption.
4. **A visual proof that neural nets can compute any function** — [Chapter 4](https://neuralnetworksanddeeplearning.com/chap4.html). Gives an intuitive universality construction and then states caveats about what the theorem does and does not imply. It is useful optional mathematical depth after lessons 8–9, especially to prevent “universal approximator” from being treated as a claim of useful generalization. It is peripheral to the LLM path.
5. **Why are deep neural networks hard to train?** — [Chapter 5](https://neuralnetworksanddeeplearning.com/chap5.html). Explains vanishing and unstable gradients and other obstacles to optimization. It is a concrete missing bridge for lesson 15, *Batches, optimizers, and memory budgets*, where the current course discusses training state and scale but does not give a small gradient-stability experiment. A finite-depth toy comparison would keep the material runnable locally.
6. **Deep learning** — [Chapter 6](https://neuralnetworksanddeeplearning.com/chap6.html). Introduces convolutional networks, practical convolutional implementations, and a survey of later deep-learning directions. It supports lesson 25, *Autoencoders, GANs, and diffusion*, only as historical architecture context; it does not cover attention, Transformers, diffusion, or LLMs. Use it as optional breadth rather than as the main LLM text.

The official site also links an appendix, **Is there a simple algorithm for intelligence?**, plus exercises and code. These are supplemental resources, not numbered chapters; the appendix is useful for a critical discussion of what architecture demonstrations establish and what they do not.

## Relevance to LLM 101

The book is strongest for the foundations already represented by lessons 7–10: vectors and matrices, loss, gradient descent, forward passes, backpropagation, initialization, overfitting, and regularization. Its full-text code examples suggest a staged exercise design: first trace a scalar neuron, then verify one gradient numerically, then train a tiny network and inspect a failure. That structure can deepen the existing Unit 2 and Unit 3 labs without changing the audio-first interface.

It is not a current LLM textbook. It lacks tokenization, embeddings for language, attention, Transformers, pretraining, scaling, post-training, retrieval, and serving. Any project update should pair it with the SLP3/Transformer material and label the historical scope clearly.

## Sources and limits

1. [Official book site and chapter index](https://neuralnetworksanddeeplearning.com/) — full online text, chapter titles, exercises, code, and update/license information; accessed 2026-09-07.
2. [Official author/about page](https://neuralnetworksanddeeplearning.com/about.html) — bibliographic citation, scope, and license; accessed 2026-09-07.

The chapter assessment is based on the complete author-hosted text. It does not claim that the examples reproduce modern hardware or LLM practice. The book’s noncommercial license is separate from LLM 101’s project license; linking it does not grant rights to redistribute copied chapter text.
