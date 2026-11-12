# Engineering / design decisions

- Expanded world revision 2 is separate from retained-map save compatibility. Legacy v3 values are backed up before interpreting new fields and continue on their original maps; fresh shifts opt into the new chapter architecture automatically.
- Expansion uses authored 4-column/six-storey section plans, explicit stairwell placement, phase gaps, balconies, machines and six distinct work mechanisms per chapter. Door transitions are locked staged actions with positioning/fade, not debug teleport commands. Both exploration density and repeated-layout quality need review; numeric space alone is not final design sign-off.
- Area audit compares the exact archived local geometry at unchanged player/native scale. The denominator conservatively includes ALL baseline surfaces, even ones not sampled by the graph. Numerator counts only physics-graph-reached standing intervals, unions same-height/phase duplicates, excludes moving-platform sweep and subtracts machine-occupied intervals. A qualifying 480×270 screen cell needs at least 240 px of standing intervals. This is component-space evidence, not enemy-aware playthrough acceptance.
- Narrative work commits only after its visible scene; interruption restores at a lamp without silently granting it. Paused scenes do not advance. Final pursuit gives a five-second warning and restarts safely after death. Synthetic voices are not added.
- Persistent autonomy preference is recorded in `~/.pi/agent/AGENTS.md`; it does not override bounded tests, publication authorization or honest session/disconnection limits.

- 2026-11-11: actual baseline is the uncommitted 4200/4550/4900 local build, backed up outside the repo. Historical ZIPs remain unchanged. Do not use W=1450 to claim 10×.
- Runtime remains static Canvas 2D, 480×270, ES modules and WebAudio. No third-party runtime engine.
- Simulation owns gameplay phase. Renderer may interpolate background colours only. Inactive platform deletion is byte-for-byte PNG regression-tested, including transition frames.
- Simulation uses 1/120 s ticks. Browser frames accumulate at most 100 ms and discard inactive time. Edge inputs are consumed once. Focus loss pauses during death and lift sequences too.
- HP is health, never a respawn counter. Instant ghost/abyss kills ignore ordinary damage invulnerability. Only alive/hurt can die; respawning is separately locked.
- Checkpoints are named authored lamps, not arbitrary last-foot positions. Reassembly snaps the camera under the death transition so revival is visible at the lamp, and resets enemy targets.
- Corridor watchers chase horizontally; they do not home vertically onto a player jumping over them. Listeners may approach a noise source in 2D, but only in short range with warning. Wall intersections block motion.
- Ghosts were moved away from unavoidable phase-bridge landings. Rooftop listener is day-phase so an observed night route provides an escape. This preserves contact instant death, not a hidden grace-hit system.
- Legacy saves are backed up before v3 migration. Failed backup or unknown future schema enters read-only saving; neither destroys old data. Restart also backs up the current value.
- E commits task interactions through a brief protected pose; danger does not keep damaging a player while an interaction locks controls. Text does not lock controls or repeat fully after death.
- Normal-input browser testing is bounded: max three deaths and 235 seconds in current route attempt. Controller misses are logged as attempt failures, not conclusive map impossibility. Controlled fixtures never count as whole-game proof.
- The request’s tenfold space, final story staging and full audiovisual direction have NOT been reduced to this foundation patch. They remain open acceptance blockers. Packaging this as a complete upgrade would be false; new archives are explicitly dev/incomplete.
- No public upload, competition submission replacement, trailer modification or destructive Git operation is authorized by routine local implementation work.

- 2026-11-12: Packaging is now fail-closed on verify-evidence.mjs rather than relying on an unenforced documentation instruction. RC metadata describes current functional verification without inventing subjective audio sign-off.
