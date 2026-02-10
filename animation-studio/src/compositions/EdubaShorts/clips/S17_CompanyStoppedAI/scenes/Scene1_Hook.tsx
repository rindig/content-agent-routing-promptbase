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
  SCENE_IN: 0,
  EMAIL_IN: 3,
  CONFETTI_BURST: 8,
  EMAIL_SCALE_DOWN: 20,
  GRAPH_IN: 30,
  GRAPH_DRAW_START: 30,
  GRAPH_DRAW_END: 70,
  FLATLINE_LABEL: 65,
  HOLD: 75,
};

// ── Confetti particles ──
const CONFETTI_COLORS = [
  COLORS.techBlue,
  COLORS.aiPurple,
  COLORS.insightOrange,
  COLORS.solutionGreen,
  COLORS.techBlue,
  COLORS.aiPurple,
];
const CONFETTI_POSITIONS = [
  { x: -60, y: -30 },
  { x: 50, y: -50 },
  { x: -30, y: -60 },
  { x: 70, y: -20 },
  { x: -80, y: -10 },
  { x: 40, y: -45 },
];

// ── Usage data ──
const DATA_POINTS = [0, 85, 92, 78, 45, 22, 10, 5, 3, 2];
const LABELS = ['', 'Day 1', '', '', 'Wk 2', '', 'Wk 3', '', 'Wk 4', ''];

// ── Email Notification ──
const EmailNotification: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.EMAIL_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const y = interpolate(enterProgress, [0, 1], [-40, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Scale down after initial reveal
  const scaleProgress = spring({
    frame: Math.max(0, frame - BEATS.EMAIL_SCALE_DOWN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(scaleProgress, [0, 1], [1, 0.7]);

  // Shift upward as scale down
  const shiftY = interpolate(scaleProgress, [0, 1], [0, -60]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y + shiftY}px) scale(${scale})`,
        zIndex: 10,
      }}
    >
      {/* Confetti burst */}
      {CONFETTI_COLORS.map((color, i) => {
        const confettiRel = frame - BEATS.CONFETTI_BURST;
        if (confettiRel < 0) return null;

        const burstScale = spring({
          frame: confettiRel,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        const gravityY = interpolate(
          confettiRel,
          [0, 27],
          [0, 60],
          { extrapolateRight: 'extend' }
        );
        const confettiOpacity = interpolate(
          confettiRel,
          [0, 15, 30],
          [0, 1, 0],
          { extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              backgroundColor: color,
              borderRadius: 2,
              left: `calc(50% + ${CONFETTI_POSITIONS[i].x}px)`,
              top: `calc(50% + ${CONFETTI_POSITIONS[i].y}px)`,
              opacity: confettiOpacity,
              transform: `scale(${burstScale}) translateY(${gravityY}px) rotate(${confettiRel * 8 + i * 45}deg)`,
            }}
          />
        );
      })}

      {/* Email card */}
      <div
        style={{
          backgroundColor: COLORS.bgSurface,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 14,
          padding: '20px 24px',
          width: 800,
          maxWidth: '100%',
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: COLORS.textMuted,
            marginBottom: 8,
          }}
        >
          FROM: LEADERSHIP
        </div>
        <div
          style={{
            ...TYPOGRAPHY.title,
            fontSize: 42,
            color: COLORS.textPrimary,
            marginBottom: 8,
          }}
        >
          Exciting news! New AI tool available!
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 32,
            color: COLORS.textMuted,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Starting today, all teams have access to...
        </div>
      </div>
    </div>
  );
};

// ── Usage Graph ──
const UsageGraph: React.FC<{ frame: number; fps: number }> = ({
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

  // Draw progress (line draws over 40 frames)
  const drawDuration = 40;
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

  return (
    <div
      style={{
        position: 'absolute',
        top: 380,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity: graphOpacity,
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
            fill={COLORS.errorRed}
            opacity={0.05 * drawProgress}
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={COLORS.errorRed}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
          />

          {/* Data point dots */}
          {points.map((p, i) => {
            const dotProgress = interpolate(
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
                r={4 * dotProgress}
                fill={COLORS.errorRed}
                opacity={dotProgress}
              />
            );
          })}

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
        </svg>

        {/* Flatline label */}
        {frame >= BEATS.FLATLINE_LABEL && (
          <div
            style={{
              position: 'absolute',
              bottom: 50,
              right: 20,
              opacity: interpolate(
                frame - BEATS.FLATLINE_LABEL,
                [0, 10],
                [0, 1],
                { extrapolateRight: 'clamp' }
              ),
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.errorRed,
              }}
            >
              WEEK 4: FLATLINED
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <EmailNotification frame={frame} fps={fps} />
        <UsageGraph frame={frame} fps={fps} />
      </div>
    </SceneContainer>
  );
};
