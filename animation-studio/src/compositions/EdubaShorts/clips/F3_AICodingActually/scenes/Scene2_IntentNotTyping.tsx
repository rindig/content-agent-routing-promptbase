import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start = frame 90 global, 0 local) ──
const BEATS = {
  TRANSITION: 0,
  TOOL_HEADER: 10,
  DEVELOPER_HEADER: 20,
  TOOL_FLOW_START: 40,
  INTENT_PILL: 40,
  SYNTAX_PILL: 55,
  BOILERPLATE_PILL: 70,
  OUTPUT_PILL: 85,
  REPLACES_TYPING: 95,
  STRIKETHROUGH: 100,
  DEV_CARD_1: 45,
  DEV_CARD_2: 57,
  DEV_CARD_3: 69,
  STILL_THINKING: 105,
  TOOL_DIM: 110,
  DEV_GLOW: 110,
  DIRECTS_ARROW: 120,
  DIRECTS_LABEL: 130,
  SUMMARY_TEXT: 180,
  SCENE_END: 210,
};

// ── Pill data ──
interface PillData {
  label: string;
  icon: string;
  beat: number;
}

const PILLS: PillData[] = [
  { label: 'Intent', icon: '\u00B6', beat: BEATS.INTENT_PILL },
  { label: 'Syntax', icon: '{ }', beat: BEATS.SYNTAX_PILL },
  { label: 'Boilerplate', icon: '\u2750', beat: BEATS.BOILERPLATE_PILL },
  { label: 'Output', icon: '\u2B1C', beat: BEATS.OUTPUT_PILL },
];

// ── Developer cards data ──
interface CardData {
  text: string;
  keyword: string;
  accentColor: string;
  beat: number;
}

const DEV_CARDS: CardData[] = [
  { text: 'Decides ', keyword: 'WHAT', accentColor: COLORS.solutionGreen, beat: BEATS.DEV_CARD_1 },
  { text: 'Designs the ', keyword: 'STRUCTURE', accentColor: COLORS.techBlue, beat: BEATS.DEV_CARD_2 },
  { text: 'Chooses the ', keyword: 'PATTERNS', accentColor: COLORS.insightOrange, beat: BEATS.DEV_CARD_3 },
];

// ── Tool flow pill component ──
const FlowPill: React.FC<{
  pill: PillData;
  frame: number;
  fps: number;
  showArrowAfter: boolean;
}> = ({ pill, frame, fps, showArrowAfter }) => {
  const relFrame = frame - pill.beat;
  if (relFrame < 0) return null;

  const progress = spring({ frame: relFrame, fps, config: SPRING_CONFIGS.gentle });
  const scale = interpolate(progress, [0, 1], [0.7, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          backgroundColor: `rgba(139,92,246,0.2)`,
          borderRadius: 20,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <span style={{ fontSize: 20, color: COLORS.aiPurple }}>{pill.icon}</span>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: COLORS.aiPurple,
            textTransform: 'none',
            letterSpacing: 0.5,
          }}
        >
          {pill.label}
        </span>
      </div>
      {showArrowAfter && opacity > 0.5 && (
        <svg width="24" height="16" viewBox="0 0 24 16" style={{ opacity: opacity * 0.7 }}>
          <path
            d="M0 8 L18 8 M14 3 L20 8 L14 13"
            stroke={COLORS.aiPurple}
            strokeWidth={2}
            fill="none"
          />
        </svg>
      )}
    </div>
  );
};

