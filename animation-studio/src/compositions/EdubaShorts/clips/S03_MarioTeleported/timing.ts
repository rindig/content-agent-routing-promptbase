import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — Mario drops through floor
  cosmicZoom: seconds(7),     // 0:03-0:10 — Pull back to space, particle streaks in
  bitFlip: seconds(8),        // 0:10-0:18 — Inside chip, Y-coordinate flip
  deviceMontage: seconds(10), // 0:18-0:28 — Devices getting hit, shields
  closing: seconds(7),        // 0:28-0:35 — "The universe is always throwing particles..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
