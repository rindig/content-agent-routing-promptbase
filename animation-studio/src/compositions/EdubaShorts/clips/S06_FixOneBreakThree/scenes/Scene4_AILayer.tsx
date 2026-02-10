import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 4: Back to the AI — Building the Layer
 * Duration: 240 frames (8 seconds)
 *
 * The three bugs from Scene 1 return, but now with testing frameworks
 * and eval tools building around them. Bugs resolve to green.
 */

const BEATS = {
  SCENE_IN: 0,
  BUG_1_RETURN: 5,
  BUG_2_RETURN: 10,
  BUG_3_RETURN: 15,
  TOOL_1_IN: 30,
  TOOL_2_IN: 45,
  TOOL_3_IN: 60,
  LINE_1_DRAW: 65,
  LINE_2_DRAW: 75,
  LINE_3_DRAW: 85,
  BUG_1_RESOLVE: 80,
  BUG_2_RESOLVE: 90,
  BUG_3_RESOLVE: 100,
  BRIDGE_TEXT: 125,
  HOLD_START: 160,
  FADE_OUT: 220,
};

const BUG_MESSAGES = [
  'TypeError: session.user is undefined',
  'CORS policy blocked /api/auth',
  '500: Database connection reset',
];

const TOOL_LABELS = [
  'AI Testing Frameworks',
  'Output Validation Pipelines',
  'Evaluation Benchmarks',
];

// ---- Bug Notification (resolving variant) ----
const ResolvingBug: React.FC<{
  message: string;
  startFrame: number;
  resolveFrame: number;
  index: number;
}> = ({ message, startFrame, resolveFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const entrance = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const translateX = interpolate(entrance, [0, 1], [100, 0]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 0.7]);

  // Resolve color transition
  const resolveProgress = interpolate(
    frame,
    [resolveFrame, resolveFrame + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const borderColor = interpolate(
    resolveProgress,
    [0, 1],
    [0, 1]
  );

  // Pulsing dot color
  const dotColor = resolveProgress > 0.5 ? COLORS.solutionGreen : COLORS.errorRed;
  const dotOpacity = resolveProgress > 0.5 ? 1 : 0.6 + 0.4 * Math.sin(rel * 0.21);

  const bgColor = resolveProgress > 0.5
    ? 'rgba(16,185,129,0.08)'
    : 'rgba(239,68,68,0.1)';

  const bColor = resolveProgress > 0.5
    ? `${COLORS.solutionGreen}4D`
    : COLORS.errorRed;

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${bColor}`,
        borderRadius: 10,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        width: '100%',
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: dotColor,
          opacity: dotOpacity,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 22,
          color: COLORS.textBody,
        }}
      >
        {message}
      </span>
    </div>
  );
};

// ---- Solution Card ----
const SolutionCard: React.FC<{
  label: string;
  startFrame: number;
}> = ({ label, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const entrance = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Glow after all connected
  const glowPulse = frame >= BEATS.HOLD_START
    ? 0.15 + 0.05 * Math.sin(frame * 0.1)
    : 0;

  return (
    <div
      style={{
        width: '100%',
        height: 70,
        borderRadius: 12,
        backgroundColor: COLORS.bgSurface,
        border: `1px solid ${COLORS.solutionGreen}33`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 20px',
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: glowPulse > 0
          ? `0 0 16px rgba(16,185,129,${glowPulse})`
          : 'none',
      }}
    >
      {/* Green dot icon */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: COLORS.solutionGreen,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 34,
          color: COLORS.solutionGreen,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Scene4_AILayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Connecting lines
  const lineDrawProgress = (lineFrame: number) =>
    interpolate(frame, [lineFrame, lineFrame + 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={220}
      fadeOutDuration={20}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 16,
        }}
      >
        {/* Bug Notifications (compact, upper third) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            position: 'relative',
          }}
        >
          {BUG_MESSAGES.map((msg, i) => (
            <ResolvingBug
              key={i}
              message={msg}
              startFrame={BEATS.BUG_1_RETURN + i * 5}
              resolveFrame={BEATS.BUG_1_RESOLVE + i * 10}
              index={i}
            />
          ))}
        </div>

        {/* Connecting lines (SVG overlay) */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <svg
            width="100%"
            height={40}
            style={{ overflow: 'visible' }}
          >
            {[0, 1, 2].map((i) => {
              const progress = lineDrawProgress(
                [BEATS.LINE_1_DRAW, BEATS.LINE_2_DRAW, BEATS.LINE_3_DRAW][i]
              );
              // Simple vertical connecting lines from bugs to tools
              const xOffset = 100 + i * 300;
              return (
                <line
                  key={i}
                  x1="50%"
                  y1={0}
                  x2="50%"
                  y2={40}
                  stroke={COLORS.solutionGreen}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={progress * 0.3}
                />
              );
            })}
          </svg>
        </div>

        {/* Solution Cards */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {TOOL_LABELS.map((label, i) => (
            <SolutionCard
              key={i}
              label={label}
              startFrame={[BEATS.TOOL_1_IN, BEATS.TOOL_2_IN, BEATS.TOOL_3_IN][i]}
            />
          ))}
        </div>

        {/* Bridge text: "Tomorrow's solved problems" */}
        {frame >= BEATS.BRIDGE_TEXT && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <ShinyText
              startFrame={BEATS.BRIDGE_TEXT}
              color={COLORS.textPrimary}
              shineColor={COLORS.solutionGreen}
              fontSize={44}
              fontWeight={600}
              duration={50}
            >
              Tomorrow's solved problems
            </ShinyText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
