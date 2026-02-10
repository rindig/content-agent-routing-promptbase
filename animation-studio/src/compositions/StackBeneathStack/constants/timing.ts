// Timing constants for "The Stack Beneath the Stack" video
export const FPS = 30;

// Scene durations in seconds
export const SCENE_DURATIONS = {
  coldOpen: 45,
  titleCard: 7,
  surface: 33,
  parser: 50,
  bytecode: 45,
  interpreter: 75,
  assembly: 40,
  machineCode: 35,
  hardware: 45,
  loom: 105,
  errorsTimeline: 60,
  electronProblem: 90,
  probabilityBeneath: 60,
  engineeringDeterminism: 45,
  aiLayer: 75,
  close: 45,
  endCard: 15,
} as const;

// Convert seconds to frames
export const SCENE_FRAMES = {
  coldOpen: SCENE_DURATIONS.coldOpen * FPS,
  titleCard: SCENE_DURATIONS.titleCard * FPS,
  surface: SCENE_DURATIONS.surface * FPS,
  parser: SCENE_DURATIONS.parser * FPS,
  bytecode: SCENE_DURATIONS.bytecode * FPS,
  interpreter: SCENE_DURATIONS.interpreter * FPS,
  assembly: SCENE_DURATIONS.assembly * FPS,
  machineCode: SCENE_DURATIONS.machineCode * FPS,
  hardware: SCENE_DURATIONS.hardware * FPS,
  loom: SCENE_DURATIONS.loom * FPS,
  errorsTimeline: SCENE_DURATIONS.errorsTimeline * FPS,
  electronProblem: SCENE_DURATIONS.electronProblem * FPS,
  probabilityBeneath: SCENE_DURATIONS.probabilityBeneath * FPS,
  engineeringDeterminism: SCENE_DURATIONS.engineeringDeterminism * FPS,
  aiLayer: SCENE_DURATIONS.aiLayer * FPS,
  close: SCENE_DURATIONS.close * FPS,
  endCard: SCENE_DURATIONS.endCard * FPS,
} as const;

// Total duration
export const TOTAL_FRAMES = Object.values(SCENE_FRAMES).reduce((a, b) => a + b, 0);
export const TOTAL_SECONDS = TOTAL_FRAMES / FPS;

// Common animation durations (in frames)
export const ANIMATIONS = {
  fadeIn: 20,
  fadeOut: 15,
  springEntrance: 25,
  typewriterCharDelay: 2,      // frames between characters
  codeLineDelay: 8,            // frames between code lines
  layerTransition: 30,         // descending to next layer
} as const;

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 200 },
  bouncy: { damping: 12, mass: 0.5 },
  snappy: { damping: 20, stiffness: 200 },
  slow: { damping: 30, mass: 2 },
} as const;
