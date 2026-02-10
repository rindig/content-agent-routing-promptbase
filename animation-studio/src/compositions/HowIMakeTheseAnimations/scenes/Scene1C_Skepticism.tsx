/**
 * Scene 1C: Skepticism Acknowledgment
 * [0:18 - 0:28] — 300 frames
 *
 * "I know how that sounds. Every AI video promises something like this.
 *  Revolutionary. Game-changing. The future of content. And then you try it
 *  and the output is mediocre, or uncanny, or requires so much cleanup
 *  that you wonder why you bothered."
 *
 * Visual: Clean sequencing - buzzwords appear, corrupt, fade. Then reality words.
 * Design principle: One thing at a time, no overlap, clear hierarchy.
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
import { GlitchText } from '../../../components/core/effects';

// Timeline - carefully sequenced, no overlap
const PHASE = {
  // "I know how that sounds"
  HONEST_IN: 0,
  HONEST_OUT: 40,

  // Buzzwords - each gets 30 frames total (in, glitch, out)
  BUZZ_1_IN: 45,      // Revolutionary
  BUZZ_1_GLITCH: 60,
  BUZZ_1_OUT: 75,

  BUZZ_2_IN: 80,      // Game-changing
  BUZZ_2_GLITCH: 95,
  BUZZ_2_OUT: 110,

  BUZZ_3_IN: 115,     // The future of content
  BUZZ_3_GLITCH: 130,
  BUZZ_3_OUT: 145,

  // Reality words - stacked list
  REALITY_IN: 155,

  // Ghost fade for transition
  GHOST_FADE: 270,
};

// SVG Strikethrough line component
const StrikeThrough: React.FC<{ width: number; color: string; progress: number }> = ({
  width,
  color,
  progress,
}) => (
  <svg
    width={width}
    height={4}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    }}
  >
    <line
      x1={0}
      y1={2}
      x2={width * progress}
      y2={2}
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
    />
  </svg>
);

export const Scene1C_Skepticism: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === "I know how that sounds" ===
  const honestIn = spring({
    frame: frame - PHASE.HONEST_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const honestOut = interpolate(
    frame,
    [PHASE.HONEST_OUT, PHASE.HONEST_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const honestVisible = frame >= PHASE.HONEST_IN && frame < PHASE.BUZZ_1_IN;

  // === Buzzword 1: Revolutionary ===
  const buzz1In = spring({
    frame: frame - PHASE.BUZZ_1_IN,
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const buzz1Glitching = frame >= PHASE.BUZZ_1_GLITCH && frame < PHASE.BUZZ_1_OUT;
  const buzz1StrikeProgress = interpolate(
    frame,
    [PHASE.BUZZ_1_GLITCH, PHASE.BUZZ_1_GLITCH + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz1Out = interpolate(
    frame,
    [PHASE.BUZZ_1_OUT, PHASE.BUZZ_1_OUT + 8],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz1Visible = frame >= PHASE.BUZZ_1_IN && frame < PHASE.BUZZ_2_IN;

  // === Buzzword 2: Game-changing ===
  const buzz2In = spring({
    frame: frame - PHASE.BUZZ_2_IN,
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const buzz2Glitching = frame >= PHASE.BUZZ_2_GLITCH && frame < PHASE.BUZZ_2_OUT;
  const buzz2StrikeProgress = interpolate(
    frame,
    [PHASE.BUZZ_2_GLITCH, PHASE.BUZZ_2_GLITCH + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz2Out = interpolate(
    frame,
    [PHASE.BUZZ_2_OUT, PHASE.BUZZ_2_OUT + 8],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz2Visible = frame >= PHASE.BUZZ_2_IN && frame < PHASE.BUZZ_3_IN;

  // === Buzzword 3: The future of content ===
  const buzz3In = spring({
    frame: frame - PHASE.BUZZ_3_IN,
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const buzz3Glitching = frame >= PHASE.BUZZ_3_GLITCH && frame < PHASE.BUZZ_3_OUT;
  const buzz3StrikeProgress = interpolate(
    frame,
    [PHASE.BUZZ_3_GLITCH, PHASE.BUZZ_3_GLITCH + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz3Out = interpolate(
    frame,
    [PHASE.BUZZ_3_OUT, PHASE.BUZZ_3_OUT + 8],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const buzz3Visible = frame >= PHASE.BUZZ_3_IN && frame < PHASE.REALITY_IN;

  // === Reality words ===
  const realityVisible = frame >= PHASE.REALITY_IN;
  const realityWords = [
    { text: 'mediocre', delay: 0 },
    { text: 'uncanny', delay: 15 },
    { text: 'so much cleanup', delay: 30 },
    { text: 'why you bothered', delay: 45 },
  ];

  // === Ghost fade at end ===
  const ghostFade = interpolate(
    frame,
    [PHASE.GHOST_FADE, 300],
    [1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* "I know how that sounds." - appears first, fades before buzzwords */}
      {honestVisible && (
        <div
          style={{
            position: 'absolute',
            opacity: honestIn * honestOut * ghostFade,
            transform: `translateY(${interpolate(honestIn, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: SIZES.title,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: '#D1D5DB',
            }}
          >
            I know how that sounds.
          </span>
        </div>
      )}

      {/* Buzzword 1: Revolutionary */}
      {buzz1Visible && (
        <div
          style={{
            position: 'absolute',
            opacity: buzz1In * buzz1Out * ghostFade,
            transform: `scale(${interpolate(buzz1In, [0, 1], [1.1, 1])})`,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {buzz1Glitching ? (
              <GlitchText
                intensity={1.2}
                speed={2}
                enableShadows
                color={COLORS.textBright}
                backgroundColor={COLORS.background}
                fontSize={SIZES.hero}
                fontWeight={700}
                fontFamily={TYPOGRAPHY.display.fontFamily}
              >
                Revolutionary
              </GlitchText>
            ) : (
              <span
                style={{
                  fontSize: SIZES.hero,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 700,
                  color: frame >= PHASE.BUZZ_1_GLITCH ? COLORS.textMuted : COLORS.textBright,
                }}
              >
                Revolutionary
              </span>
            )}
            {frame >= PHASE.BUZZ_1_GLITCH && (
              <StrikeThrough width={520} color={COLORS.time} progress={buzz1StrikeProgress} />
            )}
          </div>
        </div>
      )}

      {/* Buzzword 2: Game-changing */}
      {buzz2Visible && (
        <div
          style={{
            position: 'absolute',
            opacity: buzz2In * buzz2Out * ghostFade,
            transform: `scale(${interpolate(buzz2In, [0, 1], [1.1, 1])})`,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {buzz2Glitching ? (
              <GlitchText
                intensity={1.2}
                speed={2}
                enableShadows
                color={COLORS.textBright}
                backgroundColor={COLORS.background}
                fontSize={SIZES.hero}
                fontWeight={700}
                fontFamily={TYPOGRAPHY.display.fontFamily}
              >
                Game-changing
              </GlitchText>
            ) : (
              <span
                style={{
                  fontSize: SIZES.hero,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 700,
                  color: frame >= PHASE.BUZZ_2_GLITCH ? COLORS.textMuted : COLORS.textBright,
                }}
              >
                Game-changing
              </span>
            )}
            {frame >= PHASE.BUZZ_2_GLITCH && (
              <StrikeThrough width={560} color={COLORS.time} progress={buzz2StrikeProgress} />
            )}
          </div>
        </div>
      )}

      {/* Buzzword 3: The future of content */}
      {buzz3Visible && (
        <div
          style={{
            position: 'absolute',
            opacity: buzz3In * buzz3Out * ghostFade,
            transform: `scale(${interpolate(buzz3In, [0, 1], [1.1, 1])})`,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {buzz3Glitching ? (
              <GlitchText
                intensity={1.2}
                speed={2}
                enableShadows
                color={COLORS.textBright}
                backgroundColor={COLORS.background}
                fontSize={SIZES.hero}
                fontWeight={700}
                fontFamily={TYPOGRAPHY.display.fontFamily}
              >
                The future of content
              </GlitchText>
            ) : (
              <span
                style={{
                  fontSize: SIZES.hero,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 700,
                  color: frame >= PHASE.BUZZ_3_GLITCH ? COLORS.textMuted : COLORS.textBright,
                }}
              >
                The future of content
              </span>
            )}
            {frame >= PHASE.BUZZ_3_GLITCH && (
              <StrikeThrough width={780} color={COLORS.time} progress={buzz3StrikeProgress} />
            )}
          </div>
        </div>
      )}

      {/* Reality words - clean vertical stack */}
      {realityVisible && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            opacity: ghostFade,
          }}
        >
          {realityWords.map((word, index) => {
            const wordEntrance = spring({
              frame: frame - PHASE.REALITY_IN - word.delay,
              fps,
              config: SPRING_CONFIGS.gentle,
            });
            const wordOpacity = interpolate(wordEntrance, [0, 1], [0, 0.7]);
            const wordY = interpolate(wordEntrance, [0, 1], [15, 0]);

            return (
              <div
                key={word.text}
                style={{
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                {/* X mark SVG */}
                <svg width="20" height="20" viewBox="0 0 20 20" style={{ opacity: 0.6 }}>
                  <line x1="4" y1="4" x2="16" y2="16" stroke={COLORS.time} strokeWidth="2" strokeLinecap="round" />
                  <line x1="16" y1="4" x2="4" y2="16" stroke={COLORS.time} strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span
                  style={{
                    fontSize: SIZES.body,
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    color: COLORS.textMuted,
                    fontStyle: 'italic',
                  }}
                >
                  {word.text}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene1C_Skepticism;
