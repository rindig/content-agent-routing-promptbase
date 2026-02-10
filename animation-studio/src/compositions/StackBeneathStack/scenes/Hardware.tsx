import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';
import { LayerStack } from '../components/LayerStack';

/**
 * SCENE 8: THE HARDWARE (Section 7)
 * Duration: 45 seconds (1350 frames)
 *
 * CPU micro-operations. Abstract hardware visualization.
 * This is the final layer - and a major transition point.
 * After this, we go backward in time to explore the philosophical question.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-60   | Layer stack shows all software layers complete |
 * | 60-200 | Pipeline stages appear one by one |
 * | 200-450| Pipeline animation loop - signal flows through |
 * | 450-600| "Billions of transistors" - circuit zoom effect |
 * | 600-800| Electron particle effects appear |
 * | 800-950| "Philosophically interesting" - dramatic pause |
 * | 950-1150| Everything fades, "going back in time" text |
 * | 1150-1350| Fade to warm sepia hint - transition to Loom |
 */

// Pipeline stages
const PIPELINE_STAGES = [
  { name: 'Fetch', description: 'Get instruction' },
  { name: 'Decode', description: 'Parse opcode' },
  { name: 'Calculate', description: 'Compute address' },
  { name: 'Read', description: 'Load data' },
  { name: 'Write', description: 'Store result' },
  { name: 'Wait', description: 'Sync clocks' },
  { name: 'Commit', description: 'Finalize' },
];

// Scene title
const SceneTitle: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 32,
          color: COLORS.cosmicPrimary,
          letterSpacing: '0.05em',
        }}
      >
        Layer 7: The Hardware
      </div>
    </div>
  );
};

// Single pipeline stage
const PipelineStage: React.FC<{
  name: string;
  description: string;
  index: number;
  entranceFrame: number;
  isActive: boolean;
  signalProgress: number;
}> = ({ name, description, index, entranceFrame, isActive, signalProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - entranceFrame;
  if (adjustedFrame < 0) return null;

  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1]);
  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);

  // Active glow
  const activeGlow = isActive ? 0.8 + Math.sin(frame * 0.2) * 0.2 : 0.3;
  const activeScale = isActive ? 1.05 : 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transform: `scale(${scale * activeScale})`,
        opacity,
      }}
    >
      {/* Stage box */}
      <div
        style={{
          width: 100,
          height: 60,
          backgroundColor: isActive ? `${COLORS.cosmicPrimary}30` : COLORS.surface,
          border: `2px solid ${isActive ? COLORS.cosmicPrimary : COLORS.surfaceAlt}`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isActive ? `0 0 20px ${COLORS.cosmicPrimary}60` : 'none',
          opacity: activeGlow,
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            color: isActive ? COLORS.cosmicPrimary : COLORS.text,
          }}
        >
          {name}
        </span>
      </div>

      {/* Description */}
      <span
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 11,
          color: COLORS.textMuted,
          opacity: isActive ? 1 : 0.5,
        }}
      >
        {description}
      </span>
    </div>
  );
};

