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
 * SCENE 2: THE SURFACE (Section 1)
 * Duration: 33 seconds (990 frames)
 *
 * The Python code, large and centered. This is the "top" of the stack.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Code fades in, large, centered |
 * | 30-60  | Syntax highlighting applies (spring animation per element) |
 * | 60-300 | Hold - narration about "clean, readable" |
 * | 300-400| On "But Python doesn't run this" - colors slightly desaturate |
 * | 400-500| On "So what actually happens?" - code begins to shrink |
 * | 500-700| Code moves to top of frame, becomes first layer in stack |
 * | 700-800| Layer stack appears, divider line draws beneath |
 * | 800-990| Hold with layer stack visible, ready for transition |
 */

const PYTHON_CODE = 'print("Hello, World!")';

// Large Python code display with animated syntax highlighting
const PythonCodeDisplay: React.FC<{
  frame: number;
  entranceFrame: number;
  desaturationStart: number;
  shrinkStart: number;
}> = ({ frame, entranceFrame, desaturationStart, shrinkStart }) => {
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - entranceFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const baseOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const baseScale = interpolate(entranceProgress, [0, 1], [0.9, 1]);
  const baseTranslateY = interpolate(entranceProgress, [0, 1], [30, 0]);

  // Syntax highlighting entrance (staggered)
  const printProgress = spring({
    frame: frame - entranceFrame - 10,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const parenProgress = spring({
    frame: frame - entranceFrame - 15,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const stringProgress = spring({
    frame: frame - entranceFrame - 20,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Desaturation effect
  const desaturation = frame >= desaturationStart
    ? interpolate(
        frame,
        [desaturationStart, desaturationStart + 60],
        [0, 0.5],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  // Shrink and move to top
  const shrinkProgress = frame >= shrinkStart
    ? interpolate(
        frame,
        [shrinkStart, shrinkStart + 150],
        [0, 1],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.3]);
  const translateY = interpolate(shrinkProgress, [0, 1], [0, -350]);
  const finalOpacity = interpolate(shrinkProgress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  // Color helpers with desaturation
  const applyDesaturation = (color: string, amount: number): string => {
    // Simple desaturation by mixing with gray
    return amount > 0 ? `color-mix(in srgb, ${color}, ${COLORS.textMuted} ${amount * 100}%)` : color;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateY(${baseTranslateY + translateY}px) scale(${baseScale * scale})`,
        opacity: baseOpacity * finalOpacity,
        filter: desaturation > 0 ? `saturate(${1 - desaturation * 0.6})` : 'none',
      }}
    >
      {/* Code container */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: '32px 48px',
          border: `2px solid ${COLORS.surfaceAlt}`,
          boxShadow: `0 0 60px ${COLORS.primary}20`,
        }}
      >
        {/* Code text with animated syntax highlighting */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 56,
            fontWeight: TYPOGRAPHY.code.weights.medium,
            whiteSpace: 'nowrap',
          }}
        >
          {/* print */}
          <span
            style={{
              color: COLORS.syntaxFunction,
              opacity: interpolate(printProgress, [0, 1], [0.3, 1]),
              transform: `scale(${interpolate(printProgress, [0, 1], [0.95, 1])})`,
              display: 'inline-block',
            }}
          >
            print
          </span>

          {/* ( */}
          <span
            style={{
              color: COLORS.text,
              opacity: interpolate(parenProgress, [0, 1], [0.3, 1]),
            }}
          >
            (
          </span>

          {/* "Hello, World!" */}
          <span
            style={{
              color: COLORS.syntaxString,
              opacity: interpolate(stringProgress, [0, 1], [0.3, 1]),
              transform: `scale(${interpolate(stringProgress, [0, 1], [0.95, 1])})`,
              display: 'inline-block',
            }}
          >
            "Hello, World!"
          </span>

          {/* ) */}
          <span
            style={{
              color: COLORS.text,
              opacity: interpolate(parenProgress, [0, 1], [0.3, 1]),
            }}
          >
            )
          </span>
        </div>
      </div>

      {/* Layer label */}
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 14,
          color: COLORS.textMuted,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: interpolate(entranceProgress, [0.5, 1], [0, 0.7], { extrapolateLeft: 'clamp' }),
        }}
      >
        Layer 1: Python
      </div>
    </div>
  );
};

// Divider line that draws beneath the layer stack
const DividerLine: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const width = interpolate(progress, [0, 1], [0, 100]);
  const opacity = interpolate(progress, [0, 1], [0, 0.3]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${width}%`,
        height: 1,
        backgroundColor: COLORS.primary,
        opacity,
      }}
    />
  );
};

// Transitional text that appears when code desaturates
const TransitionText: React.FC<{
  frame: number;
  line1Start: number;
  line2Start: number;
  fadeOutStart: number;
}> = ({ frame, line1Start, line2Start, fadeOutStart }) => {
  const { fps } = useVideoConfig();

  // Line 1: "But Python doesn't run this directly."
  const line1Progress = spring({
    frame: frame - line1Start,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Line 2: "So what actually happens?"
  const line2Progress = spring({
    frame: frame - line2Start,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Fade out
  const fadeOut = frame >= fadeOutStart
    ? interpolate(frame, [fadeOutStart, fadeOutStart + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Line 1 */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.textMuted,
          marginBottom: 16,
          opacity: interpolate(line1Progress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line1Progress, [0, 1], [20, 0])}px)`,
        }}
      >
        But Python doesn't run this directly.
      </div>

      {/* Line 2 */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
          opacity: interpolate(line2Progress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line2Progress, [0, 1], [20, 0])}px)`,
        }}
      >
        So what actually happens?
      </div>
    </div>
  );
};

// Descent indicator - arrow pointing down with "descending" animation
const DescentIndicator: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;

  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Bobbing animation
  const bobOffset = Math.sin(adjustedFrame * 0.15) * 8;

  const opacity = interpolate(entranceProgress, [0, 1], [0, 0.8]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: `translateX(-50%) translateY(${bobOffset}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.primary,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 2
      </div>

      {/* Animated arrow */}
      <div
        style={{
          fontSize: 32,
          color: COLORS.primary,
        }}
      >
        ↓
      </div>
    </div>
  );
};

// Preview hint of what's coming (AST tree structure hint)
const NextLayerPreview: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.6]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        textAlign: 'center',
      }}
    >
      {/* AST preview label */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 42,
          color: COLORS.syntaxFunction,
          marginBottom: 16,
        }}
      >
        Abstract Syntax Tree
      </div>

      {/* Simple tree structure hint */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          lineHeight: 1.8,
        }}
      >
        <div>Module</div>
        <div style={{ marginLeft: 20 }}>└── Expr</div>
        <div style={{ marginLeft: 40 }}>└── Call</div>
        <div style={{ marginLeft: 60, color: COLORS.syntaxFunction }}>├── print</div>
        <div style={{ marginLeft: 60, color: COLORS.syntaxString }}>└── "Hello, World!"</div>
      </div>
    </div>
  );
};

export const Surface: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers - REVISED for better pacing
  const CODE_ENTRANCE = 0;
  const DESATURATION_START = 250;
  const TRANSITION_TEXT_LINE1 = 280;
  const TRANSITION_TEXT_LINE2 = 340;
  const SHRINK_START = 420;
  const TRANSITION_TEXT_FADEOUT = 480;
  const LAYER_STACK_APPEAR = 550;
  const DIVIDER_APPEAR = 580;
  const NEXT_LAYER_PREVIEW = 650;
  const DESCENT_INDICATOR = 700;

  // Show layer stack after code shrinks
  const showLayerStack = frame >= LAYER_STACK_APPEAR;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Python code display */}
      <PythonCodeDisplay
        frame={frame}
        entranceFrame={CODE_ENTRANCE}
        desaturationStart={DESATURATION_START}
        shrinkStart={SHRINK_START}
      />

      {/* Transition text */}
      {frame >= TRANSITION_TEXT_LINE1 && frame < TRANSITION_TEXT_FADEOUT + 60 && (
        <TransitionText
          frame={frame}
          line1Start={TRANSITION_TEXT_LINE1}
          line2Start={TRANSITION_TEXT_LINE2}
          fadeOutStart={TRANSITION_TEXT_FADEOUT}
        />
      )}

      {/* Layer stack appears after transition */}
      {showLayerStack && (
        <LayerStack
          activeLayer="python"
          entranceFrame={LAYER_STACK_APPEAR}
          visible={true}
        />
      )}

      {/* Divider line beneath layer stack */}
      {frame >= DIVIDER_APPEAR && (
        <DividerLine frame={frame} startFrame={DIVIDER_APPEAR} />
      )}

      {/* Preview of next layer */}
      {frame >= NEXT_LAYER_PREVIEW && (
        <NextLayerPreview frame={frame} startFrame={NEXT_LAYER_PREVIEW} />
      )}

      {/* Descent indicator */}
      {frame >= DESCENT_INDICATOR && (
        <DescentIndicator frame={frame} startFrame={DESCENT_INDICATOR} />
      )}
    </AbsoluteFill>
  );
};
