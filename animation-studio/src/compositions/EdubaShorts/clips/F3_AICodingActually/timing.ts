import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "Is that still programming?"
  intentToCode: seconds(7),    // 0:03-0:10 — Developer describes → AI generates → reviews
  layerTimeline: seconds(8),   // 0:10-0:18 — Assembly → C → Python → AI
  understandLayers: seconds(10), // 0:18-0:28 — LayerStack: prompt → code → compiled
  closing: seconds(7),         // 0:28-0:35 — "Understand what's beneath the abstraction"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
