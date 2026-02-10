import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Two identical waveforms
  cloningProcess: seconds(9),  // 0:03-0:12 — 30s audio → model maps voice fingerprint
  evolutionaryTrust: seconds(8), // 0:12-0:20 — Voice as ancient trust signal
  reproducible: seconds(8),    // 0:20-0:28 — Now reproducible from text box
  closing: seconds(10),        // 0:28-0:38 — "The signal we trusted most..."
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
