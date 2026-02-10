import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  CHAT_IN: 0,
  USER_MSG: 10,
  TYPING: 25,
  AI_RESPONSE: 45,
  WRONG_STAMP: 65,
  CORRECTION: 80,
};

// ── Typing dots ──
const TypingIndicator: React.FC<{ frame: number }> = ({ frame }) => {
  const dots = [0, 1, 2] as const;
  return (
    <div style={{ display: 'flex', gap: 8, padding: '14px 20px' }}>
      {dots.map((i) => {
        const phase = ((frame - BEATS.TYPING + i * 4) % 20) / 20;
        const opacity = interpolate(
          Math.sin(phase * Math.PI * 2),
          [-1, 1],
          [0.3, 1.0]
        );
        return (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: COLORS.textMuted,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Typewriter text ──
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  frame: number;
  charPerFrame?: number;
}> = ({ text, startFrame, frame, charPerFrame = 1 }) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;
  const chars = Math.min(Math.floor(rel * charPerFrame), text.length);
  return <>{text.slice(0, chars)}</>;
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chat window entrance
  const chatProgress = spring({
    frame: frame - BEATS.CHAT_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const chatOpacity = interpolate(chatProgress, [0, 1], [0, 1]);
  const chatScale = interpolate(chatProgress, [0, 1], [0.95, 1]);

  // User message entrance
  const userMsgProgress = spring({
    frame: Math.max(0, frame - BEATS.USER_MSG),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const userMsgOpacity = interpolate(userMsgProgress, [0, 1], [0, 1]);
  const userMsgX = interpolate(userMsgProgress, [0, 1], [30, 0]);

  // AI response entrance
  const aiProgress = spring({
    frame: Math.max(0, frame - BEATS.AI_RESPONSE),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const aiOpacity = interpolate(aiProgress, [0, 1], [0, 1]);
  const aiX = interpolate(aiProgress, [0, 1], [-30, 0]);

  // WRONG stamp entrance
  const stampProgress = spring({
    frame: Math.max(0, frame - BEATS.WRONG_STAMP),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const stampScale = interpolate(stampProgress, [0, 1], [2.5, 1]);
  const stampOpacity = interpolate(stampProgress, [0, 1], [0, 1]);

  // Screen shake after stamp
  const shakeRel = frame - BEATS.WRONG_STAMP;
  const shakeX =
    shakeRel >= 0 && shakeRel <= 10
      ? Math.sin(shakeRel * 1.8) * interpolate(shakeRel, [0, 10], [4, 0])
      : 0;

  // Correction text
  const correctionProgress = spring({
    frame: Math.max(0, frame - BEATS.CORRECTION),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const correctionOpacity = interpolate(correctionProgress, [0, 1], [0, 1]);

  // Show/hide typing dots
  const showTyping = frame >= BEATS.TYPING && frame < BEATS.AI_RESPONSE;
  const showAI = frame >= BEATS.AI_RESPONSE;
  const showStamp = frame >= BEATS.WRONG_STAMP;
  const showCorrection = frame >= BEATS.CORRECTION;

  const AI_TEXT = 'The bicycle was invented in 1817 by Karl von Drais.';

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Chat Window */}
        <div
          style={{
            width: 860,
            maxWidth: '100%',
            backgroundColor: COLORS.bgSurface,
            borderRadius: 16,
            padding: 24,
            opacity: chatOpacity,
            transform: `scale(${chatScale})`,
            border: `1px solid ${COLORS.panelBorder}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: COLORS.solutionGreen,
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
              }}
            >
              AI ASSISTANT
            </span>
          </div>

          {/* User message */}
          {frame >= BEATS.USER_MSG && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                opacity: userMsgOpacity,
                transform: `translateX(${userMsgX}px)`,
              }}
            >
              <div
                style={{
                  backgroundColor: `${COLORS.techBlue}26`,
                  borderRadius: '12px 12px 0 12px',
                  padding: '14px 20px',
                  maxWidth: '85%',
                  border: `1px solid ${COLORS.techBlue}40`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 32,
                    color: COLORS.textBody,
                    fontWeight: 400,
                  }}
                >
                  What year was the bicycle invented?
                </span>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {showTyping && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  backgroundColor: COLORS.bgSurfaceAlt,
                  borderRadius: '12px 12px 12px 0',
                  border: `1px solid ${COLORS.panelBorder}`,
                }}
              >
                <TypingIndicator frame={frame} />
              </div>
            </div>
          )}

          {/* AI response */}
          {showAI && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                opacity: aiOpacity,
                transform: `translateX(${aiX}px)`,
              }}
            >
              <div
                style={{
                  backgroundColor: COLORS.bgSurfaceAlt,
                  borderRadius: '12px 12px 12px 0',
                  padding: '14px 20px',
                  maxWidth: '85%',
                  border: `1px solid ${COLORS.panelBorder}`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 32,
                    color: COLORS.textBody,
                    fontWeight: 400,
                  }}
                >
                  <TypewriterText
                    text={AI_TEXT}
                    startFrame={BEATS.AI_RESPONSE}
                    frame={frame}
                    charPerFrame={1}
                  />
                </span>
              </div>
            </div>
          )}

          {/* WRONG stamp */}
          {showStamp && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(-12deg) scale(${stampScale})`,
                opacity: stampOpacity,
                zIndex: 10,
              }}
            >
              <GlitchText
                startFrame={BEATS.WRONG_STAMP}
                intensity={0.8}
                speed={3}
                enableShadows
                color={COLORS.errorRed}
                fontSize={64}
              >
                WRONG
              </GlitchText>
            </div>
          )}
        </div>

        {/* Correction text */}
        {showCorrection && (
          <div
            style={{
              marginTop: 20,
              opacity: correctionOpacity,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                textTransform: 'none',
                letterSpacing: 0,
                fontWeight: 400,
              }}
            >
              (It was 1860s -- this was a running machine)
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
