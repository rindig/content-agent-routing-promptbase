import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start = frame 300 global, 0 local) ──
const BEATS = {
  TRANSITION: 0,
  TIMELINE_START: 30,
  ASSEMBLY_NODE: 30,
  C_NODE: 48,
  PYTHON_NODE: 66,
  AI_NODE: 84,
  CONNECTOR_LINE: 40,
  SPOTLIGHT_ASSEMBLY: 120,
  SPOTLIGHT_C: 140,
  SPOTLIGHT_PYTHON: 155,
  SPOTLIGHT_AI: 170,
  SUMMARY_TEXT: 190,
  GRADIENT_ARROW: 200,
  SCENE_END: 240,
};

// ── Timeline node data ──
interface TimelineNodeData {
  era: string;
  label: string;
  color: string;
  code: string[];
  beat: number;
  isAI?: boolean;
}

const TIMELINE_NODES: TimelineNodeData[] = [
  {
    era: '1950s',
    label: 'Assembly',
    color: COLORS.historyGold,
    code: ['MOV AX, [data]', 'ADD AX, BX', 'INT 21h'],
    beat: BEATS.ASSEMBLY_NODE,
  },
  {
    era: '1970s',
    label: 'C',
    color: COLORS.insightOrange,
    code: ['int sum = a + b;', 'printf("%d", sum);'],
    beat: BEATS.C_NODE,
  },
  {
    era: '1990s',
    label: 'Python',
    color: COLORS.solutionGreen,
    code: ['result = sum(data)', 'print(result)'],
    beat: BEATS.PYTHON_NODE,
  },
  {
    era: '2024+',
    label: 'AI Prompt',
    color: COLORS.aiPurple,
    code: ['"Sum the data and', ' show the result"'],
    beat: BEATS.AI_NODE,
    isAI: true,
  },
];

// ── Spotlight descriptions ──
const SPOTLIGHT_TEXTS: Array<{ beat: number; text: string; color: string }> = [
  { beat: BEATS.SPOTLIGHT_ASSEMBLY, text: 'Tell the machine every step', color: COLORS.textBody },
  { beat: BEATS.SPOTLIGHT_C, text: 'Describe the logic', color: COLORS.textBody },
  { beat: BEATS.SPOTLIGHT_PYTHON, text: 'State your intent', color: COLORS.textBody },
  { beat: BEATS.SPOTLIGHT_AI, text: 'Describe the outcome', color: COLORS.aiPurple },
];

