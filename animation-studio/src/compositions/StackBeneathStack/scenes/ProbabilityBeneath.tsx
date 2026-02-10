import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * SCENE 12: THE PROBABILITY BENEATH (Section 11)
 * Duration: 60 seconds (1800 frames)
 *
 * Quantum mechanics. Electron probability clouds. Beautiful, abstract.
 * 3Blue1Brown style: elegant, mathematical, beautiful.
 *
 * Animation Sequence:
 * | Frames     | Action |
 * |------------|--------|
 * | 0-150      | Start with Bohr model: electron as ball orbiting |
 * | 150-400    | Transform to probability cloud: fuzzy, wave-like |
 * | 400-650    | Show probability distribution animation |
 * | 650-900    | Quantum tunneling visualization |
 * | 900-1200   | Barrier with electron wave "leaking" through |
 * | 1200-1500  | Pull back: show all layers sitting on probability |
 * | 1500-1650  | "fundamentally, irreducibly probabilistic" |
 * | 1650-1800  | "So how does it work?" - pause before next section |
 */

// Timeline markers
const BOHR_MODEL = 0;
const TRANSFORM_START = 150;
const PROBABILITY_CLOUD = 400;
const TUNNELING_START = 650;
const BARRIER_VISUAL = 900;
const FULL_STACK = 1200;
const PROBABILISTIC_TEXT = 1500;
const QUESTION_TEXT = 1650;

// Bohr model - classical electron orbits
const BohrModel: React.FC<{ frame: number; transformProgress: number }> = ({
  frame,
  transformProgress,
}) => {
  const orbitRadius = 120;
  const electronAngle = frame * 0.08;

  // As transform progresses, the electron becomes fuzzy
  const clarity = 1 - transformProgress;
  const fuzziness = transformProgress * 30;

  const electronX = Math.cos(electronAngle) * orbitRadius;
  const electronY = Math.sin(electronAngle) * orbitRadius;

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Nucleus */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: COLORS.cosmicAccent,
          boxShadow: `0 0 20px ${COLORS.cosmicAccent}`,
        }}
      />

      {/* Orbit path */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          borderRadius: '50%',
          border: `2px dashed ${COLORS.cosmicPrimary}40`,
          opacity: clarity,
        }}
      />

      {/* Electron (classical) */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${electronX}px)`,
          top: `calc(50% + ${electronY}px)`,
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: COLORS.cosmicPrimary,
          boxShadow: `0 0 15px ${COLORS.cosmicPrimary}`,
          opacity: clarity,
          filter: `blur(${fuzziness}px)`,
        }}
      />

      {/* Label */}
      {transformProgress < 0.5 && (
        <div
          style={{
            position: 'absolute',
            top: orbitRadius + 60,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 18,
            color: COLORS.textMuted,
            textAlign: 'center',
            opacity: 1 - transformProgress * 2,
          }}
        >
          Classical model: electron as a particle
        </div>
      )}
    </div>
  );
};

// Probability cloud - quantum reality
const ProbabilityCloud: React.FC<{ frame: number; startFrame: number; opacity: number }> = ({
  frame,
  startFrame,
  opacity,
}) => {
  const adjustedFrame = frame - startFrame;

  // Generate probability cloud particles
  const cloudParticles = React.useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      // Gaussian-ish distribution
      const angle = (i / 200) * Math.PI * 2 * 3;
      const baseRadius = 20 + Math.pow(Math.random(), 0.5) * 100;
      const radius = baseRadius * (0.8 + Math.sin(i * 0.1) * 0.2);

      return {
        angle,
        radius,
        size: 2 + Math.random() * 4,
        phaseOffset: i * 0.1,
        opacityBase: 0.1 + Math.random() * 0.4,
      };
    });
  }, []);

  // Breathing animation
  const breathe = 1 + Math.sin(adjustedFrame * 0.03) * 0.1;

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      {/* Cloud particles */}
      {cloudParticles.map((p, i) => {
        const pulsePhase = adjustedFrame * 0.02 + p.phaseOffset;
        const currentRadius = p.radius * breathe * (1 + Math.sin(pulsePhase) * 0.15);
        const x = Math.cos(p.angle + adjustedFrame * 0.005) * currentRadius;
        const y = Math.sin(p.angle + adjustedFrame * 0.005) * currentRadius;

        const particleOpacity = p.opacityBase * (0.7 + Math.sin(pulsePhase * 2) * 0.3);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: COLORS.cosmicPrimary,
              opacity: particleOpacity,
              boxShadow: `0 0 ${p.size}px ${COLORS.cosmicPrimary}60`,
            }}
          />
        );
      })}

      {/* Central glow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 60 * breathe,
          height: 60 * breathe,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.cosmicPrimary}60 0%, ${COLORS.cosmicPrimary}20 50%, transparent 70%)`,
        }}
      />

      {/* Nucleus */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: COLORS.cosmicAccent,
          boxShadow: `0 0 15px ${COLORS.cosmicAccent}`,
        }}
      />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.text,
          textAlign: 'center',
        }}
      >
        Quantum reality: a probability distribution
      </div>
    </div>
  );
};

