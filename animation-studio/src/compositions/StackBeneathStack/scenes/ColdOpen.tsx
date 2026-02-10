import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS, FPS } from '../constants';
import { ChatInterface } from '../components';

/**
 * SCENE 0: COLD OPEN
 * Duration: 45 seconds (1350 frames) - TIGHTENED PACING
 *
 * Animation Sequence (revised for snappier feel):
 * | Frames | Action |
 * |--------|--------|
 * | 0-20   | Fade in chat interface from black |
 * | 20-40  | Cursor blinks in input field |
 * | 40-130 | Text types: "Write hello world in Python." |
 * | 130-160| Pause (beat) |
 * | 160-200| Typing indicator appears and pulses |
 * | 200-230| Code block fades in with spring animation |
 * | 230-280| Hold on code briefly |
 * | 280-340| "22 characters" counter appears prominently |
 * | 340-480| Seven labeled layer lines appear beneath |
 * | 480-560| Particle effects begin |
 * | 560-680| Interface shrinks and recedes |
 * | 680-780| "Probabilistic" word pulses center screen |
 * | 780-810| Fade to black |
 */

const USER_MESSAGE = 'Write hello world in Python.';
const AI_CODE_RESPONSE = 'print("Hello, World!")';

// Layer lines with labels that appear beneath the interface
const LayerLines: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const layers = [
    { label: 'Python', color: COLORS.accent, delay: 0 },
    { label: 'AST', color: COLORS.syntaxFunction, delay: 8 },
    { label: 'Bytecode', color: COLORS.primary, delay: 16 },
    { label: 'C', color: COLORS.syntaxKeyword, delay: 24 },
    { label: 'Assembly', color: COLORS.warning, delay: 32 },
    { label: 'Machine Code', color: COLORS.danger, delay: 40 },
    { label: 'Hardware', color: COLORS.cosmicPrimary, delay: 48 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
      }}
    >
      {layers.map((layer, index) => {
        const layerProgress = spring({
          frame: frame - startFrame - layer.delay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const opacity = interpolate(layerProgress, [0, 1], [0, 0.6]);
        const width = interpolate(layerProgress, [0, 1], [0, 700 - index * 60]);
        const labelOpacity = interpolate(layerProgress, [0.5, 1], [0, 0.8], {
          extrapolateLeft: 'clamp',
        });

        return (
          <div
            key={layer.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              opacity,
            }}
          >
            {/* Label on left */}
            <span
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 12,
                color: layer.color,
                opacity: labelOpacity,
                width: 100,
                textAlign: 'right',
                letterSpacing: '0.02em',
              }}
            >
              {layer.label}
            </span>

            {/* Line */}
            <div
              style={{
                height: 3,
                width,
                backgroundColor: layer.color,
                borderRadius: 2,
                boxShadow: `0 0 8px ${layer.color}40`,
              }}
            />

            {/* Matching width spacer for symmetry */}
            <span style={{ width: 100 }} />
          </div>
        );
      })}
    </div>
  );
};

// Character counter that appears - MORE PROMINENT
const CharacterCounter: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  // Subtle pulse after entrance
  const adjustedFrame = frame - startFrame;
  const pulse = adjustedFrame > 20 ? 1 + Math.sin(adjustedFrame * 0.15) * 0.03 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        top: '62%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale * pulse})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 48,
          color: COLORS.text,
          letterSpacing: '0.02em',
        }}
      >
        22 characters
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
        }}
      >
        that trigger twelve thousand lines of code
      </div>
    </div>
  );
};

