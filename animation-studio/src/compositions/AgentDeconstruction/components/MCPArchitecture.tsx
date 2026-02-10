import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * MCPArchitecture: Shows the MCP Host/Client/Server pattern
 * with animated SVG icons and flowing data visualization
 */

// SVG Icons for each component
const HostIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
  const brainPulse = (frame % 40) / 40;

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {/* Brain/AI symbol */}
      <ellipse cx="18" cy="18" rx="14" ry="12" fill="none" stroke={color} strokeWidth="2" />
      {/* Neural connections */}
      <circle cx="12" cy="14" r="3" fill={color} opacity={pulse} />
      <circle cx="24" cy="14" r="3" fill={color} opacity={Math.sin(frame * 0.1 + 1) * 0.2 + 0.8} />
      <circle cx="18" cy="22" r="3" fill={color} opacity={Math.sin(frame * 0.1 + 2) * 0.2 + 0.8} />
      <line x1="12" y1="14" x2="24" y2="14" stroke={color} strokeWidth="1" opacity={0.4} />
      <line x1="12" y1="14" x2="18" y2="22" stroke={color} strokeWidth="1" opacity={0.4} />
      <line x1="24" y1="14" x2="18" y2="22" stroke={color} strokeWidth="1" opacity={0.4} />
      {/* Thought pulse */}
      <circle cx="18" cy="6" r={2 + brainPulse * 3} fill="none" stroke={color} strokeWidth="1" opacity={1 - brainPulse} />
    </svg>
  );
};

const ClientIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const rotation = frame * 0.8;
  const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {/* Protocol handler symbol - gear/cog */}
      <circle cx="18" cy="18" r="8" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="18" cy="18" r="4" fill={color} opacity={pulse} />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = ((angle + rotation) * Math.PI) / 180;
        const x1 = 18 + Math.cos(rad) * 8;
        const y1 = 18 + Math.sin(rad) * 8;
        const x2 = 18 + Math.cos(rad) * 12;
        const y2 = 18 + Math.sin(rad) * 12;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const ServerIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const ledBlink = Math.floor(frame / 15) % 3;
  const dataFlow = (frame % 30) / 30;

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {/* Server rack */}
      <rect x="8" y="6" width="20" height="8" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="8" y="16" width="20" height="8" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="8" y="26" width="20" height="6" rx="2" fill="none" stroke={color} strokeWidth="2" />
      {/* LEDs */}
      <circle cx="12" cy="10" r="2" fill={color} opacity={ledBlink === 0 ? 1 : 0.3} />
      <circle cx="12" cy="20" r="2" fill={color} opacity={ledBlink === 1 ? 1 : 0.3} />
      <circle cx="12" cy="29" r="2" fill={color} opacity={ledBlink === 2 ? 1 : 0.3} />
      {/* Data indicator */}
      <rect x="18" y={8 + dataFlow * 2} width="8" height="2" fill={color} opacity={0.6} />
      <rect x="18" y={18 + dataFlow * 2} width="6" height="2" fill={color} opacity={0.5} />
    </svg>
  );
};

const ToolIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const rotation = Math.sin(frame * 0.05) * 10;
  const sparkle = (frame % 20) / 20;

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      {/* Wrench */}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}>
        <path
          d="M8 10 L14 16 L12 18 L6 12 C4 10 4 7 6 5 C8 3 11 3 13 5 L11 7 L8 10"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 16 L26 28 C28 30 31 30 33 28 C35 26 35 23 33 21 L21 9"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      {/* Sparkle effect */}
      <circle cx={28} cy={8} r={sparkle * 3} fill={color} opacity={1 - sparkle} />
    </svg>
  );
};

