import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SPINE_DRAW: 0,
  ERA_1_IN: 30,
  ERA_STAGGER: 30,
  ERA_2_IN: 60,
  ERA_3_IN: 90,
  ERA_4_IN: 120,
  ERA_5_IN: 150,
  LIGHT_SWEEP: 180,
  BINARY_FLASH: 240,
  SAME_PATTERN_LABEL: 250,
  HOLD: 270,
};

// ── Era data ──
interface EraData {
  year: string;
  label: string;
  binary: string;
  color: string;
  icon: 'rope' | 'card' | 'tube' | 'transistor' | 'neural';
  startFrame: number;
}

const ERAS: EraData[] = [
  {
    year: '62 CE',
    label: 'Knots on rope',
    binary: '1 0 1',
    color: COLORS.historyGold,
    icon: 'rope',
    startFrame: BEATS.ERA_1_IN,
  },
  {
    year: '1804',
    label: 'Holes in cards',
    binary: '1 0 1',
    color: COLORS.historyGold,
    icon: 'card',
    startFrame: BEATS.ERA_2_IN,
  },
  {
    year: '1940s',
    label: 'Current in tubes',
    binary: '1 0 1',
    color: COLORS.techBlue,
    icon: 'tube',
    startFrame: BEATS.ERA_3_IN,
  },
  {
    year: '1960s',
    label: 'Charge on silicon',
    binary: '1 0 1',
    color: COLORS.techBlue,
    icon: 'transistor',
    startFrame: BEATS.ERA_4_IN,
  },
  {
    year: '2020s',
    label: 'Weights in networks',
    binary: '0.7 0.2 0.9',
    color: COLORS.aiPurple,
    icon: 'neural',
    startFrame: BEATS.ERA_5_IN,
  },
];

// ── Era icon renderers ──
const EraIcon: React.FC<{ type: EraData['icon']; color: string; size?: number }> = ({
  type,
  color,
  size = 50,
}) => {
  switch (type) {
    case 'rope':
      return (
        <svg width={size} height={size * 0.5} viewBox="0 0 60 30">
          <line x1={0} y1={15} x2={60} y2={15} stroke={color} strokeWidth={3} strokeLinecap="round" />
          {[10, 30, 50].map((x, i) => (
            <circle key={i} cx={x} cy={15} r={5} fill={color} />
          ))}
        </svg>
      );
    case 'card':
      return (
        <svg width={size * 0.8} height={size} viewBox="0 0 40 50">
          <rect x={2} y={2} width={36} height={46} rx={2} fill="none" stroke={color} strokeWidth={2} />
          {[12, 25, 38].map((y, i) => (
            <circle key={i} cx={20} cy={y} r={4} fill="none" stroke={color} strokeWidth={1.5} />
          ))}
        </svg>
      );
    case 'tube':
      return (
        <svg width={size * 0.6} height={size} viewBox="0 0 30 50">
          <ellipse cx={15} cy={25} rx={12} ry={22} fill="none" stroke={color} strokeWidth={2} />
          <line x1={15} y1={10} x2={15} y2={40} stroke={color} strokeWidth={1} opacity={0.6} />
          {/* Filament */}
          <path d="M 10 30 Q 15 20 20 30" fill="none" stroke={color} strokeWidth={1.5} />
        </svg>
      );
    case 'transistor':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          {/* Triangle body */}
          <path d="M 15 10 L 15 40 L 40 25 Z" fill="none" stroke={color} strokeWidth={2} />
          {/* Input */}
          <line x1={0} y1={25} x2={15} y2={25} stroke={color} strokeWidth={2} />
          {/* Output */}
          <line x1={40} y1={25} x2={50} y2={25} stroke={color} strokeWidth={2} />
          {/* Base */}
          <line x1={15} y1={10} x2={15} y2={40} stroke={color} strokeWidth={2.5} />
        </svg>
      );
    case 'neural':
      return (
        <svg width={size} height={size} viewBox="0 0 50 50">
          {/* Input lines */}
          <line x1={0} y1={10} x2={20} y2={25} stroke={color} strokeWidth={1.5} opacity={0.6} />
          <line x1={0} y1={25} x2={20} y2={25} stroke={color} strokeWidth={1.5} opacity={0.6} />
          <line x1={0} y1={40} x2={20} y2={25} stroke={color} strokeWidth={1.5} opacity={0.6} />
          {/* Node */}
          <circle cx={25} cy={25} r={8} fill="none" stroke={color} strokeWidth={2} />
          {/* Output */}
          <line x1={33} y1={25} x2={50} y2={25} stroke={color} strokeWidth={2} />
        </svg>
      );
  }
};

