import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  CRASH_GRAPH_GHOST: 30,
  CLIMB_GRAPH_GHOST: 50,
  COMPARISON_LABEL: 68,
  GRAPHS_FADE: 80,
  CLOSING_LINE_1: 100,
  CLOSING_LINE_2: 125,
  CLOSING_COMPLETE: 140,
  HOLD_START: 140,
  FADE_OUT: 215,
};

// ── Crash data (from Scene 1) ──
const CRASH_DATA = [0, 85, 92, 78, 45, 22, 10, 5, 3, 2];
// ── Climb data (from Scene 4) ──
const CLIMB_DATA = [0, 8, 15, 22, 30, 38, 45, 52, 58, 63, 68, 72];

// ── Ghost Graph (minimal, dim silhouette) ──
const GhostGraph: React.FC<{
  data: number[];
  lineColor: string;
  lineOpacity: number;
  frame: number;
  fps: number;
  startFrame: number;
  width?: number;
  height?: number;
}> = ({
  data,
  lineColor,
  lineOpacity,
  frame,
  fps,
  startFrame,
  width = 500,
  height = 200,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, lineOpacity]);

  const pad = 10;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  const maxVal = Math.max(...data);

  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * plotW;
    const y = pad + plotH - (val / maxVal) * plotH;
    return { x, y };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Quick draw
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const drawProgress = interpolate(
    relFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const dashOffset = totalLength * (1 - drawProgress);

  // Fade out the ghost graphs
  const fadeOut = interpolate(
    frame,
    [BEATS.GRAPHS_FADE, BEATS.GRAPHS_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        opacity: opacity * fadeOut,
      }}
    >
      <svg width={width} height={height}>
        <path
          d={pathD}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={dashOffset}
        />
      </svg>
    </div>
  );
};

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Comparison label
  const labelProgress = spring({
    frame: Math.max(0, frame - BEATS.COMPARISON_LABEL),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelFade = interpolate(
    frame,
    [BEATS.GRAPHS_FADE, BEATS.GRAPHS_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Show closing text
  const showLine1 = frame >= BEATS.CLOSING_LINE_1;
  const showLine2 = frame >= BEATS.CLOSING_LINE_2;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={45}
      fadeOut
      fadeOutStart={215}
      fadeOutDuration={25}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 16,
        }}
      >
        {/* Ghost graphs section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Spike-and-crash ghost */}
          <GhostGraph
            data={CRASH_DATA}
            lineColor={COLORS.textDim}
            lineOpacity={0.2}
            frame={frame}
            fps={fps}
            startFrame={BEATS.CRASH_GRAPH_GHOST}
          />

          {/* Steady climb ghost */}
          <GhostGraph
            data={CLIMB_DATA}
            lineColor={COLORS.solutionGreen}
            lineOpacity={0.25}
            frame={frame}
            fps={fps}
            startFrame={BEATS.CLIMB_GRAPH_GHOST}
          />

          {/* Comparison label */}
          {frame >= BEATS.COMPARISON_LABEL && (
            <div
              style={{
                opacity: labelOpacity * labelFade,
                marginTop: 4,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.insightOrange,
                }}
              >
                SAME TECHNOLOGY. DIFFERENT APPROACH.
              </span>
            </div>
          )}
        </div>

        {/* Closing statement */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            maxWidth: 860,
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          {/* Line 1: "Start with the problem." */}
          {showLine1 && (
            <BlurText
              startFrame={BEATS.CLOSING_LINE_1}
              animateBy="words"
              staggerDelay={4}
              direction="bottom"
              blurAmount={10}
              fontSize={52}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              Start with the problem.
            </BlurText>
          )}

          {/* Line 2: "Not the tool." */}
          {showLine2 && (
            <BlurText
              startFrame={BEATS.CLOSING_LINE_2}
              animateBy="words"
              staggerDelay={4}
              direction="bottom"
              blurAmount={8}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textBody}
            >
              Not the tool.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
