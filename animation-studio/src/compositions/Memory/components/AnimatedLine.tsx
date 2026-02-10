import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SPRING_CONFIGS } from '../constants';

type WordStyle = {
  word: string;
  color?: string;
  weight?: number;
  scale?: number;
};

type AnimatedLineProps = {
  children: string;
  startFrame?: number;
  /** Frames between each word appearing */
  wordDelay?: number;
  /** Words to emphasize with special styling */
  emphasis?: Record<string, { color?: string; weight?: number; glow?: boolean }>;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
};

export const AnimatedLine: React.FC<AnimatedLineProps> = ({
  children,
  startFrame = 0,
  wordDelay = 3,
  emphasis = {},
  fontSize = 48,
  color = '#E5E7EB',
  fontFamily = 'Inter, sans-serif',
  align = 'center',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = children.split(' ');

  return (
    <div
      style={{
        fontSize,
        fontFamily,
        color,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        gap: '0.3em',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * wordDelay;

        const progress = spring({
          frame: frame - wordStart,
          fps,
          config: { damping: 20, stiffness: 200, mass: 0.8 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const y = interpolate(progress, [0, 1], [20, 0]);
        const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1]);

        // Check for emphasis
        const cleanWord = word.replace(/[.,!?;:'"]/g, '');
        const emphasisStyle = emphasis[cleanWord] || emphasis[word];

        const wordColor = emphasisStyle?.color || color;
        const wordWeight = emphasisStyle?.weight || 400;
        const hasGlow = emphasisStyle?.glow;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              color: wordColor,
              fontWeight: wordWeight,
              textShadow: hasGlow ? `0 0 20px ${wordColor}60, 0 0 40px ${wordColor}30` : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Text with an animated underline that draws itself
 */
type UnderlineTextProps = {
  children: string;
  startFrame?: number;
  color?: string;
  underlineColor?: string;
  fontSize?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
};

export const UnderlineText: React.FC<UnderlineTextProps> = ({
  children,
  startFrame = 0,
  color = '#E5E7EB',
  underlineColor = '#3b82f6',
  fontSize = 48,
  fontFamily = 'Inter, sans-serif',
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text fades in
  const textProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Underline draws after text appears
  const underlineProgress = spring({
    frame: frame - startFrame - 15,
    fps,
    config: { damping: 30, stiffness: 150, mass: 1 },
  });

  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const underlineWidth = interpolate(underlineProgress, [0, 1], [0, 100]);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        fontSize,
        fontFamily,
        color,
        opacity: textOpacity,
        ...style,
      }}
    >
      {children}
      <span
        style={{
          position: 'absolute',
          bottom: -4,
          left: 0,
          width: `${underlineWidth}%`,
          height: 3,
          backgroundColor: underlineColor,
          borderRadius: 2,
        }}
      />
    </span>
  );
};

/**
 * Text that types out character by character with a cursor
 */
type TypedTextProps = {
  children: string;
  startFrame?: number;
  charsPerFrame?: number;
  showCursor?: boolean;
  cursorColor?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
};

export const TypedText: React.FC<TypedTextProps> = ({
  children,
  startFrame = 0,
  charsPerFrame = 0.5,
  showCursor = true,
  cursorColor = '#3b82f6',
  fontSize = 48,
  color = '#E5E7EB',
  fontFamily = 'Inter, sans-serif',
  style,
}) => {
  const frame = useCurrentFrame();

  const adjustedFrame = frame - startFrame;
  const charsToShow = Math.max(0, Math.floor(adjustedFrame * charsPerFrame));
  const visibleText = children.slice(0, Math.min(charsToShow, children.length));
  const isComplete = visibleText.length === children.length;

  // Cursor blink
  const cursorOpacity = isComplete ? 0 : (Math.floor(frame / 15) % 2 === 0 ? 1 : 0.3);

  return (
    <span
      style={{
        fontSize,
        fontFamily,
        color,
        ...style,
      }}
    >
      {visibleText}
      {showCursor && (
        <span
          style={{
            color: cursorColor,
            opacity: cursorOpacity,
            marginLeft: 2,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

export default AnimatedLine;
