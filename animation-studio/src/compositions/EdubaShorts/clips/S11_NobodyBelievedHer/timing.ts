import { seconds } from '../../constants';

export const SCENE_DURATIONS = {
  hook: seconds(3),            // 0:00-0:03 — Meeting room, skeptical faces
  hopperDemo: seconds(7),      // 0:03-0:10 — 1952, Hopper showing compiler
  yearsIgnored: seconds(8),    // 0:10-0:18 — "Years ignored: 1...2...3..."
  compilersEverywhere: seconds(7), // 0:18-0:25 — Fast forward, compilers in everything
  closing: seconds(10),        // 0:25-0:35 — "The timeline keeps getting shorter"
};

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);
