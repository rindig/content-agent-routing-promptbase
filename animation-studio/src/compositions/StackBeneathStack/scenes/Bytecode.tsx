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
 * SCENE 4: BYTECODE (Section 3)
 * Duration: 45 seconds (1350 frames)
 *
 * Bytecode instructions appear line by line. More machine-like than the tree,
 * but still readable. Includes the "sheet music" metaphor.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Layer stack visible, scene title appears |
 * | 30-120 | First line types in: LOAD_NAME 0 (print) |
 * | 120-210| Second line types in: LOAD_CONST 0 ('Hello, World!') |
 * | 210-300| Third line types in: CALL 1 |
 * | 300-500| Each line highlights in sequence as explained |
 * | 500-700| "Sheet music" metaphor visualization |
 * | 700-900| Explanation text appears |
 * | 900-1050| Transition text appears |
 * | 1050-1200| Bytecode shrinks, layer stack updates |
 * | 1200-1350| Descent indicator, ready for C/Interpreter |
 */

// Bytecode instruction data
const BYTECODE_INSTRUCTIONS = [
  { instruction: 'LOAD_NAME', arg: '0', label: '(print)', color: COLORS.syntaxFunction },
  { instruction: 'LOAD_CONST', arg: '0', label: "('Hello, World!')", color: COLORS.syntaxString },
  { instruction: 'CALL', arg: '1', label: '', color: COLORS.primary },
];

// Scene title component
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
          color: COLORS.primary,
          letterSpacing: '0.05em',
        }}
      >
        Layer 3: Bytecode
      </div>
    </div>
  );
};

// Single bytecode instruction line with typewriter effect
const BytecodeLine: React.FC<{
  instruction: string;
  arg: string;
  label: string;
  color: string;
  entranceFrame: number;
  isHighlighted: boolean;
  highlightProgress: number;
}> = ({ instruction, arg, label, color, entranceFrame, isHighlighted, highlightProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - entranceFrame;
  if (adjustedFrame < 0) return null;

  // Typewriter effect for the full line
  const fullText = `${instruction.padEnd(20)}${arg}${label ? ` ${label}` : ''}`;
  const charsPerFrame = 1.5;
  const visibleChars = Math.min(Math.floor(adjustedFrame * charsPerFrame), fullText.length);
  const visibleText = fullText.slice(0, visibleChars);

  // Line entrance
  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const translateX = interpolate(entranceProgress, [0, 1], [-20, 0]);

  // Highlight effect
  const highlightOpacity = interpolate(highlightProgress, [0, 1], [0, 0.15]);
  const glowIntensity = interpolate(highlightProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {/* Highlight background */}
      {isHighlighted && (
        <div
          style={{
            position: 'absolute',
            inset: -8,
            backgroundColor: color,
            opacity: highlightOpacity,
            borderRadius: 4,
            boxShadow: `0 0 ${20 * glowIntensity}px ${color}40`,
          }}
        />
      )}

      {/* Instruction text */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 24,
          fontWeight: TYPOGRAPHY.code.weights.medium,
          letterSpacing: '0.02em',
          display: 'flex',
          gap: 4,
        }}
      >
        {/* Split the visible text to colorize parts */}
        <span style={{ color: COLORS.text }}>
          {visibleText.slice(0, instruction.length)}
        </span>
        {visibleChars > instruction.length && (
          <span style={{ color: COLORS.syntaxNumber }}>
            {visibleText.slice(instruction.length, instruction.length + 20).trim()}
          </span>
        )}
        {visibleChars > instruction.length + 20 && (
          <span style={{ color }}>
            {visibleText.slice(instruction.length + 20).trim()}
          </span>
        )}

        {/* Blinking cursor during typing */}
        {visibleChars < fullText.length && (
          <span
            style={{
              color: COLORS.primary,
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            }}
          >
            _
          </span>
        )}
      </div>
    </div>
  );
};

