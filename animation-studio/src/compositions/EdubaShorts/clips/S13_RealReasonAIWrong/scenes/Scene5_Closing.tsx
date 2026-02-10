import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 50,
  HOLD: 80,
  FADE_OUT: 180,
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade in
  const crossfadeOpacity = interpolate(
    frame,
    [BEATS.CROSSFADE, BEATS.CROSSFADE + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out
  const fadeOutOpacity = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 60],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Dual glow pulse
  const glowPhase = frame >= BEATS.HOLD
    ? Math.sin((frame - BEATS.HOLD) * (Math.PI * 2 / 90))
    : 0;
  const orangeGlow = interpolate(glowPhase, [-1, 1], [0.02, 0.06]);
  const redGlow = interpolate(glowPhase, [-1, 1], [0.01, 0.05]);

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;

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
          width: '100%',
          height: '100%',
          opacity: crossfadeOpacity * fadeOutOpacity,
          position: 'relative',
        }}
      >
        {/* Dual glow backgrounds */}
        {frame >= BEATS.HOLD && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: `radial-gradient(ellipse at center, ${COLORS.insightOrange} 0%, transparent 70%)`,
                opacity: orangeGlow,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: `radial-gradient(ellipse at center, ${COLORS.errorRed} 0%, transparent 70%)`,
                opacity: redGlow,
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Closing text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            maxWidth: 860,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.insightOrange}
            >
              Confidence is a signal of pattern strength.
            </BlurText>
          )}

          {showLine2 && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={8}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              Not correctness.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
