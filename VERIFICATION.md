# First-unit verification

Checked on 2026-09-06.

## Windows service launchers

Checked on 2026-09-06 after adding start.bat, stop.bat, and service.ps1:

- Started the background server and received HTTP 200 from the course page.
- Repeated start detected the running server; stop ended it; repeated stop succeeded without an error.
- A second directory's launcher rejected the occupied port, and its stop command left the original directory's server running.
- Started and stopped a copy in a path containing spaces while using a different working directory.
- All three existing Node tests passed. Test servers were stopped after verification.
- Batch launchers were executed from a terminal; Explorer double-click interaction was not separately tested.

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
