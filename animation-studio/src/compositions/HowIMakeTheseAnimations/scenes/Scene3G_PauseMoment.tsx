/**
 * Scene 3G: Pause Moment
 * [4:00 - 4:15] — 450 frames
 *
 * Breathing room with spec as hero. No new information.
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

export const Scene3G_PauseMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Gentle breathing pulse
  const breathe = Math.sin(frame * 0.03) * 0.03 + 1;
  const glowPulse = Math.sin(frame * 0.04) * 8 + 16;

  // Ambient particles
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2 + frame * 0.005;
    const radius = 180 + Math.sin(frame * 0.02 + i) * 30;
    return {
      x: 960 + Math.cos(angle) * radius,
      y: 540 + Math.sin(angle) * radius,
      opacity: Math.sin(frame * 0.03 + i * 0.5) * 0.3 + 0.3,
      size: 3 + Math.sin(frame * 0.05 + i) * 1.5,
    };
  });

  // Exit fade
  const exitFade = interpolate(frame, [400, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${breathe})`,
          opacity: opacity * exitFade,
          textAlign: 'center',
        }}
      >
        {/* Spec document hero */}
        <div
          style={{
            width: 200,
            height: 260,
            backgroundColor: COLORS.surface,
            border: `2px solid ${COLORS.spec}`,
            borderRadius: 16,
            margin: '0 auto',
            position: 'relative',
            boxShadow: `0 0 ${glowPulse}px ${COLORS.spec}30, 0 0 ${glowPulse * 2}px ${COLORS.spec}10`,
          }}
        >
          {/* Corner brackets */}
          <div style={{ position: 'absolute', top: 8, left: 8, width: 16, height: 16, borderTop: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}`, opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderTop: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}`, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 8, left: 8, width: 16, height: 16, borderBottom: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}`, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, borderBottom: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}`, opacity: 0.6 }} />

          {/* Document lines */}
          <div style={{ padding: '40px 24px' }}>
            {[0.6, 0.8, 0.5, 0.7, 0.4, 0.6, 0.3].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 3,
                  width: `${w * 100}%`,
                  backgroundColor: i === 0 ? COLORS.spec : `${COLORS.spec}40`,
                  borderRadius: 2,
                  marginBottom: 14,
                  opacity: 0.6 + Math.sin(frame * 0.02 + i * 0.3) * 0.2,
                }}
              />
            ))}
          </div>

          {/* Scan line */}
          <div
            style={{
              position: 'absolute',
              top: `${((frame % 180) / 180) * 100}%`,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.spec}30, transparent)`,
            }}
          />
        </div>

        {/* SPEC label */}
        <div
          style={{
            marginTop: 32,
            fontSize: SIZES.title,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: COLORS.spec,
            letterSpacing: '0.12em',
            textShadow: `0 0 ${glowPulse}px ${COLORS.spec}40`,
          }}
        >
          SPEC
        </div>
      </div>

      {/* Ambient particles */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width="1920"
        height="1080"
      >
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.spec} opacity={p.opacity * exitFade} />
        ))}
      </svg>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene3G_PauseMoment;
