import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "50% SMARTER" headline → question mark
  libraryMetaphor: seconds(9), // 0:03-0:12 — Small bookshelf vs big bookshelf
  patternMatch: seconds(10),   // 0:12-0:22 — Niche question: just pattern matching
  gapSpectrum: seconds(8),     // 0:22-0:30 — "Fewer errors" ↔ "understanding" gap
  closing: seconds(8),         // 0:30-0:38 — "The gap is where disappointment lives"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
