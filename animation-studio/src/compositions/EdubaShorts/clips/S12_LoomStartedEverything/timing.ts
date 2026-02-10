import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — "Unprecedented" text cracks, loom behind
  jacquardLoom: seconds(7),    // 0:03-0:10 — Loom working, punched cards, binary
  portrait: seconds(8),        // 0:10-0:18 — Portrait weaving from cards
  lovelaceQuote: seconds(7),   // 0:18-0:25 — Ada Lovelace quote
  closing: seconds(10),        // 0:25-0:35 — "It was never about electronics..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
