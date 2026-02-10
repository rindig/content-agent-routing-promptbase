import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  delay?: number;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  startFrame?: number;
  messageStagger?: number;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  startFrame = 0,
  messageStagger = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Window entrance
  const windowProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const windowOpacity = interpolate(windowProgress, [0, 1], [0, 1]);
  const windowScale = interpolate(windowProgress, [0, 1], [0.97, 1]);

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        borderRadius: 16,
        padding: 24,
        opacity: windowOpacity,
        transform: `scale(${windowScale})`,
        border: `1px solid ${COLORS.panelBorder}`,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.solutionGreen }} />
        <span style={{ ...TYPOGRAPHY.label, fontSize: 22, color: COLORS.textMuted }}>
          AI ASSISTANT
        </span>
      </div>

      {/* Messages */}
      {messages.map((msg, i) => {
        const msgStart = (msg.delay ?? i * messageStagger) + 10;
        const msgProgress = spring({
          frame: relativeFrame - msgStart,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        if (relativeFrame < msgStart) return null;

        const msgOpacity = interpolate(msgProgress, [0, 1], [0, 1]);
        const msgY = interpolate(msgProgress, [0, 1], [15, 0]);
        const isUser = msg.role === 'user';

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              opacity: msgOpacity,
              transform: `translateY(${msgY}px)`,
            }}
          >
            <div
              style={{
                backgroundColor: isUser ? COLORS.techBlue + '30' : COLORS.bgSurfaceAlt,
                borderRadius: 12,
                padding: '14px 20px',
                maxWidth: '85%',
                border: `1px solid ${isUser ? COLORS.techBlue + '40' : COLORS.panelBorder}`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 28,
                  color: COLORS.textBody,
                }}
              >
                {msg.text}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing indicator (shows after last message) */}
      {(() => {
        const lastMsgStart =
          messages.length > 0
            ? (messages[messages.length - 1].delay ?? (messages.length - 1) * messageStagger) + 10
            : 0;
        const typingStart = lastMsgStart + 20;

        if (relativeFrame < typingStart) return null;

        const dotCount = 3;
        return (
          <div style={{ display: 'flex', gap: 6, paddingLeft: 8 }}>
            {Array.from({ length: dotCount }).map((_, i) => {
              const bounce = Math.sin((relativeFrame - typingStart + i * 5) * 0.15);
              return (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: COLORS.textMuted,
                    transform: `translateY(${bounce * 4}px)`,
                    opacity: 0.6,
                  }}
                />
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};
