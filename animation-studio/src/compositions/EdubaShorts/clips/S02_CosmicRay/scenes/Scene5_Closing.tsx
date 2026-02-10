import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, GlitchBurst } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, LAYOUT } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  LAST_PARTICLE_START: 15,
  SHIELD_FAIL: 35,
  IMPACT: 45,
  SCREEN_GLITCH: 50,
  ELEMENTS_OUT: 80,
  MOSTLY_IN: 100,
  GLOW_BUILD: 120,
  HOLD: 140,
  FADE_OUT: 195,
};

/** Shield + device remnant from previous scene (simplified) */
const DeviceRemnant: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  // Dim initial elements
  const dimOpacity = interpolate(
    frame,
    [0, BEATS.LAST_PARTICLE_START],
    [0.4, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Fade out after impact
  const fadeOut = interpolate(
    frame,
    [BEATS.ELEMENTS_OUT, BEATS.ELEMENTS_OUT + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (frame >= BEATS.ELEMENTS_OUT + 20) return null;

  // Shield flash red on failure
  const shieldFlash =
    frame >= BEATS.SHIELD_FAIL && frame < BEATS.SHIELD_FAIL + 6;

  return (
    <AbsoluteFill style={{ opacity: dimOpacity * fadeOut }}>
      {/* Simplified device silhouette */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 60,
          top: 960 - 50,
          width: 120,
          height: 80,
          border: `2px solid ${COLORS.textMuted}`,
          borderRadius: 8,
          backgroundColor: 'transparent',
        }}
      />
      {/* Shield arc */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 90,
          top: 960 - 120,
          width: 180,
          height: 90,
          borderRadius: '90px 90px 0 0',
          backgroundColor: shieldFlash
            ? 'rgba(239,68,68,0.3)'
            : 'rgba(16,185,129,0.15)',
          border: `2px solid ${shieldFlash ? COLORS.errorRed : COLORS.solutionGreen}`,
          borderBottom: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Last particle ---
  const particleActive =
    frame >= BEATS.LAST_PARTICLE_START && frame < BEATS.IMPACT + 15;
  const particleProgress = interpolate(
    frame,
    [BEATS.LAST_PARTICLE_START, BEATS.IMPACT],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const particleX = 540; // straight down center
  const particleY = interpolate(particleProgress, [0, 1], [-50, 960]);

  // --- Impact flash ---
  const impactActive = frame >= BEATS.IMPACT && frame < BEATS.IMPACT + 15;
  const impactProgress = interpolate(
    frame,
    [BEATS.IMPACT, BEATS.IMPACT + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const impactScale = interpolate(impactProgress, [0, 0.3, 1], [0, 3, 0]);
  const impactOpacity = interpolate(impactProgress, [0, 0.2, 1], [1, 0.8, 0]);

  // Ring ripple on impact
  const rippleRadius = interpolate(impactProgress, [0, 1], [0, 60]);
  const rippleOpacity = interpolate(impactProgress, [0, 1], [1, 0]);

  // --- Screen glitch bands ---
  const glitchActive =
    frame >= BEATS.SCREEN_GLITCH && frame < BEATS.SCREEN_GLITCH + 10;

  // Deterministic glitch band positions
  const glitchBands = [
    { y: 320, shift: 10, color: COLORS.errorRed },
    { y: 780, shift: -10, color: COLORS.aiPurple },
    { y: 1400, shift: 8, color: COLORS.errorRed },
  ];

  // --- Background transition from navy to dark ---
  const bgTransition = interpolate(
    frame,
    [BEATS.ELEMENTS_OUT, BEATS.ELEMENTS_OUT + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Use interpolated background color (navy -> dark)
  // We handle this by layering
  const bgColor = frame < BEATS.ELEMENTS_OUT ? COLORS.bgNavy : COLORS.bg;

  // --- "Mostly." text ---
  const showMostly = frame >= BEATS.MOSTLY_IN;

  // Glow build behind text
  const glowOpacity = interpolate(
    frame,
    [BEATS.GLOW_BUILD, BEATS.GLOW_BUILD + 20],
    [0, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Glow breathing during hold
  const glowBreath =
    frame >= BEATS.HOLD
      ? Math.sin(frame * 0.07) * 0.075 + 0.275
      : glowOpacity;

  // Final fade to black
  const finalFade = interpolate(
    frame,
    [BEATS.FADE_OUT, 210],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Navy background layer that fades out */}
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgNavy,
          opacity: interpolate(
            frame,
            [BEATS.ELEMENTS_OUT, BEATS.ELEMENTS_OUT + 20],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          ),
        }}
      />

      {/* Main content with final fade */}
      <AbsoluteFill style={{ opacity: finalFade }}>
        {/* Device remnant from previous scene */}
        <DeviceRemnant frame={frame} fps={fps} />

        {/* Last particle */}
        {particleActive && frame < BEATS.IMPACT && (
          <div
            style={{
              position: 'absolute',
              left: particleX - 4,
              top: particleY - 4,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(196,181,253,0.5)',
            }}
          />
        )}

        {/* Trail dots for last particle */}
        {particleActive && frame < BEATS.IMPACT && (
          <>
            {[0.85, 0.7, 0.55].map((ratio, i) => {
              const trailY = interpolate(
                particleProgress * ratio,
                [0, 1],
                [-50, 960],
              );
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: particleX - 2,
                    top: trailY - 2,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    opacity: [0.7, 0.4, 0.15][i],
                  }}
                />
              );
            })}
          </>
        )}

        {/* Impact flash */}
        {impactActive && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 540 - 20,
                top: 960 - 20,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FBBF24',
                opacity: impactOpacity,
                transform: `scale(${impactScale})`,
              }}
            />
            {/* Ring ripple */}
            <div
              style={{
                position: 'absolute',
                left: 540 - rippleRadius,
                top: 960 - rippleRadius,
                width: rippleRadius * 2,
                height: rippleRadius * 2,
                borderRadius: '50%',
                border: `2px solid ${COLORS.errorRed}`,
                opacity: rippleOpacity,
              }}
            />
          </>
        )}

        {/* Device glitch burst on impact */}
        {frame >= BEATS.IMPACT && frame < BEATS.ELEMENTS_OUT && (
          <div
            style={{
              position: 'absolute',
              left: 540 - 60,
              top: 960 - 30,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <GlitchBurst
              startFrame={BEATS.IMPACT}
              burstDuration={20}
              burstInterval={999}
              intensity={0.6}
              color={COLORS.textMuted}
              fontSize={48}
              fontWeight={400}
              fontFamily="Inter, sans-serif"
            >
              {'[  ]'}
            </GlitchBurst>
          </div>
        )}

        {/* Screen glitch bands */}
        {glitchActive &&
          glitchBands.map((band, i) => {
            const bandFrame = frame - BEATS.SCREEN_GLITCH;
            // Each band appears for only 3 frames
            const bandVisible =
              bandFrame >= i * 3 && bandFrame < i * 3 + 3;
            if (!bandVisible) return null;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: band.shift,
                  top: band.y,
                  width: LAYOUT.width,
                  height: 40,
                  backgroundColor: band.color,
                  opacity: 0.1,
                }}
              />
            );
          })}

        {/* "Mostly." closing text */}
        {showMostly && (
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: LAYOUT.safePadding,
            }}
          >
            <div
              style={{
                textShadow:
                  frame >= BEATS.GLOW_BUILD
                    ? `0 0 40px rgba(139,92,246,${glowBreath})`
                    : 'none',
              }}
            >
              <BlurText
                startFrame={BEATS.MOSTLY_IN}
                animateBy="words"
                direction="bottom"
                blurAmount={15}
                distance={40}
                fontSize={72}
                fontWeight={600}
                color={COLORS.textPrimary}
              >
                Mostly.
              </BlurText>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
