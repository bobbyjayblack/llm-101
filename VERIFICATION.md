# Course verification

Checked on 2026-09-06.

## Documentation refresh

Updated README, course design, contributor instructions, and the wiki to describe the implemented study workflow, lab limits, text-only note export, installation updates, and current-plan audio preparation states. Design targets are distinguished from completed accessibility checks and self-reviewed progress. The course's source code, voice configuration, and audio inventory were unchanged in this documentation update.

The 19 Node tests passed again. Checked five relative file links and 18 internal wiki links across 14 Markdown documents. Published the corresponding wiki updates; all six live pages returned HTTP 200. No new browser, acoustic, or Python verification was needed for these documentation-only edits. Earlier test results below retain their original scope.

## Full curriculum implementation

All 13 units now contain 30 lessons (the original six plus 24 new lessons), with approximately 10,900 words of teaching text, lesson quizzes and explanations, oral prompts and criteria, and spaced recall. Each unit has a runnable local lab with two scenarios, expected results, troubleshooting, source inspection, and a Node CLI. Units 9 and 13 accept questions against a small authored source collection. The capstone is a deterministic extractive assistant, not a generative conversational tutor.

- Nineteen Node tests passed, covering all units, numerical labs, complete audio-plan text coverage, cancellation/timing behavior, and HTTP boundaries. Nine Python speech/alignment tests passed.
- The full-course Chrome check visited all 30 lessons, checked every correct quiz response, and ran all 26 lab scenarios. It verified cross-unit Next/Previous, first/last boundaries, keyboard unit selection, existing lesson-2 notes and passage bookmark, new capstone notes and review persistence, and an unsupported capstone question. No page errors occurred.
- The nonlinear network achieved held-out MSE 0.004695 versus mean-baseline 0.097656. Corrupting the center label increased held-out MSE to 0.131212. The rank-one target fitted below 0.00001 MSE; a full-rank target retained 0.1875 MSE. Tests also checked leakage paths, causal masking, checkpoint state, KV memory, word edit distance, motion alignment, source refusal, and cache invalidation.
- Existing real-narration browser checks passed: preview, lesson playback, pause/resume/stop, preparation cancellation, voice/settings controls, and note persistence. A new unit-2 lesson produced real audio and a visible timed word underline within 765 ms of the test action; fresh lab-instruction audio reached that point after 41.16 seconds while background rendering was active. These timings include browser actions and alignment availability, not isolated first-sound measurements. Pause/resume and clearing the underline on Stop passed for both new-content paths.
- Inspected 36 px light and 24 px dark screenshots. Desktop and 480 px viewport checks found no horizontal document overflow. Lab results use readable labels and lists rather than raw JSON punctuation; CLI output retains structured JSON. Full assistive-technology conformance and long-session learner comfort remain unverified.
- The expanded Claire plan contains 757 unique clips, including 451 lesson-reading segments. Startup reused existing recordings and began rendering missing material with word timings. Preparation remains in progress; no complete acoustic or intelligibility sweep of all 30 lessons is claimed. Custom lab questions and uncached text can require fresh synthesis. The sidebar's progress is keyed to the current content plan, so the former six-lesson completion cannot label the expanded course ready.

Reproduce curriculum UI checks with `npm run test:browser`, and the new lesson/lab speech check with `node checks/new-content-audio.mjs` while both services run. Generated recordings and test screenshots remain local and are excluded from Git. The sections below record earlier work and their six-lesson inventories; their cache totals and latency measurements are historical.

## Project wiki

The current wiki contains Home, Getting started, Curriculum and labs, Narration and word underlining, Troubleshooting, and Development and verification, with a sidebar and license footer. The documentation refresh above checked all six published pages. At initial publication, the original five pages and 11 internal links were checked, and the GitHub-rendered home, navigation, and footer were inspected. The full-curriculum release added Curriculum and labs.

## Word underlining

Style follow-up: removed the spoken word's background and text-color overrides. Its underline uses `currentColor` to match the surrounding text in either theme. The ten existing Node tests passed; timing and playback code were unchanged. Earlier screenshots below show the original word styling.

- Prepared acoustic timings for all 127 saved Claire clips: 2,919 words. The complete timing-endpoint sweep verified coverage, ordered non-overlapping intervals, and bounds within each recording. Responses had a median of 16 ms and maximum of 32 ms.
- Real in-app browser playback at 1.3x produced 224 timing observations across two consecutive audio segments with no mismatches between the visible word and saved timestamps (excluding observations within 45 ms of a boundary). Pause retained the same word and audio position; a live change to 1.5x continued underlining. Dark 24 px and light 36 px screenshots were inspected. Practice question underlining and clearing on Stop also passed; reading settings were restored to 1.3x, 24 px, dark, and automatic following off.
- Word styling uses native text ranges, preserving the text, radio controls, and screen-reader structure. Tiny speech gaps retain the preceding underline to avoid flicker; longer pauses clear it. Audio starts independently of timing preparation.
- A final real-browser onset measurement was 49 ms from the player starting the request to the audio `playing` event. Reload removed temporary test instrumentation; no browser errors or horizontal page overflow were observed.
- Ten Node tests and nine Python tests passed, including timing cancellation, pause/rate behavior, repeated CTC letters, punctuation/numbers, and serving saved timings without a loaded model.

Limitations: acoustic timing is estimated rather than manually annotated. Browser checks establish agreement with those timings, not phonetic ground truth for every word. Browser-voice timing depends on boundary-event support. A newly generated clip may begin playing before its word timings are ready; saved Claire course clips are fully prepared.

## 1.3x playback and pre-rendering

The current default and one-time existing-settings migration are 1.3x. A separate headless Chrome context verified migration from the previous 1.5x setting, note preservation, and persistence of a subsequent manual speed choice.

- The exact player-text inventory contains 127 unique segments, including all 84 lesson-reading segments plus static question, feedback, self-check, and preview material. Rendering uses batches of up to four with the existing Claire reference.
- Completed all 127 Claire recordings (21.1 minutes before playback speed adjustment). A complete HTTP playback sweep returned valid WAVs and cache hits for every segment: median 20 ms, 95th percentile 35 ms, maximum 42 ms.
- Eight Node tests and five Python tests passed. Coverage includes inventory/player text agreement, cached responses while the model is unavailable, bounded batch input, cancellation, playback progression, and existing course/server checks.
- Ten cached requests during active GPU rendering completed in 7–50 ms. Saved responses bypass model readiness, generation locks, and queue limits.
- Actual Chrome audio events measured 164 ms from Play to playback and 16 ms between the first three saved segments at 1.3x. The broader browser integration check passed with real narration and no page errors.
- Local Whisper transcriptions of nine sampled recordings covering all six lessons matched the intended wording apart from punctuation and number formatting. This is a sampled intelligibility check, not a guarantee for every generated word.
- Stop terminated the launcher-managed pre-render worker and both services, preserving 32 recordings. Restart reused those files and resumed missing work. Durable `.audio/course/` files are excluded from temporary-cache eviction and Git.

Earlier 1.5x update (superseded by 1.3x above): a separate headless Chrome context verified the fresh default, migration from 1x, preservation of notes, and persistence of a subsequent manual speed change. All seven Node tests and the app.js syntax check passed. Voice files and pitch-preserving playback behavior were unchanged.

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
