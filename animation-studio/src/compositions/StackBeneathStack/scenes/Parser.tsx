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
import { TreeNode, TreeConnection } from '../components/TreeNode';

/**
 * SCENE 3: THE PARSER (Section 2)
 * Duration: 50 seconds (1500 frames)
 *
 * An Abstract Syntax Tree builds itself node by node.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Layer stack visible, scene title appears |
 * | 30-90  | "Module" node appears at top |
 * | 90-150 | Line draws down, "Expr" node appears |
 * | 150-210| Line draws down, "Call" node appears |
 * | 210-300| Lines branch left and right |
 * | 300-400| "func: print" appears on left |
 * | 400-500| "args: Hello World" appears on right |
 * | 500-900| Hold on complete tree with explanation |
 * | 900-1100| "Like diagramming a sentence" metaphor |
 * | 1100-1300| Tree shrinks, transitions to next layer |
 * | 1300-1500| AST badge activates, ready for bytecode |
 */

// Tree layout constants
const TREE_CENTER_X = 960; // Center of 1920
const TREE_TOP_Y = 200;
const LEVEL_HEIGHT = 100;
const BRANCH_WIDTH = 250;

// Node positions
const NODES = {
  module: { x: TREE_CENTER_X, y: TREE_TOP_Y },
  expr: { x: TREE_CENTER_X, y: TREE_TOP_Y + LEVEL_HEIGHT },
  call: { x: TREE_CENTER_X, y: TREE_TOP_Y + LEVEL_HEIGHT * 2 },
  func: { x: TREE_CENTER_X - BRANCH_WIDTH, y: TREE_TOP_Y + LEVEL_HEIGHT * 3 },
  args: { x: TREE_CENTER_X + BRANCH_WIDTH, y: TREE_TOP_Y + LEVEL_HEIGHT * 3 },
};

// Scene title component
const SceneTitle: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 120,
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
          color: COLORS.syntaxFunction,
          letterSpacing: '0.05em',
        }}
      >
        Layer 2: Abstract Syntax Tree
      </div>
    </div>
  );
};

// Explanation text that appears during the hold
const ExplanationText: React.FC<{
  frame: number;
  startFrame: number;
  fadeOutFrame: number;
}> = ({ frame, startFrame, fadeOutFrame }) => {
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]) * fadeOut;

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
        Python parses your code into a tree structure.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 12,
        }}
      >
        Like diagramming a sentence - identifying the verb, the subject, the object.
      </div>
    </div>
  );
};

// "But it still can't run" transition text
const TransitionText: React.FC<{
  frame: number;
  startFrame: number;
}> = ({ frame, startFrame }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.textMuted,
        }}
      >
        But a tree is still just a description.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
          marginTop: 12,
        }}
      >
        It can't actually run anything.
      </div>
    </div>
  );
};

