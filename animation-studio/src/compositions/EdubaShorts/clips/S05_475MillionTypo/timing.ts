import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Missing semicolon + error flood
  pentiumChip: seconds(7),     // 0:03-0:10 — Chip rotating, lookup table, 5 red slots
  cascade: seconds(8),         // 0:10-0:18 — Division hits empty slot, wrong result cascades
  scale: seconds(7),           // 0:18-0:25 — Millions of chips, "$475,000,000"
  closing: seconds(10),        // 0:25-0:35 — "Reliability isn't a property of the technology..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
