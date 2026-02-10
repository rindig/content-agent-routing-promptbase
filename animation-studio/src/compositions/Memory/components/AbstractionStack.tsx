import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type StackLayer = {
  id: string;
  label: string;
  detail?: string;
  color: string;
  icon?: string;
  isHighlighted?: boolean;
};

const FULL_STACK: StackLayer[] = [
  {
    id: 'quantum',
    label: 'Quantum Uncertainty',
    detail: 'Probability waves',
    color: '#6366f1',
    icon: '⚛️',
  },
  {
    id: 'electrons',
    label: 'Electrons',
    detail: 'Electrical signals',
    color: '#8b5cf6',
    icon: '⚡',
  },
  {
    id: 'transistors',
    label: 'Transistors',
    detail: 'Logic gates',
    color: '#a855f7',
    icon: '🔌',
  },
  {
    id: 'machine',
    label: 'Machine Code',
    detail: 'Binary instructions',
    color: '#d946ef',
    icon: '0️⃣',
  },
  {
    id: 'assembly',
    label: 'Assembly',
    detail: 'Human-readable opcodes',
    color: '#ec4899',
    icon: '📝',
  },
  {
    id: 'c',
    label: 'C / System Languages',
    detail: 'Portable code',
    color: '#f43f5e',
    icon: '⚙️',
  },
  {
    id: 'highlevel',
    label: 'High-Level Languages',
    detail: 'Abstracted memory',
    color: '#f97316',
    icon: '🐍',
  },
  {
    id: 'vm',
    label: 'VMs / Interpreters',
    detail: 'Platform independent',
    color: '#eab308',
    icon: '📦',
  },
  {
    id: 'semantic',
    label: 'AI / Semantic Layer',
    detail: 'Natural language interface',
    color: '#22c55e',
    icon: '🧠',
    isHighlighted: true,
  },
];

type AbstractionStackProps = {
  startFrame?: number;
  /** Frames between each layer appearing */
  layerDelay?: number;
  /** Build from bottom to top */
  buildUp?: boolean;
  /** Show the top (AI) layer as "under construction" */
  showConstruction?: boolean;
  /** Scale factor for the whole stack */
  scale?: number;
  style?: React.CSSProperties;
};

export const AbstractionStack: React.FC<AbstractionStackProps> = ({
  startFrame = 0,
  layerDelay = 20,
  buildUp = true,
  showConstruction = true,
  scale = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Layers in build order (bottom to top)
  const orderedLayers = buildUp ? [...FULL_STACK] : [...FULL_STACK].reverse();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {/* Stack container - reversed visually so bottom layers appear at bottom */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 6,
          perspective: 1000,
        }}
      >
        {orderedLayers.map((layer, i) => {
          const layerStart = startFrame + i * layerDelay;
          const layerProgress = spring({
            frame: frame - layerStart,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const isTopLayer = layer.isHighlighted;
          const isVisible = frame >= layerStart;

          // Construction animation for top layer
          const constructionPulse = isTopLayer && showConstruction
            ? 1 + Math.sin((frame - layerStart) * 0.08) * 0.03
            : 1;

          // Width narrows as we go up (pyramid effect)
          const layerIndex = FULL_STACK.indexOf(layer);
          const baseWidth = 600;
          const widthReduction = layerIndex * 30;
          const layerWidth = baseWidth - widthReduction;

          return (
            <div
              key={layer.id}
              style={{
                opacity: interpolate(layerProgress, [0, 1], [0, 1]),
                transform: `
                  translateY(${interpolate(layerProgress, [0, 1], [30, 0])}px)
                  scale(${constructionPulse})
                `,
                width: layerWidth,
                padding: '16px 24px',
                backgroundColor: `${layer.color}20`,
                border: `2px solid ${layer.color}`,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isTopLayer
                  ? `0 0 30px ${layer.color}40, inset 0 0 20px ${layer.color}10`
                  : `0 4px 15px rgba(0,0,0,0.3)`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Construction stripes for top layer */}
              {isTopLayer && showConstruction && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      ${layer.color}10 10px,
                      ${layer.color}10 20px
                    )`,
                    animation: 'none',
                    opacity: 0.5,
                  }}
                />
              )}

              {/* Left side: Icon + Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, zIndex: 1 }}>
                <span style={{ fontSize: 24 }}>{layer.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: isTopLayer ? 22 : 18,
                      fontFamily: TYPOGRAPHY.display.fontFamily,
                      fontWeight: isTopLayer ? 700 : 600,
                      color: isTopLayer ? layer.color : COLORS.textPrimary,
                    }}
                  >
                    {layer.label}
                  </div>
                  {layer.detail && (
                    <div
                      style={{
                        fontSize: 13,
                        fontFamily: TYPOGRAPHY.body.fontFamily,
                        color: COLORS.textMuted,
                        marginTop: 2,
                      }}
                    >
                      {layer.detail}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Construction badge for top layer */}
              {isTopLayer && showConstruction && (
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontWeight: 600,
                    color: COLORS.background,
                    backgroundColor: layer.color,
                    padding: '6px 12px',
                    borderRadius: 20,
                    zIndex: 1,
                  }}
                >
                  BUILDING NOW
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Foundation indicator at bottom */}
      <div
        style={{
          marginTop: 20,
          fontSize: 14,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textMuted,
          opacity: interpolate(
            spring({
              frame: frame - startFrame - FULL_STACK.length * layerDelay,
              fps,
              config: SPRING_CONFIGS.gentle,
            }),
            [0, 1],
            [0, 0.7]
          ),
        }}
      >
        ↑ Each layer trusts the one below it
      </div>
    </div>
  );
};

/**
 * Simplified stack view showing just the key insight:
 * everything is built on uncertain foundations
 */
export const StackInsight: React.FC<{
  startFrame?: number;
  message?: string;
}> = ({
  startFrame = 0,
  message = 'Built on quantum uncertainty, made reliable through engineering',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Simplified 3-layer view
  const layers = [
    { label: 'AI / Semantic', color: '#22c55e', opacity: 1 },
    { label: '...layers of abstraction...', color: COLORS.textMuted, opacity: 0.5 },
    { label: 'Quantum Uncertainty', color: '#6366f1', opacity: 1 },
  ];

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {layers.map((layer, i) => (
        <div
          key={i}
          style={{
            fontSize: i === 1 ? 16 : 20,
            fontFamily: i === 1 ? TYPOGRAPHY.body.fontFamily : TYPOGRAPHY.display.fontFamily,
            fontWeight: i === 1 ? 400 : 600,
            color: layer.color,
            opacity: layer.opacity,
            fontStyle: i === 1 ? 'italic' : 'normal',
          }}
        >
          {layer.label}
        </div>
      ))}

      <div
        style={{
          marginTop: 30,
          fontSize: 24,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.textPrimary,
          textAlign: 'center',
          maxWidth: 600,
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default AbstractionStack;
