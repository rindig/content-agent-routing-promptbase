import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),           // 0:00-0:03 — Fix one bug, three new errors
  historicalMontage: seconds(9), // 0:03-0:12 — Compiler/OS/network failures
  errorHandling: seconds(10), // 0:12-0:22 — Building error handling at each era
  aiLayer: seconds(8),        // 0:22-0:30 — AI's error handling forming
  closing: seconds(8),        // 0:30-0:38 — "Every layer has an awkward phase"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
