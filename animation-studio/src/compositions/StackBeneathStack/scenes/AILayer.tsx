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
 * SCENE 14: THE AI LAYER (Section 13)
 * Duration: 75 seconds (2250 frames)
 *
 * Return to the AI interface from the opening. But now we see it differently.
 * AI is just the newest layer in the stack.
 *
 * Animation Sequence:
 * | Frames     | Action |
 * |------------|--------|
 * | 0-150      | Ascend back up through layers (reverse of descent) |
 * | 150-400    | AI chat interface reappears |
 * | 400-600    | Same prompt, same response |
 * | 600-900    | But now: seven layers visible beneath |
 * | 900-1200   | Quantum foam visible at bottom |
 * | 1200-1500  | "era of moths in relays" - show AI debugging |
 * | 1500-1800  | "AI is no different. Just the newest layer." |
 * | 1800-2050  | "The criticism... misses the point" |
 * | 2050-2250  | Full stack with AI on top |
 */

// Timeline markers
const ASCEND_LAYERS = 0;
const CHAT_APPEAR = 150;
const PROMPT_RESPONSE = 400;
const LAYERS_BENEATH = 600;
const QUANTUM_FOAM = 900;
const MOTHS_ERA = 1200;
const NEWEST_LAYER = 1500;
const CRITICISM_TEXT = 1800;
const FULL_STACK = 2050;

