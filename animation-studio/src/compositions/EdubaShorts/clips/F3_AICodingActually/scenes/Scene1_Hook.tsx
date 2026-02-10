import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  EDITOR_IN: 0,
  CURSOR_BLINK: 5,
  PROMPT_TYPE: 20,
  CODE_GENERATE: 35,
  REVIEW_HIGHLIGHT: 50,
  ANNOTATION: 55,
  QUESTION_TEXT: 72,
  YES_TEXT: 82,
  SCENE_END: 90,
};

// ── Prompt text (typewriter) ──
const PROMPT_TEXT = 'Build a REST API with user auth and rate limiting';
const CHARS_PER_FRAME = 1.5; // frames per character

// ── Generated code lines ──
const CODE_LINES: string[] = [
  'from fastapi import FastAPI, Depends',
  'from auth import require_auth',
  'from limiter import rate_limit',
  '',
  'app = FastAPI()',
  '',
  '@app.post("/users")',
  '@rate_limit("10/min")',
  'async def create_user(data: UserCreate,',
  '    auth = Depends(require_auth)):',
];

// ── Editor component ──
const CodeEditor: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.EDITOR_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const editorScale = interpolate(enterProgress, [0, 1], [0.95, 1]);
  const editorOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Blinking cursor
  const cursorOpacity = Math.sin(frame * (Math.PI / 7.5)) > 0 ? 1 : 0;

  // Typewriter prompt
  const typeFrame = frame - BEATS.PROMPT_TYPE;
  const charsVisible = typeFrame >= 0
    ? Math.min(Math.floor(typeFrame * CHARS_PER_FRAME), PROMPT_TEXT.length)
    : 0;
  const promptText = PROMPT_TEXT.slice(0, charsVisible);
  const promptDone = charsVisible >= PROMPT_TEXT.length;

  // Code generation
  const codeFrame = frame - BEATS.CODE_GENERATE;
  const visibleCodeLines = codeFrame >= 0
    ? Math.min(Math.floor(codeFrame / 3) + 1, CODE_LINES.length)
    : 0;

  // Review highlight (line 8 - the rate_limit pattern)
  const reviewFrame = frame - BEATS.REVIEW_HIGHLIGHT;
  const highlightOpacity = reviewFrame >= 0
    ? interpolate(
        spring({ frame: reviewFrame, fps, config: SPRING_CONFIGS.gentle }),
        [0, 1],
        [0, 0.1]
      )
    : 0;

  // Annotation bubble
  const annotationFrame = frame - BEATS.ANNOTATION;
  const annotationProgress = annotationFrame >= 0
    ? spring({ frame: annotationFrame, fps, config: SPRING_CONFIGS.bouncy })
    : 0;
  const annotationScale = interpolate(annotationProgress, [0, 1], [0.5, 1]);
  const annotationOpacity = interpolate(annotationProgress, [0, 1], [0, 1]);

  // Editor dim when question appears
  const dimFrame = frame - BEATS.QUESTION_TEXT;
  const editorDimOpacity = dimFrame >= 0
    ? interpolate(dimFrame, [0, 10], [1, 0.6], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <div
      style={{
        width: 900,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        overflow: 'hidden',
        opacity: editorOpacity * editorDimOpacity,
        transform: `scale(${editorScale})`,
        border: `1px solid ${COLORS.panelBorder}`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          backgroundColor: COLORS.bgSurfaceAlt,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.errorRed }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.insightOrange }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: COLORS.solutionGreen }} />
      </div>

      {/* Content area */}
      <div style={{ padding: '20px 24px', minHeight: 440, position: 'relative' }}>
        {/* Blinking cursor before prompt */}
        {charsVisible === 0 && frame >= BEATS.CURSOR_BLINK && (
          <span
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 28,
              color: COLORS.textMuted,
              opacity: cursorOpacity,
            }}
          >
            |
          </span>
        )}

        {/* Prompt text (typewriter) */}
        {charsVisible > 0 && (
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.aiPurple,
                lineHeight: 1.4,
              }}
            >
              {promptText}
            </span>
            {!promptDone && (
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: COLORS.aiPurple,
                  opacity: cursorOpacity,
                }}
              >
                |
              </span>
            )}
          </div>
        )}

        {/* Generated code lines */}
        {visibleCodeLines > 0 && (
          <div style={{ marginTop: 12 }}>
            {CODE_LINES.slice(0, visibleCodeLines).map((line, i) => {
              const lineStart = i * 3;
              const lineOpacity = interpolate(
                codeFrame,
                [lineStart, lineStart + 8],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              const isHighlighted = i === 7 && reviewFrame >= 0;

              return (
                <div
                  key={i}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: isHighlighted
                      ? `rgba(59,130,246,${highlightOpacity})`
                      : 'transparent',
                    opacity: lineOpacity,
                    marginBottom: 2,
                    position: 'relative',
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.code,
                      fontSize: 28,
                      color: COLORS.codeText,
                    }}
                  >
                    {line || '\u00A0'}
                  </span>

                  {/* Annotation bubble on highlighted line */}
                  {isHighlighted && annotationFrame >= 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: -16,
                        top: -8,
                        backgroundColor: COLORS.bgSurfaceAlt,
                        border: `1px solid ${COLORS.insightOrange}`,
                        borderRadius: 8,
                        padding: '6px 14px',
                        opacity: annotationOpacity,
                        transform: `scale(${annotationScale})`,
                        transformOrigin: 'left center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span
                        style={{
                          ...TYPOGRAPHY.label,
                          fontSize: 24,
                          color: COLORS.insightOrange,
                          textTransform: 'none',
                          letterSpacing: 0,
                        }}
                      >
                        Adjust this pattern
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showQuestion = frame >= BEATS.QUESTION_TEXT;
  const showYes = frame >= BEATS.YES_TEXT;

  // Question text
  const questionProgress = showQuestion
    ? spring({ frame: frame - BEATS.QUESTION_TEXT, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const questionY = interpolate(questionProgress, [0, 1], [30, 0]);
  const questionOpacity = interpolate(questionProgress, [0, 1], [0, 1]);

  // Yes text
  const yesProgress = showYes
    ? spring({ frame: frame - BEATS.YES_TEXT, fps, config: SPRING_CONFIGS.bouncy })
    : 0;
  const yesScale = interpolate(yesProgress, [0, 1], [0.4, 1]);
  const yesOpacity = interpolate(yesProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
        }}
      >
        {/* Code editor mockup */}
        <CodeEditor frame={frame} fps={fps} />

        {/* Question text */}
        {showQuestion && (
          <div
            style={{
              textAlign: 'center',
              opacity: questionOpacity,
              transform: `translateY(${questionY}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 52,
                color: COLORS.textMuted,
              }}
            >
              Wait... is that still programming?
            </span>
          </div>
        )}

        {/* "Yes." */}
        {showYes && (
          <div
            style={{
              textAlign: 'center',
              opacity: yesOpacity,
              transform: `scale(${yesScale})`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 72,
                color: COLORS.textPrimary,
              }}
            >
              Yes.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
