export const FPS = 30;

// Convert seconds to frames
export const seconds = (s: number) => Math.round(s * FPS);

// Scene durations in frames (from spec)
export const SCENE_DURATIONS = {
  // Cold Open (0:00 - 0:45) — 1,350 frames total
  scene1A_TimeTransformation: 240,   // 0:00 - 0:08
  scene1B_PreviousWork: 300,         // 0:08 - 0:18
  scene1C_Skepticism: 300,           // 0:18 - 0:28
  scene1D_PromiseProcess: 510,       // 0:28 - 0:45

  // The Tools (0:45 - 1:45) — 1,800 frames
  scene2A_ToolIntro: 750,            // 0:45 - 1:10
  scene2B_ToolsDemo: 600,            // 1:10 - 1:30
  scene2C_Connection: 450,           // 1:30 - 1:45

  // Stage One: The Spec (1:45 - 4:15) — 4,500 frames
  scene3A_SurpriseReveal: 600,       // 1:45 - 2:05
  scene3B_PrecisionNotVague: 600,    // 2:05 - 2:25
  scene3C_OgilvyInsight: 900,        // 2:25 - 2:55
  scene3D_CreativeThinking: 600,     // 2:55 - 3:15
  scene3E_SpecDetailLevels: 600,     // 3:15 - 3:35
  scene3F_SpecFileDemo: 750,         // 3:35 - 4:00
  scene3G_PauseMoment: 450,          // 4:00 - 4:15

  // Stage Two: Building (4:15 - 7:15) — 5,400 frames
  scene4A_SpecToAnimation: 600,      // 4:15 - 4:35
  scene4B_ClaudeReads: 900,          // 4:35 - 5:05
  scene4C_JonnyBurger: 1050,         // 5:05 - 5:40
  scene4D_WebEcosystem: 450,         // 5:40 - 5:55
  scene4E_WorkflowDemo: 1200,        // 5:55 - 6:35
  scene4F_ComponentLibrary: 750,     // 6:35 - 7:00
  scene4G_SeparationConcerns: 450,   // 7:00 - 7:15

  // Stage Three: Finishing (7:15 - 9:00) — 3,150 frames
  scene5A_ExportCapcut: 600,         // 7:15 - 7:35
  scene5B_EditWork: 750,             // 7:35 - 8:00
  scene5C_HonestyMoment: 900,        // 8:00 - 8:30
  scene5D_TimeClarification: 900,    // 8:30 - 9:00

  // Bigger Picture (9:00 - 10:30) — 2,700 frames
  scene6A_ZoomOut: 450,              // 9:00 - 9:15
  scene6B_GarageBand: 900,           // 9:15 - 9:45
  scene6C_Canva: 750,                // 9:45 - 10:10
  scene6D_ThePattern: 600,           // 10:10 - 10:30

  // Constraints Insight (10:30 - 11:45) — 2,250 frames
  scene7A_Counterintuitive: 450,     // 10:30 - 10:45
  scene7B_InvertedU: 750,            // 10:45 - 11:10
  scene7C_GreenEggsHam: 600,         // 11:10 - 11:30
  scene7D_Jaws: 450,                 // 11:30 - 11:45

  // Return (11:45 - 12:30) — 1,350 frames
  scene8A_FullCircle: 600,           // 11:45 - 12:05
  scene8B_CreativeWorkMoved: 750,    // 12:05 - 12:30

  // Close (12:30 - 13:15) — 1,350 frames
  scene9A_WhatChanged: 600,          // 12:30 - 12:50
  scene9B_FinalEmpowerment: 750,     // 12:50 - 13:15
};

// Total duration
export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0);

// Standard animation durations
export const ANIMATIONS = {
  fadeIn: seconds(0.5),
  fadeOut: seconds(0.5),
  quickFade: seconds(0.3),
  normalFade: seconds(1),
  slowFade: seconds(2),
  staggerDelay: 3,
  sceneBuffer: 30,
};

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 200, mass: 1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 200 },
  snappy: { damping: 20, mass: 0.8, stiffness: 200 },
  slow: { damping: 30, mass: 2, stiffness: 80 },
};
