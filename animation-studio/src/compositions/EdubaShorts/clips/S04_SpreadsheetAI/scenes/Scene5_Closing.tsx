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

const BEATS = {
  FADE_IN: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 45,
  HOLD_START: 80,
  FADE_OUT: 180,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from black
  const fadeInOpacity = interpolate(
    frame,
    [BEATS.FADE_IN, BEATS.FADE_IN + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ambient glow pulse behind text
  const glowPulseOpacity = frame >= BEATS.HOLD_START
    ? 0.03 + 0.03 * Math.sin((frame - BEATS.HOLD_START) * (Math.PI / 30))
    : 0;

  // Final fade out
  const fadeOutOpacity = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 60],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
          opacity: fadeInOpacity * fadeOutOpacity,
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 800,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(245,158,11,${glowPulseOpacity}) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Closing text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 860,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Line 1: "We just didn't call it AI" */}
          {frame >= BEATS.LINE_1_IN && (
            <BlurText
              startFrame={0}
              animateBy="words"
              staggerDelay={3}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
              direction="bottom"
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                lineHeight: 1.3,
              }}
            >
              We just didn't call it AI
            </BlurText>
          )}

          {/* Line 2: "because it wasn't impressive enough yet." */}
          {frame >= BEATS.LINE_2_IN && (
            <BlurText
              startFrame={0}
              animateBy="words"
              staggerDelay={3}
              fontSize={44}
              fontWeight={600}
              color={COLORS.insightOrange}
              direction="bottom"
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                lineHeight: 1.3,
              }}
            >
              because it wasn't impressive enough yet.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
