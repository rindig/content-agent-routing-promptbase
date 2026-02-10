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

// ── Frame markers (relative to scene start = frame 840 global, 0 local) ──
const BEATS = {
  ELEMENTS_FADE: 0,
  PAUSE: 20,
  LINE_1_IN: 30,
  LINE_2_IN: 80,
  LINE_3_IN: 120,
  HOLD_START: 160,
  GLOW_IN: 160,
  SCENE_END: 210,
};

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;
  const showLine3 = frame >= BEATS.LINE_3_IN;

  // Radial glow behind "the abstraction"
  const glowFrame = frame - BEATS.GLOW_IN;
  const glowOpacity = glowFrame >= 0
    ? interpolate(glowFrame, [0, 30], [0, 0.05], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 20,
          position: 'relative',
        }}
      >
        {/* Radial glow behind the abstraction */}
        {glowOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.techBlue} 0%, transparent 70%)`,
              opacity: glowOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Line 1: "The developers who thrive" */}
        {showLine1 && (
          <div style={{ textAlign: 'center', maxWidth: 860 }}>
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
              The developers who thrive
            </BlurText>
          </div>
        )}

        {/* Line 2: "understand what's beneath" */}
        {showLine2 && (
          <div style={{ textAlign: 'center', maxWidth: 860 }}>
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
              understand what's beneath
            </BlurText>
          </div>
        )}

        {/* Line 3: "the abstraction." */}
        {showLine3 && (
          <div style={{ textAlign: 'center', maxWidth: 860 }}>
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
              the abstraction.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
