import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start = 0, global offset 90) ──
const BEATS = {
  SPLIT_SCREEN: 0,
  CHATBOT_HEADER: 10,
  AGENT_HEADER: 20,
  CHATBOT_Q1: 40,
  CHATBOT_A1: 60,
  CHATBOT_FORGOT: 80,
  AGENT_Q1: 50,
  AGENT_THINKING: 70,
  AGENT_CHECK_CONTEXT: 75,
  AGENT_QUERY_DB: 85,
  AGENT_EMAIL: 95,
  CHATBOT_Q2: 95,
  AGENT_A1: 110,
  AGENT_REMEMBERS: 130,
  CHATBOT_DIM: 170,
  AGENT_GLOW: 170,
  CAPABILITY_PILLS: 190,
  SCENE_END: 270,
};

// ── Chat bubble ──
const ChatBubble: React.FC<{
  text: string;
  isUser: boolean;
  frame: number;
  fps: number;
  startFrame: number;
  fontSize?: number;
  dimmed?: boolean;
}> = ({ text, isUser, frame, fps, startFrame, fontSize = 32, dimmed = false }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const slideX = interpolate(progress, [0, 1], [isUser ? 60 : -60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        opacity: opacity * (dimmed ? 0.3 : 1),
        transform: `translateX(${slideX}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: isUser
            ? COLORS.techBlue + '30'
            : COLORS.bgSurfaceAlt,
          borderRadius: 12,
          padding: '10px 16px',
          maxWidth: '90%',
          border: `1px solid ${isUser ? COLORS.techBlue + '40' : COLORS.panelBorder}`,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize,
            color: COLORS.textBody,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// ── Thinking dots ──
const ThinkingDots: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0 || relFrame > 40) return null;

  const dots: number[] = [0, 1, 2];
  return (
    <div style={{ display: 'flex', gap: 6, paddingLeft: 4, marginTop: 4 }}>
      {dots.map((i) => {
        const bounce = Math.sin((relFrame + i * 5) * 0.3) * 4;
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: COLORS.aiPurple,
              transform: `translateY(${bounce}px)`,
              opacity: 0.8,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Floating capability label ──
const FloatingLabel: React.FC<{
  text: string;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, color, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [10, 0]);

  return (
    <span
      style={{
        ...TYPOGRAPHY.label,
        fontSize: 22,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        display: 'inline-block',
      }}
    >
      {text}
    </span>
  );
};

// ── Capability pill (for bottom-panel pipeline) ──
const CapabilityPill: React.FC<{
  label: string;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ label, color, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          backgroundColor: color + '25',
          border: `1px solid ${color}`,
          borderRadius: 20,
          padding: '6px 16px',
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

// ── Arrow connector ──
const ArrowDown: React.FC<{
  frame: number;
  startFrame: number;
  color: string;
}> = ({ frame, startFrame, color }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: drawProgress }}>
      <line x1={10} y1={2} x2={10} y2={14} stroke={color} strokeWidth={2} />
      <path d="M6 10 L10 16 L14 10" fill="none" stroke={color} strokeWidth={2} />
    </svg>
  );
};

// ── Main Scene ──
export const Scene2_TwoLanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel dimming for chatbot side
  const chatbotDim =
    frame >= BEATS.CHATBOT_DIM
      ? interpolate(frame - BEATS.CHATBOT_DIM, [0, 20], [1, 0.4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  // Agent glow
  const agentGlow =
    frame >= BEATS.AGENT_GLOW
      ? interpolate(frame - BEATS.AGENT_GLOW, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  // Header animations
  const chatbotHeaderProgress = spring({
    frame: frame - BEATS.CHATBOT_HEADER,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const agentHeaderProgress = spring({
    frame: frame - BEATS.AGENT_HEADER,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Divider
  const dividerOpacity = interpolate(
    frame,
    [BEATS.SPLIT_SCREEN + 5, BEATS.SPLIT_SCREEN + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const panelStyle: React.CSSProperties = {
    flex: 1,
    borderRadius: 12,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflow: 'hidden',
  };

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        {/* ── Top Panel: CHATBOT ── */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: COLORS.bgSurface,
            border: `1px solid ${COLORS.panelBorder}`,
            opacity: chatbotDim,
          }}
        >
          {/* Header */}
          {frame >= BEATS.CHATBOT_HEADER && (
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.textMuted,
                opacity: interpolate(chatbotHeaderProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(chatbotHeaderProgress, [0, 1], [15, 0])}px)`,
                marginBottom: 8,
              }}
            >
              CHATBOT
            </div>
          )}

          {/* Q1 */}
          <ChatBubble
            text="What's my order status?"
            isUser
            frame={frame}
            fps={fps}
            startFrame={BEATS.CHATBOT_Q1}
          />
          {/* A1 */}
          <ChatBubble
            text="Order #1234 shipped."
            isUser={false}
            frame={frame}
            fps={fps}
            startFrame={BEATS.CHATBOT_A1}
          />

          {/* FORGOT label */}
          {frame >= BEATS.CHATBOT_FORGOT && (
            <div style={{ textAlign: 'center', marginTop: 4 }}>
              <GlitchText
                startFrame={BEATS.CHATBOT_FORGOT}
                intensity={0.3}
                speed={5}
                enableShadows
                color={COLORS.errorRed}
                fontSize={28}
              >
                FORGOT
              </GlitchText>
            </div>
          )}

          {/* Q2 — same question again */}
          <ChatBubble
            text="What was my order status?"
            isUser
            frame={frame}
            fps={fps}
            startFrame={BEATS.CHATBOT_Q2}
            dimmed={frame >= BEATS.CHATBOT_DIM}
          />
          {frame >= BEATS.CHATBOT_Q2 + 15 && (
            <ChatBubble
              text="I don't have that information."
              isUser={false}
              frame={frame}
              fps={fps}
              startFrame={BEATS.CHATBOT_Q2 + 15}
              dimmed={frame >= BEATS.CHATBOT_DIM}
            />
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 2,
            backgroundColor: COLORS.panelBorder,
            opacity: dividerOpacity,
          }}
        />

        {/* ── Bottom Panel: AGENT ── */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: COLORS.bg,
            border: `1px solid ${COLORS.panelBorder}`,
            boxShadow: agentGlow > 0
              ? `0 0 ${20 * agentGlow}px ${COLORS.glowPurple}`
              : 'none',
          }}
        >
          {/* Header */}
          {frame >= BEATS.AGENT_HEADER && (
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.aiPurple,
                opacity: interpolate(agentHeaderProgress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(agentHeaderProgress, [0, 1], [15, 0])}px)`,
                marginBottom: 8,
              }}
            >
              AGENT
            </div>
          )}

          {/* Q1 */}
          <ChatBubble
            text="What's my order status?"
            isUser
            frame={frame}
            fps={fps}
            startFrame={BEATS.AGENT_Q1}
          />

          {/* Thinking dots */}
          <ThinkingDots frame={frame} startFrame={BEATS.AGENT_THINKING} />

          {/* Floating thought labels */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 2 }}>
            <FloatingLabel
              text="check context"
              color={COLORS.solutionGreen}
              frame={frame}
              fps={fps}
              startFrame={BEATS.AGENT_CHECK_CONTEXT}
            />
            <FloatingLabel
              text="query database"
              color={COLORS.techBlue}
              frame={frame}
              fps={fps}
              startFrame={BEATS.AGENT_QUERY_DB}
            />
            <FloatingLabel
              text="compose email"
              color={COLORS.insightOrange}
              frame={frame}
              fps={fps}
              startFrame={BEATS.AGENT_EMAIL}
            />
          </div>

          {/* Agent response */}
          <ChatBubble
            text="Order #1234 shipped Tuesday. I've sent you a tracking email."
            isUser={false}
            frame={frame}
            fps={fps}
            startFrame={BEATS.AGENT_A1}
            fontSize={30}
          />

          {/* REMEMBERS label + context indicator */}
          {frame >= BEATS.AGENT_REMEMBERS && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 26,
                  color: COLORS.solutionGreen,
                  opacity: interpolate(
                    spring({
                      frame: frame - BEATS.AGENT_REMEMBERS,
                      fps,
                      config: SPRING_CONFIGS.gentle,
                    }),
                    [0, 1],
                    [0, 1]
                  ),
                }}
              >
                REMEMBERS
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: COLORS.textMuted,
                  textTransform: 'none',
                  letterSpacing: 0,
                  opacity: interpolate(
                    frame - BEATS.AGENT_REMEMBERS,
                    [10, 20],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                }}
              >
                Session context: 3 turns retained
              </span>
            </div>
          )}

          {/* Capability pills pipeline */}
          {frame >= BEATS.CAPABILITY_PILLS && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 4,
                marginTop: 8,
              }}
            >
              <CapabilityPill
                label="Memory"
                color={COLORS.solutionGreen}
                frame={frame}
                fps={fps}
                startFrame={BEATS.CAPABILITY_PILLS}
              />
              <ArrowDown
                frame={frame}
                startFrame={BEATS.CAPABILITY_PILLS + 8}
                color={COLORS.textDim}
              />
              <CapabilityPill
                label="Tools"
                color={COLORS.techBlue}
                frame={frame}
                fps={fps}
                startFrame={BEATS.CAPABILITY_PILLS + 8}
              />
              <ArrowDown
                frame={frame}
                startFrame={BEATS.CAPABILITY_PILLS + 16}
                color={COLORS.textDim}
              />
              <CapabilityPill
                label="Decisions"
                color={COLORS.insightOrange}
                frame={frame}
                fps={fps}
                startFrame={BEATS.CAPABILITY_PILLS + 16}
              />
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
