import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Spreadsheet autocomplete
  patternZoom: seconds(7),     // 0:03-0:10 — Zoom into pattern detection
  scaleSlider: seconds(10),    // 0:10-0:20 — Column vs internet scale
  timeline: seconds(10),       // 0:20-0:30 — Autocomplete → ChatGPT
  closing: seconds(8),         // 0:30-0:38 — "We didn't call it AI..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
