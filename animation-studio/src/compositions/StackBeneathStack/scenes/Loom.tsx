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
 * SCENE 9: THE LOOM (Section 8)
 * Duration: 105 seconds (3150 frames)
 *
 * MAJOR TONAL SHIFT. We go backward to 1804.
 * Warm sepia tones, organic shapes, historical feel.
 *
 * Animation Sequence:
 * | Frames    | Action |
 * |-----------|--------|
 * | 0-60      | Color palette shifts from cold to warm sepia |
 * | 60-180    | "1804" appears large |
 * | 180-450   | Jacquard loom illustration fades in |
 * | 450-750   | Punched card animation: holes appear, binary emerges |
 * | 750-1050  | Thread weaving visualization |
 * | 1050-1350 | "24,000 cards" - cards stacking visual |
 * | 1350-1650 | Silk portrait emerging from pattern |
 * | 1650-2100 | Ada Lovelace quote appears |
 * | 2100-2400 | "Errors" - torn cards, misaligned holes |
 * | 2400-2700 | "Standards, verification" - organized systems |
 * | 2700-2850 | "Error handling at the very foundation" |
 * | 2850-3150 | Begin transition back to cool palette |
 */

// Timeline markers
const YEAR_APPEAR = 60;
const LOOM_APPEAR = 180;
const PUNCHED_CARD_START = 450;
const BINARY_REVEAL_START = 600;
const WEAVING_START = 750;
const CARDS_STACK_START = 1050;
const PORTRAIT_START = 1350;
const QUOTE_APPEAR = 1650;
const QUOTE_ATTRIBUTION = 1850;
const ERRORS_START = 2100;
const STANDARDS_START = 2400;
const FOUNDATION_TEXT = 2700;
const TRANSITION_OUT = 2850;

// Year display component
const YearDisplay: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;
  const scale = interpolate(progress, [0, 1], [1.2, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 180,
          color: COLORS.warmText,
          letterSpacing: '0.1em',
          textShadow: `0 0 60px ${COLORS.warmAccent}40`,
        }}
      >
        1804
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.warmAccent,
          textAlign: 'center',
          marginTop: 8,
          letterSpacing: '0.2em',
        }}
      >
        LYON, FRANCE
      </div>
    </div>
  );
};

// Loom illustration - stylized Jacquard loom
const LoomIllustration: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  // Loom frame
  const frameWidth = 500;
  const frameHeight = 400;

  // Threads animation
  const threadCount = 16;
  const threads = Array.from({ length: threadCount }, (_, i) => {
    const weaveOffset = Math.sin((adjustedFrame * 0.05) + (i * 0.5)) * 10;
    const threadOpacity = 0.4 + Math.sin(adjustedFrame * 0.03 + i) * 0.2;
    return { weaveOffset, opacity: threadOpacity };
  });

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
      {/* Loom frame */}
      <svg width={frameWidth} height={frameHeight} viewBox="0 0 500 400">
        {/* Outer frame */}
        <rect
          x="50"
          y="50"
          width="400"
          height="300"
          fill="none"
          stroke={COLORS.warmAccent}
          strokeWidth="4"
          opacity="0.6"
        />

        {/* Top beam */}
        <rect
          x="40"
          y="40"
          width="420"
          height="20"
          fill={COLORS.warmAccent}
          opacity="0.4"
        />

        {/* Bottom beam */}
        <rect
          x="40"
          y="340"
          width="420"
          height="20"
          fill={COLORS.warmAccent}
          opacity="0.4"
        />

        {/* Vertical threads (warp) */}
        {threads.map((thread, i) => (
          <line
            key={i}
            x1={80 + i * 22}
            y1="70"
            x2={80 + i * 22}
            y2="330"
            stroke={COLORS.warmText}
            strokeWidth="2"
            opacity={thread.opacity}
          />
        ))}

        {/* Horizontal threads (weft) - animated weaving */}
        {Array.from({ length: 12 }, (_, i) => {
          const y = 90 + i * 20;
          const waveProgress = interpolate(adjustedFrame, [i * 15, i * 15 + 60], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const waveX = interpolate(waveProgress, [0, 1], [70, 430]);

          return (
            <line
              key={`weft-${i}`}
              x1="70"
              y1={y + threads[i % threadCount].weaveOffset}
              x2={waveX}
              y2={y + threads[i % threadCount].weaveOffset}
              stroke={COLORS.warmAccent}
              strokeWidth="2"
              opacity="0.6"
            />
          );
        })}

        {/* Shuttle */}
        <rect
          x={100 + (adjustedFrame % 200)}
          y="200"
          width="40"
          height="10"
          fill={COLORS.warmText}
          opacity="0.8"
        />
      </svg>

      {/* Label */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 20,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.warmText,
          letterSpacing: '0.1em',
        }}
      >
        THE JACQUARD LOOM
      </div>
    </div>
  );
};

