import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
} from '../../../../../Memory/components/AmbientBackground';
import { ShinyText } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

const BEATS = {
  TITLE_IN: 0,
  BADGE_1_IN: 15,
  BADGE_2_IN: 22,
  BADGE_3_IN: 29,
  UNDERLINE_DRAW: 35,
  HELPS_LABEL: 40,
  TITLE_BADGES_DIM: 55,
  LINE_COLOR_SHIFT: 55,
  HELPS_FADE: 55,
  REFRAME_IN: 75,
  SHINE_SWEEP: 80,
  ELEMENTS_EXIT: 85,
  SCENE_END: 90,
};

const BADGES = [
  { text: 'Be specific.', italic: false },
  { text: 'Give examples.', italic: false },
  { text: 'Say please.', italic: true },
];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fade in
  const titleEntrance = spring({
    frame: frame - BEATS.TITLE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const titleOpacity = interpolate(titleEntrance, [0, 1], [0, 1]);

  // Title + badges dim
  const dimOpacity = frame >= BEATS.TITLE_BADGES_DIM
    ? interpolate(frame, [BEATS.TITLE_BADGES_DIM, BEATS.TITLE_BADGES_DIM + 15], [1, 0.25], { extrapolateRight: 'clamp' })
    : 1;

  // Elements exit
  const exitOpacity = frame >= BEATS.ELEMENTS_EXIT
    ? interpolate(frame, [BEATS.ELEMENTS_EXIT, BEATS.SCENE_END], [0.25, 0], { extrapolateRight: 'clamp' })
    : dimOpacity;

  // Underline
  const underlineProgress = spring({
    frame: frame - BEATS.UNDERLINE_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const underlineWidth = frame >= BEATS.UNDERLINE_DRAW
    ? interpolate(underlineProgress, [0, 1], [0, 700])
    : 0;

  // Line color shift from techBlue to insightOrange
  const lineColor = frame >= BEATS.LINE_COLOR_SHIFT
    ? COLORS.insightOrange
    : COLORS.techBlue;
  const lineOpacity = 0.3;

  // "That stuff helps." text
  const helpsOpacity = frame >= BEATS.HELPS_LABEL
    ? frame >= BEATS.HELPS_FADE
      ? interpolate(frame, [BEATS.HELPS_FADE, BEATS.HELPS_FADE + 10], [1, 0], { extrapolateRight: 'clamp' })
      : interpolate(
          spring({ frame: frame - BEATS.HELPS_LABEL, fps, config: SPRING_CONFIGS.gentle }),
          [0, 1], [0, 1]
        )
    : 0;

  // Reframe text
  const reframeEntrance = spring({
    frame: frame - BEATS.REFRAME_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const reframeScale = frame >= BEATS.REFRAME_IN
    ? interpolate(reframeEntrance, [0, 1], [0.5, 1])
    : 0;
  const reframeOpacity = frame >= BEATS.REFRAME_IN
    ? interpolate(reframeEntrance, [0, 1], [0, 1])
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.techBlue}
      />
      <Vignette intensity={0.5} />

      {/* Title: "Prompt Advice" */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 750,
          transform: 'translate(-50%, -50%)',
          opacity: titleOpacity * exitOpacity,
          fontFamily: TYPOGRAPHY.title.fontFamily,
          fontWeight: 600,
          fontSize: 56,
          color: COLORS.techBlue,
        }}
      >
        Prompt Advice
      </div>

      {/* Badges */}
      {BADGES.map((badge, i) => {
        const badgeStart = [BEATS.BADGE_1_IN, BEATS.BADGE_2_IN, BEATS.BADGE_3_IN][i];
        const badgeEntrance = spring({
          frame: frame - badgeStart,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const badgeOpacity = frame >= badgeStart
          ? interpolate(badgeEntrance, [0, 1], [0, 1]) * exitOpacity
          : 0;
        const badgeX = frame >= badgeStart
          ? interpolate(badgeEntrance, [0, 1], [-40, 0])
          : -40;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: 860 + i * 70,
              transform: `translate(-50%, -50%) translateX(${badgeX}px)`,
              opacity: badgeOpacity,
              width: 500,
              height: 52,
              backgroundColor: COLORS.bgSurface,
              borderRadius: 8,
              border: `1px solid ${COLORS.bgSurfaceAlt}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontWeight: 500,
              fontSize: 28,
              color: badge.italic ? COLORS.textDim : COLORS.textMuted,
              fontStyle: badge.italic ? 'italic' : 'normal',
            }}
          >
            {badge.text}
          </div>
        );
      })}

      {/* Horizontal line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1080,
          transform: 'translateX(-50%)',
          width: underlineWidth,
          height: 2,
          backgroundColor: lineColor,
          opacity: lineOpacity,
        }}
      />

      {/* "That stuff helps." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1110,
          transform: 'translate(-50%, -50%)',
          opacity: helpsOpacity,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 400,
          fontSize: 36,
          color: COLORS.textMuted,
        }}
      >
        That stuff helps.
      </div>

      {/* Reframe: "But it misses the bigger picture." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1110,
          transform: `translate(-50%, -50%) scale(${reframeScale})`,
          opacity: reframeOpacity,
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.title.fontFamily,
            fontWeight: 600,
            fontSize: 48,
            color: COLORS.insightOrange,
            textAlign: 'center',
          }}
        >
          But it misses the{' '}
          <ShinyText
            startFrame={BEATS.SHINE_SWEEP}
            shineColor="#FFFFFF"
            duration={40}
            fontSize={48}
          >
            bigger picture.
          </ShinyText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
