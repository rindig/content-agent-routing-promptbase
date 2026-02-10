/**
 * Scene 8A: Coming Full Circle
 * [11:45 - 12:05] — 600 frames
 *
 * Return to "week -> hour" claim. "Not magic. I built a system."
 * System recap: spec, docs, Claude, components, refinement.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { CALLBACK: 0, CLAIM: 90, BEHIND: 240, SYSTEM: 390 };

export const Scene8A_FullCircle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 100) / 100) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  // Particles
  const particles = Array.from({ length: 10 }).map((_, i) => ({
    x: (i * 200 + frame * (0.2 + i * 0.03)) % 1920,
    y: (i * 140 + Math.sin(frame * 0.02 + i) * 40) % 1080,
    opacity: 0.1 + Math.sin(frame * 0.03 + i) * 0.06,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.possibility, opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.possibility}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= CALLBACK ============= */}
      {frame < PHASE.CLAIM + 20 && (
        <div style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.CLAIM), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            Coming back to where we started
          </div>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginTop: 24 }}>
            <path d="M40,10 A28,28 0 1,1 16,30" fill="none" stroke={COLORS.emphasis} strokeWidth={3.5} strokeLinecap="round" />
            <polygon points="10,24 16,34 24,24" fill={COLORS.emphasis} />
          </svg>
        </div>
      )}

      {/* ============= TIME CLAIM ============= */}
      {frame >= PHASE.CLAIM && frame < PHASE.BEHIND + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.CLAIM, PHASE.BEHIND), textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 80, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.time, textDecoration: 'line-through', opacity: 0.5 }}>
              1 WEEK
            </div>
            <svg width="60" height="40" viewBox="0 0 60 40">
              <line x1={0} y1={20} x2={45} y2={20} stroke={COLORS.textMuted} strokeWidth={3} />
              <polygon points="45,12 60,20 45,28" fill={COLORS.textMuted} />
            </svg>
            <div style={{ fontSize: 80, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.possibility }}>
              {'< 1 HR'}
            </div>
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.refine, marginTop: 30 }}>
            That part is true
          </div>
        </div>
      )}

      {/* ============= WHAT'S BEHIND IT ============= */}
      {frame >= PHASE.BEHIND && frame < PHASE.SYSTEM + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.BEHIND, PHASE.SYSTEM), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.4, marginBottom: 30 }}>
            "AI is magic"
          </div>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text }}>
            I built a <span style={{ color: COLORS.emphasis }}>system</span>
          </div>
        </div>
      )}

      {/* ============= SYSTEM COMPONENTS ============= */}
      {frame >= PHASE.SYSTEM && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: spring({ frame: frame - PHASE.SYSTEM, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center',
        }}>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1200 }}>
            {[
              { label: 'Spec', sub: 'Creative thinking', color: COLORS.spec },
              { label: 'Docs', sub: 'Encoded preferences', color: COLORS.build },
              { label: 'Claude', sub: 'Executes within bounds', color: '#D97706' },
              { label: 'Components', sub: 'Pre-built pieces', color: COLORS.refine },
              { label: 'Refinement', sub: 'Human touch', color: COLORS.emphasis },
            ].map((item, i) => {
              const e = spring({ frame: frame - PHASE.SYSTEM - 15 - i * 12, fps, config: SPRING_CONFIGS.snappy });
              return (
                <div key={i} style={{
                  opacity: interpolate(e, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(e, [0, 1], [20, 0])}px)`,
                  padding: '20px 28px', backgroundColor: COLORS.surface,
                  border: `2px solid ${item.color}40`, borderRadius: 12, textAlign: 'center', minWidth: 160,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Corner brackets */}
                  <div style={{ position: 'absolute', top: 6, left: 6, width: 12, height: 12, borderTop: `2px solid ${item.color}`, borderLeft: `2px solid ${item.color}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', top: 6, right: 6, width: 12, height: 12, borderTop: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: 6, left: 6, width: 12, height: 12, borderBottom: `2px solid ${item.color}`, borderLeft: `2px solid ${item.color}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: 6, right: 6, width: 12, height: 12, borderBottom: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}`, opacity: 0.5 }} />

                  <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 6 }}>{item.sub}</div>
                </div>
              );
            })}
          </div>
          <svg width="900" height="20" viewBox="0 0 900 20" style={{ marginTop: 16 }}>
            <line x1={100} y1={10} x2={800 * spring({ frame: frame - PHASE.SYSTEM - 50, fps, config: SPRING_CONFIGS.snappy })} y2={10} stroke={COLORS.emphasis} strokeWidth={2} strokeLinecap="round" opacity={0.3} />
          </svg>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 12 }}>
            All connected. All essential.
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene8A_FullCircle;