// Pipeline visualization
const PipelineVisualization: React.FC<{
  frame: number;
  startFrame: number;
  fadeOutFrame: number;
}> = ({ frame, startFrame, fadeOutFrame }) => {
  const STAGE_DELAY = 15;
  const CYCLE_LENGTH = 60; // Frames per full pipeline cycle

  // Calculate which stage is active (cycling animation)
  const cycleFrame = frame - startFrame - PIPELINE_STAGES.length * STAGE_DELAY;
  const activeIndex = cycleFrame > 0 ? Math.floor(cycleFrame / 8) % PIPELINE_STAGES.length : -1;

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: fadeOut,
      }}
    >
      {/* Pipeline label */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.cosmicPrimary,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        CPU Micro-Operation Pipeline
      </div>

      {/* Stages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.name}>
            <PipelineStage
              name={stage.name}
              description={stage.description}
              index={i}
              entranceFrame={startFrame + i * STAGE_DELAY}
              isActive={i === activeIndex}
              signalProgress={0}
            />

            {/* Arrow between stages */}
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                style={{
                  color: i < activeIndex ? COLORS.cosmicPrimary : COLORS.textDim,
                  fontSize: 20,
                  opacity: i < activeIndex ? 0.8 : 0.3,
                }}
              >
                →
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Circuit pattern that zooms in
const CircuitZoom: React.FC<{ frame: number; startFrame: number; endFrame: number }> = ({
  frame,
  startFrame,
  endFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = interpolate(adjustedFrame, [0, endFrame - startFrame], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(progress, [0, 1], [1, 3]);
  const opacity = interpolate(progress, [0, 0.3, 0.7, 1], [0, 0.3, 0.3, 0]);

  // Generate circuit grid
  const gridSize = 20;
  const lines: React.ReactNode[] = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const isNode = (i + j) % 3 === 0;
      if (isNode) {
        lines.push(
          <div
            key={`${i}-${j}`}
            style={{
              position: 'absolute',
              left: `${(i / gridSize) * 100}%`,
              top: `${(j / gridSize) * 100}%`,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: COLORS.cosmicPrimary,
            }}
          />
        );
      }
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>{lines}</div>
    </div>
  );
};

// Electron particles
const ElectronParticles: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  // Generate electron particles
  const particles = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * Math.PI * 2 + adjustedFrame * 0.02;
    const radius = 150 + Math.sin(i * 0.5) * 50;
    const speed = 0.5 + (i % 3) * 0.3;

    const x = Math.cos(angle * speed) * radius;
    const y = Math.sin(angle * speed) * radius * 0.6;

    const particleOpacity = 0.3 + Math.sin(adjustedFrame * 0.1 + i) * 0.2;

    return { x, y, opacity: particleOpacity, size: 3 + (i % 2) };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: COLORS.cosmicAccent,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${COLORS.cosmicAccent}`,
          }}
        />
      ))}
    </div>
  );
};

// "Billions of transistors" text
const TransistorText: React.FC<{
  frame: number;
  startFrame: number;
  fadeOutFrame: number;
}> = ({ frame, startFrame, fadeOutFrame }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.text,
        }}
      >
        Billions of transistors switching on and off.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 8,
        }}
      >
        A flow of electrons, orchestrated with nanosecond precision.
      </div>
    </div>
  );
};

// Philosophical transition text
const PhilosophicalText: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const line1Progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const line2Progress = spring({
    frame: frame - startFrame - 60,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.textMuted,
          marginBottom: 24,
          opacity: interpolate(line1Progress, [0, 1], [0, 1]),
        }}
      >
        Here's where things get philosophically interesting.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
          opacity: interpolate(line2Progress, [0, 1], [0, 1]),
        }}
      >
        How did we get here?
      </div>
    </div>
  );
};

// Time travel transition
const TimeTravelTransition: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Year counter animation
  const yearProgress = interpolate(adjustedFrame, [30, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const currentYear = Math.round(interpolate(yearProgress, [0, 1], [2024, 1804]));

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.warmAccent,
          letterSpacing: '0.2em',
          marginBottom: 16,
        }}
      >
        GOING BACK IN TIME
      </div>

      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 120,
          color: interpolate(yearProgress, [0, 1], [1, 0]) > 0.5 ? COLORS.text : COLORS.warmText,
          letterSpacing: '0.05em',
        }}
      >
        {currentYear}
      </div>
    </div>
  );
};

// Warm color overlay for transition
const WarmOverlay: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const progress = interpolate(frame - startFrame, [0, 100], [0, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.warmAccent,
        opacity: progress,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Hardware: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const PIPELINE_START = 60;
  const CIRCUIT_ZOOM_START = 400;
  const CIRCUIT_ZOOM_END = 550;
  const TRANSISTOR_TEXT_APPEAR = 450;
  const TRANSISTOR_TEXT_FADEOUT = 600;
  const ELECTRON_PARTICLES_START = 550;
  const PIPELINE_FADEOUT = 700;
  const PHILOSOPHICAL_TEXT_START = 800;
  const TIME_TRAVEL_START = 1000;
  const WARM_OVERLAY_START = 1200;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Warm overlay for transition */}
      {frame >= WARM_OVERLAY_START && (
        <WarmOverlay frame={frame} startFrame={WARM_OVERLAY_START} />
      )}

      {/* Layer stack */}
      <LayerStack activeLayer="hardware" entranceFrame={0} visible={frame < TIME_TRAVEL_START} />

      {/* Scene title */}
      {frame < PHILOSOPHICAL_TEXT_START && (
        <SceneTitle frame={frame} startFrame={TITLE_APPEAR} fadeOutFrame={PIPELINE_FADEOUT} />
      )}

      {/* Pipeline visualization */}
      {frame < PHILOSOPHICAL_TEXT_START && (
        <PipelineVisualization
          frame={frame}
          startFrame={PIPELINE_START}
          fadeOutFrame={PIPELINE_FADEOUT}
        />
      )}

      {/* Circuit zoom effect */}
      {frame >= CIRCUIT_ZOOM_START && frame < CIRCUIT_ZOOM_END + 60 && (
        <CircuitZoom
          frame={frame}
          startFrame={CIRCUIT_ZOOM_START}
          endFrame={CIRCUIT_ZOOM_END}
        />
      )}

      {/* Electron particles */}
      {frame >= ELECTRON_PARTICLES_START && frame < PHILOSOPHICAL_TEXT_START && (
        <ElectronParticles frame={frame} startFrame={ELECTRON_PARTICLES_START} />
      )}

      {/* Transistor text */}
      {frame >= TRANSISTOR_TEXT_APPEAR && frame < TRANSISTOR_TEXT_FADEOUT + 60 && (
        <TransistorText
          frame={frame}
          startFrame={TRANSISTOR_TEXT_APPEAR}
          fadeOutFrame={TRANSISTOR_TEXT_FADEOUT}
        />
      )}

      {/* Philosophical transition */}
      {frame >= PHILOSOPHICAL_TEXT_START && frame < TIME_TRAVEL_START && (
        <PhilosophicalText frame={frame} startFrame={PHILOSOPHICAL_TEXT_START} />
      )}

      {/* Time travel transition */}
      {frame >= TIME_TRAVEL_START && (
        <TimeTravelTransition frame={frame} startFrame={TIME_TRAVEL_START} />
      )}
    </AbsoluteFill>
  );
};
