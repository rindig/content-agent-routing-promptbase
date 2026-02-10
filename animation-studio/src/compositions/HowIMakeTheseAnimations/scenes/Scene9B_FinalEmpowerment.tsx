/**
 * Scene 9B: Final Empowerment
 * [12:50 - 13:15] — 750 frames
 *
 * "The process can be learned." "Everything is documented."
 * "Ideas stuck in your head -> maybe now you can."
 * Final empowerment. The biggest moment. Hold for impact.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { LEARNABLE: 0, RESOURCES: 150, IDEAS: 300, FINAL: 540 };

export const Scene9B_FinalEmpowerment: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 120) / 120) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 40, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  // Ideas escaping animation — bigger, more dramatic
  const ideaParticles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const progress = frame >= PHASE.IDEAS + 60 ? interpolate(
      spring({ frame: frame - PHASE.IDEAS - 60 - i * 6, fps, config: SPRING_CONFIGS.gentle }),
      [0, 1], [0, 1]
    ) : 0;
    const radius = progress * 250;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      opacity: progress * 0.5,
      scale: 0.6 + progress * 0.4,
    };
  });

  // Final glow
  const finalGlow = frame >= PHASE.FINAL ? Math.sin((frame - PHASE.FINAL) * 0.04) * 8 + 16 : 0;

  // End fade
  const endFade = interpolate(frame, [700, 750], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Ambient particles
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    x: (i * 170 + frame * (0.15 + i * 0.03)) % 1920,
    y: (i * 120 + Math.sin(frame * 0.02 + i) * 50) % 1080,
    opacity: 0.1 + Math.sin(frame * 0.03 + i) * 0.06,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.possibility, opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.possibility}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= LEARNABLE ============= */}
      {frame < PHASE.RESOURCES + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.RESOURCES), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            The process can be <span style={{ color: COLORS.possibility, fontWeight: 700 }}>learned</span>
          </div>
          {/* Learning curve */}
          <svg width="400" height="120" viewBox="0 0 400 120" style={{ marginTop: 24 }}>
            <path d="M20,100 Q80,95 140,70 T280,25 T380,15" fill="none" stroke={COLORS.possibility} strokeWidth={3.5} strokeLinecap="round" />
            <circle cx={380} cy={15} r={6} fill={COLORS.possibility} />
            {/* Pulse on endpoint */}
            <circle cx={380} cy={15} r={6 + Math.sin(frame * 0.08) * 4} fill="none" stroke={COLORS.possibility} strokeWidth={1.5} opacity={0.3} />
          </svg>
        </div>
      )}

      {/* ============= RESOURCES ============= */}
      {frame >= PHASE.RESOURCES && frame < PHASE.IDEAS + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.RESOURCES, PHASE.IDEAS), textAlign: 'center' }}>
          {[
            { text: 'Everything is documented', color: COLORS.build },
            { text: 'The tools are there', color: COLORS.refine },
          ].map((item, i) => {
            const e = spring({ frame: frame - PHASE.RESOURCES - 15 - i * 25, fps, config: SPRING_CONFIGS.snappy });
            return (
              <div key={i} style={{
                opacity: interpolate(e, [0, 1], [0, 1]),
                fontSize: SIZES.body, fontFamily: TYPOGRAPHY.body.fontFamily, color: item.color,
                marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx={16} cy={16} r={14} fill={`${item.color}15`} stroke={item.color} strokeWidth={2} />
                  <polyline points="10,16 14,20 22,12" fill="none" stroke={item.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item.text}
              </div>
            );
          })}
        </div>
      )}

      {/* ============= IDEAS ============= */}
      {frame >= PHASE.IDEAS && frame < PHASE.FINAL + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.IDEAS, PHASE.FINAL), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 30 }}>
            Ideas stuck in your head
          </div>
          {/* Brain with escaping ideas — much larger */}
          <div style={{ position: 'relative', display: 'inline-block', width: 200, height: 200 }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* Brain shape */}
              <ellipse cx={85} cy={90} rx={45} ry={50} fill={`${COLORS.emphasis}10`} stroke={COLORS.emphasis} strokeWidth={2.5} />
              <ellipse cx={115} cy={90} rx={45} ry={50} fill={`${COLORS.emphasis}08`} stroke={COLORS.emphasis} strokeWidth={2.5} />
              {/* Neural paths */}
              <path d="M80,70 Q95,55 110,70 Q115,85 100,95 Q90,100 95,115" fill="none" stroke={COLORS.emphasis} strokeWidth={1.5} opacity={0.3} />
              <path d="M90,65 Q100,80 115,75" fill="none" stroke={COLORS.emphasis} strokeWidth={1.5} opacity={0.2} />
            </svg>
            {/* Escaping idea particles */}
            {ideaParticles.map((p, i) => (
              <div key={i} style={{
                position: 'absolute', top: `calc(50% + ${p.y}px)`, left: `calc(50% + ${p.x}px)`,
                transform: `translate(-50%, -50%) scale(${p.scale})`, opacity: p.opacity,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle cx={12} cy={8} r={6} fill={COLORS.emphasis} opacity={0.8} />
                  <path d="M9,14 L8,22 M15,14 L16,22 M12,15 L12,24" stroke={COLORS.emphasis} strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </div>
            ))}
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 30 }}>
            because you couldn't make them <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>visible</span>
          </div>
        </div>
      )}

      {/* ============= FINAL ============= */}
      {frame >= PHASE.FINAL && (
        <div style={{
          position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: spring({ frame: frame - PHASE.FINAL, fps, config: SPRING_CONFIGS.gentle }) * endFade,
          textAlign: 'center',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 1000, height: 400, borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.possibility}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            fontSize: 96, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700,
            color: COLORS.textBright, letterSpacing: '0.02em',
            textShadow: `0 0 ${finalGlow}px ${COLORS.possibility}50, 0 0 ${finalGlow * 2}px ${COLORS.possibility}20`,
            position: 'relative',
          }}>
            Maybe now you can.
          </div>
          <svg width="600" height="6" style={{ marginTop: 30, position: 'relative' }}>
            <line x1={0} y1={3}
              x2={600 * spring({ frame: frame - PHASE.FINAL - 30, fps, config: SPRING_CONFIGS.slow })}
              y2={3} stroke={COLORS.possibility} strokeWidth={3} strokeLinecap="round" opacity={0.4} />
          </svg>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene9B_FinalEmpowerment;
