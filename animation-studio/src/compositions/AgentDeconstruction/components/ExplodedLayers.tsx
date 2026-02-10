import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

/**
 * SVG Icons for each layer - custom designed, no emojis
 */
const AIIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  // Pulsing neural network nodes
  const pulse1 = Math.sin(frame * 0.15) * 0.3 + 0.7;
  const pulse2 = Math.sin(frame * 0.15 + 1) * 0.3 + 0.7;
  const pulse3 = Math.sin(frame * 0.15 + 2) * 0.3 + 0.7;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Neural connections */}
      <line x1="12" y1="24" x2="24" y2="12" stroke={color} strokeWidth="2" opacity={0.4} />
      <line x1="12" y1="24" x2="24" y2="36" stroke={color} strokeWidth="2" opacity={0.4} />
      <line x1="24" y1="12" x2="36" y2="24" stroke={color} strokeWidth="2" opacity={0.4} />
      <line x1="24" y1="36" x2="36" y2="24" stroke={color} strokeWidth="2" opacity={0.4} />
      <line x1="24" y1="12" x2="24" y2="36" stroke={color} strokeWidth="2" opacity={0.3} />

      {/* Nodes with pulsing */}
      <circle cx="12" cy="24" r="6" fill={color} opacity={pulse1} />
      <circle cx="24" cy="12" r="5" fill={color} opacity={pulse2} />
      <circle cx="24" cy="36" r="5" fill={color} opacity={pulse3} />
      <circle cx="36" cy="24" r="6" fill={color} opacity={pulse1} />
      <circle cx="24" cy="24" r="4" fill={color} opacity={pulse2} />

      {/* Glow effect */}
      <circle cx="24" cy="24" r="8" fill="none" stroke={color} strokeWidth="1" opacity={0.3}>
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};

const OrchestrationIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  // Flowing data dots
  const flowOffset = (frame * 2) % 40;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Circuit board pattern */}
      <path
        d="M8 24 L16 24 L16 16 L24 16 L24 8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
      />
      <path
        d="M40 24 L32 24 L32 32 L24 32 L24 40"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.5}
      />
      <path
        d="M8 24 L16 24 L16 32 L24 32 L24 40"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.3}
      />

      {/* Center hub */}
      <rect x="20" y="20" width="8" height="8" fill={color} opacity={0.8} rx="2" />

      {/* Flowing dots */}
      <circle cx={8 + flowOffset * 0.4} cy="24" r="3" fill={color} opacity={0.9} />
      <circle cx={40 - flowOffset * 0.4} cy="24" r="3" fill={color} opacity={0.9} />

      {/* Connection nodes */}
      <circle cx="8" cy="24" r="3" fill={color} opacity={0.6} />
      <circle cx="40" cy="24" r="3" fill={color} opacity={0.6} />
      <circle cx="24" cy="8" r="3" fill={color} opacity={0.6} />
      <circle cx="24" cy="40" r="3" fill={color} opacity={0.6} />
    </svg>
  );
};

const DataIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  // Animated bar chart
  const bar1 = 10 + Math.sin(frame * 0.1) * 5;
  const bar2 = 18 + Math.sin(frame * 0.1 + 1) * 4;
  const bar3 = 14 + Math.sin(frame * 0.1 + 2) * 6;
  const bar4 = 22 + Math.sin(frame * 0.1 + 3) * 3;

  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      {/* Grid lines */}
      <line x1="8" y1="40" x2="40" y2="40" stroke={color} strokeWidth="1" opacity={0.3} />
      <line x1="8" y1="30" x2="40" y2="30" stroke={color} strokeWidth="1" opacity={0.15} strokeDasharray="2,2" />
      <line x1="8" y1="20" x2="40" y2="20" stroke={color} strokeWidth="1" opacity={0.15} strokeDasharray="2,2" />

      {/* Animated bars */}
      <rect x="10" y={40 - bar1} width="6" height={bar1} fill={color} opacity={0.7} rx="1" />
      <rect x="18" y={40 - bar2} width="6" height={bar2} fill={color} opacity={0.8} rx="1" />
      <rect x="26" y={40 - bar3} width="6" height={bar3} fill={color} opacity={0.75} rx="1" />
      <rect x="34" y={40 - bar4} width="6" height={bar4} fill={color} opacity={0.85} rx="1" />

      {/* Data points flowing */}
      {[0, 1, 2].map((i) => {
        const x = 12 + ((frame * 0.5 + i * 15) % 30);
        const y = 8 + Math.sin(x * 0.3) * 3;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill={color}
            opacity={0.6}
          />
        );
      })}
    </svg>
  );
};

