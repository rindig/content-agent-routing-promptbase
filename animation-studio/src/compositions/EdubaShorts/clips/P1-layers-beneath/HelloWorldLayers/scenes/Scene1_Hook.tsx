import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
} from '../../../../../Memory/components/AmbientBackground';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

const BEATS = {
  TYPEWRITER_START: 0,
  CODE_FULLY_VISIBLE: 40,
  UNDERLINE_IN: 50,
  GLITCH_BURST: 90,
  DIM_AND_SHRINK: 120,
  SCENE_END: 150,
};

const CODE_TEXT = 'print("Hello, World!")';
const CODE_LENGTH = CODE_TEXT.length;

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Typewriter (frames 0–40) ---
  const charsVisible = Math.floor(
    interpolate(frame, [0, BEATS.CODE_FULLY_VISIBLE], [0, CODE_LENGTH], {
      extrapolateRight: 'clamp',
      extrapolateLeft: 'clamp',
    })
  );
  const visibleText = CODE_TEXT.slice(0, charsVisible);

  // Cursor blink: 1px wide, techBlue, toggles every 15 frames
  const cursorVisible = frame >= 2 && Math.floor(frame / 15) % 2 === 0;

  // --- Underline (frames 50–70) ---
  const underlineProgress = spring({
    frame: frame - BEATS.UNDERLINE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const underlineWidth =
    frame >= BEATS.UNDERLINE_IN
      ? interpolate(underlineProgress, [0, 1], [0, 480])
      : 0;
  const underlineOpacity = frame >= BEATS.UNDERLINE_IN ? 0.6 : 0;

  // --- Glitch burst (frames 90–110): chromatic aberration ±4px ---
  const glitchActive =
    frame >= BEATS.GLITCH_BURST && frame < BEATS.GLITCH_BURST + 20;
  const glitchOffset = glitchActive
    ? interpolate(
        frame - BEATS.GLITCH_BURST,
        [0, 5, 15, 20],
        [0, 4, 4, 0],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  // --- Dim + shrink + rise (frames 120–150) ---
  const dimProgress = spring({
    frame: frame - BEATS.DIM_AND_SHRINK,
    fps,
    config: SPRING_CONFIGS.gentle,
    durationInFrames: 30,
  });

  const codeOpacity =
    frame >= BEATS.DIM_AND_SHRINK
      ? interpolate(dimProgress, [0, 1], [1.0, 0.5])
      : 1.0;
  const codeScale =
    frame >= BEATS.DIM_AND_SHRINK
      ? interpolate(dimProgress, [0, 1], [1.0, 0.6])
      : 1.0;
  const codeY =
    frame >= BEATS.DIM_AND_SHRINK
      ? interpolate(dimProgress, [0, 1], [900, 500])
      : 900;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={30}
        particleColor={COLORS.techBlue}
      />
      <Vignette intensity={0.6} />

      {/* Code text container */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: codeY,
          transform: `translate(-50%, -50%) scale(${codeScale})`,
          opacity: codeOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main code text + glitch layers */}
        <div style={{ position: 'relative' }}>
          {/* Primary text */}
          <div
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 40,
              color: COLORS.techBlue,
              whiteSpace: 'nowrap',
            }}
          >
            {visibleText}
            {cursorVisible && (
              <span
                style={{
                  display: 'inline-block',
                  width: 1,
                  height: 44,
                  backgroundColor: COLORS.techBlue,
                  marginLeft: 2,
                  verticalAlign: 'middle',
                }}
              />
            )}
          </div>

          {/* Chromatic aberration: red channel shifted right */}
          {glitchActive && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: glitchOffset,
                ...TYPOGRAPHY.code,
                fontSize: 40,
                color: 'rgba(255, 0, 0, 0.5)',
                whiteSpace: 'nowrap',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            >
              {visibleText}
            </div>
          )}

          {/* Chromatic aberration: cyan channel shifted left */}
          {glitchActive && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: -glitchOffset,
                ...TYPOGRAPHY.code,
                fontSize: 40,
                color: 'rgba(0, 255, 255, 0.5)',
                whiteSpace: 'nowrap',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            >
              {visibleText}
            </div>
          )}
        </div>

        {/* Underline */}
        <div
          style={{
            height: 2,
            width: underlineWidth,
            backgroundColor: COLORS.techBlue,
            opacity: underlineOpacity,
            marginTop: 8,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
