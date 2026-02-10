export const FPS = 30;

// Convert seconds to frames
export const seconds = (s: number) => Math.round(s * FPS);

// Scene durations in frames
export const SCENE_DURATIONS = {
  coldOpen: seconds(50),           // 0:00 - 0:50 (1500 frames)
  section1Template: seconds(160),  // 0:50 - 3:30 (4800 frames)
  section2Memory: seconds(180),    // 3:30 - 6:30 (5400 frames)
  section3AIMemory: seconds(210),  // 6:30 - 10:00 (6300 frames)
  section4GraceHopper: seconds(150), // 10:00 - 12:30 (4500 frames)
  section5Prompting: seconds(120), // 12:30 - 14:30 (3600 frames)
  close: seconds(45),              // 14:30 - 15:15 (1350 frames)
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
  typewriterCharDelay: 2,        // Frames per character
  staggerDelay: 3,               // Between list items
  sceneBuffer: 30,               // Between major sections
};

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 200, mass: 1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 200 },
  snappy: { damping: 20, mass: 0.8, stiffness: 200 },
  slow: { damping: 30, mass: 2, stiffness: 80 },
  drop: { damping: 12, stiffness: 100 },  // For Mad Libs word drops
};
