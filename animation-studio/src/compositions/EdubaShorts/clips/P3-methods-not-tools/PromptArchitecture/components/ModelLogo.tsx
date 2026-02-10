import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

const MODEL_CONFIG: Record<string, { color: string; glyph: string; fontSize: number }> = {
  Claude: { color: COLORS.aiPurple, glyph: 'C', fontSize: 40 },
  ChatGPT: { color: COLORS.solutionGreen, glyph: 'G', fontSize: 40 },
  Gemini: { color: COLORS.techBlue, glyph: 'Ge', fontSize: 32 },
  Local: { color: COLORS.textDim, glyph: '>', fontSize: 40 },
};

interface ModelLogoProps {
  model: 'Claude' | 'ChatGPT' | 'Gemini' | 'Local';
  size: number;
  x: number;
  y: number;
  startFrame: number;
  springPreset?: 'snappy' | 'bouncy';
  active: boolean;
}

export const ModelLogo: React.FC<ModelLogoProps> = ({
  model,
  size,
  x,
  y,
  startFrame,
  springPreset = 'bouncy',
  active,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const config = MODEL_CONFIG[model];

  const scaleProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS[springPreset],
  });

  const scale = frame >= startFrame ? interpolate(scaleProgress, [0, 1], [0, 1]) : 0;

  const glowOpacity = active
    ? Math.sin(frame * 0.1) * 0.15 + 0.85
    : 0;

  const logoOpacity = active ? 1 : 0.3;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: 16,
        backgroundColor: config.color,
        transform: `scale(${scale})`,
        opacity: scale > 0 ? logoOpacity : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: active ? `2px solid ${config.color}CC` : 'none',
        boxShadow: active ? `0 0 20px ${config.color}40` : 'none',
      }}
    >
      <div
        style={{
          fontFamily: model === 'Local' ? TYPOGRAPHY.code.fontFamily : TYPOGRAPHY.hero.fontFamily,
          fontWeight: 700,
          fontSize: config.fontSize,
          color: '#FFFFFF',
        }}
      >
        {config.glyph}
      </div>

      {/* Pulsing glow overlay */}
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 24,
            background: `radial-gradient(circle, ${config.color}20 0%, transparent 70%)`,
            opacity: glowOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
