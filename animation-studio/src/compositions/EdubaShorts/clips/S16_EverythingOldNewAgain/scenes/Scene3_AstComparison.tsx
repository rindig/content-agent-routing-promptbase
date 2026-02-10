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
  CARD_SHRINK: 0,
  DIVIDER: 30,
  AST_ROOT: 40,
  AST_LEVEL_1_START: 55,
  AST_LEVEL_2_START: 75,
  AST_LINES_DRAW: 50,
  AST_FILL_START: 120,
  AST_FILL_STAGGER: 8,
  CONNECTING_LINE: 170,
  HOLD: 210,
};

// ── AST Node ──
interface ASTNodeData {
  label: string;
  isBlank: boolean;
  fillWord?: string;
  x: number;
  y: number;
  startFrame: number;
}

const AST_NODES: ASTNodeData[] = [
  { label: 'Program', isBlank: false, x: 340, y: 30, startFrame: BEATS.AST_ROOT },
  { label: 'Assignment', isBlank: false, x: 180, y: 120, startFrame: BEATS.AST_LEVEL_1_START },
  { label: 'Return', isBlank: false, x: 500, y: 120, startFrame: BEATS.AST_LEVEL_1_START + 5 },
  { label: 'IDENTIFIER', isBlank: true, fillWord: 'result', x: 80, y: 210, startFrame: BEATS.AST_LEVEL_2_START },
  { label: 'EXPRESSION', isBlank: true, fillWord: 'x * 2', x: 280, y: 210, startFrame: BEATS.AST_LEVEL_2_START + 5 },
  { label: 'EXPRESSION', isBlank: true, fillWord: 'result', x: 500, y: 210, startFrame: BEATS.AST_LEVEL_2_START + 10 },
];

// Parent-child edges (indices)
const AST_EDGES: [number, number][] = [
  [0, 1], // Program -> Assignment
  [0, 2], // Program -> Return
  [1, 3], // Assignment -> IDENTIFIER
  [1, 4], // Assignment -> EXPRESSION
  [2, 5], // Return -> EXPRESSION
];