// Punched card visualization
const PunchedCard: React.FC<{
  frame: number;
  startFrame: number;
  cardIndex: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}> = ({ frame, startFrame, cardIndex, offsetX = 0, offsetY = 0, scale = 1 }) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame - (cardIndex * 20);
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [-30, 0]);

  // Generate hole pattern
  const rows = 6;
  const cols = 10;
  const holes = Array.from({ length: rows * cols }, (_, i) => {
    // Deterministic "random" based on card index and hole index
    const seed = (cardIndex * 100 + i) % 17;
    return seed > 8;
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${offsetX}px)`,
        top: `calc(45% + ${offsetY}px + ${y}px)`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          width: 200,
          height: 120,
          backgroundColor: `${COLORS.warmText}E0`,
          borderRadius: 4,
          padding: 10,
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 4,
          boxShadow: `0 4px 20px ${COLORS.warmBackground}80`,
        }}
      >
        {holes.map((hasHole, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              backgroundColor: hasHole ? COLORS.warmBackground : 'transparent',
              border: hasHole ? 'none' : `1px solid ${COLORS.warmAccent}40`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Binary reveal - holes becoming 1s and 0s
const BinaryReveal: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const revealProgress = interpolate(adjustedFrame, [0, 120], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Generate binary pattern
  const binaryRows = [
    '1 0 1 1 0 0 1 0 1 1',
    '0 1 1 0 1 1 0 1 0 0',
    '1 1 0 1 0 0 1 1 1 0',
    '0 0 1 0 1 1 0 0 1 1',
    '1 0 0 1 1 0 1 0 0 1',
    '0 1 1 0 0 1 0 1 1 0',
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '65%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: revealProgress,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 20,
          color: COLORS.warmAccent,
          lineHeight: 1.8,
          letterSpacing: '0.3em',
          textAlign: 'center',
        }}
      >
        {binaryRows.map((row, i) => (
          <div
            key={i}
            style={{
              opacity: interpolate(adjustedFrame, [i * 15, i * 15 + 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {row}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 16,
          color: COLORS.warmText,
          textAlign: 'center',
          opacity: interpolate(adjustedFrame, [100, 130], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Holes and solids. Binary. The first programs.
      </div>
    </div>
  );
};

// Cards stacking visualization
const CardsStack: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Counter animation
  const cardCount = Math.min(
    Math.floor(interpolate(adjustedFrame, [60, 200], [0, 24000], { extrapolateRight: 'clamp' })),
    24000
  );

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
      {/* Stack of cards visual */}
      <div
        style={{
          position: 'relative',
          width: 300,
          height: 200,
          margin: '0 auto',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => {
          const cardProgress = interpolate(adjustedFrame, [i * 10, i * 10 + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translateY(${-i * 4}px) rotate(${(i - 6) * 2}deg)`,
                width: 180,
                height: 100,
                backgroundColor: `${COLORS.warmText}${Math.floor(0.7 * 255).toString(16)}`,
                borderRadius: 4,
                opacity: cardProgress,
                boxShadow: `0 2px 8px ${COLORS.warmBackground}60`,
              }}
            />
          );
        })}
      </div>

      {/* Counter */}
      <div
        style={{
          marginTop: 40,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 64,
          color: COLORS.warmAccent,
        }}
      >
        {cardCount.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.warmText,
          marginTop: 8,
        }}
      >
        punched cards for a single portrait
      </div>
    </div>
  );
};

