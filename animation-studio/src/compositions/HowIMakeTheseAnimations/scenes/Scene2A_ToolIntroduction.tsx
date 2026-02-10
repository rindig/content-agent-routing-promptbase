/**
 * Scene 2A: Tool Introduction
 * [0:45 - 1:10] — 750 frames
 *
 * "Let me start with what you need. Claude Code, which is Anthropic's command
 *  line tool for Claude that works inside your code editor. An IDE like VS Code
 *  or Cursor with the Claude plugin. Remotion, which is a React framework that
 *  turns code into video. And CapCut or any video editor for the finishing work."
 *
 * Visual: Tool cards appearing with brief identity animations
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
  SECTION_HEADER: 0,
  HEADER_SETTLE: 45,
  CLAUDE_CARD: 45,
  IDE_CARD: 195,
  REMOTION_CARD: 345,
  CAPCUT_CARD: 495,
  ALL_SETTLE: 645,
  EXIT_START: 650,
  EXIT_END: 720,
};

// Tool colors
const TOOL_COLORS = {
  claude: '#D97706',    // Anthropic orange
  ide: '#0EA5E9',       // Sky blue
  remotion: '#3B82F6',  // Blue
  capcut: '#10B981',    // Green
};

// SVG Icons
const TerminalIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M6 9L10 12L6 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 15H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CodeEditorIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="18" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M2 7H22" stroke={color} strokeWidth="1.5" />
    <circle cx="5" cy="5" r="1" fill={COLORS.time} />
    <circle cx="8" cy="5" r="1" fill="#F59E0B" />
    <circle cx="11" cy="5" r="1" fill={COLORS.refine} />
    <path d="M6 11H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    <path d="M6 14H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path d="M6 17H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const ReactVideoIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* React atom */}
    <ellipse cx="8" cy="12" rx="4" ry="7" stroke={color} strokeWidth="1.5" transform="rotate(30 8 12)" opacity="0.6" />
    <ellipse cx="8" cy="12" rx="4" ry="7" stroke={color} strokeWidth="1.5" transform="rotate(-30 8 12)" opacity="0.6" />
    <ellipse cx="8" cy="12" rx="4" ry="7" stroke={color} strokeWidth="1.5" opacity="0.6" />
    <circle cx="8" cy="12" r="1.5" fill={color} />
    {/* Arrow */}
    <path d="M14 12H20M18 9L21 12L18 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TimelineIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" />
    <rect x="4" y="8" width="8" height="3" rx="1" fill={color} opacity="0.6" />
    <rect x="6" y="13" width="10" height="3" rx="1" fill={color} opacity="0.4" />
    <path d="M15 4V20" stroke={color} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
  </svg>
);

