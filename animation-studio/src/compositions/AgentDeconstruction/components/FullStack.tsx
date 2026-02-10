import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * FullStack: The complete abstraction stack from quantum to AI
 * with animated icons and visual connections
 */

type StackLayer = {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  isAI?: boolean;
  isTraditional?: boolean;
};

const STACK_LAYERS: StackLayer[] = [
  { id: 'quantum', label: 'Quantum Uncertainty', sublabel: 'Probability amplitudes', color: '#EC4899', isTraditional: true },
  { id: 'electrons', label: 'Electrons', sublabel: 'Physical movement', color: '#8B5CF6', isTraditional: true },
  { id: 'transistors', label: 'Transistors', sublabel: 'Gates & switches', color: '#6366F1', isTraditional: true },
  { id: 'machine', label: 'Machine Code', sublabel: '1s and 0s', color: '#3B82F6', isTraditional: true },
  { id: 'assembly', label: 'Assembly', sublabel: 'MOV, ADD, JMP', color: '#0EA5E9', isTraditional: true },
  { id: 'system', label: 'System Languages', sublabel: 'C, Rust', color: '#14B8A6', isTraditional: true },
  { id: 'highlevel', label: 'High-Level Languages', sublabel: 'Python, JavaScript', color: '#22C55E', isTraditional: true },
  { id: 'runtime', label: 'VMs / Interpreters', sublabel: 'Bytecode, JIT', color: '#84CC16', isTraditional: true },
  { id: 'ai', label: 'AI / Semantic Layer', sublabel: 'Meaning, not syntax', color: COLORS.ai, isAI: true },
];

// Layer icons
const LayerIcon: React.FC<{ layer: StackLayer; frame: number; small?: boolean }> = ({ layer, frame, small = false }) => {
  const size = small ? 20 : 28;
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;

  // Different icons for each layer type
  const renderIcon = () => {
    switch (layer.id) {
      case 'quantum':
        const wave = Math.sin(frame * 0.15) * 3;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="10" fill="none" stroke={layer.color} strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx={14 + wave} cy="14" r="4" fill={layer.color} opacity={pulse} />
            <circle cx={14 - wave} cy="14" r="3" fill={layer.color} opacity={pulse * 0.6} />
          </svg>
        );
      case 'electrons':
        const orbit = frame * 2;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="3" fill={layer.color} />
            <ellipse cx="14" cy="14" rx="10" ry="4" fill="none" stroke={layer.color} strokeWidth="1" opacity={0.5} style={{ transform: `rotate(${orbit}deg)`, transformOrigin: 'center' }} />
            <circle cx={14 + Math.cos((orbit * Math.PI) / 180) * 10} cy={14 + Math.sin((orbit * Math.PI) / 180) * 4} r="2" fill={layer.color} />
          </svg>
        );
      case 'transistors':
        const gatePulse = Math.floor(frame / 10) % 2;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <rect x="8" y="10" width="12" height="8" rx="1" fill="none" stroke={layer.color} strokeWidth="1.5" />
            <line x1="4" y1="14" x2="8" y2="14" stroke={layer.color} strokeWidth="1.5" />
            <line x1="20" y1="14" x2="24" y2="14" stroke={layer.color} strokeWidth="1.5" />
            <line x1="14" y1="6" x2="14" y2="10" stroke={layer.color} strokeWidth="1.5" />
            <circle cx="14" cy="14" r="2" fill={layer.color} opacity={gatePulse ? 1 : 0.3} />
          </svg>
        );
      case 'machine':
        const binaryOffset = (frame % 20) * 0.5;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <text x={4 - binaryOffset} y="12" fontSize="7" fontFamily="monospace" fill={layer.color} opacity={0.8}>1010</text>
            <text x={8 - binaryOffset} y="20" fontSize="7" fontFamily="monospace" fill={layer.color} opacity={0.6}>0101</text>
          </svg>
        );
      case 'assembly':
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <text x="4" y="12" fontSize="6" fontFamily="monospace" fill={layer.color} opacity={pulse}>MOV</text>
            <text x="4" y="20" fontSize="6" fontFamily="monospace" fill={layer.color} opacity={pulse * 0.7}>JMP</text>
          </svg>
        );
      case 'system':
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <text x="4" y="16" fontSize="10" fontFamily="monospace" fill={layer.color} fontWeight="bold">C</text>
            <path d="M16 8 L22 14 L16 20" fill="none" stroke={layer.color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'highlevel':
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <text x="3" y="18" fontSize="9" fontFamily="monospace" fill={layer.color}>py</text>
            <circle cx="20" cy="14" r="5" fill="none" stroke={layer.color} strokeWidth="1.5" />
          </svg>
        );
      case 'runtime':
        const rotation = frame * 0.5;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="8" fill="none" stroke={layer.color} strokeWidth="1.5" strokeDasharray="4,2" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }} />
            <polygon points="14,8 18,14 14,20 10,14" fill={layer.color} opacity={pulse} />
          </svg>
        );
      case 'ai':
        const neuronPulse = (frame % 30) / 30;
        return (
          <svg width={size} height={size} viewBox="0 0 28 28">
            <circle cx="10" cy="10" r="3" fill={layer.color} opacity={Math.sin(frame * 0.1) * 0.3 + 0.7} />
            <circle cx="18" cy="10" r="3" fill={layer.color} opacity={Math.sin(frame * 0.1 + 1) * 0.3 + 0.7} />
            <circle cx="14" cy="18" r="3" fill={layer.color} opacity={Math.sin(frame * 0.1 + 2) * 0.3 + 0.7} />
            <line x1="10" y1="10" x2="18" y2="10" stroke={layer.color} strokeWidth="1" opacity={0.5} />
            <line x1="10" y1="10" x2="14" y2="18" stroke={layer.color} strokeWidth="1" opacity={0.5} />
            <line x1="18" y1="10" x2="14" y2="18" stroke={layer.color} strokeWidth="1" opacity={0.5} />
            <circle cx="14" cy="14" r={6 + neuronPulse * 4} fill="none" stroke={layer.color} strokeWidth="1" opacity={1 - neuronPulse} />
          </svg>
        );
      default:
        return null;
    }
  };

  return renderIcon();
};

