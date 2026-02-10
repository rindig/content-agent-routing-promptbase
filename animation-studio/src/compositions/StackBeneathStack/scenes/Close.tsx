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
 * SCENE 15: CLOSE (Section 14)
 * Duration: 45 seconds (1350 frames)
 *
 * Return to the simple Python line, but now with weight and meaning.
 * The weaving metaphor comes full circle.
 *
 * Animation Sequence:
 * | Frames    | Action |
 * |-----------|--------|
 * | 0-120     | Clear to just the Python code, large, centered |
 * | 120-250   | Faint layers appear beneath (very subtle) |
 * | 250-400   | "The loom weaves patterns" |
 * | 400-550   | "The engine weaves algebra" |
 * | 550-700   | "The computer weaves logic" |
 * | 700-850   | "And now AI weaves language" |
 * | 850-1000  | "Same pattern. Different layer." |
 * | 1000-1150 | "Based on history? We'll figure it out." |
 * | 1150-1350 | "We always do." - fade to black |
 */

// Timeline markers
const CODE_APPEAR = 0;
const LAYERS_APPEAR = 120;
const WEAVE_PATTERNS = 250;
const WEAVE_ALGEBRA = 400;
const WEAVE_LOGIC = 550;
const WEAVE_LANGUAGE = 700;
const SAME_PATTERN = 850;
const FIGURE_IT_OUT = 1000;
const ALWAYS_DO = 1150;

// Python code display
const PythonCode: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(progress, [0, 1], [0.9, 1]);
  const codeOpacity = interpolate(progress, [0, 1], [0, 1]) * opacity;

  return (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: codeOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.surface,
          padding: '24px 48px',
          borderRadius: 12,
          border: `1px solid ${COLORS.surfaceAlt}`,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 32,
        }}
      >
        <span style={{ color: COLORS.syntaxFunction }}>print</span>
        <span style={{ color: COLORS.text }}>(</span>
        <span style={{ color: COLORS.syntaxString }}>"Hello, World!"</span>
        <span style={{ color: COLORS.text }}>)</span>
      </div>
    </div>
  );
};

// Faint layers beneath
const FaintLayers: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 60], [0, 0.3], {
    extrapolateRight: 'clamp',
  });

  const layers = ['AST', 'Bytecode', 'C', 'Assembly', 'Machine', 'Hardware', '...'];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {layers.map((layer, i) => (
        <div
          key={layer}
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.textDim,
            opacity: 1 - i * 0.1,
          }}
        >
          {layer}
        </div>
      ))}
    </div>
  );
};

// Weaving sequence text
const WeavingText: React.FC<{
  frame: number;
  startFrame: number;
  text: string;
  highlight?: string;
}> = ({ frame, startFrame, text, highlight }) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${y}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.quote.fontFamily,
          fontStyle: 'italic',
          fontSize: 32,
          color: highlight ? COLORS.textMuted : COLORS.text,
          lineHeight: 1.5,
        }}
      >
        {text.split(highlight || '').map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && (
              <span style={{ color: COLORS.warmAccent }}>{highlight}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// "Same pattern. Different layer."
const SamePatternText: React.FC<{ frame: number; startFrame: number }> = ({
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
        top: '55%',
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
        }}
      >
        Same pattern.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 42,
          color: COLORS.primary,
          marginTop: 10,
          opacity: interpolate(adjustedFrame, [30, 60], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        Different layer.
      </div>
    </div>
  );
};

// "We'll figure it out" text
const FigureItOutText: React.FC<{ frame: number; startFrame: number }> = ({
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
          fontSize: 28,
          color: COLORS.textMuted,
          marginBottom: 20,
        }}
      >
        Based on history?
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 48,
          color: COLORS.text,
        }}
      >
        We'll figure it out.
      </div>
    </div>
  );
};

// "We always do." final text
const AlwaysDoText: React.FC<{ frame: number; startFrame: number }> = ({
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

  // Fade to black at the end
  const fadeOut = interpolate(adjustedFrame, [150, 200], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: opacity * fadeOut,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 64,
          color: COLORS.accent,
        }}
      >
        We always do.
      </div>
    </div>
  );
};

export const Close: React.FC = () => {
  const frame = useCurrentFrame();

  // Calculate code opacity (fades during weaving sequence)
  const codeOpacity = frame < WEAVE_PATTERNS
    ? 1
    : interpolate(frame, [WEAVE_PATTERNS, WEAVE_PATTERNS + 60], [1, 0.2], { extrapolateRight: 'clamp' });

  // Determine which elements to show
  const showCode = frame < SAME_PATTERN;
  const showLayers = frame >= LAYERS_APPEAR && frame < WEAVE_PATTERNS;

  // Weaving sequence
  const weavingLines = [
    { start: WEAVE_PATTERNS, text: 'The loom weaves patterns.' },
    { start: WEAVE_ALGEBRA, text: 'The engine weaves algebra.' },
    { start: WEAVE_LOGIC, text: 'The computer weaves logic.' },
    { start: WEAVE_LANGUAGE, text: 'And now AI weaves language.', highlight: 'AI' },
  ];

  const currentWeaveIndex = weavingLines.findIndex(
    (line, i) => frame >= line.start && (i === weavingLines.length - 1 || frame < weavingLines[i + 1].start)
  );

  const showSamePattern = frame >= SAME_PATTERN && frame < FIGURE_IT_OUT;
  const showFigureItOut = frame >= FIGURE_IT_OUT && frame < ALWAYS_DO;
  const showAlwaysDo = frame >= ALWAYS_DO;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Python code */}
      {showCode && <PythonCode frame={frame} opacity={codeOpacity} />}

      {/* Faint layers */}
      {showLayers && <FaintLayers frame={frame} startFrame={LAYERS_APPEAR} />}

      {/* Weaving sequence */}
      {currentWeaveIndex >= 0 && frame < SAME_PATTERN && (
        <WeavingText
          frame={frame}
          startFrame={weavingLines[currentWeaveIndex].start}
          text={weavingLines[currentWeaveIndex].text}
          highlight={weavingLines[currentWeaveIndex].highlight}
        />
      )}

      {/* Same pattern text */}
      {showSamePattern && (
        <SamePatternText frame={frame} startFrame={SAME_PATTERN} />
      )}

      {/* Figure it out */}
      {showFigureItOut && (
        <FigureItOutText frame={frame} startFrame={FIGURE_IT_OUT} />
      )}

      {/* Always do */}
      {showAlwaysDo && (
        <AlwaysDoText frame={frame} startFrame={ALWAYS_DO} />
      )}
    </AbsoluteFill>
  );
};
