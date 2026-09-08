# *Deep Learning* — Goodfellow, Bengio, and Courville (2016)

## Bibliographic scope

- **Authors:** Ian Goodfellow, Yoshua Bengio, Aaron Courville.
- **Edition:** First edition, MIT Press, 2016; print ISBN 978-0-262-03561-3.
- **Why it appears in this research:** CMU 10-423/10-623 Generative AI (Fall 2024) assigns selected sections of Chapter 10 for its RNN language-model opening: §10.1–10.5 and §10.10–10.12. The CMU schedule also links the free online text. This is a companion reading, not the sole course textbook.
- **Accessible evidence:** Full chapter text is available at [deeplearningbook.org](https://www.deeplearningbook.org/), including [Chapter 10](https://www.deeplearningbook.org/contents/rnn.html), and the official [table of contents](https://www.deeplearningbook.org/contents/TOC.html). I reviewed the accessible web text and TOC on 2026-09-07. The book predates the 2017 Transformer and later LLM techniques, so modern connections below are applications/inferences rather than claims about what the 2016 text teaches.

## Table of contents

The chapter titles and sections below follow the publisher/author’s public TOC. Page numbers are the printed first-edition pages.

1. **Introduction** (p. 1): who should read the book; historical trends in deep learning.
2. **Linear Algebra** (p. 29): scalars/vectors/matrices/tensors; products; inverse and span; norms; special matrices; eigendecomposition; SVD; pseudoinverse; trace; determinant; PCA.
3. **Probability and Information Theory** (p. 51): probability foundations; random variables/distributions; marginal and conditional probability; chain rule; independence; moments; common distributions; Bayes’ rule; continuous variables; information theory; structured probabilistic models.
4. **Numerical Computation** (p. 78): overflow/underflow; conditioning; gradient-based optimization; constrained optimization; linear least squares.
5. **Machine Learning Basics** (p. 96): learning algorithms; capacity and overfitting; validation and hyperparameters; bias/variance; maximum likelihood; Bayesian statistics; supervised/unsupervised algorithms; SGD; building an algorithm; why deep learning is useful.
6. **Deep Feedforward Networks** (p. 164): XOR; gradient-based learning; hidden units; architecture design; backpropagation/differentiation; historical notes.
7. **Regularization for Deep Learning** (p. 224): norm penalties; constrained optimization; under-constrained problems; augmentation; noise robustness; semi-supervised and multitask learning; early stopping; parameter sharing; sparse representations; ensembles; dropout; adversarial training; tangent methods.
8. **Optimization for Training Deep Models** (p. 271): learning versus pure optimization; neural-network optimization challenges; basic algorithms; initialization; adaptive rates; approximate second-order methods; optimization strategies and meta-algorithms.
9. **Convolutional Networks** (p. 326): convolution; motivation; pooling; priors; variants; structured outputs; data types; efficient algorithms; random/unsupervised features; neuroscience and history.
10. **Sequence Modeling: Recurrent and Recursive Nets** (p. 367): unfolding computational graphs; RNNs; bidirectional RNNs; encoder-decoder sequence-to-sequence; deep recurrence; recursive nets; long-term dependencies; echo-state nets; multiple time scales; LSTM and gated RNNs; optimization for long dependencies; explicit memory.
11. **Practical Methodology** (p. 416): performance metrics; baselines; when to gather data; hyperparameters; debugging; multi-digit recognition example.
12. **Applications** (p. 438): large-scale deep learning; computer vision; speech recognition; natural language processing; other applications.
13. **Linear Factor Models** (p. 485): probabilistic PCA/factor analysis; ICA; slow feature analysis; sparse coding; manifold interpretation of PCA.
14. **Autoencoders** (p. 499): undercomplete and regularized autoencoders; capacity/depth; stochastic encoders/decoders; denoising and contractive autoencoders; manifold learning; predictive sparse decomposition; applications.
15. **Representation Learning** (p. 524): greedy layer-wise pretraining; transfer/domain adaptation; semi-supervised disentangling; distributed representation; gains from depth; clues to underlying causes.
16. **Structured Probabilistic Models for Deep Learning** (p. 555): unstructured-modeling challenge; graph structures; sampling; advantages of structure; dependency learning; inference; deep approaches to structured models.
17. **Monte Carlo Methods** (p. 587): sampling; importance sampling; MCMC; Gibbs sampling; mixing across separated modes.
18. **Confronting the Partition Function** (p. 603): log-likelihood gradient; stochastic maximum likelihood/contrastive divergence; pseudolikelihood; score/ratio matching; denoising score matching; noise-contrastive estimation; partition-function estimation.
19. **Approximate Inference** (p. 629): inference as optimization; EM; MAP and sparse coding; variational inference/learning; learned approximate inference.
20. **Deep Generative Models** (p. 651): Boltzmann machines; RBMs; deep belief/Boltzmann machines; real-valued, convolutional, structured/sequential variants; random-operation backpropagation; directed generative nets; sampling from autoencoders; generative stochastic networks; other schemes; evaluation; conclusion.

The official published TOC contains no separately numbered appendices: it ends with Chapter 20, followed by Bibliography and Index. Do not treat website supplements or other editions as additional chapters without edition-specific evidence.

## Chapter review and LLM 101 applications

The notes below are original chapter-level assessments based on the accessible full text. They describe what a learner can do with each chapter and where the 2016 scope needs a modern LLM supplement.

1. **Introduction.** Defines deep learning as representation learning with layered functions and situates it among AI, machine learning, and neuroscience. Use it for an audio timeline from hand-coded features to learned representations; add a dated Transformer/LLM epilogue because the historical cutoff predates them.
2. **Linear Algebra.** Builds the tensor and matrix operations behind embeddings, affine layers, projections, and PCA. LLM 101 can make this concrete with a tiny token-embedding table and a hand-worked matrix product; avoid letting notation obscure the conceptual point.
3. **Probability and Information Theory.** Supplies random variables, conditional probability, entropy, KL divergence, and structured models. Connect directly to next-token distributions, cross-entropy, perplexity, and calibration; add modern examples showing why probabilities are not truth scores.
4. **Numerical Computation.** Explains stable arithmetic, conditioning, gradients, and constrained optimization. A useful lab can show softmax overflow and the log-sum-exp fix, then connect it to stable transformer training and inference.
5. **Machine Learning Basics.** Covers generalization, likelihood, validation, SGD, and the design/debugging of learning algorithms. Use it to distinguish train/validation/test data, prompting versus parameter updates, and benchmark leakage; add an LLM-specific data-contamination example.
6. **Deep Feedforward Networks.** Derives gradient-based learning, hidden units, architecture choices, and backpropagation. Build a small character classifier or next-token MLP, then contrast its fixed receptive field with attention’s content-dependent routing.
7. **Regularization.** Surveys penalties, augmentation, dropout, early stopping, sharing, ensembles, and adversarial training. Apply the ideas to overfitting a tiny prompt/evaluation set and to adapter regularization; supplement with modern instruction-tuning and data-quality practices.
8. **Optimization.** Compares optimization algorithms, initialization, adaptive learning rates, second-order approximations, and meta-algorithms. Connect to Adam-style optimizer behavior and learning-rate schedules; explain that LLM training stability also depends on normalization, precision, batch size, and distributed systems absent from this chapter.
9. **Convolutional Networks.** Explains locality, translation equivariance, pooling, and efficient convolution. It is peripheral for text-only LLMs but valuable for multimodal context; use one comparison example (CNN local inductive bias versus transformer global attention) rather than a full CNN detour.
10. **Sequence Modeling.** Provides the most direct CMU bridge: recurrent computation, bidirectionality, encoder-decoder models, long-term dependencies, gated cells, and explicit memory. Reproduce a toy character-level RNN and show teacher forcing, then add a short modern bridge to self-attention, positional encodings, and why Transformers displaced RNNs at scale. CMU’s assigned sections are §10.1–10.5 and §10.10–10.12; §§10.6–10.9 are useful optional context.
11. **Practical Methodology.** Treats metrics, baselines, data collection, hyperparameters, and debugging as an experimental discipline. This maps directly to LLM 101’s capstone: define an extractive baseline, make a small held-out question set, inspect failures, and report changes in a reproducibility card.
12. **Applications.** Surveys large-scale learning, vision, speech, NLP, and other domains. Use it to show why an LLM is one component in a system; update the NLP section with tokenization, Transformers, retrieval, instruction tuning, and agent/tool boundaries.
13. **Linear Factor Models.** Presents PCA/factor analysis, ICA, slow features, sparse coding, and manifolds as latent-structure models. For LLM 101, use PCA on small embedding vectors as an interpretable visualization, while warning that low-dimensional projections do not prove semantic features.
14. **Autoencoders.** Covers reconstruction objectives, denoising, contractive regularization, and manifold representations. Link to representation learning and compression, but distinguish autoencoding from autoregressive next-token generation; an optional denoising lab can clarify the difference.
15. **Representation Learning.** Develops pretraining, transfer/domain adaptation, distributed representations, and disentangling. It gives useful vocabulary for pretrained versus adapted models; add today’s parameter-efficient fine-tuning, instruction tuning, and model-card documentation.
16. **Structured Probabilistic Models.** Explains graphs, dependencies, sampling, and approximate inference. Use it to motivate explicit state and provenance in retrieval systems; contrast a probabilistic graphical model’s declared structure with an LLM’s implicit learned dependencies.
17. **Monte Carlo Methods.** Covers importance sampling, MCMC, Gibbs sampling, and mixing. It is not required for a basic LLM 101 path, but a short “sampling is not reasoning” example can clarify temperature and stochastic decoding without conflating decoding with MCMC.
18. **Partition Function.** Develops methods for models whose normalization is difficult, including contrastive and score-based objectives. This helps advanced learners understand energy-based alternatives, but it is outside the core causal-LM route; label it optional and avoid implying that GPT training estimates a general partition function.
19. **Approximate Inference.** Frames inference as optimization and covers EM, MAP, variational methods, and learned inference. Connect to latent-variable and retrieval systems as an advanced extension; the core course can instead use a concrete top-k retrieval example and explain the approximation boundary.
20. **Deep Generative Models.** Surveys Boltzmann machines, RBMs, directed generative nets, sampling, and evaluation. It predates VAEs, GANs as mature practice, diffusion, and Transformers, so pair it with modern primary sources and explicitly mark which historical ideas survive in current systems (latent variables, likelihoods, sampling, evaluation).

## Recommended use in LLM 101

Use Chapters 1–6 and selected parts of 10–12 as a technical spine, with Chapters 7–8 and 11 as evaluation/debugging support. Treat 13–20 as optional history and theory. The largest missing bridge is the Transformer: add a learner-friendly attention derivation, positional encoding, tokenization, causal masking, and a tiny next-token implementation immediately after Chapter 10. Add modern readings/labs for scaling laws, data filtering, instruction tuning/RLHF, LoRA, retrieval-augmented generation, model evaluation, and safety. Keep the book’s stable mathematics, but mark every 2016-era architectural example as historical context.
