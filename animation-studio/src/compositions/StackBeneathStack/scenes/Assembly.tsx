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
 * SCENE 6: ASSEMBLY (Section 5)
 * Duration: 40 seconds (1200 frames)
 *
 * Assembly code - cryptic, closer to the metal. Visual style gets colder.
 * We're now deep in the stack, approaching raw hardware.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Layer stack visible, scene title appears |
 * | 30-180 | Assembly code appears line by line |
 * | 180-350| Lines highlight in sequence as explained |
 * | 350-500| Register diagram visualization |
 * | 500-650| "Close to the metal" - circuit pattern appears |
 * | 650-800| Explanation text |
 * | 800-950| Transition text |
 * | 950-1050| Assembly shrinks, layer stack updates |
 * | 1050-1200| Descent indicator |
 */

// Assembly code lines
const ASSEMBLY_LINES = [
  { label: 'PyObject_Call:', instruction: '', operands: '', isLabel: true },
  { label: '', instruction: 'push', operands: 'rbp', isLabel: false },
  { label: '', instruction: 'mov', operands: 'rbp, rsp', isLabel: false },
  { label: '', instruction: 'sub', operands: 'rsp, 32', isLabel: false },
  { label: '', instruction: 'mov', operands: 'QWORD PTR [rbp-24], rdi', isLabel: false },
  { label: '', instruction: 'mov', operands: 'QWORD PTR [rbp-16], rsi', isLabel: false },
  { label: '', instruction: 'mov', operands: 'QWORD PTR [rbp-8], rdx', isLabel: false },
  { label: '', instruction: 'call', operands: '_PyObject_Call', isLabel: false },
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
  const translateY = interpolate(progress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 32,
          color: COLORS.warning,
          letterSpacing: '0.05em',
        }}
      >
        Layer 5: Assembly
      </div>
    </div>
  );
};

// Single assembly line
const AssemblyLine: React.FC<{
  label: string;
  instruction: string;
  operands: string;
  isLabel: boolean;
  entranceFrame: number;
  isHighlighted: boolean;
  highlightProgress: number;
}> = ({ label, instruction, operands, isLabel, entranceFrame, isHighlighted, highlightProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - entranceFrame;
  if (adjustedFrame < 0) return null;

  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const translateX = interpolate(entranceProgress, [0, 1], [-30, 0]);

  const highlightOpacity = interpolate(highlightProgress, [0, 1], [0, 0.2]);

  return (
    <div
      style={{
        position: 'relative',
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily: TYPOGRAPHY.code.fontFamily,
        fontSize: 20,
        lineHeight: 1.8,
      }}
    >
      {/* Highlight background */}
      {isHighlighted && (
        <div
          style={{
            position: 'absolute',
            inset: '-4px -12px',
            backgroundColor: COLORS.warning,
            opacity: highlightOpacity,
            borderRadius: 4,
          }}
        />
      )}

      {/* Code content */}
      <span style={{ position: 'relative' }}>
        {isLabel ? (
          <span style={{ color: COLORS.accent }}>{label}</span>
        ) : (
          <>
            <span style={{ color: COLORS.textDim, width: 40, display: 'inline-block' }}>
              {'    '}
            </span>
            <span style={{ color: COLORS.warning, width: 60, display: 'inline-block' }}>
              {instruction.padEnd(8)}
            </span>
            <span style={{ color: COLORS.text }}>{operands}</span>
          </>
        )}
      </span>
    </div>
  );
};

// Assembly code display
const AssemblyCodeDisplay: React.FC<{
  frame: number;
  startFrame: number;
  highlightStart: number;
  shrinkStart: number;
}> = ({ frame, startFrame, highlightStart, shrinkStart }) => {
  const { fps } = useVideoConfig();

  const LINE_DELAY = 18;
  const HIGHLIGHT_DURATION = 25;

  const highlightedIndex = frame >= highlightStart
    ? Math.floor((frame - highlightStart) / HIGHLIGHT_DURATION)
    : -1;

  // Shrink animation
  const shrinkProgress = frame >= shrinkStart
    ? interpolate(frame, [shrinkStart, shrinkStart + 100], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.4]);
  const translateY = interpolate(shrinkProgress, [0, 1], [0, -280]);
  const opacity = interpolate(shrinkProgress, [0.6, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: '38%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.surfaceAlt}`,
          borderRadius: 12,
          padding: '28px 40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {ASSEMBLY_LINES.map((line, i) => {
          const isHighlighted = highlightedIndex === i;
          const highlightProgress = isHighlighted
            ? spring({
                frame: frame - (highlightStart + i * HIGHLIGHT_DURATION),
                fps,
                config: SPRING_CONFIGS.bouncy,
              })
            : 0;

          return (
            <AssemblyLine
              key={i}
              label={line.label}
              instruction={line.instruction}
              operands={line.operands}
              isLabel={line.isLabel}
              entranceFrame={startFrame + i * LINE_DELAY}
              isHighlighted={isHighlighted}
              highlightProgress={highlightProgress}
            />
          );
        })}
      </div>
    </div>
  );
};

