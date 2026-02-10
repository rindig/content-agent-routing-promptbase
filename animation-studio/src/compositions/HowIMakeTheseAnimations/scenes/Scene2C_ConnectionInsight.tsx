/**
 * Scene 2C: Connection Insight
 * [1:30 - 1:45] — 450 frames
 *
 * "I'm not going to walk through installation because there are plenty of
 *  tutorials for that and it would eat up time better spent on the actual
 *  process. What matters isn't the tools themselves. What matters is how
 *  they work together."
 *
 * Visual: Tools connecting into unified workflow
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

// Timeline markers
const PHASE = {
  DISMISSAL: 0,
  CARDS_RETURN: 90,
  KEY_STATEMENT: 180,
  TRANSFORM_TEXT: 240,
  CONNECTIONS: 300,
  FULL_SYSTEM: 380,
};

// Tool colors
const TOOL_COLORS = {
  claude: '#D97706',
  ide: '#0EA5E9',
  remotion: '#3B82F6',
  capcut: '#10B981',
};

// SVG Icons (simplified for this scene)
const TerminalIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M6 9L10 12L6 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CodeIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="18" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M2 7H22" stroke={color} strokeWidth="1.5" />
  </svg>
);

const VideoIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
    <polygon points="10,8 16,12 10,16" fill={color} opacity="0.6" />
  </svg>
);

const TimelineIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <rect x="4" y="8" width="8" height="3" rx="1" fill={color} opacity="0.5" />
    <rect x="6" y="13" width="10" height="3" rx="1" fill={color} opacity="0.3" />
  </svg>
);

// Link icon for tutorial dismissal
const LinkIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Connection tool card (smaller, for arrangement)
interface ConnectToolCardProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  index: number;
  xPos: number;
}

const ConnectToolCard: React.FC<ConnectToolCardProps> = ({
  title,
  color,
  icon,
  index,
  xPos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entrance = spring({
    frame: frame - PHASE.CARDS_RETURN - index * 10,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const y = interpolate(entrance, [0, 1], [30, 0]);
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);

  // Dim when statement appears, then brighten with connections
  const statementDim = interpolate(
    frame,
    [PHASE.KEY_STATEMENT, PHASE.KEY_STATEMENT + 30],
    [1, 0.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const connectionBrighten = interpolate(
    frame,
    [PHASE.CONNECTIONS + index * 20, PHASE.CONNECTIONS + 60 + index * 20],
    [0.5, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalOpacity = frame >= PHASE.CONNECTIONS ? connectionBrighten : statementDim;

  // Float animation
  const floatOffset = Math.sin((frame + index * 25) * 0.05) * 3;

  // Pulse when connections complete
  const pulseScale = frame >= PHASE.FULL_SYSTEM
    ? 1 + Math.sin((frame - PHASE.FULL_SYSTEM) * 0.1) * 0.02
    : 1;

  if (frame < PHASE.CARDS_RETURN) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(50% + ${xPos}px)`,
        top: '50%',
        transform: `translate(-50%, calc(-50% + ${y + floatOffset}px)) scale(${scale * pulseScale})`,
        width: 140,
        height: 100,
        backgroundColor: COLORS.surface,
        border: `2px solid ${color}`,
        borderRadius: 12,
        padding: 12,
        opacity: opacity * finalOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 14,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.text,
        }}
      >
        {title}
      </span>
    </div>
  );
};

// Connection lines with flowing dots
const ConnectionLines: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineProgress = spring({
    frame: frame - PHASE.CONNECTIONS,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  // Card positions (matching ConnectToolCard xPos values)
  const positions = [-300, -100, 100, 300];

  // Flowing animation
  const flowOffset = frame * 0.8;

  if (frame < PHASE.CONNECTIONS) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 200,
        pointerEvents: 'none',
      }}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="connGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={TOOL_COLORS.claude} />
          <stop offset="100%" stopColor={TOOL_COLORS.ide} />
        </linearGradient>
        <linearGradient id="connGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={TOOL_COLORS.ide} />
          <stop offset="100%" stopColor={TOOL_COLORS.remotion} />
        </linearGradient>
        <linearGradient id="connGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={TOOL_COLORS.remotion} />
          <stop offset="100%" stopColor={TOOL_COLORS.capcut} />
        </linearGradient>
      </defs>

      {/* Connection lines */}
      {[
        { x1: 100, x2: 300, grad: 'connGrad1' },
        { x1: 300, x2: 500, grad: 'connGrad2' },
        { x1: 500, x2: 700, grad: 'connGrad3' },
      ].map((line, i) => (
        <g key={i}>
          {/* Base line */}
          <line
            x1={line.x1}
            y1={100}
            x2={line.x1 + (line.x2 - line.x1) * lineProgress}
            y2={100}
            stroke={`url(#${line.grad})`}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />
          {/* Flowing dashes */}
          <line
            x1={line.x1}
            y1={100}
            x2={line.x1 + (line.x2 - line.x1) * lineProgress}
            y2={100}
            stroke={`url(#${line.grad})`}
            strokeWidth={2}
            strokeDasharray="12 8"
            strokeDashoffset={-flowOffset}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Traveling data packets */}
      {lineProgress > 0.3 && [0, 1, 2].map((i) => {
        const packetProgress = ((frame - PHASE.CONNECTIONS - i * 30) % 90) / 90;
        const startX = 100 + i * 200;
        const endX = 300 + i * 200;
        const packetX = startX + (endX - startX) * packetProgress;
        const colors = [TOOL_COLORS.claude, TOOL_COLORS.ide, TOOL_COLORS.remotion];

        if (frame < PHASE.CONNECTIONS + i * 30) return null;

        return (
          <circle
            key={i}
            cx={packetX}
            cy={100}
            r={5}
            fill={colors[i]}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
};

export const Scene2C_ConnectionInsight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Dismissal phase ===
  const dismissalOpacity = interpolate(
    frame,
    [0, 30, 70, 90],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // X-out animation
  const strikeProgress = interpolate(
    frame,
    [40, 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === Key statement phase ===
  const statementEntrance = spring({
    frame: frame - PHASE.KEY_STATEMENT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const statementOpacity = interpolate(statementEntrance, [0, 1], [0, 1]);
  const statementY = interpolate(statementEntrance, [0, 1], [20, 0]);

  // Text transform
  const isTransformed = frame >= PHASE.TRANSFORM_TEXT;
  const transformProgress = spring({
    frame: frame - PHASE.TRANSFORM_TEXT,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // "TOGETHER" glow
  const togetherGlow = frame >= PHASE.TRANSFORM_TEXT + 30
    ? Math.sin((frame - PHASE.TRANSFORM_TEXT - 30) * 0.08) * 8 + 10
    : 0;

  // Statement fades when connections start
  const statementFade = interpolate(
    frame,
    [PHASE.CONNECTIONS, PHASE.CONNECTIONS + 60],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Dismissal: Installation tutorials exist elsewhere */}
      {frame < PHASE.CARDS_RETURN && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: dismissalOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <LinkIcon color={COLORS.textDim} size={20} />
            <span
              style={{
                fontSize: SIZES.body,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.textMuted,
              }}
            >
              Installation tutorials exist elsewhere
            </span>
            {/* Strike through */}
            <svg
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 4,
                transform: 'translateY(-50%)',
              }}
              width="100%"
              height="4"
            >
              <line
                x1={0}
                y1={2}
                x2={`${strikeProgress * 100}%`}
                y2={2}
                stroke={COLORS.time}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.6}
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 18,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textDim,
              fontStyle: 'italic',
            }}
          >
            (quick acknowledgment)
          </span>
        </div>
      )}

      {/* Tool cards in horizontal arrangement */}
      <ConnectToolCard
        title="Claude"
        color={TOOL_COLORS.claude}
        icon={<TerminalIcon color={TOOL_COLORS.claude} size={28} />}
        index={0}
        xPos={-300}
      />
      <ConnectToolCard
        title="VS Code"
        color={TOOL_COLORS.ide}
        icon={<CodeIcon color={TOOL_COLORS.ide} size={28} />}
        index={1}
        xPos={-100}
      />
      <ConnectToolCard
        title="Remotion"
        color={TOOL_COLORS.remotion}
        icon={<VideoIcon color={TOOL_COLORS.remotion} size={28} />}
        index={2}
        xPos={100}
      />
      <ConnectToolCard
        title="CapCut"
        color={TOOL_COLORS.capcut}
        icon={<TimelineIcon color={TOOL_COLORS.capcut} size={28} />}
        index={3}
        xPos={300}
      />

      {/* Key statement */}
      {frame >= PHASE.KEY_STATEMENT && (
        <div
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            transform: `translate(-50%, ${statementY}px)`,
            opacity: statementOpacity * statementFade,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* First line */}
          <span
            style={{
              fontSize: SIZES.body,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              opacity: isTransformed ? 0.4 : 1,
              transition: 'opacity 0.3s',
            }}
          >
            What matters isn't the tools themselves
          </span>

          {/* Transformed line */}
          {isTransformed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: interpolate(transformProgress, [0, 1], [0, 1]),
                transform: `scale(${interpolate(transformProgress, [0, 1], [0.9, 1])})`,
              }}
            >
              <span
                style={{
                  fontSize: SIZES.body,
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  color: COLORS.text,
                }}
              >
                What matters is how they work
              </span>
              <span
                style={{
                  fontSize: SIZES.title,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 700,
                  color: COLORS.possibility,
                  textShadow: `0 0 ${togetherGlow}px ${COLORS.possibility}60`,
                }}
              >
                TOGETHER
              </span>
            </div>
          )}
        </div>
      )}

      {/* Connection lines */}
      <ConnectionLines />

      {/* "Unified System" label when all connected */}
      {frame >= PHASE.FULL_SYSTEM && (
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '50%',
            transform: 'translate(-50%, 0)',
            opacity: interpolate(
              frame,
              [PHASE.FULL_SYSTEM, PHASE.FULL_SYSTEM + 30],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
          }}
        >
          <span
            style={{
              fontSize: SIZES.label,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              color: COLORS.textMuted,
              letterSpacing: '0.2em',
            }}
          >
            UNIFIED WORKFLOW
          </span>
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene2C_ConnectionInsight;
