import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, GlitchText, CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  FADE_PREV: 0,
  CARD_IN: 30,
  METRICS_IN: 60,
  ERA_2022: 110,
  TRANSITION_2024: 130,
  TRANSITION_2026: 150,
  CRITICAL: 170,
  CAPTION: 200,
};

// ── Metric data across years ──
interface MetricData {
  label: string;
  values: [number, number, number]; // 2022, 2024, 2026
  direction: 'down' | 'up'; // down = bad when declining, up = bad when growing
  prefix?: string;
}

const METRICS: MetricData[] = [
  { label: 'Contributors', values: [342, 185, 94], direction: 'down' },
  { label: 'Open issues', values: [89, 234, 567], direction: 'up' },
  { label: 'Monthly commits', values: [450, 210, 78], direction: 'down' },
  { label: 'Sponsors', values: [28, 12, 3], direction: 'down' },
];

// ── Mini sparkline ──
const MiniSparkline: React.FC<{
  ascending: boolean;
  color: string;
  width?: number;
  height?: number;
}> = ({ ascending, color, width = 80, height = 40 }) => {
  const points = ascending
    ? [
        { x: 0, y: height * 0.8 },
        { x: width * 0.2, y: height * 0.7 },
        { x: width * 0.4, y: height * 0.5 },
        { x: width * 0.6, y: height * 0.35 },
        { x: width * 0.8, y: height * 0.2 },
        { x: width, y: height * 0.1 },
      ]
    : [
        { x: 0, y: height * 0.1 },
        { x: width * 0.2, y: height * 0.2 },
        { x: width * 0.4, y: height * 0.4 },
        { x: width * 0.6, y: height * 0.6 },
        { x: width * 0.8, y: height * 0.75 },
        { x: width, y: height * 0.85 },
      ];

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <svg width={width} height={height}>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ── Health metric row ──
const MetricRow: React.FC<{
  metric: MetricData;
  frame: number;
  fps: number;
  startFrame: number;
  currentEra: number; // 0=2022, 1=2024, 2=2026
}> = ({ metric, frame, fps, startFrame, currentEra }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const y = interpolate(enterProgress, [0, 1], [20, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const currentValue = metric.values[currentEra];

  // Determine color based on health
  const colorMap = [COLORS.solutionGreen, COLORS.insightOrange, COLORS.errorRed];
  const metricColor = colorMap[currentEra];

  // Sparkline direction: for "down" metrics, healthy = ascending, unhealthy = descending
  // For "up" metrics (like open issues), healthy = descending (low), unhealthy = ascending (high)
  let sparkAscending: boolean;
  if (metric.direction === 'down') {
    sparkAscending = currentEra === 0; // ascending (good) only in 2022
  } else {
    sparkAscending = currentEra > 0; // ascending (bad - issues growing) in 2024+
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        opacity,
        transform: `translateY(${y}px)`,
        borderBottom: `1px solid ${COLORS.panelBorder}`,
      }}
    >
      <div style={{ flex: 1 }}>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: COLORS.textMuted,
            textTransform: 'none',
            letterSpacing: 0.5,
          }}
        >
          {metric.label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            ...TYPOGRAPHY.title,
            fontSize: 32,
            color: metricColor,
            minWidth: 80,
            textAlign: 'right',
          }}
        >
          {currentValue.toLocaleString()}
        </span>
        <MiniSparkline ascending={sparkAscending} color={metricColor} />
      </div>
    </div>
  );
};

// ── Scene3_Decline ──
export const Scene3_Decline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine current era based on frame
  let currentEra = 0;
  if (frame >= BEATS.TRANSITION_2026) currentEra = 2;
  else if (frame >= BEATS.TRANSITION_2024) currentEra = 1;

  const eraYears = ['2022', '2024', '2026'];
  const eraLabel = eraYears[currentEra];

  // Card entrance
  const cardRelFrame = frame - BEATS.CARD_IN;
  const cardProgress = cardRelFrame >= 0
    ? spring({ frame: cardRelFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);

  // Prev scene fade-out
  const fadeOutOpacity = interpolate(frame, [0, 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Border glow color transitions
  const glowColors = [COLORS.glowGreen, COLORS.glowGold, COLORS.glowRed];
  const borderColors = [COLORS.solutionGreen, COLORS.insightOrange, COLORS.errorRed];
  const currentGlow = glowColors[currentEra];
  const currentBorderColor = borderColors[currentEra];

  // Repo name color
  const repoColor = currentEra === 2 ? COLORS.errorRed : COLORS.solutionGreen;

  // Era badge
  const eraVisible = frame >= BEATS.ERA_2022;
  const eraBadgeProgress = eraVisible
    ? spring({ frame: frame - BEATS.ERA_2022, fps, config: SPRING_CONFIGS.snappy })
    : 0;

  // Critical badge
  const criticalVisible = frame >= BEATS.CRITICAL;
  const criticalProgress = criticalVisible
    ? spring({ frame: frame - BEATS.CRITICAL, fps, config: SPRING_CONFIGS.bouncy })
    : 0;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
        }}
      >
        {/* Project health card */}
        {cardRelFrame >= 0 && (
          <div
            style={{
              width: 860,
              backgroundColor: COLORS.bgSurface,
              borderRadius: 16,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: '28px 32px',
              opacity: cardOpacity,
              transform: `scale(${cardScale})`,
              boxShadow: `0 0 24px ${currentGlow}`,
              transition: 'box-shadow 0.5s',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: `1px solid ${COLORS.panelBorder}`,
              }}
            >
              <div>
                <div
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 32,
                    color: repoColor,
                    marginBottom: 8,
                  }}
                >
                  data-tools/core-lib
                </div>
                {/* Critical badge */}
                {criticalVisible && (
                  <div
                    style={{
                      display: 'inline-block',
                      opacity: criticalProgress,
                      transform: `scale(${criticalProgress})`,
                    }}
                  >
                    <GlitchText
                      startFrame={BEATS.CRITICAL}
                      intensity={0.6}
                      speed={4}
                      color={COLORS.errorRed}
                      fontSize={22}
                    >
                      CRITICAL
                    </GlitchText>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Stars */}
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 22,
                    color: COLORS.insightOrange,
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  47,200 ★
                </span>
                {/* Era badge */}
                {eraVisible && (
                  <div
                    style={{
                      backgroundColor: `${COLORS.historyGold}20`,
                      border: `1px solid ${COLORS.historyGold}`,
                      borderRadius: 6,
                      padding: '4px 12px',
                      opacity: eraBadgeProgress,
                      transform: `scale(${eraBadgeProgress})`,
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 20,
                        color: COLORS.historyGold,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {eraLabel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Forks */}
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: COLORS.textMuted,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                12.4K forks
              </span>
            </div>

            {/* Metrics */}
            {METRICS.map((metric, i) => (
              <MetricRow
                key={metric.label}
                metric={metric}
                frame={frame}
                fps={fps}
                startFrame={BEATS.METRICS_IN + i * 6}
                currentEra={currentEra}
              />
            ))}
          </div>
        )}

        {/* Caption */}
        {frame >= BEATS.CAPTION && (
          <div style={{ marginTop: 40, maxWidth: 860, textAlign: 'center' }}>
            <BlurText
              startFrame={BEATS.CAPTION}
              animateBy="words"
              staggerDelay={3}
              fontSize={40}
              color={COLORS.errorRed}
            >
              The projects AI depends on are getting weaker.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
