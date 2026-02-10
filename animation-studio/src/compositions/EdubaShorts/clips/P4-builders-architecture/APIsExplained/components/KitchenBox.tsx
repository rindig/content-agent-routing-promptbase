import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface KitchenBoxProps {
  label: string;
  sublabel?: string;
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
  startFrame: number;
  processing?: boolean;
  scale?: number;
}

export const KitchenBox: React.FC<KitchenBoxProps> = ({
  label,
  sublabel,
  color,
  width,
  height,
  x,
  y,
  startFrame,
  processing = false,
  scale: externalScale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const translateY = frame >= startFrame ? interpolate(entrance, [0, 1], [40, 0]) : 40;

  const gearRotation = processing ? frame * 1.6 : frame * 0.8;
  const borderOpacity = processing
    ? Math.sin(frame * 0.15) * 0.3 + 0.7
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        backgroundColor: COLORS.bgSurface,
        border: `3px solid ${color}`,
        borderRadius: 16,
        opacity: opacity * borderOpacity,
        transform: `translateY(${translateY}px) scale(${externalScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderStyle: sublabel?.includes("can't see") ? 'dashed' : 'solid',
      }}
    >
      {/* Gear icon (SVG) */}
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        style={{
          transform: `rotate(${gearRotation}deg)`,
          opacity: 0.4,
        }}
      >
        <path
          d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          fill="none"
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>

      {/* Label */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 600,
          fontSize: 36,
          color: COLORS.textBody,
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontWeight: 400,
            fontSize: 24,
            color: COLORS.textMuted,
          }}
        >
          {sublabel}
        </div>
      )}

      {/* Processing scan line */}
      {processing && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: `${((frame % 30) / 30) * 100}%`,
            width: '100%',
            height: 2,
            background: `linear-gradient(90deg, transparent, ${color}33, transparent)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
