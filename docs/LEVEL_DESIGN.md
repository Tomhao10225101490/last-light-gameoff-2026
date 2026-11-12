# Level design and reproducible space metric · RC1

## Architecture

The retained 4200/4550/4900 layouts in `dist/core.js` are legacy-save compatibility, not the new numerator. Fresh world revision 2 loads `dist/chapters.js` and `dist/world.js` through `Simulation.loadSector`.

Each chapter has six connected sections; each section is 1920×1620 at native scale. Its authored plan selects room structures in four columns and six storeys; explicit stairwell coordinates differ between plans. Furnished observation balconies, split-memory crossings, machinery collision, timed warnings, safe lamps and powered return paths create alternative traversal rather than a single stretched hallway. Surface patterns are shared as architectural vocabulary; the work/story/material families and stairwell/phase arrangements differ. Numeric size alone does not sign off repetition or subjective design quality.

- Boiler: duty rooms → loading passage → steam hall → cooling shaft → return inspection bridge → main valve hall.
- Office: lift lobby → work maze → archive mezzanine → pantry → fire corridor → Gary’s office.
- Roof: machine room → water tower → greenhouse → exterior inspection route → antenna bridges → exit beacon.

Forward exits require that section’s work. The real door collider must open, then the player enters the staged passage. Transitions lock input, animate entry/closing and relocate camera/player under the fade. Earlier sections can be revisited, and completed work remains completed. The final corridor has five seconds of warning before a slower-than-running pursuer starts.

## What is measured

`docs/evidence/baseline/core-baseline.mjs` is extracted from the original non-destructive local working-tree backup, not a historical small ZIP. Its source hash and current geometry hashes are recorded in the audit.

1. Use the same current real player solver, 14×28 body, jump/gravity/speed, phases and 480×270 scale for baseline and expansion.
2. Traverse a graph of actual simulated jump/walk/quiet-walk landings, starting each sampled edge from rest. Newly appearing phase overlap is checked. No enlarged bounds or phase colouring can create a graph edge.
3. For baseline, conservatively include **every archived surface** in the denominator, even components not sampled by the graph. Do not shrink the baseline on an audit miss.
4. For the new numerator, include only graph-reached surfaces. Union same-height intervals, so phase duplicates and coincident landings count once. Subtract body-space occupied by solid machinery. Ignore moving-platform swept area.
5. A screen cell qualifies only if it contains at least **240 px of non-overlapping standing-centre intervals**. Empty cells and isolated slivers do not count. Screen IDs are local to distinct connected sections, not duplicate phase worlds.

Results:

- Boiler: baseline 3964 standing pixels / 9 qualifying cells; expansion 79238 / 144. Ratios 19.99× and 16.0×.
- Office: baseline 4055 / 9; expansion 79330 / 144. Ratios 19.56× and 16.0×.
- Roof: baseline 4209 / 10; expansion 79834 / 144. Ratios 18.97× and 14.4×.

Reproduce with `npm run test:space`. Summary: `docs/evidence/expanded/space-summary.json`; complete nodes, sampled input edges, excluded/unsampled IDs and pre/post-work graphs: `space-audit.json`. Some tiny far-side surfaces under stair landings remain unsampled and are excluded—not silently declared reachable.

## Limits and actual route proof

The graph excludes enemy-aware decision-making, narrative work and global doors. It is a component audit, not a playthrough. Both complete expanded chapter chains were separately played by real browser inputs in `normal-rc1-ready` and `complete-rc1`, with each section’s mechanism committed, every chapter transition completed and the correct ending reached. Their action logs supply the main route; graph data supplies optional-route component evidence.

Neither metric establishes human enjoyment or completion time. Physical-device testing, external route-quality review and full-map profiling remain open review work, not hidden completed tasks.
