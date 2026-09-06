# Repository instructions

## Purpose and scope

LLM 101 is an audio-first AI course implemented with plain HTML, CSS, and JavaScript. All 13 units contain 30 lessons and 13 runnable labs. The capstone is a bounded extractive assistant; a generative conversational tutor remains future work. Read README.md and COURSE-DESIGN.md before changing course behavior.

## Development

- Run `npm start` (or `npm.cmd start` on Windows) and open http://127.0.0.1:4173.
- Run `npm test` for the existing Node.js test suite.
- Check changed JavaScript with `node --check <file>`.
- There is no frontend build step or Node runtime dependency. Qwen narration uses a separate Python/CUDA environment; setup-audio.ps1 installs it. Keep that environment isolated in .venv and model/audio files out of Git.
- Keep lesson content and the original training mathematics in course.js, unit exercises in labs.js (shared by the browser and labs.mjs), interface behavior in app.js, markup in index.html, styling in style.css, and serving in server.mjs. Preserve original lesson indices 0–5 for existing notes and bookmarks.
- The server deliberately exposes only an explicit allowlist of files and binds to loopback. Preserve those boundaries unless a hosting change is requested.
- start.bat/service.ps1 manage both the web server and audio_service.py. Stop only this directory's matching processes, preserve readiness checks, and leave Ollama and unrelated GPU processes alone.
- Qwen VoiceDesign creates synthetic references during setup; the Base model serves narration offline. Preserve narrator identity across passages, cache invalidation, bounded requests, and explicit browser-voice fallback.
- The launcher also manages prerender-audio.mjs. Keep the render plan's text/segmentation identical to playback. Durable course WAVs must bypass GPU locks and survive cache cleanup and interrupted renders. Stop must terminate the render worker as well as both services.

## Accessibility and learner data

- Preserve complete text alternatives, keyboard operation, visible focus, labeled controls, large text, contrast settings, and user-controlled audio.
- Local narration underlines words using cached acoustic timings and the audio clock. Preserve pause/stop/cancellation behavior, segment-to-text offsets, and the passage fallback when timings or browser support are unavailable. Do not claim phonetic accuracy or audible quality from browser events alone.
- Keep progress and notes compatible with the existing localStorage state. Avoid changes that silently erase learner data.
- Do not introduce paid integrations, credentials, microphone/camera collection, or tracking without an explicit task requirement.
- Keep authored quiz feedback and self-reviewed progress clearly distinguished from AI assessment.

## Verification and documentation

- Run the existing tests for code or content changes; add focused tests when behavior warrants them.
- Run `.venv\Scripts\python.exe -m unittest audio_service_test alignment_test` for backend validation. `checks/audio-smoke.py` and `npm run test:browser` exercise real local speech with both services running; browser checks require `npm ci` and Chrome. `node checks/verify-word-timings.mjs` validates the complete saved course timing inventory.
- For interface changes, check navigation, keyboard focus, large text, theme settings, narration controls, and progress persistence as relevant.
- Update README.md when setup or behavior changes. Record actual verification and remaining limitations in VERIFICATION.md; do not claim checks that were not performed.
- Keep COURSE-DESIGN.md explicit about implemented exercises versus design targets. Narrator readiness and completion of the current course audio plan are separate states; preserve that distinction in documentation.
- When asked to update the GitHub wiki, use its separate repository (`https://github.com/bobbyjayblack/llm-101.wiki.git`, branch `master`). Keep curriculum, setup, narration, troubleshooting, and verification pages consistent with the main repository. Preserve historical measurements with their original scope; do not apply six-lesson cache totals to the expanded course.
- Preserve the custom noncommercial terms in LICENSE.md and describe the project as source-available. Do not replace them with a license permitting commercial exploitation unless the owner explicitly requests a licensing change.
- Do not commit credentials, local learner exports, or generated dependency directories.