// Corner brackets
const CornerBrackets: React.FC<{ color: string; size?: number }> = ({ color, size = 8 }) => (
  <>
    <div style={{ position: 'absolute', top: 4, left: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', top: 4, right: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, left: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, right: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
  </>
);

// Internal animation for boxes
const BoxInternalAnimation: React.FC<{ frame: number; color: string; type: string }> = ({ frame, color, type }) => {
  const textOptions: Record<string, string[]> = {
    host: ['await', 'async', 'query'],
    client: ['JSON', 'parse', 'send'],
    server: ['exec', 'call', 'return'],
    tool: ['SQL', 'read', 'write'],
  };
  const texts = textOptions[type] || ['...'];

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
      {/* Floating code snippets */}
      {texts.map((text, i) => {
        const yOffset = ((frame * 0.4 + i * 50) % 150) - 20;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 10 + i * 40,
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

type MCPArchitectureProps = {
  startFrame?: number;
  showFlow?: boolean;
  highlightSection?: 'host' | 'client' | 'server' | 'tool' | null;
  scale?: number;
};

export const MCPArchitecture: React.FC<MCPArchitectureProps> = ({
  startFrame = 0,
  showFlow = true,
  highlightSection = null,
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

  const components = [
    {
      id: 'host',
      label: 'AI Application',
      sublabel: 'Host',
      color: COLORS.ai,
      delay: 0,
      icon: HostIcon,
      isAI: true,
    },
    {
      id: 'client',
      label: 'MCP Client',
      sublabel: 'Protocol Handler',
      color: COLORS.mcp,
      delay: 15,
      icon: ClientIcon,
      isAI: false,
    },
    {
      id: 'server',
      label: 'MCP Server',
      sublabel: 'Tool Provider',
      color: COLORS.mcp,
      delay: 30,
      icon: ServerIcon,
      isAI: false,
    },
    {
      id: 'tool',
      label: 'Tool',
      sublabel: 'e.g., Database, API',
      color: COLORS.dataProcessing,
      delay: 45,
      icon: ToolIcon,
      isAI: false,
    },
  ];

  // Flow animation - data packets moving through
  const flowProgress = interpolate(
    adjustedFrame,
    [60, 60 + seconds(4)],
    [0, 4],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        width: 1100,
        height: 500,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 25,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 10, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.mcp,
            letterSpacing: 1,
          }}
        >
          Model Context Protocol
        </span>
      </div>

      {/* Architecture boxes */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 20,
          paddingTop: 40,
        }}
      >
        {components.map((comp, i) => {
          const compProgress = spring({
            frame: adjustedFrame - comp.delay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const isHighlighted = highlightSection === comp.id || highlightSection === null;
          const dimmed = highlightSection !== null && !isHighlighted;

          const IconComponent = comp.icon;

          return (
            <React.Fragment key={comp.id}>
              {/* Component box */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: dimmed ? 0.3 : interpolate(compProgress, [0, 1], [0, 1]),
                  transform: `
                    translateY(${interpolate(compProgress, [0, 1], [30, 0])}px)
                    scale(${interpolate(compProgress, [0, 1], [0.8, 1])})
                  `,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 180,
                    height: 120,
                    backgroundColor: `${comp.color}15`,
                    border: `3px solid ${comp.color}`,
                    borderRadius: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isHighlighted && highlightSection
                      ? `0 0 30px ${comp.color}40`
                      : `0 0 15px ${comp.color}20`,
                    overflow: 'hidden',
                  }}
                >
                  <BoxInternalAnimation frame={adjustedFrame} color={comp.color} type={comp.id} />
                  <CornerBrackets color={comp.color} size={10} />

                  {/* Icon */}
                  <IconComponent frame={adjustedFrame} color={comp.color} />

                  {/* Label */}
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.display.fontFamily,
                      fontSize: 16,
                      fontWeight: 600,
                      color: comp.color,
                      textAlign: 'center',
                      marginTop: 8,
                    }}
                  >
                    {comp.label}
                  </div>
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontSize: 10,
                      color: COLORS.textMuted,
                      marginTop: 4,
                    }}
                  >
                    {comp.sublabel}
                  </div>

                  {/* Type badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      padding: '4px 10px',
                      backgroundColor: comp.isAI ? COLORS.ai : COLORS.orchestration,
                      borderRadius: 6,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontSize: 10,
                      fontWeight: 700,
                      color: COLORS.background,
                      border: `1px solid ${comp.isAI ? COLORS.ai : COLORS.orchestration}`,
                      boxShadow: `0 0 8px ${comp.isAI ? COLORS.ai : COLORS.orchestration}80`,
                    }}
                  >
                    {comp.isAI ? 'AI' : 'CODE'}
                  </div>
                </div>
              </div>

              {/* Arrow between components */}
              {i < components.length - 1 && (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: interpolate(
                      spring({ frame: adjustedFrame - comp.delay - 10, fps, config: SPRING_CONFIGS.gentle }),
                      [0, 1],
                      [0, 1]
                    ),
                  }}
                >
                  <svg width={70} height={50}>
                    <defs>
                      <marker
                        id={`mcp-arrow-${i}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.mcp} />
                      </marker>
                      <linearGradient id={`arrow-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={components[i].color} />
                        <stop offset="100%" stopColor={components[i + 1].color} />
                      </linearGradient>
                    </defs>
                    <line
                      x1={5}
                      y1={25}
                      x2={60}
                      y2={25}
                      stroke={`url(#arrow-grad-${i})`}
                      strokeWidth={3}
                      markerEnd={`url(#mcp-arrow-${i})`}
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Flow visualization - glowing data packets */}
      {showFlow && flowProgress > 0 && (
        <svg
          width={1100}
          height={500}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {[0, 1, 2].map((i) => {
            const dotProgress = flowProgress - i;
            if (dotProgress < 0 || dotProgress > 1) return null;

            const startX = 175 + i * 260;
            const endX = 175 + (i + 1) * 260;
            const x = interpolate(dotProgress, [0, 1], [startX, endX]);
            const color = i === 0 ? COLORS.ai : COLORS.mcp;

            return (
              <g key={i}>
                {/* Glow */}
                <circle
                  cx={x}
                  cy={250}
                  r={12}
                  fill={color}
                  opacity={interpolate(dotProgress, [0, 0.1, 0.9, 1], [0, 0.3, 0.3, 0])}
                  filter="url(#blur)"
                />
                {/* Main dot */}
                <circle
                  cx={x}
                  cy={250}
                  r={8}
                  fill={color}
                  opacity={interpolate(dotProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])}
                />
                {/* Inner bright core */}
                <circle
                  cx={x}
                  cy={250}
                  r={4}
                  fill="#ffffff"
                  opacity={interpolate(dotProgress, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0])}
                />
              </g>
            );
          })}
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
          </defs>
        </svg>
      )}

      {/* Bottom annotation */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 70, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '16px 32px',
            backgroundColor: `${COLORS.mcp}10`,
            border: `2px solid ${COLORS.mcp}40`,
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          <CornerBrackets color={COLORS.mcp} size={8} />
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.textPrimary }}>
            The model{' '}
          </span>
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.mcp, fontWeight: 600 }}>
            doesn't call APIs directly
          </span>
        </div>
      </div>

      {/* Key insight */}
      <div
        style={{
          position: 'absolute',
          bottom: 15,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 90, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 16,
            color: COLORS.textMuted,
          }}
        >
          The protocol handles discovery, authentication, and transport
        </span>
      </div>
    </div>
  );
};

export default MCPArchitecture;
