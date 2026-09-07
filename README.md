# LLM 101 — AI, understood

An audio-first course for a software engineering graduate seeking understanding of AI systems. All 13 curriculum units are available as 30 lessons, with 13 runnable labs, explained quizzes, oral self-checks, spaced recall prompts, notes, and local progress.

See the [project wiki](https://github.com/bobbyjayblack/llm-101/wiki), including the [full curriculum and labs](https://github.com/bobbyjayblack/llm-101/wiki/Curriculum-and-labs), [narration guide](https://github.com/bobbyjayblack/llm-101/wiki/Narration-and-word-underlining), and [troubleshooting](https://github.com/bobbyjayblack/llm-101/wiki/Troubleshooting).

## Start

For the full local AI narrator on Windows, install Node.js, [uv](https://docs.astral.sh/uv/getting-started/installation/), and a current NVIDIA driver. Then:

```sh
git clone https://github.com/bobbyjayblack/llm-101.git
cd llm-101
start.bat
```

The launcher opens http://127.0.0.1:4173 after the web service and audio model are ready. First setup downloads Python dependencies and two Qwen3-TTS models, then creates three original narrator voices. Allow several minutes and roughly 15–20 GB of disk space for models, runtime, and caches. No API key, account, paid voice, or cloud speech service is required. This configuration was tested on an RTX 4090 with 24 GB VRAM and 64 GB system RAM.

For the course with browser voices only, Node.js is sufficient: run `npm start`, open the address above, and select **Browser voices** in Reading & audio settings. Stop that foreground web server with Ctrl+C. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Windows start and stop shortcuts

Double-click `start.bat` to run both services in the background and open the course in your default browser. It also starts a background worker that saves missing Claire narration for the course. Double-click `stop.bat` to stop the worker and both services, unloading the audio model from GPU memory. Starting again resumes from saved recordings and reuses downloaded models and voices. Starting twice reuses running processes; stopping twice is harmless. The launchers use paths relative to their own directory.

You can also run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\service.ps1 start` (or `stop`) from this directory. The batch files apply that execution-policy setting only to their PowerShell process; they do not change your system policy. Logs are written to `.service/`, which Git ignores. The stop launcher targets only servers started by these launchers for this directory. If you used `npm start`, stop that server with Ctrl+C in its terminal first.

The web service binds to `127.0.0.1:4173`; Qwen's Python audio service binds to `127.0.0.1:4174`. Ollama is not needed for this TTS workflow and is not started or stopped by these scripts. Only this project's processes are managed. A failed start cleans up services it launched; it does not terminate unrelated processes occupying either port.

## Update an existing installation

From this directory in PowerShell:

```powershell
.\stop.bat
git pull --ff-only origin main
.\start.bat
```

Preserve any local source edits before pulling, then refresh the course page after startup. Restarting loads the current server modules and narration inventory. Existing voices and unchanged recordings are reused; new lessons are prepared in the background. Browser notes and progress are independent of Git. Use **Download notes & progress** before changing browser profiles or clearing browser data; this exports a text copy, and the app does not currently import it.

## Local narrator

Reading & audio settings defaults to **Local AI narrator**, with three AI-designed female voices: **Claire** (gentle American, default), **Grace** (warm American), and **Helen** (refined American). Use **Preview voice** to compare them. Close settings to use the main pause/resume and stop controls. Lesson text, questions, feedback, self-check criteria, and experiment results all use the selected audio source.

Claire uses a soft, rounded, velvety tone with a subtle whimsical lilt at a steady conversational pace. Her delivery is directed toward connected speech: gently linked word endings and beginnings, lighter unstressed words, and emphasis across whole phrases. Speaking speed remains controlled separately by your saved speed setting.

Playback now defaults to **1.3×**. Existing settings receive this change once on reload; subsequent manual speed choices remain saved. Local playback preserves pitch and reuses the same voice recordings.

**Spoken words are underlined** in the lesson and visible practice text. A local Wav2Vec2 speech model aligns the text to each recording; the player follows those saved timings using the audio clock, including after speed changes and pause/resume. Connected words advance smoothly; longer silences clear the underline. Stop, replay, lesson changes, and narrator changes clear stale highlighting. The voice and recordings are unchanged.

Setup downloads the pinned alignment model (approximately 360 MB); alignment runs on the CPU and its files are cached in `.audio/timings/`. The background course renderer prepares these alongside the WAVs, and **Prepare lesson audio** also prepares word timings for the chosen narrator. For uncached text, playback can begin before alignment finishes; underlining joins when timings arrive. Missing timings do not delay or prevent audio playback. Acoustic boundaries are estimates, especially for numbers, acronyms, and unusual pronunciations.

Qwen3-TTS-12Hz-1.7B-VoiceDesign creates short reference recordings during setup. The companion 1.7B-Base model reuses those references for a consistent narrator. Only the Base model remains loaded during ordinary use. Both run through the official `qwen-tts` package with CUDA PyTorch and Windows-compatible SDPA attention. Model revisions are pinned in `audio_service.py`.

Claire's course narration is pre-rendered automatically in batches of up to four segments: lesson readings first, followed by questions, feedback, self-checks, recall prompts, lab instructions, explanations, default scenario results, and previews. Progress and the current inventory size appear in Reading & audio settings. The audio button immediately left of the settings cogwheel opens the Audio preparation section, including Prepare lesson audio. The expanded course takes substantially longer to prepare than the original six lessons. Once saved, a segment is served immediately from disk, bypassing the model's generation queue even when the GPU is busy. The player fetches the following segment ahead of time. Passage highlighting and pitch-preserving speed control remain available.

The first pre-render takes time; completed passages can be played while the remaining ones are generated. New text, changed voices/content, other narrators, and dynamic experiment-result readings may still require synthesis. The next start automatically fills missing Claire recordings. Unchanged recordings are reused. Stop in the player stops playback; `stop.bat` also stops the background render and unloads the model. Completed recordings survive interruption.

**Prepare lesson audio** prepares a chosen lesson, its practice and lab material, or another narrator on demand. It shows progress and can be canceled independently of the automatic Claire render. Selecting Play or changing lessons/voices cancels this manual preparation and starts the requested action. Custom questions produce dynamic lab answers that may need fresh synthesis.

Models live in `.models/`; voice references live in `.audio/voices/`. Durable pre-rendered recordings live in `.audio/course/` and are not removed by temporary-cache cleanup. Other generated speech uses `.audio/cache/` (approximately 1 GB maximum). These files and `.venv/` are excluded from Git. Normal narration runs with Hugging Face/Transformers offline mode enabled. Only initial setup or explicitly rerunning setup downloads files. Browser voices remain an optional fallback and may use network services.

To change voice descriptions, edit `voices.json`, stop both services, then run `start.bat`. Changed descriptions or seeds generate new references without reusing old cached speech. To repair a missing environment, model, or reference, stop the services and run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\setup-audio.ps1`, then start again. Check `.service/audio-stderr.log` for audio failures and `.service/stderr.log` for web failures. Use **Check narrator status** after restarting a service. If GPU memory is exhausted, close other GPU-heavy applications and restart.

For pre-render progress or errors, see `.service/prerender-claire.json` and `.service/prerender-stderr.log`. Running `start.bat` again retries an exited worker. It never creates a duplicate launcher-managed worker. Old voice versions remain separate on disk and are not used for a changed voice.

## Lessons and labs

Mathematical examples include 28 equation cards across 22 lessons, placed beside their related explanations. Each card defines the notation in words and has a **Read equation** control using the selected narrator and word underlining. Examples include gradients, attention, perplexity, low-rank updates, cache memory, audio metrics, diffusion, and PSNR. Equation explanations are included in manual lesson preparation and the background audio plan. **Play lesson** continues to read the main teaching paragraphs; use the equation button for its detailed notation reading.

Each lesson has a bookmarkable URL, for example `http://127.0.0.1:4173/?lesson=7`. Selecting a lesson or using Next/Previous updates the address and browser tab title; Back and Forward restore the corresponding lesson. Sidebar lesson links support copying their address and opening a new tab. A valid lesson URL takes precedence over the saved lesson; opening the base address resumes your saved lesson. Invalid lesson numbers fall back to saved progress. These local links work on a computer running the course at that address.

The shared material below the lesson is grouped under **Course Overview So Far**, collapsed by default. Expand it for course progress, the weekly rhythm, **Download notes & progress**, course scope, and references.

The header is labeled **LLM 101**. Its leftmost arrow icon toggles the compact sidebar; the icon's tooltip and accessible label switch between Collapse sidebar and Expand sidebar.

All 13 **Course units** appear in the sidebar. Click a unit to expand its lessons directly underneath; the other unit headings remain in order below. Opening another unit collapses the previous list, and clicking an expanded unit collapses it. Select a lesson to open it. Expanding a unit scrolls the current lesson to the top without changing your reading position or notes. The numbered lesson title and reading status appear directly beneath the unit/lesson line. **Next lesson** and **Previous lesson** cross unit boundaries and expand the matching unit automatically. Unit buttons support Enter and Space; Tab reaches the expanded lessons. Original notes, answers, review dates, and passage bookmarks remain attached to the original six lessons.

| Unit | Lessons | Runnable lab |
| --- | --- | --- |
| 1. Orientation and the complete system | 1–6 | Trace evidence through a document assistant |
| 2. Mathematics and numerical computing | 7–8 | Dot product, finite-difference gradient, learning-rate failure |
| 3. Learning from data | 9–10 | Train a nonlinear network; diagnose a corrupted label |
| 4. Data sourcing and preparation | 11–12 | Group splits and cross-split duplicate detection |
| 5. Language modeling foundations | 13–14 | Train a count language model and inspect causal attention |
| 6. Training at scale | 15–16 | Batch/memory arithmetic and momentum checkpoint recovery |
| 7. Adaptation and post-training | 17–18 | Fit a low-rank update and inspect capacity limits |
| 8. Inference and serving | 19–20 | KV-cache memory and weight quantization |
| 9. Retrieval and application systems | 21–22 | Query evidence with a bounded workflow and hostile fixture |
| 10. Speech systems | 23–24 | Word error rate, waveform size, and stage latency budget |
| 11. Images, video, and multimodal systems | 25–26 | Motion alignment and ambiguous reconstruction |
| 12. Reliable production systems | 27–28 | Acceptance cases, tail latency, and stale-cache failure |
| 13. Capstone and oral defense | 29–30 | Query, narrate, evaluate, and defend an extractive assistant |

Each unit includes two lab scenarios, instructions, expected results, troubleshooting, and readable source. Predict before selecting **Run lab**; compare the result with the explanation and use the lesson's oral criteria to assess your understanding. Lab instructions, results, explanations, and recall prompts have read-aloud controls. Queries in units 9 and 13 use a small authored collection and lexical matching; unknown questions can return no evidence.

The same exercises run from the repository without Python or a downloaded language model:

```powershell
node labs.mjs 3 0
node labs.mjs 3 1
node labs.mjs 13 0 Where do notes save?
```

Arguments are unit number (1–13), scenario (0 or 1), and an optional question used by units 9 and 13. Invalid units, scenarios, and questions longer than 500 characters are rejected. Edit `labs.js` to extend the examples, then run `npm test`. The speech latency inputs and large-model memory budgets are illustrative calculations, not measured performance. The nonlinear network and low-rank fitting exercises perform actual local optimization.

A study session can follow this sequence: read the lesson, predict and run both lab scenarios, check the quiz explanation, then explain the mechanism in the notes field using the self-check criteria. **Mark lesson reviewed** records your own review; it neither grades an oral answer nor unlocks another lesson. Return after three days and one week using the recall prompt. Labs reset when you change lessons; record results you want to retain in your notes.

## Development checks

Run `npm test` for content, numerical labs, playback-state, and HTTP-boundary tests, and `.venv\Scripts\python.exe -m unittest audio_service_test alignment_test` for speech and alignment validation. For real-model checks with both services running, run `.venv\Scripts\python.exe checks\audio-smoke.py`; it saves preview WAVs and timings under `.service/`. For browser integration checks, run `npm ci` and `npm run test:browser` with Google Chrome installed. This checks real narration plus all 30 lessons, 26 lab scenarios, quiz feedback, navigation, and progress persistence. Playwright is a development dependency only.

After preparing lesson 1, run `node checks/playback-latency.mjs` to measure actual browser playback onset and segment transitions at 1.3x, and verify speed migration and preference persistence. `node checks/verify-prerender.mjs` checks every planned recording through the live speech endpoint once preparation is complete.

Run `node checks/new-content-audio.mjs` with both services running to check actual local narration and word underlining for a unit-2 lesson and lab instructions, including pause/resume/stop. This check can take longer when those clips have not yet been generated.

To read the current background preparation status without starting a generation request:

```powershell
Invoke-RestMethod http://127.0.0.1:4173/api/audio/preparation
```

`rendering` reports completed segments and the total; `ready` reports that the worker finished the current plan. `error` requires inspecting the worker log and retrying startup. `not-started` means there is no matching progress record for this server's content plan. A ready narrator means the audio service is available, which is separate from the course recordings being fully prepared.

Run `.venv\Scripts\python.exe -m unittest alignment_test` for alignment-path and number/punctuation handling checks. After course preparation, `node checks/verify-word-timings.mjs` checks word coverage, timestamp ordering, recording bounds, and response times for every course clip.

## Project files

- `index.html` and `style.css`: accessible course interface and themes.
- `app.js` and `narration.js`: course behavior, browser speech, and local audio playback.
- `course.js`: 30 lessons across 13 units and the original training example.
- `labs.js`, `labs.mjs`: browser exercises and a Node command-line runner; no extra runtime dependencies.
- `labs.test.js`, `checks/full-course-browser.mjs`: numerical exercise checks and complete curriculum navigation/assessment checks.
- `course.test.js`: lesson structure and training arithmetic checks.
- `server.mjs`: Node HTTP server and same-origin audio proxy on port 4173.
- `audio_service.py`, `voices.json`, and `requirements-audio.txt`: local Qwen speech generation, narrator definitions, and Python dependencies.
- `setup-audio.ps1`: installs the audio runtime, downloads models, and creates narrator references.
- `audio-plan.js` and `prerender-audio.mjs`: exact player-text inventory and resumable course renderer.
- `alignment.py`: offline word alignment and cached timing metadata.
- `start.bat`, `stop.bat`, and `service.ps1`: Windows background service controls.
- [COURSE-DESIGN.md](COURSE-DESIGN.md): broader curriculum and accessibility goals.
- [VERIFICATION.md](VERIFICATION.md): recorded checks and remaining validation.
- [AGENTS.md](AGENTS.md): repository instructions for coding agents and contributors.

## Narration and access

Choose Reading & audio settings to adjust text, theme, rate, audio source, and voice. Read lesson starts from the saved passage. The active passage remains highlighted while the current spoken word receives an underline matching the text color, with no word background or text-color change. Each passage has its own replay entry point. Automatic scrolling is off by default. Word styling uses the CSS Custom Highlight API without changing the text or adding screen-reader announcements. Older browsers retain passage highlighting. Browser voices underline words only when the voice provides word-boundary events; local recordings use the cached acoustic timings. Actual voice comfort and pronunciation should be evaluated on the learner's device.

Tab navigates controls. All content is available without audio. Use operating-system dictation in the notes field if preferred. No microphone, gaze tracking, camera, API credential, or generative conversational tutor is included. Quizzes use authored feedback; open explanations are self-assessed with criteria. The capstone supplies a working bounded extractive assistant with source evidence and a trace; it is explicitly distinguished from a trained generative tutor.

Progress and notes use browser local storage and depend on the browser/profile and origin. Download notes to keep a portable text copy. Clearing browser data removes the stored progress. This local server binds to the loopback interface only.

## Learner preferences

- Primary objective: understand and compare AI deeply.
- VSR means Video Super-Resolution; specialization depth deferred until introduction.
- 3–5 hours weekly; synchronized large text and audio; magnification rather than a screen reader as the starting setup.
- Spoken discussion and keyboard coding; Python refresher; mathematics refreshed as needed.
- Windows system verified: approximately 64 GB RAM, Intel i9-13900K, NVIDIA RTX 4090 with 24 GB VRAM. Local Qwen narration runs on CUDA.
- Optional budget ceiling: $100/month, not spending authorization. Current app has no paid integrations.
- Original sample expanded to all 13 units. Eye tracking deferred.

Further development includes a generative conversational voice teacher grounded in the curriculum, larger model-training projects, and accessibility validation with the learner's actual magnification and audio setup. The present labs are small inspectable computations, not substitutes for training a production transformer or benchmarking a distributed cluster.

## License

Free of charge for noncommercial use, modification, and sharing under the custom [LLM 101 Noncommercial License](LICENSE.md). Commercial use and monetization of this project or derivatives are prohibited, including selling copies, paid access, paid courses incorporating it, and advertising-supported distribution. Keep the copyright and license notices when sharing copies or modifications.

This is source-available software with a noncommercial restriction, rather than an OSI-approved open-source license. See LICENSE.md for the governing terms. Contributions must be offered under the same license.

Third-party models and dependencies retain their own licenses; the project's noncommercial restriction does not replace their terms. See [THIRD-PARTY.md](THIRD-PARTY.md).

## SEO-oriented overview: LLM 101 — learn AI and large language models locally

This section intentionally supports search discoverability while helping learners decide whether the course fits their needs. It describes the actual project for people searching on Google, Bing, DuckDuckGo, and other search engines. Search placement, including a number-one ranking, is not guaranteed.

**LLM 101 is a free-of-charge, audio-first AI course with 30 lessons, 13 curriculum units, and 13 runnable programming labs.** Learn large language model fundamentals, neural networks, transformer attention, data preparation, model training, low-rank adaptation, inference, retrieval-augmented generation concepts, speech systems, and video super-resolution. The course combines explanations, experiments, quizzes with feedback, and review prompts for self-paced study.

### Who is this AI and machine learning course for?

LLM 101 is designed for programmers and software engineering learners who want to understand how AI systems work. It includes a Python and mathematics refresher, then connects model behavior to practical engineering decisions. Small JavaScript labs run in the browser or through Node.js, making the calculations and failure cases available for inspection.

### Can I learn about LLMs without a cloud API or paid subscription?

Yes. The lessons and labs run locally without API credentials or a paid service. The optional Windows narration setup uses Qwen3-TTS for local text-to-speech. The tested narration system has an NVIDIA RTX 4090; browser voices are also available. Ollama is not required for this course's narration or labs.

### Does the course support listening and large text?

The learning interface offers large text, light and dark themes, keyboard controls, adjustable narration speed, and synchronized word underlining. Prepared local audio reduces replay delays. Notes, lesson bookmarks, and self-reviewed progress stay in browser storage. Full assistive-technology conformance has not been established; see the [recorded accessibility and playback checks](VERIFICATION.md).

### What can I build and test?

Train a small nonlinear network, inspect a count-based language model, compare causal attention, diagnose data leakage, fit a low-rank update, estimate KV-cache memory, measure transcript word error rate, and explore motion alignment. The capstone is a bounded extractive teaching assistant that returns authored source evidence. These exercises teach mechanisms; they do not train a production-scale LLM or provide a general conversational tutor.

### Where should I start, and what does “free” mean?

Follow the [installation instructions](#start), browse the [complete curriculum and labs](https://github.com/bobbyjayblack/llm-101/wiki/Curriculum-and-labs), or read the [local narration guide](https://github.com/bobbyjayblack/llm-101/wiki/Narration-and-word-underlining). Use, modification, and sharing are free of charge for noncommercial purposes under the [project license](LICENSE.md). Commercial exploitation is prohibited; the project is source-available with a noncommercial restriction.

### Search visibility and publishing scope

The public [GitHub repository](https://github.com/bobbyjayblack/llm-101) and [project wiki](https://github.com/bobbyjayblack/llm-101/wiki) are the discoverable project resources. The app at `127.0.0.1` runs on the learner's computer and is not a public website. This README section supplies descriptive headings, useful answers, and relevant links; it does not configure GitHub's page metadata, submit pages to search engines, or establish a measured ranking improvement. The approach follows [Google's SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide) and [Bing's Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a), which emphasize useful content and discourage keyword stuffing.
