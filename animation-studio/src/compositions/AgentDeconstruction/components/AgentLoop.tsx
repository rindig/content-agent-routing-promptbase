import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

/**
 * Visual showing the agent loop:
 * Prompt → Model → Response → Evaluation → Next Prompt
 *
 * Key insight: The model doesn't decide what happens next.
 * The orchestration code (traditional software) makes that decision.
 */

/**
 * SVG Icons for each loop step
 */
const PromptIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const cursorBlink = Math.sin(frame * 0.2) > 0;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Document */}
      <rect x="6" y="4" width="20" height="24" rx="2" fill="none" stroke={color} strokeWidth="2" opacity={0.8} />
      {/* Lines */}
      <line x1="10" y1="10" x2="22" y2="10" stroke={color} strokeWidth="2" opacity={0.5} />
      <line x1="10" y1="15" x2="18" y2="15" stroke={color} strokeWidth="2" opacity={0.5} />
      <line x1="10" y1="20" x2="20" y2="20" stroke={color} strokeWidth="2" opacity={0.5} />
      {/* Cursor */}
      {cursorBlink && <rect x="10" y="23" width="2" height="4" fill={color} opacity={0.9} />}
    </svg>
  );
};

const ModelIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const pulse1 = 0.5 + Math.sin(frame * 0.15) * 0.3;
  const pulse2 = 0.5 + Math.sin(frame * 0.15 + 1) * 0.3;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Neural network simplified */}
      <circle cx="8" cy="16" r="4" fill={color} opacity={pulse1} />
      <circle cx="16" cy="8" r="3" fill={color} opacity={pulse2} />
      <circle cx="16" cy="24" r="3" fill={color} opacity={pulse1} />
      <circle cx="24" cy="16" r="4" fill={color} opacity={pulse2} />
      {/* Connections */}
      <line x1="12" y1="16" x2="20" y2="16" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <line x1="8" y1="12" x2="16" y2="8" stroke={color} strokeWidth="1.5" opacity={0.3} />
      <line x1="8" y1="20" x2="16" y2="24" stroke={color} strokeWidth="1.5" opacity={0.3} />
      <line x1="16" y1="8" x2="24" y2="12" stroke={color} strokeWidth="1.5" opacity={0.3} />
      <line x1="16" y1="24" x2="24" y2="20" stroke={color} strokeWidth="1.5" opacity={0.3} />
    </svg>
  );
};

const ResponseIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const flow = (frame * 0.1) % 1;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Speech bubble */}
      <path
        d="M6 6 h18 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-12 l-4 4 v-4 h-2 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={0.8}
      />
      {/* Streaming text effect */}
      <line x1="10" y1="11" x2={10 + flow * 14} y2="11" stroke={color} strokeWidth="2" opacity={0.6} />
      <line x1="10" y1="16" x2={10 + flow * 10} y2="16" stroke={color} strokeWidth="2" opacity={0.5} />
    </svg>
  );
};

const EvalIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const check = Math.sin(frame * 0.1) > 0;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Clipboard */}
      <rect x="6" y="6" width="20" height="22" rx="2" fill="none" stroke={color} strokeWidth="2" opacity={0.7} />
      <rect x="10" y="3" width="12" height="6" rx="1" fill={color} opacity={0.3} />
      {/* Checkmark or X based on animation */}
      {check ? (
        <path d="M10 16 L14 20 L22 12" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.9} />
      ) : (
        <path d="M11 14 L21 22 M21 14 L11 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.5} />
      )}
    </svg>
  );
};

const NextPromptIcon: React.FC<{ color: string; frame: number }> = ({ color, frame }) => {
  const offset = (frame * 0.15) % 8;
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Loop arrow */}
      <path
        d="M8 16 A8 8 0 1 1 16 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="4,2"
        strokeDashoffset={offset}
        opacity={0.7}
      />
      {/* Arrow head */}
      <path d="M12 21 L16 24 L12 27" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.9} />
      {/* Center dot */}
      <circle cx="16" cy="16" r="3" fill={color} opacity={0.5} />
    </svg>
  );
};

/**
 * Internal animation for each node
 */
const NodeInternalAnimation: React.FC<{
  type: 'code' | 'ai';
  color: string;
  frame: number;
}> = ({ type, color, frame }) => {
  if (type === 'ai') {
    // Floating particles
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.15 }}>
        {[...Array(4)].map((_, i) => {
          const x = 20 + Math.sin(frame * 0.03 + i * 2) * 30;
          const y = 20 + Math.cos(frame * 0.04 + i * 1.5) * 15;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          );
        })}
      </div>
    );
  }

  // Code type - brackets flowing
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.1 }}>
      {[...Array(3)].map((_, i) => {
        const x = ((frame * 0.5 + i * 40) % 140) - 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'monospace',
              fontSize: 12,
              color: color,
            }}
          >
            {'{ }'}
          </div>
        );
      })}
    </div>
  );
};

