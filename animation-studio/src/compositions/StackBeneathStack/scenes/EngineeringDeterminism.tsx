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
 * SCENE 13: ENGINEERING DETERMINISM (Section 12)
 * Duration: 45 seconds (1350 frames)
 *
 * The solution: architecture, redundancy, error correction.
 * How we made certainty from chaos.
 *
 * Animation Sequence:
 * | Frames    | Action |
 * |-----------|--------|
 * | 0-150     | Single electron (chaotic) vs many electrons (smooth) |
 * | 150-400   | ECC memory visualization: bit flips, correction |
 * | 400-650   | "You never know it happened" - seamless fix |
 * | 650-950   | The pattern list appears |
 * | 950-1200  | "At every layer, uncertainty. At every layer, engineering." |
 * | 1200-1350 | Transition to AI layer |
 */

// Timeline markers
const ELECTRON_COMPARISON = 0;
const ECC_VISUAL = 150;
const SEAMLESS_FIX = 400;
const PATTERN_LIST = 650;
const ENGINEERING_TEXT = 950;
const TRANSITION_OUT = 1200;

// Single vs Many electrons comparison
const ElectronComparison: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Fade out before ECC_VISUAL
  const fadeOut = interpolate(frame, [ECC_VISUAL - 30, ECC_VISUAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        display: 'flex',
        gap: 100,
        alignItems: 'center',
      }}
    >
      {/* Single electron - chaotic */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 200,
            height: 200,
            border: `2px solid ${COLORS.cosmicPrimary}40`,
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Single chaotic electron */}
          <div
            style={{
              position: 'absolute',
              left: `${50 + Math.sin(adjustedFrame * 0.3) * 40 + Math.cos(adjustedFrame * 0.17) * 30}%`,
              top: `${50 + Math.cos(adjustedFrame * 0.25) * 40 + Math.sin(adjustedFrame * 0.2) * 30}%`,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: COLORS.cosmicAccent,
              boxShadow: `0 0 15px ${COLORS.cosmicAccent}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 18,
            color: COLORS.danger,
          }}
        >
          One electron
        </div>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 14,
            color: COLORS.textMuted,
            marginTop: 4,
          }}
        >
          Unpredictable
        </div>
      </div>

      {/* VS */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontSize: 24,
          color: COLORS.textDim,
        }}
      >
        vs
      </div>

      {/* Many electrons - smooth */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 200,
            height: 200,
            border: `2px solid ${COLORS.accent}40`,
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Many electrons averaging out */}
          {Array.from({ length: 50 }, (_, i) => {
            const baseX = 50 + (i % 10 - 5) * 8;
            const baseY = 50 + (Math.floor(i / 10) - 2.5) * 15;
            const jitterX = Math.sin(adjustedFrame * 0.2 + i * 0.5) * 3;
            const jitterY = Math.cos(adjustedFrame * 0.15 + i * 0.7) * 3;

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${baseX + jitterX}%`,
                  top: `${baseY + jitterY}%`,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: COLORS.accent,
                  opacity: 0.6,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 18,
            color: COLORS.accent,
          }}
        >
          Billions of electrons
        </div>
        <div
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 14,
            color: COLORS.textMuted,
            marginTop: 4,
          }}
        >
          Statistically predictable
        </div>
      </div>
    </div>
  );
};

// ECC memory visualization
const ECCVisualization: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Fade out before SEAMLESS_FIX
  const fadeOut = interpolate(frame, [SEAMLESS_FIX - 30, SEAMLESS_FIX], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  // Bit pattern
  const originalBits = [1, 0, 1, 1, 0, 0, 1, 0];
  const corruptedIndex = 3;
  const correctionFrame = 120;

  // Parity bits visualization
  const parityBits = [0, 1, 1]; // Simplified

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
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
          fontSize: 28,
          color: COLORS.text,
          marginBottom: 40,
        }}
      >
        Error-Correcting Code (ECC) Memory
      </div>

      {/* Data bits */}
      <div style={{ marginBottom: 30 }}>
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.textMuted,
            marginBottom: 10,
          }}
        >
          Data Bits
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {originalBits.map((bit, i) => {
            const isCorrupted = i === corruptedIndex && adjustedFrame > 30 && adjustedFrame < correctionFrame;
            const isCorrected = i === corruptedIndex && adjustedFrame >= correctionFrame;
            const displayBit = isCorrupted ? 1 - bit : bit;

            return (
              <div
                key={i}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: isCorrupted
                    ? `${COLORS.danger}30`
                    : isCorrected
                      ? `${COLORS.accent}30`
                      : COLORS.surface,
                  border: `2px solid ${isCorrupted ? COLORS.danger : isCorrected ? COLORS.accent : COLORS.surfaceAlt}`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 24,
                  color: isCorrupted ? COLORS.danger : isCorrected ? COLORS.accent : COLORS.text,
                  transition: 'all 0.3s',
                }}
              >
                {displayBit}
              </div>
            );
          })}
        </div>
      </div>

      {/* Parity bits */}
      <div style={{ marginBottom: 30 }}>
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.textMuted,
            marginBottom: 10,
          }}
        >
          Parity Bits (for error detection)
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {parityBits.map((bit, i) => {
            const isChecking = adjustedFrame > 60 && adjustedFrame < correctionFrame;

            return (
              <div
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: isChecking ? `${COLORS.warning}20` : COLORS.surface,
                  border: `2px solid ${isChecking ? COLORS.warning : COLORS.surfaceAlt}`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 18,
                  color: isChecking ? COLORS.warning : COLORS.textMuted,
                }}
              >
                {bit}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status message */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: adjustedFrame < 30
            ? COLORS.text
            : adjustedFrame < correctionFrame
              ? COLORS.danger
              : COLORS.accent,
          marginTop: 20,
        }}
      >
        {adjustedFrame < 30 && 'Data stored correctly'}
        {adjustedFrame >= 30 && adjustedFrame < 60 && '⚡ Cosmic ray hits bit 4!'}
        {adjustedFrame >= 60 && adjustedFrame < correctionFrame && '🔍 Error detected... locating...'}
        {adjustedFrame >= correctionFrame && '✓ Error corrected automatically!'}
      </div>
    </div>
  );
};

