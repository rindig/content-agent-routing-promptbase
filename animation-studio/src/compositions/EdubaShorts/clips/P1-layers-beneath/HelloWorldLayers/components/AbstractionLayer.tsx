import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SPRING_CONFIGS } from '../../../../constants';

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface AbstractionLayerProps {
  label: string;
  sublabel?: string;
  color: string;
  width?: number;
  height?: number;
  y: number;
  entrance: 'slideDown' | 'fadeIn';
  startFrame: number;
  springPreset: keyof typeof SPRING_CONFIGS;
  opacity?: number;
  /** Border-only silhouette (Scene 4 simplified state) */
  simplified?: boolean;
}

export const AbstractionLayer: React.FC<AbstractionLayerProps> = ({
  label,
  sublabel,
  color,
  width = 880,
  height = 80,
  y,
  entrance,
  startFrame,
  springPreset,
  opacity = 1,
  simplified = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS[springPreset],
  });

  let translateY = 0;
  let scale = 1;
  let elemOpacity = opacity;

  if (entrance === 'slideDown') {
    translateY = interpolate(progress, [0, 1], [-40, 0]);
    scale = interpolate(progress, [0, 1], [0.95, 1.0]);
    elemOpacity = interpolate(progress, [0, 1], [0, 1]) * opacity;
  } else {
    elemOpacity = interpolate(progress, [0, 1], [0, 1]) * opacity;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: (1080 - width) / 2,
        width,
        height,
        backgroundColor: simplified ? 'transparent' : '#12121A',
        borderRadius: 16,
        borderLeft: simplified ? undefined : `3px solid ${color}`,
        border: simplified ? `3px solid ${hexToRgba(color, 0.3)}` : undefined,
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: elemOpacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 36,
          color: '#E5E7EB',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span
          style={{
            fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
            fontWeight: 400,
            fontSize: 24,
            color: '#9CA3AF',
          }}
        >
          {sublabel}
        </span>
      )}
    </div>
  );
};
