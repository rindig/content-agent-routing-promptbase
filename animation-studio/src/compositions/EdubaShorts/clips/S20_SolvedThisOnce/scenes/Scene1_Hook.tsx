import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchBurst } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  QUOTE_IN: 0,
  MONTAGE_START: 20,
  WORD_SWAP_DURATION: 6,
  STACK_OVERLAY: 50,
  STACK_FADE: 65,
  EVERY_SINGLE_TIME: 70,
  WORD_STAGGER: 8,
};

// The words that cycle through the "We can't trust ___" pattern
const SWAP_WORDS = [
  { word: 'AI.', start: 20 },
  { word: 'the internet.', start: 26 },
  { word: 'databases.', start: 32 },
  { word: 'transistors.', start: 38 },
  { word: 'compilers.', start: 44 },
  { word: 'AI.', start: 50 },
];

// All unique words for the ghost stack overlay
const ALL_SWAP_WORDS = [
  'AI.',
  'the internet.',
  'databases.',
  'transistors.',
  'compilers.',
];

// ── Swapping Word Component ──
const SwappingWord: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Determine which word is currently active
  let activeWord = SWAP_WORDS[0].word;
  for (let i = SWAP_WORDS.length - 1; i >= 0; i--) {
    if (frame >= SWAP_WORDS[i].start) {
      activeWord = SWAP_WORDS[i].word;
      break;
    }
  }

  // Find current swap entry for entrance animation
  let currentSwap = SWAP_WORDS[0];
  for (let i = SWAP_WORDS.length - 1; i >= 0; i--) {
    if (frame >= SWAP_WORDS[i].start) {
      currentSwap = SWAP_WORDS[i];
      break;
    }
  }

  const swapProgress = spring({
    frame: frame - currentSwap.start,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const scale = interpolate(swapProgress, [0, 1], [0.7, 1]);

  return (
    <span
      style={{
        color: COLORS.errorRed,
        display: 'inline-block',
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
      }}
    >
      {activeWord}
    </span>
  );
};

// ── Ghost Stack Overlay ──
const GhostStack: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.STACK_OVERLAY;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Fade out at STACK_FADE
  const fadeOut = interpolate(
    frame,
    [BEATS.STACK_FADE, BEATS.STACK_FADE + 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        opacity: enterProgress * fadeOut,
      }}
    >
      {ALL_SWAP_WORDS.map((word, i) => (
        <div
          key={i}
          style={{
            ...TYPOGRAPHY.hero,
            fontSize: 64,
            color: COLORS.textPrimary,
            opacity: 0.2,
            transform: `translateY(${(i - 2) * 5}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          We can&apos;t trust {word}
        </div>
      ))}
    </div>
  );
};

// ── "Every. Single. Time." ──
const EverySingleTime: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.EVERY_SINGLE_TIME;
  if (relFrame < 0) return null;

  const words = ['Every.', 'Single.', 'Time.'];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        marginTop: 24,
      }}
    >
      {words.map((word, i) => {
        const wordStart = i * BEATS.WORD_STAGGER;
        const wordProgress = spring({
          frame: relFrame - wordStart,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        const scale = interpolate(wordProgress, [0, 1], [0.5, 1]);
        const opacity = interpolate(wordProgress, [0, 1], [0, 1]);

        return (
          <span
            key={i}
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 56,
              color: COLORS.insightOrange,
              display: 'inline-block',
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main quote entrance
  const quoteProgress = spring({
    frame: frame - BEATS.QUOTE_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const quoteScale = interpolate(quoteProgress, [0, 1], [0.8, 1]);
  const quoteOpacity = interpolate(quoteProgress, [0, 1], [0, 1]);

  // After stack overlay fades, dim the original quote
  const quoteDim = frame >= BEATS.EVERY_SINGLE_TIME
    ? interpolate(
        frame,
        [BEATS.EVERY_SINGLE_TIME, BEATS.EVERY_SINGLE_TIME + 5],
        [1, 0.5],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Show montage (word swaps) during MONTAGE_START to STACK_OVERLAY
  const showMontage = frame >= BEATS.MONTAGE_START;
  const showGhostStack = frame >= BEATS.STACK_OVERLAY && frame < BEATS.EVERY_SINGLE_TIME;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={8}
      fadeOut
      fadeOutStart={82}
      fadeOutDuration={8}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Ghost stack overlay */}
        {showGhostStack && <GhostStack frame={frame} fps={fps} />}

        {/* Main quote */}
        <div
          style={{
            opacity: quoteOpacity * quoteDim,
            transform: `scale(${quoteScale})`,
            textAlign: 'center',
            maxWidth: 900,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Quotation marks */}
          <span
            style={{
              ...TYPOGRAPHY.hero,
              fontSize: 96,
              color: COLORS.errorRed,
              opacity: 0.3,
              position: 'absolute',
              top: -40,
              left: -20,
            }}
          >
            {'\u201C'}
          </span>

          <div
            style={{
              ...TYPOGRAPHY.hero,
              fontSize: 64,
              color: COLORS.textPrimary,
              lineHeight: 1.2,
            }}
          >
            {showMontage && frame < BEATS.STACK_OVERLAY ? (
              <GlitchBurst
                startFrame={BEATS.MONTAGE_START}
                burstInterval={8}
                burstDuration={3}
                fontSize={64}
                fontWeight={700}
                color={COLORS.textPrimary}
                intensity={0.6}
              >
                {`We can't trust `}
              </GlitchBurst>
            ) : (
              <span>We can&apos;t trust </span>
            )}
            {showMontage && frame < BEATS.STACK_OVERLAY ? (
              <SwappingWord frame={frame} fps={fps} />
            ) : (
              <span style={{ color: COLORS.errorRed }}>AI.</span>
            )}
          </div>

          {/* Closing quotation mark */}
          <span
            style={{
              ...TYPOGRAPHY.hero,
              fontSize: 96,
              color: COLORS.errorRed,
              opacity: 0.3,
              position: 'absolute',
              bottom: -20,
              right: -20,
            }}
          >
            {'\u201D'}
          </span>
        </div>

        {/* "Every. Single. Time." */}
        {frame >= BEATS.EVERY_SINGLE_TIME && (
          <EverySingleTime frame={frame} fps={fps} />
        )}
      </div>
    </SceneContainer>
  );
};
