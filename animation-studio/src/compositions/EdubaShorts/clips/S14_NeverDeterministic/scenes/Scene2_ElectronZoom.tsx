import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText, GradientText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  DEBATE_FADE: 5,
  CHIP_IN: 15,
  CHIP_LABEL: 22,
  CIRCUIT_ZOOM: 40,
  TRANSISTOR_HIGHLIGHT: 55,
  TRANSISTOR_LABEL: 60,
  GATE_ZOOM: 70,
  ELECTRON_DOT: 80,
  ELECTRON_LABEL: 85,
  DOT_TO_CLOUD: 100,
  CLOUD_EXPAND: 105,
  JITTER_DOTS_IN: 110,
  PROBABILITY_LABEL: 125,
  NOT_A_POINT_TEXT: 130,
  QM_TEXT_IN: 140,
  BG_GLOW: 150,
  HOLD: 180,
};

// ── S14 accent colors ──
const S14 = {
  electronCloud: '#A78BFA',
  electronCloudDim: 'rgba(167,139,250,0.2)',
  probabilisticPurple: '#C084FC',
  deterministicBlue: '#60A5FA',
};

// ── Chip pin lines ──
const ChipPins: React.FC<{
  side: 'top' | 'bottom' | 'left' | 'right';
  count: number;
  chipWidth: number;
  chipHeight: number;
}> = ({ side, count, chipWidth, chipHeight }) => {
  const pins = [];
  const pinLength = 12;
  const pinColor = COLORS.textDim;

  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 1);
    let style: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: pinColor,
    };

    if (side === 'top' || side === 'bottom') {
      style = {
        ...style,
        width: 1,
        height: pinLength,
        left: t * chipWidth,
        ...(side === 'top' ? { top: -pinLength } : { bottom: -pinLength }),
      };
    } else {
      style = {
        ...style,
        width: pinLength,
        height: 1,
        top: t * chipHeight,
        ...(side === 'left' ? { left: -pinLength } : { right: -pinLength }),
      };
    }

    pins.push(<div key={`${side}-${i}`} style={style} />);
  }

  return <>{pins}</>;
};

// ── Circuit Grid ──
const CircuitGrid: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const gridLines = [];
  const gridSize = 400;
  const spacing = 50;

  // Horizontal lines
  for (let y = 0; y <= gridSize; y += spacing) {
    gridLines.push(
      <div
        key={`h-${y}`}
        style={{
          position: 'absolute',
          left: 0,
          top: y,
          width: gridSize,
          height: 1,
          backgroundColor: COLORS.techBlue,
          opacity: 0.2,
        }}
      />
    );
  }

  // Vertical lines
  for (let x = 0; x <= gridSize; x += spacing) {
    gridLines.push(
      <div
        key={`v-${x}`}
        style={{
          position: 'absolute',
          left: x,
          top: 0,
          width: 1,
          height: gridSize,
          backgroundColor: COLORS.techBlue,
          opacity: 0.2,
        }}
      />
    );
  }

  // Intersection dots (transistors)
  for (let x = spacing; x < gridSize; x += spacing) {
    for (let y = spacing; y < gridSize; y += spacing) {
      const isCenterish =
        Math.abs(x - gridSize / 2) < spacing &&
        Math.abs(y - gridSize / 2) < spacing;

      const highlightProgress =
        isCenterish && frame >= BEATS.TRANSISTOR_HIGHLIGHT
          ? spring({
              frame: frame - BEATS.TRANSISTOR_HIGHLIGHT,
              fps,
              config: SPRING_CONFIGS.snappy,
            })
          : 0;

      const dotSize = isCenterish ? interpolate(highlightProgress, [0, 1], [4, 8]) : 4;
      const dotOpacity = isCenterish ? interpolate(highlightProgress, [0, 1], [0.3, 1]) : 0.3;

      gridLines.push(
        <div
          key={`dot-${x}-${y}`}
          style={{
            position: 'absolute',
            left: x - dotSize / 2,
            top: y - dotSize / 2,
            width: dotSize,
            height: dotSize,
            backgroundColor: COLORS.techBlue,
            opacity: dotOpacity,
            boxShadow: isCenterish && highlightProgress > 0
              ? `0 0 10px rgba(59,130,246,${0.3 * highlightProgress})`
              : 'none',
          }}
        />
      );
    }
  }

  return (
    <div style={{ position: 'relative', width: gridSize, height: gridSize }}>
      {gridLines}
    </div>
  );
};

