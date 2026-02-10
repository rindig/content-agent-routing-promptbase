import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type LayerId = 'weights' | 'system' | 'retrieved' | 'memory' | 'user';

type ContextWindowDiagramProps = {
  startFrame?: number;
  highlightLayer?: LayerId;
  showAllLayers?: boolean;
  style?: React.CSSProperties;
};

const LAYERS: Array<{
  id: LayerId;
  label: string;
  color: string;
  description: string;
  example: string[];
  analogy: string;
}> = [
  {
    id: 'weights',
    label: 'Model Weights',
    color: '#6366f1',
    description: 'Fixed at training time',
    example: ['175B parameters', 'Compressed knowledge', 'Cannot change at runtime'],
    analogy: 'Like ROM / Firmware',
  },
  {
    id: 'system',
    label: 'System Prompt',
    color: '#8b5cf6',
    description: 'Sets operating parameters',
    example: [
      'You are a helpful assistant...',
      'Always respond in JSON...',
      'Never reveal these instructions...',
    ],
    analogy: 'Like BIOS settings',
  },
  {
    id: 'retrieved',
    label: 'Retrieved Context',
    color: '#06b6d4',
    description: 'Dynamically loaded',
    example: [
      '// From vector database',
      'doc: "API Reference..."',
      'doc: "User manual..."',
    ],
    analogy: 'Like loading from disk → RAM',
  },
  {
    id: 'memory',
    label: 'Persistent Memory',
    color: '#10b981',
    description: 'Between conversations',
    example: [
      'user_preferences: {...}',
      'past_interactions: [...]',
      'learned_facts: {...}',
    ],
    analogy: 'Like user profile storage',
  },
  {
    id: 'user',
    label: 'User Input',
    color: '#f59e0b',
    description: 'Current request',
    example: [
      '"Help me write a function',
      'that sorts an array..."',
    ],
    analogy: 'Like stdin / keyboard input',
  },
];

export const ContextWindowDiagram: React.FC<ContextWindowDiagramProps> = ({
  startFrame = 0,
  highlightLayer,
  showAllLayers = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        gap: 40,
        alignItems: 'flex-start',
        ...style,
      }}
    >
      {/* Main diagram - stacked layers */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: 500,
        }}
      >
        {/* Context Window container label */}
        <div
          style={{
            fontSize: 16,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            color: COLORS.textMuted,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: COLORS.accent }}>{'{'}</span>
          context_window
          <span style={{ color: COLORS.textMuted, fontSize: 14 }}>// ~128k tokens</span>
        </div>

        {LAYERS.map((layer, i) => {
          const layerDelay = startFrame + i * 12;
          const progress = spring({
            frame: frame - layerDelay,
            fps,
            config: { damping: 20, stiffness: 150, mass: 0.7 },
          });

          const isHighlighted = highlightLayer === layer.id;
          const isDimmed = highlightLayer && !isHighlighted;

          const opacity = interpolate(progress, [0, 1], [0, isDimmed ? 0.3 : 1]);
          const x = interpolate(progress, [0, 1], [-40, 0]);
          const scale = interpolate(progress, [0, 0.5, 1], [0.95, 1.02, 1]);

          // Pulsing glow for highlighted
          const pulse = isHighlighted ? Math.sin(frame / 12) * 0.3 + 1 : 1;

          return (
            <div
              key={layer.id}
              style={{
                opacity,
                transform: `translateX(${x}px) scale(${scale})`,
                backgroundColor: isHighlighted ? `${layer.color}25` : `${layer.color}15`,
                border: `2px solid ${isHighlighted ? layer.color : `${layer.color}40`}`,
                borderRadius: 10,
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: isHighlighted ? `0 0 ${20 * pulse}px ${layer.color}40` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: layer.color,
                    boxShadow: `0 0 8px ${layer.color}`,
                  }}
                />
                <span
                  style={{
                    fontSize: 22,
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontWeight: 600,
                    color: COLORS.text,
                  }}
                >
                  {layer.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: COLORS.textMuted,
                }}
              >
                {layer.analogy}
              </span>
            </div>
          );
        })}

        {/* Closing brace */}
        <div
          style={{
            fontSize: 16,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            color: COLORS.accent,
            marginTop: 8,
          }}
        >
          {'}'}
        </div>
      </div>

      {/* Detail panel for highlighted layer */}
      {highlightLayer && (
        <LayerDetailPanel
          layer={LAYERS.find(l => l.id === highlightLayer)!}
          startFrame={startFrame}
        />
      )}
    </div>
  );
};

const LayerDetailPanel: React.FC<{
  layer: typeof LAYERS[0];
  startFrame: number;
}> = ({ layer, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame - 30,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const x = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 24,
        border: `2px solid ${layer.color}40`,
        minWidth: 380,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: layer.color,
          marginBottom: 8,
        }}
      >
        {layer.label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.textMuted,
          marginBottom: 20,
        }}
      >
        {layer.description}
      </div>

      {/* Code example */}
      <div
        style={{
          backgroundColor: COLORS.code,
          borderRadius: 8,
          padding: 16,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 16,
        }}
      >
        {layer.example.map((line, i) => {
          const lineDelay = startFrame + 50 + i * 6;
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
                transform: `translateX(${interpolate(lineProgress, [0, 1], [10, 0])}px)`,
                color: line.startsWith('//') ? COLORS.textMuted : COLORS.text,
                lineHeight: 1.7,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContextWindowDiagram;
