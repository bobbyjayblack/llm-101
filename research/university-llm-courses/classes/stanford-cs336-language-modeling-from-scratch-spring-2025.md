# Stanford CS336 — Language Modeling from Scratch

## Identification

- Institution: Stanford University, Department of Computer Science.
- Course identifier: CS336, *Language Modeling from Scratch*.
- Offering researched: Spring 2025 archived offering.
- Class number: The archived public course page does not expose a Stanford registrar class number; CS336 is the stable public identifier used here.
- Instructors: Tatsunori Hashimoto and Percy Liang. CAs: Neil Band, Marcel Rød, and Rohith Kuditipudi.
- [Official archived course page](https://cs336.stanford.edu/spring2025/index.html) (accessed 2026-09-07).

## Syllabus and learning sequence

The course follows an end-to-end build: tokenization and model components; PyTorch and resource accounting; Transformer architectures and mixture-of-experts; GPUs, kernels, Triton, and distributed parallelism; scaling laws and inference; evaluation; Common Crawl filtering and deduplication; and supervised fine-tuning, RLHF, and reasoning RL. The Spring 2025 page lists five assignments:

1. **Basics:** implement tokenizer, Transformer language model, optimizer, and a minimal training run.
2. **Systems:** profile the model, implement/optimize FlashAttention2 in Triton, and build memory-efficient distributed training.
3. **Scaling:** fit a scaling law and project model scaling.
4. **Data:** turn Common Crawl into training data and improve it with filtering and deduplication.
5. **Alignment and Reasoning RL:** supervised fine-tuning and reinforcement learning for mathematical reasoning, with DPO as an optional safety-alignment extension.

The public prerequisites are unusually explicit: Python and software-engineering fluency; PyTorch and GPU/system-optimization experience; calculus, linear algebra, probability, statistics, and machine learning. It is a 5-unit, implementation-heavy course with minimal scaffolding. The page permits LLMs for low-level or conceptual questions but prohibits using them directly to solve assignments.

The schedule has 19 meetings from April 1 through June 3, 2025. Topics are assigned across the two instructors: Percy Liang’s executable Python lectures emphasize code-level mechanics, while Tatsunori Hashimoto’s slide lectures cover architecture, systems, scaling, and alignment. Two guest lectures close the course (Qwen 3 and Llama 3).

## Book

No required or recommended book is specified on the archived CS336 page. The readings are the course handouts, executable lectures, papers, and assignment specifications. Accordingly, no book dossier is attached to this class.

## Student feedback on the class

- **Independent enrolled-student write-up (Pinlin Xu, Spring 2025, published after the course):** the author identifies themself as a Stanford student and describes CS336 as a favorite class, with a reported median of 27.5 hours/week for 3–5 units. They praise the from-scratch structure, access to GPU compute, help/feedback, and the executable lectures; they also describe the assignments as very high workload, with Basics acting as a “weeder,” Systems as their heaviest assignment, and data/cluster limits affecting timing. This is one student’s detailed experience, not a representative evaluation. [Review](https://www.pinlinxu.com/posts/cs336_review.html).
- **Independent Reddit discussion (July 2025):** a learner following the released materials reports that the assignments are huge and in-depth, with substantial from-scratch coding; another reply warns that the course ramps quickly and is not aimed at total beginners. The commenters’ enrollment status is not verified, so this is self-study/learner feedback rather than a Stanford evaluation. [Discussion](https://www.reddit.com/r/LocalLLaMA/comments/1lxgb9q/).
- **Independent Reddit discussion (November 2025):** a Stanford-community thread calls CS336 demanding and mentions a roughly 45-hour week and a 50-page first-assignment specification. The post is retrospective and anonymous; treat it as workload signal only. [Discussion](https://www.reddit.com/r/stanford/comments/1p5xaku/).

## Student feedback on instructors

- **Percy Liang, course-specific RateMyProfessors entries (May and July 2026):** two CS336 entries rate quality 1/5 and difficulty 4/5. The reviewers criticize the executable/line-by-line lecture style as confusing and one says CAs had stronger command of the material; these are anonymous, self-selected ratings from later reviews and should not be generalized. [Professor page](https://www.ratemyprofessors.com/professor/2045502).
- **Tatsunori Hashimoto and Percy Liang, enrolled-student write-up:** Xu reports that Hashimoto’s research/slide lectures and Liang’s code-level executable lectures were complementary, and says both instructors’ office hours were great. This is a positive individual account rather than a controlled evaluation. [Review](https://www.pinlinxu.com/posts/cs336_review.html).
- No independent, course-specific public review of Hashimoto alone was found in the bounded search. Stanford’s profile confirms his CS336 teaching role; it is not student feedback. [Stanford profile](https://profiles.stanford.edu/tatsunori-hashimoto).

## Implications for LLM 101

CS336 is a useful upper-bound reference for depth, but its compute and prerequisite demands exceed an introductory audio-first course. Borrow the dependency chain in miniature: tokenize a small corpus, implement a tiny causal model, benchmark one bottleneck, clean a transparent dataset slice, then compare supervised adaptation with a preference method. Make each stage runnable on CPU and narrate resource/time tradeoffs so learners can see why full-scale training is different. Add explicit “why this is not beginner scope” prerequisites and a staged rubric; keep FlashAttention, distributed training, and RL as optional extensions or simulations. CS336’s assignment leaderboards and data-quality checks suggest concrete examples for LLM 101’s evaluation unit, while its assignment policy supports a clear boundary between conceptual AI assistance and work that must remain the learner’s own.

## Research limits and sources

The official page is an archived syllabus and says deadlines are tentative. Stanford does not publish course evaluations or a registrar class number on that page. Public reviews are self-selected and mostly retrospective; RMP reviews are not independently verified. Search was bounded to Stanford course pages, public student write-ups, Reddit course discussions, and instructor pages on 2026-09-07.

Sources: [Spring 2025 official syllabus](https://cs336.stanford.edu/spring2025/index.html), [student review by Pinlin Xu](https://www.pinlinxu.com/posts/cs336_review.html), [Reddit learner discussion](https://www.reddit.com/r/LocalLLaMA/comments/1lxgb9q/), [Stanford-community workload discussion](https://www.reddit.com/r/stanford/comments/1p5xaku/), [Percy Liang RMP page](https://www.ratemyprofessors.com/professor/2045502), and [Hashimoto Stanford profile](https://profiles.stanford.edu/tatsunori-hashimoto); all accessed 2026-09-07.
