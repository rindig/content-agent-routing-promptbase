import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  FADE_PREV: 0,
  TOP_PANEL: 20,
  POETRY_NETWORK: 50,
  BOTTOM_PANEL: 50,
  MATH_NETWORK: 80,
  INSIGHT_TEXT: 120,
  DEMO_POETRY: 180,
  DEMO_MATH: 180,
};

// ── Poetry network nodes ──
const POETRY_NODES: Array<{ cx: number; cy: number; label?: string }> = [
  { cx: 180, cy: 80, label: 'rhythm' },
  { cx: 320, cy: 50, label: 'metaphor' },
  { cx: 450, cy: 90, label: 'ocean' },
  { cx: 260, cy: 150, label: 'waves' },
  { cx: 400, cy: 160, label: 'moon' },
  { cx: 140, cy: 150 },
  { cx: 350, cy: 100 },
  { cx: 500, cy: 140 },
  { cx: 220, cy: 50 },
  { cx: 420, cy: 40 },
  { cx: 160, cy: 110 },
  { cx: 300, cy: 120 },
  { cx: 480, cy: 60 },
  { cx: 240, cy: 100 },
  { cx: 380, cy: 130 },
  { cx: 530, cy: 110 },
];

const POETRY_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 4], [0, 3], [3, 4],
  [0, 5], [5, 10], [1, 6], [6, 11], [2, 7],
  [3, 11], [4, 7], [8, 0], [8, 1], [9, 2],
  [9, 12], [10, 13], [11, 14], [12, 15], [6, 14],
  [13, 3], [14, 4], [5, 3], [1, 11], [6, 2],
];

// ── Math network nodes ──
const MATH_NODES: Array<{ cx: number; cy: number; label?: string }> = [
  { cx: 160, cy: 80, label: '347' },
  { cx: 300, cy: 60, label: 'x' },
  { cx: 420, cy: 90, label: '16' },
  { cx: 260, cy: 140, label: '=' },
  { cx: 380, cy: 150, label: '?' },
  { cx: 500, cy: 70 },
  { cx: 200, cy: 130 },
  { cx: 460, cy: 140 },
];

const MATH_CONNECTIONS: Array<[number, number]> = [
  [0, 1],
  [2, 3],
];

// ── Network visualization ──
const NetworkViz: React.FC<{
  nodes: Array<{ cx: number; cy: number; label?: string }>;
  connections: Array<[number, number]>;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  animated?: boolean;
  width?: number;
  height?: number;
}> = ({
  nodes,
  connections,
  color,
  frame,
  fps,
  startFrame,
  animated = false,
  width = 620,
  height = 180,
}) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const enterProgress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ opacity }}
    >
      {/* Connection lines */}
      {connections.map(([a, b], i) => (
        <line
          key={`c-${i}`}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={color}
          strokeWidth={1}
          opacity={animated ? 0.2 : 0.15}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => {
        // Pulse animation for dense network
        let nodeOpacity = interpolate(
          i,
          [0, nodes.length - 1],
          [0.5, 1.0]
        );
        if (animated && rel > 0) {
          const wavePhase = ((rel - i * 3) % 30) / 30;
          nodeOpacity = interpolate(
            Math.sin(wavePhase * Math.PI * 2),
            [-1, 1],
            [0.3, 1.0]
          );
        }

        return (
          <React.Fragment key={`n-${i}`}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r={8}
              fill={color}
              opacity={nodeOpacity}
            />
            {n.label && (
              <text
                x={n.cx}
                y={n.cy - 14}
                textAnchor="middle"
                fill={COLORS.textMuted}
                fontSize={18}
                fontFamily={TYPOGRAPHY.code.fontFamily}
                opacity={0.8}
              >
                {n.label}
              </text>
            )}
          </React.Fragment>
        );
      })}
    </svg>
  );
};

// ── Typewriter for poetry demo ──
const PoetryTypewriter: React.FC<{
  frame: number;
  startFrame: number;
}> = ({ frame, startFrame }) => {
  const text = 'The ocean breathes in silver light';
  const rel = frame - startFrame;
  if (rel < 0) return null;
  const chars = Math.min(Math.floor(rel * 0.8), text.length);

  return (
    <span
      style={{
        ...TYPOGRAPHY.body,
        fontSize: 28,
        color: COLORS.solutionGreen,
        fontStyle: 'italic',
      }}
    >
      {text.slice(0, chars)}
      {chars < text.length && (
        <span style={{ opacity: (rel % 16) < 8 ? 1 : 0 }}>|</span>
      )}
    </span>
  );
};