// Register diagram
const RegisterDiagram: React.FC<{ frame: number; startFrame: number; endFrame: number }> = ({
  frame,
  startFrame,
  endFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= endFrame - 30
    ? interpolate(frame, [endFrame - 30, endFrame], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  const registers = ['RAX', 'RBX', 'RCX', 'RDX', 'RSP', 'RBP', 'RSI', 'RDI'];

  return (
    <div
      style={{
        position: 'absolute',
        right: 100,
        top: '35%',
        transform: `translateY(-50%) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 12,
          color: COLORS.warning,
          letterSpacing: '0.1em',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        CPU Registers
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8,
        }}
      >
        {registers.map((reg, i) => {
          const regProgress = spring({
            frame: frame - startFrame - i * 5,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const isActive = ['RSP', 'RBP', 'RDI', 'RSI', 'RDX'].includes(reg);
          const pulse = isActive ? 1 + Math.sin((frame - startFrame) * 0.15 + i) * 0.05 : 1;

          return (
            <div
              key={reg}
              style={{
                padding: '6px 12px',
                backgroundColor: isActive ? `${COLORS.warning}20` : COLORS.surfaceAlt,
                border: `1px solid ${isActive ? COLORS.warning : COLORS.textDim}`,
                borderRadius: 4,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 12,
                color: isActive ? COLORS.warning : COLORS.textMuted,
                textAlign: 'center',
                transform: `scale(${interpolate(regProgress, [0, 1], [0.8, 1]) * pulse})`,
                opacity: interpolate(regProgress, [0, 1], [0, 1]),
              }}
            >
              {reg}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Circuit pattern background
const CircuitPattern: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const opacity = interpolate(adjustedFrame, [0, 60], [0, 0.08], { extrapolateRight: 'clamp' });

  // Generate deterministic circuit lines
  const lines = Array.from({ length: 20 }, (_, i) => {
    const isHorizontal = i % 2 === 0;
    const offset = (i * 97) % 100;
    const length = 100 + (i * 37) % 200;

    return {
      isHorizontal,
      x: isHorizontal ? offset * 19 : offset * 19,
      y: isHorizontal ? offset * 11 : offset * 11,
      length,
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: line.x,
            top: line.y,
            width: line.isHorizontal ? line.length : 1,
            height: line.isHorizontal ? 1 : line.length,
            backgroundColor: COLORS.warning,
          }}
        />
      ))}
    </div>
  );
};

// Explanation text
const ExplanationText: React.FC<{
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
        bottom: 150,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        textAlign: 'center',
        maxWidth: 700,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.text,
          lineHeight: 1.6,
        }}
      >
        Operations on registers. Close to the metal.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 12,
        }}
      >
        Push, move, subtract - direct CPU instructions.
      </div>
    </div>
  );
};

// Transition text
const TransitionText: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const line1Progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const line2Progress = spring({
    frame: frame - startFrame - 30,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}
    >
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
        But even this isn't what the CPU sees.
      </div>
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
        It gets translated to raw machine code.
      </div>
    </div>
  );
};

// Next layer preview
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
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 42,
          color: COLORS.danger,
          marginBottom: 16,
        }}
      >
        Machine Code
      </div>

      {/* Hex code hint */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          letterSpacing: '0.1em',
        }}
      >
        <span style={{ color: COLORS.danger }}>55 48 89 e5 48 83 ec 20</span>
      </div>
    </div>
  );
};

// Descent indicator
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

  const bobOffset = Math.sin(adjustedFrame * 0.15) * 8;
  const opacity = interpolate(entranceProgress, [0, 1], [0, 0.8]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
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
          color: COLORS.danger,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 6: Machine Code
      </div>
      <div style={{ fontSize: 32, color: COLORS.danger }}>↓</div>
    </div>
  );
};

export const Assembly: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const CODE_START = 30;
  const HIGHLIGHT_START = 200;
  const REGISTER_DIAGRAM_START = 350;
  const REGISTER_DIAGRAM_END = 550;
  const CIRCUIT_PATTERN_START = 450;
  const EXPLANATION_APPEAR = 550;
  const EXPLANATION_FADEOUT = 750;
  const TRANSITION_TEXT_APPEAR = 800;
  const SHRINK_START = 950;
  const LAYER_STACK_UPDATE = 1000;
  const NEXT_LAYER_PREVIEW = 1020;
  const DESCENT_APPEAR = 1100;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Circuit pattern background */}
      {frame >= CIRCUIT_PATTERN_START && (
        <CircuitPattern frame={frame} startFrame={CIRCUIT_PATTERN_START} />
      )}

      {/* Layer stack */}
      <LayerStack
        activeLayer={frame >= LAYER_STACK_UPDATE ? 'assembly' : 'c'}
        entranceFrame={0}
        visible={true}
      />

      {/* Scene title */}
      <SceneTitle
        frame={frame}
        startFrame={TITLE_APPEAR}
        fadeOutFrame={SHRINK_START}
      />

      {/* Assembly code display */}
      <AssemblyCodeDisplay
        frame={frame}
        startFrame={CODE_START}
        highlightStart={HIGHLIGHT_START}
        shrinkStart={SHRINK_START}
      />

      {/* Register diagram */}
      {frame >= REGISTER_DIAGRAM_START && frame < REGISTER_DIAGRAM_END + 30 && (
        <RegisterDiagram
          frame={frame}
          startFrame={REGISTER_DIAGRAM_START}
          endFrame={REGISTER_DIAGRAM_END}
        />
      )}

      {/* Explanation text */}
      {frame >= EXPLANATION_APPEAR && frame < EXPLANATION_FADEOUT + 60 && (
        <ExplanationText
          frame={frame}
          startFrame={EXPLANATION_APPEAR}
          fadeOutFrame={EXPLANATION_FADEOUT}
        />
      )}

      {/* Transition text */}
      {frame >= TRANSITION_TEXT_APPEAR && frame < SHRINK_START + 50 && (
        <TransitionText frame={frame} startFrame={TRANSITION_TEXT_APPEAR} />
      )}

      {/* Next layer preview */}
      {frame >= NEXT_LAYER_PREVIEW && (
        <NextLayerPreview frame={frame} startFrame={NEXT_LAYER_PREVIEW} />
      )}

      {/* Descent indicator */}
      {frame >= DESCENT_APPEAR && (
        <DescentIndicator frame={frame} startFrame={DESCENT_APPEAR} />
      )}
    </AbsoluteFill>
  );
};
