# Repository instructions

## Purpose and scope

LLM 101 is an audio-first introductory AI course implemented with plain HTML, CSS, and JavaScript. Six lessons are available; the complete curriculum and conversational tutor are future work. Read README.md and COURSE-DESIGN.md before changing course behavior.

## Development

- Run `npm start` (or `npm.cmd start` on Windows) and open http://127.0.0.1:4173.
- Run `npm test` for the existing Node.js test suite.
- Check changed JavaScript with `node --check <file>`.
- There is no build step or external runtime dependency. Keep changes focused and preserve this simple architecture unless the task requires otherwise.
- Keep lesson content and training mathematics in course.js, interface behavior in app.js, markup in index.html, styling in style.css, and serving in server.mjs.
- The server deliberately exposes only an explicit allowlist of files and binds to loopback. Preserve those boundaries unless a hosting change is requested.

## Accessibility and learner data

- Preserve complete text alternatives, keyboard operation, visible focus, labeled controls, large text, contrast settings, and user-controlled audio.
- Narration highlights whole passages. Do not claim word-level synchronization or verified audible quality from browser events alone.
- Keep progress and notes compatible with the existing localStorage state. Avoid changes that silently erase learner data.
- Do not introduce paid integrations, credentials, microphone/camera collection, or tracking without an explicit task requirement.
- Keep authored quiz feedback and self-reviewed progress clearly distinguished from AI assessment.

## Verification and documentation

- Run the existing tests for code or content changes; add focused tests when behavior warrants them.
- For interface changes, check navigation, keyboard focus, large text, theme settings, narration controls, and progress persistence as relevant.
- Update README.md when setup or behavior changes. Record actual verification and remaining limitations in VERIFICATION.md; do not claim checks that were not performed.
- Preserve the custom noncommercial terms in LICENSE.md and describe the project as source-available. Do not replace them with a license permitting commercial exploitation unless the owner explicitly requests a licensing change.
- Do not commit credentials, local learner exports, or generated dependency directories.
