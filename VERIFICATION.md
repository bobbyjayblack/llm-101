# First-unit verification

Checked on 2026-09-06.

Playback-speed update: the default is now 1.5x, with a one-time migration for existing settings. A separate headless Chrome context verified the fresh default, migration from 1x, preservation of notes, and persistence of a subsequent manual speed change. All seven Node tests and the app.js syntax check passed. Voice files and pitch-preserving playback behavior were unchanged.

## Local Qwen3-TTS integration

Claire connected-speech revision, 2026-09-06: retained her soft/whimsical tone description and seed, adding directions for linked word boundaries, reduced unstressed words, and phrase-level emphasis. Regenerated Claire's reference and restarted both services. The same preview measured 9.68 seconds versus 10.40 seconds previously; the saved playback speed was not changed. A local Whisper base.en transcription recovered the intended wording with the same minor "try an"/"try and" ambiguity. Real WAV generation and cache replay passed; Grace and Helen remained cached. Seven Node and three Python tests passed. These checks establish functionality and intelligibility, not a subjective guarantee of improved coarticulation or identical vocal timbre.

Claire tone revision, 2026-09-06: changed her design to a softer, rounded, velvety adult voice with a subtle whimsical lilt and a steady conversational pace. Regenerated only Claire's reference and restarted both services. Her identical preview measured 10.40 seconds versus 10.24 seconds previously (about 1.6% difference); browser speed settings were unchanged. Real synthesis and cached replay passed; Grace and Helen retained their existing audio. Seven Node tests and three Python tests passed. Voice-version hashing prevents the previous Claire recordings from being reused for new requests. Subjective softness remains for the listener to assess.

Verified on 2026-09-06 with an NVIDIA RTX 4090 (24 GB VRAM), i9-13900K, and approximately 64 GB RAM:

- Installed isolated Python 3.12, CUDA PyTorch 2.10.0/cu128, and qwen-tts 0.1.1. Downloaded pinned VoiceDesign and Base 1.7B snapshots (approximately 9.1 GB total model files).
- Generated three original female narrator references: Claire, Grace, and Helen. A separate local Whisper base.en transcription recovered the intended reference content, with a minor "try an"/"try and" transcription difference. This checks intelligibility, not subjective voice comfort or speaker demographics.
- The Base model loads on CUDA with Hugging Face and Transformers offline modes enabled. Both loopback services report the same project identity and become ready before the launcher returns.
- Real speech requests through the course server produced nonempty 24 kHz PCM WAVs for all three voices. Initial preview timings: Claire 12.93 seconds for 10.24 seconds of audio; Grace 19.68 seconds for 8.80 seconds; Helen 20.38 seconds for 8.88 seconds. Identical cached replays took 7–31 ms and returned identical bytes. First-time generation is not guaranteed to keep up with playback; Prepare lesson audio is provided for uninterrupted reading.
- Seven Node tests passed: course arithmetic/structure, segment text preservation, stale-request cancellation, pause during generation, speed changes, segment progression, static-file allowlist, and HTTP request boundaries. Three Python tests passed for input validation and voice/cache versioning.
- Headless Chrome integration exercised real local preview and lesson playback, pause/resume/stop, highlighted passages, 1.25x speed, 36-pixel text, light theme, three narrator options, prepare/cancel controls, browser-source selection, and note persistence. No JavaScript page errors or horizontal page overflow occurred. The settings screenshot was inspected; the large-text dialog scrolls to its lower controls. Tests used a separate browser context and removed the temporary note.
- Repeated start reuses the existing services. Repeated stop succeeds. Both port-conflict cases (4173 and 4174), concurrent-launch locking, and preservation of an unrelated test Node process passed.
- Stop removed both the venv Python launcher and its model process. Observed total GPU memory fell from 8,033 MiB to 2,500 MiB, releasing approximately 5.5 GB. Other applications remained running.

Remaining validation: the learner's preference among the synthetic voices, comfort over long listening sessions, and pronunciation of all course text. Browser checks establish playback behavior; they do not substitute for listening on the learner's actual speakers/headphones. Fresh speech may pause for generation. Cached lesson audio avoids that delay.

## Windows service launchers

Checked on 2026-09-06 after adding start.bat, stop.bat, and service.ps1:

- Started the background server and received HTTP 200 from the course page.
- Repeated start detected the running server; stop ended it; repeated stop succeeded without an error.
- A second directory's launcher rejected the occupied port, and its stop command left the original directory's server running.
- Started and stopped a copy in a path containing spaces while using a different working directory.
- All three existing Node tests passed. Test servers were stopped after verification.
- Batch launchers were executed from a terminal; Explorer double-click interaction was not separately tested.
- Default-browser follow-up: ran the updated start.bat successfully with the Windows URL-open command after the startup error guard; the server returned HTTP 200 and all three Node tests passed. Browser rendering was not separately inspected. The server was left running for use.

## Course application

- Node tests: the first update matches the narrated worked example; repeated updates decrease loss from both sides of the solution; each lesson has teaching, a valid quiz answer, explanation, and self-check criteria.
- JavaScript syntax checks pass.
- In-app browser: six lessons render; navigation works; the interactive training step displays weight 1.800, prediction 3.600, and loss 2.880; selecting the correct answer produces explanatory feedback.
- A temporary note survived reload; the temporary note was then removed through the interface.
- 36-pixel text and the light theme applied correctly, with no horizontal document overflow at the tested desktop viewport.
- Browser reports three local Microsoft voices. Starting narration triggers the speaking status; Pause changes to Resume; Stop works. This verifies browser events and controls, not a human judgment of audible quality or comfort.
- Keyboard Tab reaches settings with visible focus. A screenshot was inspected for the default layout. Full assistive-technology or WCAG conformance testing has not been performed.
- No browser console errors were observed during the interaction checks.

Remaining validation: learner feedback on magnification, contrast, voice quality, listening pace, and lesson depth; broader viewport and browser testing; sustained narration and passage transitions; export download interaction. The course intentionally labels progress as self-reviewed rather than AI-assessed mastery.