// ── Single timeline node ──
const TimelineNode: React.FC<{
  node: TimelineNodeData;
  index: number;
  frame: number;
  fps: number;
  isSpotlit: boolean;
  anySpotlit: boolean;
}> = ({ node, index, frame, fps, isSpotlit, anySpotlit }) => {
  const relFrame = frame - node.beat;
  if (relFrame < 0) return null;

  const progress = spring({ frame: relFrame, fps, config: SPRING_CONFIGS.gentle });
  const y = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = node.isAI ? interpolate(progress, [0, 1], [0.8, 1.1]) : interpolate(progress, [0, 1], [0.8, 1]);

  // Dimming when another is spotlit
  const dimOpacity = anySpotlit && !isSpotlit ? 0.3 : 1;

  // Glow for AI node
  const glowOpacity = node.isAI
    ? 0.3 + 0.1 * Math.sin(frame * 0.08)
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity: opacity * dimOpacity,
        transform: `translateY(${y}px) scale(${scale})`,
        transition: 'none',
        flex: 1,
      }}
    >
      {/* Era label */}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color: COLORS.textMuted,
          textTransform: 'none',
          letterSpacing: 1,
        }}
      >
        {node.era}
      </span>

      {/* Node dot */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: node.color,
          boxShadow: node.isAI
            ? `0 0 10px rgba(139,92,246,${glowOpacity})`
            : isSpotlit
              ? `0 0 12px ${node.color}66`
              : 'none',
          flexShrink: 0,
        }}
      />

      {/* Code card */}
      <div
        style={{
          backgroundColor: COLORS.bgSurface,
          borderRadius: 8,
          padding: '12px 14px',
          width: 210,
          border: `1px solid ${isSpotlit ? node.color : COLORS.panelBorder}`,
          boxShadow: isSpotlit ? `0 0 8px ${node.color}33` : 'none',
        }}
      >
        {node.code.map((line, i) => (
          <div
            key={i}
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 22,
              color: node.isAI ? node.color : `${node.color}B3`,
              lineHeight: 1.5,
              whiteSpace: 'pre',
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Node label */}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: node.color,
          textTransform: 'none',
          letterSpacing: 0.5,
        }}
      >
        {node.label}
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene3_HistoricalPattern: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which node is spotlit
  let spotlitIndex = -1;
  if (frame >= BEATS.SPOTLIGHT_AI) spotlitIndex = 3;
  else if (frame >= BEATS.SPOTLIGHT_PYTHON) spotlitIndex = 2;
  else if (frame >= BEATS.SPOTLIGHT_C) spotlitIndex = 1;
  else if (frame >= BEATS.SPOTLIGHT_ASSEMBLY) spotlitIndex = 0;

  const anySpotlit = spotlitIndex >= 0;

  // Connector line draw
  const connectorFrame = frame - BEATS.CONNECTOR_LINE;
  const connectorProgress = connectorFrame >= 0
    ? interpolate(connectorFrame, [0, 40], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Current spotlight text
  let currentSpotlightText = '';
  let currentSpotlightColor = COLORS.textBody;
  for (let i = SPOTLIGHT_TEXTS.length - 1; i >= 0; i--) {
    if (frame >= SPOTLIGHT_TEXTS[i].beat) {
      currentSpotlightText = SPOTLIGHT_TEXTS[i].text;
      currentSpotlightColor = SPOTLIGHT_TEXTS[i].color;
      break;
    }
  }

  // Spotlight text crossfade
  const spotlightOpacity = anySpotlit
    ? interpolate(
        frame - SPOTLIGHT_TEXTS[Math.max(0, spotlitIndex)].beat,
        [0, 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Summary text
  const summaryFrame = frame - BEATS.SUMMARY_TEXT;
  const summaryProgress = summaryFrame >= 0
    ? spring({ frame: summaryFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const summaryOpacity = interpolate(summaryProgress, [0, 1], [0, 1]);

  // Gradient arrow sweep
  const arrowFrame = frame - BEATS.GRADIENT_ARROW;
  const arrowProgress = arrowFrame >= 0
    ? interpolate(arrowFrame, [0, 30], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Timeline nodes row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            gap: 8,
            position: 'relative',
          }}
        >
          {TIMELINE_NODES.map((node, i) => (
            <React.Fragment key={i}>
              {/* Connector between nodes */}
              {i > 0 && (
                <div
                  style={{
                    width: 24,
                    height: 2,
                    backgroundColor: COLORS.textMuted,
                    alignSelf: 'center',
                    marginTop: 38,
                    opacity: interpolate(
                      connectorProgress,
                      [(i - 1) / 3, i / 3],
                      [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ),
                    flexShrink: 0,
                  }}
                />
              )}
              <TimelineNode
                node={node}
                index={i}
                frame={frame}
                fps={fps}
                isSpotlit={spotlitIndex === i}
                anySpotlit={anySpotlit}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Gradient arrow (bottom, ascending abstraction) */}
        {arrowProgress > 0 && (
          <div style={{ width: '85%', height: 6, position: 'relative', marginTop: 8 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${arrowProgress * 100}%`,
                height: '100%',
                background: `linear-gradient(to right, ${COLORS.historyGold}, ${COLORS.insightOrange}, ${COLORS.solutionGreen}, ${COLORS.aiPurple})`,
                borderRadius: 3,
              }}
            />
            {/* Arrowhead */}
            <svg
              style={{
                position: 'absolute',
                right: `${(1 - arrowProgress) * 100}%`,
                top: -5,
                transform: 'translateX(50%)',
                opacity: arrowProgress,
              }}
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path d="M0 0 L16 8 L0 16 Z" fill={COLORS.aiPurple} />
            </svg>
          </div>
        )}

        {/* Spotlight description text */}
        {anySpotlit && (
          <div
            style={{
              textAlign: 'center',
              opacity: spotlightOpacity,
              minHeight: 50,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 36,
                color: currentSpotlightColor,
              }}
            >
              {currentSpotlightText}
            </span>
          </div>
        )}

        {/* Summary text */}
        {summaryFrame >= 0 && (
          <div
            style={{
              textAlign: 'center',
              opacity: summaryOpacity,
              marginTop: 8,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.insightOrange,
              }}
            >
              Each level: higher intent, automated translation.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
