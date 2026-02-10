import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 45,
  GLOW_IN: 80,
  HOLD: 90,
  FADE_OUT: 240,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade: previous scene fades out, this fades in
  const crossfadeOpacity = interpolate(
    frame,
    [BEATS.CROSSFADE, BEATS.CROSSFADE + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Glow behind text
  const glowProgress = spring({
    frame: frame - BEATS.GLOW_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const baseGlowOpacity = interpolate(glowProgress, [0, 1], [0, 0.04]);

  // Gentle glow pulse (sinusoidal, 0.03 to 0.06, period 90 frames)
  const glowPulse = frame >= BEATS.HOLD
    ? 0.03 + 0.03 * Math.sin(((frame - BEATS.HOLD) / 90) * Math.PI * 2)
    : baseGlowOpacity;

  const finalGlowOpacity = frame >= BEATS.HOLD ? glowPulse : baseGlowOpacity;

  return (
    <SceneContainer
      background="dark"
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={60}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 16,
          opacity: crossfadeOpacity,
          position: 'relative',
        }}
      >
        {/* Radial glow behind text */}
        {frame >= BEATS.GLOW_IN && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.solutionGreen} 0%, transparent 70%)`,
              opacity: finalGlowOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Line 1 */}
        {frame >= BEATS.LINE_1_IN && (
          <div style={{ maxWidth: 860, textAlign: 'center' }}>
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              AI needs that same infrastructure.
            </BlurText>
          </div>
        )}

        {/* Line 2 */}
        {frame >= BEATS.LINE_2_IN && (
          <div style={{ maxWidth: 860, textAlign: 'center' }}>
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              fontSize={44}
              fontWeight={600}
              color={COLORS.solutionGreen}
            >
              {"It's being built."}
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
