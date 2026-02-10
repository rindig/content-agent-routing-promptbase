import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { ErrorMessage } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 1: Hook -- The Lying Error
 * Duration: 90 frames (3 seconds)
 *
 * NullPointerException panel + code snippet with line 47 highlighted.
 * Question mark appears, panel shakes, glitch effect, then "The error is lying."
 */

const BEATS = {
  ERROR_PANEL_IN: 0,
  CODE_LINES_IN: 15,
  CODE_STAGGER: 3,
  QUESTION_MARK_IN: 40,
  PANEL_SHAKE: 45,
  GLITCH_TEXT: 60,
  DIM_AND_LABEL: 80,
};

const CODE_LINES = [
  { num: 45, text: '  const data = response.body;', highlight: false },
  { num: 46, text: '  const items = data.items;', highlight: false },
  { num: 47, text: '  return items.length;', highlight: true },
  { num: 48, text: '  // nothing wrong here', highlight: false, italic: true },
];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dim everything at the end
  const dimOpacity = interpolate(
    frame,
    [BEATS.DIM_AND_LABEL, BEATS.DIM_AND_LABEL + 8],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Label "The error is lying." fade in
  const labelOpacity = interpolate(
    frame,
    [BEATS.DIM_AND_LABEL, BEATS.DIM_AND_LABEL + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const labelY = interpolate(
    spring({
      frame: frame - BEATS.DIM_AND_LABEL,
      fps,
      config: SPRING_CONFIGS.gentle,
    }),
    [0, 1],
    [15, 0]
  );

  // Panel shake (frame 45-57, 3 cycles of 4 frames)
  const isShaking = frame >= BEATS.PANEL_SHAKE && frame < BEATS.GLITCH_TEXT;
  const shakeX = isShaking
    ? Math.sin((frame - BEATS.PANEL_SHAKE) * (Math.PI / 2)) * 3
    : 0;

  // Question mark
  const qMarkProgress = spring({
    frame: frame - BEATS.QUESTION_MARK_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const qMarkScale = interpolate(qMarkProgress, [0, 1], [0, 1]);
  const qMarkOpacity = interpolate(qMarkProgress, [0, 1], [0, 1]);
  const qMarkRotation = frame >= BEATS.QUESTION_MARK_IN
    ? Math.sin((frame - BEATS.QUESTION_MARK_IN) * 0.3) * 5
    : 0;

  // Whether to show glitch on "at line 47"
  const isGlitching = frame >= BEATS.GLITCH_TEXT && frame < BEATS.DIM_AND_LABEL;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={82}
      fadeOutDuration={8}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 28,
        }}
      >
        {/* Error Message Panel */}
        <div
          style={{
            width: '100%',
            opacity: dimOpacity,
            transform: `translateX(${shakeX}px)`,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: `2px solid ${COLORS.errorRed}`,
              borderRadius: 12,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity: interpolate(
                spring({ frame, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1],
                [0, 1]
              ),
              transform: `scale(${interpolate(
                spring({ frame, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1],
                [0.9, 1]
              )})`,
            }}
          >
            {/* Error icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `2px solid ${COLORS.errorRed}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  color: COLORS.errorRed,
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                !
              </span>
            </div>

            {/* Error text with possible glitch */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 32,
                  color: COLORS.errorRed,
                }}
              >
                NullPointerException
              </span>
              {isGlitching ? (
                <GlitchText
                  startFrame={BEATS.GLITCH_TEXT}
                  intensity={0.6}
                  speed={2}
                  color={COLORS.errorRed}
                  fontSize={32}
                >
                  at line 47
                </GlitchText>
              ) : (
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 32,
                    color: COLORS.errorRed,
                  }}
                >
                  at line 47
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Code Panel */}
        <div style={{ width: '100%', opacity: dimOpacity, position: 'relative' }}>
          <div
            style={{
              backgroundColor: COLORS.codeBg,
              borderRadius: 12,
              padding: '24px 28px',
              border: `1px solid ${COLORS.panelBorder}`,
              opacity: interpolate(
                frame,
                [BEATS.CODE_LINES_IN, BEATS.CODE_LINES_IN + 10],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            {CODE_LINES.map((line, i) => {
              const lineStart = BEATS.CODE_LINES_IN + i * BEATS.CODE_STAGGER;
              const lineOpacity = interpolate(
                frame,
                [lineStart, lineStart + 10],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={i}
                  style={{
                    opacity: lineOpacity,
                    padding: '6px 10px',
                    marginBottom: 4,
                    borderRadius: 4,
                    backgroundColor: line.highlight
                      ? 'rgba(245,158,11,0.08)'
                      : 'transparent',
                    borderLeft: line.highlight
                      ? `3px solid ${COLORS.insightOrange}`
                      : '3px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  {/* Line number */}
                  <span
                    style={{
                      ...TYPOGRAPHY.code,
                      fontSize: 28,
                      color: COLORS.textDim,
                      minWidth: 36,
                      textAlign: 'right',
                    }}
                  >
                    {line.num}
                  </span>
                  {/* Code text */}
                  <span
                    style={{
                      ...TYPOGRAPHY.code,
                      fontSize: 32,
                      color: line.highlight ? COLORS.textPrimary : COLORS.textMuted,
                      fontStyle: line.italic ? 'italic' : 'normal',
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Animated question mark over line 47 */}
          {frame >= BEATS.QUESTION_MARK_IN && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                right: 40,
                opacity: qMarkOpacity * dimOpacity,
                transform: `scale(${qMarkScale}) rotate(${qMarkRotation}deg)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.hero,
                  fontSize: 84,
                  color: COLORS.insightOrange,
                }}
              >
                ?
              </span>
            </div>
          )}
        </div>

        {/* "The error is lying." label */}
        {frame >= BEATS.DIM_AND_LABEL && (
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 52,
                color: COLORS.errorRed,
              }}
            >
              The error is lying.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
