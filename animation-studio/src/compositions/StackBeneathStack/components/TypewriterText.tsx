import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { ANIMATIONS } from '../constants';

type TypewriterTextProps = {
  text: string;
  startFrame?: number;
  charDelay?: number;
  showCursor?: boolean;
  cursorBlinkFrames?: number;
  style?: React.CSSProperties;
};

const getTypedText = ({
  frame,
  text,
  startFrame,
  charDelay,
}: {
  frame: number;
  text: string;
  startFrame: number;
  charDelay: number;
}): string => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return '';

  const typedChars = Math.floor(adjustedFrame / charDelay);
  return text.slice(0, Math.min(typedChars, text.length));
};

const Cursor: React.FC<{
  frame: number;
  blinkFrames: number;
  visible: boolean;
}> = ({ frame, blinkFrames, visible }) => {
  if (!visible) return null;

  const opacity = interpolate(
    frame % blinkFrames,
    [0, blinkFrames / 2, blinkFrames],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return <span style={{ opacity }}>{'\u258C'}</span>;
};

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charDelay = ANIMATIONS.typewriterCharDelay,
  showCursor = true,
  cursorBlinkFrames = 16,
  style,
}) => {
  const frame = useCurrentFrame();

  const typedText = getTypedText({
    frame,
    text,
    startFrame,
    charDelay,
  });

  const isComplete = typedText.length === text.length;

  return (
    <span style={style}>
      {typedText}
      <Cursor
        frame={frame}
        blinkFrames={cursorBlinkFrames}
        visible={showCursor && !isComplete}
      />
    </span>
  );
};

// Utility to calculate how many frames the typewriter animation takes
export const getTypewriterDuration = (text: string, charDelay: number = ANIMATIONS.typewriterCharDelay): number => {
  return text.length * charDelay;
};
