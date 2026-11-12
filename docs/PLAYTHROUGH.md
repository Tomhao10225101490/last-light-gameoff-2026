# Expanded normal-input playthrough ledger · RC1

## Method

`scripts/browser-expanded.mjs` serves the real dist in isolated Chrome, clicks visible UI and sends keyboard events. It reads the read-only diagnostic snapshot. Geometry/AI prediction runs outside the browser. It does not set player coordinates, edit saves, step the browser simulation or teleport through debug APIs.

Every attempt is bounded: three deaths, an overall deadline, an 11-second unchanged-support guard and a 30-second non-improving-goal guard. Recoverable startup failures receive bounded reload retries. Browser shutdown is graceful and waits for actual exit; it does not SIGTERM a writing profile as routine teardown.

## Current exact-runtime passes

- **Normal:** `docs/evidence/expanded/normal-rc1-ready/attempt.json`. Fresh profile, all 18 sections/work mechanisms, normal departure, **0 deaths**, 433.397 seconds of automated input timeline. Final save readback and normal browser exit recorded.
- **Complete:** `docs/evidence/expanded/complete-rc1/attempt.json`. Fresh profile, all 18 mechanisms, six clues, corrected register, independent lamp, full departure, **0 deaths**, 464.216 seconds. Final save readback and normal browser exit recorded.
- **Persistence/UI:** `docs/evidence/expanded/revisit-rc1/report.json`. Actual completed profile reopened from disk; 3 chapter + 18 visited-section buttons; archive revisit; Chinese journal retains 16 task/clue/correction entries; page reload and normal resume retain all 18 mechanisms and six clues.

These times describe the automated controller, not a measured human completion time. `node scripts/verify-evidence.mjs` rejects changed runtime hashes, continuations presented as new games, incorrect endings, missing work and unsaved completion.

Real scene/ending screenshots are alongside reports. Timestamped actions are retained. Captures at scene beats are not a continuous movie; no movie or listening review is fabricated.

## Earlier failures preserved

Original corridor attempts are under `docs/evidence/playthrough/` and `docs/evidence/dev2/`. They are historical, not expanded-map proof.

Expanded failures exposed a genuinely locked door state after its work flag changed; a navigation surface incorrectly spanning both sides of a solid machine; stale pre-work route graphs after a new bridge appeared; controller cycles and poorly timed watcher evasion. Fixes use actual unlock state, split support identities, post-work graphs, strictly improving navigation and enemy-aware detours. They do not grant hidden ghost invulnerability.

One run reached the ordinary ending with all six clues but had not pressed the independent lamp; it was correctly recorded as a failed complete-ending attempt. The final controller explicitly visits the light.

Old test teardown abruptly killed Chrome and left a corrupt trailing LevelDB record in an isolated test profile. Read-only WAL diagnosis found the corrupt record; no user profile was repaired/deleted. A fresh profile with graceful close passed integrity sampling and the final full-run/disk-reopen checks. Failed profiles/reports remain evidence; they are not the successful RC source profile.

## Reproduce

`npm run test:playthrough` starts a new normal-ending profile. `ENDING=complete npm run test:playthrough` starts a new full-ending profile, followed by `npm run test:revisit`. The revisit tool copies the real completed profile without changing save values so repeated UI checks do not consume its original ending state. Override `SOURCE_REPORT` for another completed fresh run.

Retained-map fixtures, space graphs and controlled render previews remain explicitly separate from full-game proof. Physical mobile, full alternate-browser runs and subjective audio review are still unverified.
