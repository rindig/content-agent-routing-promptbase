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
  CROSSFADE: 0,
  LINE_1_IN: 30,
  LINE_2_IN: 42,
  HOLD: 80,
  FADE_OUT: 150,
};

export const Scene4_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade: previous content fades out
  const crossfadeOpacity = interpolate(
    frame,
    [BEATS.CROSSFADE, BEATS.CROSSFADE + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Radial glow pulse behind text
  const glowPulse = frame >= BEATS.HOLD
    ? 0.04 + 0.02 * Math.sin((frame - BEATS.HOLD) * (Math.PI * 2 / 90))
    : 0;

  // Final fade out
  const fadeOut = interpolate(
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
          opacity: crossfadeOpacity * fadeOut,
          position: 'relative',
        }}
      >
        {/* Radial glow */}
        {frame >= BEATS.HOLD && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(245,158,11,${glowPulse}) 0%, transparent 70%)`,
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
            gap: 12,
            maxWidth: 860,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Line 1: "Every generation makes" */}
          {frame >= BEATS.LINE_1_IN && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={8}
              distance={20}
              fontSize={44}
            >
              Every generation makes
            </BlurText>
          )}

          {/* Line 2: "the hard part invisible." in insightOrange */}
          {frame >= BEATS.LINE_2_IN && (
            <div style={{ color: COLORS.insightOrange }}>
              <BlurText
                startFrame={BEATS.LINE_2_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={3}
                blurAmount={8}
                distance={20}
                fontSize={44}
              >
                the hard part invisible.
              </BlurText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