// Portrait emerging from grid pattern
const PortraitGrid: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const revealProgress = interpolate(adjustedFrame, [0, 200], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const gridSize = 20;
  const cells = gridSize * gridSize;

  // Create a simple portrait-like pattern
  const getPortraitCell = (row: number, col: number): boolean => {
    const centerX = gridSize / 2;
    const centerY = gridSize / 2 - 2;
    const distFromCenter = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));

    // Head shape
    if (row < gridSize / 2 && distFromCenter < 5) return true;
    // Shoulders
    if (row >= gridSize / 2 && row < gridSize / 2 + 4) {
      const shoulderDist = Math.abs(col - centerX);
      return shoulderDist < 7 - (row - gridSize / 2);
    }
    return false;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: revealProgress,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 12px)`,
          gridTemplateRows: `repeat(${gridSize}, 12px)`,
          gap: 2,
        }}
      >
        {Array.from({ length: cells }, (_, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          const isFilled = getPortraitCell(row, col);

          const cellDelay = (row + col) * 3;
          const cellOpacity = interpolate(adjustedFrame, [cellDelay, cellDelay + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                backgroundColor: isFilled ? COLORS.warmAccent : 'transparent',
                border: `1px solid ${COLORS.warmAccent}30`,
                opacity: cellOpacity,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          marginTop: 30,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.warmText,
        }}
      >
        Woven from nothing but pattern
      </div>
    </div>
  );
};

// Ada Lovelace quote
const AdaQuote: React.FC<{ frame: number; startFrame: number; attributionFrame: number }> = ({
  frame,
  startFrame,
  attributionFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const quoteProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const attrFrame = frame - attributionFrame;
  const attrProgress = attrFrame > 0 ? spring({
    frame: attrFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  }) : 0;

  const opacity = interpolate(quoteProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        textAlign: 'center',
        maxWidth: 900,
        padding: '0 60px',
      }}
    >
      {/* Quote */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.quote.fontFamily,
          fontStyle: 'italic',
          fontSize: 36,
          color: COLORS.warmText,
          lineHeight: 1.6,
          letterSpacing: '0.02em',
        }}
      >
        "The Analytical Engine weaves algebraical patterns
        <br />
        just as the Jacquard loom weaves flowers and leaves."
      </div>

      {/* Attribution */}
      <div
        style={{
          marginTop: 40,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.warmAccent,
          letterSpacing: '0.1em',
          opacity: interpolate(attrProgress, [0, 1], [0, 1]),
        }}
      >
        — ADA LOVELACE, 1843
      </div>

      {/* Decorative line */}
      <div
        style={{
          marginTop: 30,
          width: interpolate(quoteProgress, [0, 1], [0, 200]),
          height: 2,
          backgroundColor: COLORS.warmAccent,
          margin: '0 auto',
          opacity: 0.5,
        }}
      />
    </div>
  );
};

// Error visualization - torn cards
const ErrorVisualization: React.FC<{ frame: number; startFrame: number }> = ({
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
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 60,
          alignItems: 'center',
        }}
      >
        {/* Torn card */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: 160,
              height: 100,
            }}
          >
            {/* Left half */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 75,
                height: 100,
                backgroundColor: `${COLORS.warmText}E0`,
                borderRadius: '4px 0 0 4px',
                transform: `rotate(-5deg)`,
              }}
            />
            {/* Right half */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 75,
                height: 100,
                backgroundColor: `${COLORS.warmText}E0`,
                borderRadius: '0 4px 4px 0',
                transform: `rotate(5deg)`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 16,
              color: COLORS.warmAccent,
            }}
          >
            Torn cards
          </div>
        </div>

        {/* Misaligned holes */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 160,
              height: 100,
              backgroundColor: `${COLORS.warmText}E0`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: COLORS.warmBackground,
                  borderRadius: 2,
                  transform: `translateY(${(i - 1) * 8}px)`,
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 16,
              color: COLORS.warmAccent,
            }}
          >
            Misaligned holes
          </div>
        </div>

        {/* Wrong sequence */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 160,
              height: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {[1, 3, 2, 4].map((num, i) => (
              <div
                key={i}
                style={{
                  height: 20,
                  backgroundColor: `${COLORS.warmText}E0`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 12,
                  color: COLORS.warmBackground,
                }}
              >
                Card #{num}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 16,
              color: COLORS.warmAccent,
            }}
          >
            Wrong sequence
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.warmText,
          textAlign: 'center',
        }}
      >
        Every error was a ruined tapestry.
      </div>
    </div>
  );
};

// Standards visualization
const StandardsVisualization: React.FC<{ frame: number; startFrame: number }> = ({
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

  const standards = [
    { icon: '📏', label: 'Standardized card sizes' },
    { icon: '🔍', label: 'Inspection protocols' },
    { icon: '📋', label: 'Sequence verification' },
    { icon: '🔄', label: 'Error recovery' },
  ];

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
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 32,
          color: COLORS.warmText,
          textAlign: 'center',
          marginBottom: 50,
        }}
      >
        So they engineered solutions.
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 30,
        }}
      >
        {standards.map((item, i) => {
          const itemProgress = interpolate(adjustedFrame, [30 + i * 20, 60 + i * 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 24px',
                backgroundColor: `${COLORS.warmAccent}20`,
                borderRadius: 8,
                border: `1px solid ${COLORS.warmAccent}40`,
                opacity: itemProgress,
                transform: `translateX(${interpolate(itemProgress, [0, 1], [-20, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 18,
                  color: COLORS.warmText,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Foundation text - error handling emphasis
const FoundationText: React.FC<{ frame: number; startFrame: number }> = ({
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
          color: COLORS.warmText,
          lineHeight: 1.4,
        }}
      >
        Error handling.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.warmAccent,
          marginTop: 16,
        }}
      >
        At the very foundation.
      </div>
    </div>
  );
};

