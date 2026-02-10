import { seconds } from '../../../constants';

export const SCENE_DURATIONS = {
  hook: 90,               // 0:00-0:03 — Prompt advice badges, reframe
  context: 210,           // 0:03-0:10 — Architecture vs wording, house metaphor
  core: 360,              // 0:10-0:22 — Split-screen, four layers, universality
  resolution: 240,        // 0:22-0:30 — Methods transfer, tricks don't
  closing: 240,           // 0:30-0:38 — BlurText closing statement
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
