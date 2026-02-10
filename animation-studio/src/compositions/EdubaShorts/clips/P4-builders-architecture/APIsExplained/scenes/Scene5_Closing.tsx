import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { Vignette } from '../../../../../Memory/components/AmbientBackground';
import { BlurText } from '../../../../../../components/core/effects';
import { COLORS } from '../../../../constants';

/**
 * Scene 5: Closing (local frames 0–240, global 900–1140)
 *
 * Standard closing: breathing room → BlurText lines → radial glow → 2s hold.
 */

const BEATS = {
  BREATHING_ROOM: 0,
  VIGNETTE_IN: 20,
  LINE_1_START: 40,
  LINE_2_START: 100,
  LINE_3_START: 140,
  GLOW_IN: 160,
  HOLD_START: 180,
  SCENE_END: 240,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();

  // Vignette fade in
  const vignetteOpacity = interpolate(
    frame,
    [BEATS.VIGNETTE_IN, BEATS.VIGNETTE_IN + 20],
    [0, 0.4],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // Radial glow behind accent line
  const glowOpacity = interpolate(
    frame,
    [BEATS.GLOW_IN, BEATS.GLOW_IN + 20],
    [0, 0.04],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Vignette intensity={vignetteOpacity} />

      {/* Line 1: "The internet runs on software" */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 800,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <BlurText
          startFrame={BEATS.LINE_1_START}
          animateBy="words"
          direction="bottom"
          staggerDelay={4}
          blurAmount={8}
          distance={30}
          fontSize={44}
          color={COLORS.textBody}
        >
          The internet runs on software
        </BlurText>
      </div>

      {/* Radial glow behind Line 2 */}
      <div
        style={{
          position: 'absolute',
          top: 880 - 200,
          left: 540 - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Line 2: "politely asking other software for things." — accent */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 880,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <BlurText
          startFrame={BEATS.LINE_2_START}
          animateBy="words"
          direction="bottom"
          staggerDelay={4}
          blurAmount={8}
          distance={30}
          fontSize={48}
          color={COLORS.insightOrange}
        >
          politely asking other software for things.
        </BlurText>
      </div>

      {/* Line 3: "That's all an API is." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 980,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <BlurText
          startFrame={BEATS.LINE_3_START}
          animateBy="words"
          direction="bottom"
          staggerDelay={4}
          blurAmount={8}
          distance={30}
          fontSize={40}
          color={COLORS.textMuted}
        >
          That's all an API is.
        </BlurText>
      </div>
    </AbsoluteFill>
  );
};
