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
 * SCENE 5: THE INTERPRETER - C (Section 4)
 * Duration: 75 seconds (2250 frames)
 *
 * C code appears - denser, more serious. This is where we first
 * emphasize error handling, planting the seed for later arguments.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Layer stack visible, scene title appears |
 * | 30-150 | C code fades in with spring animation |
 * | 150-450| Hold on code, narration explains |
 * | 450-700| Error handling block highlights in amber |
 * | 700-1000| Error path visualization appears |
 * | 1000-1300| "Every layer has error handling" emphasis |
 * | 1300-1500| Explanation text |
 * | 1500-1700| Transition text appears |
 * | 1700-1900| C code shrinks, layer stack updates |
 * | 1900-2100| Next layer preview (Assembly) |
 * | 2100-2250| Descent indicator |
 */

// C code lines for syntax highlighting
const C_CODE_LINES = [
  { text: 'PyObject *', type: 'type' },
  { text: 'PyObject_Call(PyObject *callable, PyObject *args, PyObject *kwargs)', type: 'function' },
  { text: '{', type: 'bracket' },
  { text: '    ternaryfunc call = Py_TYPE(callable)->tp_call;', type: 'code' },
  { text: '    if (call == NULL) {', type: 'error-start' },
  { text: '        PyErr_Format(PyExc_TypeError,', type: 'error' },
  { text: "                     \"'%.200s' object is not callable\",", type: 'error' },
  { text: '                     Py_TYPE(callable)->tp_name);', type: 'error' },
  { text: '        return NULL;', type: 'error-end' },
  { text: '    }', type: 'error-close' },
  { text: '    return (*call)(callable, args, kwargs);', type: 'code' },
  { text: '}', type: 'bracket' },
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
          color: COLORS.syntaxKeyword,
          letterSpacing: '0.05em',
        }}
      >
        Layer 4: The C Interpreter
      </div>
    </div>
  );
};

// Syntax highlighting helper
const highlightCCode = (line: string, lineType: string) => {
  // Simple keyword-based highlighting
  const keywords = ['if', 'return', 'NULL'];
  const types = ['PyObject', 'ternaryfunc', 'PyExc_TypeError'];
  const functions = ['PyObject_Call', 'Py_TYPE', 'PyErr_Format'];

  let result: React.ReactNode[] = [];
  let remaining = line;
  let key = 0;

  // Process the line character by character for proper highlighting
  while (remaining.length > 0) {
    let matched = false;

    // Check for string literals
    if (remaining.startsWith('"') || remaining.startsWith("'")) {
      const quote = remaining[0];
      const endIndex = remaining.indexOf(quote, 1);
      if (endIndex !== -1) {
        const str = remaining.slice(0, endIndex + 1);
        result.push(
          <span key={key++} style={{ color: COLORS.syntaxString }}>
            {str}
          </span>
        );
        remaining = remaining.slice(endIndex + 1);
        matched = true;
      }
    }

    // Check for keywords
    for (const kw of keywords) {
      if (remaining.startsWith(kw) && !/[a-zA-Z0-9_]/.test(remaining[kw.length] || '')) {
        result.push(
          <span key={key++} style={{ color: COLORS.syntaxKeyword }}>
            {kw}
          </span>
        );
        remaining = remaining.slice(kw.length);
        matched = true;
        break;
      }
    }

    // Check for types
    if (!matched) {
      for (const t of types) {
        if (remaining.startsWith(t)) {
          result.push(
            <span key={key++} style={{ color: COLORS.syntaxFunction }}>
              {t}
            </span>
          );
          remaining = remaining.slice(t.length);
          matched = true;
          break;
        }
      }
    }

    // Check for functions
    if (!matched) {
      for (const fn of functions) {
        if (remaining.startsWith(fn)) {
          result.push(
            <span key={key++} style={{ color: COLORS.accent }}>
              {fn}
            </span>
          );
          remaining = remaining.slice(fn.length);
          matched = true;
          break;
        }
      }
    }

    // Default: just add the next character
    if (!matched) {
      const char = remaining[0];
      if (result.length > 0 && typeof result[result.length - 1] === 'object') {
        result.push(
          <span key={key++} style={{ color: COLORS.text }}>
            {char}
          </span>
        );
      } else {
        // Combine with previous text span if possible
        result.push(
          <span key={key++} style={{ color: COLORS.text }}>
            {char}
          </span>
        );
      }
      remaining = remaining.slice(1);
    }
  }

  return result;
};

