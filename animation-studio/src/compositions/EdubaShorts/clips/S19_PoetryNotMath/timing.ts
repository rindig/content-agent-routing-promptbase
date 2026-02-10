import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Two chat windows: sonnet vs wrong math
  poetryWeb: seconds(9),       // 0:03-0:12 — Dense word connections for "ocean"
  mathVoid: seconds(8),        // 0:12-0:20 — Sparse connections for "347 x 16"
  splitView: seconds(10),      // 0:20-0:30 — Dense vs sparse side by side
  closing: seconds(8),         // 0:30-0:38 — "One is a language problem..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
