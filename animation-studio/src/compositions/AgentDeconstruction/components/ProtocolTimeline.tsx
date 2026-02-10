import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * ProtocolTimeline: Historical pattern of standardization
 *
 * Shows four eras with animated SVG icons:
 * 1. Before USB - connector chaos
 * 2. Before HTTP - protocol chaos
 * 3. Before LSP - editor × language matrix
 * 4. Now: MCP - unified tool connection
 */

type Era = {
  id: string;
  problem: string;
  problemDetail: string;
  solution: string;
  solutionDetail: string;
  color: string;
};

const ERAS: Era[] = [
  {
    id: 'usb',
    problem: 'Before USB',
    problemDetail: 'Every device, its own connector',
    solution: 'USB',
    solutionDetail: 'One standard port',
    color: COLORS.usb,
  },
  {
    id: 'http',
    problem: 'Before HTTP',
    problemDetail: 'Proprietary network protocols',
    solution: 'HTTP',
    solutionDetail: 'Universal web protocol',
    color: COLORS.http,
  },
  {
    id: 'lsp',
    problem: 'Before LSP',
    problemDetail: 'N editors × M languages',
    solution: 'LSP',
    solutionDetail: 'One protocol for all',
    color: COLORS.lsp,
  },
  {
    id: 'mcp',
    problem: 'Before MCP',
    problemDetail: 'N apps × M tools',
    solution: 'MCP',
    solutionDetail: 'Standard tool interface',
    color: COLORS.mcp,
  },
];

// Animated SVG Icons
const USBIcon: React.FC<{ frame: number; color: string; size?: number }> = ({ frame, color, size = 48 }) => {
  const pulse = Math.sin(frame * 0.08) * 0.15 + 0.85;
  const dataFlow = (frame % 40) / 40;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* USB connector shape */}
      <rect x="18" y="8" width="12" height="20" rx="2" fill="none" stroke={color} strokeWidth="2" />
      <rect x="20" y="12" width="3" height="8" fill={color} opacity={pulse} />
      <rect x="25" y="12" width="3" height="8" fill={color} opacity={pulse} />
      {/* Cable */}
      <path d="M24 28 L24 38" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Data flow indicator */}
      <circle cx="24" cy={28 + dataFlow * 10} r="2" fill={color} opacity={0.8} />
      {/* Connection glow */}
      <circle cx="24" cy="18" r="8" fill={color} opacity={0.1 + pulse * 0.1} />
    </svg>
  );
};

const HTTPIcon: React.FC<{ frame: number; color: string; size?: number }> = ({ frame, color, size = 48 }) => {
  const packetPos1 = ((frame * 0.8) % 60) / 60;
  const packetPos2 = (((frame * 0.8) + 30) % 60) / 60;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* Globe outline */}
      <circle cx="24" cy="24" r="16" fill="none" stroke={color} strokeWidth="2" />
      {/* Latitude lines */}
      <ellipse cx="24" cy="24" rx="16" ry="6" fill="none" stroke={color} strokeWidth="1" opacity={0.4} />
      <ellipse cx="24" cy="24" rx="16" ry="12" fill="none" stroke={color} strokeWidth="1" opacity={0.3} />
      {/* Longitude line */}
      <ellipse cx="24" cy="24" rx="6" ry="16" fill="none" stroke={color} strokeWidth="1" opacity={0.4} />
      {/* Data packets orbiting */}
      <circle
        cx={24 + Math.cos(packetPos1 * Math.PI * 2) * 16}
        cy={24 + Math.sin(packetPos1 * Math.PI * 2) * 6}
        r="3"
        fill={color}
        opacity={0.9}
      />
      <circle
        cx={24 + Math.cos(packetPos2 * Math.PI * 2 + Math.PI) * 16}
        cy={24 + Math.sin(packetPos2 * Math.PI * 2 + Math.PI) * 6}
        r="2"
        fill={color}
        opacity={0.6}
      />
    </svg>
  );
};

