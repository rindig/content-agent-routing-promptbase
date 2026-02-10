import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';

interface ConnectorArrowProps {
  fromY: number;
  toY: number;
  color: string;
  startFrame: number;
  drawDuration: number;
  opacity?: number;
}

export const ConnectorArrow: React.FC<ConnectorArrowProps> = ({
  fromY,
  toY,
  color,
  startFrame,
  drawDuration,
  opacity = 0.4,
}) => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return null;

  const progress = interpolate(
    frame - startFrame,
    [0, drawDuration],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  const x = 540; // center of 1080px frame
  const lineLength = toY - fromY;
  const currentEndY = fromY + lineLength * progress;
  const arrowSize = 6;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1080,
        height: 1920,
        pointerEvents: 'none',
      }}
    >
      <line
        x1={x}
        y1={fromY}
        x2={x}
        y2={currentEndY}
        stroke={color}
        strokeWidth={2}
        opacity={opacity}
      />
      {progress > 0.8 && (
        <polyline
          points={`${x - arrowSize / 2},${currentEndY - arrowSize} ${x},${currentEndY} ${x + arrowSize / 2},${currentEndY - arrowSize}`}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={
            opacity *
            interpolate(progress, [0.8, 1], [0, 1], {
              extrapolateRight: 'clamp',
            })
          }
        />
      )}
    </svg>
  );
};
