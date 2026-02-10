import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { StatGrid } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  LAPTOP_IN: 15,
  PHONE_IN: 22,
  SERVER_IN: 29,
  DEVICE_LABELS: 35,
  PARTICLES_START: 50,
  SHIELDS_IN: 55,
  FIRST_CATCH: 65,
  FIRST_PASSTHROUGH: 100,
  SECOND_PASSTHROUGH: 140,
  STAT_PANEL_IN: 140,
  STAT_COUNTUP: 150,
  THIRD_PASSTHROUGH: 180,
  FINAL_PARTICLE_SEQUENCE: 200,
  DEVICE_1_HIT: 205,
  DEVICE_2_HIT: 220,
  DEVICE_3_HIT: 235,
  STAT_GLITCH: 240,
  DIM_OUT: 250,
};

// Particle schedule: [relativeFrame, targetDeviceIndex (0=laptop,1=phone,2=server), caught: boolean]
const PARTICLE_SCHEDULE: Array<[number, number, boolean]> = [
  // Early catches
  [65, 0, true],
  [73, 2, true],
  [80, 1, true],
  [88, 0, true],
  [95, 2, true],
  // First passthrough
  [100, 1, false],
  // More catches
  [108, 0, true],
  [115, 2, true],
  [122, 1, true],
  [130, 0, true],
  [135, 2, true],
  // Second passthrough
  [140, 0, false],
  // More catches
  [150, 1, true],
  [158, 2, true],
  [165, 0, true],
  [172, 1, true],
  // Third passthrough
  [180, 2, false],
  // Final catches
  [188, 0, true],
  [195, 1, true],
];

// Device Y positions (stacked vertically)
const DEVICE_POSITIONS = [
  { y: 280, label: 'LAPTOP' },
  { y: 560, label: 'PHONE' },
  { y: 840, label: 'SERVER' },
];

// Catch counter per device
const getCatchCount = (frame: number, deviceIndex: number): number => {
  let count = 0;
  for (const [pFrame, pDevice, caught] of PARTICLE_SCHEDULE) {
    if (pFrame + 6 <= frame && pDevice === deviceIndex && caught) {
      count++;
    }
  }
  return count;
};

