import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Waveform saying "I never said this"
  extraction: seconds(7),      // 0:03-0:10 — 30s audio → extract pitch, rhythm, breathing
  fingerprint: seconds(8),     // 0:10-0:18 — Voice fingerprint reconstructed
  reproduction: seconds(10),   // 0:18-0:28 — Type text → clone speaks
  closing: seconds(7),         // 0:28-0:35 — "Trust layer is the last thing we build"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
