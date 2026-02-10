export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Convert seconds to frames
export const seconds = (s: number) => Math.round(s * FPS);

// Standard animation durations
export const ANIMATIONS = {
  fadeIn: seconds(0.5),
  fadeOut: seconds(0.5),
  quickFade: seconds(0.33),
  normalFade: seconds(0.67),
  slowFade: seconds(1.5),
  typewriterCharDelay: 2,
  staggerDelay: 3,
  hookDuration: seconds(3),
  closingDuration: seconds(4),
};

// Spring configurations
export const SPRING_CONFIGS = {
  gentle: { damping: 200, mass: 1, stiffness: 100 },
  bouncy: { damping: 12, mass: 0.5, stiffness: 200 },
  snappy: { damping: 20, mass: 0.8, stiffness: 200 },
  slow: { damping: 30, mass: 2, stiffness: 80 },
};

// Layout constants for 9:16 vertical
export const LAYOUT = {
  width: WIDTH,
  height: HEIGHT,
  safeMarginX: 54,
  safeMarginY: 96,
  platformTopSafe: 192,
  platformBottomSafe: 288,
  contentZoneTop: 384,
  contentZoneBottom: 1536,
  contentZoneHeight: 1152,
  safePadding: '96px 54px',
};