/**
 * Internal layer animation component - adds visual interest inside each card
 */
const LayerInternalAnimation: React.FC<{
  type: 'ai' | 'orchestration' | 'data';
  color: string;
  frame: number;
  width: number;
}> = ({ type, color, frame, width }) => {
  if (type === 'ai') {
    // Floating thought particles
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.15 }}>
        {[...Array(8)].map((_, i) => {
          const x = ((frame * 0.5 + i * 50) % (width + 40)) - 20;
          const y = 20 + Math.sin(frame * 0.05 + i) * 15;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>
    );
  }

  if (type === 'orchestration') {
    // Flowing arrows/queue visualization
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.12 }}>
        {[...Array(6)].map((_, i) => {
          const x = ((frame * 1.5 + i * 80) % (width + 60)) - 30;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'monospace',
                fontSize: 16,
                color: color,
              }}
            >
              →
            </div>
          );
        })}
      </div>
    );
  }

  // Data - binary/numbers flowing
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.1 }}>
      {[...Array(12)].map((_, i) => {
        const x = ((frame * 0.8 + i * 60) % (width + 80)) - 40;
        const y = 10 + (i % 3) * 20;
        const char = i % 2 === 0 ? '0' : '1';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontFamily: 'monospace',
              fontSize: 14,
              color: color,
              fontWeight: 600,
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};

type Layer = {
  id: 'ai' | 'orchestration' | 'data';
  label: string;
  detail: string;
  percentage: number;
  color: string;
};

const AGENT_LAYERS: Layer[] = [
  {
    id: 'ai',
    label: 'AI / Model Inference',
    detail: 'Prompt → Text response',
    percentage: 10,
    color: COLORS.ai,
  },
  {
    id: 'orchestration',
    label: 'Orchestration Layer',
    detail: 'Async, rate limits, queues, retries',
    percentage: 30,
    color: COLORS.orchestration,
  },
  {
    id: 'data',
    label: 'Data Processing',
    detail: 'Parsing, scoring, statistics',
    percentage: 60,
    color: COLORS.dataProcessing,
  },
];

type ExplodedLayersProps = {
  startFrame?: number;
  explodeAmount?: number;
  showPercentages?: boolean;
  scale?: number;
  highlightLayer?: 'ai' | 'orchestration' | 'data' | null;
  style?: React.CSSProperties;
};

export const ExplodedLayers: React.FC<ExplodedLayersProps> = ({
  startFrame = 0,
  explodeAmount = 0,
  showPercentages = false,
  scale = 1,
  highlightLayer = null,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const explodeOffsets = [-180, 0, 180];

  // Render the appropriate icon
  const renderIcon = (layer: Layer) => {
    switch (layer.id) {
      case 'ai':
        return <AIIcon color={layer.color} frame={frame} />;
      case 'orchestration':
        return <OrchestrationIcon color={layer.color} frame={frame} />;
      case 'data':
        return <DataIcon color={layer.color} frame={frame} />;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        ...style,
      }}
    >
      {AGENT_LAYERS.map((layer, i) => {
        const layerDelay = startFrame + i * 15;
        const layerProgress = spring({
          frame: frame - layerDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const explodeOffset = explodeOffsets[i] * explodeAmount;
        const isHighlighted = highlightLayer === layer.id || highlightLayer === null;
        const dimmed = highlightLayer !== null && !isHighlighted;

        // Width proportional to percentage
        const baseWidth = 500;
        const width = baseWidth + (layer.percentage / 100) * 200;

        // Subtle breathing animation
        const breathe = 1 + Math.sin(frame * 0.03 + i) * 0.01;

        return (
          <div
            key={layer.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: dimmed ? 0.3 : interpolate(layerProgress, [0, 1], [0, 1]),
              transform: `
                translateY(${interpolate(layerProgress, [0, 1], [40, explodeOffset])}px)
                scale(${(isHighlighted && highlightLayer ? 1.05 : 1) * breathe})
              `,
            }}
          >
            {/* Layer card */}
            <div
              style={{
                position: 'relative',
                width,
                padding: '24px 32px',
                backgroundColor: `${layer.color}12`,
                border: `2px solid ${layer.color}80`,
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                boxShadow: isHighlighted && highlightLayer
                  ? `0 0 40px ${layer.color}40, inset 0 0 30px ${layer.color}10`
                  : `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${layer.color}20`,
                overflow: 'hidden',
              }}
            >
              {/* Internal animation layer */}
              <LayerInternalAnimation
                type={layer.id}
                color={layer.color}
                frame={frame}
                width={width}
              />

              {/* Scan line effect */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${((frame + i * 30) % 100)}%`,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${layer.color}30, transparent)`,
                }}
              />

              {/* SVG Icon */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {renderIcon(layer)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontSize: 24,
                    fontWeight: 700,
                    color: layer.color,
                    marginBottom: 4,
                    textShadow: `0 0 20px ${layer.color}30`,
                  }}
                >
                  {layer.label}
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 14,
                    color: COLORS.textMuted,
                    letterSpacing: 0.5,
                  }}
                >
                  {layer.detail}
                </div>
              </div>

              {/* Percentage badge */}
              {showPercentages && (
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: TYPOGRAPHY.stats.fontFamily,
                    fontSize: 36,
                    fontWeight: 700,
                    color: layer.color,
                    textShadow: `0 0 30px ${layer.color}50`,
                    opacity: interpolate(
                      spring({
                        frame: frame - layerDelay - 20,
                        fps,
                        config: SPRING_CONFIGS.bouncy,
                      }),
                      [0, 1],
                      [0, 1]
                    ),
                  }}
                >
                  {layer.percentage}%
                </div>
              )}

              {/* Corner accents */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 12,
                  height: 12,
                  borderTop: `2px solid ${layer.color}50`,
                  borderLeft: `2px solid ${layer.color}50`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 12,
                  height: 12,
                  borderBottom: `2px solid ${layer.color}50`,
                  borderRight: `2px solid ${layer.color}50`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Connection lines between layers when exploded */}
      {explodeAmount > 0.3 && (
        <svg
          width="20"
          height="400"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: interpolate(explodeAmount, [0.3, 0.6], [0, 0.4]),
          }}
        >
          <line
            x1="10"
            y1="40"
            x2="10"
            y2="160"
            stroke={COLORS.textMuted}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <line
            x1="10"
            y1="240"
            x2="10"
            y2="360"
            stroke={COLORS.textMuted}
            strokeWidth="2"
            strokeDasharray="4,4"
          />
        </svg>
      )}
    </div>
  );
};

