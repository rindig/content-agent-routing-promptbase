import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Model comparison overwhelm
  systemDiagram: seconds(9),   // 0:03-0:12 — Pull back: DB 60%, rules 30%, AI 10%
  barBreakdown: seconds(10),   // 0:12-0:22 — 60/30/10 bars, model swap = 2-3%
  sparkPlug: seconds(8),       // 0:22-0:30 — Car metaphor
  closing: seconds(8),         // 0:30-0:38 — "The model is one component..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
