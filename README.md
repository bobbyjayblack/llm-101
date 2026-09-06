# LLM 101 — AI, understood

An audio-first introductory unit for a software engineering graduate seeking deep understanding of AI systems. Includes six complete introductory lessons, a toy training experiment, explained quizzes, oral self-checks, notes, and local progress.

## Start

Install Node.js with npm, then run:

```sh
git clone https://github.com/bobbyjayblack/llm-101.git
cd llm-101
npm start
```

Open http://127.0.0.1:4173 in a browser. No dependency installation, API keys, GPU, or paid services are required. Run `npm test` for content and training-example checks. Stop the server with Ctrl+C. On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Windows start and stop shortcuts

With Node.js installed, double-click `start.bat` in this directory to run the web service in the background and open http://127.0.0.1:4173 in your default browser. The browser opens only after the start command succeeds, including when the server is already running. Double-click `stop.bat` to stop it. These launchers work from any working directory, including paths containing spaces. Starting twice leaves the existing server running and opens the course again; stopping twice is harmless.

You can also run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\service.ps1 start` (or `stop`) from this directory. The batch files apply that execution-policy setting only to their PowerShell process; they do not change your system policy. Logs are written to `.service/`, which Git ignores. The stop launcher targets only servers started by these launchers for this directory. If you used `npm start`, stop that server with Ctrl+C in its terminal first.

## Project files

- `index.html` and `style.css`: accessible course interface and themes.
- `app.js`: navigation, narration, quizzes, notes, and saved progress.
- `course.js`: six lessons and the toy training model.
- `course.test.js`: lesson structure and training arithmetic checks.
- `server.mjs`: dependency-free local HTTP server on port 4173.
- `start.bat`, `stop.bat`, and `service.ps1`: Windows background service controls.
- [COURSE-DESIGN.md](COURSE-DESIGN.md): broader curriculum and accessibility goals.
- [VERIFICATION.md](VERIFICATION.md): recorded checks and remaining validation.
- [AGENTS.md](AGENTS.md): repository instructions for coding agents and contributors.

## Narration and access

Choose Reading & audio settings to adjust text, theme, rate, and voice. Read lesson starts from the saved passage. Highlighting is passage-level, not word-level. Each passage has its own replay entry point. Automatic scrolling is off by default. Narration requires browser speech synthesis and an available working voice; actual audio output must be checked on the learner's device. Voice locality is labeled when reported by the browser. Browser or OS voices may use network services.

Tab navigates controls. All content is available without audio. Use operating-system dictation in the notes field if preferred. No microphone, gaze tracking, camera, API credential, or conversational AI integration is included. Quizzes use authored feedback; open explanations are self-assessed with criteria. This is the first sample unit, not a completed professor-replacement course.

Progress and notes use browser local storage and depend on the browser/profile and origin. Download notes to keep a portable text copy. Clearing browser data removes the stored progress. This local server binds to the loopback interface only.

## Learner preferences

- Primary objective: understand and compare AI deeply.
- VSR means Video Super-Resolution; specialization depth deferred until introduction.
- 3–5 hours weekly; synchronized large text and audio; magnification rather than a screen reader as the starting setup.
- Spoken discussion and keyboard coding; Python refresher; mathematics refreshed as needed.
- Windows system inspected: approximately 64 GB RAM, NVIDIA RTX 4090, Intel integrated graphics. GPU memory and runtime readiness have not yet been verified.
- Optional budget ceiling: $100/month, not spending authorization. Current app has no paid integrations.
- First deliverable: accessible app with a complete sample unit. Eye tracking deferred.

The broader roadmap is in COURSE-DESIGN.md. Future work includes a conversational voice teacher grounded in the curriculum, more units, full coding labs, and accessibility validation with the learner's actual magnification and audio setup.

## License

Free of charge for noncommercial use, modification, and sharing under the custom [LLM 101 Noncommercial License](LICENSE.md). Commercial use and monetization of this project or derivatives are prohibited, including selling copies, paid access, paid courses incorporating it, and advertising-supported distribution. Keep the copyright and license notices when sharing copies or modifications.

This is source-available software with a noncommercial restriction, rather than an OSI-approved open-source license. See LICENSE.md for the governing terms. Contributions must be offered under the same license.