export const Scene4_DeviceMontage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Device entrances ---
  const deviceProgresses = DEVICE_POSITIONS.map((_, i) => {
    const startFrame = [BEATS.LAPTOP_IN, BEATS.PHONE_IN, BEATS.SERVER_IN][i];
    return spring({
      frame: frame - startFrame,
      fps,
      config: SPRING_CONFIGS.snappy,
    });
  });

  // --- Shield entrance ---
  const shieldProgress = spring({
    frame: frame - BEATS.SHIELDS_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const shieldOpacity = interpolate(shieldProgress, [0, 1], [0, 1]);

  // --- Final particle hit sequence ---
  const finalParticleY = interpolate(
    frame,
    [
      BEATS.FINAL_PARTICLE_SEQUENCE,
      BEATS.DEVICE_1_HIT,
      BEATS.DEVICE_2_HIT,
      BEATS.DEVICE_3_HIT,
    ],
    [0, DEVICE_POSITIONS[0].y, DEVICE_POSITIONS[1].y, DEVICE_POSITIONS[2].y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Device flash states for final sequence
  const device1Flash =
    frame >= BEATS.DEVICE_1_HIT && frame < BEATS.DEVICE_1_HIT + 8
      ? interpolate(
          frame,
          [BEATS.DEVICE_1_HIT, BEATS.DEVICE_1_HIT + 8],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  const device2Flash =
    frame >= BEATS.DEVICE_2_HIT && frame < BEATS.DEVICE_2_HIT + 8
      ? interpolate(
          frame,
          [BEATS.DEVICE_2_HIT, BEATS.DEVICE_2_HIT + 8],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  const device3Flash =
    frame >= BEATS.DEVICE_3_HIT && frame < BEATS.DEVICE_3_HIT + 8
      ? interpolate(
          frame,
          [BEATS.DEVICE_3_HIT, BEATS.DEVICE_3_HIT + 8],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  const deviceFlashes = [device1Flash, device2Flash, device3Flash];

  // --- Dim out ---
  const dimOpacity = interpolate(
    frame,
    [BEATS.DIM_OUT, BEATS.DIM_OUT + 30],
    [1, 0.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Stat panel ---
  const statPanelProgress = spring({
    frame: frame - BEATS.STAT_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const statPanelOpacity = interpolate(statPanelProgress, [0, 1], [0, 1]);
  const statPanelY = interpolate(statPanelProgress, [0, 1], [40, 0]);

  const showStatGlitch = frame >= BEATS.STAT_GLITCH;

  return (
    <SceneContainer background={COLORS.bgNavy} fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          position: 'relative',
          opacity: dimOpacity,
        }}
      >
        {/* --- Devices --- */}
        {DEVICE_POSITIONS.map((device, i) => {
          const progress = deviceProgresses[i];
          const opacity = interpolate(progress, [0, 1], [0, 1]);
          const scale = interpolate(progress, [0, 1], [0.8, 1]);
          const flashIntensity = deviceFlashes[i];

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: device.y,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {/* Shield arc */}
              {frame >= BEATS.SHIELDS_IN && (
                <div
                  style={{
                    position: 'absolute',
                    top: -45,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 140,
                    height: 45,
                    borderTopLeftRadius: 70,
                    borderTopRightRadius: 70,
                    border: `2px solid ${COLORS.solutionGreen}`,
                    borderBottom: 'none',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    opacity: shieldOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 18,
                      fontWeight: 600,
                      color: COLORS.solutionGreen,
                      opacity: 0.6,
                    }}
                  >
                    ECC
                  </span>
                </div>
              )}

              {/* Device icon */}
              <div
                style={{
                  position: 'relative',
                  boxShadow: flashIntensity > 0
                    ? `0 0 20px rgba(239,68,68,${flashIntensity})`
                    : 'none',
                }}
              >
                {i === 0 && (
                  /* Laptop — clamshell shape */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Screen */}
                    <div
                      style={{
                        width: 80,
                        height: 55,
                        border: `2px solid ${COLORS.textMuted}`,
                        borderRadius: '6px 6px 0 0',
                        borderBottom: 'none',
                        backgroundColor: flashIntensity > 0
                          ? `rgba(239,68,68,${flashIntensity * 0.15})`
                          : 'transparent',
                      }}
                    />
                    {/* Base */}
                    <div
                      style={{
                        width: 96,
                        height: 6,
                        border: `2px solid ${COLORS.textMuted}`,
                        borderRadius: '0 0 4px 4px',
                      }}
                    />
                  </div>
                )}
                {i === 1 && (
                  /* Phone — tall rounded rectangle */
                  <div
                    style={{
                      width: 45,
                      height: 80,
                      border: `2px solid ${COLORS.textMuted}`,
                      borderRadius: 10,
                      backgroundColor: flashIntensity > 0
                        ? `rgba(239,68,68,${flashIntensity * 0.15})`
                        : 'transparent',
                    }}
                  />
                )}
                {i === 2 && (
                  /* Server rack — stacked rectangles with LEDs */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        style={{
                          width: 90,
                          height: 24,
                          border: `2px solid ${COLORS.textMuted}`,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: 6,
                          gap: 4,
                          backgroundColor: flashIntensity > 0
                            ? `rgba(239,68,68,${flashIntensity * 0.15})`
                            : 'transparent',
                        }}
                      >
                        {/* LED dots */}
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: COLORS.techBlue,
                          }}
                        />
                        <div
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: COLORS.solutionGreen,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Device label */}
              {frame >= BEATS.DEVICE_LABELS + i * 3 && (
                <AnimatedText
                  variant="label"
                  size={22}
                  color={COLORS.textMuted}
                  startFrame={BEATS.DEVICE_LABELS + i * 3}
                  entrance="fade"
                  align="center"
                >
                  {device.label}
                </AnimatedText>
              )}

              {/* Catch counter */}
              {frame >= BEATS.FIRST_CATCH && getCatchCount(frame, i) > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    right: -55,
                    top: 0,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 20,
                    fontWeight: 600,
                    color: COLORS.solutionGreen,
                    opacity: 0.8,
                  }}
                >
                  +{getCatchCount(frame, i)}
                </div>
              )}
            </div>
          );
        })}

        {/* --- Particle impacts (from schedule) --- */}
        {PARTICLE_SCHEDULE.map(([pFrame, deviceIdx, caught], i) => {
          if (frame < pFrame || frame > pFrame + 12) return null;

          const growPhase = interpolate(
            frame,
            [pFrame, pFrame + 6],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const shrinkPhase = interpolate(
            frame,
            [pFrame + 6, pFrame + 12],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const impactProgress = frame <= pFrame + 6 ? growPhase : shrinkPhase;

          const deviceY = DEVICE_POSITIONS[deviceIdx].y;
          const flashY = caught ? deviceY - 45 : deviceY; // Shield vs device
          const flashColor = caught ? COLORS.solutionGreen : COLORS.errorRed;
          const maxFlash = caught ? 12 : 8;
          const flashSize = impactProgress * maxFlash + (1 - impactProgress) * 2;

          return (
            <div
              key={`p-${i}`}
              style={{
                position: 'absolute',
                left: '50%',
                top: flashY,
                transform: 'translate(-50%, -50%)',
                width: flashSize,
                height: flashSize,
                borderRadius: '50%',
                backgroundColor: flashColor,
                opacity: impactProgress,
                boxShadow: `0 0 12px ${flashColor}`,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* --- Incoming particle trails --- */}
        {PARTICLE_SCHEDULE.map(([pFrame, deviceIdx], i) => {
          const trailStart = pFrame - 8;
          if (frame < trailStart || frame > pFrame) return null;

          const trailProgress = interpolate(
            frame,
            [trailStart, pFrame],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const deviceY = DEVICE_POSITIONS[deviceIdx].y;
          const startY = deviceY - 200;
          const currentTrailY = interpolate(trailProgress, [0, 1], [startY, deviceY - 45]);
          const startX = 540 + (i % 5 - 2) * 30;

          return (
            <div
              key={`t-${i}`}
              style={{
                position: 'absolute',
                left: startX,
                top: currentTrailY,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: COLORS.particleTrail,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 6px ${COLORS.particleTrail}`,
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* --- Final particle (passes through all shields) --- */}
        {frame >= BEATS.FINAL_PARTICLE_SEQUENCE && frame < BEATS.DEVICE_3_HIT + 15 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: finalParticleY,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: COLORS.errorRed,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 12px ${COLORS.errorRed}`,
              opacity: interpolate(
                frame,
                [BEATS.DEVICE_3_HIT + 8, BEATS.DEVICE_3_HIT + 15],
                [1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          />
        )}

        {/* --- Stat panel --- */}
        {frame >= BEATS.STAT_PANEL_IN && (
          <div
            style={{
              position: 'absolute',
              bottom: 180,
              left: '50%',
              transform: `translateX(-50%) translateY(${statPanelY}px)`,
              opacity: statPanelOpacity,
              width: 700,
              backgroundColor: COLORS.codeBg,
              borderRadius: 12,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: '24px 32px',
            }}
          >
            {showStatGlitch ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StatGrid
                  stats={[
                    { value: 99.99, suffix: '%', label: 'CAUGHT', decimals: 2 },
                    { value: 0.01, suffix: '%', label: 'SLIP THROUGH', decimals: 2 },
                  ]}
                  startFrame={BEATS.STAT_COUNTUP}
                  staggerDelay={15}
                  columns={2}
                  fontSize={48}
                  accentColor={COLORS.solutionGreen}
                  color={COLORS.textBody}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StatGrid
                  stats={[
                    { value: 99.99, suffix: '%', label: 'CAUGHT', decimals: 2 },
                    { value: 0.01, suffix: '%', label: 'SLIP THROUGH', decimals: 2 },
                  ]}
                  startFrame={BEATS.STAT_COUNTUP}
                  staggerDelay={15}
                  columns={2}
                  fontSize={48}
                  accentColor={COLORS.solutionGreen}
                  color={COLORS.textBody}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
