import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "NEW MODEL RELEASED" notification
  actualImprovement: seconds(7), // 0:03-0:10 — Specific benchmark, small and real
  systemView: seconds(10),     // 0:10-0:20 — Model is 10% of system, barely shifts
  badSystem: seconds(10),      // 0:20-0:30 — 100% model-dependent = everything breaks
  closing: seconds(8),         // 0:30-0:38 — "The system is the problem"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
