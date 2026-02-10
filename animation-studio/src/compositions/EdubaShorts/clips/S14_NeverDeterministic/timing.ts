import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — "AI is probabilistic" vs "computing is deterministic"
  electronZoom: seconds(7),   // 0:03-0:10 — Zoom into chip, electron probability cloud
  layerStack: seconds(8),     // 0:10-0:18 — Layers stacking above quantum base
  reframe: seconds(10),       // 0:18-0:28 — Both sides built on same foundation
  closing: seconds(10),       // 0:28-0:38 — "Same problem, one layer up"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
