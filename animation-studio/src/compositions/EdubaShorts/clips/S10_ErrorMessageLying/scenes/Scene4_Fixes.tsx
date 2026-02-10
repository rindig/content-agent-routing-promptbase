import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 4: The Fixes
 * Duration: 240 frames (8 seconds)
 *
 * Five problems paired with their fixes (arrows). Connecting green line.
 * Pattern text: "Never eliminate." (strikethrough) + "Always wrap." (green)
 */

const BEATS = {
  PROBLEMS_LIST_IN: 0,
  PROBLEM_STAGGER: 3,
  FIXES_START: 30,
  FIX_PAIR_DURATION: 18,
  CONNECTING_LINE: 120,
  COMPRESS_UP: 160,
  NEVER_ELIMINATE: 160,
  ALWAYS_WRAP: 180,
  HOLD: 200,
};

const PAIRS = [
  { problem: 'Cosmic Rays', fix: 'ECC Memory' },
  { problem: 'Rounding', fix: 'Arbitrary Precision' },
  { problem: 'Race Conditions', fix: 'Mutexes / Locks' },
  { problem: 'Memory Leaks', fix: 'Garbage Collection' },
  { problem: 'Hallucinations', fix: 'Eval Frameworks' },
];

/** Strikethrough line that draws across text */
const StrikethroughText: React.FC<{
  text: string;
  startFrame: number;
  color: string;
  fontSize: number;
}> = ({ text, startFrame, color, fontSize }) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const textOpacity = interpolate(relativeFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Strikethrough draws over 10 frames starting at frame 5 after text appears
  const strikeWidth = interpolate(relativeFrame, [5, 15], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block', opacity: textOpacity }}>
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize,
          color,
        }}
      >
        {text}
      </span>
      {/* Strikethrough line */}
      <div
        style={{
          position: 'absolute',
          top: '55%',
          left: 0,
          width: `${strikeWidth}%`,
          height: 3,
          backgroundColor: color,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

export const Scene4_Fixes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compress pairs up after pattern text appears
  const compressScale = interpolate(
    frame,
    [BEATS.COMPRESS_UP, BEATS.COMPRESS_UP + 20],
    [1, 0.6],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const compressY = interpolate(
    frame,
    [BEATS.COMPRESS_UP, BEATS.COMPRESS_UP + 20],
    [0, -200],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Connecting green line draw
  const lineHeight = interpolate(
    frame,
    [BEATS.CONNECTING_LINE, BEATS.CONNECTING_LINE + 20],
    [0, PAIRS.length * 64],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Green glow pulse on pairs during hold
  const glowPulse = frame >= BEATS.HOLD
    ? 0.05 + 0.03 * Math.sin((frame - BEATS.HOLD) * 0.1)
    : 0;

  // "Always wrap" entrance
  const alwaysWrapProgress = spring({
    frame: frame - BEATS.ALWAYS_WRAP,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const alwaysWrapOpacity = interpolate(
    frame,
    [BEATS.ALWAYS_WRAP, BEATS.ALWAYS_WRAP + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const alwaysWrapY = interpolate(alwaysWrapProgress, [0, 1], [20, 0]);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={12}
      fadeOut
      fadeOutStart={230}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 32,
        }}
      >
        {/* Problem -> Fix pairs */}
        <div
          style={{
            width: '100%',
            transform: `scale(${compressScale}) translateY(${compressY}px)`,
            position: 'relative',
          }}
        >
          {/* Green glow behind */}
          {glowPulse > 0 && (
            <div
              style={{
                position: 'absolute',
                top: -20,
                left: -20,
                right: -20,
                bottom: -20,
                backgroundColor: COLORS.solutionGreen,
                opacity: glowPulse,
                borderRadius: 20,
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }}
            />
          )}

          {PAIRS.map((pair, i) => {
            // Problem label entrance
            const problemStart = BEATS.PROBLEMS_LIST_IN + i * BEATS.PROBLEM_STAGGER;
            const problemOpacity = interpolate(
              frame,
              [problemStart, problemStart + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const problemY = interpolate(
              spring({
                frame: frame - problemStart,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [15, 0]
            );

            // Fix entrance
            const fixStart = BEATS.FIXES_START + i * BEATS.FIX_PAIR_DURATION;
            const fixProgress = spring({
              frame: frame - fixStart,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const fixOpacity = interpolate(
              frame,
              [fixStart, fixStart + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const fixX = interpolate(fixProgress, [0, 1], [60, 0]);

            // Arrow entrance
            const arrowOpacity = interpolate(
              frame,
              [fixStart - 5, fixStart + 5],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Problem text brightness when fix arrives
            const problemColor = frame >= fixStart
              ? COLORS.textBody
              : COLORS.textMuted;

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 16,
                  opacity: problemOpacity,
                  transform: `translateY(${problemY}px)`,
                }}
              >
                {/* Problem label */}
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: problemColor,
                    textTransform: 'none' as const,
                    letterSpacing: 0,
                    minWidth: 240,
                    textAlign: 'right',
                  }}
                >
                  {pair.problem}
                </span>

                {/* Arrow */}
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 28,
                    color: COLORS.textMuted,
                    opacity: arrowOpacity,
                    flexShrink: 0,
                  }}
                >
                  {'\u2192'}
                </span>

                {/* Fix label */}
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: COLORS.solutionGreen,
                    textTransform: 'none' as const,
                    letterSpacing: 0,
                    opacity: fixOpacity,
                    transform: `translateX(${fixX}px)`,
                    display: 'inline-block',
                  }}
                >
                  {pair.fix}
                </span>
              </div>
            );
          })}

          {/* Connecting green line on right side */}
          {frame >= BEATS.CONNECTING_LINE && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 8,
                width: 3,
                height: lineHeight,
                backgroundColor: COLORS.solutionGreen,
                borderRadius: 2,
                opacity: 0.6,
              }}
            />
          )}
        </div>

        {/* Pattern text */}
        {frame >= BEATS.NEVER_ELIMINATE && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginTop: 20,
            }}
          >
            {/* "Never eliminate." with strikethrough */}
            <StrikethroughText
              text="Never eliminate."
              startFrame={BEATS.NEVER_ELIMINATE}
              color={COLORS.errorRed}
              fontSize={44}
            />

            {/* "Always wrap." in green */}
            {frame >= BEATS.ALWAYS_WRAP && (
              <div
                style={{
                  opacity: alwaysWrapOpacity,
                  transform: `translateY(${alwaysWrapY}px)`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 44,
                    color: COLORS.solutionGreen,
                  }}
                >
                  Always wrap.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
