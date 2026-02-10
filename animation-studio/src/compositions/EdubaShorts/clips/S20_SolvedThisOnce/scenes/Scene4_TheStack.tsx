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
  LAYER_1_IN: 0,
  LAYER_STAGGER: 10,
  LAYER_2_IN: 10,
  LAYER_3_IN: 20,
  LAYER_4_IN: 30,
  AI_LAYER_IN: 40,
  SIDE_LABEL: 80,
  SOLVED_PULSE: 85,
  HOLD: 110,
};

// ── Layer data ──
interface StackLayer {
  year: string;
  label: string;
  startFrame: number;
  solved: boolean;
  width: number;
}

const LAYERS: StackLayer[] = [
  { year: '1947', label: 'Debugging', startFrame: BEATS.LAYER_1_IN, solved: true, width: 500 },
  { year: '1960s', label: 'Isolation', startFrame: BEATS.LAYER_2_IN, solved: true, width: 540 },
  { year: '1970s', label: 'TCP/IP', startFrame: BEATS.LAYER_3_IN, solved: true, width: 580 },
  { year: '1994', label: 'Validation', startFrame: BEATS.LAYER_4_IN, solved: true, width: 620 },
  { year: '2024', label: 'AI', startFrame: BEATS.AI_LAYER_IN, solved: false, width: 660 },
];

// ── Progress Spinner (3 dots cycling) ──
const ProgressSpinner: React.FC<{ frame: number }> = ({ frame }) => {
  const cycleLength = 10;
  const activeDot = Math.floor(frame / cycleLength) % 3;

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => {
        const isActive = i === activeDot;
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: COLORS.insightOrange,
              opacity: isActive ? 1 : 0.3,
              transform: isActive ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Stack Layer Bar ──
const LayerBar: React.FC<{
  layer: StackLayer;
  frame: number;
  fps: number;
  index: number;
  totalLayers: number;
  isPulsing: boolean;
  pulseDelay: number;
}> = ({ layer, frame, fps, index, totalLayers, isPulsing, pulseDelay }) => {
  const relFrame = frame - layer.startFrame;
  if (relFrame < 0) return null;

  const springConfig = layer.solved ? SPRING_CONFIGS.gentle : SPRING_CONFIGS.slow;
  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: springConfig,
  });

  const scaleX = interpolate(enterProgress, [0, 1], [0, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  const color = layer.solved ? COLORS.solutionGreen : COLORS.aiPurple;
  const bgOpacity = layer.solved ? 0.2 : 0.15;

  // Pulse glow for solved layers
  const pulseGlow = isPulsing
    ? interpolate(
        frame - (BEATS.SOLVED_PULSE + pulseDelay),
        [0, 5, 10],
        [0, 0.6, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // "IN PROGRESS" label pulsing opacity
  const inProgressPulse = !layer.solved
    ? 0.5 + 0.5 * Math.sin(relFrame * 0.12)
    : 1;

  return (
    <div
      style={{
        opacity,
        transform: `scaleX(${scaleX})`,
        transformOrigin: 'center',
        width: layer.width,
        height: 56,
        backgroundColor: `${color}${Math.round(bgOpacity * 255).toString(16).padStart(2, '0')}`,
        border: `1px solid ${color}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: pulseGlow > 0
          ? `0 0 ${20 * pulseGlow}px ${color}${Math.round(pulseGlow * 150).toString(16).padStart(2, '0')}`
          : 'none',
      }}
    >
      {/* Year + Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color,
            letterSpacing: 1,
          }}
        >
          {layer.year}
        </span>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: COLORS.textMuted,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {'\u2014'} {layer.label}
        </span>
      </div>

      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {layer.solved ? (
          <span
            style={{
              color: COLORS.solutionGreen,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {'\u2713'}
          </span>
        ) : (
          <>
            <ProgressSpinner frame={frame} />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 16,
                color: COLORS.insightOrange,
                opacity: inProgressPulse,
              }}
            >
              IN PROGRESS
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// ── Scene4_TheStack ──
export const Scene4_TheStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Side label
  const showSideLabel = frame >= BEATS.SIDE_LABEL;
  const sideLabelProgress = showSideLabel
    ? spring({
        frame: frame - BEATS.SIDE_LABEL,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;
  const sideLabelOpacity = interpolate(sideLabelProgress, [0, 1], [0, 1]);

  // Determine if solved layers should pulse
  const isPulsing = frame >= BEATS.SOLVED_PULSE;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={135}
      fadeOutDuration={15}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {/* Layer Stack — builds bottom to top */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {LAYERS.map((layer, i) => (
            <LayerBar
              key={i}
              layer={layer}
              frame={frame}
              fps={fps}
              index={i}
              totalLayers={LAYERS.length}
              isPulsing={isPulsing && layer.solved}
              pulseDelay={i * 5}
            />
          ))}
        </div>

        {/* Side label */}
        {showSideLabel && (
          <div
            style={{
              marginTop: 40,
              opacity: sideLabelOpacity,
              maxWidth: 700,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 36,
                color: COLORS.textBody,
                lineHeight: 1.4,
              }}
            >
              Every layer was once untrusted.
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