// Corner brackets
const CornerBrackets: React.FC<{ color: string; size?: number }> = ({ color, size = 6 }) => (
  <>
    <div style={{ position: 'absolute', top: 3, left: 3, width: size, height: size, borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', top: 3, right: 3, width: size, height: size, borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 3, left: 3, width: size, height: size, borderBottom: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 3, right: 3, width: size, height: size, borderBottom: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, opacity: 0.6 }} />
  </>
);

// Internal animation for layers
const LayerInternalAnimation: React.FC<{ frame: number; color: string }> = ({ frame, color }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      borderRadius: 6,
      pointerEvents: 'none',
    }}
  >
    {/* Subtle scan line */}
    <div
      style={{
        position: 'absolute',
        left: `${((frame % 40) / 40) * 100}%`,
        top: 0,
        bottom: 0,
        width: 2,
        background: `linear-gradient(180deg, transparent, ${color}20, transparent)`,
      }}
    />
  </div>
);

// Data flow particle between layers
const DataParticle: React.FC<{ frame: number; layerIndex: number; totalLayers: number }> = ({ frame, layerIndex, totalLayers }) => {
  const cycleLength = totalLayers * 8;
  const particlePos = (frame % cycleLength) / 8;
  const currentLayer = Math.floor(particlePos);

  if (Math.abs(currentLayer - layerIndex) > 0.5) return null;

  const progress = particlePos - currentLayer;
  const yOffset = interpolate(progress, [0, 1], [0, -15]);
  const opacity = interpolate(progress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div
      style={{
        position: 'absolute',
        right: -20,
        top: '50%',
        transform: `translateY(${yOffset}px)`,
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: COLORS.textPrimary,
        boxShadow: `0 0 8px ${COLORS.textPrimary}`,
        opacity,
      }}
    />
  );
};

type FullStackProps = {
  startFrame?: number;
  buildSequence?: boolean;
  showAgentColors?: boolean;
  highlightAI?: boolean;
  showEthicsEngine?: boolean;
  glowingLayers?: string[];
  scale?: number;
};