// Warm overlay (fading in at start, fading out at end)
const WarmOverlay: React.FC<{ frame: number; totalFrames: number }> = ({ frame, totalFrames }) => {
  // Fade in from previous scene's warm overlay
  const fadeIn = interpolate(frame, [0, 60], [0.3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade to cooler palette at end
  const fadeOut = interpolate(frame, [TRANSITION_OUT, totalFrames], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Initial warm overlay from Hardware transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.warmAccent,
          opacity: fadeIn,
          pointerEvents: 'none',
        }}
      />
      {/* Cool overlay for transition out */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.primary,
          opacity: fadeOut,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export const Loom: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Determine which content section to show
  const showYear = frame >= YEAR_APPEAR && frame < LOOM_APPEAR + 200;
  const showLoom = frame >= LOOM_APPEAR && frame < PUNCHED_CARD_START + 150;
  const showPunchedCards = frame >= PUNCHED_CARD_START && frame < WEAVING_START;
  const showBinary = frame >= BINARY_REVEAL_START && frame < WEAVING_START + 100;
  const showCardsStack = frame >= CARDS_STACK_START && frame < PORTRAIT_START;
  const showPortrait = frame >= PORTRAIT_START && frame < QUOTE_APPEAR;
  const showQuote = frame >= QUOTE_APPEAR && frame < ERRORS_START;
  const showErrors = frame >= ERRORS_START && frame < STANDARDS_START;
  const showStandards = frame >= STANDARDS_START && frame < FOUNDATION_TEXT;
  const showFoundation = frame >= FOUNDATION_TEXT;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.warmBackground }}>
      {/* Warm overlay transitions */}
      <WarmOverlay frame={frame} totalFrames={durationInFrames} />

      {/* Year display */}
      {showYear && (
        <YearDisplay frame={frame} startFrame={YEAR_APPEAR} fadeOutFrame={LOOM_APPEAR + 100} />
      )}

      {/* Loom illustration */}
      {showLoom && (
        <LoomIllustration frame={frame} startFrame={LOOM_APPEAR} fadeOutFrame={PUNCHED_CARD_START} />
      )}

      {/* Punched cards */}
      {showPunchedCards && (
        <>
          <PunchedCard frame={frame} startFrame={PUNCHED_CARD_START} cardIndex={0} offsetY={-50} />
          <PunchedCard frame={frame} startFrame={PUNCHED_CARD_START} cardIndex={1} offsetX={-180} offsetY={20} scale={0.9} />
          <PunchedCard frame={frame} startFrame={PUNCHED_CARD_START} cardIndex={2} offsetX={180} offsetY={20} scale={0.9} />
        </>
      )}

      {/* Binary reveal */}
      {showBinary && (
        <BinaryReveal frame={frame} startFrame={BINARY_REVEAL_START} />
      )}

      {/* Cards stack with counter */}
      {showCardsStack && (
        <CardsStack frame={frame} startFrame={CARDS_STACK_START} />
      )}

      {/* Portrait grid */}
      {showPortrait && (
        <PortraitGrid frame={frame} startFrame={PORTRAIT_START} />
      )}

      {/* Ada Lovelace quote */}
      {showQuote && (
        <AdaQuote frame={frame} startFrame={QUOTE_APPEAR} attributionFrame={QUOTE_ATTRIBUTION} />
      )}

      {/* Error visualization */}
      {showErrors && (
        <ErrorVisualization frame={frame} startFrame={ERRORS_START} />
      )}

      {/* Standards visualization */}
      {showStandards && (
        <StandardsVisualization frame={frame} startFrame={STANDARDS_START} />
      )}

      {/* Foundation text */}
      {showFoundation && (
        <FoundationText frame={frame} startFrame={FOUNDATION_TEXT} />
      )}
    </AbsoluteFill>
  );
};
