import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { SplitScreen } from '../../../components';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

const BEATS = {
  PANELS_IN: 0,
  TOP_BADGES: 20,
  BOTTOM_BADGES: 70,
  PROGRESS_BAR: 120,
  CENTER_TEXT: 160,
};

interface BadgeDef {
  text: string;
  color: string;
  suffix?: string;
  hasCheck: boolean;
}

const TOP_BADGES: BadgeDef[] = [
  { text: 'Unit tests', color: COLORS.solutionGreen, hasCheck: true },
  { text: 'Code review', color: COLORS.solutionGreen, hasCheck: true },
  { text: 'CVE scanning', color: COLORS.solutionGreen, hasCheck: true },
  { text: '10+ years of usage', color: COLORS.solutionGreen, hasCheck: true },
  { text: 'Community auditing', color: COLORS.solutionGreen, hasCheck: true },
];

const BOTTOM_BADGES: BadgeDef[] = [
  { text: 'Unit tests', color: COLORS.insightOrange, suffix: 'building...', hasCheck: false },
  { text: 'Code review', color: COLORS.insightOrange, suffix: 'emerging', hasCheck: false },
  { text: 'Security scanning', color: COLORS.insightOrange, suffix: 'early', hasCheck: false },
  { text: 'Usage history', color: COLORS.errorRed, suffix: 'months', hasCheck: false },
  { text: 'Community trust', color: COLORS.errorRed, suffix: 'nascent', hasCheck: false },
];

/** Checkmark icon */
const Checkmark: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <svg width={12} height={12} viewBox="0 0 12 12">
      <path
        d="M 2 6 L 5 9 L 10 3"
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/** Individual badge pill */
const InfraBadge: React.FC<{
  badge: BadgeDef;
  startFrame: number;
  index: number;
}> = ({ badge, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrame = startFrame + index * 6;
  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const y = interpolate(progress, [0, 1], [15, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  if (frame < enterFrame) return null;

  const bgAlpha = badge.color === COLORS.errorRed
    ? 'rgba(239,68,68,0.1)'
    : badge.color === COLORS.insightOrange
      ? 'rgba(245,158,11,0.1)'
      : 'rgba(16,185,129,0.1)';

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        backgroundColor: bgAlpha,
        borderRadius: 100,
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {badge.hasCheck && <Checkmark color={badge.color} />}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 26,
          color: badge.color,
        }}
      >
        {badge.text}
      </span>
      {badge.suffix && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 22,
            color: badge.color,
            opacity: 0.7,
            fontStyle: 'italic',
          }}
        >
          {badge.suffix}
        </span>
      )}
    </div>
  );
};

/** Progress bar for infrastructure maturity */
const InfraProgressBar: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  // Fills to about 20%
  const fillWidth = interpolate(progress, [0, 1], [0, 20]);
  const opacity = interpolate(
    frame - startFrame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, width: '100%' }}>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color: COLORS.textMuted,
          marginBottom: 8,
          display: 'block',
        }}
      >
        INFRASTRUCTURE MATURITY
      </span>
      <div
        style={{
          width: '100%',
          height: 8,
          backgroundColor: COLORS.bgSurfaceAlt,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Filled portion — gradient from red to orange to green */}
        <div
          style={{
            width: `${fillWidth}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.errorRed}, ${COLORS.insightOrange})`,
            borderRadius: 4,
          }}
        />
        {/* Dotted remainder hint */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: `${fillWidth + 2}%`,
            right: 10,
            height: 4,
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(16,185,129,0.15) 0px,
              rgba(16,185,129,0.15) 4px,
              transparent 4px,
              transparent 10px
            )`,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

export const Scene4_AIComparison: React.FC = () => {
  const frame = useCurrentFrame();

  // Dim previous scene elements (simple fade in)
  const fadeIn = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Top panel content: badges list
  const topContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {TOP_BADGES.map((badge, i) => (
        <InfraBadge
          key={i}
          badge={badge}
          startFrame={BEATS.TOP_BADGES}
          index={i}
        />
      ))}
    </div>
  );

  // Bottom panel content: badges + progress bar
  const bottomContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {BOTTOM_BADGES.map((badge, i) => (
        <InfraBadge
          key={i}
          badge={badge}
          startFrame={BEATS.BOTTOM_BADGES}
          index={i}
        />
      ))}
      <div style={{ marginTop: 12 }}>
        <InfraProgressBar startFrame={BEATS.PROGRESS_BAR} />
      </div>
    </div>
  );

  return (
    <SceneContainer background="dark">
      <div
        style={{
          opacity: fadeIn,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <SplitScreen
          topLabel="Open Source Libraries"
          bottomLabel="AI-Generated Code"
          topContent={topContent}
          bottomContent={bottomContent}
          startFrame={BEATS.PANELS_IN}
          topBg={COLORS.bgSurface}
          bottomBg={COLORS.bgSurface}
          labelColors={[COLORS.techBlue, COLORS.aiPurple]}
        />

        {/* Center text overlay: "It's being built." */}
        {frame >= BEATS.CENTER_TEXT && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 10,
              // Dark scrim behind the center text for readability
              background: 'linear-gradient(180deg, rgba(10,10,15,0.8) 0%, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.95) 60%, rgba(10,10,15,0.8) 100%)',
              padding: '40px 0',
            }}
          >
            <BlurText
              startFrame={BEATS.CENTER_TEXT}
              animateBy="words"
              staggerDelay={4}
              fontSize={56}
              fontWeight={600}
              color={COLORS.solutionGreen}
            >
              {"It's being built."}
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
