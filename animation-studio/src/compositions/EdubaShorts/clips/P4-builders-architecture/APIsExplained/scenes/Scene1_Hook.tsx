import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
} from '../../../../../Memory/components/AmbientBackground';
import { GlitchText, ShinyText, BlurText } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

/**
 * Scene 1: Hook (local frames 0–90, global 0–90)
 * "An API is just a menu for software."
 */

const BEATS = {
  BREATHING_ROOM: 0,
  API_GLITCH_IN: 15,
  SHINE_SWEEP: 35,
  GLITCH_FADE: 45,
  API_SHRINK_UP: 45,
  MENU_TEXT_IN: 55,
  UNDERLINE_DRAW: 65,
  GLOW_IN: 75,
  SCENE_END: 90,
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glitch intensity fades from 0.8 to 0
  const glitchIntensity = frame >= BEATS.GLITCH_FADE
    ? interpolate(frame, [BEATS.GLITCH_FADE, BEATS.GLITCH_FADE + 10], [0.8, 0], { extrapolateRight: 'clamp' })
    : frame >= BEATS.API_GLITCH_IN ? 0.8 : 0;

  // API text dims and shrinks up
  const shrinkProgress = spring({
    frame: frame - BEATS.API_SHRINK_UP,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const apiOpacity = frame >= BEATS.API_SHRINK_UP
    ? interpolate(shrinkProgress, [0, 1], [1, 0.5])
    : frame >= BEATS.API_GLITCH_IN ? 1 : 0;
  const apiScale = frame >= BEATS.API_SHRINK_UP
    ? interpolate(shrinkProgress, [0, 1], [1, 0.7])
    : 1;
  const apiY = frame >= BEATS.API_SHRINK_UP
    ? interpolate(shrinkProgress, [0, 1], [850, 550])
    : 850;

  // "= a menu for software" BlurText
  const menuVisible = frame >= BEATS.MENU_TEXT_IN;

  // Underline draw
  const underlineProgress = spring({
    frame: frame - BEATS.UNDERLINE_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const underlineWidth = frame >= BEATS.UNDERLINE_DRAW
    ? interpolate(underlineProgress, [0, 1], [0, 700])
    : 0;

  // Radial glow behind "menu"
  const glowOpacity = frame >= BEATS.GLOW_IN
    ? interpolate(frame, [BEATS.GLOW_IN, BEATS.GLOW_IN + 15], [0, 0.05], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.insightOrange}
      />
      <Vignette intensity={0.5} />

      {/* "API" glitch text */}
      {frame >= BEATS.API_GLITCH_IN && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: apiY,
            transform: `translate(-50%, -50%) scale(${apiScale})`,
            opacity: apiOpacity,
          }}
        >
          {glitchIntensity > 0 ? (
            <GlitchText
              startFrame={BEATS.API_GLITCH_IN}
              intensity={glitchIntensity}
              speed={4}
              fontSize={96}
              color={COLORS.techBlue}
              enableShadows={true}
            >
              API
            </GlitchText>
          ) : (
            <div
              style={{
                fontFamily: TYPOGRAPHY.hero.fontFamily,
                fontWeight: 700,
                fontSize: 96,
                color: COLORS.techBlue,
              }}
            >
              API
            </div>
          )}
        </div>
      )}

      {/* "= a menu for software" */}
      {menuVisible && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 780,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <BlurText
            startFrame={BEATS.MENU_TEXT_IN}
            animateBy="words"
            direction="bottom"
            staggerDelay={5}
            blurAmount={10}
            distance={25}
            fontSize={52}
            color={COLORS.insightOrange}
          >
            = a menu for software
          </BlurText>
        </div>
      )}

      {/* Radial glow behind "menu" */}
      <div
        style={{
          position: 'absolute',
          top: 780 - 100,
          left: 540 - 100,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Underline */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 840,
          transform: 'translateX(-50%)',
          width: underlineWidth,
          height: 2,
          backgroundColor: COLORS.insightOrange,
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
