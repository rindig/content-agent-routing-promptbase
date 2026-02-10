import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — print("Hello, World!"), counter spinning
  layerFall: seconds(15),      // 0:03-0:18 — Line falls through 7 layers
  bridgesUp: seconds(10),      // 0:18-0:28 — Reverse zoom, abstraction bridges
  closing: seconds(7),         // 0:28-0:35 — "Every generation makes the hard part invisible"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
