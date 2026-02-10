import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  NOTIF_1: 0,
  NOTIF_2: 15,
  NOTIF_3: 22,
  HEADLINES_SCROLL: 25,
  STOP_TEXT: 50,
  SCREEN_SHAKE: 52,
  WHAT_CHANGED: 75,
  SCENE_END: 90,
};

// ── Notification data ──
interface NotificationData {
  title: string;
  titleColor: string;
  body: string;
  frame: number;
}

const NOTIFICATIONS: NotificationData[] = [
  {
    title: 'BREAKING',
    titleColor: COLORS.errorRed,
    body: 'New AI Model Released',
    frame: BEATS.NOTIF_1,
  },
  {
    title: 'TRENDING',
    titleColor: COLORS.errorRed,
    body: 'GPT-5 Benchmarks Leaked',
    frame: BEATS.NOTIF_2,
  },
  {
    title: 'OPINION',
    titleColor: COLORS.insightOrange,
    body: 'Is Your Stack Obsolete?',
    frame: BEATS.NOTIF_3,
  },
];

// ── Scrolling headline strings ──
const HEADLINES: string[] = [
  'New model outperforms on every benchmark',
  'Time to rebuild your entire pipeline?',
  'Everything you built is now outdated',
  'The model race is over \u2014 or is it?',
  'Switch now or fall behind',
  'Your competitors already upgraded',
];

// ── Single notification card ──
const NotificationCard: React.FC<{
  data: NotificationData;
  frame: number;
  fps: number;
  dimOpacity: number;
}> = ({ data, frame, fps, dimOpacity }) => {
  const relFrame = frame - data.frame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const translateY = interpolate(enterProgress, [0, 1], [-60, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]) * dimOpacity;

  // Red flash pulse at frame 60-61 (global)
  const flashFrame = frame - 60;
  const showFlash = flashFrame >= 0 && flashFrame <= 1;

  return (
    <div
      style={{
        width: 900,
        backgroundColor: COLORS.codeBg,
        borderRadius: 12,
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateY(${translateY}px)`,
        border: showFlash
          ? `2px solid rgba(239,68,68,0.4)`
          : `1px solid ${COLORS.panelBorder}`,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: COLORS.aiPurple,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 18, color: '#FFF' }}>{'\u26A1'}</span>
      </div>

      {/* Text content */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: data.titleColor,
            marginBottom: 4,
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 36,
            color: COLORS.textBody,
          }}
        >
          {data.body}
        </div>
      </div>

      {/* Notification badge */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: COLORS.errorRed,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 16,
            color: '#FFF',
            letterSpacing: 0,
          }}
        >
          1
        </span>
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dim notifications after STOP text hits
  const dimProgress =
    frame >= BEATS.STOP_TEXT
      ? interpolate(
          frame,
          [BEATS.STOP_TEXT, BEATS.STOP_TEXT + 10],
          [1, 0.2],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  // Further dim after WHAT_CHANGED
  const finalDimProgress =
    frame >= BEATS.WHAT_CHANGED
      ? interpolate(
          frame,
          [BEATS.WHAT_CHANGED, BEATS.WHAT_CHANGED + 10],
          [dimProgress, 0.1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : dimProgress;

  // Screen shake
  const shakeActive = frame >= BEATS.SCREEN_SHAKE && frame < BEATS.SCREEN_SHAKE + 8;
  const shakeX = shakeActive
    ? Math.sin(((frame - BEATS.SCREEN_SHAKE) * Math.PI) / 2) * 4
    : 0;

  // Scrolling headlines opacity
  const headlinesActive = frame >= BEATS.HEADLINES_SCROLL;
  const headlinesOpacity =
    headlinesActive && frame < BEATS.STOP_TEXT
      ? 0.4
      : headlinesActive
        ? interpolate(frame, [BEATS.STOP_TEXT, BEATS.STOP_TEXT + 10], [0.4, 0.05], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : 0;

  // Headline scroll offset
  const scrollOffset = headlinesActive ? (frame - BEATS.HEADLINES_SCROLL) * 2 : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={8}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Scrolling headlines (behind notifications) */}
        {headlinesActive && (
          <div
            style={{
              position: 'absolute',
              top: LAYOUT.contentZoneTop - 200,
              left: 0,
              right: 0,
              height: LAYOUT.contentZoneHeight + 200,
              overflow: 'hidden',
              opacity: headlinesOpacity,
              pointerEvents: 'none',
            }}
          >
            {HEADLINES.map((text, i) => (
              <div
                key={i}
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  padding: '12px 0',
                  transform: `translateY(${-scrollOffset + i * 80}px)`,
                }}
              >
                {text}
              </div>
            ))}
          </div>
        )}

        {/* Notification stack */}
        <div
          style={{
            position: 'absolute',
            top: LAYOUT.contentZoneTop,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          {NOTIFICATIONS.map((notif, i) => (
            <NotificationCard
              key={i}
              data={notif}
              frame={frame}
              fps={fps}
              dimOpacity={finalDimProgress}
            />
          ))}
        </div>

        {/* STOP text */}
        {frame >= BEATS.STOP_TEXT && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                opacity: frame >= BEATS.WHAT_CHANGED
                  ? interpolate(
                      frame,
                      [BEATS.WHAT_CHANGED, BEATS.WHAT_CHANGED + 10],
                      [1, 0.5],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    )
                  : 1,
              }}
            >
              <AnimatedText
                variant="hero"
                size={84}
                color="bright"
                entrance="scale"
                springPreset="bouncy"
                startFrame={BEATS.STOP_TEXT}
                align="center"
              >
                STOP.
              </AnimatedText>
            </div>

            {/* What actually changed? */}
            {frame >= BEATS.WHAT_CHANGED && (
              <div style={{ marginTop: 24 }}>
                <AnimatedText
                  variant="title"
                  size={52}
                  color={COLORS.insightOrange}
                  entrance="slideUp"
                  springPreset="snappy"
                  startFrame={BEATS.WHAT_CHANGED}
                  align="center"
                >
                  What actually changed?
                </AnimatedText>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
