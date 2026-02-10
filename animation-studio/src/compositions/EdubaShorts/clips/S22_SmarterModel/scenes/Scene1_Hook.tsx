import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText, GlitchBurst, BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  BANNER_IN: 0,
  HEADLINE_TYPE: 10,
  QUESTION_MARK: 30,
  CRACK: 45,
  SUBTITLE: 60,
};

// ── Headline characters for typewriter ──
const HEADLINE_TEXT = 'NEW MODEL: 50% SMARTER';
const CHARS_PER_FRAME = 2;

// ── Fracture lines (SVG paths) ──
const FRACTURE_LINES = [
  { x1: 80, y1: 0, x2: 340, y2: 95 },
  { x1: 500, y1: 5, x2: 700, y2: 90 },
  { x1: 200, y1: 90, x2: 600, y2: 10 },
];

// ── Banner component ──
const HeadlineBanner: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.BANNER_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const bannerY = interpolate(enterProgress, [0, 1], [-20, 0]);
  const bannerOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Typewriter: how many chars visible
  const typeFrame = frame - BEATS.HEADLINE_TYPE;
  const charsVisible =
    typeFrame >= 0 ? Math.min(Math.floor(typeFrame / CHARS_PER_FRAME), HEADLINE_TEXT.length) : 0;
  const visibleText = HEADLINE_TEXT.slice(0, charsVisible);

  // Crack lines
  const crackFrame = frame - BEATS.CRACK;

  return (
    <div
      style={{
        position: 'relative',
        width: 860,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        borderTop: `2px solid ${COLORS.techBlue}`,
        padding: 32,
        opacity: bannerOpacity,
        transform: `translateY(${bannerY}px)`,
      }}
    >
      {/* Headline text */}
      <div
        style={{
          ...TYPOGRAPHY.hero,
          fontSize: 64,
          color: COLORS.textPrimary,
          textAlign: 'center',
          minHeight: 76,
        }}
      >
        {visibleText.split('').map((char, i) => {
          // Determine color for specific substrings
          const idx = i;
          const is50Percent = idx >= 11 && idx <= 13; // "50%"
          const isSmarter = idx >= 15; // "SMARTER"

          return (
            <span
              key={i}
              style={{
                color: is50Percent
                  ? COLORS.techBlue
                  : isSmarter
                    ? COLORS.aiPurple
                    : COLORS.textPrimary,
              }}
            >
              {char}
            </span>
          );
        })}
        {/* Blinking cursor during typing */}
        {charsVisible < HEADLINE_TEXT.length && charsVisible > 0 && (
          <span
            style={{
              color: COLORS.textMuted,
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
            }}
          >
            |
          </span>
        )}
      </div>

      {/* Fracture lines (SVG overlay) */}
      {crackFrame > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 860 100"
          preserveAspectRatio="none"
        >
          {FRACTURE_LINES.map((line, i) => {
            const lineLength = Math.sqrt(
              (line.x2 - line.x1) ** 2 + (line.y2 - line.y1) ** 2
            );
            const drawProgress = interpolate(
              crackFrame,
              [i * 3, i * 3 + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const dashOffset = lineLength * (1 - drawProgress);

            return (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1.5}
                strokeDasharray={lineLength}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

// ── Question Mark ──
const QuestionMark: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.QUESTION_MARK;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.3, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Pulsing glow
  const glowPulse = interpolate(
    Math.sin(frame * (Math.PI / 15)),
    [-1, 1],
    [0.2, 0.4]
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 20px rgba(245,158,11,${glowPulse}))`,
        marginTop: 16,
      }}
    >
      <GlitchText
        startFrame={BEATS.QUESTION_MARK}
        intensity={0.6}
        speed={4}
        enableShadows
        color={COLORS.insightOrange}
        fontSize={96}
      >
        ?
      </GlitchText>
    </div>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // GlitchBurst on SMARTER text (at crack beat)
  const showGlitchBurst = frame >= BEATS.CRACK;

  // Subtitle
  const showSubtitle = frame >= BEATS.SUBTITLE;

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
          gap: 24,
        }}
      >
        {/* Headline Banner */}
        <HeadlineBanner frame={frame} fps={fps} />

        {/* Glitch burst overlay for SMARTER text */}
        {showGlitchBurst && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -80%)',
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          >
            <GlitchBurst
              startFrame={BEATS.CRACK}
              burstInterval={90}
              burstDuration={8}
              fontSize={64}
            >
              SMARTER
            </GlitchBurst>
          </div>
        )}

        {/* Question Mark */}
        <QuestionMark frame={frame} fps={fps} />

        {/* Subtitle */}
        {showSubtitle && (
          <div
            style={{
              maxWidth: 860,
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            <BlurText
              startFrame={BEATS.SUBTITLE}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={10}
              distance={30}
              fontSize={44}
              fontWeight={400}
              color={COLORS.textBody}
            >
              What does that actually mean?
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