// ── Single Era Node ──
const EraNode: React.FC<{
  era: EraData;
  frame: number;
  fps: number;
  index: number;
  isFlashing: boolean;
  lightSweepActive: boolean;
  lightSweepProgress: number;
}> = ({ era, frame, fps, index, isFlashing, lightSweepActive, lightSweepProgress }) => {
  const relFrame = frame - era.startFrame;

  const enterProgress = spring({
    frame: Math.max(0, relFrame),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const nodeScale = interpolate(enterProgress, [0, 1], [0, 1]);
  const nodeOpacity = interpolate(
    relFrame,
    [0, 12],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Light sweep flare: when the sweep passes this node
  const nodePosition = index / (ERAS.length - 1); // 0 to 1
  const sweepDistance = Math.abs(lightSweepProgress - nodePosition);
  const flareScale = lightSweepActive && sweepDistance < 0.15
    ? interpolate(sweepDistance, [0, 0.15], [1.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  // Binary flash: all binaries flash green simultaneously
  const binaryColor = isFlashing ? COLORS.solutionGreen : COLORS.textMuted;

  if (relFrame < 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        opacity: nodeOpacity,
        transform: `scale(${nodeScale * flareScale})`,
        width: '100%',
      }}
    >
      {/* Dot on spine */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: era.color,
          flexShrink: 0,
          boxShadow: flareScale > 1.05
            ? `0 0 20px ${era.color}`
            : 'none',
        }}
      />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {/* Year */}
        <div
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: era.color,
            textTransform: 'none',
            letterSpacing: 1,
          }}
        >
          {era.year}
        </div>

        {/* Icon + Label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <EraIcon type={era.icon} color={era.color} size={40} />
          <div
            style={{
              ...TYPOGRAPHY.body,
              fontSize: 32,
              color: era.color,
            }}
          >
            {era.label}
          </div>
        </div>

        {/* Binary */}
        <div
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 24,
            color: binaryColor,
            marginTop: 2,
          }}
        >
          {era.binary}
        </div>
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene4_BinaryTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Spine draw animation ──
  const spineDrawProgress = interpolate(
    frame,
    [BEATS.SPINE_DRAW, BEATS.SPINE_DRAW + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const spineHeight = 900; // total spine height in pixels
  const spineDrawn = spineHeight * spineDrawProgress;

  // ── Light sweep ──
  const lightSweepActive = frame >= BEATS.LIGHT_SWEEP && frame < BEATS.LIGHT_SWEEP + 60;
  const lightSweepProgress = lightSweepActive
    ? interpolate(
        frame,
        [BEATS.LIGHT_SWEEP, BEATS.LIGHT_SWEEP + 60],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Light sweep dot position
  const lightDotY = lightSweepActive ? lightSweepProgress * spineHeight : -100;

  // ── Binary flash ──
  const isFlashing = frame >= BEATS.BINARY_FLASH && frame < BEATS.BINARY_FLASH + 5;

  // ── "Same pattern" label ──
  const showLabel = frame >= BEATS.SAME_PATTERN_LABEL;
  const labelProgress = spring({
    frame: Math.max(0, frame - BEATS.SAME_PATTERN_LABEL),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [20, 0]);

  // ── Background color transition (warm to dark during eras 3-4) ──
  const bgBlend = interpolate(
    frame,
    [BEATS.ERA_3_IN, BEATS.ERA_4_IN + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Timeline pulse during hold ──
  const holdPulse = frame >= BEATS.HOLD
    ? 0.3 + 0.1 * Math.sin((frame - BEATS.HOLD) * 0.08)
    : 0.5;

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={280}
      fadeOutDuration={20}
    >
      {/* Dark bg overlay for modern era transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.bg,
          opacity: bgBlend * 0.6,
        }}
      />

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          paddingTop: 80,
          paddingBottom: 60,
          paddingLeft: 60,
          paddingRight: 40,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Vertical spine */}
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 80,
            width: 2,
            height: spineDrawn,
            backgroundColor: COLORS.historyGold,
            opacity: holdPulse,
          }}
        />

        {/* Light sweep dot */}
        {lightSweepActive && (
          <div
            style={{
              position: 'absolute',
              left: 61,
              top: 80 + lightDotY,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: 0.8,
              filter: 'blur(8px)',
              zIndex: 5,
            }}
          />
        )}

        {/* Era nodes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: spineHeight,
            marginLeft: 30,
            width: '100%',
          }}
        >
          {ERAS.map((era, i) => (
            <EraNode
              key={i}
              era={era}
              frame={frame}
              fps={fps}
              index={i}
              isFlashing={isFlashing}
              lightSweepActive={lightSweepActive}
              lightSweepProgress={lightSweepProgress}
            />
          ))}
        </div>

        {/* "Same pattern." label */}
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '50%',
              display: 'flex',
              justifyContent: 'center',
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 56,
                color: COLORS.insightOrange,
                textAlign: 'center',
                backgroundColor: `${COLORS.bgWarm}CC`,
                padding: '16px 32px',
                borderRadius: 12,
              }}
            >
              Same pattern.
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
