export const FPS = 30;

// Convert seconds to frames
export const seconds = (s: number) => Math.round(s * FPS);

// Scene durations in frames (~17 minute video)
export const SCENE_DURATIONS = {
  coldOpen: seconds(75),            // 0:00 - 1:15 (Cold open with Ethics Engine)
  section1Agent: seconds(135),      // 1:15 - 3:30 (What is an "agent"?)
  section2Orchestration: seconds(180), // 3:30 - 6:30 (Orchestration layer)
  section3Protocols: seconds(180),  // 6:30 - 9:30 (APIs, MCP, protocols)
  section4DataMath: seconds(150),   // 9:30 - 12:00 (Data processing, THE RATIO)
  section5Reframe: seconds(180),    // 12:00 - 15:00 (The reframe, trilogy callback)
  close: seconds(60),               // 15:00 - 16:00 (Close)
};

// Total duration
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Standard animation durations
export const ANIMATIONS = {
  fadeIn: seconds(0.5),          // 15 frames
  fadeOut: seconds(0.5),         // 15 frames
  quickFade: seconds(0.3),       // 9 frames
  normalFade: seconds(1),        // 30 frames
  slowFade: seconds(2),          // 60 frames
  dramaticFade: seconds(3),      // 90 frames
  typewriterCharDelay: 2,
  staggerDelay: 3,
  layerExplodeDelay: 20,         // Between layers separating
  sceneBuffer: 30,
};

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 200, mass: 1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 200 },
  snappy: { damping: 20, mass: 0.8, stiffness: 200 },
  slow: { damping: 30, mass: 2, stiffness: 80 },
  explode: { damping: 15, mass: 1.2, stiffness: 120 }, // For layer separation
  flow: { damping: 25, mass: 0.6, stiffness: 150 },    // For data flowing
};
