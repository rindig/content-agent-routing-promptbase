import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * JSONFlow: Visualizes API communication with animated icons and flowing data
 */

// SVG Icons
const CodeIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const cursorBlink = Math.sin(frame * 0.15) > 0;
  const typeProgress = (frame % 50) / 50;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {/* Terminal window */}
      <rect x="4" y="4" width="32" height="32" rx="4" fill="none" stroke={color} strokeWidth="2" />
      <line x1="4" y1="12" x2="36" y2="12" stroke={color} strokeWidth="1" opacity={0.4} />
      {/* Window controls */}
      <circle cx="10" cy="8" r="2" fill={color} opacity={0.5} />
      <circle cx="16" cy="8" r="2" fill={color} opacity={0.5} />
      {/* Code lines */}
      <rect x="8" y="16" width={4 + typeProgress * 16} height="2" rx="1" fill={color} opacity={0.8} />
      <rect x="8" y="22" width="20" height="2" rx="1" fill={color} opacity={0.5} />
      <rect x="12" y="28" width="14" height="2" rx="1" fill={color} opacity={0.4} />
      {/* Cursor */}
      {cursorBlink && <rect x={9 + typeProgress * 16} y="14" width="2" height="6" fill={color} />}
    </svg>
  );
};

const AIIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
  const neuronPulse = (frame % 30) / 30;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      {/* Brain outline */}
      <ellipse cx="20" cy="20" rx="16" ry="14" fill="none" stroke={color} strokeWidth="2" />
      {/* Neural nodes */}
      <circle cx="12" cy="16" r="4" fill={color} opacity={Math.sin(frame * 0.1) * 0.3 + 0.7} />
      <circle cx="28" cy="16" r="4" fill={color} opacity={Math.sin(frame * 0.1 + 1) * 0.3 + 0.7} />
      <circle cx="20" cy="26" r="4" fill={color} opacity={Math.sin(frame * 0.1 + 2) * 0.3 + 0.7} />
      {/* Connections */}
      <line x1="12" y1="16" x2="28" y2="16" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <line x1="12" y1="16" x2="20" y2="26" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <line x1="28" y1="16" x2="20" y2="26" stroke={color} strokeWidth="1.5" opacity={0.4} />
      {/* Pulse ring */}
      <circle cx="20" cy="20" r={8 + neuronPulse * 6} fill="none" stroke={color} strokeWidth="1" opacity={1 - neuronPulse} />
    </svg>
  );
};

const ToolIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const rotation = Math.sin(frame * 0.05) * 10;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}>
        <rect x="8" y="8" width="16" height="16" rx="2" fill="none" stroke={color} strokeWidth="2" />
        <line x1="12" y1="12" x2="20" y2="20" stroke={color} strokeWidth="2" />
        <line x1="20" y1="12" x2="12" y2="20" stroke={color} strokeWidth="2" />
      </g>
    </svg>
  );
};

