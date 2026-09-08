# Generative AI Systems: course design

Status: All 13 units are implemented in the local browser app as 30 lessons and 13 runnable labs, with Qwen3-TTS narration, timed word underlining, quizzes with explanations, oral self-check criteria, spaced recall, and saved notes. Unit 1 retains the original six lessons; every subsequent unit has two lessons. Labs run locally in the browser or through `node labs.mjs <unit> <scenario>`. They are small deterministic exercises with expected results and failure scenarios. The capstone is a source-grounded extractive assistant; a generative conversational voice tutor remains future work. Windows launchers manage the web/audio services and resumable narration preparation. See README.md for the curriculum table, launch instructions, and saved learner preferences.

The September 2026 curriculum update adds inspectable depth recommended by the university-course review. Lessons expose token IDs, subword boundaries, embeddings, next-token alignment, causal decoder shapes, adaptation objective differences, serving estimates, retrieval rankings, version eligibility and provenance, evaluation slices, calibration, adversarial decisions, and canary rollback reasoning. Labs provide deterministic fixtures for these concepts while preserving the original six lesson indices, local progress keys, audio text pipeline, and bounded extractive capstone. Each lesson also carries optional metadata for prerequisite lesson indices, estimated study time, reading, evidence tier, and a learner-facing success check; the browser renders this guide when available.

Confirmed direction: deep understanding and comparison; 3–5 hours weekly; large synchronized text and audio; magnification; spoken discussion and keyboard coding; Python refresher and mathematics as needed. VSR means Video Super-Resolution, with specialization depth to be chosen after the introduction. The inspected Windows computer has approximately 64 GB RAM and an RTX 4090. Optional services budget is up to $100 monthly; no spending has been authorized or incurred. Eye tracking is deferred.

## Intended outcome

Explain, build, measure, and debug the path from source data to trained model to a deployed generative application. Distinguish what a model learns during training from what the surrounding software supplies during inference. Compare language, speech, image, video, and multimodal systems using evidence from small reproducible experiments.

The course is designed for a software engineering graduate. Programming knowledge is a starting point; mathematics and machine learning prerequisites will be diagnosed and taught where needed. Pace follows demonstrated understanding and accessibility feedback.

## Teaching approach

Each lesson supplies teaching text, a quiz with explanatory feedback, an oral prompt, self-check criteria, and recall guidance. Lessons in the same unit share its runnable lab and both scenarios. References support verification and optional depth. The current assistant returns authored evidence; a future generative tutor should be grounded in reviewed course content and lab evidence and distinguish established material from generated explanations.

A typical session, adjustable after a sample lesson:

1. State one concrete learning objective and recall a previous idea aloud.
2. Read or listen to a short passage, pausing and replaying as needed. Audio request segments are shorter than a complete lesson.
3. Hear a worked example with all essential visual information described.
4. Predict an outcome before running a small experiment.
5. Explain the result verbally or in writing; receive specific feedback.
6. Solve a related problem with less assistance.
7. Save a recap in the notes field, using typing or operating-system dictation, and return for the suggested recall sessions. The app does not record microphone audio or send reminders.

The learning target is explanation, application, and diagnosis of an unfamiliar example. Reference answers remain available. Review is self-assessed: the app stores a review date but does not certify mastery, record whether assistance was used, or gate progression. There is no speed-based grading.

## Curriculum sequence

