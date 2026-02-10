import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../constants';

interface ClosingStatementProps {
  text: string;
  startFrame?: number;
  holdDuration?: number;
  color?: string;
  fontSize?: number;
  maxWidth?: number;
}

export const ClosingStatement: React.FC<ClosingStatementProps> = ({
  text,
  startFrame = 0,
  holdDuration = 60,
  color = COLORS.textPrimary,
  fontSize = TYPOGRAPHY.closingText.fontSize,
  maxWidth = TYPOGRAPHY.closingText.maxWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const words = text.split(' ');
  const staggerDelay = 3;
  const totalRevealFrames = words.length * staggerDelay + 20;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: LAYOUT.safePadding,
      }}
    >
      <div
        style={{
          maxWidth,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0 14px',
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

          return (
            <span
              key={i}
              style={{
                ...TYPOGRAPHY.closingText,
                fontSize,
                color,
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
    </AbsoluteFill>
  );
};
