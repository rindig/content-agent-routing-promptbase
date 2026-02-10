import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

/**
 * Scene 1: Hook — The Typo (0s-3s, 90 frames)
 *
 * A missing semicolon triggers cascading errors, then cross-fades
 * to the $475,000,000 cost reveal.
 */

const BEATS = {
  CODE_IN: 0,
  CURSOR_BLINK_START: 0,
  UNDERLINE_IN: 10,
  ERROR_CASCADE_START: 15,
  ERROR_STAGGER: 3,
  ERRORS_BLUR_OUT: 40,
  COST_TEXT_IN: 55,
};

const ERROR_MESSAGES = [
  'SyntaxError: Unexpected token',
  'TypeError: Cannot read property...',
  'Build failed with 1 error',
  'Build failed with 3 errors',
  'Build failed with 12 errors',
];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Code line entrance ---
  const codeOpacity = interpolate(
    frame,
    [BEATS.CODE_IN, BEATS.CODE_IN + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Blur out code and errors
  const codeBlur = interpolate(
    frame,
    [BEATS.ERRORS_BLUR_OUT, BEATS.ERRORS_BLUR_OUT + 15],
    [0, 12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const codeSectionOpacity = interpolate(
    frame,
    [BEATS.ERRORS_BLUR_OUT, BEATS.COST_TEXT_IN],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Red cursor blink ---
  const cursorVisible =
    frame >= BEATS.CURSOR_BLINK_START && frame < BEATS.ERRORS_BLUR_OUT;
  const cursorOpacity = cursorVisible
    ? Math.sin(frame * 0.33) > 0
      ? 1
      : 0.2
    : 0;

  // --- Red underline entrance ---
  const underlineProgress = spring({
    frame: frame - BEATS.UNDERLINE_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const underlineWidth = interpolate(underlineProgress, [0, 1], [0, 100]);
  const underlineOpacity =
    frame >= BEATS.UNDERLINE_IN ? interpolate(underlineProgress, [0, 1], [0, 1]) : 0;

  // --- Cost text entrance ---
  const costProgress = spring({
    frame: frame - BEATS.COST_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const costScale = interpolate(costProgress, [0, 1], [0.8, 1]);
  const costOpacity = frame >= BEATS.COST_TEXT_IN
    ? interpolate(costProgress, [0, 1], [0, 1])
    : 0;

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={8}>
      {/* Code section - blurs out */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: codeSectionOpacity,
          filter: `blur(${codeBlur}px)`,
          padding: '96px 54px',
        }}
      >
        {/* Code line */}
        <div
          style={{
            opacity: codeOpacity,
            marginBottom: 8,
            position: 'relative',
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 32,
              color: COLORS.codeText,
            }}
          >
            {'float result = x / y'}
          </span>
          {/* Blinking red cursor where semicolon is missing */}
          <span
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 32,
              color: COLORS.errorRed,
              opacity: cursorOpacity,
              marginLeft: 2,
            }}
          >
            |
          </span>

          {/* Red underline */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: 0,
              width: `${underlineWidth}%`,
              height: 3,
              backgroundColor: COLORS.errorRed,
              opacity: underlineOpacity,
              borderRadius: 2,
            }}
          />
          {/* Caret below missing semicolon */}
          {frame >= BEATS.UNDERLINE_IN && (
            <div
              style={{
                position: 'absolute',
                bottom: -22,
                right: 20,
                opacity: underlineOpacity,
                color: COLORS.errorRed,
                fontSize: 20,
                fontFamily: TYPOGRAPHY.code.fontFamily,
              }}
            >
              ^
            </div>
          )}
        </div>

        {/* Error cascade */}
        <div
          style={{
            marginTop: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            width: '100%',
            maxWidth: 900,
          }}
        >
          {ERROR_MESSAGES.map((msg, i) => {
            const errorStart = BEATS.ERROR_CASCADE_START + i * BEATS.ERROR_STAGGER;
            const errorProgress = spring({
              frame: frame - errorStart,
              fps,
              config: SPRING_CONFIGS.gentle,
            });
            const errorOpacity =
              frame >= errorStart
                ? interpolate(errorProgress, [0, 1], [0, interpolate(i, [0, 4], [0.5, 1])])
                : 0;
            const errorX = interpolate(errorProgress, [0, 1], [60, i * 8]);

            return (
              <div
                key={i}
                style={{
                  opacity: errorOpacity,
                  transform: `translateX(${errorX}px)`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 28,
                    color: COLORS.errorRed,
                  }}
                >
                  {msg}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* $475,000,000 reveal */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: costOpacity,
          transform: `scale(${costScale})`,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.hero,
            fontSize: 72,
            color: COLORS.errorRed,
          }}
        >
          $475,000,000
        </span>
      </div>
    </SceneContainer>
  );
};
