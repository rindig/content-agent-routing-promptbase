import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * SCENE 1: TITLE CARD
 * Duration: 7 seconds (210 frames)
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Black screen |
 * | 30-60  | "THE STACK" fades in and moves down from above |
 * | 60-90  | "BENEATH THE STACK" fades in and moves up from below |
 * | 90-120 | Titles meet in center, subtle glow pulse |
 * | 120-180| Hold |
 * | 180-210| Fade to black |
 */

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const BLACK_SCREEN_END = 30;
  const TOP_TEXT_START = 30;
  const BOTTOM_TEXT_START = 60;
  const GLOW_PULSE_START = 90;
  const HOLD_END = 180;
  const FADE_OUT_START = 180;

  // "THE STACK" animation - comes from above
  const topTextProgress = spring({
    frame: frame - TOP_TEXT_START,
    fps,
    config: { damping: 25, stiffness: 120 },
  });

  const topTextOpacity = interpolate(topTextProgress, [0, 1], [0, 1]);
  const topTextY = interpolate(topTextProgress, [0, 1], [-60, 0]);

  // "BENEATH THE STACK" animation - comes from below
  const bottomTextProgress = spring({
    frame: frame - BOTTOM_TEXT_START,
    fps,
    config: { damping: 25, stiffness: 120 },
  });

  const bottomTextOpacity = interpolate(bottomTextProgress, [0, 1], [0, 1]);
  const bottomTextY = interpolate(bottomTextProgress, [0, 1], [60, 0]);

  // Glow pulse when titles meet
  const glowProgress = frame >= GLOW_PULSE_START
    ? interpolate(
        frame,
        [GLOW_PULSE_START, GLOW_PULSE_START + 30, GLOW_PULSE_START + 60],
        [0, 1, 0.6],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  // Fade to black at end
  const fadeOut = interpolate(
    frame,
    [FADE_OUT_START, FADE_OUT_START + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Title container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* "THE STACK" - larger, from above */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: TYPOGRAPHY.display.weights.black,
            fontSize: 96,
            color: COLORS.text,
            letterSpacing: '0.05em',
            opacity: topTextOpacity,
            transform: `translateY(${topTextY}px)`,
            textShadow: glowProgress > 0
              ? `0 0 ${40 * glowProgress}px ${COLORS.primary}50, 0 0 ${80 * glowProgress}px ${COLORS.primary}30`
              : 'none',
          }}
        >
          THE STACK
        </div>

        {/* "BENEATH THE STACK" - smaller, from below */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: TYPOGRAPHY.display.weights.black,
            fontSize: 64,
            color: COLORS.text,
            letterSpacing: '0.05em',
            opacity: bottomTextOpacity,
            transform: `translateY(${bottomTextY}px)`,
            textShadow: glowProgress > 0
              ? `0 0 ${30 * glowProgress}px ${COLORS.primary}50, 0 0 ${60 * glowProgress}px ${COLORS.primary}30`
              : 'none',
          }}
        >
          BENEATH THE STACK
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: fadeOut,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