type LoopStep = {
  id: string;
  label: string;
  sublabel: string;
  type: 'ai' | 'code';
};

const LOOP_STEPS: LoopStep[] = [
  { id: 'prompt', label: 'Prompt', sublabel: 'Input prepared', type: 'code' },
  { id: 'model', label: 'Model', sublabel: 'Text generated', type: 'ai' },
  { id: 'response', label: 'Response', sublabel: 'Text output', type: 'ai' },
  { id: 'eval', label: 'Evaluation', sublabel: 'Conditions checked', type: 'code' },
  { id: 'next', label: 'Next Prompt', sublabel: 'Decision made', type: 'code' },
];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 90;

type AgentLoopProps = {
  startFrame?: number;
  activeStep?: number;
  showAnnotation?: boolean;
  scale?: number;
};

export const AgentLoop: React.FC<AgentLoopProps> = ({
  startFrame = 0,
  activeStep = -1,
  showAnnotation = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const baseProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const centerX = 400;
  const centerY = 280;
  const radius = 180;

  const getNodePosition = (index: number) => {
    const angle = (index / LOOP_STEPS.length) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle,
    };
  };

  const getEdgePoint = (cx: number, cy: number, targetX: number, targetY: number) => {
    const dx = targetX - cx;
    const dy = targetY - cy;
    const angle = Math.atan2(dy, dx);
    const halfW = NODE_WIDTH / 2;
    const halfH = NODE_HEIGHT / 2;
    const tanAngle = Math.tan(angle);
    let edgeX, edgeY;

    if (Math.abs(Math.cos(angle)) * halfH > Math.abs(Math.sin(angle)) * halfW) {
      edgeX = cx + (dx > 0 ? halfW : -halfW);
      edgeY = cy + (dx > 0 ? halfW : -halfW) * tanAngle;
    } else {
      edgeY = cy + (dy > 0 ? halfH : -halfH);
      edgeX = cx + (dy > 0 ? halfH : -halfH) / tanAngle;
    }

    return { x: edgeX, y: edgeY };
  };

  const getArrowPath = (fromIndex: number, toIndex: number) => {
    const from = getNodePosition(fromIndex);
    const to = getNodePosition(toIndex);
    const start = getEdgePoint(from.x, from.y, to.x, to.y);
    const end = getEdgePoint(to.x, to.y, from.x, from.y);
    return { start, end };
  };

  const renderIcon = (step: LoopStep, color: string) => {
    switch (step.id) {
      case 'prompt':
        return <PromptIcon color={color} frame={frame} />;
      case 'model':
        return <ModelIcon color={color} frame={frame} />;
      case 'response':
        return <ResponseIcon color={color} frame={frame} />;
      case 'eval':
        return <EvalIcon color={color} frame={frame} />;
      case 'next':
        return <NextPromptIcon color={color} frame={frame} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: 800,
        height: 600,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* SVG for arrows and data packets */}
      <svg width={800} height={600} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker id="arrow-code-new" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 L 2 5 Z" fill={COLORS.orchestration} />
          </marker>
          <marker id="arrow-ai-new" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 L 2 5 Z" fill={COLORS.ai} />
          </marker>
          {/* Glow filters */}
          <filter id="glow-code" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-ai" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines with data packets */}
        {LOOP_STEPS.map((step, i) => {
          const nextI = (i + 1) % LOOP_STEPS.length;
          const { start, end } = getArrowPath(i, nextI);

          const arrowProgress = spring({
            frame: frame - startFrame - 40 - i * 12,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const isAIArrow = step.type === 'ai';
          const arrowColor = isAIArrow ? COLORS.ai : COLORS.orchestration;
          const markerId = isAIArrow ? 'arrow-ai-new' : 'arrow-code-new';

          const lineLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          const animatedLength = interpolate(arrowProgress, [0, 1], [0, lineLength]);

          // Data packet position (loops continuously)
          const packetProgress = ((frame - startFrame - 60 - i * 15) % 60) / 60;
          const packetX = start.x + (end.x - start.x) * packetProgress;
          const packetY = start.y + (end.y - start.y) * packetProgress;

          return (
            <g key={`arrow-${i}`}>
              {/* Background glow line */}
              <line
                x1={start.x}
                y1={start.y}
                x2={start.x + ((end.x - start.x) * animatedLength) / lineLength}
                y2={start.y + ((end.y - start.y) * animatedLength) / lineLength}
                stroke={arrowColor}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.1}
              />
              {/* Main line */}
              <line
                x1={start.x}
                y1={start.y}
                x2={start.x + ((end.x - start.x) * animatedLength) / lineLength}
                y2={start.y + ((end.y - start.y) * animatedLength) / lineLength}
                stroke={arrowColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.7}
                markerEnd={arrowProgress > 0.9 ? `url(#${markerId})` : undefined}
              />
              {/* Data packet */}
              {arrowProgress > 0.9 && (
                <circle
                  cx={packetX}
                  cy={packetY}
                  r={4}
                  fill={arrowColor}
                  opacity={0.9}
                  filter={isAIArrow ? 'url(#glow-ai)' : 'url(#glow-code)'}
                />
              )}
            </g>
          );
        })}

        {/* Center decorative ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={60}
          fill="none"
          stroke={COLORS.textDim}
          strokeWidth={1}
          strokeDasharray="4,4"
          opacity={0.3}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={40}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={1}
          opacity={0.2}
        />
      </svg>

      {/* Step nodes */}
      {LOOP_STEPS.map((step, i) => {
        const pos = getNodePosition(i);

        const nodeProgress = spring({
          frame: frame - startFrame - i * 10,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        const isActive = activeStep === i;
        const isAI = step.type === 'ai';
        const nodeColor = isAI ? COLORS.ai : COLORS.orchestration;

        const breathe = 1 + Math.sin(frame * 0.03 + i) * 0.01;

        return (
          <div
            key={step.id}
            style={{
              position: 'absolute',
              left: pos.x - NODE_WIDTH / 2,
              top: pos.y - NODE_HEIGHT / 2,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '0 12px',
              gap: 10,
              backgroundColor: `${nodeColor}12`,
              border: `2px solid ${nodeColor}80`,
              borderRadius: 14,
              opacity: interpolate(nodeProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(nodeProgress, [0, 1], [0.8, (isActive ? 1.08 : 1) * breathe])})`,
              boxShadow: isActive
                ? `0 0 40px ${nodeColor}50, inset 0 0 20px ${nodeColor}15`
                : `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${nodeColor}20`,
              overflow: 'hidden',
            }}
          >
            {/* Internal animation */}
            <NodeInternalAnimation type={step.type} color={nodeColor} frame={frame} />

            {/* Scan line */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${((frame + i * 20) % 100)}%`,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${nodeColor}30, transparent)`,
              }}
            />

            {/* Icon */}
            <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
              {renderIcon(step, nodeColor)}
            </div>

            {/* Text content */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontSize: 15,
                  fontWeight: 600,
                  color: nodeColor,
                  textShadow: `0 0 15px ${nodeColor}40`,
                }}
              >
                {step.label}
              </div>
              <div
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 10,
                  color: COLORS.textMuted,
                  marginTop: 2,
                  letterSpacing: 0.3,
                }}
              >
                {step.sublabel}
              </div>
            </div>

            {/* Type badge */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                padding: '4px 10px',
                backgroundColor: nodeColor,
                borderRadius: 6,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.background,
                letterSpacing: 1,
                boxShadow: `0 0 12px ${nodeColor}80`,
                border: `1px solid ${nodeColor}`,
              }}
            >
              {isAI ? 'AI' : 'CODE'}
            </div>

            {/* Corner accents */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                width: 8,
                height: 8,
                borderTop: `2px solid ${nodeColor}40`,
                borderLeft: `2px solid ${nodeColor}40`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 6,
                right: 6,
                width: 8,
                height: 8,
                borderBottom: `2px solid ${nodeColor}40`,
                borderRight: `2px solid ${nodeColor}40`,
              }}
            />
          </div>
        );
      })}

      {/* Center annotation */}
      <div
        style={{
          position: 'absolute',
          left: centerX - 80,
          top: centerY - 20,
          width: 160,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 13,
            color: COLORS.textMuted,
            opacity: interpolate(
              spring({
                frame: frame - startFrame - 70,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 1]
            ),
            letterSpacing: 1,
          }}
        >
          The "agent" loop
        </div>
        {/* Ratio hint */}
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            opacity: interpolate(
              spring({
                frame: frame - startFrame - 90,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 0.7]
            ),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS.ai }} />
            <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 10, color: COLORS.ai }}>2</span>
          </div>
          <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 10, color: COLORS.textDim }}>:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS.orchestration }} />
            <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 10, color: COLORS.orchestration }}>3</span>
          </div>
        </div>
      </div>

      {/* Bottom annotation */}
      {showAnnotation && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({
                frame: frame - startFrame - 90,
                fps,
                config: SPRING_CONFIGS.gentle,
              }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 18,
              color: COLORS.orchestration,
              textShadow: `0 0 20px ${COLORS.orchestration}30`,
            }}
          >
            Traditional code
          </span>
          <span
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 18,
              color: COLORS.textMuted,
            }}
          >
            {' '}handles the arrows
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Function Call vs Process comparison - also upgraded
 */
export const FunctionVsProcess: React.FC<{
  startFrame?: number;
  showComparison?: 'function' | 'process' | 'both';
}> = ({ startFrame = 0, showComparison = 'both' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const rightProgress = spring({
    frame: frame - startFrame - 20,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const showFunction = showComparison === 'function' || showComparison === 'both';
  const showProcess = showComparison === 'process' || showComparison === 'both';

  // Data packet animation
  const packetX = ((frame * 2) % 160) - 20;

  return (
    <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start' }}>
      {showFunction && (
        <div
          style={{
            opacity: interpolate(leftProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(leftProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 24,
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Function Call
          </div>
          <div
            style={{
              position: 'relative',
              padding: 30,
              backgroundColor: `${COLORS.surface}`,
              borderRadius: 16,
              border: `2px solid ${COLORS.orchestration}60`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${COLORS.orchestration}20`,
              overflow: 'hidden',
            }}
          >
            {/* Internal flowing effect */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                opacity: 0.1,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: packetX,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 4,
                  backgroundColor: COLORS.ai,
                  borderRadius: 2,
                }}
              />
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div
                style={{
                  padding: '10px 18px',
                  backgroundColor: `${COLORS.orchestration}15`,
                  border: `1px solid ${COLORS.orchestration}50`,
                  borderRadius: 8,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  color: COLORS.orchestration,
                }}
              >
                input
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: 20, fontFamily: 'monospace' }}>→</div>
              <div
                style={{
                  padding: '14px 22px',
                  backgroundColor: `${COLORS.ai}15`,
                  border: `2px solid ${COLORS.ai}80`,
                  borderRadius: 10,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.ai,
                  boxShadow: `0 0 20px ${COLORS.ai}20`,
                }}
              >
                f(x)
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: 20, fontFamily: 'monospace' }}>→</div>
              <div
                style={{
                  padding: '10px 18px',
                  backgroundColor: `${COLORS.orchestration}15`,
                  border: `1px solid ${COLORS.orchestration}50`,
                  borderRadius: 8,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  color: COLORS.orchestration,
                }}
              >
                output
              </div>
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 13,
                color: COLORS.textMuted,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              Doesn't decide what's next
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: '10px 18px',
              backgroundColor: `${COLORS.ai}15`,
              border: `1px solid ${COLORS.ai}40`,
              borderRadius: 8,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 14,
              color: COLORS.ai,
              textAlign: 'center',
            }}
          >
            ← This is an LLM call
          </div>
        </div>
      )}

      {showProcess && (
        <div
          style={{
            opacity: interpolate(rightProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(rightProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 24,
              fontWeight: 600,
              color: COLORS.textPrimary,
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Running Process
          </div>
          <div
            style={{
              position: 'relative',
              padding: 30,
              backgroundColor: COLORS.surface,
              borderRadius: 16,
              border: `2px solid ${COLORS.accent}60`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${COLORS.accent}20`,
            }}
          >
            <div style={{ width: 200, height: 100, position: 'relative', marginBottom: 20 }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '16px 24px',
                  backgroundColor: `${COLORS.accent}15`,
                  border: `2px solid ${COLORS.accent}80`,
                  borderRadius: 10,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.accent,
                  boxShadow: `0 0 20px ${COLORS.accent}20`,
                }}
              >
                while(true)
              </div>
              <svg width={200} height={100} style={{ position: 'absolute', top: 0, left: 0 }}>
                {/* Animated loop path */}
                <path
                  d="M 100 10 C 180 10 190 90 100 90 C 10 90 20 10 100 10"
                  fill="none"
                  stroke={COLORS.accent}
                  strokeWidth={2}
                  strokeDasharray="8,4"
                  strokeDashoffset={-frame * 0.5}
                  opacity={0.5}
                />
                {/* Flowing dot */}
                <circle
                  cx={100 + Math.cos(frame * 0.05) * 70}
                  cy={50 + Math.sin(frame * 0.05) * 35}
                  r={4}
                  fill={COLORS.accent}
                  opacity={0.8}
                />
              </svg>
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 13,
                color: COLORS.textMuted,
                textAlign: 'center',
                letterSpacing: 0.5,
              }}
            >
              Decides its own next action
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: '10px 18px',
              backgroundColor: `${COLORS.accent}15`,
              border: `1px solid ${COLORS.accent}40`,
              borderRadius: 8,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 14,
              color: COLORS.accent,
              textAlign: 'center',
            }}
          >
            ← This is what "agent" implies
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentLoop;
