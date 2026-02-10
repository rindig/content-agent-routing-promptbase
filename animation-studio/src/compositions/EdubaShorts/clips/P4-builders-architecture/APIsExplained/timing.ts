import { seconds } from '../../../constants';

export const SCENE_DURATIONS = {
  hook: 90,               // 0:00-0:03 — API glitch text, menu reframe
  context: 210,           // 0:03-0:10 — Restaurant metaphor, order cycle
  core: 360,              // 0:10-0:22 — API translation, request/response
  resolution: 240,        // 0:22-0:30 — Food court grid, scale reveal
  closing: 240,           // 0:30-0:38 — BlurText closing statement
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