// ── AST Node Component ──
const ASTNode: React.FC<{
  node: ASTNodeData;
  frame: number;
  fps: number;
  fillStartFrame: number;
}> = ({ node, frame, fps, fillStartFrame }) => {
  const relFrame = frame - node.startFrame;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  // Fill animation for blanks
  const isFilled = node.isBlank && frame >= fillStartFrame;
  const fillProgress =
    isFilled
      ? spring({
          frame: frame - fillStartFrame,
          fps,
          config: SPRING_CONFIGS.bouncy,
        })
      : 0;
  const fillScale = interpolate(fillProgress, [0, 1], [0, 1]);

  const bgColor = node.isBlank
    ? 'transparent'
    : 'rgba(59,130,246,0.15)';
  const borderColor = node.isBlank
    ? COLORS.insightOrange
    : COLORS.techBlue;
  const borderStyle = node.isBlank ? 'dashed' : 'solid';

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x - 70,
        top: node.y - 20,
        width: 140,
        height: 44,
        backgroundColor: bgColor,
        border: `1.5px ${borderStyle} ${borderColor}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {isFilled ? (
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 22,
            color: COLORS.insightOrange,
            fontWeight: 600,
            transform: `scale(${fillScale})`,
            display: 'inline-block',
          }}
        >
          {node.fillWord}
        </span>
      ) : (
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize: node.isBlank ? 20 : 22,
            color: node.isBlank ? COLORS.insightOrange : COLORS.techBlue,
          }}
        >
          {node.isBlank ? `[${node.label}]` : node.label}
        </span>
      )}
    </div>
  );
};

// ── Mini Mad Libs Card (shrunk from Scene 2) ──
const MiniMadLibsCard: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const shrinkProgress = spring({
    frame: Math.max(0, frame),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.45]);
  const y = interpolate(shrinkProgress, [0, 1], [0, -20]);

  return (
    <div
      style={{
        transform: `scale(${scale}) translateY(${y}px)`,
        transformOrigin: 'center top',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.historyGold,
        }}
      >
        MAD LIBS
      </span>
      <div
        style={{
          backgroundColor: 'rgba(201,162,39,0.08)',
          border: `1.5px solid rgba(201,162,39,0.5)`,
          borderRadius: 8,
          padding: '12px 20px',
          width: 320,
        }}
      >
        <div style={{ ...TYPOGRAPHY.code, fontSize: 18, color: COLORS.historyGold, marginBottom: 4 }}>
          THE ADVENTURE
        </div>
        <div style={{ ...TYPOGRAPHY.body, fontSize: 16, color: COLORS.textBody }}>
          The <span style={{ color: COLORS.insightOrange }}>fearless</span> explorer
        </div>
        <div style={{ ...TYPOGRAPHY.body, fontSize: 16, color: COLORS.textBody }}>
          sailed to <span style={{ color: COLORS.insightOrange }}>Mars</span>
        </div>
      </div>
    </div>
  );
};

// ── Scene3_AstComparison ──
export const Scene3_AstComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Divider draw
  const dividerProgress = interpolate(
    frame,
    [BEATS.DIVIDER, BEATS.DIVIDER + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Connecting line
  const connectRelFrame = frame - BEATS.CONNECTING_LINE;
  const connectProgress = interpolate(
    connectRelFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Background gradient (warm top, dark bottom)
  const bgGradient = `linear-gradient(to bottom, ${COLORS.bgWarm} 0%, ${COLORS.bgWarm} 35%, ${COLORS.bg} 65%, ${COLORS.bg} 100%)`;

  return (
    <SceneContainer background={bgGradient} fadeIn fadeInDuration={10} fadeOut fadeOutStart={230} fadeOutDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          paddingTop: 60,
        }}
      >
        {/* Mini Mad Libs card at top */}
        <MiniMadLibsCard frame={frame} fps={fps} />

        {/* Horizontal divider */}
        <div
          style={{
            width: `${dividerProgress * 90}%`,
            height: 1,
            backgroundColor: `rgba(156,163,175,0.3)`,
            marginTop: 24,
            marginBottom: 24,
            transition: 'none',
          }}
        />

        {/* AST visualization */}
        <div
          style={{
            position: 'relative',
            width: 680,
            height: 280,
          }}
        >
          {/* SVG edges */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            viewBox="0 0 680 280"
          >
            {AST_EDGES.map(([parentIdx, childIdx], i) => {
              const parent = AST_NODES[parentIdx];
              const child = AST_NODES[childIdx];
              const edgeStart = BEATS.AST_LINES_DRAW + i * 5;
              const edgeProgress = interpolate(
                frame,
                [edgeStart, edgeStart + 8],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              const lineLength = Math.sqrt(
                Math.pow(child.x - parent.x, 2) + Math.pow(child.y - parent.y, 2)
              );

              return (
                <line
                  key={i}
                  x1={parent.x}
                  y1={parent.y + 22}
                  x2={child.x}
                  y2={child.y - 22}
                  stroke={COLORS.techBlue}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  strokeDasharray={lineLength}
                  strokeDashoffset={lineLength * (1 - edgeProgress)}
                />
              );
            })}
          </svg>

          {/* AST nodes */}
          {AST_NODES.map((node, i) => {
            const fillIdx = i - 3; // blank nodes start at index 3
            const fillStart =
              node.isBlank
                ? BEATS.AST_FILL_START + fillIdx * BEATS.AST_FILL_STAGGER
                : 999;

            return (
              <ASTNode
                key={i}
                node={node}
                frame={frame}
                fps={fps}
                fillStartFrame={fillStart}
              />
            );
          })}
        </div>

        {/* "Same pattern" connecting annotation */}
        {connectRelFrame >= 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: 40,
              opacity: connectProgress,
            }}
          >
            {/* Dashed connecting line */}
            <svg width={300} height={40} style={{ marginBottom: 8 }}>
              <line
                x1={0}
                y1={20}
                x2={300 * connectProgress}
                y2={20}
                stroke={COLORS.insightOrange}
                strokeWidth={2}
                strokeDasharray="8 4"
              />
            </svg>

            <div
              style={{
                backgroundColor: COLORS.bgWarm,
                padding: '8px 24px',
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.insightOrange,
                }}
              >
                Same pattern
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