/**
 * Compact horizontal ratio bar showing the 60/30/10 split
 * Enhanced with corner brackets, scan lines, type badges, and animations
 */
export const RatioBar: React.FC<{
  startFrame?: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
  animated?: boolean;
}> = ({
  startFrame = 0,
  width = 800,
  height = 80,
  showLabels = true,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const segments = [
    { width: 60, color: COLORS.dataProcessing, label: 'Data Processing', badge: 'DATA' },
    { width: 30, color: COLORS.orchestration, label: 'Orchestration', badge: 'CODE' },
    { width: 10, color: COLORS.ai, label: 'AI', badge: 'AI' },
  ];

  // Scan line position
  const scanX = ((frame * 3) % (width + 100)) - 50;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        opacity: interpolate(containerProgress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(containerProgress, [0, 1], [30, 0])}px)`,
      }}
    >
      {/* Main bar container with corner brackets */}
      <div
        style={{
          position: 'relative',
          padding: 12,
          backgroundColor: `${COLORS.surface}80`,
          border: `2px solid ${COLORS.textDim}60`,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: 'absolute', top: 6, left: 6, width: 14, height: 14, borderTop: `2px solid ${COLORS.accent}`, borderLeft: `2px solid ${COLORS.accent}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, borderTop: `2px solid ${COLORS.accent}`, borderRight: `2px solid ${COLORS.accent}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 6, left: 6, width: 14, height: 14, borderBottom: `2px solid ${COLORS.accent}`, borderLeft: `2px solid ${COLORS.accent}`, opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 14, height: 14, borderBottom: `2px solid ${COLORS.accent}`, borderRight: `2px solid ${COLORS.accent}`, opacity: 0.6 }} />

        {/* Horizontal scan line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: scanX,
            width: 3,
            background: `linear-gradient(180deg, transparent, ${COLORS.accent}60, transparent)`,
            filter: 'blur(2px)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* The actual bar */}
        <div
          style={{
            width: width - 24,
            height,
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: `${COLORS.background}80`,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
          }}
        >
          {segments.map((seg, i) => {
            const segmentDelay = i * 15;
            const segmentProgress = spring({
              frame: frame - startFrame - segmentDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const segWidth = animated
              ? interpolate(segmentProgress, [0, 1], [0, seg.width])
              : seg.width;

            // Each segment has its own internal animation
            const pulseIntensity = Math.sin(frame * 0.08 + i * 2) * 0.15 + 0.85;
            const internalScanY = ((frame * 2 + i * 30) % 100);

            return (
              <div
                key={seg.label}
                style={{
                  position: 'relative',
                  width: `${segWidth}%`,
                  height: '100%',
                  backgroundColor: seg.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  opacity: pulseIntensity,
                  boxShadow: `inset 0 0 20px ${seg.color}40`,
                }}
              >
                {/* Internal scan line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${internalScanY}%`,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Gradient overlay for depth */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)`,
                    pointerEvents: 'none',
                  }}
                />

                {/* Type badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 8,
                    padding: '3px 8px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 4,
                    opacity: segWidth > 8 ? interpolate(segmentProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontSize: 9,
                      fontWeight: 700,
                      color: seg.color,
                      letterSpacing: 1,
                    }}
                  >
                    {seg.badge}
                  </span>
                </div>

                {/* Percentage in center */}
                {showLabels && segWidth > 12 && (
                  <span
                    style={{
                      position: 'relative',
                      fontFamily: TYPOGRAPHY.stats.fontFamily,
                      fontSize: height * 0.45,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textShadow: `0 2px 8px rgba(0,0,0,0.5), 0 0 20px ${seg.color}60`,
                      opacity: interpolate(segmentProgress, [0.7, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    }}
                  >
                    {seg.width}%
                  </span>
                )}

                {/* Divider line */}
                {i < segments.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '10%',
                      bottom: '10%',
                      width: 2,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels below with animated entry */}
      {showLabels && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 50,
          }}
        >
          {segments.map((seg, i) => {
            const labelProgress = spring({
              frame: frame - startFrame - 30 - i * 8,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={seg.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  opacity: interpolate(labelProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(labelProgress, [0, 1], [15, 0])}px)`,
                }}
              >
                {/* Animated indicator dot */}
                <div
                  style={{
                    position: 'relative',
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: seg.color,
                    boxShadow: `0 0 12px ${seg.color}80`,
                  }}
                >
                  {/* Pulsing ring */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: 6,
                      border: `1px solid ${seg.color}`,
                      opacity: Math.sin(frame * 0.1 + i) * 0.3 + 0.3,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 15,
                    color: COLORS.textSecondary,
                    fontWeight: 500,
                  }}
                >
                  {seg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExplodedLayers;