1. **Orientation and the complete system.** Model versus application; tokens and representations; training versus inference; data-to-deployment walkthrough. Lab: trace a request through a tiny inspectable system.
2. **Mathematics and numerical computing as needed.** Vectors, matrices, probability, derivatives, gradients, numerical precision, and tensors. Lab: implement and inspect a small predictor.
3. **Learning from data.** Objectives, optimization, backpropagation, generalization, splits, leakage, overfitting, and baselines. Lab: train a small network and diagnose deliberate mistakes.
4. **Data sourcing and preparation.** Provenance, permissions and licenses, privacy, collection, filtering, deduplication, labeling, synthetic data, contamination, dataset documentation, and versioning. Lab: create a documented small dataset and leakage checks. Specific legal requirements require jurisdiction-specific sources.
5. **Language modeling foundations.** Tokenization, embeddings, sequence prediction, attention, positional information, transformers, and architecture families. Lab: build and train a tiny language model.
6. **Training at scale.** Pretraining, optimizers, batching, precision, checkpoints, distributed training, parallelism, hardware constraints, and experiment tracking. Lab: calculate batch and parameter-state memory, then compare momentum training resumed with and without optimizer state. Cluster training remains a conceptual topic.
7. **Adaptation and post-training.** Supervised fine-tuning, parameter-efficient methods, preference learning, reinforcement learning concepts, distillation, and alignment evaluation. Lab: adapt a small model and compare it against its baseline.
8. **Inference and serving.** Decoding, context limits, KV caches, batching, quantization, speculative decoding concepts, latency, throughput, memory, and cost. Lab: calculate KV-cache memory at two context lengths and quantify weight reconstruction error. These are estimates and arithmetic, not hardware latency benchmarks.
9. **Retrieval and application systems.** Embeddings, vector search, retrieval-augmented generation, reranking, tools, structured outputs, workflow orchestration, agents, memory, and failure recovery. Lab: compare lexical and fixed-vector rankings, apply evidence coverage and source-snapshot eligibility, and build a source-grounded assistant with an evaluation set and abstention path.
10. **Speech systems.** Audio representations, speech recognition, text-to-speech, speech generation, streaming, interruption handling, and voice interfaces. Lab: compute transcript word error rate, waveform storage, and an illustrative stage-latency budget. The course's real narration controls support a separate interruption exercise; the lab does not transcribe microphone input.
11. **Image, video, and multimodal generation, including VSR.** Autoencoders, GANs, diffusion, flow-based generation concepts, conditioning, vision-language models, temporal consistency, and multimodal evaluation. VSR introduces temporal evidence, alignment, propagation, upsampling, degradation assumptions, fidelity, and perceptual quality; deeper specialization follows learner feedback. Labs use spoken descriptions and numeric evidence so essential conclusions do not depend on vision.
12. **Reliable production systems.** Evaluation design, hallucination analysis, contamination, subgroup slices, calibration, prompt injection, access boundaries, observability, caching, deployment, monitoring, reproducibility, canaries, rollback, and update policies. Lab: run authored acceptance and adversarial cases against the extractive assistant, compute a percentile over illustrative durations, and demonstrate stale-cache and rollback decisions.
13. **Capstone and oral defense.** Build an accessible AI teaching assistant or another learner-selected system; document data lineage, model selection, training or adaptation, inference architecture, evaluation, costs, and limitations. Explain and debug the whole system.

For each major technique, teach the problem it solves, its inputs and outputs, internal mechanism, training objective where applicable, inference behavior, resource tradeoffs, failure modes, and role in the larger architecture.

## Accessibility design targets

These targets include work requiring further validation. Implemented controls and completed checks are recorded in VERIFICATION.md; full screen-reader conformance and testing with the learner's magnification setup are not yet established.

- Audio-first instruction with equivalent complete text; optional synchronized highlighting, adjustable speech rate, pause/resume, sentence replay, bookmarks, and resume position.
- Complete keyboard navigation, visible focus, meaningful headings, labeled controls, configurable large text and contrast, and screen-reader compatibility tested with the learner's actual setup.
- No essential meaning conveyed only by color, images, animation, spatial layout, or pointer interaction.
- Mathematics explained verbally before notation; equations also available as accessible structured text. Code supports a conceptual reading and a detailed line-by-line explanation.
- Spoken or typed responses, untimed exercises, short sections, and explicit user controls for repetition and detail.
- Audio playback must be user-controlled and tested for conflicts with a screen reader. Word-level synchronization depends on the chosen speech engine and must be verified before promised.
- Eye tracking is optional and requires a compatible device and successful calibration. It may assist navigation; it is not evidence of attention or comprehension. Keyboard and speech alternatives remain available. Camera or gaze collection is not enabled by this draft.
- Progress records should be exportable. Tutor credentials, audio retention, hosting, and paid service use require an explicit implementation design based on the learner's answers.

## Course completion criteria

Every unit needs full narrated teaching material, an accessible transcript, a runnable lab, expected results, troubleshooting guidance, questions, explanatory solutions, mastery criteria, and spaced review prompts. The application needs accessibility testing, verified playback behavior, progress persistence, and an honest distinction between a scripted lesson and an interactive AI tutor. A syllabus or read-aloud button alone does not complete this course.

## Sources for instructional and accessibility choices

- Institute of Education Sciences, Organizing Instruction and Study to Improve Student Learning: https://ies.ed.gov/ncee/wwc/practiceguide/1 — supports spaced learning, worked examples interleaved with problems, retrieval, and explanatory questions. These are design starting points, not a guarantee about an individual adult learner.
- W3C Web Accessibility Initiative, Making Audio and Video Media Accessible: https://www.w3.org/WAI/media/av/ — guidance for transcripts, descriptions, and accessible media players.

Each unit links an optional technical reference through `course.js`; README.md documents the implemented exercises, and THIRD-PARTY.md identifies downloaded model and package notices. Fixed-vector retrieval with reranking is an optional bounded Track A extension for the capstone. Larger training projects, a local generative adapter or conversational tutor, and further accessibility validation remain extensions to the current course.
