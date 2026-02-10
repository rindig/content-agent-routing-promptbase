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
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 45,
  HOLD: 75,
  FADE_OUT: 180,
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;

  // Radial glow pulse
  const glowOpacity =
    frame >= BEATS.HOLD
      ? 0.04 + 0.02 * Math.sin(((frame - BEATS.HOLD) * Math.PI * 2) / 90)
      : 0;

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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        {frame >= BEATS.HOLD && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.aiPurple} 0%, transparent 70%)`,
              opacity: glowOpacity,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
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
          }}
        >
          {/* Line 1: "One is a language problem." */}
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.aiPurple}
            >
              One is a language problem.
            </BlurText>
          )}

          {/* Line 2: "The other isn't." */}
          {showLine2 && (
            <BlurText
              startFrame={BEATS.LINE_2_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={8}
              fontSize={44}
              fontWeight={600}
              color="#FFFFFF"
            >
              {"The other isn't."}
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
