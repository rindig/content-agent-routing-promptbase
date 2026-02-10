/**
 * Scene 2B: Tools Demo
 * [1:10 - 1:30] — 600 frames
 *
 * Visual: Large animated workflow showing tools working together
 * Replaces video placeholder with actual impressive animation
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

// Timeline
const PHASE = {
  CARDS_MOVE: 0,
  WORKFLOW_IN: 45,
  FLOW_START: 120,
  FADE_OUT: 555,
};

// Tool colors
const TOOL_COLORS = {
  claude: '#D97706',
  ide: '#0EA5E9',
  remotion: '#3B82F6',
  capcut: '#10B981',
};

// ============================================================
// MINI TOOL CARD (corner decoration)
// ============================================================
interface MiniToolCardProps {
  title: string;
  badge: string;
  color: string;
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
}

const MiniToolCard: React.FC<MiniToolCardProps> = ({ title, badge, color, position }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const moveProgress = spring({ frame, fps, config: SPRING_CONFIGS.gentle });

  const positions = {
    topLeft: { top: 40, left: 40, bottom: 'auto', right: 'auto' },
    topRight: { top: 40, right: 40, bottom: 'auto', left: 'auto' },
    bottomLeft: { bottom: 40, left: 40, top: 'auto', right: 'auto' },
    bottomRight: { bottom: 40, right: 40, top: 'auto', left: 'auto' },
  };

  const pos = positions[position];
  const opacity = interpolate(moveProgress, [0, 1], [0.8, 0.35]);
  const scale = interpolate(moveProgress, [0, 1], [0.8, 0.65]);
  const pulseOpacity = Math.sin(frame * 0.04) * 0.1 + 0.5;

  return (
    <div
      style={{
        position: 'absolute', ...pos,
        width: 160, height: 70,
        backgroundColor: COLORS.surface,
        border: `1px solid ${color}60`,
        borderRadius: 8,
        padding: '8px 12px',
        opacity, transform: `scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: pulseOpacity }} />
      <div style={{ position: 'absolute', top: 4, right: 4, padding: '2px 6px', backgroundColor: `${color}40`, borderRadius: 3, fontSize: 8, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 600, color }}>
        {badge}
      </div>
      <div style={{ fontSize: 12, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.textMuted, marginTop: 14 }}>
        {title}
      </div>
    </div>
  );
};

// ============================================================
// WORKFLOW ANIMATION (replaces video placeholder)
// ============================================================
const WorkflowAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - PHASE.WORKFLOW_IN, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  const exitFade = interpolate(frame, [PHASE.FADE_OUT, 600], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Tool nodes
  const tools = [
    { x: 150, label: 'CLAUDE', sublabel: 'Generate', color: TOOL_COLORS.claude },
    { x: 420, label: 'IDE', sublabel: 'Edit', color: TOOL_COLORS.ide },
    { x: 690, label: 'REMOTION', sublabel: 'Render', color: TOOL_COLORS.remotion },
    { x: 960, label: 'CAPCUT', sublabel: 'Polish', color: TOOL_COLORS.capcut },
  ];

  // Flowing data packets
  const flowProgress = frame >= PHASE.FLOW_START ? ((frame - PHASE.FLOW_START) * 2) % 400 : 0;
  const packet1X = 150 + flowProgress * 2;
  const packet2X = 150 + ((flowProgress + 200) % 800) * 1;

  if (frame < PHASE.WORKFLOW_IN) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 1100,
        height: 500,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.build}40`,
        borderRadius: 16,
        opacity: opacity * exitFade,
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {[
        { top: 12, left: 12, bt: true, bl: true },
        { top: 12, right: 12, bt: true, br: true },
        { bottom: 12, left: 12, bb: true, bl: true },
        { bottom: 12, right: 12, bb: true, br: true },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            width: 20, height: 20,
            borderTop: c.bt ? `2px solid ${COLORS.build}` : 'none',
            borderBottom: c.bb ? `2px solid ${COLORS.build}` : 'none',
            borderLeft: c.bl ? `2px solid ${COLORS.build}` : 'none',
            borderRight: c.br ? `2px solid ${COLORS.build}` : 'none',
            opacity: Math.sin(frame * 0.05) * 0.15 + 0.7,
          }}
        />
      ))}

      {/* Scan line */}
      <div style={{ position: 'absolute', top: `${((frame % 100) / 100) * 100}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.build}30, transparent)` }} />

      {/* Title badge */}
      <div style={{ position: 'absolute', top: 12, right: 40, padding: '6px 12px', backgroundColor: `${COLORS.build}20`, borderRadius: 4, fontSize: 12, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 600, color: COLORS.build }}>
        WORKFLOW
      </div>

      {/* Main workflow visualization */}
      <svg width="1100" height="500" style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Connection lines */}
        <defs>
          <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={TOOL_COLORS.claude} />
            <stop offset="100%" stopColor={TOOL_COLORS.ide} />
          </linearGradient>
          <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={TOOL_COLORS.ide} />
            <stop offset="100%" stopColor={TOOL_COLORS.remotion} />
          </linearGradient>
          <linearGradient id="flowGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={TOOL_COLORS.remotion} />
            <stop offset="100%" stopColor={TOOL_COLORS.capcut} />
          </linearGradient>
        </defs>

        {/* Pipeline connections */}
        {[
          { x1: 210, x2: 360, grad: 'flowGrad1' },
          { x1: 480, x2: 630, grad: 'flowGrad2' },
          { x1: 750, x2: 900, grad: 'flowGrad3' },
        ].map((line, i) => (
          <g key={i}>
            <line x1={line.x1} y1={250} x2={line.x2} y2={250} stroke={`url(#${line.grad})`} strokeWidth="3" opacity={0.4} />
            <line x1={line.x1} y1={250} x2={line.x2} y2={250} stroke={`url(#${line.grad})`} strokeWidth="3" strokeDasharray="15 10" strokeDashoffset={-frame * 1} opacity={0.7} />
            {/* Arrow */}
            <polygon points={`${line.x2 - 5},244 ${line.x2 + 5},250 ${line.x2 - 5},256`} fill={tools[i + 1].color} opacity={0.6} />
          </g>
        ))}

        {/* Tool nodes */}
        {tools.map((tool, i) => {
          const nodeEntrance = spring({ frame: frame - PHASE.WORKFLOW_IN - i * 20, fps, config: SPRING_CONFIGS.snappy });
          const nodeOpacity = interpolate(nodeEntrance, [0, 1], [0, 1]);
          const nodeY = interpolate(nodeEntrance, [0, 1], [30, 0]);
          const pulse = Math.sin(frame * 0.08 + i) * 0.1 + 0.9;

          return (
            <g key={i} transform={`translate(0, ${nodeY})`} opacity={nodeOpacity}>
              {/* Glow */}
              <circle cx={tool.x} cy={250} r={55} fill={tool.color} opacity={pulse * 0.15} />
              {/* Node */}
              <circle cx={tool.x} cy={250} r={45} fill={COLORS.surface} stroke={tool.color} strokeWidth="3" />
              {/* Icon (simplified for each tool) */}
              {i === 0 && (
                // Terminal icon
                <g>
                  <rect x={tool.x - 18} y={232} width={36} height={26} rx={4} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.8} />
                  <path d={`M${tool.x - 12} ${242} l8 6 l-8 6`} stroke={tool.color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1={tool.x} y1={254} x2={tool.x + 10} y2={254} stroke={tool.color} strokeWidth="2" strokeLinecap="round" opacity={Math.floor(frame * 0.15) % 2 === 0 ? 1 : 0.3} />
                </g>
              )}
              {i === 1 && (
                // Code editor icon
                <g>
                  <rect x={tool.x - 18} y={232} width={36} height={28} rx={3} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.8} />
                  <line x1={tool.x - 18} y1={240} x2={tool.x + 18} y2={240} stroke={tool.color} strokeWidth="1.5" opacity={0.5} />
                  <line x1={tool.x - 12} y1={246} x2={tool.x + 8} y2={246} stroke={tool.color} strokeWidth="2" opacity={0.6} />
                  <line x1={tool.x - 12} y1={252} x2={tool.x + 4} y2={252} stroke={tool.color} strokeWidth="2" opacity={0.4} />
                </g>
              )}
              {i === 2 && (
                // React/video icon
                <g>
                  <ellipse cx={tool.x} cy={250} rx={20} ry={8} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.6} transform={`rotate(${frame * 2}, ${tool.x}, 250)`} />
                  <ellipse cx={tool.x} cy={250} rx={20} ry={8} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.6} transform={`rotate(${60 + frame * 2}, ${tool.x}, 250)`} />
                  <ellipse cx={tool.x} cy={250} rx={20} ry={8} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.6} transform={`rotate(${-60 + frame * 2}, ${tool.x}, 250)`} />
                  <circle cx={tool.x} cy={250} r={5} fill={tool.color} />
                </g>
              )}
              {i === 3 && (
                // Timeline icon
                <g>
                  <rect x={tool.x - 18} y={235} width={36} height={24} rx={3} stroke={tool.color} strokeWidth="2" fill="none" opacity={0.8} />
                  <rect x={tool.x - 14} y={241} width={14} height={5} rx={1} fill={tool.color} opacity={0.6} />
                  <rect x={tool.x - 10} y={249} width={18} height={5} rx={1} fill={tool.color} opacity={0.4} />
                  <line x1={tool.x + 6} y1={235} x2={tool.x + 6} y2={259} stroke={tool.color} strokeWidth="1.5" strokeDasharray="3 3" opacity={0.5} />
                </g>
              )}
              {/* Label */}
              <text x={tool.x} y={312} textAnchor="middle" fill={tool.color} fontSize="18" fontWeight="bold" fontFamily="monospace" letterSpacing="0.1em">
                {tool.label}
              </text>
              <text x={tool.x} y={334} textAnchor="middle" fill={COLORS.textMuted} fontSize="15" fontFamily="sans-serif">
                {tool.sublabel}
              </text>
            </g>
          );
        })}

        {/* Flowing data packets */}
        {frame >= PHASE.FLOW_START && (
          <>
            {packet1X < 900 && (
              <g>
                <rect x={packet1X - 10} y={242} width={20} height={16} rx={3} fill={TOOL_COLORS.ide} opacity={0.9} />
                <text x={packet1X} y={253} textAnchor="middle" fill={COLORS.background} fontSize="9" fontWeight="bold">{'{}'}</text>
              </g>
            )}
            {packet2X < 900 && packet2X > 150 && (
              <g>
                <rect x={packet2X - 10} y={242} width={20} height={16} rx={3} fill={TOOL_COLORS.remotion} opacity={0.9} />
                <text x={packet2X} y={253} textAnchor="middle" fill={COLORS.background} fontSize="9" fontWeight="bold">MP4</text>
              </g>
            )}
          </>
        )}

        {/* Bottom label */}
        <text x={550} y={400} textAnchor="middle" fill={COLORS.textMuted} fontSize="18" fontFamily="sans-serif" fontStyle="italic">
          seamless workflow from idea to video
        </text>
      </svg>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene2B_ToolsDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneFade = interpolate(frame, [PHASE.FADE_OUT, 600], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Corner tool cards */}
      <div style={{ opacity: sceneFade }}>
        <MiniToolCard title="Claude" badge="CLI" color={TOOL_COLORS.claude} position="topLeft" />
        <MiniToolCard title="Remotion" badge="FRAMEWORK" color={TOOL_COLORS.remotion} position="topRight" />
        <MiniToolCard title="VS Code" badge="IDE" color={TOOL_COLORS.ide} position="bottomLeft" />
        <MiniToolCard title="CapCut" badge="EDITOR" color={TOOL_COLORS.capcut} position="bottomRight" />
      </div>

      {/* Central workflow animation */}
      <WorkflowAnimation />

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene2B_ToolsDemo;
