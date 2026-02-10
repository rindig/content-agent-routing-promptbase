import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — AI generating code, libraries pulled silently
  flowDiagram: seconds(9),     // 0:03-0:12 — One-way extraction, broken return arrow
  decline: seconds(8),         // 0:12-0:20 — Healthy project → losing contributors
  deterioration: seconds(10),  // 0:20-0:30 — AI pulling from deteriorating project
  closing: seconds(8),         // 0:30-0:38 — "Starving the foundation..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
