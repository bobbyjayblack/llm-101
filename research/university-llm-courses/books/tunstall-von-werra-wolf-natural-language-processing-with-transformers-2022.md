# [BOOK] Tunstall, von Werra, and Wolf — Natural Language Processing with Transformers (revised color edition, 2022)

Research date: 2026-09-07

## Identification and relationship to Stanford CS224N

- Authors: Lewis Tunstall, Leandro von Werra, and Thomas Wolf; foreword by Aurélien Géron.
- Edition: revised color edition, O’Reilly Media, May 2022 (first edition February 2022; ISBN 9781098136789; 408 pages).
- Course relationship: Stanford CS224N Winter 2025 lists this title among useful reference texts and says none of its reference texts is required.
- [O’Reilly title page and contents preview](https://www.oreilly.com/library/view/natural-language-processing/9781098136789/).
- [O’Reilly copyright and revision history](https://www.oreilly.com/library/view/natural-language-processing/9781098136789/copyright-page01.html).
- [Official notebooks repository](https://github.com/nlp-with-transformers/notebooks).

This is a practical Hugging Face-oriented guide. Public publisher previews expose the TOC and selected sections; the authors’ repository exposes code but warns that some examples are no longer maintained. The chapter reviews below are therefore **TOC/companion/preview-based**, not a claim of reading every page of the paywalled book. The repository specifically warns that Chapter 7’s Haystack/Elasticsearch stack is obsolete and that TensorFlow examples may break under Keras 3.

## Table of contents

1. Hello Transformers
2. Text Classification
3. Transformer Anatomy
4. Multilingual Named Entity Recognition
5. Text Generation
6. Summarization
7. Question Answering
8. Making Transformers Efficient in Production
9. Dealing with Few to No Labels
10. Training Transformers from Scratch
11. Future Directions

The O’Reilly contents preview gives these chapter themes: pipelines and the Hugging Face ecosystem; a GitHub-issues classifier; Transformer internals; multilingual NER; text-generation decoding; CNN/DailyMail and SAMSum summarization; extractive QA; compression/quantization and production serving; weak/few-shot supervision; custom tokenizers and pretraining; and scaling, sparse attention, multimodality, and speech.

## Chapter review and LLM 101 mapping

1. **Hello Transformers — Preview/companion evidence.** Introduces encoder-decoder architecture, attention, transfer learning, pipelines, and the Hub/tokenizer/dataset/accelerate ecosystem. It is a strong practical on-ramp after LLM 101’s architecture lessons; adapt one small local model call while teaching what the pipeline hides. Limitation: APIs and hub workflows change quickly.
2. **Text Classification — Preview/companion evidence.** Builds a GitHub-issues tagger, starting with a Naive Bayes baseline, then fine-tuning a Transformer and using prompts, unlabeled data, and few-shot methods. This is an excellent evaluation structure for LLM 101: baseline, data slice, adaptation, and held-out test. Limitation: hosted-model and library assumptions need current replacements.
3. **Transformer Anatomy — Preview/companion evidence.** Opens the model stack to inspect tokenization, embeddings, attention, feed-forward layers, and model outputs. It pairs naturally with LLM 101’s narrated attention lab; retain the shape tracing and add a tiny JavaScript version. Limitation: implementation details are tied to the 2022 Transformers API.
4. **Multilingual Named Entity Recognition — Preview/companion evidence.** Demonstrates token classification across languages, subword alignment, and evaluation. Use it to show why tokenization and label alignment matter, and to add a multilingual evidence-extraction example. Limitation: GPU memory and dataset setup can overwhelm beginners; language coverage and model checkpoints need updating.
5. **Text Generation — Preview/companion evidence.** Explores autoregressive generation, GPT-2, sampling, decoding controls, and evaluation. This directly supports LLM 101’s generation unit and a controlled temperature/top-k comparison; pair every output with a factuality/provenance check. Limitation: 2022 model checkpoints and decoding guidance predate current reasoning and tool models.
6. **Summarization — Preview/companion evidence.** Compares GPT-2, T5, BART, and PEGASUS on CNN/DailyMail and SAMSum, then fine-tunes and evaluates summaries with ROUGE and related measures. Add a source-grounded summary lab that scores omission, contradiction, and citation coverage separately from overlap. Limitation: benchmark and model choices are dated, and automatic metrics alone are insufficient.
7. **Question Answering — Preview/companion evidence.** Covers extractive QA and a Haystack/Elasticsearch pipeline. It is directly relevant to LLM 101’s bounded extractive assistant and suggests a useful separation of retrieval, span selection, and response formatting. Limitation: the authors’ official repository says this chapter’s Haystack 0.9/1.4 and Elasticsearch 7.x stack is no longer maintained and conflicts with current Python/pydantic environments; use it as architecture history and rewrite the lab.
8. **Making Transformers Efficient in Production — Preview/companion evidence.** Addresses model-size/latency tradeoffs, distillation, quantization, pruning, and deployment patterns. It can enrich LLM 101’s systems unit with a small latency/quality budget exercise and explicit local-device constraints. Limitation: serving stacks and hardware have moved substantially since 2022, so current runtime documentation is required.
9. **Dealing with Few to No Labels — Preview/companion evidence.** Uses weak supervision, data augmentation, embeddings, prompting, and fine-tuning to work under label scarcity. This fits LLM 101’s small-data and evaluation lessons; add an experiment comparing authored labels, pseudo-labels, and abstention. Limitation: prompt APIs and parameter-efficient methods have evolved beyond the book’s examples.
10. **Training Transformers from Scratch — Preview/companion evidence.** Walks through large corpora, custom code data, tokenizer training, dataloaders, objectives, training loops, and analysis. It is the closest practical companion to CS336’s end-to-end perspective; for LLM 101, shrink it to a transparent corpus and tiny model with a compute ledger. Limitation: scaling assumptions and distributed tooling are introductory and dated.
11. **Future Directions — Preview/companion evidence.** Surveys scaling laws, sparse/linear attention, and multimodal Transformers for vision, tables, and speech. It provides a useful menu for optional LLM 101 extensions and audio-first connections. Limitation: as a 2022 forecast it cannot cover current multimodal, agentic, or post-training practice without a dated supplement.

## Assessment for LLM 101

The book offers a valuable bridge from conceptual Transformer explanations to reproducible application workflows. Borrow its repeated pattern—inspect a baseline, prepare a dataset, fine-tune or prompt, evaluate, and analyze failure cases—for LLM 101 labs. The strongest direct matches are Chapters 3, 5, 7, 8, and 10. Use its Chapter 7 architecture only after replacing deprecated dependencies, and keep hosted-Hub/GPU requirements optional for the audio-first course.

LLM 101 should add current library/API notes, a no-GPU path, retrieval provenance, abstention, safety and privacy checks, and explicit comparisons among prompting, fine-tuning, and post-training. The book’s chapter order also suggests a practical track alongside the theory track: model anatomy → one application → generation/evaluation → retrieval → efficiency → from-scratch mini-model.

## Sources and limitations

1. [O’Reilly title page](https://www.oreilly.com/library/view/natural-language-processing/9781098136789/) — authors, revised-edition date, page count, and contents preview; accessed 2026-09-07.
2. [O’Reilly copyright/revision page](https://www.oreilly.com/library/view/natural-language-processing/9781098136789/copyright-page01.html) — edition and revision metadata; accessed 2026-09-07.
3. [Official notebooks repository](https://github.com/nlp-with-transformers/notebooks) — example code and explicit maintenance warnings; accessed 2026-09-07.
4. [Stanford CS224N Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) — lists the book as a useful, non-required reference; accessed 2026-09-07.

The TOC and chapter assessments use publisher previews and the official companion repository. No copyrighted chapter text is reproduced, and no claim is made that every chapter was read in full.