// Quantum tunneling visualization
const QuantumTunneling: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Wave function animation
  const waveProgress = interpolate(adjustedFrame, [60, 300], [0, 1], { extrapolateRight: 'clamp' });

  // Barrier position
  const barrierX = 400;
  const barrierWidth = 60;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 300,
        opacity,
      }}
    >
      {/* Wave function visualization */}
      <svg width="800" height="300" viewBox="0 0 800 300">
        {/* Barrier */}
        <rect
          x={barrierX}
          y="50"
          width={barrierWidth}
          height="200"
          fill={COLORS.warning}
          opacity="0.3"
        />
        <text
          x={barrierX + barrierWidth / 2}
          y="280"
          textAnchor="middle"
          fill={COLORS.warning}
          fontSize="14"
          fontFamily={TYPOGRAPHY.body.fontFamily}
        >
          Energy Barrier
        </text>

        {/* Wave function - incoming */}
        <path
          d={generateWavePath(0, barrierX - 20, 150, adjustedFrame, 1)}
          stroke={COLORS.cosmicPrimary}
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />

        {/* Wave function - inside barrier (decaying) */}
        {waveProgress > 0.3 && (
          <path
            d={generateDecayPath(barrierX, barrierX + barrierWidth, 150, adjustedFrame)}
            stroke={COLORS.cosmicPrimary}
            strokeWidth="2"
            fill="none"
            opacity={0.4 * waveProgress}
          />
        )}

        {/* Wave function - transmitted (tunneled) */}
        {waveProgress > 0.6 && (
          <path
            d={generateWavePath(barrierX + barrierWidth + 20, 800, 150, adjustedFrame, 0.3)}
            stroke={COLORS.cosmicAccent}
            strokeWidth="2"
            fill="none"
            opacity={0.6 * (waveProgress - 0.6) / 0.4}
          />
        )}

        {/* Probability density shading - incoming */}
        <path
          d={generateWavePath(0, barrierX - 20, 150, adjustedFrame, 1) + ` L ${barrierX - 20} 150 L 0 150 Z`}
          fill={COLORS.cosmicPrimary}
          opacity="0.1"
        />

        {/* Probability density shading - transmitted */}
        {waveProgress > 0.6 && (
          <path
            d={generateWavePath(barrierX + barrierWidth + 20, 800, 150, adjustedFrame, 0.3) + ` L 800 150 L ${barrierX + barrierWidth + 20} 150 Z`}
            fill={COLORS.cosmicAccent}
            opacity={0.1 * (waveProgress - 0.6) / 0.4}
          />
        )}
      </svg>

      {/* Explanation */}
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.text,
          textAlign: 'center',
          opacity: interpolate(adjustedFrame, [150, 180], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        The electron doesn't go over the barrier.
        <br />
        <span style={{ color: COLORS.cosmicAccent }}>It leaks through.</span>
      </div>
    </div>
  );
};

// Helper to generate wave path
const generateWavePath = (
  startX: number,
  endX: number,
  centerY: number,
  frame: number,
  amplitude: number
): string => {
  const points: string[] = [];
  const step = 4;

  for (let x = startX; x <= endX; x += step) {
    const phase = (x - startX) * 0.05 + frame * 0.1;
    const y = centerY - Math.sin(phase) * 40 * amplitude;
    points.push(`${x === startX ? 'M' : 'L'} ${x} ${y}`);
  }

  return points.join(' ');
};

// Helper to generate decaying path inside barrier
const generateDecayPath = (
  startX: number,
  endX: number,
  centerY: number,
  frame: number
): string => {
  const points: string[] = [];
  const step = 4;

  for (let x = startX; x <= endX; x += step) {
    const progress = (x - startX) / (endX - startX);
    const decay = Math.exp(-progress * 3);
    const phase = (x - startX) * 0.05 + frame * 0.1;
    const y = centerY - Math.sin(phase) * 40 * decay;
    points.push(`${x === startX ? 'M' : 'L'} ${x} ${y}`);
  }

  return points.join(' ');
};