// ── Transistor Gate Schematic ──
const TransistorGate: React.FC = () => {
  const barStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: COLORS.textMuted,
  };

  return (
    <div style={{ position: 'relative', width: 120, height: 100 }}>
      {/* Source (left) */}
      <div style={{ ...barStyle, left: 0, top: 20, width: 2, height: 60 }} />
      {/* Drain (right) */}
      <div style={{ ...barStyle, right: 0, top: 20, width: 2, height: 60 }} />
      {/* Gate (top) */}
      <div style={{ ...barStyle, left: 20, top: 0, width: 80, height: 2 }} />
      {/* Channel (bottom) */}
      <div style={{ ...barStyle, left: 20, bottom: 0, width: 80, height: 2 }} />
      {/* Connections */}
      <div style={{ ...barStyle, left: 20, top: 0, width: 2, height: 20 }} />
      <div style={{ ...barStyle, right: 20, top: 0, width: 2, height: 20 }} />
      <div style={{ ...barStyle, left: 20, bottom: 0, width: 2, height: 20 }} />
      <div style={{ ...barStyle, right: 20, bottom: 0, width: 2, height: 20 }} />
    </div>
  );
};

// ── Electron Probability Cloud ──
const ElectronCloud: React.FC<{
  frame: number;
  radius: number;
  breatheAmplitude?: number;
  breathePeriod?: number;
  showDots?: boolean;
}> = ({
  frame,
  radius,
  breatheAmplitude = 10,
  breathePeriod = 40,
  showDots = true,
}) => {
  // Breathing radius
  const currentRadius =
    radius + breatheAmplitude * Math.sin((frame * 2 * Math.PI) / breathePeriod);

  // Jittering dots
  const dots: JSX.Element[] = [];
  if (showDots) {
    const dotSeeds = [
      { amp: 25, speed: 0.15, phase: 0, opacity: 0.6, size: 3 },
      { amp: 18, speed: 0.22, phase: 1.2, opacity: 0.5, size: 2 },
      { amp: 30, speed: 0.12, phase: 2.5, opacity: 0.7, size: 3 },
      { amp: 12, speed: 0.28, phase: 3.8, opacity: 0.4, size: 4 },
      { amp: 22, speed: 0.18, phase: 5.0, opacity: 0.8, size: 2 },
      { amp: 35, speed: 0.1, phase: 0.7, opacity: 0.3, size: 3 },
      { amp: 15, speed: 0.25, phase: 4.2, opacity: 0.6, size: 2 },
    ];

    dotSeeds.forEach((dot, i) => {
      const x = dot.amp * Math.sin(frame * dot.speed + dot.phase);
      const y = dot.amp * Math.cos(frame * dot.speed * 0.8 + dot.phase + 1.5);
      const dotOpacity =
        dot.opacity + 0.2 * Math.sin(frame * 0.1 + dot.phase);

      dots.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            opacity: Math.max(0, dotOpacity),
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    });
  }

  return (
    <div
      style={{
        position: 'relative',
        width: currentRadius * 2,
        height: currentRadius * 2,
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S14.electronCloud} 0%, rgba(167,139,250,0.3) 40%, rgba(167,139,250,0.1) 65%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
      {/* Middle ring */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          top: '15%',
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S14.electronCloud} 0%, transparent 100%)`,
          opacity: 0.5,
        }}
      />
      {/* Inner ring */}
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '30%',
          width: '40%',
          height: '40%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S14.electronCloud} 0%, transparent 100%)`,
          opacity: 0.3,
        }}
      />
      {/* Jitter dots */}
      {dots}
    </div>
  );
};

