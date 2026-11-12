# LAST LIGHT workspace rules

- Continue existing Canvas 2D / ES modules / WebAudio architecture at 480×270. Do not replace local changes with old ZIPs.
- Baseline: docs/BASELINE_AUDIT.md; archived W=1450 is not the expansion denominator.
- Keep keyboard/touch, Chinese/English, jump buffering, short jump, coyote time and focus pause.
- One authoritative gameplay phase controls rendering, collision, hazards and enemies. Inactive platforms produce no pixels or hints.
- Ordinary damage costs HP; active ghosts and abyss kill immediately. Death is idempotent; respawning is separate and safe.
- Save migration backs up legacy values first. Do not delete user progress, unrelated files or the trailer.
- Run npm test, npm run check and Chrome smoke after engine changes. Browser smoke and component fixtures are NOT full playthrough evidence.
- Automated playtests stop after 3 repeated failures or a bounded timeout. No infinite retry logs.
- Never claim 10× effective space from empty boundaries, repeated corridors, duplicated phases or unverified reachability.
- Publish only with explicit authorization. Keep old jam archives; new packages must identify their actual acceptance status.
- Keep PROGRESS.md and DECISIONS.md current. Mark unverified items, especially endings, audiovisual listening and mobile physical devices.
- No synthetic narration without disclosure, no invented voice identity or testimonials. Competition presentations open with a human problem and require full audiovisual review.
