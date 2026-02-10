import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, LAYOUT, TYPOGRAPHY } from '../constants';

interface SplitScreenProps {
  topLabel: string;
  bottomLabel: string;
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  startFrame?: number;
  topBg?: string;
  bottomBg?: string;
  dividerColor?: string;
  labelColors?: [string, string];
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  topLabel,
  bottomLabel,
  topContent,
  bottomContent,
  startFrame = 0,
  topBg = COLORS.bgSurface,
  bottomBg = COLORS.bgSurface,
  dividerColor = COLORS.panelBorder,
  labelColors = [COLORS.textMuted, COLORS.textMuted],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const topProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const bottomProgress = spring({
    frame: relativeFrame - 15,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const topY = interpolate(topProgress, [0, 1], [-40, 0]);
  const topOpacity = interpolate(topProgress, [0, 1], [0, 1]);
  const bottomY = interpolate(bottomProgress, [0, 1], [40, 0]);
  const bottomOpacity = interpolate(
    relativeFrame,
    [15, 35],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const panelStyle: React.CSSProperties = {
    borderRadius: 12,
    padding: 24,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: LAYOUT.contentZoneHeight,
        padding: `${LAYOUT.platformTopSafe + LAYOUT.safeMarginY}px ${LAYOUT.safeMarginX}px ${LAYOUT.platformBottomSafe}px`,
      }}
    >
      {/* Top panel */}
      <div
        style={{
          ...panelStyle,
          backgroundColor: topBg,
          border: `1px solid ${dividerColor}`,
          opacity: topOpacity,
          transform: `translateY(${topY}px)`,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.label,
            color: labelColors[0],
            marginBottom: 16,
          }}
        >
          {topLabel}
        </div>
        {topContent}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 2,
          backgroundColor: dividerColor,
          opacity: interpolate(
            relativeFrame,
            [10, 25],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          ),
        }}
      />

      {/* Bottom panel */}
      <div
        style={{
          ...panelStyle,
          backgroundColor: bottomBg,
          border: `1px solid ${dividerColor}`,
          opacity: bottomOpacity,
          transform: `translateY(${bottomY}px)`,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.label,
            color: labelColors[1],
            marginBottom: 16,
          }}
        >
          {bottomLabel}
        </div>
        {bottomContent}
      </div>
    </div>
  );
};
