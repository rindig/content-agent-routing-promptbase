import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Confident wrong answer + WRONG stamp
  probabilityMachine: seconds(9), // 0:03-0:12 — Inside AI, word connections
  splitComparison: seconds(8), // 0:12-0:20 — Poetry (dense) vs math (sparse)
  meters: seconds(10),         // 0:20-0:30 — Confidence vs correctness meters
  closing: seconds(8),         // 0:30-0:38 — "Confidence is pattern strength..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
