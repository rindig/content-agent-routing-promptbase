import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUp, ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  TITLE_IN: 5,
  GRAPH_IN: 20,
  GRAPH_DRAW_START: 20,
  GRAPH_DRAW_END: 80,
  GROWING_DOT: 70,
  ARROW_IN: 80,
  GROWING_LABEL: 82,
  DIVIDER: 95,
  STAT_TOOL_FIRST: 100,
  STAT_PROBLEM_FIRST: 115,
  HOLD_COMPARISON: 130,
  FADE_STATS: 160,
  BRIDGE_TEXT: 165,
  HOLD_BRIDGE: 200,
  FADE_OUT: 230,
};

// ── Graph data ──
const DATA_POINTS = [0, 8, 15, 22, 30, 38, 45, 52, 58, 63, 68, 72];
const LABELS = ['', 'Wk 1', '', 'Wk 3', '', 'Wk 5', '', 'Wk 7', '', 'Wk 9', '', 'Wk 12'];

// ── Usage Graph (steady climb) ──
const SteadyGraph: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.GRAPH_IN;
  if (relFrame < 0) return null;

  const graphWidth = 750;
  const graphHeight = 350;
  const padLeft = 50;
  const padBottom = 40;
  const padTop = 20;
  const padRight = 20;

  const plotW = graphWidth - padLeft - padRight;
  const plotH = graphHeight - padTop - padBottom;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const graphOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Draw progress (line draws over 60 frames -- slower for emphasis)
  const drawDuration = 60;
  const drawProgress = interpolate(
    relFrame,
    [0, drawDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const maxVal = Math.max(...DATA_POINTS);

  // Build points
  const points = DATA_POINTS.map((val, i) => {
    const x = padLeft + (i / (DATA_POINTS.length - 1)) * plotW;
    const y = padTop + plotH - (val / maxVal) * plotH;
    return { x, y };
  });

  // Build SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + plotH} L ${padLeft} ${padTop + plotH} Z`;

  // Total path length estimate
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const dashOffset = totalLength * (1 - drawProgress);

  // Pulsing dot at the end
  const showDot = frame >= BEATS.GROWING_DOT;
  const dotPulse = showDot
    ? 0.85 + 0.15 * Math.sin((frame - BEATS.GROWING_DOT) * 0.15)
    : 0;

  // Arrow + label
  const showArrow = frame >= BEATS.ARROW_IN;
  const arrowProgress = showArrow
    ? spring({
        frame: frame - BEATS.ARROW_IN,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  const showLabel = frame >= BEATS.GROWING_LABEL;
  const labelProgress = showLabel
    ? spring({
        frame: frame - BEATS.GROWING_LABEL,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  // Fade out when stats section takes focus
  const fadeOutProgress = interpolate(
    frame,
    [BEATS.FADE_STATS, BEATS.FADE_STATS + 25],
    [1, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const lastPoint = points[points.length - 1];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        opacity: graphOpacity * fadeOutProgress,
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative' }}>
        <svg width={graphWidth} height={graphHeight}>
          {/* Y-axis */}
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={padTop + plotH}
            stroke={COLORS.textDim}
            strokeWidth={1}
            opacity={0.4}
          />
          {/* X-axis */}
          <line
            x1={padLeft}
            y1={padTop + plotH}
            x2={padLeft + plotW}
            y2={padTop + plotH}
            stroke={COLORS.textDim}
            strokeWidth={1}
            opacity={0.4}
          />

          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={padLeft}
              y1={padTop + plotH * (1 - frac)}
              x2={padLeft + plotW}
              y2={padTop + plotH * (1 - frac)}
              stroke={COLORS.textDim}
              strokeWidth={1}
              opacity={0.12}
            />
          ))}

          {/* Area fill */}
          <path
            d={areaD}
            fill={COLORS.solutionGreen}
            opacity={0.05 * drawProgress}
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={COLORS.solutionGreen}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />

          {/* Data point dots */}
          {points.map((p, i) => {
            const dotAppear = interpolate(
              drawProgress,
              [i / (points.length - 1) - 0.05, i / (points.length - 1) + 0.05],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4 * dotAppear}
                fill={COLORS.solutionGreen}
                opacity={dotAppear}
              />
            );
          })}

          {/* Pulsing end dot */}
          {showDot && (
            <circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={8}
              fill={COLORS.solutionGreen}
              opacity={dotPulse}
              filter="url(#greenGlow)"
            />
          )}

          {/* Arrow pointing up-right */}
          {showArrow && (
            <g
              transform={`translate(${lastPoint.x + 10}, ${lastPoint.y - 20})`}
              opacity={arrowProgress}
            >
              <line
                x1={0}
                y1={20}
                x2={20}
                y2={0}
                stroke={COLORS.solutionGreen}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <polyline
                points="12,-2 20,0 18,8"
                fill="none"
                stroke={COLORS.solutionGreen}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* X-axis labels */}
          {LABELS.map((label, i) => {
            if (!label) return null;
            const x = padLeft + (i / (LABELS.length - 1)) * plotW;
            return (
              <text
                key={i}
                x={x}
                y={padTop + plotH + 28}
                textAnchor="middle"
                fill={COLORS.textMuted}
                fontSize={20}
                fontFamily={TYPOGRAPHY.label.fontFamily}
              >
                {label}
              </text>
            );
          })}

          {/* Y-axis label */}
          <text
            x={16}
            y={padTop + plotH / 2}
            textAnchor="middle"
            fill={COLORS.textDim}
            fontSize={18}
            fontFamily={TYPOGRAPHY.label.fontFamily}
            transform={`rotate(-90, 16, ${padTop + plotH / 2})`}
          >
            USAGE
          </text>

          {/* Glow filter */}
          <defs>
            <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Still growing label */}
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              top: lastPoint.y - 50,
              right: 0,
              opacity: interpolate(labelProgress, [0, 1], [0, 1]),
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.solutionGreen,
              }}
            >
              STILL GROWING
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene4_Alternative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleProgress = spring({
    frame: Math.max(0, frame - BEATS.TITLE_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [20, 0]);

  // Divider
  const dividerProgress = frame >= BEATS.DIVIDER
    ? spring({
        frame: frame - BEATS.DIVIDER,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  // Tool-first stat
  const toolFirstProgress = spring({
    frame: Math.max(0, frame - BEATS.STAT_TOOL_FIRST),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const toolFirstOpacity = interpolate(toolFirstProgress, [0, 1], [0, 1]);

  // Problem-first stat
  const problemFirstProgress = spring({
    frame: Math.max(0, frame - BEATS.STAT_PROBLEM_FIRST),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const problemFirstOpacity = interpolate(problemFirstProgress, [0, 1], [0, 1]);

  // 72% glow pulse
  const glowPulse =
    frame >= BEATS.HOLD_COMPARISON
      ? 0.1 + 0.1 * Math.sin((frame - BEATS.HOLD_COMPARISON) * 0.126)
      : 0;

  // Fade stats for bridge text
  const statsFadeOut = interpolate(
    frame,
    [BEATS.FADE_STATS, BEATS.FADE_STATS + 25],
    [1, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bridge text
  const showBridge = frame >= BEATS.BRIDGE_TEXT;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={230}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 48,
              color: COLORS.solutionGreen,
            }}
          >
            Problem-First Adoption
          </span>
        </div>

        {/* Steady climb graph */}
        <SteadyGraph frame={frame} fps={fps} />

        {/* Comparison section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: statsFadeOut,
            marginTop: 8,
          }}
        >
          {/* Divider */}
          {frame >= BEATS.DIVIDER && (
            <div
              style={{
                width: interpolate(dividerProgress, [0, 1], [0, 400]),
                height: 1,
                backgroundColor: COLORS.panelBorder,
              }}
            />
          )}

          {/* Tool-first stat */}
          {frame >= BEATS.STAT_TOOL_FIRST && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                opacity: toolFirstOpacity,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.textMuted,
                }}
              >
                TOOL-FIRST:
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 56,
                  color: COLORS.errorRed,
                }}
              >
                10%
              </span>
            </div>
          )}

          {/* Problem-first stat */}
          {frame >= BEATS.STAT_PROBLEM_FIRST && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                opacity: problemFirstOpacity,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.textMuted,
                }}
              >
                PROBLEM-FIRST:
              </span>
              <div
                style={{
                  boxShadow: `0 0 20px rgba(16,185,129,${glowPulse})`,
                  borderRadius: 8,
                  padding: '4px 16px',
                }}
              >
                <CountUp
                  to={72}
                  suffix="%"
                  startFrame={BEATS.STAT_PROBLEM_FIRST}
                  fontSize={56}
                  fontWeight={600}
                  color={COLORS.solutionGreen}
                  duration={25}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bridge text */}
        {showBridge && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 16,
            }}
          >
            <ShinyText
              startFrame={BEATS.BRIDGE_TEXT}
              color={COLORS.textMuted}
              shineColor="#FFFFFF"
              duration={45}
              fontSize={48}
              fontWeight={600}
            >
              Start with the problem.
            </ShinyText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
