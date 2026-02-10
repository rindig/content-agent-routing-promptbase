import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

interface TimelineNode {
  year: string;
  label: string;
  color?: string;
}

interface TimelineProps {
  nodes: TimelineNode[];
  startFrame?: number;
  staggerDelay?: number;
  activeIndex?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const Timeline: React.FC<TimelineProps> = ({
  nodes,
  startFrame = 0,
  staggerDelay = 12,
  activeIndex,
  orientation = 'horizontal',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const isVertical = orientation === 'vertical';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isVertical ? 8 : 0,
        width: '100%',
        position: 'relative',
      }}
    >
      {nodes.map((node, i) => {
        const nodeStart = i * staggerDelay;
        const nodeProgress = spring({
          frame: relativeFrame - nodeStart,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        const isActive = i === activeIndex;
        const nodeColor = node.color || COLORS.techBlue;
        const nodeScale = interpolate(nodeProgress, [0, 1], [0, isActive ? 1.2 : 1]);
        const nodeOpacity = interpolate(
          relativeFrame,
          [nodeStart, nodeStart + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Glow pulse for active node
        const glowOpacity = isActive
          ? 0.2 + 0.2 * Math.sin((relativeFrame - nodeStart) * 0.1)
          : 0;

        return (
          <React.Fragment key={i}>
            {/* Connector line */}
            {i > 0 && (
              <div
                style={{
                  [isVertical ? 'height' : 'width']: isVertical ? 24 : 40,
                  [isVertical ? 'width' : 'height']: 2,
                  backgroundColor: COLORS.panelBorder,
                  opacity: nodeOpacity,
                  flexShrink: 0,
                }}
              />
            )}

            {/* Node */}
            <div
              style={{
                display: 'flex',
                flexDirection: isVertical ? 'row' : 'column',
                alignItems: 'center',
                gap: 8,
                opacity: nodeOpacity,
                transform: `scale(${nodeScale})`,
                flexShrink: 0,
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: nodeColor,
                  boxShadow: isActive
                    ? `0 0 20px ${nodeColor}${Math.round(glowOpacity * 255).toString(16).padStart(2, '0')}`
                    : 'none',
                }}
              />

              {/* Labels */}
              <div style={{ textAlign: isVertical ? 'left' : 'center' }}>
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 22,
                    color: nodeColor,
                  }}
                >
                  {node.year}
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 20,
                    color: COLORS.textMuted,
                    textTransform: 'none',
                    letterSpacing: 0,
                    maxWidth: isVertical ? 300 : 120,
                  }}
                >
                  {node.label}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
