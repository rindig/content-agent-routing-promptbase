import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "PROMPT ENGINEERING" morphs to Mad Libs
  madLibs: seconds(7),         // 0:03-0:10 — Mad Libs template, blanks filled
  astComparison: seconds(8),   // 0:10-0:18 — Mad Libs vs AST side by side
  systemPrompt: seconds(10),   // 0:18-0:28 — System prompt with typed blanks
  closing: seconds(7),         // 0:28-0:35 — "We called it writing templates"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