// C code display component
const CCodeDisplay: React.FC<{
  frame: number;
  entranceFrame: number;
  errorHighlightStart: number;
  shrinkStart: number;
}> = ({ frame, entranceFrame, errorHighlightStart, shrinkStart }) => {
  const { fps } = useVideoConfig();

  // Code block entrance
  const entranceProgress = spring({
    frame: frame - entranceFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const codeOpacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const codeScale = interpolate(entranceProgress, [0, 1], [0.95, 1]);

  // Error highlight animation
  const isErrorHighlighted = frame >= errorHighlightStart;
  const errorHighlightProgress = isErrorHighlighted
    ? spring({
        frame: frame - errorHighlightStart,
        fps,
        config: SPRING_CONFIGS.bouncy,
      })
    : 0;

  // Pulsing effect for error highlight
  const errorPulse = isErrorHighlighted
    ? 1 + Math.sin((frame - errorHighlightStart) * 0.08) * 0.1
    : 1;

  // Shrink animation
  const shrinkProgress = frame >= shrinkStart
    ? interpolate(frame, [shrinkStart, shrinkStart + 200], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.35]) * codeScale;
  const translateY = interpolate(shrinkProgress, [0, 1], [0, -300]);
  const opacity = interpolate(shrinkProgress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' }) * codeOpacity;

  return (
    <div
      style={{
        position: 'absolute',
        top: '42%',
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
          padding: '24px 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {C_CODE_LINES.map((line, i) => {
          const isErrorLine = line.type.startsWith('error');
          const errorHighlight = isErrorLine ? errorHighlightProgress : 0;

          return (
            <div
              key={i}
              style={{
                position: 'relative',
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 16,
                lineHeight: 1.6,
                whiteSpace: 'pre',
              }}
            >
              {/* Error highlight background */}
              {isErrorLine && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-2px -8px',
                    backgroundColor: COLORS.warning,
                    opacity: interpolate(errorHighlight, [0, 1], [0, 0.15]) * errorPulse,
                    borderRadius: 4,
                    boxShadow: `0 0 ${12 * errorHighlight}px ${COLORS.warning}40`,
                  }}
                />
              )}

              {/* Code text */}
              <span style={{ position: 'relative' }}>
                {highlightCCode(line.text, line.type)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Error path visualization
const ErrorPathVisualization: React.FC<{
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ frame, startFrame, endFrame }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= endFrame - 60
    ? interpolate(frame, [endFrame - 60, endFrame], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  // Path nodes
  const nodes = [
    { label: 'Input', x: 0, color: COLORS.primary },
    { label: 'Check', x: 150, color: COLORS.warning },
    { label: 'Success', x: 300, y: -40, color: COLORS.accent },
    { label: 'Error', x: 300, y: 40, color: COLORS.danger },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
      }}
    >
      {/* Error handling label */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.warning,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        Error Handling Path
      </div>

      {/* Flow visualization */}
      <div style={{ position: 'relative', width: 400, height: 120 }}>
        {/* Connection lines */}
        <svg
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          viewBox="0 0 400 120"
        >
          {/* Input to Check */}
          <line
            x1={50}
            y1={60}
            x2={150}
            y2={60}
            stroke={COLORS.textDim}
            strokeWidth={2}
            opacity={0.5}
          />
          {/* Check to Success */}
          <line
            x1={200}
            y1={60}
            x2={300}
            y2={30}
            stroke={COLORS.accent}
            strokeWidth={2}
            opacity={0.5}
          />
          {/* Check to Error */}
          <line
            x1={200}
            y1={60}
            x2={300}
            y2={90}
            stroke={COLORS.danger}
            strokeWidth={2}
            opacity={0.5}
          />
        </svg>

        {/* Input node */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 40,
            padding: '8px 16px',
            backgroundColor: `${COLORS.primary}20`,
            border: `1px solid ${COLORS.primary}`,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.primary,
          }}
        >
          Input
        </div>

        {/* Check node */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 40,
            padding: '8px 16px',
            backgroundColor: `${COLORS.warning}20`,
            border: `1px solid ${COLORS.warning}`,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.warning,
          }}
        >
          Check
        </div>

        {/* Success node */}
        <div
          style={{
            position: 'absolute',
            left: 280,
            top: 10,
            padding: '8px 16px',
            backgroundColor: `${COLORS.accent}20`,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.accent,
          }}
        >
          Success ✓
        </div>

        {/* Error node */}
        <div
          style={{
            position: 'absolute',
            left: 280,
            top: 70,
            padding: '8px 16px',
            backgroundColor: `${COLORS.danger}20`,
            border: `1px solid ${COLORS.danger}`,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 14,
            color: COLORS.danger,
          }}
        >
          Error ✗
        </div>
      </div>
    </div>
  );
};

// "Every layer has error handling" emphasis
const ErrorHandlingEmphasis: React.FC<{
  frame: number;
  startFrame: number;
  endFrame: number;
}> = ({ frame, startFrame, endFrame }) => {
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

  // Pulse effect
  const pulse = 1 + Math.sin((frame - startFrame) * 0.1) * 0.02;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: '50%',
        transform: `translateX(-50%) scale(${scale * pulse})`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 28,
          color: COLORS.warning,
          marginBottom: 8,
        }}
      >
        Every layer has error handling.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
        }}
      >
        Remember this. It's important later.
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
        The Python interpreter is written in C.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 12,
        }}
      >
        500,000 lines of code that make Python feel like magic.
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
        But even C can't talk directly to hardware.
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
        It gets compiled to Assembly.
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
          color: COLORS.warning,
          marginBottom: 16,
        }}
      >
        Assembly Language
      </div>

      {/* Assembly code hint */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
          lineHeight: 1.8,
        }}
      >
        <div><span style={{ color: COLORS.warning }}>push</span>    rbp</div>
        <div><span style={{ color: COLORS.warning }}>mov</span>     rbp, rsp</div>
        <div><span style={{ color: COLORS.warning }}>sub</span>     rsp, 32</div>
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
          color: COLORS.warning,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 5: Assembly
      </div>
      <div style={{ fontSize: 32, color: COLORS.warning }}>↓</div>
    </div>
  );
};

