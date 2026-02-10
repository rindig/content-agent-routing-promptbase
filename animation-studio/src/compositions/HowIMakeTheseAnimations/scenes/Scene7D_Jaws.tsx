/**
 * Scene 7D: Jaws Example
 * [11:30 - 11:45] — 450 frames
 *
 * Spielberg's mechanical shark didn't work -> floating barrels, POV shots.
 * Shark at 81 minutes. Constraint made it better.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { SETUP: 0, PROBLEM: 120, SOLUTION: 240, INSIGHT: 360 };

export const Scene7D_Jaws: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = ((frame % 100) / 100) * 100;

  const phaseOpacity = (start: number, next: number) => {
    const e = spring({ frame: frame - start, fps, config: SPRING_CONFIGS.gentle });
    const enter = frame >= start ? interpolate(e, [0, 1], [0, 1]) : 0;
    const exit = interpolate(frame, [next - 30, next], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return enter * (frame < next + 15 ? exit : 0);
  };

  const minuteCount = Math.floor(interpolate(frame, [PHASE.SOLUTION + 60, PHASE.SOLUTION + 100], [0, 81], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  // Water wave
  const waveY = (x: number) => Math.sin((x * 0.015) + frame * 0.04) * 8;
  const barrelBob1 = Math.sin(frame * 0.06) * 6;
  const barrelBob2 = Math.sin(frame * 0.06 + 1.5) * 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}15, transparent)`, pointerEvents: 'none' }} />

      {/* ============= SETUP ============= */}
      {frame < PHASE.PROBLEM + 15 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(0, PHASE.PROBLEM), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text }}>
            Spielberg
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 12, fontStyle: 'italic' }}>
            Jaws, 1975
          </div>
          {/* Film strip */}
          <svg width="500" height="80" viewBox="0 0 500 80" style={{ marginTop: 24 }}>
            <rect x={20} y={10} width={460} height={60} rx={6} fill={COLORS.surface} stroke={COLORS.textMuted} strokeWidth={2} />
            {Array.from({ length: 9 }).map((_, i) => (
              <rect key={i} x={36 + i * 50} y={18} width={34} height={44} rx={3} fill={`${COLORS.build}12`} stroke={`${COLORS.build}30`} strokeWidth={1.5} />
            ))}
          </svg>
        </div>
      )}

      {/* ============= THE PROBLEM ============= */}
      {frame >= PHASE.PROBLEM && frame < PHASE.SOLUTION + 15 && (
        <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.PROBLEM, PHASE.SOLUTION), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.time, marginBottom: 30 }}>
            Mechanical shark didn't work
          </div>
          {/* Big X over shark silhouette */}
          <svg width="300" height="160" viewBox="0 0 300 160">
            <path d="M50,80 Q120,30 180,80 Q220,100 250,80" fill="none" stroke={COLORS.textMuted} strokeWidth={3} strokeDasharray="8 6" />
            <line x1={60} y1={30} x2={240} y2={130} stroke={COLORS.time} strokeWidth={5} strokeLinecap="round" />
            <line x1={240} y1={30} x2={60} y2={130} stroke={COLORS.time} strokeWidth={5} strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 16 }}>
            Technical failure on set
          </div>
        </div>
      )}

      {/* ============= THE SOLUTION ============= */}
      {frame >= PHASE.SOLUTION && frame < PHASE.INSIGHT + 15 && (
        <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', opacity: phaseOpacity(PHASE.SOLUTION, PHASE.INSIGHT), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text, marginBottom: 30 }}>
            So instead:
          </div>
          <div style={{ display: 'flex', gap: 80, justifyContent: 'center', marginBottom: 30 }}>
            {/* Floating barrels */}
            <div style={{ textAlign: 'center' }}>
              <svg width="220" height="120" viewBox="0 0 220 120">
                {/* Water */}
                <path d={`M0,70 ${Array.from({ length: 23 }).map((_, i) => `Q${i * 10 + 5},${70 + waveY(i * 10)} ${(i + 1) * 10},70`).join(' ')}`} fill="none" stroke={COLORS.build} strokeWidth={2} opacity={0.4} />
                {/* Barrels */}
                <ellipse cx={70} cy={52 + barrelBob1} rx={20} ry={12} fill={`${COLORS.emphasis}30`} stroke={COLORS.emphasis} strokeWidth={2.5} />
                <ellipse cx={150} cy={55 + barrelBob2} rx={20} ry={12} fill={`${COLORS.emphasis}30`} stroke={COLORS.emphasis} strokeWidth={2.5} />
              </svg>
              <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.emphasis, marginTop: 8 }}>Floating barrels</div>
            </div>
            {/* POV shots */}
            <div style={{ textAlign: 'center' }}>
              <svg width="220" height="120" viewBox="0 0 220 120">
                <rect x={25} y={10} width={170} height={100} rx={6} fill={COLORS.surface} stroke={COLORS.build} strokeWidth={2.5} />
                <line x1={110} y1={60} x2={30} y2={15} stroke={COLORS.build} strokeWidth={1.5} opacity={0.5} />
                <line x1={110} y1={60} x2={190} y2={15} stroke={COLORS.build} strokeWidth={1.5} opacity={0.5} />
                <line x1={110} y1={60} x2={30} y2={105} stroke={COLORS.build} strokeWidth={1.5} opacity={0.3} />
                <line x1={110} y1={60} x2={190} y2={105} stroke={COLORS.build} strokeWidth={1.5} opacity={0.3} />
                <circle cx={110} cy={60} r={6} fill={COLORS.build} opacity={0.7} />
              </svg>
              <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.build, marginTop: 8 }}>POV shots</div>
            </div>
          </div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted }}>
            Shark appears at{' '}
            <span style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.emphasis }}>{minuteCount}</span>
            {' '}minutes
          </div>
        </div>
      )}

      {/* ============= THE INSIGHT ============= */}
      {frame >= PHASE.INSIGHT && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: spring({ frame: frame - PHASE.INSIGHT, fps, config: SPRING_CONFIGS.gentle }), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text }}>
            The constraint made it{' '}
            <span style={{
              color: COLORS.possibility, fontWeight: 700,
              textShadow: `0 0 ${Math.sin((frame - PHASE.INSIGHT) * 0.06) * 6 + 10}px ${COLORS.possibility}40`,
            }}>
              better
            </span>
          </div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene7D_Jaws;
