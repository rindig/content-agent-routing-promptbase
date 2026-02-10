import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — Phone hot, zoom into transistor
  tunneling: seconds(7),      // 0:03-0:10 — Electron ghosts through gate
  shrinkingTimeline: seconds(10), // 0:10-0:20 — Transistors shrinking by decade
  countermeasures: seconds(10), // 0:20-0:30 — Engineers stacking fixes
  closing: seconds(8),        // 0:30-0:38 — "Humans building predictable systems..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
