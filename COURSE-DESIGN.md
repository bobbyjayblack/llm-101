# Generative AI Systems: course design draft

Status: Unit 1 is implemented as a local browser app with six introductory lessons, Qwen3-TTS narration with passage highlighting and timed word underlining, three original synthetic voices, an optional browser-voice fallback, an experiment, authored quiz feedback, notes, and self-review criteria. Windows launchers manage the web and audio services together. The complete course and conversational voice tutor are still future work. See README.md for launch instructions and saved learner preferences.

Confirmed direction: deep understanding and comparison; 3–5 hours weekly; large synchronized text and audio; magnification; spoken discussion and keyboard coding; Python refresher and mathematics as needed. VSR means Video Super-Resolution, with specialization depth to be chosen after the introduction. The inspected Windows computer has approximately 64 GB RAM and an RTX 4090. Optional services budget is up to $100 monthly; no spending has been authorized or incurred. Eye tracking is deferred.

## Intended outcome

Explain, build, measure, and debug the path from source data to trained model to a deployed generative application. Distinguish what a model learns during training from what the surrounding software supplies during inference. Compare language, speech, image, video, and multimodal systems using evidence from small reproducible experiments.

The course is designed for a software engineering graduate. Programming knowledge is a starting point; mathematics and machine learning prerequisites will be diagnosed and taught where needed. Pace follows demonstrated understanding and accessibility feedback.

## Teaching approach

Each lesson supplies its own explanation, terminology, worked example, experiment, feedback, and review. No external textbook or professor should be required to complete the planned course. References support verification and optional depth. An AI tutor should be grounded in reviewed course content and lab evidence; it must identify uncertainty and distinguish established material from generated explanations.

A typical session, adjustable after a sample lesson:

1. State one concrete learning objective and recall a previous idea aloud.
2. Listen to a short explanation, initially targeting five to eight minutes per segment.
3. Hear a worked example with all essential visual information described.
4. Predict an outcome before running a small experiment.
5. Explain the result verbally or in writing; receive specific feedback.
6. Solve a related problem with less assistance.
7. Save a short spoken recap and schedule later retrieval practice.

Progression requires explanation, application, and diagnosis of an unfamiliar example. Hints and reference answers remain available; the system distinguishes assisted practice from independent mastery. No speed-based grading.

## Provisional sequence

1. **Orientation and the complete system.** Model versus application; tokens and representations; training versus inference; data-to-deployment walkthrough. Lab: trace a request through a tiny inspectable system.
2. **Mathematics and numerical computing as needed.** Vectors, matrices, probability, derivatives, gradients, numerical precision, and tensors. Lab: implement and inspect a small predictor.
3. **Learning from data.** Objectives, optimization, backpropagation, generalization, splits, leakage, overfitting, and baselines. Lab: train a small network and diagnose deliberate mistakes.
4. **Data sourcing and preparation.** Provenance, permissions and licenses, privacy, collection, filtering, deduplication, labeling, synthetic data, contamination, dataset documentation, and versioning. Lab: create a documented small dataset and leakage checks. Specific legal requirements require jurisdiction-specific sources.
5. **Language modeling foundations.** Tokenization, embeddings, sequence prediction, attention, positional information, transformers, and architecture families. Lab: build and train a tiny language model.
6. **Training at scale.** Pretraining, optimizers, batching, precision, checkpoints, distributed training, parallelism, hardware constraints, and experiment tracking. Lab: measure a small training run; model larger costs without requiring a large cluster.
7. **Adaptation and post-training.** Supervised fine-tuning, parameter-efficient methods, preference learning, reinforcement learning concepts, distillation, and alignment evaluation. Lab: adapt a small model and compare it against its baseline.
8. **Inference and serving.** Decoding, context limits, KV caches, batching, quantization, speculative decoding concepts, latency, throughput, memory, and cost. Lab: benchmark and explain tradeoffs on available hardware.
9. **Retrieval and application systems.** Embeddings, vector search, retrieval-augmented generation, reranking, tools, structured outputs, workflow orchestration, agents, memory, and failure recovery. Lab: build a source-grounded assistant with an evaluation set.
10. **Speech systems.** Audio representations, speech recognition, text-to-speech, speech generation, streaming, interruption handling, and voice interfaces. Lab: trace and evaluate a voice interaction.
11. **Image, video, and multimodal generation, including VSR.** Autoencoders, GANs, diffusion, flow-based generation concepts, conditioning, vision-language models, temporal consistency, and multimodal evaluation. VSR introduces temporal evidence, alignment, propagation, upsampling, degradation assumptions, fidelity, and perceptual quality; deeper specialization follows learner feedback. Labs use spoken descriptions and numeric evidence so essential conclusions do not depend on vision.
12. **Reliable production systems.** Evaluation design, hallucination analysis, prompt injection, access boundaries, observability, caching, deployment, monitoring, reproducibility, and update policies. Lab: test and instrument the integrated application.
13. **Capstone and oral defense.** Build an accessible AI teaching assistant or another learner-selected system; document data lineage, model selection, training or adaptation, inference architecture, evaluation, costs, and limitations. Explain and debug the whole system.

For each major technique, teach the problem it solves, its inputs and outputs, internal mechanism, training objective where applicable, inference behavior, resource tradeoffs, failure modes, and role in the larger architecture.

## Accessibility requirements for implementation

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

Technical readings and implementation dependencies will be selected and verified after scope clarification. The final course should distinguish stable principles from changing products and model versions.