// Full stack reveal - all layers on probability
const FullStackReveal: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const layers = [
    { name: 'Python', color: COLORS.accent },
    { name: 'AST', color: COLORS.syntaxFunction },
    { name: 'Bytecode', color: COLORS.primary },
    { name: 'C', color: COLORS.primary },
    { name: 'Assembly', color: COLORS.warning },
    { name: 'Machine Code', color: COLORS.danger },
    { name: 'Hardware', color: COLORS.cosmicPrimary },
    { name: 'Transistors', color: COLORS.cosmicAccent },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      {/* Stack of layers */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {layers.map((layer, i) => {
          const layerProgress = interpolate(adjustedFrame, [i * 15, i * 15 + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={layer.name}
              style={{
                width: 200 - i * 10,
                height: 28,
                backgroundColor: `${layer.color}30`,
                border: `1px solid ${layer.color}60`,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 12,
                color: layer.color,
                opacity: layerProgress,
                transform: `translateY(${interpolate(layerProgress, [0, 1], [-10, 0])}px)`,
              }}
            >
              {layer.name}
            </div>
          );
        })}

        {/* Arrow down */}
        <div
          style={{
            fontSize: 24,
            color: COLORS.textDim,
            margin: '8px 0',
            opacity: interpolate(adjustedFrame, [120, 150], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          ↓
        </div>

        {/* Quantum foam base */}
        <div
          style={{
            width: 250,
            padding: '16px 24px',
            backgroundColor: `${COLORS.cosmicPrimary}20`,
            border: `2px solid ${COLORS.cosmicPrimary}`,
            borderRadius: 8,
            textAlign: 'center',
            opacity: interpolate(adjustedFrame, [150, 180], [0, 1], { extrapolateRight: 'clamp' }),
            boxShadow: `0 0 30px ${COLORS.cosmicPrimary}40`,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: TYPOGRAPHY.display.weights.bold,
              fontSize: 18,
              color: COLORS.cosmicPrimary,
            }}
          >
            Quantum Probability
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 12,
              color: COLORS.textMuted,
              marginTop: 4,
            }}
          >
            The foundation of everything
          </div>
        </div>
      </div>
    </div>
  );
};

// "Fundamentally, irreducibly probabilistic" text
const ProbabilisticText: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

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
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 48,
          color: COLORS.text,
          lineHeight: 1.4,
        }}
      >
        Fundamentally,
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 48,
          color: COLORS.cosmicPrimary,
          marginTop: 8,
        }}
      >
        irreducibly
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 64,
          color: COLORS.cosmicAccent,
          marginTop: 8,
          textShadow: `0 0 40px ${COLORS.cosmicAccent}60`,
        }}
      >
        probabilistic.
      </div>
    </div>
  );
};

// "So how does it work?" question
const QuestionText: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

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
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 32,
          color: COLORS.text,
        }}
      >
        So how does it work?
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.textMuted,
          marginTop: 20,
          opacity: interpolate(adjustedFrame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        How did we build certainty from chaos?
      </div>
    </div>
  );
};

// Cosmic background
const CosmicBackground: React.FC<{ frame: number }> = ({ frame }) => {
  // Subtle pulsing nebula effect
  const pulseOpacity = 0.1 + Math.sin(frame * 0.02) * 0.05;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.cosmicBackground,
      }}
    >
      {/* Nebula gradient */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.cosmicPrimary}${Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export const ProbabilityBeneath: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate transform progress for Bohr → Cloud transition
  const transformProgress = interpolate(frame, [TRANSFORM_START, PROBABILITY_CLOUD], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cloud opacity
  const cloudOpacity = interpolate(frame, [TRANSFORM_START, PROBABILITY_CLOUD], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Determine which sections to show
  const showBohr = frame < TUNNELING_START;
  const showCloud = frame >= TRANSFORM_START && frame < TUNNELING_START;
  const showTunneling = frame >= TUNNELING_START && frame < FULL_STACK;
  const showFullStack = frame >= FULL_STACK && frame < PROBABILISTIC_TEXT;
  const showProbabilistic = frame >= PROBABILISTIC_TEXT && frame < QUESTION_TEXT;
  const showQuestion = frame >= QUESTION_TEXT;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Cosmic background */}
      <CosmicBackground frame={frame} />

      {/* Bohr model (classical) */}
      {showBohr && (
        <BohrModel frame={frame} transformProgress={transformProgress} />
      )}

      {/* Probability cloud (quantum) */}
      {showCloud && (
        <ProbabilityCloud frame={frame} startFrame={TRANSFORM_START} opacity={cloudOpacity} />
      )}

      {/* Quantum tunneling */}
      {showTunneling && (
        <QuantumTunneling frame={frame} startFrame={TUNNELING_START} />
      )}

      {/* Full stack reveal */}
      {showFullStack && (
        <FullStackReveal frame={frame} startFrame={FULL_STACK} />
      )}

      {/* Probabilistic text */}
      {showProbabilistic && (
        <ProbabilisticText frame={frame} startFrame={PROBABILISTIC_TEXT} />
      )}

      {/* Question */}
      {showQuestion && (
        <QuestionText frame={frame} startFrame={QUESTION_TEXT} />
      )}
    </AbsoluteFill>
  );
};