// Corner brackets
const CornerBrackets: React.FC<{ color: string; size?: number }> = ({ color, size = 10 }) => (
  <>
    <div style={{ position: 'absolute', top: 6, left: 6, width: size, height: size, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', top: 6, right: 6, width: size, height: size, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 6, left: 6, width: size, height: size, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 6, right: 6, width: size, height: size, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
  </>
);

// Internal animation for boxes
const BoxInternalAnimation: React.FC<{ frame: number; color: string; type: 'code' | 'ai' }> = ({ frame, color, type }) => {
  const texts = type === 'code' ? ['async', 'await', 'fetch'] : ['think', 'learn', 'gen'];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        borderRadius: 16,
        pointerEvents: 'none',
      }}
    >
      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${((frame % 60) / 60) * 100}%`,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
        }}
      />
      {/* Floating text */}
      {texts.map((text, i) => {
        const yOffset = ((frame * 0.3 + i * 50) % 140) - 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 15 + i * 50,
              top: yOffset,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 8,
              color: color,
              opacity: 0.15,
            }}
          >
            {text}
          </div>
        );
      })}
    </div>
  );
};

type JSONFlowProps = {
  startFrame?: number;
  showRequest?: boolean;
  showResponse?: boolean;
  showMess?: boolean;
  scale?: number;
};

export const JSONFlow: React.FC<JSONFlowProps> = ({
  startFrame = 0,
  showRequest = true,
  showResponse = true,
  showMess = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;

  const baseProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const requestJSON = `{ "prompt": "...", "model": "claude" }`;
  const responseJSON = `{ "response": "...", "tokens": 150 }`;

  const requestProgress = interpolate(
    adjustedFrame,
    [30, 30 + seconds(1.5)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const responseProgress = interpolate(
    adjustedFrame,
    [seconds(2), seconds(2) + seconds(1.5)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Messy connections view
  if (showMess) {
    const connections = ['Database', 'Files', 'Browser', 'Calendar', 'Search', 'Email', 'Slack', 'GitHub'];

    return (
      <div
        style={{
          width: 900,
          height: 550,
          position: 'relative',
          transform: `scale(${scale})`,
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        }}
      >
        {/* Central AI App */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 180,
            height: 100,
            backgroundColor: `${COLORS.ai}15`,
            border: `3px solid ${COLORS.ai}`,
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          <BoxInternalAnimation frame={adjustedFrame} color={COLORS.ai} type="ai" />
          <CornerBrackets color={COLORS.ai} />
          <AIIcon frame={adjustedFrame} color={COLORS.ai} />
          <span style={{ fontFamily: TYPOGRAPHY.display.fontFamily, fontSize: 16, fontWeight: 600, color: COLORS.ai, marginTop: 4 }}>
            AI App
          </span>
          {/* Type badge */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              padding: '4px 10px',
              backgroundColor: COLORS.ai,
              borderRadius: 6,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 10,
              fontWeight: 700,
              color: COLORS.background,
              boxShadow: `0 0 8px ${COLORS.ai}80`,
            }}
          >
            AI
          </div>
        </div>

        {/* Connection lines */}
        <svg width={900} height={550} style={{ position: 'absolute', top: 0, left: 0 }}>
          {connections.map((conn, i) => {
            const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 200;
            const x = 450 + Math.cos(angle) * radius;
            const y = 275 + Math.sin(angle) * radius;

            const connProgress = spring({
              frame: adjustedFrame - i * 5,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <g key={conn}>
                <line
                  x1={450}
                  y1={275}
                  x2={450 + (x - 450) * connProgress}
                  y2={275 + (y - 275) * connProgress}
                  stroke={COLORS.dataProcessing}
                  strokeWidth={2}
                  opacity={0.5}
                />
                {/* Cross lines */}
                {i < connections.length - 1 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={450 + Math.cos(((i + 2) / connections.length) * 2 * Math.PI - Math.PI / 2) * radius}
                    y2={275 + Math.sin(((i + 2) / connections.length) * 2 * Math.PI - Math.PI / 2) * radius}
                    stroke={COLORS.error}
                    strokeWidth={1}
                    strokeDasharray="4,4"
                    opacity={connProgress * 0.3}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Connection boxes */}
        {connections.map((conn, i) => {
          const angle = (i / connections.length) * 2 * Math.PI - Math.PI / 2;
          const radius = 200;
          const x = 450 + Math.cos(angle) * radius;
          const y = 275 + Math.sin(angle) * radius;

          const connProgress = spring({
            frame: adjustedFrame - 10 - i * 5,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={conn}
              style={{
                position: 'absolute',
                left: x - 55,
                top: y - 28,
                width: 110,
                height: 56,
                backgroundColor: `${COLORS.dataProcessing}15`,
                border: `2px solid ${COLORS.dataProcessing}60`,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(connProgress, [0, 1], [0, 1]),
                transform: `scale(${interpolate(connProgress, [0, 1], [0.8, 1])})`,
                overflow: 'hidden',
              }}
            >
              <CornerBrackets color={COLORS.dataProcessing} size={6} />
              <ToolIcon frame={adjustedFrame + i * 10} color={COLORS.dataProcessing} />
              <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 12, color: COLORS.textMuted, marginLeft: 6 }}>
                {conn}
              </span>
            </div>
          );
        })}

        {/* Caption */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(
              spring({ frame: adjustedFrame - 60, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 24, color: COLORS.error, fontWeight: 600 }}>
            This doesn't scale.
          </span>
        </div>
      </div>
    );
  }

  // Simple two-box view
  return (
    <div
      style={{
        width: 900,
        height: 400,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* Your Code box */}
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 200,
          height: 140,
          backgroundColor: `${COLORS.orchestration}15`,
          border: `3px solid ${COLORS.orchestration}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
          overflow: 'hidden',
        }}
      >
        <BoxInternalAnimation frame={adjustedFrame} color={COLORS.orchestration} type="code" />
        <CornerBrackets color={COLORS.orchestration} />
        <CodeIcon frame={adjustedFrame} color={COLORS.orchestration} />
        <div style={{ fontFamily: TYPOGRAPHY.display.fontFamily, fontSize: 20, fontWeight: 600, color: COLORS.orchestration, marginTop: 8 }}>
          Your Code
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
          Application
        </div>
        {/* Type badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '4px 10px',
            backgroundColor: COLORS.orchestration,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.background,
            boxShadow: `0 0 8px ${COLORS.orchestration}80`,
          }}
        >
          CODE
        </div>
      </div>

      {/* AI Provider box */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 200,
          height: 140,
          backgroundColor: `${COLORS.ai}15`,
          border: `3px solid ${COLORS.ai}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 15, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
          overflow: 'hidden',
        }}
      >
        <BoxInternalAnimation frame={adjustedFrame} color={COLORS.ai} type="ai" />
        <CornerBrackets color={COLORS.ai} />
        <AIIcon frame={adjustedFrame} color={COLORS.ai} />
        <div style={{ fontFamily: TYPOGRAPHY.display.fontFamily, fontSize: 20, fontWeight: 600, color: COLORS.ai, marginTop: 8 }}>
          AI Provider
        </div>
        <div style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
          API Endpoint
        </div>
        {/* Type badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '4px 10px',
            backgroundColor: COLORS.ai,
            borderRadius: 6,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 10,
            fontWeight: 700,
            color: COLORS.background,
            boxShadow: `0 0 8px ${COLORS.ai}80`,
          }}
        >
          AI
        </div>
      </div>

      {/* Connection arrows with flowing data */}
      <svg width={900} height={400} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.dataProcessing} />
          </marker>
          <marker id="arrowhead-back" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
            <polygon points="10 0, 0 3.5, 10 7" fill={COLORS.dataProcessing} />
          </marker>
          <linearGradient id="request-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.orchestration} />
            <stop offset="100%" stopColor={COLORS.ai} />
          </linearGradient>
          <linearGradient id="response-grad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={COLORS.ai} />
            <stop offset="100%" stopColor={COLORS.orchestration} />
          </linearGradient>
        </defs>

        {/* Request line */}
        {showRequest && (
          <line
            x1={290}
            y1={170}
            x2={290 + (610 - 290) * Math.min(requestProgress, 1)}
            y2={170}
            stroke="url(#request-grad)"
            strokeWidth={3}
            markerEnd={requestProgress >= 1 ? 'url(#arrowhead)' : undefined}
          />
        )}

        {/* Response line */}
        {showResponse && responseProgress > 0 && (
          <line
            x1={610}
            y1={230}
            x2={610 - (610 - 290) * Math.min(responseProgress, 1)}
            y2={230}
            stroke="url(#response-grad)"
            strokeWidth={3}
            markerEnd={responseProgress >= 1 ? 'url(#arrowhead-back)' : undefined}
          />
        )}
      </svg>

      {/* Flowing data dots */}
      {showRequest && requestProgress > 0 && requestProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 290 + (610 - 290) * requestProgress - 6,
            top: 164,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: COLORS.dataProcessing,
            boxShadow: `0 0 12px ${COLORS.dataProcessing}, 0 0 24px ${COLORS.dataProcessing}60`,
          }}
        />
      )}
      {showResponse && responseProgress > 0 && responseProgress < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 610 - (610 - 290) * responseProgress - 6,
            top: 224,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: COLORS.dataProcessing,
            boxShadow: `0 0 12px ${COLORS.dataProcessing}, 0 0 24px ${COLORS.dataProcessing}60`,
          }}
        />
      )}

      {/* Request JSON */}
      {showRequest && requestProgress > 0 && requestProgress < 1.2 && (
        <div
          style={{
            position: 'absolute',
            left: 290 + (610 - 290) * requestProgress - 120,
            top: 115,
            padding: '10px 14px',
            backgroundColor: `${COLORS.dataProcessing}20`,
            border: `2px solid ${COLORS.dataProcessing}60`,
            borderRadius: 8,
            opacity: interpolate(requestProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]),
          }}
        >
          <CornerBrackets color={COLORS.dataProcessing} size={5} />
          <code style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 11, color: COLORS.dataProcessing }}>
            {requestJSON}
          </code>
        </div>
      )}

      {/* Response JSON */}
      {showResponse && responseProgress > 0 && responseProgress < 1.2 && (
        <div
          style={{
            position: 'absolute',
            right: 290 + (610 - 290) * (1 - responseProgress) - 100,
            top: 250,
            padding: '10px 14px',
            backgroundColor: `${COLORS.dataProcessing}20`,
            border: `2px solid ${COLORS.dataProcessing}60`,
            borderRadius: 8,
            opacity: interpolate(responseProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]),
          }}
        >
          <CornerBrackets color={COLORS.dataProcessing} size={5} />
          <code style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 11, color: COLORS.dataProcessing }}>
            {responseJSON}
          </code>
        </div>
      )}

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 30, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, color: COLORS.textMuted }}>
          Request
        </span>
      </div>

      {showResponse && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: interpolate(
              spring({ frame: adjustedFrame - seconds(2.5), fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 14, color: COLORS.textMuted }}>
            Response
          </span>
        </div>
      )}

      {/* Bottom label */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - seconds(3.5), fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.dataProcessing }}>
          JSON out, JSON back
        </span>
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.textMuted }}>
          {' '}— that's an API
        </span>
      </div>
    </div>
  );
};

export default JSONFlow;
