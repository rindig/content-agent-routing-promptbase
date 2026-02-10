import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — Company email + usage spike/crash
  confusion: seconds(9),      // 0:03-0:12 — People confused, abandoning tool
  tenPercent: seconds(10),    // 0:12-0:22 — 10% adoption stat
  alternative: seconds(8),    // 0:22-0:30 — Problem-first approach
  closing: seconds(8),        // 0:30-0:38 — "Start with the problem. Not the tool."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
