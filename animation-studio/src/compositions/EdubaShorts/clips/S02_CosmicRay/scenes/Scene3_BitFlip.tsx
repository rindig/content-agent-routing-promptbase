import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { CountUp, GlitchBurst, FocusBlur } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  PANEL_IN: 5,
  COUNTER_LABEL: 10,
  COUNTER_START: 15,
  VOTE_JUMP: 80,
  SCREEN_SHAKE: 80,
  RED_FLASH: 80,
  GLITCH_BURST: 80,
  DIFFERENCE_IN: 95,
  POWER_LABEL: 105,
  BINARY_TRANSITION: 130,
  BINARY_DIGITS_IN: 135,
  BIT_HIGHLIGHT: 160,
  BINARY_OUT: 200,
  HERO_NUMBER: 210,
  HERO_LABEL: 225,
  HOLD: 260,
};

/** Binary representation of a number as 16-bit string with spaces every 4 */
const toBinary16 = (n: number): string[] => {
  const bits = n.toString(2).padStart(16, '0');
  return bits.split('');
};

const BEFORE_VALUE = 12345;
const AFTER_VALUE = 16441; // 12345 + 4096
const BEFORE_BITS = toBinary16(BEFORE_VALUE);
const AFTER_BITS = toBinary16(AFTER_VALUE);

// Find the flipped bit index (bit 12 from right = index 3 from left in 16-bit)
const FLIPPED_BIT_INDEX = BEFORE_BITS.findIndex(
  (b, i) => b !== AFTER_BITS[i],
);

