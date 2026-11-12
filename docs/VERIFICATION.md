# Archived verification · original submission · 2026-11-09

> Historical record only. These original-build results do NOT verify the current 2.0.0-dev.1 runtime. Current evidence and failed gates are in TEST_REPORT.md, PLAYTHROUGH.md and ACCEPTANCE.md.

- Eight Node tests pass: all-floor safe spawns/exits, phase bridges, ascent/descent/landing, variable jump height, vanished platforms, the complete three-step staircase on all floors, item reachability/palette ramps, and coyote time.
- JavaScript syntax checks pass.
- Local HTTP server returns 200 for the game.
- Native Chrome playthrough: all nine tasks collected; boiler → office → rooftop → “You left a light on. For somebody else.” completed using actual game controls. No teleportation, cheats or modified save data.
- Day and night artwork inspected in Chrome. Boiler variants, Gary nameplate/desks and open roof skyline inspected. Rendering scripts produce six actual game views, nearest-neighbor 4× crops and a cover.
- A 32-second WebAudio offline render exercises both arrangements, shift, footsteps on three surfaces, jump, land, pickup, death, phone, door, drip and floor transitions. The final render has zero non-finite samples and zero clipped samples; see media/audio-metrics.json for the numeric peak. Found and removed problematic target automation from the initial offline render; bounded linear ramps now handle these fades.

## Honest limits

The agent triggered audio and inspected the synthesis/output samples. The user also played the online version and explicitly reported: “声音正常，听感满意” (audio is normal and the listening experience is satisfactory). This is user verification; the agent does not claim to have heard computer playback itself. Headphone use was not independently confirmed. The offline WAV remains available for detailed listening review.

No promotional video or synthetic narration was created. No video listening or pronunciation check is claimed. Touch controls and cross-browser/mobile behavior are implemented but have not been tested on physical mobile devices. The original submitted build used shared traversal geometry across its three floors.

## Expanded horror development build

The local `dist/` build now has three independent 4200–4900 pixel layouts, fully hidden inactive phase platforms, three hit points, damaging machinery, moving ghosts with instant-kill executions, separate damage/death/revival states, animated lift doors, faster phase-transition effects, revised horror writing and expanded environment dressing. Nine Node tests and JavaScript syntax checks pass. The media and offline audio render scripts also complete with zero clipped or non-finite audio samples.

This expanded build has **not yet received a complete native-browser playthrough, mobile test, difficulty/balance pass, full subjective listening review, or trailer synchronization review**. The archived HTML5 ZIP and public itch.io build should not be replaced until those checks are complete.

itch.io initially returned HTTP 429; access later recovered. The user verified the account email. The HTML5 ZIP, cover and four screenshots uploaded successfully; the page was made public. Native Chrome verification of the itch.io embed confirmed start, movement, task pickup, day/night shift and M mute. See SUBMISSION_RECEIPT.md for final jam status.
