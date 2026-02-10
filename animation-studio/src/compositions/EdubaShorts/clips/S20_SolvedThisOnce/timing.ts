import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),              // 0:00-0:03 — "We can't trust AI" + historical montage
  failuresAndFixes: seconds(12), // 0:03-0:15 — Each era: failure → fix, rapid pairs
  aiProblems: seconds(10),       // 0:15-0:25 — AI problems listed, fixes forming
  theStack: seconds(5),          // 0:25-0:30 — LayerStack: all eras solved, AI in progress
  closing: seconds(5),           // 0:30-0:35 — "The pattern says it will be"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
