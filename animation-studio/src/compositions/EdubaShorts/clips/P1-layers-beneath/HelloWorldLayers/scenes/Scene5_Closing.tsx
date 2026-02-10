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

  // --- Vignette fades in (frames 20–40) ---
  const vignetteOpacity = interpolate(
    frame,
    [BEATS.VIGNETTE_IN, BEATS.VIGNETTE_IN + 20],
    [0, 0.4],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // --- Radial glow behind accent line (frames 160–180) ---
  const glowOpacity = interpolate(
    frame,
    [BEATS.GLOW_IN, BEATS.GLOW_IN + 20],
    [0, 0.04],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Vignette */}
      <Vignette intensity={vignetteOpacity} />

      {/* Line 1: "Every layer of abstraction" at Y:830 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 830,
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
          Every layer of abstraction
        </BlurText>
      </div>

      {/* Radial glow behind Line 2 */}
      <div
        style={{
          position: 'absolute',
          top: 910 - 200,
          left: 540 - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Line 2: "was built to make things simpler." at Y:910 — accent color */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 910,
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
          fontSize={44}
          color={COLORS.insightOrange}
        >
          was built to make things simpler.
        </BlurText>
      </div>

      {/* Line 3: "AI is just the next one." at Y:990 — muted, smaller */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 990,
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
          AI is just the next one.
        </BlurText>
      </div>
    </AbsoluteFill>
  );
};
