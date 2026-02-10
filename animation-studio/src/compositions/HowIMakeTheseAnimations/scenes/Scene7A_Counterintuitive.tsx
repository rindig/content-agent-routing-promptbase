/**
 * Scene 7A: Counterintuitive Setup
 * [10:30 - 10:45] — 450 frames
 *
 * "Constraints enable creativity" — THE KEY INSIGHT of the video.
 * Section header + thesis reveal with massive emphasis.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

export const Scene7A_Counterintuitive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 90) / 90) * 100;

  // Section header: 0-120
  const headerEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const headerFade = interpolate(frame, [90, 120], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const underlineProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy });

  // Counterintuitive: 120-270
  const counterEntrance = spring({ frame: frame - 120, fps, config: SPRING_CONFIGS.gentle });
  const counterOpacity = frame >= 120 ? interpolate(counterEntrance, [0, 1], [0, 1]) : 0;
  const counterFade = interpolate(frame, [240, 270], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Key insight: 270+
  const insightEntrance = spring({ frame: frame - 270, fps, config: SPRING_CONFIGS.gentle });
  const insightOpacity = frame >= 270 ? interpolate(insightEntrance, [0, 1], [0, 1]) : 0;
  const insightScale = frame >= 270 ? interpolate(insightEntrance, [0, 1], [0.8, 1]) : 0.8;

  // Glow pulse
  const glowIntensity = frame >= 320 ? Math.sin((frame - 320) * 0.06) * 10 + 20 : 0;

  // Key icon
  const keyProgress = frame >= 160 ? spring({ frame: frame - 160, fps, config: SPRING_CONFIGS.bouncy }) : 0;
  const keyRotation = interpolate(keyProgress, [0, 1], [90, 0]);
  const keyScale = interpolate(keyProgress, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}20, transparent)`, pointerEvents: 'none' }} />

      {/* ============= SECTION HEADER ============= */}
      {frame < 150 && (
        <div style={{
          position: 'absolute', top: 80, left: 100,
          opacity: interpolate(headerEntrance, [0, 1], [0, 1]) * headerFade,
          transform: `translateX(${interpolate(headerEntrance, [0, 1], [-60, 0])}px)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ padding: '8px 20px', backgroundColor: `${COLORS.emphasis}15`, border: `1px solid ${COLORS.emphasis}30`, borderRadius: 8 }}>
              <span style={{ fontSize: SIZES.code, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.emphasis, fontWeight: 600 }}>04</span>
            </div>
            <span style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text, letterSpacing: '0.06em' }}>
              THE CONSTRAINTS INSIGHT
            </span>
          </div>
          <svg width="400" height="4" style={{ marginTop: 14, marginLeft: 72 }}>
            <line x1={0} y1={2} x2={400 * underlineProgress} y2={2} stroke={COLORS.emphasis} strokeWidth={3} strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* ============= COUNTERINTUITIVE ============= */}
      {frame >= 120 && frame < 300 && (
        <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', opacity: counterOpacity * counterFade, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 30 }}>
            Feels <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>counterintuitive</span>
          </div>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: `rotate(${keyRotation}deg) scale(${keyScale})`, marginBottom: 24 }}>
            <circle cx={44} cy={44} r={22} fill="none" stroke={COLORS.emphasis} strokeWidth={3.5} />
            <circle cx={44} cy={44} r={8} fill={`${COLORS.emphasis}30`} />
            <line x1={64} y1={44} x2={105} y2={44} stroke={COLORS.emphasis} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={88} y1={44} x2={88} y2={60} stroke={COLORS.emphasis} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={100} y1={44} x2={100} y2={56} stroke={COLORS.emphasis} strokeWidth={3.5} strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>
            But actually <span style={{ color: COLORS.emphasis, fontWeight: 700 }}>the key</span>
          </div>
        </div>
      )}

      {/* ============= THE INSIGHT ============= */}
      {frame >= 270 && (
        <div style={{ position: 'absolute', top: '48%', left: '50%', transform: `translate(-50%, -50%) scale(${insightScale})`, opacity: insightOpacity, textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.4, marginBottom: 40 }}>
            "AI is fast"
          </div>
          <div style={{
            fontSize: SIZES.hero, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700,
            color: COLORS.emphasis, letterSpacing: '0.02em',
            textShadow: `0 0 ${glowIntensity}px ${COLORS.emphasis}50, 0 0 ${glowIntensity * 2}px ${COLORS.emphasis}20`,
          }}>
            Constraints enable creativity
          </div>
          <svg width="700" height="6" style={{ marginTop: 20 }}>
            <line x1={0} y1={3} x2={700 * spring({ frame: frame - 300, fps, config: SPRING_CONFIGS.snappy })} y2={3} stroke={COLORS.emphasis} strokeWidth={3} strokeLinecap="round" opacity={0.5} />
          </svg>
        </div>
      )}

      {/* Background glow */}
      {frame >= 300 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.emphasis}08 0%, transparent 70%)`, opacity: insightOpacity, pointerEvents: 'none' }} />
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene7A_Counterintuitive;
