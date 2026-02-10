/**
 * Scene 4A: Spec → Animation Transition
 * [4:15 - 4:35] — 600 frames
 *
 * "Once you have a spec, the building phase is where it becomes animation."
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
  SECTION_HEADER: 0,
  TRANSFORM_BEGIN: 60,
  ENERGY_FLOW: 180,
  WHAT_HAPPENS: 420,
};

export const Scene4A_SpecToAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section header
  const headerEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const headerOpacity = interpolate(headerEntrance, [0, 1], [0, 1]);
  const headerX = interpolate(headerEntrance, [0, 1], [-60, 0]);

  // Header exit
  const headerFade = interpolate(frame, [PHASE.TRANSFORM_BEGIN, PHASE.TRANSFORM_BEGIN + 60], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Badge
  const badgeEntrance = spring({ frame: frame - 20, fps, config: SPRING_CONFIGS.snappy });

  // Transformation
  const transformEntrance = spring({ frame: frame - PHASE.ENERGY_FLOW, fps, config: SPRING_CONFIGS.gentle });
  const transformOpacity = frame >= PHASE.ENERGY_FLOW ? interpolate(transformEntrance, [0, 1], [0, 1]) : 0;

  // Energy particles flowing from spec to animation
  const particleCount = 10;

  // "What actually happens" text
  const whatEntrance = spring({ frame: frame - PHASE.WHAT_HAPPENS, fps, config: SPRING_CONFIGS.gentle });
  const whatOpacity = frame >= PHASE.WHAT_HAPPENS ? interpolate(whatEntrance, [0, 1], [0, 1]) : 0;
  const whatScale = frame >= PHASE.WHAT_HAPPENS ? interpolate(whatEntrance, [0, 1], [0.95, 1]) : 0.95;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Section header: STAGE TWO: BUILDING */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 120,
          opacity: headerOpacity * headerFade,
          transform: `translateX(${headerX}px)`,
        }}
      >
        <div style={{ fontSize: SIZES.title, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text, letterSpacing: '0.05em' }}>
          STAGE TWO: <span style={{ color: COLORS.build }}>BUILDING</span>
        </div>
        <svg width="240" height="4" style={{ marginTop: 8 }}>
          <line x1={0} y1={2} x2={240 * spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy })} y2={2} stroke={COLORS.build} strokeWidth={3} strokeLinecap="round" />
        </svg>
      </div>

      {/* "02" badge */}
      <div style={{ position: 'absolute', top: 60, right: 80, opacity: interpolate(badgeEntrance, [0, 1], [0, 0.6]) }}>
        <span style={{ fontSize: 48, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.build, opacity: 0.4 }}>02</span>
      </div>

      {/* Spec → Animation transformation */}
      {frame >= PHASE.ENERGY_FLOW && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: transformOpacity }}>
          <svg width="800" height="300" viewBox="0 0 800 300">
            {/* Spec document */}
            <g transform="translate(80, 70)">
              <rect width="140" height="180" rx="10" fill={COLORS.surface} stroke={COLORS.spec} strokeWidth="2" />
              {[30, 50, 70, 90, 110, 130].map((y, i) => (
                <line key={i} x1="20" y1={y} x2={80 + (i % 3) * 15} y2={y} stroke={COLORS.spec} strokeWidth="2" opacity={0.3 + i * 0.05} />
              ))}
              <text x="70" y="170" textAnchor="middle" fill={COLORS.spec} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>SPEC</text>
            </g>

            {/* Arrow flow */}
            <path d="M 240 160 Q 400 160 560 160" stroke={COLORS.textDim} strokeWidth="2" strokeDasharray="8 4" fill="none" opacity={0.4} />
            <polygon points="555,153 565,160 555,167" fill={COLORS.textDim} opacity={0.4} />

            {/* Flowing energy particles */}
            {Array.from({ length: particleCount }).map((_, i) => {
              const progress = ((frame - PHASE.ENERGY_FLOW + i * 12) % 100) / 100;
              const px = 240 + progress * 320;
              const py = 160 + Math.sin(progress * Math.PI * 3 + i) * 20;
              const pOpacity = Math.sin(progress * Math.PI) * 0.8;
              return (
                <circle key={i} cx={px} cy={py} r={4} fill={i % 2 === 0 ? COLORS.spec : COLORS.build} opacity={pOpacity} />
              );
            })}

            {/* Animation frame */}
            <g transform="translate(580, 70)">
              <rect width="140" height="180" rx="10" fill={COLORS.surface} stroke={COLORS.build} strokeWidth="2" />
              {/* Mini animation content */}
              <rect x="20" y="30" width="100" height="60" rx="4" fill={`${COLORS.build}15`} stroke={COLORS.build} strokeWidth="1" opacity={0.5} />
              <rect x="30" y="110" width="80" height="8" rx="2" fill={COLORS.build} opacity={0.3} />
              <rect x="30" y="126" width="60" height="8" rx="2" fill={COLORS.build} opacity={0.2} />
              <text x="70" y="170" textAnchor="middle" fill={COLORS.build} fontSize="14" fontFamily={TYPOGRAPHY.code.fontFamily}>ANIMATION</text>
            </g>
          </svg>
        </div>
      )}

      {/* "Here's what actually happens" */}
      {frame >= PHASE.WHAT_HAPPENS && (
        <div
          style={{
            position: 'absolute',
            bottom: 140,
            left: '50%',
            transform: `translateX(-50%) scale(${whatScale})`,
            opacity: whatOpacity,
          }}
        >
          <div style={{ fontSize: SIZES.subtext, fontFamily: TYPOGRAPHY.display.fontFamily, color: COLORS.text }}>
            Here's what <span style={{ color: COLORS.build, fontWeight: 600 }}>actually</span> happens
          </div>
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene4A_SpecToAnimation;