const LSPIcon: React.FC<{ frame: number; color: string; size?: number }> = ({ frame, color, size = 48 }) => {
  const cursorBlink = Math.sin(frame * 0.15) > 0;
  const typeProgress = (frame % 60) / 60;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* Editor window */}
      <rect x="8" y="8" width="32" height="32" rx="3" fill="none" stroke={color} strokeWidth="2" />
      {/* Title bar */}
      <line x1="8" y1="15" x2="40" y2="15" stroke={color} strokeWidth="1" opacity={0.4} />
      {/* Window controls */}
      <circle cx="13" cy="11.5" r="1.5" fill={color} opacity={0.5} />
      <circle cx="18" cy="11.5" r="1.5" fill={color} opacity={0.5} />
      {/* Code lines */}
      <line x1="12" y1="20" x2={12 + typeProgress * 20} y2="20" stroke={color} strokeWidth="2" opacity={0.8} />
      <line x1="12" y1="26" x2="28" y2="26" stroke={color} strokeWidth="2" opacity={0.5} />
      <line x1="16" y1="32" x2="32" y2="32" stroke={color} strokeWidth="2" opacity={0.5} />
      {/* Cursor */}
      {cursorBlink && (
        <line x1={12 + typeProgress * 20 + 2} y1="18" x2={12 + typeProgress * 20 + 2} y2="22" stroke={color} strokeWidth="2" />
      )}
      {/* Autocomplete suggestion */}
      {typeProgress > 0.3 && (
        <rect x="20" y="22" width="16" height="12" rx="2" fill={`${color}30`} stroke={color} strokeWidth="1" opacity={0.8} />
      )}
    </svg>
  );
};