// ── Developer card component ──
const DevCard: React.FC<{
  card: CardData;
  frame: number;
  fps: number;
}> = ({ card, frame, fps }) => {
  const relFrame = frame - card.beat;
  if (relFrame < 0) return null;

  const progress = spring({ frame: relFrame, fps, config: SPRING_CONFIGS.gentle });
  const x = interpolate(progress, [0, 1], [-30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `translateX(${x}px)`,
        paddingLeft: 4,
      }}
    >
      <div
        style={{
          width: 4,
          height: 36,
          backgroundColor: card.accentColor,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 36,
          color: COLORS.textBody,
        }}
      >
        {card.text}
        <span style={{ color: card.accentColor, fontWeight: 600 }}>
          {card.keyword}
        </span>
        {' to build'}
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene2_IntentNotTyping: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animations
  const toolHeaderFrame = frame - BEATS.TOOL_HEADER;
  const toolHeaderProgress = toolHeaderFrame >= 0
    ? spring({ frame: toolHeaderFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const toolHeaderOpacity = interpolate(toolHeaderProgress, [0, 1], [0, 1]);

  const devHeaderFrame = frame - BEATS.DEVELOPER_HEADER;
  const devHeaderProgress = devHeaderFrame >= 0
    ? spring({ frame: devHeaderFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const devHeaderOpacity = interpolate(devHeaderProgress, [0, 1], [0, 1]);

  // "Replaces typing" label
  const replacesFrame = frame - BEATS.REPLACES_TYPING;
  const replacesOpacity = replacesFrame >= 0
    ? interpolate(replacesFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Strikethrough on "typing"
  const strikeFrame = frame - BEATS.STRIKETHROUGH;
  const strikeWidth = strikeFrame >= 0
    ? interpolate(strikeFrame, [0, 15], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // "Still thinking" label
  const thinkingFrame = frame - BEATS.STILL_THINKING;
  const thinkingOpacity = thinkingFrame >= 0
    ? interpolate(thinkingFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Checkmark draw
  const checkDrawProgress = thinkingFrame >= 0
    ? interpolate(thinkingFrame, [10, 25], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Tool panel dim / Developer panel glow
  const dimFrame = frame - BEATS.TOOL_DIM;
  const toolDim = dimFrame >= 0
    ? interpolate(dimFrame, [0, 20], [1, 0.4], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  const devGlow = dimFrame >= 0
    ? interpolate(dimFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Directs arrow
  const directsFrame = frame - BEATS.DIRECTS_ARROW;
  const arrowProgress = directsFrame >= 0
    ? interpolate(directsFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Directs label
  const directsLabelFrame = frame - BEATS.DIRECTS_LABEL;
  const directsLabelOpacity = directsLabelFrame >= 0
    ? interpolate(directsLabelFrame, [0, 10], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Summary text
  const summaryFrame = frame - BEATS.SUMMARY_TEXT;
  const summaryProgress = summaryFrame >= 0
    ? spring({ frame: summaryFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const summaryY = interpolate(summaryProgress, [0, 1], [20, 0]);
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);

  const panelStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 12,
    padding: 24,
    border: `1px solid ${COLORS.panelBorder}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Top Panel: THE TOOL */}
        <div
          style={{
            ...panelStyle,
            opacity: toolDim,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 32,
              color: COLORS.aiPurple,
              opacity: toolHeaderOpacity,
              marginBottom: 8,
            }}
          >
            THE TOOL
          </div>

          {/* Flow pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {PILLS.map((pill, i) => (
              <FlowPill
                key={i}
                pill={pill}
                frame={frame}
                fps={fps}
                showArrowAfter={i < PILLS.length - 1}
              />
            ))}
          </div>

          {/* "Replaces typing" */}
          <div style={{ opacity: replacesOpacity, marginTop: 8, position: 'relative' }}>
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 36,
                color: COLORS.textMuted,
              }}
            >
              Replaces{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                typing
                {/* Strikethrough line */}
                <svg
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    width: '100%',
                    height: 4,
                    overflow: 'visible',
                    pointerEvents: 'none',
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2={`${strikeWidth}%`}
                    y2="0"
                    stroke={COLORS.errorRed}
                    strokeWidth={3}
                  />
                </svg>
              </span>
            </span>
          </div>
        </div>

        {/* Directs arrow (between panels) */}
        {arrowProgress > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 32,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" style={{ opacity: arrowProgress }}>
              <path
                d="M16 28 L16 4 M10 10 L16 4 L22 10"
                stroke={COLORS.insightOrange}
                strokeWidth={2.5}
                fill="none"
                strokeDasharray={60}
                strokeDashoffset={60 * (1 - arrowProgress)}
              />
            </svg>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.insightOrange,
                opacity: directsLabelOpacity,
                textTransform: 'none',
                letterSpacing: 1,
              }}
            >
              directs
            </span>
          </div>
        )}

        {/* Bottom Panel: THE DEVELOPER */}
        <div
          style={{
            ...panelStyle,
            boxShadow: devGlow > 0
              ? `0 0 15px rgba(59,130,246,${0.2 * devGlow})`
              : 'none',
            borderColor: devGlow > 0
              ? `rgba(59,130,246,${0.3 * devGlow})`
              : COLORS.panelBorder,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 32,
              color: COLORS.techBlue,
              opacity: devHeaderOpacity,
              marginBottom: 8,
            }}
          >
            THE DEVELOPER
          </div>

          {/* Capability cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEV_CARDS.map((card, i) => (
              <DevCard key={i} card={card} frame={frame} fps={fps} />
            ))}
          </div>

          {/* "Still thinking" with checkmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 8,
              opacity: thinkingOpacity,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 36,
                color: COLORS.solutionGreen,
              }}
            >
              Still thinking
            </span>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <path
                d="M6 14 L12 20 L22 8"
                stroke={COLORS.solutionGreen}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={40}
                strokeDashoffset={40 * (1 - checkDrawProgress)}
              />
            </svg>
          </div>
        </div>

        {/* Summary text */}
        {summaryFrame >= 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              opacity: summaryOpacity,
              transform: `translateY(${summaryY}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.insightOrange,
              }}
            >
              Same skill. Higher altitude.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
