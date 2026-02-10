/**
 * Scene 8B: Creative Work Moved
 * [12:05 - 12:30] — 750 frames
 *
 * Creative work didn't disappear — it moved. To spec, to refinement.
 * "This is a real path" — honest, empowering.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { MOVED: 0, WHERE: 150, OFFER: 300, CAVEAT: 450, POSSIBLE: 600 };

export const Scene8B_CreativeWorkMoved: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 110) / 110) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 40, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  // Energy transfer particles
  const transferParticles = Array.from({ length: 8 }).map((_, i) => {
    const t = ((frame * 0.8 + i * 20) % 120) / 120;
    return {
      x: interpolate(t, [0, 1], [400, 1500]),
      y: 540 + Math.sin(t * Math.PI * 2 + i) * 40,
      opacity: Math.sin(t * Math.PI) * 0.4,
      size: 5 + Math.sin(i * 1.5) * 2,
    };
  });

  // Ambient
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    x: (i * 250 + frame * (0.2 + i * 0.03)) % 1920,
    y: (i * 160 + Math.sin(frame * 0.02 + i) * 40) % 1080,
    opacity: 0.1 + Math.sin(frame * 0.03 + i) * 0.06,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.possibility, opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.possibility}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= MOVED ============= */}
      {frame < PHASE.WHERE + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.WHERE), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Creative work didn't <span style={{ color: COLORS.time, textDecoration: 'line-through' }}>disappear</span>
          </div>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.emphasis, marginTop: 20 }}>
            It moved
          </div>
          {/* Energy transfer line */}
          <svg width="600" height="40" viewBox="0 0 600 40" style={{ marginTop: 20 }}>
            {transferParticles.slice(0, 5).map((p, i) => (
              <circle key={i} cx={interpolate(((frame * 0.8 + i * 25) % 120) / 120, [0, 1], [0, 600])} cy={20} r={p.size} fill={COLORS.emphasis} opacity={Math.sin(((frame * 0.8 + i * 25) % 120) / 120 * Math.PI) * 0.5} />
            ))}
            <line x1={0} y1={20} x2={600} y2={20} stroke={COLORS.emphasis} strokeWidth={1.5} opacity={0.15} />
          </svg>
        </div>
      )}

      {/* ============= WHERE ============= */}
      {frame >= PHASE.WHERE && frame < PHASE.OFFER + 20 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.WHERE, PHASE.OFFER) }}>
          {[
            { label: 'To the spec', sub: 'Creative input', color: COLORS.spec },
            { label: 'To the refinement', sub: 'Creative polish', color: COLORS.refine },
            { label: 'Where I want my attention', sub: 'Intentional allocation', color: COLORS.emphasis },
          ].map((item, i) => {
            const e = spring({ frame: frame - PHASE.WHERE - 15 - i * 20, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{
                opacity: interpolate(e, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(e, [0, 1], [40, 0])}px)`,
                display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: item.color }}>{item.label}</span>
                  <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginLeft: 16 }}>-- {item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============= THE OFFER ============= */}
      {frame >= PHASE.OFFER && frame < PHASE.CAVEAT + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.OFFER, PHASE.CAVEAT), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 16 }}>
            If you have ideas to visualize
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 30 }}>
            but you're not an animator
          </div>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility }}>
            This is a real path
          </div>
          <svg width="500" height="20" viewBox="0 0 500 20" style={{ marginTop: 16 }}>
            <line x1={0} y1={10} x2={500 * spring({ frame: frame - PHASE.OFFER - 40, fps, config: SPRING_CONFIGS.snappy })} y2={10} stroke={COLORS.possibility} strokeWidth={4} strokeLinecap="round" />
            <circle cx={Math.min(500, 500 * spring({ frame: frame - PHASE.OFFER - 40, fps, config: SPRING_CONFIGS.snappy }))} cy={10} r={6} fill={COLORS.possibility} />
          </svg>
        </div>
      )}

      {/* ============= CAVEAT ============= */}
      {frame >= PHASE.CAVEAT && frame < PHASE.POSSIBLE + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.CAVEAT, PHASE.POSSIBLE), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 30 }}>
            Not easy exactly
          </div>
          <div style={{ display: 'flex', gap: 30, justifyContent: 'center' }}>
            {['Setup', 'Learning', 'Iteration'].map((item, i) => {
              const e = spring({ frame: frame - PHASE.CAVEAT - 20 - i * 12, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{
                  opacity: interpolate(e, [0, 1], [0, 1]),
                  padding: '14px 28px', backgroundColor: COLORS.surface,
                  border: `2px solid ${COLORS.textMuted}30`, borderRadius: 10,
                }}>
                  <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted }}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============= POSSIBLE ============= */}
      {frame >= PHASE.POSSIBLE && (
        <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: spring({ frame: frame - PHASE.POSSIBLE, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center',
        }}>
          <div style={{
            fontSize: SIZES.hero, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility,
            textShadow: `0 0 ${Math.sin((frame - PHASE.POSSIBLE) * 0.06) * 8 + 14}px ${COLORS.possibility}40`,
          }}>
            Possible
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text, marginTop: 16 }}>
            in a way it wasn't before
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene8B_CreativeWorkMoved;
