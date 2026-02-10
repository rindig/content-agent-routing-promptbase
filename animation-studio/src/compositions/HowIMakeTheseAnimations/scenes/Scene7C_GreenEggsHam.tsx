/**
 * Scene 7C: Green Eggs and Ham
 * [11:10 - 11:30] — 600 frames
 *
 * Dr. Seuss, $50 bet, only 50 words, flow charts on walls.
 * 200M copies sold. Constraint -> masterpiece.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { SETUP: 0, BET: 150, PROCESS: 300, RESULT: 420, PATTERN: 540 };

export const Scene7C_GreenEggsHam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 110) / 110) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 40, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 20 ? exit : 0);
  };

  const copiesCount = Math.floor(interpolate(frame, [PHASE.RESULT + 30, PHASE.RESULT + 90], [0, 200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Ambient particles
  const particles = Array.from({ length: 8 }).map((_, i) => ({
    x: (i * 250 + frame * (0.3 + i * 0.04)) % 1920,
    y: (i * 160 + Math.sin(frame * 0.02 + i) * 40) % 1080,
    opacity: 0.12 + Math.sin(frame * 0.03 + i * 2) * 0.08,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.emphasis, opacity: p.opacity }} />
      ))}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= SETUP ============= */}
      {frame < PHASE.BET + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.BET), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text }}>
            Dr. Seuss
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.quote.fontFamily, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' }}>
            Green Eggs and Ham
          </div>
          {/* Book shape */}
          <div style={{
            width: 200, height: 260, margin: '30px auto 0', backgroundColor: `${COLORS.possibility}10`,
            border: `3px solid ${COLORS.possibility}40`, borderRadius: '6px 16px 16px 6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.possibility, fontWeight: 600 }}>
              50 words
            </div>
            {/* Scan line on book */}
            <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.possibility}30, transparent)` }} />
          </div>
        </div>
      )}

      {/* ============= THE BET ============= */}
      {frame >= PHASE.BET && frame < PHASE.PROCESS + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.BET, PHASE.PROCESS), textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 80, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 96, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.emphasis }}>
                $50
              </div>
              <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 8 }}>bet from editor</div>
            </div>
            <svg width="60" height="40" viewBox="0 0 60 40">
              <line x1={0} y1={20} x2={45} y2={20} stroke={COLORS.textMuted} strokeWidth={3} />
              <polygon points="45,12 60,20 45,28" fill={COLORS.textMuted} />
            </svg>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 96, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.time }}>
                50
              </div>
              <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 8 }}>words only</div>
            </div>
          </div>
          <div style={{
            fontSize: SIZES.label, fontFamily: TYPOGRAPHY.quote.fontFamily, color: COLORS.textMuted,
            marginTop: 40, fontStyle: 'italic', padding: '12px 32px',
            borderLeft: `3px solid ${COLORS.emphasis}30`,
          }}>
            "You can't write a book with only 50 words"
          </div>
        </div>
      )}

      {/* ============= THE PROCESS ============= */}
      {frame >= PHASE.PROCESS && frame < PHASE.RESULT + 20 && (
        <div style={{ position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.PROCESS, PHASE.RESULT), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 30 }}>
            Flow charts on walls to track vocabulary
          </div>
          {/* Flow chart visualization - bigger */}
          <svg width="700" height="240" viewBox="0 0 700 240">
            {Array.from({ length: 9 }).map((_, i) => {
              const col = i % 3;
              const row = Math.floor(i / 3);
              const x = 80 + col * 220;
              const y = 20 + row * 80;
              const w = 160;
              const nE = spring({ frame: frame - PHASE.PROCESS - 20 - i * 8, fps, config: SPRING_CONFIGS.snappy });
              return (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={45} rx={6} fill={`${COLORS.spec}12`} stroke={`${COLORS.spec}50`} strokeWidth={2} opacity={interpolate(nE, [0, 1], [0, 0.8])} />
                  {row < 2 && (
                    <line x1={x + w / 2} y1={y + 45} x2={x + w / 2} y2={y + 80} stroke={COLORS.spec} strokeWidth={1.5} opacity={interpolate(nE, [0, 1], [0, 0.3])} strokeDasharray="4 4" />
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.textMuted, marginTop: 20 }}>
            Working within extreme constraints
          </div>
        </div>
      )}

      {/* ============= THE RESULT ============= */}
      {frame >= PHASE.RESULT && frame < PHASE.PATTERN + 20 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.RESULT, PHASE.PATTERN), textAlign: 'center' }}>
          <div style={{
            fontSize: 140, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.possibility,
            textShadow: `0 0 40px ${COLORS.possibility}30`,
          }}>
            {copiesCount}M
          </div>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.possibility, marginTop: 8 }}>
            copies sold
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginTop: 24 }}>
            His <span style={{ color: COLORS.emphasis, fontWeight: 700 }}>best-selling</span> work ever
          </div>
        </div>
      )}

      {/* ============= PATTERN ============= */}
      {frame >= PHASE.PATTERN && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.PATTERN, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Constraint <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>enabled</span> the masterpiece
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene7C_GreenEggsHam;