// The complete AST tree visualization
const ASTTree: React.FC<{
  frame: number;
  moduleFrame: number;
  shrinkStart: number;
}> = ({ frame, moduleFrame, shrinkStart }) => {
  const { fps } = useVideoConfig();

  // Timeline for node appearances
  const EXPR_FRAME = moduleFrame + 60;
  const CALL_FRAME = EXPR_FRAME + 60;
  const BRANCH_FRAME = CALL_FRAME + 60;
  const FUNC_FRAME = BRANCH_FRAME + 90;
  const ARGS_FRAME = FUNC_FRAME + 100;

  // Connection timing (slightly before nodes)
  const CONN_MODULE_EXPR = moduleFrame + 50;
  const CONN_EXPR_CALL = EXPR_FRAME + 50;
  const CONN_CALL_FUNC = BRANCH_FRAME;
  const CONN_CALL_ARGS = BRANCH_FRAME + 30;

  // Shrink animation
  const shrinkProgress = frame >= shrinkStart
    ? interpolate(frame, [shrinkStart, shrinkStart + 150], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const scale = interpolate(shrinkProgress, [0, 1], [1, 0.4]);
  const translateY = interpolate(shrinkProgress, [0, 1], [0, -200]);
  const opacity = interpolate(shrinkProgress, [0.7, 1], [1, 0], { extrapolateLeft: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
      }}
    >
      {/* Connections (behind nodes) */}
      <TreeConnection
        startX={NODES.module.x}
        startY={NODES.module.y + 25}
        endX={NODES.expr.x}
        endY={NODES.expr.y - 25}
        entranceFrame={CONN_MODULE_EXPR}
        color={COLORS.syntaxFunction}
      />
      <TreeConnection
        startX={NODES.expr.x}
        startY={NODES.expr.y + 25}
        endX={NODES.call.x}
        endY={NODES.call.y - 25}
        entranceFrame={CONN_EXPR_CALL}
        color={COLORS.syntaxFunction}
      />
      <TreeConnection
        startX={NODES.call.x - 30}
        startY={NODES.call.y + 25}
        endX={NODES.func.x + 50}
        endY={NODES.func.y - 25}
        entranceFrame={CONN_CALL_FUNC}
        color={COLORS.syntaxFunction}
      />
      <TreeConnection
        startX={NODES.call.x + 30}
        startY={NODES.call.y + 25}
        endX={NODES.args.x - 80}
        endY={NODES.args.y - 25}
        entranceFrame={CONN_CALL_ARGS}
        color={COLORS.syntaxString}
      />

      {/* Nodes */}
      <TreeNode
        label="Module"
        entranceFrame={moduleFrame}
        x={NODES.module.x}
        y={NODES.module.y}
        fontSize={20}
      />
      <TreeNode
        label="Expr"
        entranceFrame={EXPR_FRAME}
        x={NODES.expr.x}
        y={NODES.expr.y}
        fontSize={18}
      />
      <TreeNode
        label="Call"
        entranceFrame={CALL_FRAME}
        x={NODES.call.x}
        y={NODES.call.y}
        fontSize={18}
        highlighted
        highlightColor={COLORS.primary}
      />
      <TreeNode
        label="func: Name"
        sublabel="id='print'"
        entranceFrame={FUNC_FRAME}
        x={NODES.func.x}
        y={NODES.func.y}
        fontSize={16}
        highlighted
        highlightColor={COLORS.syntaxFunction}
      />
      <TreeNode
        label="args: Constant"
        sublabel="'Hello, World!'"
        entranceFrame={ARGS_FRAME}
        x={NODES.args.x}
        y={NODES.args.y}
        fontSize={16}
        highlighted
        highlightColor={COLORS.syntaxString}
      />
    </div>
  );
};

// Descent indicator for next layer
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
          color: COLORS.primary,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 3: Bytecode
      </div>
      <div style={{ fontSize: 32, color: COLORS.primary }}>↓</div>
    </div>
  );
};

export const Parser: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const TREE_START = 60;
  const EXPLANATION_APPEAR = 600;
  const EXPLANATION_FADEOUT = 900;
  const TRANSITION_TEXT_APPEAR = 950;
  const SHRINK_START = 1100;
  const LAYER_STACK_UPDATE = 1200;
  const DESCENT_APPEAR = 1350;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Layer stack at top - updates to show AST active after shrink */}
      <LayerStack
        activeLayer={frame >= LAYER_STACK_UPDATE ? 'ast' : 'python'}
        entranceFrame={0}
        visible={true}
      />

      {/* Scene title */}
      {frame < SHRINK_START && (
        <SceneTitle frame={frame} startFrame={TITLE_APPEAR} />
      )}

      {/* AST Tree visualization */}
      <ASTTree
        frame={frame}
        moduleFrame={TREE_START}
        shrinkStart={SHRINK_START}
      />

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

      {/* Descent indicator */}
      {frame >= DESCENT_APPEAR && (
        <DescentIndicator frame={frame} startFrame={DESCENT_APPEAR} />
      )}
    </AbsoluteFill>
  );
};
