/**
 * Scene 6C: Canva Example
 * [9:45 - 10:10] — 750 frames
 *
 * Canva did something similar for design. Melanie Perkins rejected 100+ times.
 * Now 200M monthly users. Design democratization story.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { INTRO: 0, REJECTION: 180, SUCCESS: 360, PATTERN: 540 };

export const Scene6C_Canva: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 120) / 120) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 45, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 30 ? exit : 0);
  };

  // Counters
  const rejectionCount = Math.floor(interpolate(frame, [PHASE.REJECTION + 30, PHASE.REJECTION + 120], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const userCount = Math.floor(interpolate(frame, [PHASE.SUCCESS + 30, PHASE.SUCCESS + 120], [0, 200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Ambient particles
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    x: (i * 170 + frame * (0.3 + i * 0.05)) % 1920,
    y: (i * 130 + Math.sin(frame * 0.02 + i) * 40) % 1080,
    opacity: 0.15 + Math.sin(frame * 0.03 + i * 2) * 0.1,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Ambient particles */}
      {particles.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 3, height: 3, borderRadius: '50%', backgroundColor: COLORS.emphasis, opacity: p.opacity }} />
      ))}

      {/* Scan line */}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}20, transparent)`, pointerEvents: 'none' }} />

      {/* ============= INTRO ============= */}
      {frame < PHASE.REJECTION + 30 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.REJECTION), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text, letterSpacing: '0.04em' }}>
            Canva
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 16 }}>
            Did the same for <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>visual design</span>
          </div>
          <svg width="700" height="120" viewBox="0 0 700 120" style={{ marginTop: 30 }}>
            {[
              { x: 80, w: 100, h: 70, color: COLORS.spec },
              { x: 230, w: 120, h: 80, color: COLORS.build },
              { x: 400, w: 90, h: 90, color: COLORS.emphasis },
              { x: 540, w: 110, h: 60, color: COLORS.refine },
            ].map((rect, i) => {
              const bob = Math.sin((frame + i * 30) * 0.04) * 6;
              const e = spring({ frame: frame - 30 - i * 15, fps, config: SPRING_CONFIGS.snappy });
              return (
                <rect key={i} x={rect.x} y={20 + bob} width={rect.w} height={rect.h} rx={8}
                  fill={`${rect.color}15`} stroke={rect.color} strokeWidth={2}
                  opacity={interpolate(e, [0, 1], [0, 0.7])} />
              );
            })}
          </svg>
        </div>
      )}

      {/* ============= REJECTION ARC ============= */}
      {frame >= PHASE.REJECTION && frame < PHASE.SUCCESS + 30 && (
        <div style={{ position: 'absolute', inset: 0, opacity: phaseOpacity(PHASE.REJECTION, PHASE.SUCCESS) }}>
          {/* Name */}
          <div style={{ position: 'absolute', top: 160, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>
              Melanie Perkins
            </div>
          </div>

          {/* Big counter */}
          <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontSize: 120, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.time }}>
              {rejectionCount}+
            </div>
            <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.time, marginTop: 8, letterSpacing: '0.06em' }}>
              INVESTOR REJECTIONS
            </div>
          </div>

          {/* Scattered X marks */}
          <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const xE = spring({ frame: frame - PHASE.REJECTION - 40 - i * 5, fps, config: SPRING_CONFIGS.snappy });
              const positions = [
                [200, 300], [400, 200], [600, 350], [1300, 250],
                [1500, 350], [1700, 200], [300, 700], [500, 800],
                [1400, 750], [1600, 680], [250, 500], [1650, 500],
                [700, 150], [1200, 150], [800, 850], [1100, 850],
              ];
              return (
                <text key={i} x={positions[i][0]} y={positions[i][1]} fontSize="36" fill={COLORS.time}
                  opacity={interpolate(xE, [0, 1], [0, 0.12])} textAnchor="middle" fontFamily={TYPOGRAPHY.code.fontFamily}>
                  X
                </text>
              );
            })}
          </svg>

          {/* Skeptic quote */}
          <div style={{ position: 'absolute', bottom: 180, left: '50%', transform: 'translateX(-50%)' }}>
            <div style={{
              fontSize: SIZES.label, fontFamily: TYPOGRAPHY.quote.fontFamily, color: COLORS.textMuted,
              fontStyle: 'italic', padding: '16px 40px',
              borderLeft: `3px solid ${COLORS.time}30`,
            }}>
              "Non-designers is not a real market"
            </div>
          </div>
        </div>
      )}

      {/* ============= SUCCESS ============= */}
      {frame >= PHASE.SUCCESS && frame < PHASE.PATTERN + 30 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.SUCCESS, PHASE.PATTERN), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginBottom: 16 }}>Now:</div>
          <div style={{ fontSize: 140, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.possibility,
            textShadow: `0 0 40px ${COLORS.possibility}30`,
          }}>
            {userCount}M
          </div>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.possibility, marginTop: 8, letterSpacing: '0.04em' }}>
            monthly users
          </div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 40, alignItems: 'center' }}>
            <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.time, textDecoration: 'line-through', opacity: 0.5 }}>
              100+ rejections
            </span>
            <svg width="40" height="20" viewBox="0 0 40 20">
              <line x1={0} y1={10} x2={30} y2={10} stroke={COLORS.textMuted} strokeWidth={2} />
              <polygon points="30,5 40,10 30,15" fill={COLORS.textMuted} />
            </svg>
            <span style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.possibility, fontWeight: 600 }}>
              200M users
            </span>
          </div>
        </div>
      )}

      {/* ============= PATTERN ============= */}
      {frame >= PHASE.PATTERN && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          opacity: spring({ frame: frame - PHASE.PATTERN, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center',
        }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Same story: tools for <span style={{ color: COLORS.emphasis, fontWeight: 600 }}>everyone</span>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene6C_Canva;