// ── Main Scene ──
export const Scene2_ElectronZoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Zoom scale calculation ──
  // Phase 1: chip (15-40f) scale 0.8 to 1.0
  // Phase 2: circuit (40-70f) scale 1.0 to 4.0
  // Phase 3: transistor (70-100f) scale 4.0 to 12.0
  // Phase 4+: cloud (100+) scale 12.0 hold (we stop zooming and show cloud)

  // We use a simulated zoom by crossfading between layers rather than
  // a literal CSS scale, as the spec's zoom is conceptual.

  // ── Layer visibility calculations ──
  const chipOpacity = (() => {
    if (frame < BEATS.CHIP_IN) return 0;
    const fadeIn = spring({
      frame: frame - BEATS.CHIP_IN,
      fps,
      config: SPRING_CONFIGS.gentle,
    });
    if (frame >= BEATS.CIRCUIT_ZOOM) {
      const fadeOut = interpolate(
        frame,
        [BEATS.CIRCUIT_ZOOM, BEATS.CIRCUIT_ZOOM + 15],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      return fadeIn * fadeOut;
    }
    return fadeIn;
  })();

  const circuitOpacity = (() => {
    if (frame < BEATS.CIRCUIT_ZOOM) return 0;
    const fadeIn = interpolate(
      frame,
      [BEATS.CIRCUIT_ZOOM, BEATS.CIRCUIT_ZOOM + 15],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    if (frame >= BEATS.GATE_ZOOM) {
      const fadeOut = interpolate(
        frame,
        [BEATS.GATE_ZOOM, BEATS.GATE_ZOOM + 15],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      return fadeIn * fadeOut;
    }
    return fadeIn;
  })();

  const gateOpacity = (() => {
    if (frame < BEATS.GATE_ZOOM) return 0;
    const fadeIn = interpolate(
      frame,
      [BEATS.GATE_ZOOM, BEATS.GATE_ZOOM + 15],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    if (frame >= BEATS.DOT_TO_CLOUD) {
      const fadeOut = interpolate(
        frame,
        [BEATS.DOT_TO_CLOUD, BEATS.DOT_TO_CLOUD + 20],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      return fadeIn * fadeOut;
    }
    return fadeIn;
  })();

  // ── Electron dot to cloud transition ──
  const dotToCloudProgress = (() => {
    if (frame < BEATS.DOT_TO_CLOUD) return 0;
    return spring({
      frame: frame - BEATS.DOT_TO_CLOUD,
      fps,
      config: SPRING_CONFIGS.slow,
    });
  })();

  const dotRadius = interpolate(dotToCloudProgress, [0, 1], [8, 80]);
  const cloudOpacity = interpolate(dotToCloudProgress, [0, 0.3, 1], [0, 0.3, 1]);

  // ── Label animations ──
  const chipLabelProgress = spring({
    frame: frame - BEATS.CHIP_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const transistorLabelProgress = spring({
    frame: frame - BEATS.TRANSISTOR_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const electronLabelProgress = spring({
    frame: frame - BEATS.ELECTRON_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const probabilityLabelProgress = spring({
    frame: frame - BEATS.PROBABILITY_LABEL,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const notAPointProgress = spring({
    frame: frame - BEATS.NOT_A_POINT_TEXT,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const qmTextProgress = spring({
    frame: frame - BEATS.QM_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  // ── Background glow ──
  const bgGlowOpacity =
    frame >= BEATS.BG_GLOW
      ? interpolate(
          frame,
          [BEATS.BG_GLOW, BEATS.BG_GLOW + 30],
          [0, 0.15],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        ) *
        (1 + 0.1 * Math.sin((frame - BEATS.BG_GLOW) * (Math.PI / 30)))
      : 0;

  return (
    <SceneContainer background={COLORS.bgNavy} fadeIn fadeInDuration={15}>
      {/* Background radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, rgba(139,92,246,${bgGlowOpacity}) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: `0 ${LAYOUT.safeMarginX}px`,
          gap: 16,
        }}
      >
        {/* ── Layer 1: Chip Exterior ── */}
        {chipOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: chipOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 300,
                height: 200,
                backgroundColor: COLORS.bgSurfaceAlt,
                borderRadius: 8,
                border: `1px solid ${COLORS.panelBorder}`,
              }}
            >
              <ChipPins side="top" count={8} chipWidth={300} chipHeight={200} />
              <ChipPins side="bottom" count={8} chipWidth={300} chipHeight={200} />
              <ChipPins side="left" count={6} chipWidth={300} chipHeight={200} />
              <ChipPins side="right" count={6} chipWidth={300} chipHeight={200} />
            </div>
            {/* CPU label */}
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.textMuted,
                opacity: interpolate(chipLabelProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(chipLabelProgress, [0, 1], [10, 0])}px)`,
              }}
            >
              CPU
            </div>
          </div>
        )}

        {/* ── Layer 2: Circuit Grid + Transistor ── */}
        {circuitOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: circuitOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <CircuitGrid frame={frame} fps={fps} />
            {/* Transistor label */}
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.techBlue,
                opacity: interpolate(transistorLabelProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(transistorLabelProgress, [0, 1], [10, 0])}px)`,
              }}
            >
              TRANSISTOR
            </div>
          </div>
        )}

        {/* ── Layer 3: Transistor Gate + Electron Dot ── */}
        {gateOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: gateOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <TransistorGate />
            {/* Sharp electron dot (pre-transform) */}
            {dotToCloudProgress < 0.1 && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: COLORS.textPrimary,
                  marginTop: -24,
                }}
              />
            )}
            {/* Electron label */}
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: S14.electronCloud,
                opacity: interpolate(electronLabelProgress, [0, 1], [0, 1]) *
                  (1 - dotToCloudProgress),
                transform: `translateY(${interpolate(electronLabelProgress, [0, 1], [10, 0])}px)`,
              }}
            >
              ELECTRON
            </div>
          </div>
        )}

        {/* ── Layer 4: Probability Cloud (the reveal) ── */}
        {dotToCloudProgress > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: cloudOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <ElectronCloud
              frame={frame}
              radius={dotRadius}
              breatheAmplitude={dotRadius > 60 ? 10 : 0}
              showDots={frame >= BEATS.JITTER_DOTS_IN}
            />

            {/* "PROBABILITY CLOUD" label */}
            {frame >= BEATS.PROBABILITY_LABEL && (
              <div
                style={{
                  opacity: interpolate(probabilityLabelProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(probabilityLabelProgress, [0, 1], [15, 0])}px)`,
                }}
              >
                <ShinyText
                  color={S14.electronCloud}
                  shineColor="#FFFFFF"
                  fontSize={40}
                  fontWeight={600}
                  duration={50}
                  startFrame={BEATS.PROBABILITY_LABEL}
                >
                  PROBABILITY CLOUD
                </ShinyText>
              </div>
            )}

            {/* "Not a point. A probability." */}
            {frame >= BEATS.NOT_A_POINT_TEXT && (
              <div
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.textBody,
                  textAlign: 'center',
                  opacity: interpolate(notAPointProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(notAPointProgress, [0, 1], [15, 0])}px)`,
                }}
              >
                Not a point. A probability.
              </div>
            )}
          </div>
        )}

        {/* ── "QUANTUM MECHANICS" gradient text ── */}
        {frame >= BEATS.QM_TEXT_IN && (
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: `translate(-50%, 0)`,
              opacity: interpolate(qmTextProgress, [0, 1], [0, 1]),
            }}
          >
            <GradientText
              colors={[COLORS.aiPurple, '#C4B5FD', COLORS.insightOrange]}
              direction="horizontal"
              fontSize={48}
              fontWeight={700}
              duration={120}
              yoyo
              startFrame={BEATS.QM_TEXT_IN}
            >
              QUANTUM MECHANICS
            </GradientText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