// Tool Card Component
interface ToolCardProps {
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  icon: React.ReactNode;
  startFrame: number;
  index: number;
  isSettled: boolean;
  settledPosition: { x: number; y: number };
  terminalContent?: React.ReactNode;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  subtitle,
  badge,
  color,
  icon,
  startFrame,
  index,
  isSettled,
  settledPosition,
  terminalContent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Settle animation (move to final position)
  const settleProgress = spring({
    frame: frame - PHASE.ALL_SETTLE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Exit animation (fade out and move up)
  const exitProgress = interpolate(
    frame,
    [PHASE.EXIT_START, PHASE.EXIT_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const opacity = entranceOpacity * exitOpacity;

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.9]);
  const finalScale = scale * exitScale;
  const entranceY = interpolate(entrance, [0, 1], [40, 0]);

  // Exit movement (move up during exit)
  const exitMoveY = interpolate(exitProgress, [0, 1], [0, -100]);

  // Position: center during entrance, then move to settled position
  const x = isSettled ? interpolate(settleProgress, [0, 1], [0, settledPosition.x]) : 0;
  const y = isSettled
    ? interpolate(settleProgress, [0, 1], [entranceY, settledPosition.y + entranceY])
    : entranceY;

  // Floating animation once settled (disabled during exit)
  const floatOffset = isSettled && settleProgress > 0.5 && exitProgress < 0.3
    ? Math.sin((frame + index * 20) * 0.04) * 4
    : 0;

  // Corner bracket pulse
  const pulseOpacity = Math.sin(frame * 0.06 + index * 0.5) * 0.15 + 0.6;

  // Scan line
  const scanPosition = ((frame % 90) / 90) * 100;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        width: 340,
        height: 200,
        backgroundColor: COLORS.surface,
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: '20px 28px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        opacity,
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y + floatOffset + exitMoveY}px)) scale(${finalScale})`,
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: pulseOpacity }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: pulseOpacity }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: pulseOpacity }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: pulseOpacity }} />

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanPosition}%`,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
        }}
      />

      {/* Type badge */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 28,
          padding: '4px 10px',
          backgroundColor: color,
          borderRadius: 4,
          fontSize: 11,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontWeight: 700,
          color: COLORS.background,
          letterSpacing: '0.05em',
        }}
      >
        {badge}
      </div>

      {/* Icon and content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginTop: 8 }}>
        <div style={{ opacity: 0.9 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: SIZES.label,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 600,
              color: COLORS.text,
              marginBottom: 6,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
            }}
          >
            {subtitle}
          </div>
          {terminalContent && (
            <div style={{ marginTop: 12 }}>{terminalContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Terminal prompt animation for Claude card
const TerminalPrompt: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;

  const promptVisible = relativeFrame > 30;
  const textProgress = interpolate(relativeFrame, [30, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textLength = Math.floor(textProgress * 6); // "claude" has 6 chars
  const cursorBlink = Math.floor(frame * 0.1) % 2 === 0;

  if (!promptVisible) return null;

  return (
    <div
      style={{
        fontFamily: TYPOGRAPHY.code.fontFamily,
        fontSize: 16,
        color: COLORS.textMuted,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <span style={{ color: TOOL_COLORS.claude }}>$</span>
      <span style={{ color: COLORS.text }}>{"claude".slice(0, textLength)}</span>
      <span style={{ opacity: cursorBlink ? 1 : 0, color: COLORS.text }}>▋</span>
    </div>
  );
};

export const Scene2A_ToolIntroduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section header animation
  const headerEntrance = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const headerOpacity = interpolate(headerEntrance, [0, 1], [0, 1]);
  const headerX = interpolate(headerEntrance, [0, 1], [-60, 0]);

  // Underline draw animation
  const underlineProgress = spring({
    frame: frame - 15,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // "01" indicator
  const indicatorOpacity = interpolate(
    frame,
    [20, 40],
    [0, 0.6],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Header fades and moves completely off-screen as cards appear
  const headerFade = interpolate(
    frame,
    [PHASE.CLAUDE_CARD, PHASE.REMOTION_CARD],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Move header completely off-screen (top: 120px, so need -300px to fully exit)
  const headerMove = interpolate(
    frame,
    [PHASE.CLAUDE_CARD, PHASE.REMOTION_CARD],
    [0, -350],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Is settled (after all cards have appeared)
  const isSettled = frame >= PHASE.ALL_SETTLE;

  // Settled positions (2x2 grid)
  const settledPositions = [
    { x: -200, y: -110 },  // Claude: top-left
    { x: 200, y: -110 },   // IDE: top-right
    { x: -200, y: 110 },   // Remotion: bottom-left
    { x: 200, y: 110 },    // CapCut: bottom-right
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      {/* Section header */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 120,
          opacity: headerOpacity * headerFade,
          transform: `translateX(${headerX}px) translateY(${headerMove}px)`,
        }}
      >
        <div
          style={{
            fontSize: SIZES.title,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: '0.05em',
          }}
        >
          THE TOOLS
        </div>
        {/* Underline */}
        <svg width="200" height="4" style={{ marginTop: 8 }}>
          <line
            x1={0}
            y1={2}
            x2={200 * underlineProgress}
            y2={2}
            stroke={COLORS.build}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Section indicator "01" */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          right: 80,
          opacity: indicatorOpacity * headerFade,
          transform: `translateY(${headerMove}px)`,
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontWeight: 700,
            color: COLORS.build,
            opacity: 0.4,
          }}
        >
          01
        </span>
      </div>

      {/* Tool Cards */}
      <ToolCard
        title="Claude Code"
        subtitle="AI in your editor"
        badge="CLI"
        color={TOOL_COLORS.claude}
        icon={<TerminalIcon color={TOOL_COLORS.claude} size={40} />}
        startFrame={PHASE.CLAUDE_CARD}
        index={0}
        isSettled={isSettled}
        settledPosition={settledPositions[0]}
        terminalContent={<TerminalPrompt startFrame={PHASE.CLAUDE_CARD} />}
      />

      <ToolCard
        title="VS Code / Cursor"
        subtitle="Your workspace"
        badge="IDE"
        color={TOOL_COLORS.ide}
        icon={<CodeEditorIcon color={TOOL_COLORS.ide} size={40} />}
        startFrame={PHASE.IDE_CARD}
        index={1}
        isSettled={isSettled}
        settledPosition={settledPositions[1]}
      />

      <ToolCard
        title="Remotion"
        subtitle="Code → Video"
        badge="FRAMEWORK"
        color={TOOL_COLORS.remotion}
        icon={<ReactVideoIcon color={TOOL_COLORS.remotion} size={40} />}
        startFrame={PHASE.REMOTION_CARD}
        index={2}
        isSettled={isSettled}
        settledPosition={settledPositions[2]}
      />

      <ToolCard
        title="CapCut"
        subtitle="Final polish"
        badge="EDITOR"
        color={TOOL_COLORS.capcut}
        icon={<TimelineIcon color={TOOL_COLORS.capcut} size={40} />}
        startFrame={PHASE.CAPCUT_CARD}
        index={3}
        isSettled={isSettled}
        settledPosition={settledPositions[3]}
      />

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

export default Scene2A_ToolIntroduction;