export const Interpreter: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const CODE_ENTRANCE = 30;
  const EXPLANATION_APPEAR = 200;
  const EXPLANATION_FADEOUT = 450;
  const ERROR_HIGHLIGHT_START = 500;
  const ERROR_PATH_START = 750;
  const ERROR_PATH_END = 1050;
  const ERROR_EMPHASIS_START = 1100;
  const ERROR_EMPHASIS_END = 1450;
  const TRANSITION_TEXT_APPEAR = 1550;
  const SHRINK_START = 1700;
  const LAYER_STACK_UPDATE = 1800;
  const NEXT_LAYER_PREVIEW = 1900;
  const DESCENT_APPEAR = 2100;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Layer stack - updates to show C active after shrink */}
      <LayerStack
        activeLayer={frame >= LAYER_STACK_UPDATE ? 'c' : 'bytecode'}
        entranceFrame={0}
        visible={true}
      />

      {/* Scene title */}
      <SceneTitle
        frame={frame}
        startFrame={TITLE_APPEAR}
        fadeOutFrame={SHRINK_START}
      />

      {/* C code display */}
      <CCodeDisplay
        frame={frame}
        entranceFrame={CODE_ENTRANCE}
        errorHighlightStart={ERROR_HIGHLIGHT_START}
        shrinkStart={SHRINK_START}
      />

      {/* Explanation text - early */}
      {frame >= EXPLANATION_APPEAR && frame < EXPLANATION_FADEOUT + 60 && (
        <ExplanationText
          frame={frame}
          startFrame={EXPLANATION_APPEAR}
          fadeOutFrame={EXPLANATION_FADEOUT}
        />
      )}

      {/* Error path visualization */}
      {frame >= ERROR_PATH_START && frame < ERROR_PATH_END + 60 && (
        <ErrorPathVisualization
          frame={frame}
          startFrame={ERROR_PATH_START}
          endFrame={ERROR_PATH_END}
        />
      )}

      {/* Error handling emphasis */}
      {frame >= ERROR_EMPHASIS_START && frame < ERROR_EMPHASIS_END + 30 && (
        <ErrorHandlingEmphasis
          frame={frame}
          startFrame={ERROR_EMPHASIS_START}
          endFrame={ERROR_EMPHASIS_END}
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
