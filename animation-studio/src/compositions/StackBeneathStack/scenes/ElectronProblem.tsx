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
 * SCENE 11: THE ELECTRON PROBLEM (Section 10)
 * Duration: 90 seconds (2700 frames)
 *
 * THIS IS THE TURN. Cosmic rays, bit flips, physics. Dramatic revelation.
 *
 * Animation Sequence:
 * | Frames     | Action |
 * |------------|--------|
 * | 0-120      | Background shifts to cosmic (deep purple-black) |
 * | 120-400    | Cosmic ray particle shower animation |
 * | 400-600    | Particle path: space → atmosphere → RAM |
 * | 600-900    | RAM grid appears, particle hits, bit flips |
 * | 900-1350   | Belgian election story visualization |
 * | 1350-1650  | "4,096 = 2^12 = one bit" - mathematical reveal |
 * | 1650-1950  | Super Mario 64 glitch story |
 * | 1950-2250  | "This isn't a bug... This is physics." |
 * | 2250-2500  | Beat. Hold. Let it land. |
 * | 2500-2700  | Transition to quantum visualization |
 */

// Timeline markers
const COSMIC_SHIFT = 0;
const PARTICLE_SHOWER = 120;
const PARTICLE_PATH = 400;
const RAM_GRID = 600;
const BIT_FLIP = 750;
const BELGIAN_STORY = 900;
const MATH_REVEAL = 1350;
const MARIO_STORY = 1650;
const PHYSICS_REVEAL = 1950;
const HOLD_BEAT = 2250;
const TRANSITION_OUT = 2500;

// Cosmic background with stars
const CosmicBackground: React.FC<{ frame: number }> = ({ frame }) => {
  // Generate static stars
  const stars = React.useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      x: (i * 19.7) % 100,
      y: (i * 23.3) % 100,
      size: 1 + (i % 3),
      twinkleOffset: i * 0.5,
    }));
  }, []);

  const bgOpacity = interpolate(frame, [0, 120], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.cosmicBackground,
        opacity: bgOpacity,
      }}
    >
      {/* Stars */}
      {stars.map((star, i) => {
        const twinkle = 0.3 + Math.sin(frame * 0.05 + star.twinkleOffset) * 0.3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              backgroundColor: COLORS.text,
              opacity: twinkle,
            }}
          />
        );
      })}
    </div>
  );
};

// Cosmic ray particle shower
const ParticleShower: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

  // Generate particles falling from space
  const particles = Array.from({ length: 30 }, (_, i) => {
    const startX = 20 + (i * 2.1) % 60;
    const speed = 2 + (i % 4);
    const delay = (i * 7) % 100;

    const particleProgress = Math.max(0, (adjustedFrame - delay) * speed);
    const y = -50 + particleProgress;

    // Trail effect
    const trailLength = 50 + (i % 30);

    return { x: startX, y, trailLength, opacity: 0.3 + (i % 5) * 0.1 };
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        overflow: 'hidden',
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: p.y,
            width: 2,
            height: p.trailLength,
            background: `linear-gradient(to bottom, transparent, ${COLORS.cosmicAccent}, ${COLORS.cosmicPrimary})`,
            opacity: p.opacity,
            borderRadius: 1,
          }}
        />
      ))}

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: TYPOGRAPHY.display.weights.bold,
            fontSize: 36,
            color: COLORS.cosmicPrimary,
            opacity: interpolate(adjustedFrame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Cosmic Rays
        </div>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 18,
            color: COLORS.textMuted,
            marginTop: 8,
            opacity: interpolate(adjustedFrame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          High-energy particles from deep space
        </div>
      </div>
    </div>
  );
};

