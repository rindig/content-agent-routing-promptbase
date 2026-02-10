import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * TreeNode Component
 *
 * A single node in the AST tree visualization.
 * Animates in with spring physics.
 */

type TreeNodeProps = {
  label: string;
  sublabel?: string;
  entranceFrame: number;
  x: number;
  y: number;
  highlighted?: boolean;
  highlightColor?: string;
  fontSize?: number;
};

export const TreeNode: React.FC<TreeNodeProps> = ({
  label,
  sublabel,
  entranceFrame,
  x,
  y,
  highlighted = false,
  highlightColor = COLORS.primary,
  fontSize = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - entranceFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: highlighted ? `${highlightColor}20` : COLORS.surface,
          border: `2px solid ${highlighted ? highlightColor : COLORS.surfaceAlt}`,
          borderRadius: 8,
          padding: sublabel ? '8px 16px' : '12px 20px',
          boxShadow: highlighted
            ? `0 0 20px ${highlightColor}40`
            : `0 4px 12px rgba(0,0,0,0.3)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize,
            fontWeight: 500,
            color: highlighted ? highlightColor : COLORS.text,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: fontSize - 4,
              color: COLORS.textMuted,
              marginTop: 4,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * TreeConnection Component
 *
 * An animated line connecting two tree nodes.
 * Draws from start to end point.
 */

type TreeConnectionProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  entranceFrame: number;
  color?: string;
};

export const TreeConnection: React.FC<TreeConnectionProps> = ({
  startX,
  startY,
  endX,
  endY,
  entranceFrame,
  color = COLORS.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - entranceFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Calculate line properties
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const visibleLength = interpolate(progress, [0, 1], [0, length]);
  const opacity = interpolate(progress, [0, 0.3], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: visibleLength,
        height: 2,
        backgroundColor: color,
        opacity,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
        borderRadius: 1,
      }}
    />
  );
};
