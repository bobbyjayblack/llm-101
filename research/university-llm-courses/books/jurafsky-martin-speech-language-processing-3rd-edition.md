# [BOOK] Jurafsky and Martin — Speech and Language Processing, 3rd-edition draft (August 20, 2024)

Research date: 2026-09-07

## Identification and relationship to the selected class

- Authors: Dan Jurafsky and James H. Martin.
- Title: *Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition with Language Models*.
- Edition/status: third-edition online draft, August 20, 2024. This is a freely accessible manuscript, not a finished commercial edition.
- Course relationship: Stanford CS224N Winter 2025 lists the book as a useful reference text and explicitly says none of its reference texts is required. The 2024 date is the edition associated with that offering.
- [Official SLP3 landing page](https://web.stanford.edu/~jurafsky/slp3/) (the page now serves a later August 19, 2026 revision; accessed 2026-09-07).
- [Edition-specific August 20, 2024 archive directory](https://web.stanford.edu/~jurafsky/slp3/old_aug24/) and [archived full PDF](https://web.stanford.edu/~jurafsky/slp3/old_aug24/ed3bookaug20_2024.pdf).
- [Public text mirror used to verify the 2024 summary and chapter titles](https://studylib.net/doc/28458794/speech-and-language-processing) (accessed 2026-09-07). The official PDF remains the authoritative edition source.

The 2026 landing page has since reorganized chapters (for example, it merges the Transformer and pretraining material and adds a not-yet-written Agents chapter). Those later changes are not silently applied below: this dossier reviews the 2024 draft referenced by CS224N.

## Table of contents (2024 draft)

The 2024 summary of contents lists three parts and 24 chapters:

### Part I — Fundamental Algorithms for NLP

1. Introduction
2. Regular Expressions, Tokenization, Edit Distance
3. N-gram Language Models
4. Naive Bayes, Text Classification, and Sentiment
5. Logistic Regression
6. Vector Semantics and Embeddings
7. Neural Networks
8. RNNs and LSTMs
9. The Transformer
10. Large Language Models
11. Masked Language Models
12. Model Alignment, Prompting, and In-Context Learning

### Part II — NLP Applications

13. Machine Translation
14. Question Answering, Information Retrieval, and RAG
15. Chatbots & Dialogue Systems
16. Automatic Speech Recognition and Text-to-Speech

### Part III — Annotating Linguistic Structure

17. Sequence Labeling for Parts of Speech and Named Entities
18. Context-Free Grammars and Constituency Parsing
19. Dependency Parsing
20. Information Extraction: Relations, Events, and Time
21. Semantic Role Labeling
22. Lexicons for Sentiment, Affect, and Connotation
23. Coreference Resolution and Entity Linking
24. Discourse Coherence

The full PDF also contains bibliography/index material and web appendices. The chapter list above is transcribed from the 2024 summary of contents; chapter titles are factual TOC data, while the reviews below are original educational assessments.

## Chapter review and LLM 101 relevance

Evidence labels: **Full-text** means the August 20, 2024 full manuscript is accessible and the chapter’s subject can be checked in the text. **TOC/overview** means this review is based on the edition TOC and high-level course alignment rather than claiming a complete close reading. This is a living draft, so examples and methods need date-aware supplements.

1. **Introduction — Full-text.** Establishes what language processing and language models try to represent, why ambiguity matters, and how modern neural systems fit the field’s history. Use it as the orientation lesson before LLM 101’s token and prediction units; add an audio example of ambiguity.
2. **Regular Expressions, Tokenization, Edit Distance — Full-text.** Gives inspectable text-processing operations and dynamic-programming distance, including subword tokenization. It is an excellent bridge to a tokenizer lab and to explaining why token boundaries affect cost and behavior.
3. **N-gram Language Models — Full-text.** Builds next-token prediction from counts, smoothing, probability, sampling, and perplexity. A tiny corpus lab can make likelihood and failure modes audible before neural models are introduced.
4. **Naive Bayes, Text Classification, and Sentiment — Full-text.** Frames classification as probabilistic evidence over words and shows the strengths and weaknesses of simple baselines. Add a baseline-versus-LLM experiment so learners distinguish classification from open-ended generation.
5. **Logistic Regression — Full-text.** Develops a linear decision model, features, loss, and optimization. It supplies a manageable gradient exercise and a concrete reason for separating training objectives from deployment behavior.
6. **Vector Semantics and Embeddings — Full-text.** Connects distributional context to vector representations, similarity, and semantic structure. Use a small embedding visualization and discuss bias, polysemy, and the gap between vector similarity and grounded meaning.
7. **Neural Networks — Full-text.** Introduces layered nonlinear functions, backpropagation, and gradient-based learning. It supports LLM 101’s math bridge, provided equations are paired with narrated diagrams and a tiny numeric forward/backward pass.
8. **RNNs and LSTMs — Full-text.** Explains sequential recurrence, memory, vanishing gradients, and gated alternatives. Keep it as historical context and a comparison lab; it clarifies what Transformers changed without implying RNNs are current LLM defaults.
9. **The Transformer — Full-text.** Presents self-attention, multi-head attention, positional information, Transformer blocks, and causal decoding. This should anchor LLM 101’s architecture unit, with a step-by-step attention matrix example and a warning that attention weights are not a complete explanation of model reasoning.
10. **Large Language Models — Full-text.** Covers pretraining, scaling, data, sampling/decoding, evaluation, and model capabilities and risks. It is the strongest source for LLM 101’s model lifecycle; update rapidly changing model examples and add compute, data licensing, and environmental-cost context.
11. **Masked Language Models — Full-text.** Explains bidirectional masked objectives and downstream fine-tuning, contrasting encoder-only models with causal generation. Add a model-family comparison activity so learners understand why BERT-style objectives are useful even when the capstone is extractive.
12. **Model Alignment, Prompting, and In-Context Learning — Full-text.** Covers prompting, demonstrations, instruction tuning, preference alignment, and related post-training ideas. It maps directly to LLM 101’s prompting and alignment units; add explicit distinctions among prompting, SFT, preference optimization, and evaluation.
13. **Machine Translation — Full-text.** Uses sequence-to-sequence modeling and evaluation to show language generation across languages. It is optional depth for LLM 101, but a translation example helps learners see multilingual and tokenization tradeoffs.
14. **Question Answering, Information Retrieval, and RAG — Full-text.** Connects information needs, retrieval, reading/answering, and retrieval-augmented generation. This is directly relevant to LLM 101’s bounded extractive assistant; turn it into a provenance lab that tests retrieval recall separately from answer faithfulness.
15. **Chatbots & Dialogue Systems — Full-text.** Treats dialogue as structured interaction, including goals, acts, context, and safety concerns. It is useful for the future generative tutor while preserving LLM 101’s current boundary between source-grounded answers and open-ended conversation.
16. **Automatic Speech Recognition and Text-to-Speech — Full-text.** Introduces acoustic features, speech-to-text, and text-to-speech architectures and evaluation. It supports LLM 101’s audio-first design; pair it with actual latency/error examples and keep acoustic quality claims separate from browser event timing.
17. **Sequence Labeling for Parts of Speech and Named Entities — Full-text.** Shows token-level structured prediction for grammatical categories and entities. Use as optional preparation for extracting citations or metadata, with a clear contrast between labels and free-form LLM output.
18. **Context-Free Grammars and Constituency Parsing — Full-text.** Formalizes phrase structure and parsing algorithms. It gives useful language-structure depth but should remain optional in an introductory LLM sequence; a short parse-tree exercise is enough.
19. **Dependency Parsing — Full-text.** Represents head-dependent relations and practical dependency parsing. It can enrich an information-extraction lab, but it is not required to understand a decoder-only LLM.
20. **Information Extraction: Relations, Events, and Time — Full-text.** Defines structured extraction from text and the evaluation challenges that come with it. This is highly relevant to an extractive assistant: add schemas, evidence spans, and abstention when a relation is unsupported.
21. **Semantic Role Labeling — Full-text.** Models predicate-argument structure and “who did what to whom” information. It is useful optional depth for explaining semantic evaluation and why surface overlap can miss meaning.
22. **Lexicons for Sentiment, Affect, and Connotation — Full-text.** Shows how lexicons operationalize affect and connotation while exposing measurement and cultural limits. Use one small exercise on label uncertainty and bias rather than presenting sentiment as objective truth.
23. **Coreference Resolution and Entity Linking — Full-text.** Addresses references across a document and links mentions to entities. This supports chunking and retrieval diagnostics in LLM 101, especially tests where pronouns and repeated names cause evidence-selection errors.
24. **Discourse Coherence — Full-text.** Studies relations among sentences and document-level coherence. Add a qualitative coherence check to complement token-level metrics, while explaining that fluent prose can still be unsupported or wrong.

## Overall assessment for LLM 101

The 2024 draft’s first 12 chapters form a strong conceptual spine: tokens and simple probabilities, linear and neural models, Transformers, LLM pretraining, masked models, and post-training. Chapters 14, 15, and 16 connect especially well to the bounded assistant, dialogue boundary, and audio-first interface. The linguistic-structure chapters are valuable optional depth and provide concrete extraction/evaluation examples.

The draft is not a complete implementation manual or a stable account of current frontier models. LLM 101 should add small runnable examples, explicit provenance and abstention tests, compute/data governance, and dated supplements for new post-training, multimodal, and agent methods. The book’s chapter progression suggests a clearer course structure: foundations → model architecture → training/adaptation → retrieval and evaluation → interaction and speech → optional linguistic specialization.

## Sources and limitations

1. [Official SLP3 site](https://web.stanford.edu/~jurafsky/slp3/) — authors, title, current revision notice, and official chapter links; accessed 2026-09-07.
2. [August 20, 2024 archive directory](https://web.stanford.edu/~jurafsky/slp3/old_aug24/) and [archived full draft PDF](https://web.stanford.edu/~jurafsky/slp3/old_aug24/ed3bookaug20_2024.pdf) — dated edition-specific manuscript; accessed 2026-09-07.
3. [2024 draft text mirror](https://studylib.net/doc/28458794/speech-and-language-processing) — independently viewable summary of contents and chapter headings used to verify the TOC; accessed 2026-09-07.
4. [Stanford CS224N Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) — identifies SLP3 as a useful reference text and says none of the reference texts is required; accessed 2026-09-07.

The text mirror is used only to verify titles and navigation; chapter assessments are original summaries and recommendations. No claim is made that every chapter was read line by line during this bounded research pass, and no copyrighted chapter prose is reproduced.
