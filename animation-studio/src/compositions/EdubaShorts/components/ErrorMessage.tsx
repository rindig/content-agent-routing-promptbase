import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

interface ErrorMessageProps {
  message: string;
  startFrame?: number;
  icon?: 'x' | 'warning' | 'search';
}

const ICONS: Record<string, string> = {
  x: '\u2715',
  warning: '\u26A0',
  search: '\uD83D\uDD0D',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  startFrame = 0,
  icon = 'x',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const entrance = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Subtle shake on entrance
  const shakeX =
    relativeFrame < 8
      ? Math.sin(relativeFrame * 2.5) * interpolate(relativeFrame, [0, 8], [4, 0])
      : 0;

  return (
    <div
      style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        border: `1.5px solid ${COLORS.errorRed}`,
        borderRadius: 12,
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `scale(${scale}) translateX(${shakeX}px)`,
        width: '100%',
      }}
    >
      <span style={{ fontSize: 24, color: COLORS.errorRed }}>{ICONS[icon]}</span>
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 28,
          color: COLORS.textBody,
        }}
      >
        {message}
      </span>
    </div>
  );
};