const MCPIcon: React.FC<{ frame: number; color: string; size?: number }> = ({ frame, color, size = 48 }) => {
  const rotation = frame * 0.5;
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
  const connectionPulse = (frame % 30) / 30;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {/* Central hub */}
      <circle cx="24" cy="24" r="8" fill={`${color}30`} stroke={color} strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill={color} opacity={pulse} />
      {/* Outer ring */}
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="6,4"
        opacity={0.4}
        style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
      />
      {/* Connection nodes */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 24 + Math.cos(rad) * 18;
        const y = 24 + Math.sin(rad) * 18;
        const nodePulse = Math.sin(frame * 0.1 + i * 0.5) * 0.3 + 0.7;
        return (
          <g key={angle}>
            <line x1="24" y1="24" x2={x} y2={y} stroke={color} strokeWidth="1" opacity={0.3} />
            <circle cx={x} cy={y} r="4" fill={color} opacity={nodePulse} />
            {/* Connection pulse */}
            {connectionPulse > i * 0.2 && connectionPulse < i * 0.2 + 0.2 && (
              <circle
                cx={24 + Math.cos(rad) * (8 + connectionPulse * 50)}
                cy={24 + Math.sin(rad) * (8 + connectionPulse * 50)}
                r="2"
                fill={color}
                opacity={0.8}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

const getIcon = (id: string, frame: number, color: string, size?: number) => {
  switch (id) {
    case 'usb': return <USBIcon frame={frame} color={color} size={size} />;
    case 'http': return <HTTPIcon frame={frame} color={color} size={size} />;
    case 'lsp': return <LSPIcon frame={frame} color={color} size={size} />;
    case 'mcp': return <MCPIcon frame={frame} color={color} size={size} />;
    default: return null;
  }
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

// Internal box animation
const BoxInternalAnimation: React.FC<{ frame: number; color: string }> = ({ frame, color }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      borderRadius: 12,
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
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
      }}
    />
  </div>
);

type ProtocolTimelineProps = {
  startFrame?: number;
  activeEra?: number;
  showSolution?: boolean;
  scale?: number;
};

export const ProtocolTimeline: React.FC<ProtocolTimelineProps> = ({
  startFrame = 0,
  activeEra = -1,
  showSolution = true,
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

  // Single era focused view
  if (activeEra >= 0 && activeEra < ERAS.length) {
    const era = ERAS[activeEra];

    const problemProgress = spring({
      frame: adjustedFrame,
      fps,
      config: SPRING_CONFIGS.snappy,
    });

    const solutionProgress = spring({
      frame: adjustedFrame - seconds(2),
      fps,
      config: SPRING_CONFIGS.snappy,
    });

    return (
      <div
        style={{
          width: 800,
          height: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          transform: `scale(${scale})`,
          position: 'relative',
        }}
      >
        {/* Era indicator dots */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          {ERAS.map((e, i) => (
            <div
              key={e.id}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: i === activeEra ? e.color : COLORS.textDim,
                opacity: i === activeEra ? 1 : 0.3,
                boxShadow: i === activeEra ? `0 0 10px ${e.color}80` : 'none',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Problem section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: interpolate(problemProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(problemProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          <div style={{ marginBottom: 20 }}>
            {getIcon(era.id, adjustedFrame, era.color, 64)}
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontSize: 36,
              fontWeight: 600,
              color: COLORS.error,
              marginBottom: 12,
            }}
          >
            {era.problem}
          </div>
          <div
            style={{
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontSize: 22,
              color: COLORS.textMuted,
            }}
          >
            {era.problemDetail}
          </div>
        </div>

        {/* Arrow */}
        {showSolution && adjustedFrame > seconds(1.5) && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(
                spring({ frame: adjustedFrame - seconds(1.5), fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <path
                d="M20 5 L20 30 M10 22 L20 32 L30 22"
                fill="none"
                stroke={era.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Solution */}
        {showSolution && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: interpolate(solutionProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(solutionProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '20px 50px',
                backgroundColor: `${era.color}15`,
                border: `3px solid ${era.color}`,
                borderRadius: 16,
                marginBottom: 16,
                overflow: 'hidden',
              }}
            >
              <BoxInternalAnimation frame={adjustedFrame} color={era.color} />
              <CornerBrackets color={era.color} size={10} />
              <span
                style={{
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontSize: 42,
                  fontWeight: 700,
                  color: era.color,
                }}
              >
                {era.solution}
              </span>
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 20,
                color: COLORS.textMuted,
              }}
            >
              {era.solutionDetail}
            </div>
          </div>
        )}

      </div>
    );
  }

  // Horizontal timeline view (all eras)
  return (
    <div
      style={{
        width: 1000,
        height: 500,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* Timeline line with animated gradient */}
      <svg
        width={1000}
        height={500}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {ERAS.map((era, i) => (
              <stop
                key={era.id}
                offset={`${(i / (ERAS.length - 1)) * 100}%`}
                stopColor={era.color}
                stopOpacity={0.6}
              />
            ))}
          </linearGradient>
        </defs>
        <line
          x1={80}
          y1={250}
          x2={920}
          y2={250}
          stroke="url(#timeline-gradient)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Animated pulse along timeline */}
        <circle
          cx={80 + ((adjustedFrame % 120) / 120) * 840}
          cy={250}
          r={6}
          fill={COLORS.textPrimary}
          opacity={0.6}
        />
      </svg>

      {/* Era cards */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          padding: '0 40px',
        }}
      >
        {ERAS.map((era, i) => {
          const eraProgress = spring({
            frame: adjustedFrame - i * 15,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={era.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 200,
                opacity: interpolate(eraProgress, [0, 1], [0, 1]),
                transform: `
                  translateY(${interpolate(eraProgress, [0, 1], [40, 0])}px)
                  scale(${interpolate(eraProgress, [0, 1], [0.8, 1])})
                `,
              }}
            >
              {/* Icon */}
              <div style={{ marginBottom: 12 }}>
                {getIcon(era.id, adjustedFrame, era.color, 40)}
              </div>

              {/* Problem card (above) */}
              <div
                style={{
                  position: 'relative',
                  padding: '14px 18px',
                  backgroundColor: `${COLORS.error}10`,
                  border: `2px solid ${COLORS.error}40`,
                  borderRadius: 10,
                  marginBottom: 16,
                  textAlign: 'center',
                  overflow: 'hidden',
                }}
              >
                <CornerBrackets color={COLORS.error} size={6} />
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.error,
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {era.problem}
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 11,
                    color: COLORS.textMuted,
                  }}
                >
                  {era.problemDetail}
                </div>
              </div>

              {/* Timeline dot */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: era.color,
                  border: `4px solid ${COLORS.background}`,
                  boxShadow: `0 0 20px ${era.color}60`,
                  margin: '12px 0',
                }}
              />

              {/* Solution card (below) */}
              {showSolution && (
                <div
                  style={{
                    position: 'relative',
                    padding: '14px 18px',
                    backgroundColor: `${era.color}15`,
                    border: `2px solid ${era.color}`,
                    borderRadius: 10,
                    marginTop: 16,
                    textAlign: 'center',
                    overflow: 'hidden',
                    opacity: interpolate(
                      spring({ frame: adjustedFrame - i * 15 - 20, fps, config: SPRING_CONFIGS.snappy }),
                      [0, 1],
                      [0, 1]
                    ),
                  }}
                >
                  <BoxInternalAnimation frame={adjustedFrame} color={era.color} />
                  <CornerBrackets color={era.color} size={6} />
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.display.fontFamily,
                      fontSize: 20,
                      fontWeight: 700,
                      color: era.color,
                      marginBottom: 4,
                    }}
                  >
                    {era.solution}
                  </div>
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontSize: 11,
                      color: COLORS.textMuted,
                    }}
                  >
                    {era.solutionDetail}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom message */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - 80, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 24,
            color: COLORS.textPrimary,
            fontWeight: 500,
          }}
        >
          We've solved this problem before.
        </span>
      </div>
    </div>
  );
};

export default ProtocolTimeline;
