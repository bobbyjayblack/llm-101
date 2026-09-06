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

Double-click `start.bat` to run both services in the background and open the course in your default browser. Double-click `stop.bat` to stop both services and unload the audio model from GPU memory. Starting again reuses downloaded models, saved voices, and generated audio. Starting twice reuses the running services; stopping twice is harmless. The launchers use paths relative to their own directory.

You can also run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\service.ps1 start` (or `stop`) from this directory. The batch files apply that execution-policy setting only to their PowerShell process; they do not change your system policy. Logs are written to `.service/`, which Git ignores. The stop launcher targets only servers started by these launchers for this directory. If you used `npm start`, stop that server with Ctrl+C in its terminal first.

The web service binds to `127.0.0.1:4173`; Qwen's Python audio service binds to `127.0.0.1:4174`. Ollama is not needed for this TTS workflow and is not started or stopped by these scripts. Only this project's processes are managed. A failed start cleans up services it launched; it does not terminate unrelated processes occupying either port.

## Local narrator

Reading & audio settings defaults to **Local AI narrator**, with three AI-designed female voices: **Claire** (gentle American, default), **Grace** (warm American), and **Helen** (refined American). Use **Preview voice** to compare them. Close settings to use the main pause/resume and stop controls. Lesson text, questions, feedback, self-check criteria, and experiment results all use the selected audio source.

Claire uses a soft, rounded, velvety tone with a subtle whimsical lilt at a steady conversational pace. Speaking speed remains controlled separately by your saved speed setting.

Qwen3-TTS-12Hz-1.7B-VoiceDesign creates short reference recordings during setup. The companion 1.7B-Base model reuses those references for a consistent narrator. Only the Base model remains loaded during ordinary use. Both run through the official `qwen-tts` package with CUDA PyTorch and Windows-compatible SDPA attention. Model revisions are pinned in `audio_service.py`.

Speech is generated in short segments. The next segment is prepared during playback; passages stay highlighted as their audio plays. First readings may pause for generation, especially at faster playback speeds. Replays use a disk cache. Playback speed changes preserve pitch. Stop cancels playback and pending browser requests immediately; a segment already being computed may finish and enter the cache. `stop.bat` terminates that work and releases the model.

For uninterrupted first-time lesson playback, select **Prepare lesson audio** before listening. It saves the current lesson's narration with a visible progress count. You can read while it works or cancel it; completed segments stay cached. Selecting Play or changing lessons/voices cancels preparation and starts the requested action.

Models live in `.models/`; voice references and a disposable cache (approximately 1 GB maximum) live in `.audio/`. These files and `.venv/` are excluded from Git. Normal narration runs with Hugging Face/Transformers offline mode enabled. Only initial setup or explicitly rerunning setup downloads files. Browser voices remain an optional fallback and may use network services.

To change voice descriptions, edit `voices.json`, stop both services, then run `start.bat`. Changed descriptions or seeds generate new references without reusing old cached speech. To repair a missing environment, model, or reference, stop the services and run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\setup-audio.ps1`, then start again. Check `.service/audio-stderr.log` for audio failures and `.service/stderr.log` for web failures. Use **Check narrator status** after restarting a service. If GPU memory is exhausted, close other GPU-heavy applications and restart.

## Development checks

Run `npm test` for content, playback-state, and HTTP-boundary tests, and `.venv\Scripts\python.exe -m unittest audio_service_test` for speech request validation. For real-model checks with both services running, run `.venv\Scripts\python.exe checks\audio-smoke.py`; it saves preview WAVs and timings under `.service/`. For browser integration checks, run `npm ci` and `npm run test:browser` with Google Chrome installed. Playwright is a development dependency only.

## Project files

- `index.html` and `style.css`: accessible course interface and themes.
- `app.js` and `narration.js`: course behavior, browser speech, and local audio playback.
- `course.js`: six lessons and the toy training model.
- `course.test.js`: lesson structure and training arithmetic checks.
- `server.mjs`: Node HTTP server and same-origin audio proxy on port 4173.
- `audio_service.py`, `voices.json`, and `requirements-audio.txt`: local Qwen speech generation, narrator definitions, and Python dependencies.
- `setup-audio.ps1`: installs the audio runtime, downloads models, and creates narrator references.
- `start.bat`, `stop.bat`, and `service.ps1`: Windows background service controls.
- [COURSE-DESIGN.md](COURSE-DESIGN.md): broader curriculum and accessibility goals.
- [VERIFICATION.md](VERIFICATION.md): recorded checks and remaining validation.
- [AGENTS.md](AGENTS.md): repository instructions for coding agents and contributors.

## Narration and access

Choose Reading & audio settings to adjust text, theme, rate, audio source, and voice. Read lesson starts from the saved passage. Highlighting is passage-level, not word-level. Each passage has its own replay entry point. Automatic scrolling is off by default. Local narration uses normal browser audio playback; the browser-voice fallback requires speech synthesis and an available voice. Actual voice comfort and pronunciation should be evaluated on the learner's device.

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
