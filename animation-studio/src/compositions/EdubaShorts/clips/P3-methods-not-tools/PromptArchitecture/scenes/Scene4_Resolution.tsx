import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { Vignette } from '../../../../../Memory/components/AmbientBackground';
import { ShinyText, GlitchBurst } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

/**
 * Scene 4: Resolution — "Methods Transfer" (local frames 0–240)
 * Global frames 660–900; subtract 660 from spec BEATS.
 */

const BEATS = {
  LOGOS_PULSE: 0,            // global 660
  ELEMENTS_FADE_OUT: 30,     // global 690
  BREATHING_ROOM: 60,        // global 720
  METHODS_IN: 80,            // global 740
  METHODS_GLOW: 85,          // global 745
  METHODS_SHINE: 88,         // global 748
  TRANSFER_IN: 95,           // global 755
  DIVIDER_DRAW: 130,         // global 790
  TRICKS_TEXT_IN: 140,       // global 800
  GLITCH_BURST: 150,         // global 810
  DONT_IN: 155,              // global 815
  STRIKETHROUGH_DRAW: 170,   // global 830
  TRICKS_DIM: 175,           // global 835
  ALL_FADE_OUT: 200,         // global 860
  GLOW_FADE: 210,            // global 870
  SCENE_END: 240,            // global 900
};

export const Scene4_Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Methods" entrance
  const methodsEntrance = spring({
    frame: frame - BEATS.METHODS_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const methodsScale = frame >= BEATS.METHODS_IN
    ? interpolate(methodsEntrance, [0, 1], [0.5, 1]) : 0;
  const methodsOpacity = frame >= BEATS.METHODS_IN
    ? interpolate(methodsEntrance, [0, 1], [0, 1]) : 0;

  // Radial glow behind "Methods"
  const glowOpacity = frame >= BEATS.METHODS_GLOW
    ? interpolate(frame, [BEATS.METHODS_GLOW, BEATS.METHODS_GLOW + 20], [0, 0.06], { extrapolateRight: 'clamp' })
    : 0;
  const glowFadeOpacity = frame >= BEATS.GLOW_FADE
    ? interpolate(frame, [BEATS.GLOW_FADE, BEATS.GLOW_FADE + 25], [0.06, 0], { extrapolateRight: 'clamp' })
    : glowOpacity;

  // "transfer." entrance
  const transferEntrance = spring({
    frame: frame - BEATS.TRANSFER_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const transferOpacity = frame >= BEATS.TRANSFER_IN
    ? interpolate(transferEntrance, [0, 1], [0, 1]) : 0;
  const transferY = frame >= BEATS.TRANSFER_IN
    ? interpolate(transferEntrance, [0, 1], [20, 0]) : 20;

  // Divider line
  const dividerProgress = spring({
    frame: frame - BEATS.DIVIDER_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const dividerWidth = frame >= BEATS.DIVIDER_DRAW
    ? interpolate(dividerProgress, [0, 1], [0, 600]) : 0;

  // "Tool-specific tricks" text
  const tricksEntrance = spring({
    frame: frame - BEATS.TRICKS_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const tricksOpacity = frame >= BEATS.TRICKS_TEXT_IN
    ? interpolate(tricksEntrance, [0, 1], [0, 1]) : 0;
  const tricksDimOpacity = frame >= BEATS.TRICKS_DIM
    ? interpolate(frame, [BEATS.TRICKS_DIM, BEATS.TRICKS_DIM + 20], [1, 0.2], { extrapolateRight: 'clamp' })
    : 1;

  // "don't." text
  const dontEntrance = spring({
    frame: frame - BEATS.DONT_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const dontOpacity = frame >= BEATS.DONT_IN
    ? interpolate(dontEntrance, [0, 1], [0, 1]) * tricksDimOpacity : 0;

  // Strikethrough
  const strikeProgress = spring({
    frame: frame - BEATS.STRIKETHROUGH_DRAW,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const strikeWidth = frame >= BEATS.STRIKETHROUGH_DRAW
    ? interpolate(strikeProgress, [0, 1], [0, 420]) : 0;

  // All fade out
  const allFadeOpacity = frame >= BEATS.ALL_FADE_OUT
    ? interpolate(frame, [BEATS.ALL_FADE_OUT, BEATS.ALL_FADE_OUT + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Vignette intensity={0.4} />

      {/* Radial glow behind "Methods" */}
      <div
        style={{
          position: 'absolute',
          top: 700 - 175,
          left: 540 - 175,
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
          opacity: glowFadeOpacity * allFadeOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* "Methods" */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 700,
          transform: `translate(-50%, -50%) scale(${methodsScale})`,
          opacity: methodsOpacity * allFadeOpacity,
        }}
      >
        <ShinyText
          startFrame={BEATS.METHODS_SHINE}
          shineColor="#FFFFFF"
          duration={50}
          fontSize={72}
        >
          Methods
        </ShinyText>
      </div>

      {/* "transfer." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 800,
          transform: `translate(-50%, -50%) translateY(${transferY}px)`,
          opacity: transferOpacity * allFadeOpacity,
          fontFamily: TYPOGRAPHY.title.fontFamily,
          fontWeight: 600,
          fontSize: 52,
          color: COLORS.solutionGreen,
        }}
      >
        transfer.
      </div>

      {/* Horizontal divider */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 920,
          transform: 'translateX(-50%)',
          width: dividerWidth,
          height: 2,
          backgroundColor: COLORS.bgSurfaceAlt,
          opacity: allFadeOpacity,
        }}
      />

      {/* "Tool-specific tricks" with glitch and strikethrough */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 960,
          transform: 'translate(-50%, -50%)',
          opacity: tricksOpacity * tricksDimOpacity * allFadeOpacity,
        }}
      >
        <div style={{ position: 'relative' }}>
          {frame >= BEATS.GLITCH_BURST ? (
            <GlitchBurst
              startFrame={BEATS.GLITCH_BURST}
              burstDuration={12}
              burstInterval={60}
              fontSize={48}
              color={COLORS.textDim}
            >
              Tool-specific tricks
            </GlitchBurst>
          ) : (
            <div
              style={{
                fontFamily: TYPOGRAPHY.title.fontFamily,
                fontWeight: 600,
                fontSize: 48,
                color: COLORS.textDim,
              }}
            >
              Tool-specific tricks
            </div>
          )}

          {/* Strikethrough */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: strikeWidth,
              height: 2,
              backgroundColor: COLORS.errorRed,
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      {/* "don't." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1040,
          transform: 'translate(-50%, -50%)',
          opacity: dontOpacity * allFadeOpacity,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 400,
          fontSize: 44,
          color: COLORS.errorRed,
        }}
      >
        don&apos;t.
      </div>
    </AbsoluteFill>
  );
};
