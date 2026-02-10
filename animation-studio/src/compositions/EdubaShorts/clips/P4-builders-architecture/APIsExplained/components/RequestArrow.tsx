import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SPRING_CONFIGS } from '../../../../constants';

interface RequestArrowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  startFrame: number;
  drawDuration: number;
  label?: string;
  labelColor?: string;
}

export const RequestArrow: React.FC<RequestArrowProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  color,
  startFrame,
  drawDuration,
  label,
  labelColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  const progress = interpolate(
    frame - startFrame,
    [0, drawDuration],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Current endpoint based on progress
  const curX = fromX + dx * progress;
  const curY = fromY + dy * progress;

  // Dot position (travels along path)
  const dotX = fromX + dx * progress;
  const dotY = fromY + dy * progress;

  // Arrowhead at destination
  const arrowSize = 10;
  const arrowAngle = Math.atan2(dy, dx);
  const a1x = curX - arrowSize * Math.cos(arrowAngle - 0.4);
  const a1y = curY - arrowSize * Math.sin(arrowAngle - 0.4);
  const a2x = curX - arrowSize * Math.cos(arrowAngle + 0.4);
  const a2y = curY - arrowSize * Math.sin(arrowAngle + 0.4);

  // Label midpoint
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // SVG bounds
  const minX = Math.min(fromX, toX) - 30;
  const minY = Math.min(fromY, toY) - 30;
  const svgW = Math.abs(dx) + 60;
  const svgH = Math.abs(dy) + 60;

  return (
    <>
      <svg
        style={{
          position: 'absolute',
          left: minX,
          top: minY,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
        width={svgW}
        height={svgH}
      >
        {/* Line */}
        <line
          x1={fromX - minX}
          y1={fromY - minY}
          x2={curX - minX}
          y2={curY - minY}
          stroke={color}
          strokeWidth={3}
          opacity={0.8}
        />

        {/* Arrowhead */}
        {progress > 0.8 && (
          <polygon
            points={`${curX - minX},${curY - minY} ${a1x - minX},${a1y - minY} ${a2x - minX},${a2y - minY}`}
            fill={color}
            opacity={interpolate(progress, [0.8, 1], [0, 1], { extrapolateRight: 'clamp' })}
          />
        )}

        {/* Animated dot */}
        <circle
          cx={dotX - minX}
          cy={dotY - minY}
          r={4}
          fill={color}
        />

        {/* Trail dots */}
        {[0.06, 0.12, 0.18].map((offset, i) => {
          const tp = Math.max(0, progress - offset);
          return (
            <circle
              key={i}
              cx={fromX + dx * tp - minX}
              cy={fromY + dy * tp - minY}
              r={3}
              fill={color}
              opacity={[0.6, 0.3, 0.1][i]}
            />
          );
        })}
      </svg>

      {/* Label */}
      {label && progress > 0.3 && (
        <div
          style={{
            position: 'absolute',
            left: midX,
            top: midY - 20,
            transform: 'translate(-50%, -50%)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 24,
            color: labelColor || '#9CA3AF',
            backgroundColor: '#0A0A0F',
            padding: '2px 12px',
            borderRadius: 4,
            opacity: interpolate(progress, [0.3, 0.5], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