// Single particle path through atmosphere to RAM
const ParticlePath: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = interpolate(adjustedFrame, [0, 200], [0, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(adjustedFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Path from top to RAM chip
  const pathY = interpolate(progress, [0, 1], [-100, 650]);

  // Atmosphere layers
  const layers = [
    { y: 150, label: 'Thermosphere', color: `${COLORS.cosmicPrimary}30` },
    { y: 300, label: 'Mesosphere', color: `${COLORS.cosmicPrimary}40` },
    { y: 450, label: 'Stratosphere', color: `${COLORS.primary}30` },
    { y: 600, label: 'Troposphere', color: `${COLORS.primary}40` },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
      }}
    >
      {/* Atmosphere layers */}
      {layers.map((layer, i) => {
        const layerOpacity = interpolate(adjustedFrame, [i * 30, i * 30 + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={layer.label}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: layer.y,
              height: 2,
              backgroundColor: layer.color,
              opacity: layerOpacity,
            }}
          >
            <span
              style={{
                position: 'absolute',
                right: 100,
                top: -20,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 12,
                color: COLORS.textDim,
              }}
            >
              {layer.label}
            </span>
          </div>
        );
      })}

      {/* The particle */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: pathY,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Glow */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: COLORS.cosmicAccent,
            boxShadow: `0 0 40px ${COLORS.cosmicAccent}, 0 0 80px ${COLORS.cosmicPrimary}`,
            animation: 'pulse 0.5s infinite',
          }}
        />

        {/* Trail */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '100%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 150,
            background: `linear-gradient(to top, ${COLORS.cosmicAccent}, transparent)`,
            borderRadius: 2,
          }}
        />
      </div>

      {/* RAM chip at bottom */}
      {progress > 0.8 && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: interpolate(progress, [0.8, 0.9], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          <div
            style={{
              width: 200,
              height: 60,
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.primary}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 14,
              color: COLORS.text,
            }}
          >
            RAM CHIP
          </div>
        </div>
      )}
    </div>
  );
};

