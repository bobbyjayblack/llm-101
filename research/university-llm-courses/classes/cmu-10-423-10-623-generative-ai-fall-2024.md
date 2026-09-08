# Carnegie Mellon University — Generative AI (Fall 2024)

## At a glance

- **Class name:** Generative AI
- **Class numbers:** 10-423 (undergraduate) and 10-623 (graduate); the two sections share content, with one additional research-literature homework for 10-623.
- **Institution / term:** Carnegie Mellon University, School of Computer Science, Fall 2024.
- **Instructors:** Henry Chai and Matt Gormley.
- **Format:** Lectures Monday and Wednesday, 2:00–3:20 p.m.; occasional Friday recitations, GHC 4401.
- **Textbook:** No single required textbook. The schedule assigns free online readings, including selected chapters from Goodfellow, Bengio, and Courville’s *Deep Learning*. See [the companion book review](../books/goodfellow-bengio-courville-deep-learning-2016.md).
- **Official sources:** [course home](https://www.cs.cmu.edu/~mgormley/courses/10423-f24/), [syllabus](https://www.cs.cmu.edu/~mgormley/courses/10423-f24/syllabus.html), [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423-f24/schedule.html), [coursework](https://www.cs.cmu.edu/~mgormley/courses/10423-f24/coursework.html).

Sources were checked 2026-09-07. The official site says it was last updated 2025-01-06, so the offering is treated as a Fall 2024 course rather than a current catalog promise.

## Syllabus distilled

The course uses generative modeling as a bridge across text, images, audio, video, and code. Its stated outcomes include distinguishing parameter tuning from in-context learning; implementing transformers and diffusion models; applying models to real tasks; adapting foundation models with fine-tuning, adapters, and in-context learning; scaling training over large datasets; analyzing foundation-model behavior; and identifying technical and societal risks.

The sequence begins with recurrent language models and automatic differentiation, then transformer language models, learning language models and decoding, and a first LLM homework using rotary position embeddings and grouped-query attention. It then moves through image generation, diffusion and infilling; adapters and LoRA for Llama; multimodal foundation models and text-to-image generation; scaling and distributed optimization; interpretability; and failure modes including bias, hallucination, adversarial attacks, and data contamination. The public schedule is tentative, but it provides dated readings and lecture labels.

### Prerequisites and assessment

Students must already have introductory machine-learning or deep-learning experience (one of CMU 10-301/10-315/10-601/10-701/10-715/11-485/11-685/11-785). The syllabus says students need not know deep learning or PyTorch in advance, but the prerequisite is enforced as a working knowledge expectation.

For **10-423**, grading is 40% homework (five assignments), 10% in-class quizzes (five, lowest dropped), 20% in-class exam, 25% project, and 5% participation. For **10-623**, the same weights apply, with six homework assignments because HW623 asks students to explain and evaluate recent generative-AI literature. Homework combines written analysis, from-scratch algorithm implementation, and use of existing libraries/models. The project is a team generative-modeling problem with a report and finals-week poster presentation. The syllabus also says assessments should be completed without generative AI.

### Readings and schedule highlights

The first two lectures use selected sections of *Deep Learning* Chapter 10 and the Transformer paper. Lecture 3 covers learning LLMs and decoding, with GPT-1 and GPT-2 readings. The coursework page identifies the progression: PyTorch primer; LLMs (Transformer with RoPE and GQA); image generation; adapters for LLMs (Llama with LoRA); multimodal foundation models; and, for 10-623, a recent-research presentation. The course therefore offers a useful implementation ladder from next-token prediction through adaptation and multimodality.

## Student and professor feedback

Public feedback is uneven and should not be read as a representative course evaluation.

- A Reddit discussion by a student comparing 10-623 with 10-423 says the graduate version adds one paper-summary assignment and describes that difference as worthwhile. The same thread calls the course easier than most of the student’s other ML classes, while another commenter says the lectures were very good. These are anonymous, self-selected, class-specific comments, not a survey: [r/cmu discussion](https://www.reddit.com/r/cmu/comments/1gp6h23/).
- Another public Reddit thread comparing 10-423 with CMU 11-485 says the GenAI lectures were good and covered material that did not overlap fully with introductory deep learning, while advising students without deep-learning background to take 11-485 first: [r/cmu comparison](https://www.reddit.com/r/cmu/comments/1ju1k1w/). This is an enrollment-advice thread, not a systematic review; preserve that distinction.
- For Matt Gormley specifically, Rate My Professors shows 4.6/5 from seven ratings and 88% “would take again,” but the listed courses are primarily 10-601/10-301 rather than 10-423/10-623. Student comments describe clear, engaging explanations and humor; one 2024 review reports occasional lack of preparation/unclear basic explanations. These are **same-professor, other-course** observations and should not be presented as a rating of Generative AI: [Gormley’s RMP page](https://www.ratemyprofessors.com/professor/2236531).
- No trustworthy, course-specific public review for Henry Chai was located in a bounded search. No representative student-evaluation report is public on the official site. The evidence supports a description of student impressions, not a professor ranking.

## What LLM 101 can borrow

1. **Add an explicit model-building ladder.** The course’s RNN → Transformer → decoding → LoRA → multimodal progression can structure LLM 101’s conceptual units. Each step should state what is learned, what remains frozen, and what changes at inference.
2. **Pair every abstraction with a runnable probe.** Small experiments for RoPE/GQA, temperature/top-k decoding, and LoRA would make internal mechanisms visible without requiring full-scale training. Keep the project’s bounded, local-data scope and use tiny models or deterministic toy logits.
3. **Separate capability from risk.** CMU places bias, hallucination, adversarial attacks, and data contamination beside implementation. LLM 101 should give each risk a testable failure example and a mitigation trade-off rather than a general warning.
4. **Teach evaluation as an engineering artifact.** Require learners to record prompt, model/version, decoding parameters, input set, expected answer, and error category. This complements the existing extractive-assistant capstone and avoids implying that a fluent response is evidence of correctness.
5. **Make adaptation choices concrete.** A single table or lab comparing prompt-only, retrieval context, fine-tuning, and LoRA on the same bounded task would give learners a stronger decision framework.

## Evidence limits

The public syllabus is detailed but the schedule is explicitly tentative. Piazza, Gradescope, recordings, and internal course evaluations are linked but not publicly inspectable. Public reviews are anonymous and self-selected; no grade-distribution or course-evaluation claim is made here.
