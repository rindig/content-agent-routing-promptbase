import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

interface OutputPanelProps {
  quality: 'poor' | 'excellent';
  width: number;
  height: number;
  x: number;
  y: number;
  startFrame: number;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  quality,
  width,
  height,
  x,
  y,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = frame >= startFrame ? interpolate(entrance, [0, 1], [0, 1]) : 0;
  const translateY = frame >= startFrame ? interpolate(entrance, [0, 1], [30, 0]) : 30;

  const isPoor = quality === 'poor';
  const borderColor = isPoor ? `${COLORS.errorRed}4D` : `${COLORS.solutionGreen}4D`;
  const badgeColor = isPoor ? COLORS.errorRed : COLORS.solutionGreen;
  const badgeText = isPoor ? 'LOW QUALITY' : 'HIGH QUALITY';
  const textColor = isPoor ? COLORS.textDim : COLORS.textBody;

  const poorLines = [
    'uh the ML thing is like neural stuff',
    'basically it learns from data kinda',
    'just use tensorflow or whatever idk',
  ];
  const goodLines = [
    'Supervised learning trains on labeled data.',
    'The model maps inputs → outputs via a loss fn.',
    'Example: classify emails as spam / not-spam.',
  ];
  const lines = isPoor ? poorLines : goodLines;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        border: `2px solid ${borderColor}`,
        opacity,
        transform: `translateY(${translateY}px)`,
        padding: 20,
        overflow: 'hidden',
      }}
    >
      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          backgroundColor: badgeColor,
          borderRadius: 8,
          padding: '4px 10px',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 600,
          fontSize: 16,
          color: '#FFFFFF',
        }}
      >
        {badgeText}
      </div>

      {/* Checkmark for excellent */}
      {!isPoor && (
        <span
          style={{
            position: 'absolute',
            left: 16,
            top: 50,
            fontSize: 24,
            color: COLORS.solutionGreen,
          }}
        >
          ✓
        </span>
      )}

      {/* Output lines */}
      <div style={{ marginTop: 36, paddingLeft: isPoor ? 0 : 24 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontWeight: 400,
              fontSize: 20,
              color: textColor,
              lineHeight: 1.6,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Strikethrough for poor */}
      {isPoor && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            width: '80%',
            height: 2,
            backgroundColor: COLORS.errorRed,
            opacity: 0.15,
            transform: 'rotate(-5deg)',
          }}
        />
      )}
    </div>
  );
};
