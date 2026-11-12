# Animation implementation

State ownership: `dist/player-state.js`, `dist/simulation.js`, `dist/doors.js`. Drawing: `dist/art.js`.

- alive/hurt/dying/respawning are independent simulation states.
- Ordinary damage: 0.22 s reaction, 0.8 s ordinary immunity, modest knockback; ghost instant kill still applies.
- Ghost death: immediate input lock; arms converge, knees/feet lift, headlamp extinguishes, silhouette fades. Non-gory. Pose refinement still pending; this is not a final animation-quality sign-off.
- Fall: downward spread pose/fade at screen edge; distinct synthesized falling effect.
- HP death: leg/arm collapse and body fall.
- Dying 0.9 s → lamp reassembly 0.65 s → alive. Camera relocates at the transition, not after control returns. Repeated death may skip the final dying interval using Space/E.
- Interaction: 0.55 s protected crouch/arm pose; permanent task changes committed at completion.
- Lift: opening 0.4 s → entry 0.45 s → closing 0.4 s → transition 0.65 s.
- Ordinary door: actual perspective panel and handle, 0.4 s open/close, collision until openness >=0.82. Occupied threshold reopens.
- Phase: 0.22 s local pixel ripple; background colour interpolation is visual only. No old-platform frame cache or full-screen white flash.

Controlled continuous-frame evidence: `docs/evidence/components/manifest.json`, with PNG sequences for ghost/fall/HP death, reassembly and lift. These are component fixtures, not recordings of a normal full run. Real captured game-position animation footage and the full final-quality pose sheet remain unverified.
