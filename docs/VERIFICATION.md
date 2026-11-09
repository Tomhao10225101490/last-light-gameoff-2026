# Verification · 2026-11-09

- Eight Node tests pass: all-floor safe spawns/exits, phase bridges, ascent/descent/landing, variable jump height, vanished platforms, the complete three-step staircase on all floors, item reachability/palette ramps, and coyote time.
- JavaScript syntax checks pass.
- Local HTTP server returns 200 for the game.
- Native Chrome playthrough: all nine tasks collected; boiler → office → rooftop → “You left a light on. For somebody else.” completed using actual game controls. No teleportation, cheats or modified save data.
- Day and night artwork inspected in Chrome. Boiler variants, Gary nameplate/desks and open roof skyline inspected. Rendering scripts produce six actual game views, nearest-neighbor 4× crops and a cover.
- A 32-second WebAudio offline render exercises both arrangements, shift, footsteps on three surfaces, jump, land, pickup, death, phone, door, drip and floor transitions. The final render has zero non-finite samples and zero clipped samples; see media/audio-metrics.json for the numeric peak. Found and removed problematic target automation from the initial offline render; bounded linear ramps now handle these fades.

## Honest limits

The agent can trigger audio and inspect synthesis/output samples, but the current tools do not provide auditory perception of computer playback. A full subjective headphone listen has **not** been verified. Therefore “close your eyes and it sounds hand-made,” perceived loudness matching and final musical taste are not claimed as accepted. The offline WAV is provided for that review.

No promotional video or synthetic narration was created. No video listening or pronunciation check is claimed. Touch controls and cross-browser/mobile behavior are implemented but have not been tested on physical mobile devices. The three floors share their core traversal geometry; art, narrative and ambience differ.

itch.io initially returned HTTP 429 in the user's Chrome. Submission status must be recorded separately from implementation completion.
