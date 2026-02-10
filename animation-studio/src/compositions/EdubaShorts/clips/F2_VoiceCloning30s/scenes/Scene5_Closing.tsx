import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  ELEMENTS_FADE: 0,
  PAUSE: 15,
  LINE_1_IN: 30,
  LINE_2_IN: 80,
  LINE_3_IN: 120,
  HOLD_START: 160,
  GLOW_IN: 160,
  SCENE_END: 210,
};

// ── Radial Glow ──
const RadialGlow: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.GLOW_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 0.05]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30%',
        left: '50%',
        transform: 'translate(-50%, 50%)',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.insightOrange}, transparent 70%)`,
        opacity,
        pointerEvents: 'none',
      }}
    />
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
      fadeInDuration={15}
      fadeOut
      fadeOutStart={BEATS.SCENE_END - 30}
      fadeOutDuration={30}
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
          gap: 32,
        }}
      >
        {/* Radial glow behind last line */}
        <RadialGlow frame={frame} fps={fps} />

        {/* Closing lines container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
            maxWidth: 860,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Line 1: "Powerful tools need infrastructure." */}
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={4}
              blurAmount={8}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              Powerful tools need infrastructure.
            </BlurText>
          )}

          {/* Line 2: "The trust layer is the last thing we build." */}
          {showLine2 && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={4}
              blurAmount={8}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textBody}
            >
              The trust layer is the last thing we build.
            </BlurText>
          )}

          {/* Line 3: "But it's the most important." — ShinyText + insightOrange */}
          {showLine3 && (
            <ShinyText
              startFrame={BEATS.LINE_3_IN}
              color={COLORS.insightOrange}
              shineColor="#FFFFFF"
              duration={90}
              pauseDuration={0}
              direction="left"
              fontSize={44}
            >
              But it's the most important.
            </ShinyText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
