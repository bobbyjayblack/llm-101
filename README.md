# LLM 101 — AI, understood

An audio-first introductory unit for a software engineering graduate seeking deep understanding of AI systems. Includes six complete introductory lessons, a toy training experiment, explained quizzes, oral self-checks, notes, and local progress.

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

## Local narrator

Reading & audio settings defaults to **Local AI narrator**, with three AI-designed female voices: **Claire** (gentle American, default), **Grace** (warm American), and **Helen** (refined American). Use **Preview voice** to compare them. Close settings to use the main pause/resume and stop controls. Lesson text, questions, feedback, self-check criteria, and experiment results all use the selected audio source.

Claire uses a soft, rounded, velvety tone with a subtle whimsical lilt at a steady conversational pace. Her delivery is directed toward connected speech: gently linked word endings and beginnings, lighter unstressed words, and emphasis across whole phrases. Speaking speed remains controlled separately by your saved speed setting.

Playback now defaults to **1.3×**. Existing settings receive this change once on reload; subsequent manual speed choices remain saved. Local playback preserves pitch and reuses the same voice recordings.

**Spoken words are underlined** in the lesson and visible practice text. A local Wav2Vec2 speech model aligns the text to each recording; the player follows those saved timings using the audio clock, including after speed changes and pause/resume. Connected words advance smoothly; longer silences clear the underline. Stop, replay, lesson changes, and narrator changes clear stale highlighting. The voice and recordings are unchanged.

Setup downloads the pinned alignment model (approximately 360 MB); alignment runs on the CPU and its files are cached in `.audio/timings/`. The background course renderer prepares these alongside the WAVs, and **Prepare lesson audio** also prepares word timings for the chosen narrator. For uncached text, playback can begin before alignment finishes; underlining joins when timings arrive. Missing timings do not delay or prevent audio playback. Acoustic boundaries are estimates, especially for numbers, acronyms, and unusual pronunciations.

Qwen3-TTS-12Hz-1.7B-VoiceDesign creates short reference recordings during setup. The companion 1.7B-Base model reuses those references for a consistent narrator. Only the Base model remains loaded during ordinary use. Both run through the official `qwen-tts` package with CUDA PyTorch and Windows-compatible SDPA attention. Model revisions are pinned in `audio_service.py`.

Claire's lesson narration is pre-rendered automatically in batches of up to four segments. The current unit contains 127 unique segments: all 84 lesson-reading segments first, followed by static questions, feedback, self-check material, and preview text. Progress appears under the player status. Once saved, a segment is served immediately from disk, bypassing the model's generation queue even when the GPU is busy. The player fetches the following segment ahead of time. Passage highlighting and pitch-preserving speed control remain available.

The first pre-render takes time; completed passages can be played while the remaining ones are generated. New text, changed voices/content, other narrators, and dynamic experiment-result readings may still require synthesis. The next start automatically fills missing Claire recordings. Unchanged recordings are reused. Stop in the player stops playback; `stop.bat` also stops the background render and unloads the model. Completed recordings survive interruption.

**Prepare lesson audio** remains available to prepare a chosen lesson or another narrator on demand. It shows progress and can be canceled independently of the automatic Claire render. Selecting Play or changing lessons/voices cancels this manual preparation and starts the requested action.

Models live in `.models/`; voice references live in `.audio/voices/`. Durable pre-rendered recordings live in `.audio/course/` and are not removed by temporary-cache cleanup. Other generated speech uses `.audio/cache/` (approximately 1 GB maximum). These files and `.venv/` are excluded from Git. Normal narration runs with Hugging Face/Transformers offline mode enabled. Only initial setup or explicitly rerunning setup downloads files. Browser voices remain an optional fallback and may use network services.

To change voice descriptions, edit `voices.json`, stop both services, then run `start.bat`. Changed descriptions or seeds generate new references without reusing old cached speech. To repair a missing environment, model, or reference, stop the services and run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\setup-audio.ps1`, then start again. Check `.service/audio-stderr.log` for audio failures and `.service/stderr.log` for web failures. Use **Check narrator status** after restarting a service. If GPU memory is exhausted, close other GPU-heavy applications and restart.

For pre-render progress or errors, see `.service/prerender-claire.json` and `.service/prerender-stderr.log`. Running `start.bat` again retries an exited worker. It never creates a duplicate launcher-managed worker. Old voice versions remain separate on disk and are not used for a changed voice.

## Development checks

Run `npm test` for content, playback-state, and HTTP-boundary tests, and `.venv\Scripts\python.exe -m unittest audio_service_test` for speech request validation. For real-model checks with both services running, run `.venv\Scripts\python.exe checks\audio-smoke.py`; it saves preview WAVs and timings under `.service/`. For browser integration checks, run `npm ci` and `npm run test:browser` with Google Chrome installed. Playwright is a development dependency only.

After preparing lesson 1, run `node checks/playback-latency.mjs` to measure actual browser playback onset and segment transitions at 1.3x, and verify speed migration and preference persistence. `node checks/verify-prerender.mjs` checks every planned recording through the live speech endpoint once preparation is complete.

Run `.venv\Scripts\python.exe -m unittest alignment_test` for alignment-path and number/punctuation handling checks. After course preparation, `node checks/verify-word-timings.mjs` checks word coverage, timestamp ordering, recording bounds, and response times for every course clip.

## Project files

- `index.html` and `style.css`: accessible course interface and themes.
- `app.js` and `narration.js`: course behavior, browser speech, and local audio playback.
- `course.js`: six lessons and the toy training model.
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

Tab navigates controls. All content is available without audio. Use operating-system dictation in the notes field if preferred. No microphone, gaze tracking, camera, API credential, or conversational AI integration is included. Quizzes use authored feedback; open explanations are self-assessed with criteria. This is the first sample unit, not a completed professor-replacement course.

Progress and notes use browser local storage and depend on the browser/profile and origin. Download notes to keep a portable text copy. Clearing browser data removes the stored progress. This local server binds to the loopback interface only.

## Learner preferences

- Primary objective: understand and compare AI deeply.
- VSR means Video Super-Resolution; specialization depth deferred until introduction.
- 3–5 hours weekly; synchronized large text and audio; magnification rather than a screen reader as the starting setup.
- Spoken discussion and keyboard coding; Python refresher; mathematics refreshed as needed.
- Windows system verified: approximately 64 GB RAM, Intel i9-13900K, NVIDIA RTX 4090 with 24 GB VRAM. Local Qwen narration runs on CUDA.
- Optional budget ceiling: $100/month, not spending authorization. Current app has no paid integrations.
- First deliverable: accessible app with a complete sample unit. Eye tracking deferred.

The broader roadmap is in COURSE-DESIGN.md. Future work includes a conversational voice teacher grounded in the curriculum, more units, full coding labs, and accessibility validation with the learner's actual magnification and audio setup.

## License

Free of charge for noncommercial use, modification, and sharing under the custom [LLM 101 Noncommercial License](LICENSE.md). Commercial use and monetization of this project or derivatives are prohibited, including selling copies, paid access, paid courses incorporating it, and advertising-supported distribution. Keep the copyright and license notices when sharing copies or modifications.

This is source-available software with a noncommercial restriction, rather than an OSI-approved open-source license. See LICENSE.md for the governing terms. Contributions must be offered under the same license.

Third-party models and dependencies retain their own licenses; the project's noncommercial restriction does not replace their terms. See [THIRD-PARTY.md](THIRD-PARTY.md).
