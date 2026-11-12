# LAST LIGHT · One More Shift
## 《最后一盏灯：再值一班》

**Local release candidate: `2.0.0-rc.1`. Expanded gameplay and both endings verified; subjective listening and external-device review remain unverified.**

Eli is a living adult returning to finish a handover. Day is 17:59 before the fire; night is what remained at 18:00. Twelve years ago Gary returned to release the fire doors, but the register incorrectly said he had already evacuated. The task is to acknowledge the person the record omitted—not to kill an evil Gary.

![Expanded development composition](media/cover.png)

## Play locally

```sh
npm ci
npm start
```

Open **http://127.0.0.1:8786/**. Any static server can serve `dist/`. No runtime libraries, accounts, remote assets or network services are needed. Native resolution remains **480×270**, with unchanged **14×28** player collision and normal camera scale.

**Existing saves:** pre-expansion saves are backed up and continue on their original compatible maps. To enter the expanded game from an old save, choose **Restart shift** at the bottom of the page; the existing save is backed up first. Fresh saves enter the expansion automatically. Do not clear local storage to migrate.

- A/D or arrows: move; hold C for quiet walking.
- Space / W / up: jump; release early for a short jump.
- Shift / X: switch memories. E / down: work, clues, doors, exit light.
- J: journal. M: mute. Esc: pause/resume. Touch controls remain available.
- Settings adjust master/music/SFX volume and reduce flash effects.
- Scenes advance automatically. E can advance a beat after its minimum animation time; the departure has a longer minimum so its actors can finish leaving.

## Expanded chapters

Each chapter now contains **six separately authored sections**, connected by collision-aware, staged doors:

- **Boiler:** duty rooms, loading passage, steam hall, cooling shaft, return inspection bridge, main valve hall.
- **Office:** lift lobby, work maze, archive mezzanine, pantry, fire corridor, Gary’s office.
- **Roof:** machine room, water tower, greenhouse, exterior inspection route, antenna bridges, exit beacon.

Each section spans 1920×1620 at the original scale, with horizontal galleries, explicitly placed stairwells, observation balconies, split-phase crossings, solid machinery, warned timed hazards, named lamps and powered return routes. Work persists through death and chapter return. Camera movement is genuinely two-axis; bounds alone are not counted as exploration.

The reproducible space audit uses the **actual archived local 4200/4550/4900 baseline**, never the old 1450-wide ZIP. It unions phase duplicates, excludes empty bounds and moving-platform sweep, subtracts machine-occupied standing intervals, and counts only physics-graph-reached surfaces. Qualifying occupied-screen ratios are **16.0× / 16.0× / 14.4×**; standing-interval ratios are **19.99× / 19.56× / 18.97×**. Definitions, conservative baseline denominator and limitations: `docs/LEVEL_DESIGN.md`, `docs/evidence/expanded/space-summary.json`. Numeric density is not a substitute for subjective route/art quality review.

## Story, animation and sound

- Eighteen work mechanisms and bilingual sequences: pressure release, restored machinery, corrected register, ringing phone, Gary holding the fire release while people escape, lunchbox sliding through the gap, water/plant changes, and a five-second-warned final pursuit.
- Normal and complete endings have staged departure animations. The complete ending requires all six evidence records, the corrected register and the independently powered exit lamp. Harmless memory figures are separate from lethal enemy collision.
- Three HP; ordinary immunity; ghost/abyss instant death; idempotent dying and separate safe lamp reassembly. Inactive phase platforms draw no pixels or hints and have no collision.
- Chapter/section material families, distinct memory actors, readable warning states, continuity across scene beats, and visible abyss death at deep camera positions.
- 120.32-second synth arrangement cycle, section variation, phase/chapter timbres, narrative ducking, pursuit and resolution layers, spatial alerts and separate mix controls. The actual 136-second review render has zero clipped/non-finite samples. **It has not been subjectively listened to.**

## Verification

Both **fresh-game → normal ending** and **fresh-game → complete ending** passed through real Chrome mouse/keyboard input, with **zero deaths in each run**. These were not coordinate/save-injected runs. A genuine completed browser profile was then reopened, revisited, switched to Chinese, journal-checked and reloaded successfully. Input/action logs, runtime hashes and real scene/ending screenshots are preserved in `docs/evidence/expanded/`.

**52 tests pass**, covering retained-map compatibility and expanded-world behaviour. See `docs/TEST_REPORT.md` and `docs/PLAYTHROUGH.md` for exact evidence and earlier failures.

```sh
npm test
npm run check
npm run test:space                 # conservative physics-component space audit
npm run test:browser               # smoke/layout, not whole-game proof
npm run test:playthrough           # bounded expanded normal-ending input run
ENDING=complete npm run test:playthrough
npm run test:revisit               # uses the preceding completed test profile
node scripts/verify-evidence.mjs   # rejects stale checked-in RC evidence
node scripts/render-audio.mjs      # numeric synth review, not a listening test
node scripts/render-media.mjs      # explicitly controlled composition previews
npm run package                   # local RC archives only; never publishes
```

Chrome defaults to the macOS installation; override `CHROME`. Playtests stop at three deaths, a stalled-goal bound or their overall deadline. Test browsers now close gracefully so the harness does not damage its own profile storage.

## Packages and remaining review

`releases/last-light-2.0.0-rc.1-html5.zip` contains the actual playable root `index.html`. The matching source ZIP includes runtime, source, tests, documentation and evidence. Runtime members are byte-compared; exact hashes are in `releases/SHA256.json` and its versioned copy.

Still unverified: subjective headphone/speaker listening, physical touch devices, full Firefox/Safari runs, full-map target-device performance and external final art/design sign-off. Desktop/headless smoke and numeric audio checks are not those reviews. This is a release candidate, not a fabricated all-platform sign-off.

Historical root jam ZIPs, dev.1 archives, [itch.io game](https://tomhao.itch.io/last-light), [jam entry](https://itch.io/jam/game-off-2026/rate/5327077) and the existing `LAST_LIGHT_trailer.mp4` have not been replaced or publicly republished.

## Credits and disclosure

Created with AI assistance for code, procedural pixel art, synthesized music/SFX, writing and testing. No claim of hand-pixelled art, recorded voices, personal testimony or measured human impact. No external runtime artwork, fonts or audio samples. Fictional characters/events; no voice impersonation or synthetic narration. Original source/content use MIT; dependency licenses remain their owners’. Author / entrant: Tomhao10225101490.
