import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  PHONE_IN: 5,
  HEAT_START: 15,
  THERMOMETER_IN: 18,
  HEAT_WAVES: 22,
  ZOOM_START: 30,
  CIRCUITS_VISIBLE: 40,
  TRANSISTOR_FOCUS: 50,
  TRANSISTOR_LABEL: 58,
  HOLD: 65,
};

// ── Heat wave lines ──
const HeatWaves: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.HEAT_WAVES;
  if (relFrame < 0) return null;

  const opacity = interpolate(relFrame, [0, 10], [0, 0.3], {
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {[0, 1, 2].map((i) => {
        const yOffset =
          -10 - i * 14 + Math.sin((relFrame + i * 10) * 0.15) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: -20 + yOffset,
              left: '50%',
              transform: `translateX(${-20 + i * 20}px)`,
              width: 30,
              height: 2,
              borderRadius: 1,
              backgroundColor: COLORS.textMuted,
              opacity: opacity * (0.3 - i * 0.05),
            }}
          />
        );
      })}
    </>
  );
};

// ── Thermometer icon ──
const Thermometer: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.THERMOMETER_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const fillHeight = interpolate(relFrame, [0, 20], [0, 100], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        right: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        opacity,
      }}
    >
      {/* Tube */}
      <div
        style={{
          width: 16,
          height: 70,
          borderRadius: 8,
          border: `2px solid ${COLORS.errorRed}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${fillHeight}%`,
            backgroundColor: COLORS.errorRed,
            borderRadius: 4,
          }}
        />
      </div>
      {/* Bulb */}
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: COLORS.errorRed,
          marginTop: -4,
          marginLeft: -4,
        }}
      />
    </div>
  );
};

// ── Circuit traces (visible during zoom) ──
const CircuitTraces: React.FC<{ opacity: number }> = ({ opacity }) => {
  const traces = [
    { x1: 100, y1: 80, x2: 400, y2: 80 },
    { x1: 400, y1: 80, x2: 400, y2: 200 },
    { x1: 200, y1: 200, x2: 500, y2: 200 },
    { x1: 300, y1: 50, x2: 300, y2: 250 },
    { x1: 150, y1: 150, x2: 450, y2: 150 },
    { x1: 350, y1: 100, x2: 350, y2: 280 },
  ];

  return (
    <svg
      width={600}
      height={340}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      {traces.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={COLORS.techBlue}
          strokeWidth={1.5}
          opacity={0.4}
        />
      ))}
    </svg>
  );
};