export const FullStack: React.FC<FullStackProps> = ({
  startFrame = 0,
  buildSequence = true,
  showAgentColors = false,
  highlightAI = false,
  showEthicsEngine = false,
  glowingLayers = [],
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;

  const baseProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const getAgentOverlay = (layer: StackLayer) => {
    if (!showAgentColors) return null;
    if (layer.isAI) return { color: COLORS.ai, opacity: 0.3 };
    if (layer.id === 'runtime' || layer.id === 'highlevel') return { color: COLORS.orchestration, opacity: 0.2 };
    return { color: COLORS.dataProcessing, opacity: 0.15 };
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        position: 'relative',
      }}
    >
      {/* Connection line on the right */}
      <svg
        width={40}
        height={STACK_LAYERS.length * 46}
        style={{
          position: 'absolute',
          right: -50,
          top: showEthicsEngine ? 80 : 0,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="connection-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            {STACK_LAYERS.map((layer, i) => (
              <stop
                key={layer.id}
                offset={`${((STACK_LAYERS.length - 1 - i) / (STACK_LAYERS.length - 1)) * 100}%`}
                stopColor={layer.color}
                stopOpacity={0.5}
              />
            ))}
          </linearGradient>
        </defs>
        <line
          x1={20}
          y1={10}
          x2={20}
          y2={STACK_LAYERS.length * 46 - 10}
          stroke="url(#connection-gradient)"
          strokeWidth={2}
          strokeDasharray="4,3"
        />
      </svg>

      {/* Ethics Engine at top (optional) */}
      {showEthicsEngine && (
        <div
          style={{
            position: 'relative',
            width: 280,
            padding: '14px 20px',
            backgroundColor: `${COLORS.ethicsAccent}15`,
            border: `2px solid ${COLORS.ethicsAccent}`,
            borderRadius: 10,
            marginBottom: 16,
            textAlign: 'center',
            opacity: interpolate(
              spring({ frame: adjustedFrame - STACK_LAYERS.length * 8 - 20, fps, config: SPRING_CONFIGS.snappy }),
              [0, 1],
              [0, 1]
            ),
            overflow: 'hidden',
          }}
        >
          <LayerInternalAnimation frame={adjustedFrame} color={COLORS.ethicsAccent} />
          <CornerBrackets color={COLORS.ethicsAccent} size={8} />
          <div style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, fontWeight: 600, color: COLORS.ethicsAccent }}>
            Ethics Engine
          </div>
          <div style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>
            Built on all of this
          </div>
        </div>
      )}

      {/* Stack layers (bottom to top, rendered top to bottom) */}
      {[...STACK_LAYERS].reverse().map((layer, i) => {
        const actualIndex = STACK_LAYERS.length - 1 - i;
        const layerDelay = buildSequence ? actualIndex * 8 : 0;

        const layerProgress = spring({
          frame: adjustedFrame - layerDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const isGlowing = glowingLayers.includes(layer.id) || (highlightAI && layer.isAI);
        const agentOverlay = getAgentOverlay(layer);

        const baseWidth = 200;
        const widthIncrease = actualIndex * 22;
        const width = baseWidth + widthIncrease;

        return (
          <div
            key={layer.id}
            style={{
              position: 'relative',
              width,
              padding: '10px 16px',
              backgroundColor: `${layer.color}15`,
              border: `2px solid ${layer.color}`,
              borderRadius: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: interpolate(layerProgress, [0, 1], [0, 1]),
              transform: `
                translateY(${interpolate(layerProgress, [0, 1], [20, 0])}px)
                scale(${interpolate(layerProgress, [0, 1], [0.9, 1])})
              `,
              boxShadow: isGlowing
                ? `0 0 20px ${layer.color}60, inset 0 0 15px ${layer.color}30`
                : `0 0 8px ${layer.color}20`,
              overflow: 'hidden',
            }}
          >
            <LayerInternalAnimation frame={adjustedFrame} color={layer.color} />
            <CornerBrackets color={layer.color} />

            {/* Agent color overlay */}
            {agentOverlay && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: agentOverlay.color,
                  opacity: agentOverlay.opacity,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Icon */}
            <div style={{ position: 'relative', marginRight: 8 }}>
              <LayerIcon layer={layer} frame={adjustedFrame} small />
            </div>

            {/* Label */}
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: layer.isAI ? 14 : 12,
                fontWeight: layer.isAI ? 700 : 500,
                color: layer.color,
                position: 'relative',
                flex: 1,
              }}
            >
              {layer.label}
            </div>

            {/* Sublabel */}
            {layer.sublabel && (
              <div
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 9,
                  color: COLORS.textMuted,
                  position: 'relative',
                }}
              >
                {layer.sublabel}
              </div>
            )}

            {/* AI badge */}
            {layer.isAI && (
              <div
                style={{
                  position: 'absolute',
                  right: 6,
                  top: 6,
                  padding: '3px 8px',
                  backgroundColor: COLORS.ai,
                  borderRadius: 6,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 8,
                  fontWeight: 700,
                  color: COLORS.background,
                  boxShadow: `0 0 8px ${COLORS.ai}80`,
                }}
              >
                NEW
              </div>
            )}

            {/* Data flow particle */}
            <DataParticle frame={adjustedFrame} layerIndex={actualIndex} totalLayers={STACK_LAYERS.length} />
          </div>
        );
      })}

      {/* Foundation label */}
      <div
        style={{
          marginTop: 16,
          opacity: interpolate(
            spring({ frame: adjustedFrame - STACK_LAYERS.length * 8, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 14, color: COLORS.textMuted }}>
          ↑ Every layer depends on those below
        </span>
      </div>
    </div>
  );
};

export default FullStack;
