import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 42,
  LINE_3_IN: 54,
  HOLD: 85,
  FADE_OUT: 180,
};

// ── Closing lines ──
const LINES = [
  { text: 'The tool depends on open source.', color: COLORS.techBlue },
  { text: 'The way we use it', color: COLORS.textPrimary },
  { text: 'is starving the foundation.', color: COLORS.errorRed },
];

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade in
  const crossfadeOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Dual glow pulse (subtle sinusoidal)
  const glowPulse = frame >= BEATS.HOLD
    ? interpolate(
        Math.sin(((frame - BEATS.HOLD) / 90) * Math.PI * 2),
        [-1, 1],
        [0.02, 0.04]
      )
    : 0.03;

  // Fade out
  const fadeOutOpacity = frame >= BEATS.FADE_OUT
    ? interpolate(frame - BEATS.FADE_OUT, [0, 60], [1, 0], {
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <SceneContainer
      background="dark"
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={60}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
          opacity: crossfadeOpacity,
        }}
      >
        {/* Dual glow background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Blue glow at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 800,
              height: 600,
              background: `radial-gradient(ellipse at center, ${COLORS.techBlue} 0%, transparent 70%)`,
              opacity: glowPulse,
            }}
          />
          {/* Red glow at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 800,
              height: 600,
              background: `radial-gradient(ellipse at center, ${COLORS.errorRed} 0%, transparent 70%)`,
              opacity: glowPulse,
            }}
          />
        </div>

        {/* Closing statement lines */}
        <div
          style={{
            maxWidth: 860,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            zIndex: 1,
          }}
        >
          {LINES.map((line, i) => {
            const lineStart = [BEATS.LINE_1_IN, BEATS.LINE_2_IN, BEATS.LINE_3_IN][i];
            if (frame < lineStart) return <div key={i} style={{ minHeight: 56 }} />;

            return (
              <div key={i}>
                <BlurText
                  startFrame={lineStart}
                  animateBy="words"
                  staggerDelay={3}
                  fontSize={44}
                  color={line.color}
                >
                  {line.text}
                </BlurText>
              </div>
            );
          })}
        </div>
      </div>
    </SceneContainer>
  );
};
