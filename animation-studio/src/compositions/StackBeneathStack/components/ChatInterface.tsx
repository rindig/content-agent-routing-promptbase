import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

type ChatInterfaceProps = {
  userMessage: string;
  aiResponse: string;
  userMessageStartFrame: number;
  typingIndicatorStartFrame: number;
  aiResponseStartFrame: number;
  charDelay?: number;
  style?: React.CSSProperties;
};

// Blinking cursor component
const Cursor: React.FC<{ frame: number; visible: boolean }> = ({ frame, visible }) => {
  if (!visible) return null;

  const blinkCycle = 16; // frames per blink cycle
  const opacity = interpolate(
    frame % blinkCycle,
    [0, blinkCycle / 2, blinkCycle],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span
      style={{
        opacity,
        color: COLORS.primary,
        marginLeft: 2,
      }}
    >
      |
    </span>
  );
};

// Typing indicator (three pulsing dots)
const TypingIndicator: React.FC<{ frame: number; visible: boolean }> = ({ frame, visible }) => {
  if (!visible) return null;

  const dotStyle = (delay: number): React.CSSProperties => {
    const cycle = 30; // frames per pulse cycle
    const adjustedFrame = (frame + delay) % cycle;
    const scale = interpolate(adjustedFrame, [0, cycle / 2, cycle], [1, 1.3, 1]);
    const opacity = interpolate(adjustedFrame, [0, cycle / 2, cycle], [0.5, 1, 0.5]);

    return {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: COLORS.textMuted,
      transform: `scale(${scale})`,
      opacity,
    };
  };

  return (
    <div style={{ display: 'flex', gap: 6, padding: '12px 16px' }}>
      <div style={dotStyle(0)} />
      <div style={dotStyle(6)} />
      <div style={dotStyle(12)} />
    </div>
  );
};

// Get typed text based on current frame
const getTypedText = (
  frame: number,
  text: string,
  startFrame: number,
  charDelay: number
): string => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return '';

  const charsToShow = Math.floor(adjustedFrame / charDelay);
  return text.slice(0, Math.min(charsToShow, text.length));
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userMessage,
  aiResponse,
  userMessageStartFrame,
  typingIndicatorStartFrame,
  aiResponseStartFrame,
  charDelay = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine what to show based on frame
  const typedUserMessage = getTypedText(frame, userMessage, userMessageStartFrame, charDelay);
  const isUserTypingComplete = typedUserMessage.length === userMessage.length;
  const showTypingIndicator = frame >= typingIndicatorStartFrame && frame < aiResponseStartFrame;
  const showAiResponse = frame >= aiResponseStartFrame;

  // Container entrance animation
  const containerEntrance = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const containerOpacity = interpolate(containerEntrance, [0, 1], [0, 1]);
  const containerTranslateY = interpolate(containerEntrance, [0, 1], [20, 0]);

  // AI response entrance
  const aiResponseEntrance = spring({
    frame: frame - aiResponseStartFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const aiResponseOpacity = showAiResponse ? interpolate(aiResponseEntrance, [0, 1], [0, 1]) : 0;
  const aiResponseTranslateY = showAiResponse ? interpolate(aiResponseEntrance, [0, 1], [10, 0]) : 10;

  return (
    <div
      style={{
        width: 800,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        border: `1px solid ${COLORS.surfaceAlt}`,
        overflow: 'hidden',
        opacity: containerOpacity,
        transform: `translateY(${containerTranslateY}px)`,
        ...style,
      }}
    >
      {/* Chat messages area */}
      <div style={{ padding: 24, minHeight: 200 }}>
        {/* User message */}
        {frame >= userMessageStartFrame && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.primary,
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '16px 16px 4px 16px',
                maxWidth: '70%',
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 16,
              }}
            >
              {typedUserMessage}
              <Cursor frame={frame} visible={!isUserTypingComplete} />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {showTypingIndicator && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                backgroundColor: COLORS.surfaceAlt,
                borderRadius: '16px 16px 16px 4px',
              }}
            >
              <TypingIndicator frame={frame} visible={true} />
            </div>
          </div>
        )}

        {/* AI response with code block */}
        {showAiResponse && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              opacity: aiResponseOpacity,
              transform: `translateY(${aiResponseTranslateY}px)`,
            }}
          >
            <div
              style={{
                backgroundColor: COLORS.surfaceAlt,
                padding: 16,
                borderRadius: '16px 16px 16px 4px',
                maxWidth: '85%',
              }}
            >
              {/* Code block */}
              <div
                style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 16,
                }}
              >
                <span style={{ color: COLORS.syntaxFunction }}>print</span>
                <span style={{ color: COLORS.text }}>(</span>
                <span style={{ color: COLORS.syntaxString }}>"Hello, World!"</span>
                <span style={{ color: COLORS.text }}>)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input field area */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.surfaceAlt}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: COLORS.background,
            borderRadius: 8,
            padding: '10px 14px',
            color: COLORS.textMuted,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 14,
          }}
        >
          {frame < userMessageStartFrame ? (
            <>
              Message...
              <Cursor frame={frame} visible={true} />
            </>
          ) : (
            'Message...'
          )}
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#FFFFFF', fontSize: 18 }}>↑</span>
        </div>
      </div>
    </div>
  );
};
