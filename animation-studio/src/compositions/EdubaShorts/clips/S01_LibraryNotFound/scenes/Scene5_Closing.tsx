import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { ClosingStatement, CodePanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  CODE_CALLBACK_IN: 5,
  GLITCH_CALM: 25,
  UNDERLINE_COLOR_SHIFT: 30,
  LABEL_IN: 50,
  PROGRESS_BAR_IN: 55,
  LOADING_TEXT_IN: 60,
  CONTENT_SHIFT_UP: 80,
  CLOSING_TEXT_IN: 100,
  PROGRESS_COMPLETE: 140,
  LOADING_FADE_OUT: 145,
  BUILDING_TEXT_IN: 155,
  HOLD_START: 160,
  FADE_OUT_START: 220,
};

const CALLBACK_CODE = [
  "import { analyzeData } from 'neural-parse-kit';",
];

/** Animated loading dots */
const LoadingDots: React.FC<{ startFrame: number; color: string }> = ({ startFrame, color }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const cycleFrame = relativeFrame % 24;

  return (
    <span style={{ ...TYPOGRAPHY.code, fontSize: 28, color }}>
      loading
      <span style={{ opacity: cycleFrame >= 0 ? 1 : 0 }}>.</span>
      <span style={{ opacity: cycleFrame >= 8 ? 1 : 0 }}>.</span>
      <span style={{ opacity: cycleFrame >= 16 ? 1 : 0 }}>.</span>
    </span>
  );
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Underline color shifts from red to orange
  const underlineColor = frame >= BEATS.UNDERLINE_COLOR_SHIFT
    ? (() => {
        const t = interpolate(
          frame,
          [BEATS.UNDERLINE_COLOR_SHIFT, BEATS.UNDERLINE_COLOR_SHIFT + 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        // Interpolate from errorRed to insightOrange via hex
        const r = Math.round(239 + (245 - 239) * t);
        const g = Math.round(68 + (158 - 68) * t);
        const b = Math.round(68 + (11 - 68) * t);
        return `rgb(${r},${g},${b})`;
      })()
    : COLORS.errorRed;

  // Content shifts up to make room for closing
  const shiftProgress = spring({
    frame: frame - BEATS.CONTENT_SHIFT_UP,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const contentShiftY = interpolate(shiftProgress, [0, 1], [0, -80]);

  // Progress bar width
  const progressWidth = interpolate(
    frame,
    [BEATS.PROGRESS_BAR_IN, BEATS.PROGRESS_COMPLETE],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Loading text fade out
  const loadingFade = interpolate(
    frame,
    [BEATS.LOADING_FADE_OUT, BEATS.LOADING_FADE_OUT + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Wavy underline for the library name
  const wavyPhase = frame * 0.5;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT_START}
      fadeOutDuration={20}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          gap: 24,
        }}
      >
        {/* Top section: Code callback + progress + loading (shifts up) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            width: '100%',
            transform: `translateY(${contentShiftY}px)`,
            paddingTop: 200,
          }}
        >
          {/* Code panel callback with color-shifting underline */}
          <div style={{ width: '100%', position: 'relative' }}>
            <CodePanel
              lines={CALLBACK_CODE}
              startFrame={BEATS.CODE_CALLBACK_IN}
              highlightLines={frame >= BEATS.UNDERLINE_COLOR_SHIFT ? [0] : []}
              highlightColor={underlineColor}
              fontSize={28}
            />

            {/* Wavy underline on library name */}
            {frame >= BEATS.UNDERLINE_COLOR_SHIFT && (
              <svg
                style={{
                  position: 'absolute',
                  bottom: 28,
                  left: 240,
                  width: 280,
                  height: 10,
                  overflow: 'visible',
                }}
              >
                <path
                  d={`M 0 5 ${Array.from({ length: 28 }, (_, i) => {
                    const x = i * 10;
                    const y = 5 + Math.sin((i + wavyPhase) * 0.8) * 2.5;
                    return `L ${x} ${y}`;
                  }).join(' ')}`}
                  stroke={underlineColor}
                  strokeWidth={2}
                  fill="none"
                  opacity={0.8}
                />
              </svg>
            )}
          </div>

          {/* Error-correction layer label */}
          {frame >= BEATS.LABEL_IN && (
            <AnimatedText
              variant="label"
              size={28}
              color={COLORS.aiPurple}
              entrance="fade"
              startFrame={BEATS.LABEL_IN}
              align="center"
            >
              ERROR-CORRECTION LAYER
            </AnimatedText>
          )}

          {/* Progress bar */}
          {frame >= BEATS.PROGRESS_BAR_IN && (
            <div
              style={{
                width: 600,
                height: 6,
                backgroundColor: COLORS.bgSurfaceAlt,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progressWidth}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${COLORS.aiPurple}, ${COLORS.techBlue})`,
                  borderRadius: 3,
                }}
              />
            </div>
          )}

          {/* Loading / Building text */}
          <div style={{ height: 36, display: 'flex', alignItems: 'center' }}>
            {frame >= BEATS.LOADING_TEXT_IN && frame < BEATS.BUILDING_TEXT_IN && (
              <div style={{ opacity: loadingFade }}>
                <LoadingDots
                  startFrame={BEATS.LOADING_TEXT_IN}
                  color={COLORS.textMuted}
                />
              </div>
            )}
            {frame >= BEATS.BUILDING_TEXT_IN && (
              <AnimatedText
                variant="code"
                size={28}
                color={COLORS.solutionGreen}
                entrance="fade"
                startFrame={BEATS.BUILDING_TEXT_IN}
              >
                building...
              </AnimatedText>
            )}
          </div>
        </div>

        {/* Closing statement */}
        {frame >= BEATS.CLOSING_TEXT_IN && (
          <div style={{ marginTop: 20 }}>
            <ClosingStatement
              text="That's not broken technology. That's an error-correction layer that hasn't caught up yet."
              startFrame={BEATS.CLOSING_TEXT_IN}
              holdDuration={100}
              fontSize={44}
              color={COLORS.textPrimary}
            />
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
