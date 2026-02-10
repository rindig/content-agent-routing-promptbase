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

// ── Frame markers (relative to scene start = 0, global 900) ──
const BEATS = {
  ELEMENTS_FADE: 0,
  PAUSE: 30,
  LINE_1_IN: 40,
  LINE_2_IN: 90,
  LINE_3_IN: 120,
  HOLD_START: 160,
  SCENE_END: 240,
};

// ── Radial glow behind the insightOrange text ──
const InsightGlow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.LINE_3_IN;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const opacity = interpolate(progress, [0, 1], [0, 0.04]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        width: 600,
        height: 600,
        transform: 'translate(-50%, -50%)',
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
      fadeInDuration={20}
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
          gap: 28,
        }}
      >
        {/* Radial glow */}
        <InsightGlow frame={frame} fps={fps} />

        {/* Closing text lines */}
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
          {/* Line 1: "The technology is real." */}
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
              The technology is real.
            </BlurText>
          )}

          {/* Line 2: "The marketing is about three years" */}
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
              The marketing is about three years
            </BlurText>
          )}

          {/* Line 3: "ahead of the reality." */}
          {showLine3 && (
            <BlurText
              startFrame={BEATS.LINE_3_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={4}
              blurAmount={8}
              distance={20}
              fontSize={44}
              fontWeight={600}
              color={COLORS.insightOrange}
            >
              ahead of the reality.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
