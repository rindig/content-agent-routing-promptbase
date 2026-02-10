import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — NullPointerException that's wrong
  moth: seconds(7),            // 0:03-0:10 — 1947 moth in relay
  gallery: seconds(12),        // 0:10-0:22 — Gallery of "moths" through history
  fixes: seconds(8),           // 0:22-0:30 — Each era's fix
  closing: seconds(8),         // 0:30-0:38 — "Different moths. Same pattern..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
