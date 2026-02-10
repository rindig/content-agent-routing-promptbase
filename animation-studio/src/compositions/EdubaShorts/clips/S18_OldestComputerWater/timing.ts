import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Modern computer → rewind to 62 CE
  heronTheater: seconds(9),    // 0:03-0:12 — Heron's theater, ropes, cogwheels
  knotsBinary: seconds(8),     // 0:12-0:20 — Knot=1, no knot=0, vs transistor gate
  binaryTimeline: seconds(10), // 0:20-0:30 — Timeline of binary mediums
  closing: seconds(8),         // 0:30-0:38 — "Computing isn't a technology. It's a pattern."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
