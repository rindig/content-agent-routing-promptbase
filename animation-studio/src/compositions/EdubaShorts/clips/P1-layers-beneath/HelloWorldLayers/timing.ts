import { seconds } from '../../../constants';

export const SCENE_DURATIONS = {
  hook: 150,               // 0:00-0:05 — print("Hello, World!") types, glitches, dims
  scaleReveal: 90,         // 0:05-0:08 — ~12,000 lines, 7 layers
  theStack: 420,           // 0:08-0:22 — Seven layers build downward
  theReframe: 240,         // 0:22-0:30 — "Abstraction" + AI layer
  closing: 240,            // 0:30-0:38 — BlurText closing statement
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