// ── Transistor symbol ──
const TransistorSymbol: React.FC<{ opacity: number; glowOpacity: number }> = ({
  opacity,
  glowOpacity,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      <svg width={200} height={160} viewBox="0 0 200 160">
        {/* Source / Drain lines */}
        <line
          x1={30}
          y1={80}
          x2={80}
          y2={80}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
        <line
          x1={120}
          y1={80}
          x2={170}
          y2={80}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
        {/* Gate left vertical */}
        <line
          x1={80}
          y1={40}
          x2={80}
          y2={120}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
        {/* Gate right vertical */}
        <line
          x1={120}
          y1={40}
          x2={120}
          y2={120}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
        {/* Gate bridge top */}
        <line
          x1={80}
          y1={40}
          x2={120}
          y2={40}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
        {/* Gate bridge bottom */}
        <line
          x1={80}
          y1={120}
          x2={120}
          y2={120}
          stroke={COLORS.techBlue}
          strokeWidth={2}
        />
      </svg>
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 200,
          height: 160,
          transform: 'translate(-50%, -50%)',
          borderRadius: 20,
          boxShadow: `0 0 25px rgba(139,92,246,${glowOpacity})`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance
  const phoneRelFrame = frame - BEATS.PHONE_IN;
  const phoneProgress = spring({
    frame: phoneRelFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const phoneScale = interpolate(phoneProgress, [0, 1], [0, 1]);
  const phoneY = interpolate(phoneProgress, [0, 1], [-20, 0]);

  // Heat glow
  const heatRelFrame = frame - BEATS.HEAT_START;
  const heatGlowScale =
    heatRelFrame >= 0
      ? interpolate(heatRelFrame, [0, 15], [1, 1.5], {
          extrapolateRight: 'clamp',
        })
      : 1;
  const heatGlowOpacity =
    heatRelFrame >= 0
      ? interpolate(heatRelFrame, [0, 10], [0, 0.1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // Zoom
  const zoomRelFrame = frame - BEATS.ZOOM_START;
  const zoomScale =
    zoomRelFrame >= 0
      ? interpolate(zoomRelFrame, [0, 25], [1.0, 3.0], {
          extrapolateRight: 'clamp',
          easing: Easing.inOut(Easing.ease),
        })
      : 1.0;

  // Circuit traces opacity based on zoom
  const circuitsOpacity =
    frame >= BEATS.CIRCUITS_VISIBLE
      ? interpolate(frame, [BEATS.CIRCUITS_VISIBLE, BEATS.CIRCUITS_VISIBLE + 10], [0, 0.2], {
          extrapolateRight: 'clamp',
        })
      : 0;
  // Dim circuits when transistor is in focus
  const circuitsFinalOpacity =
    frame >= BEATS.TRANSISTOR_FOCUS
      ? interpolate(
          frame,
          [BEATS.TRANSISTOR_FOCUS, BEATS.TRANSISTOR_FOCUS + 10],
          [circuitsOpacity, 0.05],
          { extrapolateRight: 'clamp' }
        )
      : circuitsOpacity;

  // Transistor
  const transistorOpacity =
    frame >= BEATS.TRANSISTOR_FOCUS
      ? interpolate(frame, [BEATS.TRANSISTOR_FOCUS, BEATS.TRANSISTOR_FOCUS + 10], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // Transistor glow pulsing
  const transistorRelFrame = frame - BEATS.TRANSISTOR_FOCUS;
  const glowPulse =
    transistorRelFrame >= 0
      ? 0.1 + 0.2 * Math.sin(transistorRelFrame * 0.1)
      : 0;

  // Label
  const labelOpacity =
    frame >= BEATS.TRANSISTOR_LABEL
      ? interpolate(frame, [BEATS.TRANSISTOR_LABEL, BEATS.TRANSISTOR_LABEL + 10], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Zoom container */}
        <div
          style={{
            transform: `scale(${zoomScale})`,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Heat glow */}
          <div
            style={{
              position: 'absolute',
              width: 300,
              height: 480,
              borderRadius: 40,
              background: `radial-gradient(ellipse, ${COLORS.errorRed} 0%, transparent 70%)`,
              opacity: heatGlowOpacity,
              transform: `scale(${heatGlowScale})`,
              pointerEvents: 'none',
            }}
          />

          {/* Phone */}
          <div
            style={{
              position: 'relative',
              width: 200,
              height: 380,
              borderRadius: 20,
              border: `2px solid ${COLORS.textBody}`,
              backgroundColor: 'transparent',
              transform: `scale(${phoneScale}) translateY(${phoneY}px)`,
              overflow: 'hidden',
            }}
          >
            {/* Screen area */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 10,
                right: 10,
                bottom: 20,
                borderRadius: 8,
                backgroundColor: COLORS.bgSurface,
                opacity: 0.5,
              }}
            />

            {/* Circuit traces (inside phone during zoom) */}
            <CircuitTraces opacity={circuitsFinalOpacity} />

            {/* Transistor symbol */}
            <TransistorSymbol
              opacity={transistorOpacity}
              glowOpacity={glowPulse}
            />

            {/* Heat wave lines */}
            <HeatWaves frame={frame} fps={fps} />
          </div>

          {/* Thermometer */}
          <Thermometer frame={frame} fps={fps} />
        </div>

        {/* Transistor label (outside zoom to stay readable) */}
        {labelOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: LAYOUT.contentZoneBottom - 200,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: labelOpacity,
            }}
          >
            <ShinyText
              color={COLORS.aiPurple}
              shineColor="#C4B5FD"
              fontSize={36}
              fontWeight={600}
              duration={40}
            >
              TRANSISTOR
            </ShinyText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
