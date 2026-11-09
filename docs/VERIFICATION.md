# Verification · 2026-11-09

- Eight Node tests pass: all-floor safe spawns/exits, phase bridges, ascent/descent/landing, variable jump height, vanished platforms, the complete three-step staircase on all floors, item reachability/palette ramps, and coyote time.
- JavaScript syntax checks pass.
- Local HTTP server returns 200 for the game.
- Native Chrome playthrough: all nine tasks collected; boiler → office → rooftop → “You left a light on. For somebody else.” completed using actual game controls. No teleportation, cheats or modified save data.
- Day and night artwork inspected in Chrome. Boiler variants, Gary nameplate/desks and open roof skyline inspected. Rendering scripts produce six actual game views, nearest-neighbor 4× crops and a cover.
- A 32-second WebAudio offline render exercises both arrangements, shift, footsteps on three surfaces, jump, land, pickup, death, phone, door, drip and floor transitions. The final render has zero non-finite samples and zero clipped samples; see media/audio-metrics.json for the numeric peak. Found and removed problematic target automation from the initial offline render; bounded linear ramps now handle these fades.

## Honest limits

The agent triggered audio and inspected the synthesis/output samples. The user also played the online version and explicitly reported: “声音正常，听感满意” (audio is normal and the listening experience is satisfactory). This is user verification; the agent does not claim to have heard computer playback itself. Headphone use was not independently confirmed. The offline WAV remains available for detailed listening review.

No promotional video or synthetic narration was created. No video listening or pronunciation check is claimed. Touch controls and cross-browser/mobile behavior are implemented but have not been tested on physical mobile devices. The three floors share their core traversal geometry; art, narrative and ambience differ.

itch.io initially returned HTTP 429; access later recovered. The user verified the account email. The HTML5 ZIP, cover and four screenshots uploaded successfully; the page was made public. Native Chrome verification of the itch.io embed confirmed start, movement, task pickup, day/night shift and M mute. See SUBMISSION_RECEIPT.md for final jam status.