/** Single binary digit with spring entrance */
const BinaryDigit: React.FC<{
  digit: string;
  index: number;
  startFrame: number;
  isFlipped: boolean;
  isAfterRow: boolean;
  frame: number;
  fps: number;
}> = ({ digit, index, startFrame, isFlipped, isAfterRow, frame, fps }) => {
  const digitStart = startFrame + index * 2;
  const digitSpring = spring({
    frame: frame - digitStart,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const opacity = interpolate(
    frame,
    [digitStart, digitStart + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Pulsing for the flipped bit in the "after" row
  const pulseScale =
    isFlipped && isAfterRow && frame > digitStart + 20
      ? 1.0 + 0.3 * Math.abs(Math.sin(((frame - digitStart) * Math.PI) / 30))
      : 1.0;

  const isHighlighted = isFlipped && isAfterRow;

  return (
    <span
      style={{
        display: 'inline-block',
        ...TYPOGRAPHY.code,
        fontSize: 36,
        color: isHighlighted ? COLORS.errorRed : COLORS.textBody,
        opacity,
        transform: `scale(${digitSpring * pulseScale})`,
        textShadow: isHighlighted
          ? `0 0 12px rgba(239,68,68,0.6)`
          : 'none',
        fontWeight: isHighlighted ? 700 : 400,
        // Add spacing every 4 bits
        marginRight: (index + 1) % 4 === 0 && index < 15 ? 12 : 2,
      }}
    >
      {digit}
    </span>
  );
};

export const Scene3_BitFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Panel entrance ---
  const panelSpring = spring({
    frame: frame - BEATS.PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelOpacity = interpolate(panelSpring, [0, 1], [0, 1]);
  const panelY = interpolate(panelSpring, [0, 1], [30, 0]);

  // --- Screen shake on vote jump ---
  const isShaking = frame >= BEATS.SCREEN_SHAKE && frame < BEATS.SCREEN_SHAKE + 10;
  const shakeProgress = isShaking
    ? (frame - BEATS.SCREEN_SHAKE) / 10
    : 0;
  const shakeX = isShaking
    ? Math.sin(frame * 1.5) * 4 * (1 - shakeProgress)
    : 0;

  // --- Red flash overlay ---
  const redFlashOpacity = interpolate(
    frame,
    [BEATS.RED_FLASH, BEATS.RED_FLASH + 10],
    [0.15, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Vote counter phase: show CountUp before jump, static after ---
  const showCountUp = frame < BEATS.VOTE_JUMP;
  const showJumpedValue =
    frame >= BEATS.VOTE_JUMP && frame < BEATS.BINARY_TRANSITION;

  // --- Difference indicator ---
  const showDifference =
    frame >= BEATS.DIFFERENCE_IN && frame < BEATS.BINARY_TRANSITION;

  // --- Binary display ---
  const showBinary =
    frame >= BEATS.BINARY_TRANSITION && frame < BEATS.BINARY_OUT;

  // Binary fade-in
  const binaryOpacity = interpolate(
    frame,
    [BEATS.BINARY_TRANSITION, BEATS.BINARY_TRANSITION + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Binary fade-out
  const binaryFadeOut = interpolate(
    frame,
    [BEATS.BINARY_OUT, BEATS.BINARY_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Highlight column for flipped bit ---
  const highlightOpacity = interpolate(
    frame,
    [BEATS.BIT_HIGHLIGHT, BEATS.BIT_HIGHLIGHT + 10],
    [0, 0.1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // --- Hero 4096 number ---
  const showHero = frame >= BEATS.HERO_NUMBER;
  const heroFadeIn = interpolate(
    frame,
    [BEATS.HERO_NUMBER, BEATS.HERO_NUMBER + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Hero pulse during hold
  const heroScale =
    frame >= BEATS.HOLD
      ? Math.sin(frame * 0.08) * 0.02 + 1
      : 1;

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={10}>
      {/* Red flash overlay */}
      {frame >= BEATS.RED_FLASH && frame < BEATS.RED_FLASH + 10 && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.errorRed,
            opacity: redFlashOpacity,
            zIndex: 10,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: LAYOUT.safePadding,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Vote Counter Panel */}
        {(showCountUp || showJumpedValue) && (
          <div
            style={{
              backgroundColor: COLORS.bgSurface,
              borderRadius: 16,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: '32px 48px',
              width: 800,
              opacity: panelOpacity,
              transform: `translateY(${panelY}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* Counter header */}
            {frame >= BEATS.COUNTER_LABEL && (
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.textMuted}
                startFrame={BEATS.COUNTER_LABEL}
                springPreset="gentle"
                entrance="fade"
                align="center"
              >
                VOTE COUNT -- CANDIDATE X
              </AnimatedText>
            )}

            {/* Ticking counter */}
            {showCountUp && (
              <CountUp
                from={0}
                to={BEFORE_VALUE}
                startFrame={BEATS.COUNTER_START}
                duration={65}
                fontSize={72}
                color={COLORS.textPrimary}
                separator=","
                useSpring
              />
            )}

            {/* Jumped value with glitch burst */}
            {showJumpedValue && (
              <GlitchBurst
                startFrame={BEATS.GLITCH_BURST}
                burstDuration={15}
                burstInterval={300}
                intensity={0.8}
                color={COLORS.textPrimary}
                fontSize={72}
                fontWeight={700}
                fontFamily={TYPOGRAPHY.code.fontFamily}
              >
                16,441
              </GlitchBurst>
            )}

            {/* Difference indicator */}
            {showDifference && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AnimatedText
                  variant="title"
                  size={64}
                  color={COLORS.errorRed}
                  startFrame={BEATS.DIFFERENCE_IN}
                  springPreset="bouncy"
                  entrance="scale"
                  align="center"
                  style={{ fontWeight: 700 }}
                >
                  +4,096
                </AnimatedText>
                {frame >= BEATS.POWER_LABEL && (
                  <AnimatedText
                    variant="label"
                    size={28}
                    color={COLORS.insightOrange}
                    startFrame={BEATS.POWER_LABEL}
                    entrance="fade"
                    align="center"
                  >
                    EXACTLY 2^12
                  </AnimatedText>
                )}
              </div>
            )}
          </div>
        )}

        {/* Binary Display */}
        {showBinary && (
          <div
            style={{
              opacity: binaryOpacity * binaryFadeOut,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 32,
              position: 'relative',
            }}
          >
            {/* Highlight column for the flipped bit */}
            <div
              style={{
                position: 'absolute',
                left: `calc(50% - 350px + ${FLIPPED_BIT_INDEX * 24 + FLIPPED_BIT_INDEX * 2 + Math.floor(FLIPPED_BIT_INDEX / 4) * 10}px)`,
                top: -10,
                width: 40,
                height: '120%',
                backgroundColor: COLORS.errorRed,
                opacity: highlightOpacity,
                borderRadius: 4,
              }}
            />

            {/* Before row */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.textMuted}
                startFrame={BEATS.BINARY_DIGITS_IN}
                entrance="fade"
                align="center"
              >
                BEFORE
              </AnimatedText>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {BEFORE_BITS.map((bit, i) => (
                  <BinaryDigit
                    key={`before-${i}`}
                    digit={bit}
                    index={i}
                    startFrame={BEATS.BINARY_DIGITS_IN}
                    isFlipped={i === FLIPPED_BIT_INDEX}
                    isAfterRow={false}
                    frame={frame}
                    fps={fps}
                  />
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 40,
                color: COLORS.errorRed,
                opacity: interpolate(
                  frame,
                  [BEATS.BIT_HIGHLIGHT, BEATS.BIT_HIGHLIGHT + 10],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
              }}
            >
              &#8595;
            </div>

            {/* After row */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <AnimatedText
                variant="label"
                size={24}
                color={COLORS.textMuted}
                startFrame={BEATS.BINARY_DIGITS_IN + 16}
                entrance="fade"
                align="center"
              >
                AFTER
              </AnimatedText>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {AFTER_BITS.map((bit, i) => (
                  <BinaryDigit
                    key={`after-${i}`}
                    digit={bit}
                    index={i}
                    startFrame={BEATS.BINARY_DIGITS_IN + 16}
                    isFlipped={i === FLIPPED_BIT_INDEX}
                    isAfterRow
                    frame={frame}
                    fps={fps}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero 4096 moment */}
        {showHero && (
          <div
            style={{
              opacity: heroFadeIn,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <FocusBlur
              startFrame={BEATS.HERO_NUMBER}
              focusFrame={BEATS.HERO_NUMBER + 10}
              blurAmount={12}
            >
              <div
                style={{
                  ...TYPOGRAPHY.hero,
                  fontSize: 96,
                  color: COLORS.aiPurple,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  transform: `scale(${heroScale})`,
                  textShadow: frame >= BEATS.HOLD
                    ? `0 0 30px rgba(139,92,246,0.4)`
                    : 'none',
                }}
              >
                4,096
              </div>
            </FocusBlur>

            {frame >= BEATS.HERO_LABEL && (
              <AnimatedText
                variant="body"
                size={44}
                color={COLORS.textBody}
                startFrame={BEATS.HERO_LABEL}
                springPreset="gentle"
                entrance="slideUp"
                align="center"
              >
                extra votes from one flipped bit
              </AnimatedText>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
