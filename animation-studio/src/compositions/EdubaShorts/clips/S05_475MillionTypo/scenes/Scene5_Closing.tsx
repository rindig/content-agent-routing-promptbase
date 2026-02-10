import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

/**
 * Scene 5: Closing — Reliability (25s-35s, 300 frames)
 *
 * Pentium chip returns with testing layer rings, shrinks up,
 * then two-line closing statement with BlurText entrance.
 */

const BEATS = {
  CHIP_RETURN: 0,
  RING_1_IN: 40,
  RING_2_IN: 50,
  RING_3_IN: 60,
  RING_4_IN: 70,
  SHRINK_UP: 80,
  LINE_1_IN: 120,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 170,
  LINE_2_STAGGER: 4,
  HOLD_START: 210,
  FADE_OUT: 285,
};

const CHIP_SIZE = 200;

const TESTING_RINGS = [
  { label: 'Unit tests', offset: 40, frame: 'RING_1_IN' as const },
  { label: 'Integration tests', offset: 80, frame: 'RING_2_IN' as const },
  { label: 'Validation suite', offset: 120, frame: 'RING_3_IN' as const },
  { label: 'Independent verification', offset: 160, frame: 'RING_4_IN' as const },
];

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Chip entrance ---
  const chipProgress = spring({
    frame: frame - BEATS.CHIP_RETURN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const chipScale = interpolate(chipProgress, [0, 1], [0.8, 1]);
  const chipOpacity = frame >= BEATS.CHIP_RETURN
    ? interpolate(chipProgress, [0, 1], [0, 1])
    : 0;

  // --- Shrink up ---
  const shrinkProgress = spring({
    frame: frame - BEATS.SHRINK_UP,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const shrinkScale = frame >= BEATS.SHRINK_UP
    ? interpolate(shrinkProgress, [0, 1], [1, 0.3])
    : 1;
  const shrinkY = frame >= BEATS.SHRINK_UP
    ? interpolate(shrinkProgress, [0, 1], [0, -350])
    : 0;

  // --- Ring glow pulse during hold ---
  const ringGlowOpacity = frame >= BEATS.HOLD_START
    ? 0.1 + 0.2 * Math.sin((frame - BEATS.HOLD_START) * 0.1)
    : 0;

  // --- Scene fade out ---
  const sceneFade = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Line 1: word-by-word ---
  const line1Text = "Reliability isn't a property of the technology.";
  const line1Words = line1Text.split(' ');
  const showLine1 = frame >= BEATS.LINE_1_IN;

  // --- Line 2: word-by-word with colored segment ---
  const line2Part1 = "It's a property of";
  const line2Part2 = "what you build around it.";
  const showLine2 = frame >= BEATS.LINE_2_IN;

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={15}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '96px 54px',
          opacity: sceneFade,
        }}
      >
        {/* Chip + Testing Rings */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: chipOpacity,
            transform: `scale(${chipScale * shrinkScale}) translateY(${shrinkY}px)`,
            marginBottom: frame >= BEATS.SHRINK_UP ? 0 : 40,
          }}
        >
          {/* Testing rings (outermost first for layering) */}
          {TESTING_RINGS.slice()
            .reverse()
            .map((ring, revIdx) => {
              const i = TESTING_RINGS.length - 1 - revIdx;
              const ringStart = BEATS[ring.frame];
              const ringProgress = spring({
                frame: frame - ringStart,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const ringScale = interpolate(ringProgress, [0, 1], [0.8, 1]);
              const ringOpacity = frame >= ringStart
                ? interpolate(ringProgress, [0, 1], [0, 0.8])
                : 0;

              const size = CHIP_SIZE + ring.offset * 2;

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: 20 + i * 6,
                    border: `1px solid ${COLORS.solutionGreen}`,
                    boxShadow: frame >= BEATS.HOLD_START
                      ? `0 0 15px rgba(16,185,129,${ringGlowOpacity})`
                      : 'none',
                    opacity: ringOpacity,
                    transform: `scale(${ringScale})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Label on right edge */}
                  <div
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: '50%',
                      transform: 'translateY(-50%) translateX(100%)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 20,
                        color: COLORS.solutionGreen,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {ring.label}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Pentium chip */}
          <div
            style={{
              width: CHIP_SIZE,
              height: CHIP_SIZE,
              borderRadius: 16,
              border: `2px solid ${COLORS.historyGold}`,
              backgroundColor: COLORS.bgSurfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.historyGold,
                letterSpacing: 4,
              }}
            >
              PENTIUM
            </span>
          </div>
        </div>

        {/* Closing text area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            maxWidth: 860,
            marginTop: frame >= BEATS.SHRINK_UP ? 40 : 0,
          }}
        >
          {/* Line 1 */}
          {showLine1 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0 14px',
              }}
            >
              {line1Words.map((word, i) => {
                const wordStart = BEATS.LINE_1_IN + i * BEATS.LINE_1_STAGGER;
                const wordProgress = spring({
                  frame: frame - wordStart,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                });
                const blur = interpolate(wordProgress, [0, 1], [8, 0]);
                const y = interpolate(wordProgress, [0, 1], [20, 0]);
                const opacity = interpolate(
                  frame,
                  [wordStart, wordStart + 15],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                  <span
                    key={i}
                    style={{
                      ...TYPOGRAPHY.closingText,
                      fontSize: 44,
                      color: COLORS.textPrimary,
                      opacity,
                      filter: `blur(${blur}px)`,
                      transform: `translateY(${y}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}

          {/* Line 2 */}
          {showLine2 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0 14px',
              }}
            >
              {/* Part 1: white text */}
              {line2Part1.split(' ').map((word, i) => {
                const wordStart = BEATS.LINE_2_IN + i * BEATS.LINE_2_STAGGER;
                const wordProgress = spring({
                  frame: frame - wordStart,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                });
                const blur = interpolate(wordProgress, [0, 1], [8, 0]);
                const y = interpolate(wordProgress, [0, 1], [20, 0]);
                const opacity = interpolate(
                  frame,
                  [wordStart, wordStart + 15],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                  <span
                    key={`p1-${i}`}
                    style={{
                      ...TYPOGRAPHY.closingText,
                      fontSize: 44,
                      color: COLORS.textPrimary,
                      opacity,
                      filter: `blur(${blur}px)`,
                      transform: `translateY(${y}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {word}
                  </span>
                );
              })}

              {/* Part 2: insightOrange text */}
              {line2Part2.split(' ').map((word, j) => {
                const part1WordCount = line2Part1.split(' ').length;
                const i = part1WordCount + j;
                const wordStart = BEATS.LINE_2_IN + i * BEATS.LINE_2_STAGGER;
                const wordProgress = spring({
                  frame: frame - wordStart,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                });
                const blur = interpolate(wordProgress, [0, 1], [8, 0]);
                const y = interpolate(wordProgress, [0, 1], [20, 0]);
                const opacity = interpolate(
                  frame,
                  [wordStart, wordStart + 15],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                return (
                  <span
                    key={`p2-${j}`}
                    style={{
                      ...TYPOGRAPHY.closingText,
                      fontSize: 44,
                      color: COLORS.insightOrange,
                      opacity,
                      filter: `blur(${blur}px)`,
                      transform: `translateY(${y}px)`,
                      display: 'inline-block',
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
