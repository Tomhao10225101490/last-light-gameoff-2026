# Pixel art direction

## Runtime

480×270 Canvas 2D, nearest-neighbour scaling, unchanged 14×28 player collision. Existing four-step warm machinery / cool ruins palettes and upper-left lighting are retained. Source: `dist/art.js`, authored procedural shapes; no external art or fonts added.

This revision adds readable emergency lamps, evidence prompts, visual enemy alerts, distinct watcher/listener head silhouettes, perspective-hinged inspection door, localized phase ripple and wrapped bilingual text. A two-axis camera follows the optional vertical inspection alcove. Inactive platforms are completely excluded before any glow, body or decoration output.

## Honest quality status

Most background families still come from the earlier procedural version. Cylinder construction, burnt office partitions, greenhouse glass, authored subarea silhouettes, richer material groups and the final character pose sheet are NOT fully finished. The optional alcove is an integration sample, not a final-quality art sign-off.

`media/floor-*.png` and cover use actual renderer/data with controlled starting compositions. They are NOT whole-game playthrough evidence; see `media/RENDER_NOTES.md`. Real browser screenshots are under `docs/evidence/baseline/browser/` and `docs/evidence/current/browser/`.

## Licenses

No third-party game art, audio samples, recorded voices or downloaded fonts. New code-authored art and source remain MIT with the project. Development-only @napi-rs/canvas and node-web-audio-api retain their own package licenses. No manually hand-pixelled human-authorship claim is made. The pre-existing trailer is not reverified or republished.
