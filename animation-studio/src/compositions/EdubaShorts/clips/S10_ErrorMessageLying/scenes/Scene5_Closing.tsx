import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 5: Closing
 * Duration: 240 frames (8 seconds)
 *
 * Two-line closing statement with word-by-word BlurText entrance.
 * Line 1: "The fix is never to eliminate errors."
 * Line 2: "It's to build systems that catch them." (green highlight)
 * Ambient green glow, fade to black.
 */

const BEATS = {
  TRANSITION_OUT: 0,
  LINE_1_IN: 30,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 80,
  LINE_2_STAGGER: 4,
  HOLD_START: 130,
  FADE_OUT: 225,
};

/** Word-by-word blur reveal (inline version for closing with color control) */
const ClosingLine: React.FC<{
  text: string;
  startFrame: number;
  staggerDelay: number;
  color: string;
  highlightWords?: string[];
  highlightColor?: string;
}> = ({
  text,
  startFrame,
  staggerDelay,
  color,
  highlightWords = [],
  highlightColor = COLORS.solutionGreen,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 14px',
        maxWidth: 860,
      }}
    >
      {words.map((word, i) => {
        const wordStart = i * staggerDelay;
        const wordProgress = spring({
          frame: relativeFrame - wordStart,
          fps,
          config: SPRING_CONFIGS.gentle,
        });

        const blur = interpolate(wordProgress, [0, 1], [8, 0]);
        const y = interpolate(wordProgress, [0, 1], [20, 0]);
        const opacity = interpolate(
          relativeFrame,
          [wordStart, wordStart + 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const isHighlighted = highlightWords.includes(word.replace(/[.,!?]/g, ''));
        const wordColor = isHighlighted ? highlightColor : color;

        return (
          <span
            key={i}
            style={{
              ...TYPOGRAPHY.closingText,
              fontSize: 44,
              color: wordColor,
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
  );
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene transition: initial fade from previous scene
  const transitionOpacity = interpolate(
    frame,
    [BEATS.TRANSITION_OUT, BEATS.TRANSITION_OUT + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ambient glow behind text
  const glowScale = frame >= BEATS.HOLD_START
    ? 1.0 + 0.05 * Math.sin((frame - BEATS.HOLD_START) * 0.05)
    : 1.0;

  // Final fade to black
  const fadeToBlack = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background="dark">
      <AbsoluteFill
        style={{
          opacity: transitionOpacity,
        }}
      >
        {/* Ambient green glow */}
        {frame >= BEATS.HOLD_START && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 500,
              height: 500,
              borderRadius: '50%',
              backgroundColor: COLORS.solutionGreen,
              opacity: 0.05,
              transform: `translate(-50%, -50%) scale(${glowScale})`,
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Closing text */}
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
          {/* Line 1 */}
          <ClosingLine
            text="The fix is never to eliminate errors."
            startFrame={BEATS.LINE_1_IN}
            staggerDelay={BEATS.LINE_1_STAGGER}
            color={COLORS.textPrimary}
          />

          {/* Line 2 */}
          <ClosingLine
            text="It's to build systems that catch them."
            startFrame={BEATS.LINE_2_IN}
            staggerDelay={BEATS.LINE_2_STAGGER}
            color={COLORS.textPrimary}
            highlightWords={['build', 'systems', 'that', 'catch', 'them.']}
            highlightColor={COLORS.solutionGreen}
          />
        </div>

        {/* Fade to black overlay */}
        {fadeToBlack > 0 && (
          <AbsoluteFill
            style={{
              backgroundColor: '#000000',
              opacity: fadeToBlack,
            }}
          />
        )}
      </AbsoluteFill>
    </SceneContainer>
  );
};
