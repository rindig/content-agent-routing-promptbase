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
  FADE_OUT: 0,
  LINE_1: 30,
  LINE_2: 70,
  DIM: 100,
  INSIGHT_1: 120,
  INSIGHT_2: 135,
  ICONS: 170,
  HOLD: 170,
  PRE_CLOSE: 240,
};

// ── Mini Constellation Icon (dense, poetry-like) ──
const DenseWebIcon: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  color: string;
  size: number;
}> = ({ frame, fps, startFrame, color, size }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Pulse at PRE_CLOSE
  const pulseFrame = frame - BEATS.PRE_CLOSE;
  const pulseScale =
    pulseFrame >= 0 && pulseFrame <= 15
      ? interpolate(
          spring({ frame: pulseFrame, fps, config: SPRING_CONFIGS.snappy }),
          [0, 1],
          [1, 1.1]
        )
      : 1;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  // Generate many connected nodes
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const nr = r * (0.6 + (i % 2) * 0.4);
    return {
      x: cx + nr * Math.cos(angle),
      y: cy + nr * Math.sin(angle),
    };
  });

  return (
    <svg
      width={size}
      height={size}
      style={{
        opacity,
        transform: `scale(${pulseScale})`,
      }}
    >
      {/* Lines from center to nodes */}
      {nodes.map((n, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke={color}
          strokeWidth={1}
          opacity={0.6}
        />
      ))}
      {/* Cross-links */}
      {nodes.map((n, i) => {
        if (i % 2 === 0 && i + 1 < nodes.length) {
          return (
            <line
              key={`x-${i}`}
              x1={n.x}
              y1={n.y}
              x2={nodes[i + 1].x}
              y2={nodes[i + 1].y}
              stroke={color}
              strokeWidth={0.5}
              opacity={0.3}
            />
          );
        }
        return null;
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.8} />
      {/* Outer nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`nd-${i}`}
          cx={n.x}
          cy={n.y}
          r={2}
          fill={color}
          opacity={0.5}
        />
      ))}
    </svg>
  );
};

// ── Sparse Web Icon (math-like, few connections) ──
const SparseWebIcon: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  color: string;
  size: number;
}> = ({ frame, fps, startFrame, color, size }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const pulseFrame = frame - BEATS.PRE_CLOSE;
  const pulseScale =
    pulseFrame >= 0 && pulseFrame <= 15
      ? interpolate(
          spring({ frame: pulseFrame, fps, config: SPRING_CONFIGS.snappy }),
          [0, 1],
          [1, 1.1]
        )
      : 1;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  // Only 3 nodes, sparse
  const nodes = [0, 120, 240].map((angle) => ({
    x: cx + r * Math.cos((angle * Math.PI) / 180),
    y: cy + r * Math.sin((angle * Math.PI) / 180),
  }));

  return (
    <svg
      width={size}
      height={size}
      style={{
        opacity,
        transform: `scale(${pulseScale})`,
      }}
    >
      {/* Dashed lines */}
      {nodes.map((n, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
          stroke={color}
          strokeWidth={1}
          strokeDasharray="3,3"
          opacity={0.3}
        />
      ))}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill={color} opacity={0.5} />
      {/* Sparse outer nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`snd-${i}`}
          cx={n.x}
          cy={n.y}
          r={2}
          fill={color}
          opacity={0.3}
        />
      ))}
      {/* Disconnected dot */}
      <circle cx={cx + r * 0.7} cy={cy - r * 0.5} r={1.5} fill={color} opacity={0.15} />
    </svg>
  );
};

// ── Scene4_SplitView ──
export const Scene4_SplitView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial lines dim after a beat
  const dimProgress =
    frame >= BEATS.DIM
      ? interpolate(frame, [BEATS.DIM, BEATS.DIM + 10], [1, 0.3], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  // Pre-close dim
  const preCloseOpacity =
    frame >= BEATS.PRE_CLOSE
      ? interpolate(
          frame,
          [BEATS.PRE_CLOSE, BEATS.PRE_CLOSE + 15],
          [1, 0.8],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  const showLine1 = frame >= BEATS.LINE_1;
  const showLine2 = frame >= BEATS.LINE_2;
  const showInsight1 = frame >= BEATS.INSIGHT_1;
  const showInsight2 = frame >= BEATS.INSIGHT_2;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
          opacity: preCloseOpacity,
        }}
      >
        {/* First pair of lines: "It's not smart at one / and dumb at the other." */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 900,
            textAlign: 'center',
            opacity: dimProgress,
          }}
        >
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={10}
              fontSize={56}
              fontWeight={600}
              color="#FFFFFF"
            >
              {"It's not smart at one"}
            </BlurText>
          )}

          {showLine2 && (
            <BlurText
              startFrame={BEATS.LINE_2}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={10}
              fontSize={56}
              fontWeight={600}
              color="#FFFFFF"
            >
              and dumb at the other.
            </BlurText>
          )}
        </div>

        {/* Insight pair: "One is a language problem." / "The other isn't." */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          {showInsight1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <DenseWebIcon
                frame={frame}
                fps={fps}
                startFrame={BEATS.ICONS}
                color={COLORS.aiPurple}
                size={40}
              />
              <BlurText
                startFrame={BEATS.INSIGHT_1}
                animateBy="words"
                staggerDelay={3}
                direction="bottom"
                blurAmount={10}
                fontSize={56}
                fontWeight={600}
                color={COLORS.aiPurple}
              >
                One is a language problem.
              </BlurText>
              <DenseWebIcon
                frame={frame}
                fps={fps}
                startFrame={BEATS.ICONS}
                color={COLORS.aiPurple}
                size={40}
              />
            </div>
          )}

          {showInsight2 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <SparseWebIcon
                frame={frame}
                fps={fps}
                startFrame={BEATS.ICONS}
                color={COLORS.errorRed}
                size={40}
              />
              <BlurText
                startFrame={BEATS.INSIGHT_2}
                animateBy="words"
                staggerDelay={3}
                direction="bottom"
                blurAmount={10}
                fontSize={56}
                fontWeight={600}
                color={COLORS.errorRed}
              >
                {"The other isn't."}
              </BlurText>
              <SparseWebIcon
                frame={frame}
                fps={fps}
                startFrame={BEATS.ICONS}
                color={COLORS.errorRed}
                size={40}
              />
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
