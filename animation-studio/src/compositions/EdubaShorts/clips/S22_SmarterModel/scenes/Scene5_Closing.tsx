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

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 42,
  LINE_3_IN: 54,
  HOLD: 80,
  FADE_OUT: 180,
};

// ── Gradient glow background ──
const GradientGlow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.HOLD;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 0.03]);

  return (
    <>
      {/* techBlue glow upper-left */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '60%',
          background: `radial-gradient(ellipse at 20% 20%, ${COLORS.techBlue}, transparent 70%)`,
          opacity,
          pointerEvents: 'none',
        }}
      />
      {/* errorRed glow lower-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '60%',
          height: '60%',
          background: `radial-gradient(ellipse at 80% 80%, ${COLORS.errorRed}, transparent 70%)`,
          opacity,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;
  const showLine3 = frame >= BEATS.LINE_3_IN;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={60}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
        }}
      >
        {/* Gradient glow background */}
        <GradientGlow frame={frame} fps={fps} />

        {/* Closing text — 3 lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            maxWidth: 860,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Line 1: "The gap between 'fewer errors'" */}
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={10}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.techBlue}
            >
              The gap between &apos;fewer errors&apos;
            </BlurText>
          )}

          {/* Line 2: "and 'actual understanding'" */}
          {showLine2 && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={10}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              and &apos;actual understanding&apos;
            </BlurText>
          )}

          {/* Line 3: "is where most AI disappointment lives." */}
          {showLine3 && (
            <BlurText
              startFrame={BEATS.LINE_3_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={10}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.errorRed}
            >
              is where most AI disappointment lives.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
