import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — "Package Not Found"
  parallel: seconds(7),       // 0:03-0:10 — Compiler vs AI side-by-side
  skepticism: seconds(12),    // 0:10-0:22 — Grace Hopper era parallels
  timeline: seconds(8),       // 0:22-0:30 — Compiler evolution timeline
  closing: seconds(8),        // 0:30-0:38 — "error-correction layer: loading..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
