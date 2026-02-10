/**
 * Scene 4G: Separation of Concerns
 * [7:00 - 7:15] — 450 frames
 *
 * "This is just separation of concerns."
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

const PHASE = {
  PRINCIPLE: 0,
  THREE_PILLARS: 90,
  FAMILIAR: 240,
  BREAKDOWN: 330,
};

export const Scene4G_SeparationConcerns: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Principle badge
  const principleEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const principleFade = interpolate(frame, [PHASE.THREE_PILLARS - 20, PHASE.THREE_PILLARS], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pillars
  const pillars = [
    { label: 'SPEC', sub: 'What to build', color: COLORS.spec },
    { label: 'COMPONENTS', sub: 'Reusable pieces', color: COLORS.build },
    { label: 'STYLE GUIDE', sub: 'Encoded decisions', color: COLORS.refine },
  ];

  // Familiar bridge
  const familiarEntrance = spring({ frame: frame - PHASE.FAMILIAR, fps, config: SPRING_CONFIGS.gentle });
  const familiarOpacity = frame >= PHASE.FAMILIAR ? interpolate(familiarEntrance, [0, 1], [0, 1]) : 0;

  // Breakdown
  const breakdownEntrance = spring({ frame: frame - PHASE.BREAKDOWN, fps, config: SPRING_CONFIGS.gentle });
  const breakdownOpacity = frame >= PHASE.BREAKDOWN ? interpolate(breakdownEntrance, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Principle badge */}
      <div style={{
        position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)',
        opacity: interpolate(principleEntrance, [0, 1], [0, 1]) * principleFade,
      }}>
        <div style={{
          padding: '16px 40px', backgroundColor: COLORS.surface, border: `2px solid ${COLORS.emphasis}`,
          borderRadius: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.emphasis, letterSpacing: '0.06em' }}>
            Separation of Concerns
          </div>
        </div>
      </div>

      {/* Three pillars */}
      {frame >= PHASE.THREE_PILLARS && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 40 }}>
          {pillars.map((pillar, i) => {
            const pillarEntrance = spring({ frame: frame - PHASE.THREE_PILLARS - i * 20, fps, config: SPRING_CONFIGS.snappy });
            const opacity = interpolate(pillarEntrance, [0, 1], [0, 1]);
            const y = interpolate(pillarEntrance, [0, 1], [30, 0]);
            return (
              <div key={i} style={{ opacity, transform: `translateY(${y}px)`, textAlign: 'center' }}>
                <div style={{
                  width: 200, height: 160, backgroundColor: COLORS.surface, border: `2px solid ${pillar.color}`,
                  borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Corner brackets */}
                  <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${pillar.color}`, borderLeft: `2px solid ${pillar.color}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${pillar.color}`, borderRight: `2px solid ${pillar.color}`, opacity: 0.5 }} />

                  <span style={{ fontSize: 22, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: pillar.color }}>{pillar.label}</span>
                  <span style={{ fontSize: 16, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>{pillar.sub}</span>

                  {/* Scan line */}
                  <div style={{ position: 'absolute', top: `${((frame + i * 40) % 120) / 120 * 100}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${pillar.color}20, transparent)` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connection arrows between pillars */}
      {frame >= PHASE.THREE_PILLARS + 80 && (
        <svg style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }} width="700" height="200" viewBox="0 0 700 200">
          <line x1="200" y1="80" x2="260" y2="80" stroke={COLORS.textDim} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.3} />
          <line x1="440" y1="80" x2="500" y2="80" stroke={COLORS.textDim} strokeWidth="1.5" strokeDasharray="4 3" opacity={0.3} />
        </svg>
      )}

      {/* Familiar bridge */}
      {frame >= PHASE.FAMILIAR && (
        <div style={{ position: 'absolute', top: '68%', left: '50%', transform: 'translate(-50%, -50%)', opacity: familiarOpacity, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            Break complex things into <span style={{ color: COLORS.text, fontWeight: 600 }}>smaller pieces</span>
          </div>
          <div style={{ fontSize: 18, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim, marginTop: 8 }}>
            understood and changed independently
          </div>
        </div>
      )}

      {/* Complex → chunks breakdown */}
      {frame >= PHASE.BREAKDOWN && (
        <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', opacity: breakdownOpacity }}>
          <svg width="500" height="60" viewBox="0 0 500 60">
            {/* Big blob */}
            <ellipse cx="60" cy="30" rx="50" ry="25" fill={`${COLORS.textDim}30`} stroke={COLORS.textDim} strokeWidth="1.5" />
            <text x="60" y="35" textAnchor="middle" fill={COLORS.textDim} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>complex</text>
            {/* Arrow */}
            <line x1="120" y1="30" x2="180" y2="30" stroke={COLORS.textDim} strokeWidth="1.5" opacity={0.5} />
            <polygon points="175,25 185,30 175,35" fill={COLORS.textDim} opacity={0.5} />
            {/* Chunks */}
            {[0, 1, 2, 3].map(i => {
              const cx = 220 + i * 70;
              const colors = [COLORS.spec, COLORS.build, COLORS.refine, COLORS.emphasis];
              return (
                <g key={i}>
                  <rect x={cx - 25} y={10} width={50} height={40} rx={6} fill={COLORS.surface} stroke={colors[i]} strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4G_SeparationConcerns;
