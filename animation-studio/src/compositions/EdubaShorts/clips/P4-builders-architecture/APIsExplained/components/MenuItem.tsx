import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface MenuItemProps {
  endpoint: string;
  description: string;
  color: string;
  startFrame: number;
  staggerIndex: number;
  highlighted?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  endpoint,
  description,
  color,
  startFrame,
  staggerIndex,
  highlighted = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveStart = startFrame + staggerIndex * 6;

  const entrance = spring({
    frame: frame - effectiveStart,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = frame >= effectiveStart ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const translateX = frame >= effectiveStart ? interpolate(entrance, [0, 1], [60, 0]) : 60;

  const borderColor = highlighted ? `${color}CC` : COLORS.bgSurfaceAlt;
  const bgColor = highlighted ? COLORS.bgSurfaceAlt : COLORS.bgSurface;
  const textShadow = highlighted ? `0 0 8px ${color}66` : 'none';

  return (
    <div
      style={{
        width: 700,
        height: 60,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontWeight: 400,
          fontSize: 28,
          color,
          textShadow,
        }}
      >
        {endpoint}
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 400,
          fontSize: 24,
          color: COLORS.textMuted,
        }}
      >
        {description}
      </div>
    </div>
  );
};
