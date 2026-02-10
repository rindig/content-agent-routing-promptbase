import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS } from '../../../../constants';

const ACCENT_COLORS = [
  COLORS.techBlue,
  COLORS.insightOrange,
  COLORS.solutionGreen,
  COLORS.aiPurple,
];

interface FoodCourtGridProps {
  count: number;
  columns: number;
  startFrame: number;
  staggerDelay: number;
}

export const FoodCourtGrid: React.FC<FoodCourtGridProps> = ({
  count,
  columns,
  startFrame,
  staggerDelay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rows = Math.ceil(count / columns);
  const cellW = 80;
  const cellH = 100;
  const gap = 16;
  const totalW = columns * (cellW + gap) - gap;
  const totalH = rows * (cellH + gap) - gap;
  const offsetX = (1080 - totalW) / 2;
  const offsetY = (1920 - totalH) / 2 + 80; // slightly below center

  return (
    <div
      style={{
        position: 'absolute',
        left: offsetX,
        top: offsetY,
        width: totalW,
        height: totalH,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);
        const cellStart = startFrame + i * staggerDelay;
        const color = ACCENT_COLORS[i % ACCENT_COLORS.length];

        const cellEntrance = spring({
          frame: frame - cellStart,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const cellOpacity = frame >= cellStart
          ? interpolate(cellEntrance, [0, 1], [0, 1])
          : 0;
        const cellScale = frame >= cellStart
          ? interpolate(cellEntrance, [0, 1], [0, 1])
          : 0;

        // Idle arrow pulse
        const arrowOpacity = frame >= cellStart + staggerDelay * count
          ? Math.sin((frame - cellStart + i * 8) * 0.1) * 0.3 + 0.7
          : 0.7;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: col * (cellW + gap),
              top: row * (cellH + gap),
              width: cellW,
              height: cellH,
              opacity: cellOpacity,
              transform: `scale(${cellScale})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {/* Dot figure */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
            {/* Arrow */}
            <div
              style={{
                width: 1,
                height: 20,
                backgroundColor: color,
                opacity: arrowOpacity,
              }}
            />
            {/* Box */}
            <div
              style={{
                width: 20,
                height: 16,
                borderRadius: 3,
                border: `1px solid ${color}`,
                backgroundColor: `${color}1A`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