// ── Scene3_SplitComparison ──
export const Scene3_SplitComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in from previous scene
  const fadeInProgress = interpolate(
    frame,
    [BEATS.FADE_PREV, BEATS.FADE_PREV + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Top panel (Poetry)
  const topProgress = spring({
    frame: Math.max(0, frame - BEATS.TOP_PANEL),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const topX = interpolate(topProgress, [0, 1], [-40, 0]);
  const topOpacity = interpolate(topProgress, [0, 1], [0, 1]);

  // Bottom panel (Math)
  const bottomProgress = spring({
    frame: Math.max(0, frame - BEATS.BOTTOM_PANEL + 10),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const bottomX = interpolate(bottomProgress, [0, 1], [40, 0]);
  const bottomOpacity = interpolate(bottomProgress, [0, 1], [0, 1]);

  // Insight text
  const showInsight = frame >= BEATS.INSIGHT_TEXT;
  const insightLine1Progress = spring({
    frame: Math.max(0, frame - BEATS.INSIGHT_TEXT),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const insightLine2Progress = spring({
    frame: Math.max(0, frame - BEATS.INSIGHT_TEXT - 10),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Demo section
  const showDemo = frame >= BEATS.DEMO_POETRY;

  // Math correction
  const mathCorrectionFrame = BEATS.DEMO_MATH + 20;
  const showMathCorrection = frame >= mathCorrectionFrame;

  const panelStyle: React.CSSProperties = {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    overflow: 'hidden',
  };

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          height: '100%',
          paddingTop: 140,
          gap: 20,
          opacity: fadeInProgress,
        }}
      >
        {/* Poetry Panel */}
        <div
          style={{
            ...panelStyle,
            borderLeft: `3px solid ${COLORS.solutionGreen}`,
            width: 900,
            maxWidth: '90%',
            opacity: topOpacity,
            transform: `translateX(${topX}px)`,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>&#128214;</span>
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.solutionGreen,
              }}
            >
              Poetry
            </span>
          </div>

          {/* Network viz */}
          <NetworkViz
            nodes={POETRY_NODES}
            connections={POETRY_CONNECTIONS}
            color={COLORS.solutionGreen}
            frame={frame}
            fps={fps}
            startFrame={BEATS.POETRY_NETWORK}
            animated
          />

          {/* Label */}
          {frame >= BEATS.POETRY_NETWORK + 20 && (
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.solutionGreen,
                opacity: interpolate(
                  frame,
                  [BEATS.POETRY_NETWORK + 20, BEATS.POETRY_NETWORK + 35],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            >
              DENSE LANGUAGE PATTERNS
            </span>
          )}

          {/* Poetry demo */}
          {showDemo && (
            <div style={{ marginTop: 4, minHeight: 36 }}>
              <PoetryTypewriter frame={frame} startFrame={BEATS.DEMO_POETRY} />
            </div>
          )}
        </div>

        {/* Math Panel */}
        <div
          style={{
            ...panelStyle,
            borderLeft: `3px solid ${COLORS.errorRed}`,
            width: 900,
            maxWidth: '90%',
            opacity: bottomOpacity,
            transform: `translateX(${bottomX}px)`,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>&#128290;</span>
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.errorRed,
              }}
            >
              Arithmetic
            </span>
          </div>

          {/* Network viz */}
          <NetworkViz
            nodes={MATH_NODES}
            connections={MATH_CONNECTIONS}
            color={COLORS.errorRed}
            frame={frame}
            fps={fps}
            startFrame={BEATS.MATH_NETWORK}
          />

          {/* Label */}
          {frame >= BEATS.MATH_NETWORK + 20 && (
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.errorRed,
                opacity: interpolate(
                  frame,
                  [BEATS.MATH_NETWORK + 20, BEATS.MATH_NETWORK + 35],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                ),
              }}
            >
              SPARSE -- NOT A LANGUAGE PATTERN
            </span>
          )}

          {/* Math demo */}
          {showDemo && (
            <div
              style={{
                marginTop: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minHeight: 36,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 28,
                  color: COLORS.textBody,
                  textDecoration: showMathCorrection ? 'line-through' : 'none',
                  textDecorationColor: COLORS.errorRed,
                }}
              >
                347 x 16 = 5,228
              </span>
              {showMathCorrection && (
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 28,
                    color: COLORS.solutionGreen,
                    opacity: interpolate(
                      frame,
                      [mathCorrectionFrame, mathCorrectionFrame + 10],
                      [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  5,552
                </span>
              )}
            </div>
          )}
        </div>

        {/* Insight text between panels */}
        {showInsight && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              marginTop: 8,
            }}
          >
            <div
              style={{
                opacity: interpolate(insightLine1Progress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(insightLine1Progress, [0, 1], [-30, 0])}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 40,
                  color: COLORS.solutionGreen,
                  fontWeight: 500,
                }}
              >
                One is a language problem.
              </span>
            </div>
            <div
              style={{
                opacity: interpolate(insightLine2Progress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(insightLine2Progress, [0, 1], [30, 0])}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 40,
                  color: COLORS.errorRed,
                  fontWeight: 500,
                }}
              >
                The other isn't.
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
