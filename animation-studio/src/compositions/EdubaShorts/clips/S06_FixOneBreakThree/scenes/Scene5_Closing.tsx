import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 5: Closing — "Every Layer Has an Awkward Phase. This is AI's."
 * Duration: 240 frames (8 seconds)
 *
 * Minimal phase timeline (awkward -> stable) with AI dot at 30%.
 * ClosingStatement with blur entrance.
 */

const BEATS = {
  SCENE_IN: 0,
  LINE_DRAW: 25,
  LEFT_NODE_IN: 45,
  LEFT_LABEL: 50,
  RIGHT_NODE_IN: 60,
  RIGHT_LABEL: 65,
  AI_DOT_IN: 75,
  AI_LABEL: 80,
  CLOSING_TEXT_IN: 95,
  CLOSING_TEXT_COMPLETE: 130,
  HOLD_START: 130,
  FADE_OUT: 220,
};

export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Timeline line draw ----
  const lineProgress = interpolate(
    frame,
    [BEATS.LINE_DRAW, BEATS.LINE_DRAW + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ---- Left node (awkward phase, errorRed) ----
  const leftNodeProgress = spring({
    frame: frame - BEATS.LEFT_NODE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const leftNodeScale = interpolate(leftNodeProgress, [0, 1], [0, 1]);
  const leftNodeOpacity = interpolate(leftNodeProgress, [0, 1], [0, 1]);

  const leftLabelOpacity = interpolate(
    frame,
    [BEATS.LEFT_LABEL, BEATS.LEFT_LABEL + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ---- Right node (stable, solutionGreen) ----
  const rightNodeProgress = spring({
    frame: frame - BEATS.RIGHT_NODE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const rightNodeScale = interpolate(rightNodeProgress, [0, 1], [0, 1]);
  const rightNodeOpacity = interpolate(rightNodeProgress, [0, 1], [0, 1]);

  const rightLabelOpacity = interpolate(
    frame,
    [BEATS.RIGHT_LABEL, BEATS.RIGHT_LABEL + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Gentle glow on stable node
  const stableGlow = rightNodeOpacity > 0
    ? 0.2 + 0.1 * Math.sin(frame * 0.08)
    : 0;

  // ---- AI dot (at ~30% along the line) ----
  const aiDotProgress = spring({
    frame: frame - BEATS.AI_DOT_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const aiDotScale = interpolate(aiDotProgress, [0, 1], [0, 1]);
  const aiDotOpacity = interpolate(aiDotProgress, [0, 1], [0, 1]);

  // AI dot pulse
  const aiDotPulse = 0.9 + 0.1 * Math.sin(frame * 0.157);

  const aiLabelOpacity = interpolate(
    frame,
    [BEATS.AI_LABEL, BEATS.AI_LABEL + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Timeline dimensions
  const lineWidth = 600;
  const lineY = 0; // Relative to the timeline container
  const leftX = 0;
  const rightX = lineWidth;
  const aiX = lineWidth * 0.3; // 30% along

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={30}
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
          gap: 40,
        }}
      >
        {/* Phase Timeline */}
        <div
          style={{
            position: 'relative',
            width: lineWidth,
            maxWidth: '100%',
            height: 100,
          }}
        >
          {/* Horizontal line */}
          <svg
            width="100%"
            height={4}
            style={{
              position: 'absolute',
              top: 30,
              left: 0,
            }}
          >
            <line
              x1={0}
              y1={2}
              x2={lineWidth}
              y2={2}
              stroke={COLORS.textDim}
              strokeWidth={2}
              strokeDasharray={lineWidth}
              strokeDashoffset={lineWidth * (1 - lineProgress)}
            />
          </svg>

          {/* Left node: AWKWARD PHASE */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 22,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: COLORS.errorRed,
                opacity: leftNodeOpacity,
                transform: `scale(${leftNodeScale})`,
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.errorRed,
                opacity: leftLabelOpacity,
                whiteSpace: 'nowrap',
              }}
            >
              AWKWARD PHASE
            </span>
          </div>

          {/* Right node: STABLE */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 22,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: COLORS.solutionGreen,
                opacity: rightNodeOpacity,
                transform: `scale(${rightNodeScale})`,
                boxShadow: `0 0 20px rgba(16,185,129,${stableGlow})`,
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.solutionGreen,
                opacity: rightLabelOpacity,
                whiteSpace: 'nowrap',
              }}
            >
              STABLE
            </span>
          </div>

          {/* AI dot (30% along) */}
          <div
            style={{
              position: 'absolute',
              left: `${30}%`,
              top: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              transform: `translateX(-50%)`,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: COLORS.aiPurple,
                opacity: aiDotOpacity,
                transform: `scale(${aiDotScale * aiDotPulse})`,
                boxShadow: `0 0 20px rgba(139,92,246,0.4)`,
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.aiPurple,
                opacity: aiLabelOpacity,
                whiteSpace: 'nowrap',
              }}
            >
              AI (2026)
            </span>
          </div>
        </div>

        {/* Closing Statement */}
        {frame >= BEATS.CLOSING_TEXT_IN && (
          <div
            style={{
              textAlign: 'center',
              maxWidth: 860,
            }}
          >
            <BlurText
              startFrame={BEATS.CLOSING_TEXT_IN}
              animateBy="words"
              staggerDelay={4}
              direction="bottom"
              blurAmount={10}
              fontSize={48}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              Every layer has an awkward phase. This is AI's.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