// Bit flip visualization
const BitFlipGrid: React.FC<{ frame: number; startFrame: number; flipFrame: number }> = ({
  frame,
  startFrame,
  flipFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const flipAdjusted = frame - flipFrame;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // 8x8 grid of bits
  const gridSize = 8;
  const flipRow = 4;
  const flipCol = 3;

  // The bit pattern
  const getBit = (row: number, col: number): number => {
    const seed = row * gridSize + col;
    return (seed * 7 + 3) % 2;
  };

  // Impact flash
  const flashOpacity = flipAdjusted > 0 && flipAdjusted < 30
    ? interpolate(flipAdjusted, [0, 10, 30], [0, 1, 0])
    : 0;

  // Ripple effect
  const getRippleDelay = (row: number, col: number): number => {
    const dist = Math.sqrt(Math.pow(row - flipRow, 2) + Math.pow(col - flipCol, 2));
    return dist * 5;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      {/* Impact flash */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: COLORS.cosmicAccent,
          opacity: flashOpacity * 0.5,
          filter: 'blur(50px)',
        }}
      />

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 50px)`,
          gridTemplateRows: `repeat(${gridSize}, 50px)`,
          gap: 4,
          backgroundColor: COLORS.surface,
          padding: 16,
          borderRadius: 8,
          border: `2px solid ${COLORS.primary}40`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }, (_, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const isFlipCell = row === flipRow && col === flipCol;

          let bitValue = getBit(row, col);

          // Flip the bit after flipFrame
          if (isFlipCell && flipAdjusted > 0) {
            bitValue = 1 - bitValue;
          }

          // Ripple effect
          const rippleDelay = getRippleDelay(row, col);
          const rippleProgress = flipAdjusted > rippleDelay
            ? interpolate(flipAdjusted - rippleDelay, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
            : 0;
          const rippleScale = 1 + rippleProgress * 0.1 * (1 - rippleProgress);

          // Glitch effect on flip cell
          const glitchOffset = isFlipCell && flipAdjusted > 0 && flipAdjusted < 20
            ? Math.sin(flipAdjusted * 2) * 3
            : 0;

          return (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                backgroundColor: isFlipCell && flipAdjusted > 0
                  ? `${COLORS.cosmicAccent}40`
                  : `${COLORS.surfaceAlt}`,
                border: `1px solid ${isFlipCell && flipAdjusted > 0 ? COLORS.cosmicAccent : COLORS.textDim}40`,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 24,
                fontWeight: 600,
                color: isFlipCell && flipAdjusted > 0 ? COLORS.cosmicAccent : COLORS.text,
                transform: `scale(${rippleScale}) translateX(${glitchOffset}px)`,
                boxShadow: isFlipCell && flipAdjusted > 0
                  ? `0 0 20px ${COLORS.cosmicAccent}60`
                  : 'none',
              }}
            >
              {bitValue}
            </div>
          );
        })}
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 30,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.text,
        }}
      >
        {flipAdjusted < 0 ? (
          'A single cosmic ray hits a memory cell...'
        ) : (
          <span style={{ color: COLORS.cosmicAccent }}>
            One bit flips. From 1 to 0.
          </span>
        )}
      </div>
    </div>
  );
};

// Belgian election story
const BelgianElection: React.FC<{ frame: number; startFrame: number }> = ({
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
        maxWidth: 800,
      }}
    >
      {/* Location and date */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
          marginBottom: 20,
          letterSpacing: '0.2em',
        }}
      >
        SCHAERBEEK, BELGIUM — 2003
      </div>

      {/* Story */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.text,
          lineHeight: 1.6,
          marginBottom: 40,
        }}
      >
        A candidate in a local election received
        <br />
        <span
          style={{
            color: COLORS.cosmicAccent,
            fontWeight: 600,
          }}
        >
          4,096 more votes
        </span>
        <br />
        than the total number of voters.
      </div>

      {/* Ballot box illustration */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 40,
          marginBottom: 40,
        }}
      >
        {/* Ballot box */}
        <div
          style={{
            width: 120,
            height: 150,
            backgroundColor: COLORS.surface,
            border: `3px solid ${COLORS.primary}`,
            borderRadius: 8,
            position: 'relative',
          }}
        >
          {/* Slot */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 8,
              backgroundColor: COLORS.background,
              borderRadius: 4,
            }}
          />
          {/* Label */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            VOTES
          </div>
        </div>

        {/* Question mark */}
        <div
          style={{
            fontSize: 80,
            color: COLORS.cosmicAccent,
            opacity: interpolate(adjustedFrame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          ?
        </div>
      </div>

      {/* Punchline */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.textMuted,
          opacity: interpolate(adjustedFrame, [120, 150], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        The investigation found no fraud. No malfunction.
        <br />
        Just physics.
      </div>
    </div>
  );
};

// Mathematical reveal: 4096 = 2^12
const MathReveal: React.FC<{ frame: number; startFrame: number }> = ({
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

  const steps = [
    { text: '4,096', delay: 0 },
    { text: '=', delay: 30 },
    { text: '2¹²', delay: 60 },
    { text: '=', delay: 90 },
    { text: 'one flipped bit', delay: 120, color: COLORS.cosmicAccent },
  ];

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30,
        }}
      >
        {steps.map((step, i) => {
          const stepOpacity = interpolate(adjustedFrame, [step.delay, step.delay + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: TYPOGRAPHY.display.weights.bold,
                fontSize: step.text === '=' ? 48 : 64,
                color: step.color || COLORS.text,
                opacity: stepOpacity,
                transform: `translateY(${interpolate(stepOpacity, [0, 1], [20, 0])}px)`,
              }}
            >
              {step.text}
            </div>
          );
        })}
      </div>

      {/* Binary representation */}
      <div
        style={{
          marginTop: 60,
          opacity: interpolate(adjustedFrame, [150, 180], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 24,
            color: COLORS.textMuted,
            letterSpacing: '0.3em',
          }}
        >
          0001 0000 0000 0000
        </div>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 16,
            color: COLORS.textDim,
            marginTop: 12,
          }}
        >
          Position 12 flipped from 0 to 1
        </div>
      </div>
    </div>
  );
};

// Super Mario 64 story
const MarioGlitch: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Glitch effect for the character
  const glitchX = adjustedFrame > 60 ? Math.sin(adjustedFrame * 0.5) * (5 + Math.sin(adjustedFrame * 0.1) * 10) : 0;
  const glitchY = adjustedFrame > 60 ? Math.cos(adjustedFrame * 0.7) * 5 : 0;

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
      {/* Game frame */}
      <div
        style={{
          width: 500,
          height: 350,
          backgroundColor: '#1a1a2e',
          border: `4px solid ${COLORS.surfaceAlt}`,
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Pixelated Mario representation */}
        <div
          style={{
            position: 'absolute',
            left: '40%',
            top: '50%',
            transform: `translate(-50%, -50%) translate(${glitchX}px, ${glitchY}px)`,
          }}
        >
          {/* Simple block character */}
          <div
            style={{
              width: 40,
              height: 60,
              backgroundColor: '#e63946',
              borderRadius: 4,
              position: 'relative',
            }}
          >
            {/* Head */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 30,
                height: 30,
                backgroundColor: '#ffd8a8',
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Warp pipe */}
        <div
          style={{
            position: 'absolute',
            right: 80,
            bottom: 50,
            width: 60,
            height: 80,
            backgroundColor: '#2d6a4f',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: -5,
              width: 70,
              height: 20,
              backgroundColor: '#40916c',
              borderRadius: 4,
            }}
          />
        </div>

        {/* Floor */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            backgroundColor: '#8b5a2b',
          }}
        />

        {/* Glitch artifacts */}
        {adjustedFrame > 90 && (
          <>
            <div
              style={{
                position: 'absolute',
                left: 100 + glitchX * 3,
                top: 100,
                width: 80,
                height: 4,
                backgroundColor: COLORS.cosmicAccent,
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 50,
                top: 150 + glitchY * 2,
                width: 60,
                height: 4,
                backgroundColor: COLORS.cosmicPrimary,
                opacity: 0.5,
              }}
            />
          </>
        )}

        {/* Game title overlay */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.textDim,
          }}
        >
          SUPER MARIO 64
        </div>
      </div>

      {/* Story text */}
      <div
        style={{
          marginTop: 30,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 22,
          color: COLORS.text,
          lineHeight: 1.6,
        }}
      >
        A speedrunner warps through a wall
        <br />
        <span style={{ color: COLORS.cosmicAccent }}>
          without touching the controller.
        </span>
      </div>

      {/* Explanation */}
      <div
        style={{
          marginTop: 20,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
          opacity: interpolate(adjustedFrame, [120, 150], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        A cosmic ray flipped a bit in Mario's position data.
      </div>
    </div>
  );
};

// "This isn't a bug... This is physics."
const PhysicsReveal: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const line1Progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const line2Progress = spring({
    frame: adjustedFrame - 60,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 32,
          color: COLORS.textMuted,
          marginBottom: 30,
          opacity: interpolate(line1Progress, [0, 1], [0, 1]),
        }}
      >
        This isn't a bug.
      </div>

      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 72,
          color: COLORS.cosmicPrimary,
          opacity: interpolate(line2Progress, [0, 1], [0, 1]),
          textShadow: `0 0 60px ${COLORS.cosmicPrimary}60`,
        }}
      >
        This is physics.
      </div>
    </div>
  );
};

// Hold beat - dramatic pause
const HoldBeat: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Subtle pulsing glow
  const pulseOpacity = 0.3 + Math.sin(adjustedFrame * 0.05) * 0.1;

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
      {/* Central glow */}
      <div
        style={{
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: COLORS.cosmicPrimary,
          opacity: pulseOpacity,
          filter: 'blur(100px)',
        }}
      />

      {/* Question */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.text,
          opacity: interpolate(adjustedFrame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        So what does this mean for computing?
      </div>
    </div>
  );
};

// Transition overlay
const TransitionOverlay: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 200], [0, 0.3], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.cosmicGlow,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const ElectronProblem: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which sections to show
  const showParticleShower = frame >= PARTICLE_SHOWER && frame < PARTICLE_PATH + 100;
  const showParticlePath = frame >= PARTICLE_PATH && frame < RAM_GRID + 50;
  const showBitFlip = frame >= RAM_GRID && frame < BELGIAN_STORY;
  const showBelgian = frame >= BELGIAN_STORY && frame < MATH_REVEAL;
  const showMath = frame >= MATH_REVEAL && frame < MARIO_STORY;
  const showMario = frame >= MARIO_STORY && frame < PHYSICS_REVEAL;
  const showPhysics = frame >= PHYSICS_REVEAL && frame < HOLD_BEAT;
  const showHold = frame >= HOLD_BEAT && frame < TRANSITION_OUT;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Cosmic background */}
      <CosmicBackground frame={frame} />

      {/* Particle shower */}
      {showParticleShower && (
        <ParticleShower frame={frame} startFrame={PARTICLE_SHOWER} />
      )}

      {/* Particle path through atmosphere */}
      {showParticlePath && (
        <ParticlePath frame={frame} startFrame={PARTICLE_PATH} />
      )}

      {/* Bit flip grid */}
      {showBitFlip && (
        <BitFlipGrid frame={frame} startFrame={RAM_GRID} flipFrame={BIT_FLIP} />
      )}

      {/* Belgian election story */}
      {showBelgian && (
        <BelgianElection frame={frame} startFrame={BELGIAN_STORY} />
      )}

      {/* Math reveal */}
      {showMath && (
        <MathReveal frame={frame} startFrame={MATH_REVEAL} />
      )}

      {/* Mario glitch story */}
      {showMario && (
        <MarioGlitch frame={frame} startFrame={MARIO_STORY} />
      )}

      {/* Physics reveal */}
      {showPhysics && (
        <PhysicsReveal frame={frame} startFrame={PHYSICS_REVEAL} />
      )}

      {/* Hold beat */}
      {showHold && (
        <HoldBeat frame={frame} startFrame={HOLD_BEAT} />
      )}

      {/* Transition */}
      {frame >= TRANSITION_OUT && (
        <TransitionOverlay frame={frame} startFrame={TRANSITION_OUT} />
      )}
    </AbsoluteFill>
  );
};
