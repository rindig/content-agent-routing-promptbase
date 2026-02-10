import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — import pandas typed
  explosion: seconds(7),       // 0:03-0:10 — 300K lines exploding outward
  layerStack: seconds(8),      // 0:10-0:18 — Pandas → NumPy → CPython → C → OS → HW
  aiComparison: seconds(7),    // 0:18-0:25 — AI code next to import stack
  closing: seconds(10),        // 0:25-0:35 — "We've been trusting code..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
