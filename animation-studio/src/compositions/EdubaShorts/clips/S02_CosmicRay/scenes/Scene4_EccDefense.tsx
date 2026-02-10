import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { CountUpWithLabel } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  BOMBARDMENT_LABEL: 5,
  LAPTOP_IN: 15,
  PHONE_IN: 25,
  DATACENTER_IN: 35,
  PARTICLES_START: 45,
  SHIELDS_IN: 60,
  FIRST_CATCH: 70,
  FIRST_PASSTHROUGH: 100,
  STAT_PANEL_IN: 120,
  COUNTUP_START: 130,
  IBM_LABEL: 150,
  ECC_TEXT_IN: 200,
  ECC_SUBLABEL: 210,
  HOLD: 260,
};

/** Device icon silhouette */
const DeviceIcon: React.FC<{
  type: 'laptop' | 'phone' | 'datacenter';
  x: number;
  y: number;
  frame: number;
  fps: number;
  startFrame: number;
  isHit: boolean;
  hitFrame: number;
}> = ({ type, x, y, frame, fps, startFrame, isHit, hitFrame }) => {
  const entranceSpring = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const entranceY = interpolate(entranceSpring, [0, 1], [-20, 0]);
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Red flash when hit
  const isFlashing = isHit && frame >= hitFrame && frame < hitFrame + 6;
  const strokeColor = isFlashing ? COLORS.errorRed : COLORS.textMuted;

  // Dim during hold
  const holdDim = interpolate(
    frame,
    [BEATS.HOLD, BEATS.HOLD + 20],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    opacity: opacity * holdDim,
    transform: `translateY(${entranceY}px)`,
  };

  if (type === 'laptop') {
    return (
      <div style={baseStyle}>
        {/* Screen */}
        <div
          style={{
            width: 120,
            height: 80,
            border: `2px solid ${strokeColor}`,
            borderRadius: '8px 8px 0 0',
            backgroundColor: 'transparent',
          }}
        />
        {/* Base */}
        <div
          style={{
            width: 140,
            height: 8,
            marginLeft: -10,
            border: `2px solid ${strokeColor}`,
            borderRadius: '0 0 4px 4px',
            backgroundColor: 'transparent',
          }}
        />
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div style={baseStyle}>
        <div
          style={{
            width: 60,
            height: 100,
            border: `2px solid ${strokeColor}`,
            borderRadius: 12,
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingBottom: 6,
          }}
        >
          {/* Home indicator */}
          <div
            style={{
              width: 24,
              height: 3,
              borderRadius: 2,
              backgroundColor: strokeColor,
              opacity: 0.5,
            }}
          />
        </div>
      </div>
    );
  }

  // datacenter
  return (
    <div style={baseStyle}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 120,
            height: 30,
            border: `2px solid ${strokeColor}`,
            borderRadius: 3,
            backgroundColor: 'transparent',
            marginBottom: i < 2 ? 4 : 0,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
            gap: 4,
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: COLORS.techBlue,
              boxShadow: `0 0 4px ${COLORS.techBlue}`,
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: COLORS.solutionGreen,
              boxShadow: `0 0 4px ${COLORS.solutionGreen}`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

/** Shield arc around a device */
const ShieldArc: React.FC<{
  x: number;
  y: number;
  width: number;
  frame: number;
  fps: number;
  brightUntil: number;
}> = ({ x, y, width, frame, fps, brightUntil }) => {
  const shieldSpring = spring({
    frame: frame - BEATS.SHIELDS_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const shieldOpacity = interpolate(shieldSpring, [0, 1], [0, 0.2]);

  // Brief brightness on catch
  const isBright = frame < brightUntil;
  const finalOpacity = isBright ? 0.5 : shieldOpacity;

  // Breathing during hold
  const breathe =
    frame >= BEATS.HOLD
      ? 0.2 + 0.15 * Math.sin(frame * 0.05)
      : finalOpacity;

  // Dim during hold
  const holdDim = interpolate(
    frame,
    [BEATS.HOLD, BEATS.HOLD + 20],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (frame < BEATS.SHIELDS_IN) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - width / 2,
        width,
        height: width / 2,
        borderRadius: `${width / 2}px ${width / 2}px 0 0`,
        backgroundColor: `rgba(16,185,129,${breathe * holdDim})`,
        border: `2px solid ${COLORS.solutionGreen}`,
        borderBottom: 'none',
        opacity: holdDim,
      }}
    />
  );
};

/** A cosmic ray particle */
interface Particle {
  id: number;
  startFrame: number;
  startX: number;
  targetDeviceIndex: number;
  isCaught: boolean;
}

const DEVICES = [
  { type: 'laptop' as const, x: 480, y: 450, shieldX: 540, shieldY: 430, label: 'YOUR LAPTOP' },
  { type: 'phone' as const, x: 510, y: 750, shieldX: 540, shieldY: 730, label: 'YOUR PHONE' },
  { type: 'datacenter' as const, x: 480, y: 1040, shieldX: 540, shieldY: 1020, label: 'DATA CENTER' },
];

// Generate 15 particles with deterministic pseudo-random positions
const generateParticles = (): Particle[] => {
  const particles: Particle[] = [];
  // 3 pass-through particles at specific indices
  const passthroughIndices = new Set([4, 9, 13]);

  for (let i = 0; i < 15; i++) {
    const startFrame = BEATS.PARTICLES_START + i * 9;
    // Deterministic "random" using sine
    const seed = Math.sin(i * 47.3) * 0.5 + 0.5;
    const startX = 100 + seed * 880;
    const targetDeviceIndex = i % 3;
    const isCaught = !passthroughIndices.has(i);

    particles.push({ id: i, startFrame, startX, targetDeviceIndex, isCaught });
  }
  return particles;
};

export const Scene4_EccDefense: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const particles = useMemo(() => generateParticles(), []);

  // Track shield brightness (brighten briefly on catch)
  const shieldBrightUntil = useMemo(() => {
    const brightFrames = [0, 0, 0];
    particles.forEach((p) => {
      if (p.isCaught) {
        const catchFrame = p.startFrame + 20;
        brightFrames[p.targetDeviceIndex] = Math.max(
          brightFrames[p.targetDeviceIndex],
          catchFrame + 10,
        );
      }
    });
    return brightFrames;
  }, [particles]);

  // Track device hits (for red flash)
  const deviceHitFrames = useMemo(() => {
    const hits = [-999, -999, -999];
    particles.forEach((p) => {
      if (!p.isCaught) {
        hits[p.targetDeviceIndex] = p.startFrame + 20;
      }
    });
    return hits;
  }, [particles]);

  // Stat panel entrance
  const statPanelSpring = spring({
    frame: frame - BEATS.STAT_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const statPanelY = interpolate(statPanelSpring, [0, 1], [40, 0]);
  const statPanelOpacity = interpolate(statPanelSpring, [0, 1], [0, 1]);

  // ECC text
  const showEccText = frame >= BEATS.ECC_TEXT_IN;

  // Hold dim
  const holdDim = interpolate(
    frame,
    [BEATS.HOLD, BEATS.HOLD + 20],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <SceneContainer background={COLORS.bgNavy} fadeIn fadeInDuration={10}>
      {/* Bombardment label */}
      {frame >= BEATS.BOMBARDMENT_LABEL && (
        <div
          style={{
            position: 'absolute',
            top: LAYOUT.contentZoneTop - 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <AnimatedText
            variant="label"
            size={24}
            color={COLORS.textMuted}
            startFrame={BEATS.BOMBARDMENT_LABEL}
            entrance="fade"
            align="center"
          >
            CONSTANT BOMBARDMENT
          </AnimatedText>
        </div>
      )}

      {/* Devices */}
      {DEVICES.map((device, i) => (
        <React.Fragment key={device.type}>
          <DeviceIcon
            type={device.type}
            x={device.x}
            y={device.y}
            frame={frame}
            fps={fps}
            startFrame={
              i === 0
                ? BEATS.LAPTOP_IN
                : i === 1
                  ? BEATS.PHONE_IN
                  : BEATS.DATACENTER_IN
            }
            isHit={!particles.every(
              (p) =>
                p.targetDeviceIndex !== i || p.isCaught,
            )}
            hitFrame={deviceHitFrames[i]}
          />

          {/* Device label */}
          {frame >=
            (i === 0
              ? BEATS.LAPTOP_IN
              : i === 1
                ? BEATS.PHONE_IN
                : BEATS.DATACENTER_IN) + 10 && (
            <div
              style={{
                position: 'absolute',
                left: device.x - 40,
                top:
                  device.y +
                  (device.type === 'laptop'
                    ? 100
                    : device.type === 'phone'
                      ? 115
                      : 110),
                width: 200,
                textAlign: 'center',
                opacity: holdDim,
              }}
            >
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.textMuted}
                startFrame={
                  (i === 0
                    ? BEATS.LAPTOP_IN
                    : i === 1
                      ? BEATS.PHONE_IN
                      : BEATS.DATACENTER_IN) + 10
                }
                entrance="fade"
                align="center"
              >
                {device.label}
              </AnimatedText>
            </div>
          )}

          {/* Shield */}
          <ShieldArc
            x={device.shieldX}
            y={device.shieldY}
            width={180}
            frame={frame}
            fps={fps}
            brightUntil={shieldBrightUntil[i]}
          />
        </React.Fragment>
      ))}

      {/* Particles */}
      {particles.map((particle) => {
        const pFrame = frame - particle.startFrame;
        if (pFrame < 0 || pFrame > 30) return null;

        const device = DEVICES[particle.targetDeviceIndex];
        const targetY = device.shieldY - 10;
        const travelDuration = 20;

        const progress = interpolate(
          pFrame,
          [0, travelDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        const px = interpolate(progress, [0, 1], [particle.startX, device.shieldX]);
        const py = interpolate(progress, [0, 1], [-50, targetY]);

        // Particle has arrived
        const hasArrived = pFrame >= travelDuration;

        if (hasArrived && particle.isCaught) {
          // Green catch flash
          const catchProgress = interpolate(
            pFrame,
            [travelDuration, travelDuration + 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: device.shieldX - 10,
                top: targetY - 10,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: COLORS.solutionGreen,
                opacity: interpolate(catchProgress, [0, 1], [1, 0]),
                transform: `scale(${interpolate(catchProgress, [0, 1], [0.5, 1.5])})`,
              }}
            />
          );
        }

        if (hasArrived && !particle.isCaught) {
          // Red pass-through flash on device
          const hitProgress = interpolate(
            pFrame,
            [travelDuration, travelDuration + 6],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          return (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                left: device.x + 30,
                top: device.y + 30,
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: COLORS.errorRed,
                opacity: interpolate(hitProgress, [0, 1], [0.8, 0]),
                transform: `scale(${interpolate(hitProgress, [0, 1], [0.5, 2])})`,
              }}
            />
          );
        }

        // Travelling particle
        return (
          <React.Fragment key={particle.id}>
            {/* Trail dots */}
            {[0.85, 0.7, 0.55].map((ratio, ti) => {
              const trailProgress = Math.max(0, progress * ratio);
              return (
                <div
                  key={ti}
                  style={{
                    position: 'absolute',
                    left:
                      interpolate(trailProgress, [0, 1], [particle.startX, device.shieldX]) - 2,
                    top:
                      interpolate(trailProgress, [0, 1], [-50, targetY]) - 2,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#C4B5FD',
                    opacity: [0.6, 0.3, 0.1][ti],
                  }}
                />
              );
            })}
            {/* Main dot */}
            <div
              style={{
                position: 'absolute',
                left: px - 2,
                top: py - 2,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: '#C4B5FD',
                boxShadow: '0 0 6px rgba(196,181,253,0.6)',
              }}
            />
          </React.Fragment>
        );
      })}

      {/* IBM Stat Panel */}
      {frame >= BEATS.STAT_PANEL_IN && (
        <div
          style={{
            position: 'absolute',
            bottom: LAYOUT.platformBottomSafe + 60,
            left: (LAYOUT.width - 700) / 2,
            width: 700,
            backgroundColor: COLORS.bgSurface,
            borderRadius: 12,
            border: `1px solid ${COLORS.panelBorder}`,
            padding: '24px 32px',
            opacity: statPanelOpacity * holdDim,
            transform: `translateY(${statPanelY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <CountUpWithLabel
            to={1}
            from={0}
            startFrame={BEATS.COUNTUP_START}
            duration={30}
            label="BIT FLIP PER MONTH"
            labelPosition="bottom"
            fontSize={64}
            color={COLORS.insightOrange}
            labelColor={COLORS.textMuted}
            labelFontSize={24}
          />
          {frame >= BEATS.IBM_LABEL && (
            <AnimatedText
              variant="body"
              size={32}
              color={COLORS.textMuted}
              startFrame={BEATS.IBM_LABEL}
              entrance="fade"
              align="center"
            >
              per 256MB of RAM -- IBM study
            </AnimatedText>
          )}
        </div>
      )}

      {/* ECC Memory text */}
      {showEccText && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 5,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <AnimatedText
              variant="title"
              size={56}
              color={COLORS.solutionGreen}
              startFrame={BEATS.ECC_TEXT_IN}
              springPreset="gentle"
              entrance="slideUp"
              align="center"
            >
              ECC MEMORY
            </AnimatedText>
            {frame >= BEATS.ECC_SUBLABEL && (
              <AnimatedText
                variant="body"
                size={40}
                color={COLORS.textBody}
                startFrame={BEATS.ECC_SUBLABEL}
                entrance="fade"
                align="center"
              >
                Error-Correcting Code
              </AnimatedText>
            )}
          </div>
        </AbsoluteFill>
      )}
    </SceneContainer>
  );
};
