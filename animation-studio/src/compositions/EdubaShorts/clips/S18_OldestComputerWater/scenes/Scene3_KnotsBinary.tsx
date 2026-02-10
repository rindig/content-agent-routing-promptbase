import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  ROPE_IN: 0,
  KNOTS_START: 30,
  KNOT_STAGGER: 3,
  BINARY_LABELS_START: 70,
  BINARY_STAGGER: 3,
  SHIFT_UP: 110,
  EQUALS_SIGN: 120,
  TRANSISTOR_IN: 130,
  COMPARISON_LABEL: 150,
  HOLD: 200,
};

// ── Knot pattern: 1=knot, 0=no-knot ──
const KNOT_PATTERN = [1, 0, 1, 1, 0, 1, 0, 1] as const;

// ── Rope with Knots ──
const RopeVisualization: React.FC<{
  frame: number;
  fps: number;
  compact?: boolean;
}> = ({ frame, fps, compact = false }) => {
  const ropeProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const ropeOpacity = interpolate(ropeProgress, [0, 1], [0, 1]);
  const ropeScale = interpolate(ropeProgress, [0, 1], [0.8, 1]);

  const ropeWidth = compact ? 600 : 800;
  const spacing = ropeWidth / (KNOT_PATTERN.length + 1);

  return (
    <div
      style={{
        opacity: ropeOpacity,
        transform: `scale(${ropeScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', width: ropeWidth, height: compact ? 60 : 100 }}>
        {/* Rope SVG - wavy line */}
        <svg
          width={ropeWidth}
          height={compact ? 60 : 100}
          viewBox={`0 0 ${ropeWidth} ${compact ? 60 : 100}`}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d={compact
              ? `M 0 30 Q ${ropeWidth * 0.25} 25 ${ropeWidth * 0.5} 30 Q ${ropeWidth * 0.75} 35 ${ropeWidth} 30`
              : `M 0 50 Q ${ropeWidth * 0.25} 44 ${ropeWidth * 0.5} 50 Q ${ropeWidth * 0.75} 56 ${ropeWidth} 50`}
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={compact ? 4 : 6}
            strokeLinecap="round"
          />
        </svg>

        {/* Tick marks and knots */}
        {KNOT_PATTERN.map((isKnot, i) => {
          const x = spacing * (i + 1);
          const knotDelay = BEATS.KNOTS_START + i * BEATS.KNOT_STAGGER;
          const knotProgress = spring({
            frame: Math.max(0, frame - knotDelay),
            fps,
            config: SPRING_CONFIGS.bouncy,
          });
          const knotScale = interpolate(knotProgress, [0, 1], [0, 1]);
          const knotOpacity = interpolate(
            frame,
            [knotDelay, knotDelay + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const yCenter = compact ? 30 : 50;

          return (
            <React.Fragment key={i}>
              {/* Tick mark */}
              <div
                style={{
                  position: 'absolute',
                  left: x - 0.5,
                  top: yCenter - 12,
                  width: 1,
                  height: 24,
                  backgroundColor: COLORS.textMuted,
                  opacity: 0.3,
                }}
              />
              {/* Knot or X */}
              <div
                style={{
                  position: 'absolute',
                  left: x - (compact ? 5 : 6),
                  top: yCenter - (compact ? 5 : 6),
                  opacity: knotOpacity,
                  transform: `scale(${knotScale})`,
                }}
              >
                {isKnot ? (
                  <div
                    style={{
                      width: compact ? 10 : 12,
                      height: compact ? 10 : 12,
                      borderRadius: '50%',
                      backgroundColor: COLORS.historyGold,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      ...TYPOGRAPHY.code,
                      fontSize: compact ? 14 : 18,
                      color: COLORS.textMuted,
                      opacity: 0.4,
                      lineHeight: 1,
                    }}
                  >
                    x
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Binary labels below */}
      {!compact && (
        <div
          style={{
            display: 'flex',
            width: ropeWidth,
            justifyContent: 'space-around',
            paddingLeft: spacing * 0.5,
            paddingRight: spacing * 0.5,
            marginTop: 8,
          }}
        >
          {KNOT_PATTERN.map((isKnot, i) => {
            const labelDelay = BEATS.BINARY_LABELS_START + i * BEATS.BINARY_STAGGER;
            const labelProgress = spring({
              frame: Math.max(0, frame - labelDelay),
              fps,
              config: SPRING_CONFIGS.gentle,
            });
            const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

            return (
              <div
                key={i}
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: isKnot ? COLORS.solutionGreen : COLORS.errorRed,
                  opacity: isKnot ? labelOpacity : labelOpacity * 0.6,
                  textAlign: 'center',
                  width: spacing,
                }}
              >
                {isKnot ? '1' : '0'}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Transistor Gate visualization ──
const TransistorGate: React.FC<{
  frame: number;
  fps: number;
  state: 'open' | 'closed';
  startDelay: number;
}> = ({ frame, fps, state, startDelay }) => {
  const enter = spring({
    frame: Math.max(0, frame - startDelay),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const scale = interpolate(enter, [0, 1], [0.8, 1]);

  const isOpen = state === 'open';
  const color = isOpen ? COLORS.solutionGreen : COLORS.errorRed;

  // Animated dot for current flow
  const dotCycle = (frame - startDelay) % 30;
  const dotX = isOpen
    ? interpolate(dotCycle, [0, 30], [0, 100], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 60 }}>
        <svg width={120} height={60} viewBox="0 0 120 60">
          {/* Gate body */}
          <rect
            x={30}
            y={10}
            width={60}
            height={40}
            fill="none"
            stroke={COLORS.techBlue}
            strokeWidth={2}
            rx={4}
          />
          {/* Input line */}
          <line x1={0} y1={30} x2={30} y2={30} stroke={COLORS.techBlue} strokeWidth={2} />
          {/* Output line */}
          <line x1={90} y1={30} x2={120} y2={30} stroke={COLORS.techBlue} strokeWidth={2} />
          {/* Gate status indicator */}
          <circle
            cx={60}
            cy={30}
            r={8}
            fill={isOpen ? color : 'transparent'}
            stroke={color}
            strokeWidth={2}
          />
          {/* Current flow dot (only when open) */}
          {isOpen && frame > startDelay && (
            <circle
              cx={10 + dotX}
              cy={30}
              r={3}
              fill={COLORS.solutionGreen}
              opacity={0.8}
            />
          )}
        </svg>
      </div>
      <div
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 32,
          color,
        }}
      >
        {isOpen ? '1' : '0'}
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene3_KnotsBinary: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shift up after rope/binary reveal
  const shiftProgress = spring({
    frame: Math.max(0, frame - BEATS.SHIFT_UP),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const shiftY = interpolate(shiftProgress, [0, 1], [0, -180]);

  // Equals sign
  const equalsProgress = spring({
    frame: Math.max(0, frame - BEATS.EQUALS_SIGN),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const equalsScale = interpolate(equalsProgress, [0, 1], [0, 1]);
  const equalsOpacity = interpolate(equalsProgress, [0, 1], [0, 1]);

  // Equals sign pulse
  const equalsPulse = frame >= BEATS.HOLD
    ? 1 + 0.1 * Math.sin((frame - BEATS.HOLD) * Math.PI / 15)
    : 1;

  // Show comparison label
  const showLabel = frame >= BEATS.COMPARISON_LABEL;

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={12}
      fadeOut
      fadeOutStart={225}
      fadeOutDuration={15}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
        }}
      >
        {/* Top section: rope with knots + binary, shifts up */}
        <div
          style={{
            transform: `translateY(${shiftY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <RopeVisualization frame={frame} fps={fps} />
        </div>

        {/* Equals sign */}
        {frame >= BEATS.EQUALS_SIGN && (
          <div
            style={{
              ...TYPOGRAPHY.hero,
              fontSize: 60,
              color: COLORS.insightOrange,
              opacity: equalsOpacity,
              transform: `scale(${equalsScale * equalsPulse})`,
              textAlign: 'center',
            }}
          >
            =
          </div>
        )}

        {/* Transistor comparison */}
        {frame >= BEATS.TRANSISTOR_IN && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
            }}
          >
            <TransistorGate
              frame={frame}
              fps={fps}
              state="open"
              startDelay={BEATS.TRANSISTOR_IN}
            />
            <div
              style={{
                width: 2,
                height: 60,
                backgroundColor: COLORS.panelBorder,
              }}
            />
            <TransistorGate
              frame={frame}
              fps={fps}
              state="closed"
              startDelay={BEATS.TRANSISTOR_IN + 8}
            />
          </div>
        )}

        {/* Comparison label */}
        {showLabel && (
          <div style={{ marginTop: 16 }}>
            <BlurText
              startFrame={BEATS.COMPARISON_LABEL}
              animateBy="words"
              staggerDelay={4}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.insightOrange}
            >
              2000 years apart. Same logic.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
