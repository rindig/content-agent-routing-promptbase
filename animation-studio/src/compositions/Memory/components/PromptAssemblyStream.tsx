import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type PromptAssemblyStreamProps = {
  startFrame?: number;
  showMerge?: boolean;
  mergeFrame?: number;
  style?: React.CSSProperties;
};

// Source streams that will merge - simplified for cleaner visual
const STREAMS: Array<{
  id: string;
  label: string;
  color: string;
  content: string;
  type: 'code' | 'data';
}> = [
  {
    id: 'system',
    label: 'System Prompt',
    color: '#8b5cf6',
    content: 'You are a helpful assistant...',
    type: 'code',
  },
  {
    id: 'retrieved',
    label: 'Retrieved Docs',
    color: '#06b6d4',
    content: 'API Reference: POST /users',
    type: 'data',
  },
  {
    id: 'memory',
    label: 'Memory',
    color: '#10b981',
    content: 'User prefers: dark mode',
    type: 'data',
  },
  {
    id: 'user',
    label: 'User Input',
    color: '#f59e0b',
    content: '"Help me write a function..."',
    type: 'data',
  },
];

export const PromptAssemblyStream: React.FC<PromptAssemblyStreamProps> = ({
  startFrame = 0,
  showMerge = false,
  mergeFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Merge animation progress
  const mergeProgress = showMerge
    ? spring({
        frame: frame - mergeFrame,
        fps,
        config: { damping: 20, stiffness: 80, mass: 1.2 },
      })
    : 0;

  // Container scale during merge
  const containerScale = interpolate(mergeProgress, [0, 1], [1, 0.85]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${containerScale})`,
        ...style,
      }}
    >
      {/* Streams stacked vertically, centered */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: interpolate(mergeProgress, [0, 1], [12, 0]),
          alignItems: 'center',
        }}
      >
        {STREAMS.map((stream, i) => {
          const streamDelay = startFrame + i * 12;
          const streamProgress = spring({
            frame: frame - streamDelay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          // Each stream collapses towards center during merge
          const yOffset = interpolate(
            mergeProgress,
            [0, 1],
            [0, (i - 1.5) * -20] // Collapse towards middle
          );

          const streamOpacity = interpolate(
            mergeProgress,
            [0, 0.6, 1],
            [1, 1, 0]
          );

          const baseOpacity = interpolate(streamProgress, [0, 1], [0, 1]);
          const baseX = interpolate(streamProgress, [0, 1], [-30, 0]);

          return (
            <div
              key={stream.id}
              style={{
                opacity: baseOpacity * streamOpacity,
                transform: `translateX(${baseX}px) translateY(${yOffset}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Stream card */}
              <div
                style={{
                  backgroundColor: `${stream.color}15`,
                  border: `2px solid ${stream.color}`,
                  borderRadius: 12,
                  padding: '14px 24px',
                  minWidth: 380,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: stream.color,
                      boxShadow: `0 0 8px ${stream.color}`,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 20,
                      fontFamily: TYPOGRAPHY.display.fontFamily,
                      fontWeight: 600,
                      color: stream.color,
                    }}
                  >
                    {stream.label}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 12,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    color: stream.type === 'code' ? '#c678dd' : '#98c379',
                    backgroundColor: stream.type === 'code' ? '#c678dd20' : '#98c37920',
                    padding: '4px 10px',
                    borderRadius: 4,
                  }}
                >
                  {stream.type}
                </span>
              </div>

              {/* Flowing arrow */}
              <FlowingArrow color={stream.color} delay={streamDelay + 20} mergeProgress={mergeProgress} />
            </div>
          );
        })}
      </div>

      {/* Merged result - appears as streams fade */}
      <div
        style={{
          position: 'absolute',
          opacity: interpolate(mergeProgress, [0.5, 1], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `scale(${interpolate(mergeProgress, [0.5, 1], [0.8, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })})`,
        }}
      >
        <MergedResult startFrame={mergeFrame + 30} />
      </div>
    </div>
  );
};

// Animated flowing arrow
const FlowingArrow: React.FC<{ color: string; delay: number; mergeProgress: number }> = ({
  color,
  delay,
  mergeProgress,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.7]) * interpolate(mergeProgress, [0, 0.5], [1, 0]);

  // Animated dash
  const dashOffset = (frame - delay) * 0.5;

  return (
    <svg width="60" height="24" style={{ opacity }}>
      <defs>
        <linearGradient id={`arrow-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <line
        x1="0"
        y1="12"
        x2="45"
        y2="12"
        stroke={`url(#arrow-grad-${color})`}
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeDashoffset={-dashOffset}
      />
      <path
        d="M40 7 L50 12 L40 17"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

// The merged result panel
const MergedResult: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { text: 'You are a helpful assistant.', color: '#8b5cf6' },
    { text: 'API Reference: POST /users', color: '#06b6d4' },
    { text: 'User prefers: dark mode', color: '#10b981' },
    { text: '"Help me write a function..."', color: '#f59e0b' },
  ];

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 28,
        border: `3px solid ${COLORS.accent}`,
        boxShadow: `0 0 50px ${COLORS.accent}30`,
        minWidth: 500,
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.accent,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        Single Text Stream
      </div>

      <div
        style={{
          backgroundColor: COLORS.code,
          borderRadius: 10,
          padding: 16,
        }}
      >
        {lines.map((line, i) => {
          const lineDelay = startFrame + i * 8;
          const lineProgress = spring({
            frame: frame - lineDelay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={i}
              style={{
                opacity: interpolate(lineProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(lineProgress, [0, 1], [20, 0])}px)`,
                padding: '10px 14px',
                marginBottom: i < lines.length - 1 ? 6 : 0,
                borderLeft: `3px solid ${line.color}`,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 17,
                color: COLORS.text,
                backgroundColor: `${line.color}08`,
                borderRadius: '0 6px 6px 0',
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          fontSize: 15,
          color: COLORS.textMuted,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        No boundary between code & data
      </div>
    </div>
  );
};

export default PromptAssemblyStream;