// "You never know it happened" message
const SeamlessMessage: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Fade out before PATTERN_LIST
  const fadeOut = interpolate(frame, [PATTERN_LIST - 30, PATTERN_LIST], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

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
          fontSize: 42,
          color: COLORS.text,
          marginBottom: 20,
        }}
      >
        You never know it happened.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.accent,
        }}
      >
        The system corrects itself silently, continuously.
      </div>
    </div>
  );
};

// Pattern list
const PatternList: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Fade out before ENGINEERING_TEXT
  const fadeOut = interpolate(frame, [ENGINEERING_TEXT - 30, ENGINEERING_TEXT], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  const patterns = [
    { text: 'Hole or no hole in a punched card', icon: '🎴' },
    { text: 'Moth in a relay', icon: '🦋' },
    { text: 'Missing entries in a lookup table', icon: '📊' },
    { text: 'Cosmic rays flipping bits', icon: '✨' },
    { text: 'Electrons tunneling through barriers', icon: '⚛️' },
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
          fontSize: 28,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        Uncertainty at every layer:
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {patterns.map((pattern, i) => {
          const itemOpacity = interpolate(adjustedFrame, [i * 25, i * 25 + 30], [0, 1], {
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
                opacity: itemOpacity,
                transform: `translateX(${interpolate(itemOpacity, [0, 1], [-30, 0])}px)`,
              }}
            >
              <span style={{ fontSize: 24 }}>{pattern.icon}</span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.text,
                }}
              >
                {pattern.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Engineering statement
const EngineeringStatement: React.FC<{ frame: number; startFrame: number }> = ({
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
    frame: adjustedFrame - 45,
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
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
          marginBottom: 20,
          opacity: interpolate(line1Progress, [0, 1], [0, 1]),
        }}
      >
        At every layer, uncertainty.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.accent,
          opacity: interpolate(line2Progress, [0, 1], [0, 1]),
        }}
      >
        At every layer, engineering.
      </div>
    </div>
  );
};

// Cosmic background (continuing from previous scene)
const CosmicBackground: React.FC<{ frame: number }> = ({ frame }) => {
  // Fade from cosmic to more neutral
  const cosmicFade = interpolate(frame, [0, TRANSITION_OUT], [0.3, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: COLORS.background,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.cosmicBackground,
          opacity: cosmicFade,
        }}
      />
    </div>
  );
};

export const EngineeringDeterminism: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which sections to show - NO OVERLAP between sections
  const showElectrons = frame >= ELECTRON_COMPARISON && frame < ECC_VISUAL;
  const showECC = frame >= ECC_VISUAL && frame < SEAMLESS_FIX;
  const showSeamless = frame >= SEAMLESS_FIX && frame < PATTERN_LIST;
  const showPattern = frame >= PATTERN_LIST && frame < ENGINEERING_TEXT;
  const showEngineering = frame >= ENGINEERING_TEXT;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Background */}
      <CosmicBackground frame={frame} />

      {/* Electron comparison */}
      {showElectrons && (
        <ElectronComparison frame={frame} startFrame={ELECTRON_COMPARISON} />
      )}

      {/* ECC visualization */}
      {showECC && (
        <ECCVisualization frame={frame} startFrame={ECC_VISUAL} />
      )}

      {/* Seamless message */}
      {showSeamless && (
        <SeamlessMessage frame={frame} startFrame={SEAMLESS_FIX} />
      )}

      {/* Pattern list */}
      {showPattern && (
        <PatternList frame={frame} startFrame={PATTERN_LIST} />
      )}

      {/* Engineering statement */}
      {showEngineering && (
        <EngineeringStatement frame={frame} startFrame={ENGINEERING_TEXT} />
      )}
    </AbsoluteFill>
  );
};
