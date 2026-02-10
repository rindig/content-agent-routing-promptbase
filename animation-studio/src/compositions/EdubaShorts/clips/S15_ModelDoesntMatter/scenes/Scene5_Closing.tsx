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

// ── Frame markers (relative to scene start) ──
const BEATS = {
  ENGINE_FADE: 0,
  PAUSE: 20,
  LINE_1_IN: 40,
  LINE_2_IN: 100,
  HOLD_START: 160,
  GLOW_IN: 160,
  SCENE_END: 240,
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Show lines
  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;

  // Ambient glow behind second line
  const showGlow = frame >= BEATS.GLOW_IN;
  const glowProgress = spring({
    frame: Math.max(0, frame - BEATS.GLOW_IN),
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.05]);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={220}
      fadeOutDuration={20}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Ambient glow */}
        {showGlow && (
          <div
            style={{
              position: 'absolute',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
              opacity: glowOpacity,
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Closing text container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            maxWidth: 860,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Line 1: "The model is one component." */}
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
              The model is one component.
            </BlurText>
          )}

          {/* Line 2: "The system is the product." */}
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
              color={COLORS.insightOrange}
            >
              The system is the product.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
