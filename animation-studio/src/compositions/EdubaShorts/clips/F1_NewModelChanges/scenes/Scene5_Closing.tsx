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

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  FADE_COMPLETE: 0,
  PAUSE: 20,
  LINE_1_IN: 40,
  LINE_2_IN: 90,
  LINE_3_IN: 130,
  HOLD_START: 180,
  GLOW_IN: 180,
  SCENE_END: 240,
};

// ── Radial glow background ──
const RadialGlow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
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
        bottom: '35%',
        left: '50%',
        transform: 'translate(-50%, 50%)',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.techBlue}, transparent 70%)`,
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
    <SceneContainer background="dark" fadeIn fadeInDuration={20}>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 28,
        }}
      >
        {/* Radial glow behind closing text */}
        <RadialGlow frame={frame} fps={fps} />

        {/* Closing text — 3 lines */}
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
          {/* Line 1: "If swapping the model breaks everything," */}
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
              color={COLORS.textBody}
            >
              If swapping the model breaks everything,
            </BlurText>
          )}

          {/* Line 2: "the model isn't the problem." */}
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
              color={COLORS.textPrimary}
            >
              {"the model isn't the problem."}
            </BlurText>
          )}

          {/* Line 3: "The system is." */}
          {showLine3 && (
            <BlurText
              startFrame={BEATS.LINE_3_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={4}
              blurAmount={8}
              distance={20}
              fontSize={48}
              fontWeight={700}
              color={COLORS.techBlue}
            >
              The system is.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
