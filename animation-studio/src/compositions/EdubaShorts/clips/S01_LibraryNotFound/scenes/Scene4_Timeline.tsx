import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  TITLE_IN: 5,
  NODE_1_IN: 20,
  NODE_2_IN: 44,
  NODE_3_IN: 68,
  NODE_4_IN: 92,
  NODE_5_IN: 116,
  DIVIDER_IN: 120,
  AI_ERA_LABEL: 128,
  NODE_6_IN: 140,
  NODE_6_PROGRESS: 150,
  NODE_7_IN: 185,
  HOLD_START: 210,
  FADE_OUT_START: 230,
};

interface TimelineNodeData {
  year: string;
  label: string;
  description: string;
  color: string;
  startFrame: number;
  glow?: boolean;
  dashed?: boolean;
  ghostOpacity?: number;
}

const NODES: TimelineNodeData[] = [
  {
    year: '1952',
    label: 'Raw Compilers',
    description: 'Buggy. Garbled output.',
    color: COLORS.errorRed,
    startFrame: BEATS.NODE_1_IN,
  },
  {
    year: '1960s',
    label: 'Debuggers Added',
    description: 'First error-finding tools',
    color: COLORS.insightOrange,
    startFrame: BEATS.NODE_2_IN,
  },
  {
    year: '1970s',
    label: 'Testing Frameworks',
    description: 'Automated error detection',
    color: COLORS.insightOrange,
    startFrame: BEATS.NODE_3_IN,
  },
  {
    year: '1990s',
    label: 'Linting & Static Analysis',
    description: 'Catch errors before runtime',
    color: COLORS.solutionGreen,
    startFrame: BEATS.NODE_4_IN,
  },
  {
    year: '2000+',
    label: 'Rock Solid',
    description: 'Compilers are trusted infrastructure',
    color: COLORS.solutionGreen,
    startFrame: BEATS.NODE_5_IN,
    glow: true,
  },
];

/** A single timeline node with content card */
const TimelineNode: React.FC<{
  node: TimelineNodeData;
  isLast?: boolean;
}> = ({ node, isLast }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeProgress = spring({
    frame: frame - node.startFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const cardProgress = spring({
    frame: frame - node.startFrame - 5,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);
  const nodeOpacity = interpolate(
    frame,
    [node.startFrame, node.startFrame + 10],
    [0, node.ghostOpacity ?? 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cardX = interpolate(cardProgress, [0, 1], [40, 0]);
  const cardOpacity = interpolate(
    frame,
    [node.startFrame + 5, node.startFrame + 20],
    [0, node.ghostOpacity ?? 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const glowShadow = node.glow
    ? `0 0 24px rgba(16,185,129,0.3)`
    : 'none';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 20,
        width: '100%',
        opacity: nodeOpacity,
      }}
    >
      {/* Timeline line + node dot */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 40,
          position: 'relative',
        }}
      >
        {/* Dot */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: node.dashed ? 'transparent' : node.color,
            border: node.dashed ? `2px dashed ${node.color}` : 'none',
            transform: `scale(${nodeScale})`,
            boxShadow: glowShadow,
            flexShrink: 0,
          }}
        />
        {/* Connector line below */}
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 20,
              backgroundColor: COLORS.panelBorder,
            }}
          />
        )}
      </div>

      {/* Content card */}
      <div
        style={{
          flex: 1,
          backgroundColor: `${node.color}0F`,
          borderLeft: `3px ${node.dashed ? 'dashed' : 'solid'} ${node.color}`,
          borderRadius: 12,
          padding: '14px 20px',
          opacity: cardOpacity,
          transform: `translateX(${cardX}px)`,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: node.color,
            marginBottom: 4,
          }}
        >
          {node.year} {node.label}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 28,
            color: node.color,
            opacity: 0.85,
          }}
        >
          {node.description}
        </div>
      </div>
    </div>
  );
};

export const Scene4_Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // AI era progress bar
  const progressBarWidth = interpolate(
    frame,
    [BEATS.NODE_6_PROGRESS, BEATS.NODE_7_IN],
    [0, 20],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Node 6 pulse
  const node6Pulse =
    frame >= BEATS.HOLD_START
      ? 0.85 + 0.15 * Math.sin((frame - BEATS.HOLD_START) * 0.14)
      : 1;

  // Node 7 ghost pulse
  const node7Pulse =
    frame >= BEATS.NODE_7_IN
      ? 0.3 + 0.1 * Math.sin((frame - BEATS.NODE_7_IN) * 0.14)
      : 0;

  // Divider fade-in
  const dividerOpacity = interpolate(
    frame,
    [BEATS.DIVIDER_IN, BEATS.DIVIDER_IN + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT_START}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          gap: 16,
        }}
      >
        {/* Title */}
        <AnimatedText
          variant="title"
          size={48}
          color={COLORS.historyGold}
          entrance="slideUp"
          startFrame={BEATS.TITLE_IN}
          springPreset="gentle"
          align="center"
        >
          The Compiler Timeline
        </AnimatedText>

        {/* Vertical timeline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            flex: 1,
            overflow: 'hidden',
            paddingTop: 10,
          }}
        >
          {/* Compiler-era nodes */}
          {NODES.map((node, i) => (
            <TimelineNode
              key={node.year}
              node={node}
              isLast={false}
            />
          ))}

          {/* AI Era Divider */}
          {frame >= BEATS.DIVIDER_IN && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                marginTop: 8,
                marginBottom: 8,
                opacity: dividerOpacity,
              }}
            >
              <svg width="100%" height={4}>
                <line
                  x1={0}
                  y1={2}
                  x2="100%"
                  y2={2}
                  stroke={COLORS.aiPurple}
                  strokeWidth={2}
                  strokeDasharray="10 6"
                />
              </svg>
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.aiPurple}
                entrance="fade"
                startFrame={BEATS.AI_ERA_LABEL}
                align="center"
              >
                AI ERA BEGINS
              </AnimatedText>
            </div>
          )}

          {/* Node 6: AI Compiling (in-progress) */}
          {frame >= BEATS.NODE_6_IN - 5 && (
            <div style={{ opacity: node6Pulse }}>
              <TimelineNode
                node={{
                  year: '2024-26',
                  label: 'AI Compiling',
                  description: 'Hallucinations. No linting yet.',
                  color: COLORS.aiPurple,
                  startFrame: BEATS.NODE_6_IN,
                  dashed: true,
                }}
              />
              {/* Progress bar inside the AI node area */}
              {frame >= BEATS.NODE_6_PROGRESS && (
                <div
                  style={{
                    marginLeft: 60,
                    marginTop: -12,
                    marginBottom: 8,
                    width: 300,
                    height: 4,
                    backgroundColor: COLORS.bgSurfaceAlt,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${progressBarWidth}%`,
                      height: '100%',
                      backgroundColor: COLORS.aiPurple,
                      borderRadius: 2,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Node 7: Future (ghostly) */}
          {frame >= BEATS.NODE_7_IN - 5 && (
            <div style={{ opacity: node7Pulse }}>
              <TimelineNode
                node={{
                  year: 'Next',
                  label: 'Error Correction Layer',
                  description: 'Testing, validation, linting for AI',
                  color: COLORS.aiPurple,
                  startFrame: BEATS.NODE_7_IN,
                  dashed: true,
                  ghostOpacity: 0.4,
                }}
                isLast
              />
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
