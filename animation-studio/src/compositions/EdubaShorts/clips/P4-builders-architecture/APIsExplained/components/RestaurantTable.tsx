import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface RestaurantTableProps {
  label: string;
  color: string;
  x: number;
  y: number;
  startFrame: number;
  springPreset?: 'snappy' | 'gentle' | 'bouncy';
  scale?: number;
}

export const RestaurantTable: React.FC<RestaurantTableProps> = ({
  label,
  color,
  x,
  y,
  startFrame,
  springPreset = 'bouncy',
  scale: externalScale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS[springPreset],
  });

  const opacity = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const scale = frame >= startFrame
    ? interpolate(entrance, [0, 1], [0.9, 1]) * externalScale
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Figure: head + body */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: color,
          marginBottom: 4,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderTop: `60px solid ${color}CC`,
          marginBottom: 8,
        }}
      />

      {/* Table */}
      <div
        style={{
          width: 280,
          height: 20,
          borderRadius: 12,
          backgroundColor: COLORS.bgSurface,
          border: `2px solid ${color}`,
        }}
      />

      {/* Label badge */}
      <div
        style={{
          marginTop: 12,
          backgroundColor: COLORS.bgSurface,
          border: `2px solid ${color}`,
          borderRadius: 8,
          padding: '4px 16px',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 500,
          fontSize: 28,
          color: COLORS.textBody,
        }}
      >
        {label}
      </div>
    </div>
  );
};
