import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  MINI_PLATFORM: 5,
  MINI_FALL: 15,
  MINI_FADE_OUT: 30,
  LINE_1_IN: 50,
  LINE_2_IN: 70,
  SUBTITLE_IN: 100,
  GLOW_BUILD: 100,
  HOLD: 130,
  BG_PARTICLE: 140,
  FADE_OUT: 195,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Mini platform vignette ---
  const miniVisible = frame < BEATS.MINI_FADE_OUT + 15;
  const miniFadeOut = interpolate(
    frame,
    [BEATS.MINI_FADE_OUT, BEATS.MINI_FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Mini character fall
  const miniFalling = frame >= BEATS.MINI_FALL;
  const miniFallProgress = miniFalling
    ? interpolate(
        frame,
        [BEATS.MINI_FALL, BEATS.MINI_FALL + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;
  const miniFallDistance = Easing.in(Easing.quad)(miniFallProgress) * 120;
  const miniCharVisible = miniFallDistance < 100;

  // --- Purple glow behind text ---
  const glowProgress = interpolate(
    frame,
    [BEATS.GLOW_BUILD, BEATS.GLOW_BUILD + 30],
    [0, 0.25],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Breathing glow during hold
  const glowBreathing = frame >= BEATS.HOLD
    ? 0.2 + Math.sin((frame - BEATS.HOLD) * (2 * Math.PI / 80)) * 0.05 + 0.05
    : glowProgress;

  // --- Subtitle entrance ---
  const subtitleProgress = spring({
    frame: frame - BEATS.SUBTITLE_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleProgress, [0, 1], [15, 0]);

  // --- Background particle (subtle) ---
  const bgParticleVisible = frame >= BEATS.BG_PARTICLE && frame < BEATS.BG_PARTICLE + 60;
  const bgParticleProgress = bgParticleVisible
    ? interpolate(
        frame,
        [BEATS.BG_PARTICLE, BEATS.BG_PARTICLE + 60],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;
  const bgParticleX = interpolate(bgParticleProgress, [0, 1], [100, 900]);
  const bgParticleY = interpolate(bgParticleProgress, [0, 1], [200, 350]);

  // --- Fade out ---
  const fadeOutOpacity = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
          opacity: fadeOutOpacity,
        }}
      >
        {/* --- Mini platform vignette (background) --- */}
        {miniVisible && (
          <div
            style={{
              position: 'absolute',
              top: 250,
              left: '50%',
              transform: 'translate(-50%, -50%) scale(0.3)',
              opacity: miniFadeOut * 0.7,
              pointerEvents: 'none',
            }}
          >
            {/* Platform */}
            <div
              style={{
                width: 400,
                height: 16,
                backgroundColor: COLORS.solutionGreen,
                borderRadius: 4,
                position: 'relative',
              }}
            >
              {/* Character */}
              {frame >= BEATS.MINI_PLATFORM && miniCharVisible && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: `translate(-50%, ${-60 + miniFallDistance}px)`,
                    transformOrigin: 'center bottom',
                  }}
                >
                  {/* Head */}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: COLORS.errorRed,
                      margin: '0 auto',
                      marginBottom: -2,
                    }}
                  />
                  {/* Body */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: COLORS.errorRed,
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Background particle trail (subtle) --- */}
        {bgParticleVisible && (
          <>
            {[0.15, 0.1, 0.06, 0.03].map((opacity, i) => {
              const trailDelay = (i + 1) * 6;
              const trailFrame = frame - BEATS.BG_PARTICLE - trailDelay;
              if (trailFrame < 0) return null;
              const trailProgress = interpolate(
                trailFrame,
                [0, 60 - trailDelay],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <div
                  key={`bgt-${i}`}
                  style={{
                    position: 'absolute',
                    left: interpolate(trailProgress, [0, 1], [100, 900]),
                    top: interpolate(trailProgress, [0, 1], [200, 350]),
                    width: 3,
                    height: 3,
                    borderRadius: '50%',
                    backgroundColor: COLORS.particleTrail,
                    opacity,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                />
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: bgParticleX,
                top: bgParticleY,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: COLORS.particleTrail,
                opacity: 0.15,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 6px ${COLORS.particleTrail}`,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* --- Closing text --- */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            maxWidth: 860,
            textAlign: 'center',
            textShadow: glowBreathing > 0
              ? `0 0 35px rgba(139,92,246,${glowBreathing})`
              : 'none',
          }}
        >
          {/* Line 1 */}
          {frame >= BEATS.LINE_1_IN && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={12}
              distance={30}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              The universe is always throwing
            </BlurText>
          )}

          {/* Line 2 */}
          {frame >= BEATS.LINE_2_IN && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={12}
              distance={30}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              particles at your computer.
            </BlurText>
          )}

          {/* Subtitle */}
          {frame >= BEATS.SUBTITLE_IN && (
            <div
              style={{
                marginTop: 20,
                opacity: subtitleOpacity,
                transform: `translateY(${subtitleY}px)`,
              }}
            >
              <AnimatedText
                variant="body"
                size={40}
                color={COLORS.textBody}
                startFrame={BEATS.SUBTITLE_IN}
                springPreset="slow"
                entrance="fade"
                align="center"
              >
                Your computer is usually fast enough to catch them.
              </AnimatedText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
