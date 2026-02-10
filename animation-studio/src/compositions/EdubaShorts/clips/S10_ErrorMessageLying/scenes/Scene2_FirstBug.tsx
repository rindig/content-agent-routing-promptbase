import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { HistoricalPanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 2: The First Bug -- 1947 Moth
 * Duration: 210 frames (7 seconds)
 *
 * Harvard Mark II relay, moth flying in, short circuit, logbook entry,
 * then "Every layer since has had its own moth."
 */

const BEATS = {
  WARM_BG_IN: 0,
  YEAR_BADGE_IN: 10,
  RELAY_BUILD: 30,
  MOTH_FLY_IN: 70,
  MOTH_LAND: 100,
  FLASH_EFFECT: 100,
  LOGBOOK_IN: 120,
  TAGLINE_IN: 180,
};

/** Stylized relay component (SVG) */
const Relay: React.FC<{
  startFrame: number;
  shorted: boolean;
  compact?: boolean;
}> = ({ startFrame, shorted, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const buildProgress = interpolate(relativeFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const w = compact ? 120 : 200;
  const h = compact ? 60 : 100;
  const contactColor = shorted ? COLORS.errorRed : COLORS.textMuted;

  return (
    <svg width={w} height={h + 40} viewBox={`0 0 ${w} ${h + 40}`}>
      {/* Connection point top */}
      <circle
        cx={w / 2}
        cy={8}
        r={6}
        fill="none"
        stroke={COLORS.textMuted}
        strokeWidth={2}
        opacity={buildProgress}
      />
      {/* Wire top */}
      <line
        x1={w / 2}
        y1={14}
        x2={w / 2}
        y2={20}
        stroke={COLORS.textMuted}
        strokeWidth={2}
        opacity={buildProgress}
      />
      {/* Relay body */}
      <rect
        x={4}
        y={20}
        width={w - 8}
        height={h}
        rx={4}
        fill={COLORS.bgSurfaceAlt}
        stroke={contactColor}
        strokeWidth={2}
        opacity={buildProgress}
      />
      {/* Contact lines (two parallel that should meet) */}
      <line
        x1={w / 2 - 30}
        y1={20 + h * 0.4}
        x2={w / 2 - 4}
        y2={20 + h * 0.4}
        stroke={contactColor}
        strokeWidth={3}
        opacity={buildProgress}
        strokeDasharray={compact ? '60' : '60'}
        strokeDashoffset={60 * (1 - buildProgress)}
      />
      <line
        x1={w / 2 + 4}
        y1={20 + h * 0.4}
        x2={w / 2 + 30}
        y2={20 + h * 0.4}
        stroke={contactColor}
        strokeWidth={3}
        opacity={buildProgress}
        strokeDasharray={compact ? '60' : '60'}
        strokeDashoffset={60 * (1 - buildProgress)}
      />
      {/* Wire bottom */}
      <line
        x1={w / 2}
        y1={20 + h}
        x2={w / 2}
        y2={20 + h + 6}
        stroke={COLORS.textMuted}
        strokeWidth={2}
        opacity={buildProgress}
      />
      {/* Connection point bottom */}
      <circle
        cx={w / 2}
        cy={20 + h + 12}
        r={6}
        fill="none"
        stroke={COLORS.textMuted}
        strokeWidth={2}
        opacity={buildProgress}
      />
    </svg>
  );
};

/** Geometric moth silhouette */
const Moth: React.FC<{
  startFrame: number;
  landFrame: number;
  targetX: number;
  targetY: number;
}> = ({ startFrame, landFrame, targetX, targetY }) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const flyDuration = landFrame - startFrame;
  const t = interpolate(relativeFrame, [0, flyDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Bezier-like curved path from right side to target
  const startX = 500;
  const startY = -100;
  const controlX = 300;
  const controlY = -50;

  const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * targetX;
  const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * targetY;

  // Wing flutter
  const wingAngle = Math.sin(relativeFrame * 0.8) * 15;
  const hasLanded = relativeFrame >= flyDuration;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px)`,
        pointerEvents: 'none',
      }}
    >
      <svg width={30} height={20} viewBox="0 0 30 20">
        {/* Left wing */}
        <polygon
          points={`15,10 ${hasLanded ? 5 : 5},${hasLanded ? 6 : 10 - wingAngle * 0.3} 3,${hasLanded ? 2 : 4}`}
          fill={COLORS.textPrimary}
          opacity={0.9}
        />
        {/* Right wing */}
        <polygon
          points={`15,10 ${hasLanded ? 25 : 25},${hasLanded ? 6 : 10 - wingAngle * 0.3} 27,${hasLanded ? 2 : 4}`}
          fill={COLORS.textPrimary}
          opacity={0.9}
        />
        {/* Body */}
        <ellipse cx={15} cy={10} rx={3} ry={5} fill={COLORS.textPrimary} />
      </svg>
    </div>
  );
};

export const Scene2_FirstBug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash effect when moth lands
  const flashProgress = frame >= BEATS.FLASH_EFFECT
    ? interpolate(frame - BEATS.FLASH_EFFECT, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
  const flashScale = interpolate(flashProgress, [0, 1], [0, 3]);
  const flashOpacity = interpolate(flashProgress, [0, 0.3, 1], [0, 0.3, 0]);

  // Spark dots
  const sparkVisible = frame >= BEATS.FLASH_EFFECT && frame < BEATS.FLASH_EFFECT + 20;

  // Relay compacts and moves up-left after logbook entry
  const isCompact = frame >= BEATS.LOGBOOK_IN;
  const relayScale = interpolate(
    frame,
    [BEATS.LOGBOOK_IN, BEATS.LOGBOOK_IN + 20],
    [1, 0.5],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const relayTranslateX = interpolate(
    frame,
    [BEATS.LOGBOOK_IN, BEATS.LOGBOOK_IN + 20],
    [0, -200],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const relayTranslateY = interpolate(
    frame,
    [BEATS.LOGBOOK_IN, BEATS.LOGBOOK_IN + 20],
    [0, -280],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Logbook entry
  const logbookProgress = spring({
    frame: frame - BEATS.LOGBOOK_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const logbookOpacity = interpolate(
    frame,
    [BEATS.LOGBOOK_IN, BEATS.LOGBOOK_IN + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const logbookY = interpolate(logbookProgress, [0, 1], [30, 0]);

  // Tagline
  const taglineOpacity = interpolate(
    frame,
    [BEATS.TAGLINE_IN, BEATS.TAGLINE_IN + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const taglineY = interpolate(
    spring({
      frame: frame - BEATS.TAGLINE_IN,
      fps,
      config: SPRING_CONFIGS.gentle,
    }),
    [0, 1],
    [20, 0]
  );

  const isShorted = frame >= BEATS.MOTH_LAND;

  return (
    <SceneContainer
      background="#140E08"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={200}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
        }}
      >
        {/* Historical Panel: Year Badge */}
        <HistoricalPanel
          year="1947"
          label="Harvard Mark II"
          startFrame={BEATS.YEAR_BADGE_IN}
          badgeColor={COLORS.historyGold}
        >
          <div style={{ height: 0 }} />
        </HistoricalPanel>

        {/* Relay illustration area */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            width: '100%',
          }}
        >
          {/* Relay */}
          <div
            style={{
              transform: `scale(${relayScale}) translate(${relayTranslateX}px, ${relayTranslateY}px)`,
              position: 'relative',
            }}
          >
            <Relay
              startFrame={BEATS.RELAY_BUILD}
              shorted={isShorted}
              compact={false}
            />

            {/* Flash effect at moth impact */}
            {frame >= BEATS.FLASH_EFFECT && (
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: COLORS.errorRed,
                  opacity: flashOpacity,
                  transform: `translate(-50%, -50%) scale(${flashScale})`,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Spark dots */}
            {sparkVisible && [0, 1, 2].map((i) => {
              const sparkFrame = frame - BEATS.FLASH_EFFECT;
              const sparkProgress = spring({
                frame: sparkFrame,
                fps,
                config: SPRING_CONFIGS.bouncy,
              });
              const angle = (i * 120 + 30) * (Math.PI / 180);
              const dist = interpolate(sparkProgress, [0, 1], [0, 25 + i * 10]);
              const sparkOpacity = interpolate(sparkProgress, [0, 0.5, 1], [0, 1, 0]);

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: COLORS.insightOrange,
                    opacity: sparkOpacity,
                    transform: `translate(
                      ${Math.cos(angle) * dist - 2.5}px,
                      ${Math.sin(angle) * dist - 2.5}px
                    )`,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}

            {/* Moth */}
            <Moth
              startFrame={BEATS.MOTH_FLY_IN}
              landFrame={BEATS.MOTH_LAND}
              targetX={0}
              targetY={-10}
            />
          </div>

          {/* Logbook entry */}
          {frame >= BEATS.LOGBOOK_IN && (
            <div
              style={{
                position: 'absolute',
                bottom: 100,
                left: 0,
                right: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(201,162,39,0.08)',
                  border: `1px solid rgba(201,162,39,0.3)`,
                  borderRadius: 12,
                  padding: '32px 36px',
                  maxWidth: 860,
                  opacity: logbookOpacity,
                  transform: `translateY(${logbookY}px) rotate(2deg)`,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.quote,
                    fontSize: 36,
                    color: COLORS.historyGold,
                  }}
                >
                  "First actual case of bug being found."
                </span>
              </div>

              {/* Tagline */}
              {frame >= BEATS.TAGLINE_IN && (
                <div
                  style={{
                    opacity: taglineOpacity,
                    transform: `translateY(${taglineY}px)`,
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 40,
                      color: COLORS.textBody,
                    }}
                  >
                    Every layer since has had its own moth.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
