# Audio direction · expanded RC1

All audio remains locally synthesized with WebAudio; no samples, speech, recorded voices or network audio. Master/music/SFX controls and focus mute are retained.

## Implemented arrangement

- A 512-step cycle at 0.235 seconds/step: **120.32 seconds**, with 16 phrase sections, inversion, rests and register changes rather than one short ostinato.
- Chapter registers/timbres distinguish boiler, office and roof. Six section offsets vary the motif without abandoning its identity.
- Day has the more direct motif; night shifts harmony/timbre. Complete departure returns toward a major resolution.
- Narrative scenes smoothly duck a separate story gain stage. Pursuit adds a restrained pulse/noise layer, not an unbounded volume jump.
- Steam/metal, footstep materials, valves, water, paper/evidence, handle/open/close, phone, three-pulse warning, ordinary/ghost/fall death and reassembly have separate cues. Ghost alerts are spatialized and distance-attenuated.
- Voice reservation is bounded; nodes disconnect at end. Compressor/limiter and gain ramps remain. No narration has been added.

## Numeric review

`scripts/render-audio.mjs` renders the actual synth into `media/audio-review.wav`: 136 seconds covering one full arrangement cycle, three chapter registers, six section variations each, phase transitions, work, narrative ducking, pursuit, resolution and SFX.

`media/audio-metrics.json` reports zero clipped/non-finite samples and approximately −6.39 dB peak for this render. Sample continuity is recorded at the 120.32-second boundary. These values are objective render checks, not proof of a subjectively seamless loop or good loudspeaker balance.

## Listening status

**NOT LISTENED by the assistant.** No headphone/speaker quality approval, pronunciation review or listening testimonial is claimed. Subjective balance, fatigue over long exploration and the final emotional arc still require actual listening. The release is labelled RC accordingly; the existing trailer is unchanged and not revalidated against this audio.
