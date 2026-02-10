import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  COMPRESS_UP: 0,
  DIVIDER: 30,
  PROMPT_PANEL_IN: 40,
  PROMPT_LINES_START: 50,
  LINE_STAGGER: 6,
  FILL_START: 140,
  FILL_STAGGER: 6,
  CONNECTING_LINES: 200,
  YEARS_LABEL: 210,
  HOLD: 250,
};

// ── System prompt template data ──
interface PromptLine {
  prefix: string;
  placeholder?: string;
  fillWord?: string;
  isBlank?: boolean;
}

const PROMPT_LINES: PromptLine[] = [
  { prefix: 'You are a ', placeholder: 'ROLE', fillWord: 'code reviewer', isBlank: true },
  { prefix: '' },
  { prefix: 'Context: ', placeholder: 'CONTEXT', fillWord: 'Python codebase', isBlank: true },
  { prefix: '' },
  { prefix: 'Constraints:' },
  { prefix: '- Always ', placeholder: 'CONSTRAINT_1', fillWord: 'explain reasoning', isBlank: true },
  { prefix: '- Never ', placeholder: 'CONSTRAINT_2', fillWord: 'modify files directly', isBlank: true },
  { prefix: '' },
  { prefix: 'Output format: ', placeholder: 'FORMAT', fillWord: 'markdown checklist', isBlank: true },
];

// ── Mini reference cards (Mad Libs + AST compressed at top) ──
const MiniReferenceCards: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const compressProgress = spring({
    frame: Math.max(0, frame - BEATS.COMPRESS_UP),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(compressProgress, [0, 1], [0.5, 0.25]);
  const opacity = interpolate(compressProgress, [0, 1], [0, 0.8]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center top',
        marginBottom: 16,
      }}
    >
      {/* Mad Libs mini */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ ...TYPOGRAPHY.label, fontSize: 16, color: COLORS.textMuted }}>
          1953
        </span>
        <div
          style={{
            backgroundColor: 'rgba(201,162,39,0.08)',
            border: `1px solid rgba(201,162,39,0.4)`,
            borderRadius: 6,
            padding: '8px 16px',
            width: 160,
          }}
        >
          <span style={{ ...TYPOGRAPHY.code, fontSize: 14, color: COLORS.historyGold }}>
            Mad Libs
          </span>
        </div>
      </div>

      {/* AST mini */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ ...TYPOGRAPHY.label, fontSize: 16, color: COLORS.textMuted }}>
          1970S
        </span>
        <div
          style={{
            backgroundColor: 'rgba(59,130,246,0.08)',
            border: `1px solid rgba(59,130,246,0.4)`,
            borderRadius: 6,
            padding: '8px 16px',
            width: 160,
          }}
        >
          <span style={{ ...TYPOGRAPHY.code, fontSize: 14, color: COLORS.techBlue }}>
            AST
          </span>
        </div>
      </div>
    </div>
  );
};

