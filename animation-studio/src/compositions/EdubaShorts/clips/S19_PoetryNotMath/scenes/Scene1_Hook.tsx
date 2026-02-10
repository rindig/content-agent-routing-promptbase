import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  PANELS_IN: 0,
  SONNET_TYPE: 10,
  BEAUTIFUL_BADGE: 30,
  MATH_TYPE: 30,
  MATH_WRONG: 50,
  WHY_QUESTION: 65,
};

// ── Sonnet lines ──
const SONNET_LINES = [
  'The ocean speaks in silver tongues tonight,',
  'While moonlight paints the harbor stones in white,',
  'And every wave that breaks upon the shore',
  'Remembers tides that came and went before.',
];

// ── Chat Panel ──
const ChatPanel: React.FC<{
  frame: number;
  fps: number;
  title: string;
  dotColor: string;
  enterDelay: number;
  children: React.ReactNode;
}> = ({ frame, fps, title, dotColor, enterDelay, children }) => {
  const enterProgress = spring({
    frame: Math.max(0, frame - enterDelay),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const y = interpolate(enterProgress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        borderRadius: 16,
        padding: '20px 24px',
        opacity,
        transform: `translateY(${y}px)`,
        border: `1px solid ${COLORS.panelBorder}`,
        width: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: dotColor,
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 22,
            color: COLORS.textMuted,
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
};

// ── Typewriter text ──
const TypewriterLine: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  charsPerFrame: number;
  style?: React.CSSProperties;
}> = ({ text, frame, startFrame, charsPerFrame, style }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const visibleChars = Math.min(
    text.length,
    Math.floor(relFrame / charsPerFrame)
  );
  const displayed = text.slice(0, visibleChars);

  return (
    <div style={style}>
      {displayed}
      {visibleChars < text.length && (
        <span style={{ opacity: Math.sin(relFrame * 0.3) > 0 ? 1 : 0 }}>
          |
        </span>
      )}
    </div>
  );
};

// ── Badge ──
const Badge: React.FC<{
  text: string;
  color: string;
  icon: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, color, icon, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const progress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(progress, [0, 1], [0.3, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: color + '25',
        border: `1px solid ${color}60`,
        borderRadius: 20,
        padding: '6px 16px',
        transform: `scale(${scale})`,
        opacity,
        marginTop: 10,
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color,
          textTransform: 'none' as const,
          letterSpacing: 0,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sonnet lines appear staggered (5 frames apart, starting at SONNET_TYPE)
  const sonnetCharSpeed = 1.5; // frames per char

  // Math answer
  const mathTypingStart = BEATS.MATH_TYPE + 10; // after 10-frame typing indicator
  const mathText = '347 x 16 = 5,228';

  // Strikethrough animation
  const strikeRelFrame = frame - BEATS.MATH_WRONG;
  const strikeProgress =
    strikeRelFrame >= 0
      ? interpolate(strikeRelFrame, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  // Correct answer appearance
  const correctShow = frame >= BEATS.MATH_WRONG + 5;
  const correctProgress = correctShow
    ? spring({
        frame: frame - (BEATS.MATH_WRONG + 5),
        fps,
        config: SPRING_CONFIGS.snappy,
      })
    : 0;

  // "Why?" question
  const whyProgress = spring({
    frame: Math.max(0, frame - BEATS.WHY_QUESTION),
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const whyScale = interpolate(whyProgress, [0, 1], [0.5, 1]);
  const whyOpacity = interpolate(whyProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          gap: 24,
          padding: '0 16px',
        }}
      >
        {/* Top Chat — Creative Writing / Sonnet */}
        <ChatPanel
          frame={frame}
          fps={fps}
          title="CREATIVE WRITING"
          dotColor={COLORS.aiPurple}
          enterDelay={BEATS.PANELS_IN}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {SONNET_LINES.map((line, i) => (
              <TypewriterLine
                key={i}
                text={line}
                frame={frame}
                startFrame={BEATS.SONNET_TYPE + i * 5}
                charsPerFrame={sonnetCharSpeed}
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 24,
                  color: '#C4B5FD',
                  lineHeight: 1.5,
                }}
              />
            ))}
          </div>
          <Badge
            text="Beautiful"
            color={COLORS.solutionGreen}
            icon="✓"
            frame={frame}
            fps={fps}
            startFrame={BEATS.BEAUTIFUL_BADGE}
          />
        </ChatPanel>

        {/* Bottom Chat — Math Problem */}
        <ChatPanel
          frame={frame}
          fps={fps}
          title="MATH PROBLEM"
          dotColor={COLORS.errorRed}
          enterDelay={BEATS.PANELS_IN + 5}
        >
          {/* Typing indicator before math */}
          {frame >= BEATS.MATH_TYPE && frame < mathTypingStart && (
            <div style={{ display: 'flex', gap: 6, paddingLeft: 4 }}>
              {[0, 1, 2].map((i) => {
                const bounce = Math.sin(
                  (frame - BEATS.MATH_TYPE + i * 5) * 0.15
                );
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
          )}

          {/* Math answer */}
          {frame >= mathTypingStart && (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 32,
                  color: COLORS.textBody,
                  position: 'relative',
                  display: 'inline-block',
                }}
              >
                <TypewriterLine
                  text={mathText}
                  frame={frame}
                  startFrame={mathTypingStart}
                  charsPerFrame={1.5}
                  style={{ display: 'inline' }}
                />

                {/* Strikethrough over wrong answer */}
                {strikeRelFrame >= 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: 0,
                      width: `${strikeProgress * 100}px`,
                      height: 3,
                      backgroundColor: COLORS.errorRed,
                      transformOrigin: 'right center',
                    }}
                  />
                )}
              </div>

              {/* Correct answer */}
              {correctShow && (
                <div
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 32,
                    color: COLORS.solutionGreen,
                    opacity: correctProgress,
                    transform: `translateY(${interpolate(
                      correctProgress,
                      [0, 1],
                      [10, 0]
                    )}px)`,
                    marginTop: 8,
                  }}
                >
                  = 5,552
                </div>
              )}
            </div>
          )}

          <Badge
            text="Incorrect"
            color={COLORS.errorRed}
            icon="✕"
            frame={frame}
            fps={fps}
            startFrame={BEATS.MATH_WRONG + 8}
          />
        </ChatPanel>

        {/* "Why?" question */}
        {frame >= BEATS.WHY_QUESTION && (
          <div
            style={{
              opacity: whyOpacity,
              transform: `scale(${whyScale})`,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 72,
                color: '#FFFFFF',
              }}
            >
              Why
            </span>
            <span
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 72,
                color: COLORS.insightOrange,
                textShadow: `0 0 30px ${COLORS.glowGold}`,
              }}
            >
              ?
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
