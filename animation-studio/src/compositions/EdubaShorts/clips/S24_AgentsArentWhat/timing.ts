import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "AI AGENT!" press release → just a chat window
  twoLanes: seconds(9),       // 0:03-0:12 — Chatbot vs real agent comparison
  badgePeel: seconds(10),      // 0:12-0:22 — Peeling "AGENT" badges off products
  demoVsWild: seconds(8),     // 0:22-0:30 — Demo (flawless) vs wild (breaks)
  closing: seconds(8),         // 0:30-0:38 — "Marketing is 3 years ahead..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
