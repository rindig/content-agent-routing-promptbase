import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 1: Hook — Skepticism
 * Duration: 90 frames (3 seconds)
 *
 * Five silhouettes with dismissive speech bubbles → shake → dim →
 * "3 years." hero text with historyGold glow.
 */

const BEATS = {
  SILHOUETTES_IN: 0,
  SILHOUETTE_STAGGER: 3,
  BUBBLES_IN: 20,
  BUBBLE_STAGGER: 4,
  SHAKE: 45,
  DIM: 55,
  YEARS_TEXT_IN: 70,
};

const BUBBLE_TEXTS = ['No.', 'Impossible.', 'Why?', 'Not useful.', 'Never.'];

// Minimalist person silhouette (head + shoulders outline)
const Silhouette: React.FC<{
  startFrame: number;
  dimmed: boolean;
  shaking: boolean;
  shakeFrame: number;
}> = ({ startFrame, dimmed, shaking, shakeFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = dimmed
    ? interpolate(
        frame,
        [BEATS.DIM, BEATS.DIM + 10],
        [1, 0.2],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : interpolate(entrance, [0, 1], [0, 1]);

  // Shake effect: translateX +/-2px over 3-frame cycle, 4 cycles
  let shakeX = 0;
  if (shaking) {
    const shakeRel = frame - BEATS.SHAKE;
    if (shakeRel >= 0 && shakeRel < 12) {
      // 4 cycles * 3 frames each = 12 frames
      shakeX = Math.sin(shakeRel * (Math.PI / 1.5)) * 2;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale}) translateX(${shakeX}px)`,
      }}
    >
      <svg width={40} height={60} viewBox="0 0 40 60">
        {/* Head */}
        <circle
          cx={20}
          cy={14}
          r={10}
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth={2}
        />
        {/* Shoulders */}
        <path
          d="M4 55 Q4 35 20 30 Q36 35 36 55"
          fill="none"
          stroke={COLORS.textMuted}
          strokeWidth={2}
        />
      </svg>
    </div>
  );
};

// Speech bubble above a silhouette
const SpeechBubble: React.FC<{
  text: string;
  startFrame: number;
  dimmed: boolean;
  shaking: boolean;
}> = ({ text, startFrame, dimmed, shaking }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = dimmed
    ? interpolate(
        frame,
        [BEATS.DIM, BEATS.DIM + 10],
        [1, 0.2],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : interpolate(entrance, [0, 1], [0, 1]);

  let shakeX = 0;
  if (shaking) {
    const shakeRel = frame - BEATS.SHAKE;
    if (shakeRel >= 0 && shakeRel < 12) {
      shakeX = Math.sin(shakeRel * (Math.PI / 1.5)) * 2;
    }
  }

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurfaceAlt,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: 8,
        padding: '6px 14px',
        opacity,
        transform: `scale(${scale}) translateX(${shakeX}px)`,
        textAlign: 'center',
        minWidth: 100,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 28,
          color: COLORS.errorRed,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isShaking = frame >= BEATS.SHAKE;
  const isDimmed = frame >= BEATS.DIM;

  // "3 years." entrance
  const yearsProgress = spring({
    frame: frame - BEATS.YEARS_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const yearsScale = interpolate(yearsProgress, [0, 1], [0.5, 1]);
  const yearsOpacity = interpolate(yearsProgress, [0, 1], [0, 1]);

  // Glow pulse behind "3 years."
  const glowOpacity =
    frame >= BEATS.YEARS_TEXT_IN
      ? 0.15 + 0.1 * Math.sin((frame - BEATS.YEARS_TEXT_IN) * 0.12)
      : 0;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={82}
      fadeOutDuration={8}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 20,
        }}
      >
        {/* Silhouettes Row with Bubbles */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            width: '100%',
          }}
        >
          {BUBBLE_TEXTS.map((text, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {/* Speech bubble */}
              <SpeechBubble
                text={text}
                startFrame={BEATS.BUBBLES_IN + i * BEATS.BUBBLE_STAGGER}
                dimmed={isDimmed}
                shaking={isShaking}
              />
              {/* Silhouette */}
              <Silhouette
                startFrame={BEATS.SILHOUETTES_IN + i * BEATS.SILHOUETTE_STAGGER}
                dimmed={isDimmed}
                shaking={isShaking}
                shakeFrame={BEATS.SHAKE}
              />
            </div>
          ))}
        </div>

        {/* "3 years." Hero Text */}
        {frame >= BEATS.YEARS_TEXT_IN && (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 40,
            }}
          >
            {/* Glow behind text */}
            <div
              style={{
                position: 'absolute',
                width: 300,
                height: 100,
                borderRadius: '50%',
                backgroundColor: COLORS.historyGold,
                opacity: glowOpacity,
                filter: 'blur(40px)',
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 84,
                color: COLORS.historyGold,
                opacity: yearsOpacity,
                transform: `scale(${yearsScale})`,
                position: 'relative',
                zIndex: 1,
              }}
            >
              3 years.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
