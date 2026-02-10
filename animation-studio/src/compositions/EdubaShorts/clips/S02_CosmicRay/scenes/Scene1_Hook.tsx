import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  TOP_PANEL_IN: 5,
  LOCAL_LINE_1: 10,
  LOCAL_LINE_2: 15,
  LOCAL_LINE_3: 20,
  BOTTOM_PANEL_IN: 30,
  PROD_LINE_1: 40,
  PROD_LINE_2: 45,
  PROD_LINE_3: 50,
  HOLD: 60,
};

const LOCAL_LINES = [
  { text: '\u2713 All tests passed', delay: 0 },
  { text: '\u2713 Build complete', delay: 5 },
  { text: '\u2713 Deploy ready', delay: 10 },
];

const PROD_LINES = [
  { text: '\u2717 SEGFAULT', intensity: 0.6, speed: 4, delay: 0 },
  { text: '\u2717 UNDEFINED', intensity: 0.5, speed: 5, delay: 5 },
  { text: '\u2717 500 ERROR', intensity: 0.7, speed: 3, delay: 10 },
];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Top panel spring entrance
  const topPanelProgress = spring({
    frame: frame - BEATS.TOP_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const topY = interpolate(topPanelProgress, [0, 1], [-40, 0]);
  const topOpacity = interpolate(topPanelProgress, [0, 1], [0, 1]);

  // Bottom panel spring entrance
  const bottomPanelProgress = spring({
    frame: frame - BEATS.BOTTOM_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const bottomY = interpolate(bottomPanelProgress, [0, 1], [40, 0]);
  const bottomOpacity = interpolate(
    frame,
    [BEATS.BOTTOM_PANEL_IN, BEATS.BOTTOM_PANEL_IN + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Divider pulse
  const dividerGlow =
    frame >= BEATS.HOLD
      ? 0.3 + 0.15 * Math.sin((frame - BEATS.HOLD) * 0.12)
      : 0;

  const panelStyle: React.CSSProperties = {
    backgroundColor: COLORS.codeBg,
    borderRadius: 12,
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${COLORS.panelBorder}`,
    overflow: 'hidden',
  };

  const dotBar = (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
    </div>
  );

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          gap: 20,
          padding: LAYOUT.safePadding,
        }}
      >
        {/* Top Panel — LOCAL */}
        <div
          style={{
            ...panelStyle,
            opacity: topOpacity,
            transform: `translateY(${topY}px)`,
            boxShadow: '0 0 20px rgba(16,185,129,0.15)',
            height: 380,
          }}
        >
          {dotBar}
          <div
            style={{
              ...TYPOGRAPHY.label,
              color: COLORS.textMuted,
              marginBottom: 12,
            }}
          >
            LOCAL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOCAL_LINES.map((line, i) => {
              const lineStart = BEATS.LOCAL_LINE_1 + line.delay;
              const lineProgress = spring({
                frame: frame - lineStart,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              const lineOpacity = interpolate(
                frame,
                [lineStart, lineStart + 10],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );
              const lineScale = interpolate(lineProgress, [0, 1], [0.95, 1]);

              return (
                <div
                  key={i}
                  style={{
                    ...TYPOGRAPHY.code,
                    color: COLORS.solutionGreen,
                    opacity: lineOpacity,
                    transform: `scale(${lineScale})`,
                    transformOrigin: 'left center',
                  }}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider with purple glow */}
        <div
          style={{
            height: 2,
            backgroundColor: COLORS.aiPurple,
            opacity: interpolate(
              frame,
              [BEATS.BOTTOM_PANEL_IN, BEATS.HOLD],
              [0, 0.6],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            ),
            boxShadow: frame >= BEATS.HOLD
              ? `0 0 12px rgba(139,92,246,${dividerGlow})`
              : 'none',
          }}
        />

        {/* Bottom Panel — PRODUCTION */}
        <div
          style={{
            ...panelStyle,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`,
            border: `1px solid rgba(239,68,68,0.3)`,
            boxShadow: '0 0 20px rgba(239,68,68,0.15)',
            height: 380,
          }}
        >
          {dotBar}
          <div
            style={{
              ...TYPOGRAPHY.label,
              color: COLORS.textMuted,
              marginBottom: 12,
            }}
          >
            PRODUCTION
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROD_LINES.map((line, i) => {
              const lineStart = BEATS.PROD_LINE_1 + line.delay;
              const lineOpacity = interpolate(
                frame,
                [lineStart, lineStart + 8],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              );

              return (
                <div
                  key={i}
                  style={{
                    opacity: lineOpacity,
                  }}
                >
                  <GlitchText
                    startFrame={lineStart}
                    color={COLORS.errorRed}
                    intensity={line.intensity}
                    speed={line.speed}
                    fontSize={TYPOGRAPHY.code.fontSize}
                    fontFamily={TYPOGRAPHY.code.fontFamily}
                    fontWeight={TYPOGRAPHY.code.fontWeight as number}
                    backgroundColor={COLORS.codeBg}
                  >
                    {line.text}
                  </GlitchText>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneContainer>
  );
};
