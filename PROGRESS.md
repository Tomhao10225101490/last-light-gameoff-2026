# Progress · 2.0.0-rc.1

## Current implementation and verified state

- User wants autonomous sustained work, reasonable recovery from transient failures and durable checkpoints, not repeated “continue?” prompts. Global Pi preference is in `~/.pi/agent/AGENTS.md`. Bounded tests and honest session/disconnection limits still apply.
- All prior work preserved. Backups are outside this repo in `../last-light-backups/`. Old root jam ZIPs, dev.1 ZIPs and trailer remain untouched; versioned dev.1 SHA manifest preserved.
- Fresh world revision 2 implements 18 sections (six/chapter), unchanged 480×270 / 14×28 scale, actual 1920×1620 section geometry, two-axis camera, stairwell loops, phase crossings/balconies, machinery, warned hazards, lamps, powered return routes and staged doors.
- Eighteen persistent work sequences and bilingual visible scenes: power/pressure/steam/water/bridge/door work, corrected Gary record, phone, fire-door evacuation, lunchbox slide, plants, warned pursuit, animated normal/full departure. Actor motion is continuous across beats; deep-camera abyss death remains visible.
- Legacy saves are backed up and continue on compatible maps. Restart shift backs up current progress before entering the new expansion. Unknown future schema/world stays read-only.
- Space audit uses archived actual baseline and real physics. All three chapters exceed 10× in documented qualifying-screen and standing-interval metrics: 16×/16×/14.4× screens; 19.99×/19.56×/18.97× standing intervals. Small unsampled surfaces are excluded. This does not replace route/art quality review.
- **52 tests pass**, syntax and real Chrome smoke pass. Exact logs: `docs/evidence/expanded/checks/`.
- **Fresh normal ending: passed, 0 deaths**, `normal-rc1-ready/attempt.json`.
- **Fresh complete ending: passed, 0 deaths**, `complete-rc1/attempt.json`; six clues, corrected record, independent light and 18 mechanisms.
- **Actual completed disk save / 18-section revisit / Chinese journal / reload-resume: passed**, `revisit-rc1/report.json`.
- The harness now closes Chrome gracefully; earlier abruptly killed test profiles had corrupt WAL tails and are preserved as failed evidence, not user-save success claims.
- Real synth review regenerated: 136 s, 120.32 s composition cycle, zero clipped/non-finite samples, about −6.39 dB peak. No subjective listening claim.
- `node scripts/verify-evidence.mjs` checks exact current runtime hashes, fresh rather than resumed runs, both ending conditions, persisted completion, geometry-source hashes and numeric audio. It currently passes.

## Release work

Version is `2.0.0-rc.1`, not a completed universal audiovisual/platform sign-off. Generate HTML/source ZIPs with `npm run package`; then extract HTML to a temporary directory and run browser smoke against it. Keep release/source runtime bytes equal and versioned/latest manifests. Never overwrite historical jam/dev.1 archives or publish without authorization.

## Remaining review — do not invent completion

- Subjective headphone/speaker listening. The model has not listened to the WAV; numeric tests cannot approve perceived quality.
- Physical mobile devices and full Firefox/Safari playthroughs.
- Full-map profiling on target hardware; entrance/headless samples are narrower evidence.
- External final art/design review, including whether architectural repetition and exploration pacing meet the desired final-quality bar.
- Current ending screenshots/action logs exist; no continuous full-run video has been claimed.

These review limits do not negate the implemented expansion or successful whole-game functional tests. They are the reason the deliverable is a release candidate. No invisible background continuation is promised.

## Review / release preparation · 2026-11-12

Re-ran 52 Node tests, syntax checks and exact-runtime evidence validation: passed. Native Chrome confirmed legacy saved-game resume, phase hotkey and pause. Fixed packaging to actually run the evidence gate, replace stale dev.1 acceptance metadata and preserve versioned manifests. Current audiovisual/physical-device limitations remain explicit. User authorized GitHub and platform publication in this session; release confirmation still requires observing remote results.
