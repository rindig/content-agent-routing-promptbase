import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

type TreeNodeData = {
  id: string;
  label: string;
  type?: 'root' | 'node' | 'leaf' | 'slot';
  children?: TreeNodeData[];
};

type AbstractSyntaxTreeProps = {
  data: TreeNodeData;
  startFrame?: number;
  staggerDelay?: number;
  highlightNodes?: string[];
  showSlots?: boolean;
  style?: React.CSSProperties;
};

// Calculate tree layout
const calculateLayout = (
  node: TreeNodeData,
  depth: number = 0,
  index: number = 0,
  siblingCount: number = 1
): { node: TreeNodeData; x: number; y: number; depth: number; index: number }[] => {
  const result: { node: TreeNodeData; x: number; y: number; depth: number; index: number }[] = [];

  // Position this node
  const x = siblingCount > 1 ? (index / (siblingCount - 1)) * 100 : 50;
  const y = depth * 120;

  result.push({ node, x, y, depth, index });

  // Position children
  if (node.children) {
    node.children.forEach((child, i) => {
      result.push(...calculateLayout(child, depth + 1, i, node.children!.length));
    });
  }

  return result;
};

const TreeNode: React.FC<{
  data: TreeNodeData;
  x: number;
  y: number;
  frame: number;
  fps: number;
  nodeIndex: number;
  staggerDelay: number;
  isHighlighted: boolean;
  showSlots: boolean;
}> = ({ data, x, y, frame, fps, nodeIndex, staggerDelay, isHighlighted, showSlots }) => {
  const startFrame = nodeIndex * staggerDelay;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  const isSlot = data.type === 'slot';
  const nodeColor = isSlot
    ? 'transparent'
    : isHighlighted
    ? COLORS.accent
    : data.type === 'root'
    ? COLORS.accentSecondary
    : COLORS.backgroundLight;

  const borderColor = isSlot ? COLORS.madLibsBlank : isHighlighted ? COLORS.accent : 'rgba(255,255,255,0.2)';

  if (isSlot && !showSlots) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: y,
        transform: `translate(-50%, 0) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          backgroundColor: nodeColor,
          border: `2px ${isSlot ? 'dashed' : 'solid'} ${borderColor}`,
          borderRadius: 8,
          padding: '12px 20px',
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 20,
          color: isSlot ? COLORS.madLibsBlank : COLORS.text,
          whiteSpace: 'nowrap',
          boxShadow: isHighlighted ? `0 0 20px ${COLORS.accent}40` : 'none',
        }}
      >
        {data.label}
      </div>
    </div>
  );
};

const TreeConnection: React.FC<{
  parentX: number;
  parentY: number;
  childX: number;
  childY: number;
  frame: number;
  fps: number;
  connectionIndex: number;
  staggerDelay: number;
}> = ({ parentX, parentY, childX, childY, frame, fps, connectionIndex, staggerDelay }) => {
  const startFrame = connectionIndex * staggerDelay;

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Calculate line coordinates (from bottom of parent to top of child)
  const nodeHeight = 48;
  const startY = parentY + nodeHeight;
  const endY = childY;

  // Draw progress
  const drawProgress = interpolate(progress, [0, 1], [0, 1]);

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <line
        x1={`${parentX}%`}
        y1={startY}
        x2={`${parentX + (childX - parentX) * drawProgress}%`}
        y2={startY + (endY - startY) * drawProgress}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={2}
        strokeDasharray="4 4"
      />
    </svg>
  );
};

export const AbstractSyntaxTree: React.FC<AbstractSyntaxTreeProps> = ({
  data,
  startFrame = 0,
  staggerDelay = 8,
  highlightNodes = [],
  showSlots = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;
  const layout = calculateLayout(data);

  // Build parent-child connections
  const connections: { parentX: number; parentY: number; childX: number; childY: number }[] = [];

  const findNodePosition = (id: string) => layout.find(l => l.node.id === id);

  const buildConnections = (node: TreeNodeData) => {
    const parentPos = findNodePosition(node.id);
    if (parentPos && node.children) {
      node.children.forEach(child => {
        const childPos = findNodePosition(child.id);
        if (childPos) {
          connections.push({
            parentX: parentPos.x,
            parentY: parentPos.y,
            childX: childPos.x,
            childY: childPos.y,
          });
        }
        buildConnections(child);
      });
    }
  };

  buildConnections(data);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 500,
        ...style,
      }}
    >
      {/* Draw connections first */}
      {connections.map((conn, i) => (
        <TreeConnection
          key={`conn-${i}`}
          {...conn}
          frame={adjustedFrame}
          fps={fps}
          connectionIndex={i}
          staggerDelay={staggerDelay}
        />
      ))}

      {/* Draw nodes */}
      {layout.map((item, i) => (
        <TreeNode
          key={item.node.id}
          data={item.node}
          x={item.x}
          y={item.y}
          frame={adjustedFrame}
          fps={fps}
          nodeIndex={i}
          staggerDelay={staggerDelay}
          isHighlighted={highlightNodes.includes(item.node.id)}
          showSlots={showSlots}
        />
      ))}
    </div>
  );
};

export default AbstractSyntaxTree;
