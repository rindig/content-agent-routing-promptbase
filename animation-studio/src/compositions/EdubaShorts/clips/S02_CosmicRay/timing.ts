import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — "Works on my machine" split screen
  cosmicZoom: seconds(5),     // 0:03-0:08 — Particle from space to chip
  bitFlip: seconds(10),       // 0:08-0:18 — Vote counter jump, binary display
  eccDefense: seconds(10),    // 0:18-0:28 — Devices being hit, shields catching
  closing: seconds(7),        // 0:28-0:35 — "Mostly."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