// Ascending through layers animation
const AscendingLayers: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const layers = [
    { name: 'Quantum', color: COLORS.cosmicPrimary },
    { name: 'Hardware', color: COLORS.cosmicAccent },
    { name: 'Machine Code', color: COLORS.danger },
    { name: 'Assembly', color: COLORS.warning },
    { name: 'C', color: COLORS.primary },
    { name: 'Bytecode', color: COLORS.primary },
    { name: 'AST', color: COLORS.syntaxFunction },
    { name: 'Python', color: COLORS.accent },
  ];

  const ascendProgress = interpolate(adjustedFrame, [0, 120], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {layers.map((layer, i) => {
        const layerY = interpolate(
          ascendProgress,
          [0, 1],
          [500 - i * 60, -200 - i * 80]
        );
        const layerOpacity = interpolate(
          layerY,
          [-200, 0, 400, 600],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        return (
          <div
            key={layer.name}
            style={{
              position: 'absolute',
              top: `calc(50% + ${layerY}px)`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '12px 40px',
              backgroundColor: `${layer.color}20`,
              border: `2px solid ${layer.color}`,
              borderRadius: 8,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 18,
              color: layer.color,
              opacity: layerOpacity,
              whiteSpace: 'nowrap',
            }}
          >
            {layer.name}
          </div>
        );
      })}

      {/* Ascending text */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.textMuted,
          opacity: interpolate(adjustedFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Ascending back through the stack...
      </div>
    </div>
  );
};

// AI Chat interface (similar to ColdOpen)
const AIChatInterface: React.FC<{ frame: number; startFrame: number; showLayers: boolean }> = ({
  frame,
  startFrame,
  showLayers,
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
        top: showLayers ? '25%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        transition: 'top 0.5s ease-out',
      }}
    >
      {/* Chat container */}
      <div
        style={{
          width: 700,
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          border: `1px solid ${COLORS.surfaceAlt}`,
          overflow: 'hidden',
          boxShadow: `0 20px 60px ${COLORS.background}80`,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: `1px solid ${COLORS.surfaceAlt}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.danger }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.warning }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS.accent }} />
          <span
            style={{
              marginLeft: 12,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 14,
              color: COLORS.textMuted,
            }}
          >
            AI Assistant
          </span>
        </div>

        {/* Chat content */}
        <div style={{ padding: 24 }}>
          {/* User message */}
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.primary,
                padding: '12px 16px',
                borderRadius: '12px 12px 0 12px',
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 15,
                color: COLORS.text,
                maxWidth: '70%',
              }}
            >
              Write hello world in Python.
            </div>
          </div>

          {/* AI response */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: COLORS.surfaceAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: COLORS.surfaceAlt,
                  padding: 16,
                  borderRadius: '0 12px 12px 12px',
                }}
              >
                {/* Code block */}
                <div
                  style={{
                    backgroundColor: COLORS.background,
                    padding: 16,
                    borderRadius: 8,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 16,
                  }}
                >
                  <span style={{ color: COLORS.syntaxFunction }}>print</span>
                  <span style={{ color: COLORS.text }}>(</span>
                  <span style={{ color: COLORS.syntaxString }}>"Hello, World!"</span>
                  <span style={{ color: COLORS.text }}>)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layers beneath visualization
const LayersBeneath: React.FC<{ frame: number; startFrame: number; showQuantum: boolean }> = ({
  frame,
  startFrame,
  showQuantum,
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

  const layers = [
    { name: 'Python', color: COLORS.accent },
    { name: 'AST', color: COLORS.syntaxFunction },
    { name: 'Bytecode', color: COLORS.primary },
    { name: 'C', color: COLORS.primary },
    { name: 'Assembly', color: COLORS.warning },
    { name: 'Machine Code', color: COLORS.danger },
    { name: 'Hardware', color: COLORS.cosmicPrimary },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {/* Connecting line from chat */}
      <div
        style={{
          width: 2,
          height: 40,
          backgroundColor: COLORS.textDim,
        }}
      />

      {/* Layer pills */}
      {layers.map((layer, i) => {
        const layerDelay = i * 10;
        const layerOpacity = interpolate(adjustedFrame, [layerDelay, layerDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={layer.name}
            style={{
              padding: '6px 20px',
              backgroundColor: `${layer.color}15`,
              border: `1px solid ${layer.color}40`,
              borderRadius: 4,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 12,
              color: layer.color,
              opacity: layerOpacity,
              width: 140 - i * 8,
              textAlign: 'center',
            }}
          >
            {layer.name}
          </div>
        );
      })}

      {/* Quantum foam */}
      {showQuantum && (
        <div
          style={{
            marginTop: 8,
            padding: '8px 24px',
            backgroundColor: `${COLORS.cosmicPrimary}20`,
            border: `2px solid ${COLORS.cosmicPrimary}`,
            borderRadius: 8,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 14,
            color: COLORS.cosmicPrimary,
            opacity: interpolate(adjustedFrame, [300, 330], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Quantum Probability
        </div>
      )}
    </div>
  );
};

// "Era of moths" text
const MothsEraText: React.FC<{ frame: number; startFrame: number }> = ({
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
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.text,
          lineHeight: 1.6,
        }}
      >
        We're in the{' '}
        <span style={{ color: COLORS.warning }}>era of moths in relays</span>
        {' '}again.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 22,
          color: COLORS.textMuted,
          marginTop: 20,
          opacity: interpolate(adjustedFrame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Finding the bugs. Building the standards.
        <br />
        Engineering the solutions.
      </div>
    </div>
  );
};

// "Newest layer" statement
const NewestLayerText: React.FC<{ frame: number; startFrame: number }> = ({
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
          fontSize: 42,
          color: COLORS.text,
          marginBottom: 20,
        }}
      >
        AI is no different.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.primary,
          opacity: interpolate(adjustedFrame, [45, 75], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Just the newest layer.
      </div>
    </div>
  );
};

// "Criticism misses the point" text
const CriticismText: React.FC<{ frame: number; startFrame: number }> = ({
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
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 26,
          color: COLORS.textMuted,
          marginBottom: 20,
        }}
      >
        The criticism that "AI makes mistakes"
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
        }}
      >
        misses the entire point of computing history.
      </div>
    </div>
  );
};

// Full stack with AI on top
const FullStackWithAI: React.FC<{ frame: number; startFrame: number }> = ({
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

  const layers = [
    { name: 'AI / Language Models', color: COLORS.primary, isNew: true },
    { name: 'Python', color: COLORS.accent, isNew: false },
    { name: 'AST', color: COLORS.syntaxFunction, isNew: false },
    { name: 'Bytecode', color: COLORS.primary, isNew: false },
    { name: 'C', color: COLORS.primary, isNew: false },
    { name: 'Assembly', color: COLORS.warning, isNew: false },
    { name: 'Machine Code', color: COLORS.danger, isNew: false },
    { name: 'Hardware', color: COLORS.cosmicPrimary, isNew: false },
    { name: 'Transistors', color: COLORS.cosmicAccent, isNew: false },
    { name: 'Quantum Probability', color: COLORS.cosmicPrimary, isNew: false },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {layers.map((layer, i) => {
        const layerDelay = i * 8;
        const layerProgress = interpolate(adjustedFrame, [layerDelay, layerDelay + 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const glowIntensity = layer.isNew ? 0.5 + Math.sin(adjustedFrame * 0.1) * 0.2 : 0;

        return (
          <div
            key={layer.name}
            style={{
              padding: layer.isNew ? '10px 30px' : '6px 20px',
              backgroundColor: layer.isNew ? `${layer.color}30` : `${layer.color}15`,
              border: `${layer.isNew ? 2 : 1}px solid ${layer.color}${layer.isNew ? '' : '60'}`,
              borderRadius: layer.isNew ? 8 : 4,
              fontFamily: layer.isNew ? TYPOGRAPHY.display.fontFamily : TYPOGRAPHY.code.fontFamily,
              fontWeight: layer.isNew ? TYPOGRAPHY.display.weights.bold : 400,
              fontSize: layer.isNew ? 18 : 12,
              color: layer.color,
              opacity: layerProgress,
              transform: `translateY(${interpolate(layerProgress, [0, 1], [-10, 0])}px)`,
              boxShadow: layer.isNew ? `0 0 ${30 * glowIntensity}px ${layer.color}60` : 'none',
            }}
          >
            {layer.isNew && '✨ '}
            {layer.name}
            {layer.isNew && ' ← NEW LAYER'}
          </div>
        );
      })}
    </div>
  );
};

export const AILayer: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which sections to show
  const showAscend = frame >= ASCEND_LAYERS && frame < CHAT_APPEAR + 50;
  const showChat = frame >= CHAT_APPEAR && frame < MOTHS_ERA;
  const showLayersBeneath = frame >= LAYERS_BENEATH && frame < MOTHS_ERA;
  const showQuantum = frame >= QUANTUM_FOAM;
  const showMoths = frame >= MOTHS_ERA && frame < NEWEST_LAYER;
  const showNewest = frame >= NEWEST_LAYER && frame < CRITICISM_TEXT;
  const showCriticism = frame >= CRITICISM_TEXT && frame < FULL_STACK;
  const showFullStack = frame >= FULL_STACK;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Ascending animation */}
      {showAscend && (
        <AscendingLayers frame={frame} startFrame={ASCEND_LAYERS} />
      )}

      {/* Chat interface */}
      {showChat && (
        <AIChatInterface
          frame={frame}
          startFrame={CHAT_APPEAR}
          showLayers={frame >= LAYERS_BENEATH}
        />
      )}

      {/* Layers beneath */}
      {showLayersBeneath && (
        <LayersBeneath
          frame={frame}
          startFrame={LAYERS_BENEATH}
          showQuantum={showQuantum}
        />
      )}

      {/* Moths era text */}
      {showMoths && (
        <MothsEraText frame={frame} startFrame={MOTHS_ERA} />
      )}

      {/* Newest layer */}
      {showNewest && (
        <NewestLayerText frame={frame} startFrame={NEWEST_LAYER} />
      )}

      {/* Criticism text */}
      {showCriticism && (
        <CriticismText frame={frame} startFrame={CRITICISM_TEXT} />
      )}

      {/* Full stack with AI */}
      {showFullStack && (
        <FullStackWithAI frame={frame} startFrame={FULL_STACK} />
      )}
    </AbsoluteFill>
  );
};