// ── System prompt panel ──
const SystemPromptPanel: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const panelRelFrame = frame - BEATS.PROMPT_PANEL_IN;
  if (panelRelFrame < 0) return null;

  const panelEnter = spring({
    frame: panelRelFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelScale = interpolate(panelEnter, [0, 1], [0.95, 1]);
  const panelOpacity = interpolate(panelEnter, [0, 1], [0, 1]);

  // Track which blank we're on for fill stagger
  let blankIndex = 0;

  return (
    <div
      style={{
        opacity: panelOpacity,
        transform: `scale(${panelScale})`,
        backgroundColor: COLORS.codeBg,
        borderRadius: 12,
        border: `1px solid ${COLORS.panelBorder}`,
        width: 900,
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Title bar */}
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: '10px 20px',
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 20,
            color: COLORS.textMuted,
            marginLeft: 12,
            textTransform: 'none' as const,
            letterSpacing: 0,
          }}
        >
          system_prompt.txt
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px' }}>
        {PROMPT_LINES.map((line, i) => {
          const lineStart = BEATS.PROMPT_LINES_START + i * BEATS.LINE_STAGGER;
          const lineOpacity = interpolate(
            frame,
            [lineStart, lineStart + 10],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          // Empty lines
          if (!line.prefix && !line.placeholder) {
            return (
              <div key={i} style={{ height: 16, opacity: lineOpacity }} />
            );
          }

          // Fill logic for blanks
          let fillProgress = 0;
          let isFilled = false;
          if (line.isBlank) {
            const fillStart = BEATS.FILL_START + blankIndex * BEATS.FILL_STAGGER;
            isFilled = frame >= fillStart;
            fillProgress = isFilled
              ? spring({
                  frame: frame - fillStart,
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                })
              : 0;
            blankIndex++;
          }

          const labelOpacity = interpolate(fillProgress, [0, 0.5], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fillWordScale = interpolate(fillProgress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                opacity: lineOpacity,
                marginBottom: 8,
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                position: 'relative',
                minHeight: 36,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 28,
                  color: COLORS.textBody,
                }}
              >
                {line.prefix}
              </span>

              {line.isBlank && line.placeholder && (
                <span
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    margin: '0 4px',
                  }}
                >
                  {/* Type label above */}
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 16,
                      color: COLORS.insightOrange,
                      opacity: labelOpacity,
                      position: 'absolute',
                      top: -20,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {line.placeholder}
                  </span>

                  {isFilled ? (
                    <span
                      style={{
                        ...TYPOGRAPHY.code,
                        fontSize: 28,
                        color: COLORS.aiPurple,
                        fontWeight: 600,
                        transform: `scale(${fillWordScale})`,
                        display: 'inline-block',
                      }}
                    >
                      {line.fillWord}
                    </span>
                  ) : (
                    <span
                      style={{
                        ...TYPOGRAPHY.code,
                        fontSize: 26,
                        color: COLORS.insightOrange,
                        borderBottom: `2px dotted ${COLORS.insightOrange}`,
                        paddingBottom: 2,
                      }}
                    >
                      [{line.placeholder}]
                    </span>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Scene4_SystemPrompt ──
export const Scene4_SystemPrompt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Connecting lines between all three ──
  const connectRelFrame = frame - BEATS.CONNECTING_LINES;
  const connectProgress = interpolate(
    connectRelFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── "71 years apart" label ──
  const yearsRelFrame = frame - BEATS.YEARS_LABEL;
  const yearsProgress =
    yearsRelFrame >= 0
      ? spring({ frame: yearsRelFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const yearsScale = interpolate(yearsProgress, [0, 1], [0.8, 1]);
  const yearsOpacity = interpolate(yearsProgress, [0, 1], [0, 1]);

  // ── Pulse on connecting lines after hold ──
  const pulseFrame = frame - BEATS.HOLD;
  const pulseOpacity =
    pulseFrame >= 0
      ? interpolate(
          pulseFrame % 30,
          [0, 15, 30],
          [0.4, 0.8, 0.4]
        )
      : connectProgress * 0.6;

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={290}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          paddingTop: 40,
        }}
      >
        {/* Mini reference cards at top */}
        <MiniReferenceCards frame={frame} fps={fps} />

        {/* Divider */}
        <div
          style={{
            width: interpolate(
              frame,
              [BEATS.DIVIDER, BEATS.DIVIDER + 10],
              [0, 90],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ) + '%',
            height: 1,
            backgroundColor: 'rgba(156,163,175,0.3)',
            marginBottom: 20,
          }}
        />

        {/* System prompt panel */}
        <SystemPromptPanel frame={frame} fps={fps} />

        {/* Connecting annotation lines */}
        {connectRelFrame >= 0 && (
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Dashed triangle connecting lines */}
            <svg width={400} height={60}>
              {/* Left line (Mad Libs -> center) */}
              <line
                x1={50}
                y1={10}
                x2={200 * connectProgress + 50}
                y2={50 * connectProgress + 10}
                stroke={COLORS.insightOrange}
                strokeWidth={2}
                strokeDasharray="8 4"
                opacity={pulseOpacity}
              />
              {/* Right line (AST -> center) */}
              <line
                x1={350}
                y1={10}
                x2={350 - 150 * connectProgress}
                y2={50 * connectProgress + 10}
                stroke={COLORS.insightOrange}
                strokeWidth={2}
                strokeDasharray="8 4"
                opacity={pulseOpacity}
              />
              {/* Bottom line connecting */}
              <line
                x1={100}
                y1={50}
                x2={100 + 200 * connectProgress}
                y2={50}
                stroke={COLORS.insightOrange}
                strokeWidth={2}
                strokeDasharray="8 4"
                opacity={pulseOpacity}
              />
            </svg>

            {/* "71 years apart" label */}
            <div
              style={{
                opacity: yearsOpacity,
                transform: `scale(${yearsScale})`,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 40,
                  color: COLORS.insightOrange,
                  fontWeight: 600,
                }}
              >
                71 years apart
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
