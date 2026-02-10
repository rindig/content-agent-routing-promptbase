/**
 * Scene 7B: The Inverted U
 * [10:45 - 11:10] — 750 frames
 *
 * Inverted U-shaped relationship: constraints vs creative output.
 * Graph fills the screen. Readable labels.
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

const PHASE = { SETUP: 0, CURVE: 150, LEFT: 360, RIGHT: 480, SWEET: 600 };

export const Scene7B_InvertedU: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const curveProgress = interpolate(frame, [PHASE.CURVE, PHASE.CURVE + 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const leftActive = frame >= PHASE.LEFT && frame < PHASE.RIGHT;
  const rightActive = frame >= PHASE.RIGHT && frame < PHASE.SWEET;
  const sweetActive = frame >= PHASE.SWEET;

  const leftE = spring({ frame: frame - PHASE.LEFT, fps, config: SPRING_CONFIGS.snappy });
  const rightE = spring({ frame: frame - PHASE.RIGHT, fps, config: SPRING_CONFIGS.snappy });
  const sweetE = spring({ frame: frame - PHASE.SWEET, fps, config: SPRING_CONFIGS.snappy });

  // Curve points — full screen
  const curvePoints: string[] = [];
  const totalPts = Math.floor(curveProgress * 80);
  for (let i = 0; i <= totalPts; i++) {
    const t = i / 80;
    const x = 120 + t * 960;
    const y = 520 - Math.sin(t * Math.PI) * 380;
    curvePoints.push(`${x},${y}`);
  }

  const sweetGlow = sweetActive ? Math.sin((frame - PHASE.SWEET) * 0.08) * 6 + 12 : 0;
  const scanY = ((frame % 100) / 100) * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.emphasis}12, transparent)`, pointerEvents: 'none' }} />

      {/* Full-screen graph */}
      <svg width="1920" height="1080" viewBox="0 0 1200 700" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <line x1={120} y1={560} x2={1100} y2={560} stroke={COLORS.textMuted} strokeWidth={2.5} />
        <line x1={120} y1={560} x2={120} y2={60} stroke={COLORS.textMuted} strokeWidth={2.5} />
        <polygon points="1100,555 1110,560 1100,565" fill={COLORS.textMuted} />
        <polygon points="115,60 120,50 125,60" fill={COLORS.textMuted} />

        {frame >= PHASE.SETUP && (
          <>
            <text x={610} y={620} textAnchor="middle" fill={COLORS.textMuted} fontSize="28" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600">CONSTRAINTS</text>
            <text x={55} y={310} textAnchor="middle" fill={COLORS.textMuted} fontSize="24" fontFamily={TYPOGRAPHY.code.fontFamily} fontWeight="600" transform="rotate(-90, 55, 310)">CREATIVE OUTPUT</text>
            <text x={180} y={595} textAnchor="middle" fill={COLORS.textMuted} fontSize="22" fontFamily={TYPOGRAPHY.code.fontFamily}>few</text>
            <text x={1040} y={595} textAnchor="middle" fill={COLORS.textMuted} fontSize="22" fontFamily={TYPOGRAPHY.code.fontFamily}>many</text>
          </>
        )}

        {curvePoints.length > 1 && (
          <polyline points={curvePoints.join(' ')} fill="none" stroke={COLORS.emphasis} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {leftActive && (
          <>
            <rect x={120} y={140} width={280} height={420} fill={`${COLORS.time}06`} rx={12} opacity={interpolate(leftE, [0, 1], [0, 1])} />
            <text x={260} y={500} textAnchor="middle" fill={COLORS.time} fontSize="30" fontFamily={TYPOGRAPHY.display.fontFamily} fontWeight="600" opacity={interpolate(leftE, [0, 1], [0, 0.9])}>PARALYSIS</text>
            <text x={260} y={535} textAnchor="middle" fill={COLORS.time} fontSize="22" fontFamily={TYPOGRAPHY.body.fontFamily} opacity={interpolate(leftE, [0, 1], [0, 0.6])}>blank canvas problem</text>
          </>
        )}

        {rightActive && (
          <>
            <rect x={800} y={140} width={280} height={420} fill={`${COLORS.time}06`} rx={12} opacity={interpolate(rightE, [0, 1], [0, 1])} />
            <text x={940} y={500} textAnchor="middle" fill={COLORS.time} fontSize="30" fontFamily={TYPOGRAPHY.display.fontFamily} fontWeight="600" opacity={interpolate(rightE, [0, 1], [0, 0.9])}>STIFLED</text>
            <text x={940} y={535} textAnchor="middle" fill={COLORS.time} fontSize="22" fontFamily={TYPOGRAPHY.body.fontFamily} opacity={interpolate(rightE, [0, 1], [0, 0.6])}>no room to create</text>
          </>
        )}

        {sweetActive && (
          <>
            <circle cx={600} cy={140} r={40 + sweetGlow} fill="none" stroke={`${COLORS.possibility}20`} strokeWidth={2} />
            <circle cx={600} cy={140} r={30} fill={`${COLORS.possibility}15`} stroke={COLORS.possibility} strokeWidth={3} opacity={interpolate(sweetE, [0, 1], [0, 1])} />
            <circle cx={600} cy={140} r={8} fill={COLORS.possibility} opacity={interpolate(sweetE, [0, 1], [0, 0.8])} />
          </>
        )}
      </svg>

      {/* Sweet spot label */}
      {sweetActive && (
        <div style={{ position: 'absolute', top: 50, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: interpolate(sweetE, [0, 1], [0, 1]) }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility, textShadow: `0 0 ${sweetGlow}px ${COLORS.possibility}40` }}>
            Sweet Spot
          </div>
        </div>
      )}

      {/* Bottom labels */}
      {leftActive && (
        <div style={{ position: 'absolute', bottom: 80, left: 120, opacity: interpolate(leftE, [0, 1], [0, 1]) }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.time }}>Too few constraints</div>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 8 }}>Everything is possible, nothing gets done</div>
        </div>
      )}

      {rightActive && (
        <div style={{ position: 'absolute', bottom: 80, right: 120, opacity: interpolate(rightE, [0, 1], [0, 1]), textAlign: 'right' }}>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.time }}>Too many constraints</div>
          <div style={{ fontSize: SIZES.label, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textMuted, marginTop: 8 }}>No room left to create</div>
        </div>
      )}

      {sweetActive && (
        <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', opacity: interpolate(sweetE, [0, 1], [0, 1]), textAlign: 'center' }}>
          <div style={{ fontSize: SIZES.body, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.possibility }}>Right boundaries</div>
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text, marginTop: 8 }}>Creativity <span style={{ color: COLORS.possibility, fontWeight: 600 }}>increases</span></div>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene7B_InvertedU;