// Subtle electron particle effects rising from bottom
const ParticleEffects: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  // Fade in the whole effect
  const effectOpacity = interpolate(
    adjustedFrame,
    [0, 30],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Generate deterministic "electron" particles - fewer, more elegant
  const particles = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 137.5; // Golden angle for distribution
    const x = 30 + (seed % 40); // Keep particles more centered (30-70%)
    const speed = 0.8 + (i % 3) * 0.4;
    const size = 3 + (i % 2) * 2;
    const phaseOffset = i * 0.5;

    // Particles drift upward
    const baseY = (adjustedFrame * speed * 0.3) % 120;
    // Add slight horizontal wobble
    const wobble = Math.sin((adjustedFrame + phaseOffset) * 0.1) * 3;

    // Fade based on vertical position
    const verticalFade = interpolate(baseY, [0, 40, 100, 120], [0, 1, 1, 0]);

    return {
      x: x + wobble,
      y: baseY,
      size,
      opacity: verticalFade * 0.4,
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: effectOpacity,
      }}
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            bottom: particle.y,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            backgroundColor: COLORS.cosmicPrimary,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${COLORS.cosmicPrimary}60`,
          }}
        />
      ))}
    </div>
  );
};

// The "Probabilistic" word that pulses at the end
const ProbabilisticWord: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;

  if (adjustedFrame < 0) return null;

  // Entrance
  const entrance = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Pulse effect
  const pulsePhase = adjustedFrame / 10;
  const pulse = 1 + Math.sin(pulsePhase) * 0.03;

  // Exit (fade out after 40 frames)
  const exitOpacity = interpolate(
    adjustedFrame,
    [0, 10, 40, 60],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp' }
  );

  const scale = entrance * pulse;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: exitOpacity,
        fontFamily: TYPOGRAPHY.display.fontFamily,
        fontWeight: TYPOGRAPHY.display.weights.black,
        fontSize: 72,
        color: COLORS.text,
        letterSpacing: '0.05em',
        textShadow: `0 0 40px ${COLORS.primary}40`,
      }}
    >
      Probabilistic.
    </div>
  );
};

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers (in frames) - TIGHTENED PACING
  const CHAT_FADE_IN_END = 20;
  const USER_TYPE_START = 40;
  const USER_TYPE_END = 130;
  const TYPING_INDICATOR_START = 160;
  const AI_RESPONSE_START = 200;
  const COUNTER_APPEAR = 280;
  const LAYER_LINES_APPEAR = 400;
  const PARTICLES_START = 520;
  const INTERFACE_SHRINK_START = 600;
  const PROBABILISTIC_START = 720;
  const FADE_TO_BLACK_START = 800;

  // Interface shrink animation
  const shrinkProgress = interpolate(
    frame,
    [INTERFACE_SHRINK_START, INTERFACE_SHRINK_START + 100],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const interfaceScale = interpolate(shrinkProgress, [0, 1], [1, 0.6]);
  const interfaceTranslateY = interpolate(shrinkProgress, [0, 1], [0, -100]);
  const interfaceOpacity = interpolate(shrinkProgress, [0, 0.8, 1], [1, 0.5, 0]);

  // Counter fade out when layer lines appear
  const counterFadeOut = frame >= LAYER_LINES_APPEAR
    ? interpolate(frame, [LAYER_LINES_APPEAR, LAYER_LINES_APPEAR + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Final fade to black
  const fadeToBlack = interpolate(
    frame,
    [FADE_TO_BLACK_START, FADE_TO_BLACK_START + 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Chat interface */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${interfaceScale}) translateY(${interfaceTranslateY}px)`,
          opacity: interfaceOpacity,
        }}
      >
        <ChatInterface
          userMessage={USER_MESSAGE}
          aiResponse={AI_CODE_RESPONSE}
          userMessageStartFrame={USER_TYPE_START}
          typingIndicatorStartFrame={TYPING_INDICATOR_START}
          aiResponseStartFrame={AI_RESPONSE_START}
          charDelay={2} // 2 frames per character = snappy typing
        />
      </div>

      {/* Character counter - fades out before layer lines */}
      {frame >= COUNTER_APPEAR && frame < LAYER_LINES_APPEAR + 30 && (
        <div style={{ opacity: counterFadeOut }}>
          <CharacterCounter frame={frame} startFrame={COUNTER_APPEAR} />
        </div>
      )}

      {/* Layer lines with labels */}
      {frame >= LAYER_LINES_APPEAR && (
        <LayerLines frame={frame} startFrame={LAYER_LINES_APPEAR} />
      )}

      {/* Particle effects - more subtle */}
      {frame >= PARTICLES_START && (
        <ParticleEffects frame={frame} startFrame={PARTICLES_START} />
      )}

      {/* "Probabilistic" word */}
      {frame >= PROBABILISTIC_START && (
        <ProbabilisticWord frame={frame} startFrame={PROBABILISTIC_START} />
      )}

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: fadeToBlack,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