// The complete bytecode display
const BytecodeDisplay: React.FC<{
  frame: number;
  startFrame: number;
  highlightSequenceStart: number;
  shrinkStart: number;
}> = ({ frame, startFrame, highlightSequenceStart, shrinkStart }) => {
  const { fps } = useVideoConfig();

  // Line entrance timing
  const LINE_SPACING = 90; // frames between each line
  const lineFrames = BYTECODE_INSTRUCTIONS.map((_, i) => startFrame + i * LINE_SPACING);

  // Highlight sequence timing
  const HIGHLIGHT_DURATION = 60;
  const highlightedIndex = frame >= highlightSequenceStart
    ? Math.floor((frame - highlightSequenceStart) / HIGHLIGHT_DURATION)
    : -1;

  // Shrink animation
  const shrinkProgress = frame >= shrinkStart
    ? interpolate(frame, [shrinkStart, shrinkStart + 150], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.4]);
  const translateY = interpolate(shrinkProgress, [0, 1], [0, -280]);
  const opacity = interpolate(shrinkProgress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`,
        opacity,
      }}
    >
      {/* Code block container */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `1px solid ${COLORS.surfaceAlt}`,
          borderRadius: 12,
          padding: '32px 48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {BYTECODE_INSTRUCTIONS.map((instr, i) => {
            const isHighlighted = highlightedIndex === i;
            const highlightProgress = isHighlighted
              ? spring({
                  frame: frame - (highlightSequenceStart + i * HIGHLIGHT_DURATION),
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                })
              : 0;

            return (
              <BytecodeLine
                key={i}
                instruction={instr.instruction}
                arg={instr.arg}
                label={instr.label}
                color={instr.color}
                entranceFrame={lineFrames[i]}
                isHighlighted={isHighlighted}
                highlightProgress={highlightProgress}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Sheet music metaphor visualization
const SheetMusicMetaphor: React.FC<{ frame: number; startFrame: number; endFrame: number }> = ({
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

  const fadeOut = frame >= endFrame - 60
    ? interpolate(frame, [endFrame - 60, endFrame], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 0.7]) * fadeOut;
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  // Create staff lines
  const staffLines = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      {/* Musical staff visualization */}
      <div
        style={{
          position: 'relative',
          width: 500,
          height: 60,
          marginBottom: 24,
        }}
      >
        {staffLines.map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * 12,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: COLORS.textDim,
              opacity: 0.4,
            }}
          />
        ))}

        {/* "Notes" representing bytecode instructions */}
        {BYTECODE_INSTRUCTIONS.map((instr, i) => {
          const noteProgress = spring({
            frame: frame - startFrame - i * 15,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 80 + i * 150,
                top: 10 + (i * 15) % 30,
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: instr.color,
                transform: `scale(${noteProgress})`,
                boxShadow: `0 0 12px ${instr.color}60`,
              }}
            />
          );
        })}
      </div>

      {/* Metaphor text */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.textMuted,
          fontStyle: 'italic',
        }}
      >
        Like sheet music for a virtual machine
      </div>
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
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
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
        Each instruction is a simple, atomic operation.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 12,
        }}
      >
        Load this. Store that. Call this function. Step by step.
      </div>
    </div>
  );
};

// Transition text before descending
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
        But these instructions are for a machine that doesn't exist.
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
        The Python Virtual Machine. Written in C.
      </div>
    </div>
  );
};

// Preview of next layer
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
          color: COLORS.syntaxKeyword,
          marginBottom: 16,
        }}
      >
        The Interpreter
      </div>

      {/* C code hint */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
          lineHeight: 1.8,
        }}
      >
        <div style={{ color: COLORS.syntaxKeyword }}>PyObject *</div>
        <div>
          <span style={{ color: COLORS.syntaxFunction }}>PyObject_Call</span>
          <span style={{ color: COLORS.textDim }}>(callable, args, kwargs)</span>
        </div>
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
          color: COLORS.syntaxKeyword,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 4: C Interpreter
      </div>
      <div style={{ fontSize: 32, color: COLORS.syntaxKeyword }}>↓</div>
    </div>
  );
};

export const Bytecode: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const BYTECODE_START = 30;
  const HIGHLIGHT_START = 330;
  const SHEET_MUSIC_START = 500;
  const SHEET_MUSIC_END = 700;
  const EXPLANATION_APPEAR = 550;
  const EXPLANATION_FADEOUT = 850;
  const TRANSITION_TEXT_APPEAR = 900;
  const SHRINK_START = 1050;
  const LAYER_STACK_UPDATE = 1100;
  const NEXT_LAYER_PREVIEW = 1150;
  const DESCENT_APPEAR = 1250;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Layer stack - updates to show Bytecode active after shrink */}
      <LayerStack
        activeLayer={frame >= LAYER_STACK_UPDATE ? 'bytecode' : 'ast'}
        entranceFrame={0}
        visible={true}
      />

      {/* Scene title */}
      <SceneTitle
        frame={frame}
        startFrame={TITLE_APPEAR}
        fadeOutFrame={SHRINK_START}
      />

      {/* Bytecode display */}
      <BytecodeDisplay
        frame={frame}
        startFrame={BYTECODE_START}
        highlightSequenceStart={HIGHLIGHT_START}
        shrinkStart={SHRINK_START}
      />

      {/* Sheet music metaphor */}
      {frame >= SHEET_MUSIC_START && frame < SHEET_MUSIC_END + 60 && (
        <SheetMusicMetaphor
          frame={frame}
          startFrame={SHEET_MUSIC_START}
          endFrame={SHEET_MUSIC_END}
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
      {frame >= TRANSITION_TEXT_APPEAR && frame < SHRINK_START + 100 && (
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
