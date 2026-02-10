import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

interface HistoricalPanelProps {
  year: string;
  label?: string;
  startFrame?: number;
  badgeColor?: string;
  children: React.ReactNode;
}

export const HistoricalPanel: React.FC<HistoricalPanelProps> = ({
  year,
  label,
  startFrame = 0,
  badgeColor = COLORS.historyGold,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const badgeProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const contentProgress = spring({
    frame: relativeFrame - 10,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const badgeScale = interpolate(badgeProgress, [0, 1], [0.5, 1]);
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);
  const contentOpacity = interpolate(
    relativeFrame,
    [10, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const contentY = interpolate(contentProgress, [0, 1], [20, 0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      {/* Year badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: `${badgeColor}26`,
          borderRadius: 24,
          padding: '8px 24px',
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            color: badgeColor,
            fontSize: 32,
          }}
        >
          {year}
        </span>
        {label && (
          <span
            style={{
              ...TYPOGRAPHY.label,
              color: badgeColor,
              fontSize: 24,
              textTransform: 'none',
              letterSpacing: 0,
              opacity: 0.8,
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
