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
 * Scene 3: Error Handling Built at Each Era
 * Duration: 300 frames (10 seconds)
 *
 * Three eras get their fix: debuggers, process isolation, TCP/IP.
 * Visual layers stacking. Then AI layer appears without solutions yet.
 */

const BEATS = {
  SCENE_IN: 0,
  TITLE_IN: 5,
  TITLE_DIM: 15,
  // Row 1
  ROW1_YEAR: 20,
  ROW1_LAYER: 25,
  ROW1_BADGE_1: 35,
  ROW1_BADGE_2: 42,
  ROW1_CHECK: 58,
  // Row 2
  ROW2_YEAR: 60,
  ROW2_LAYER: 65,
  ROW2_BADGE_1: 75,
  ROW2_BADGE_2: 82,
  ROW2_CHECK: 103,
  // Row 3
  ROW3_YEAR: 100,
  ROW3_LAYER: 105,
  ROW3_BADGE_1: 115,
  ROW3_BADGE_2: 122,
  ROW3_BADGE_3: 129,
  ROW3_CHECK: 143,
  // Bridge
  ROWS_HOLD: 150,
  ROWS_DIM: 165,
  INSIGHT_TEXT_IN: 175,
  ROWS_FADE: 220,
  AI_ROW_YEAR: 220,
  AI_ROW_LAYER: 225,
  AI_ROW_HOLD: 270,
  FADE_OUT: 290,
};

// ---- Solution Badge ----
const SolutionBadge: React.FC<{
  text: string;
  startFrame: number;
}> = ({ text, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const progress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const translateX = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        display: 'inline-flex',
        backgroundColor: `${COLORS.solutionGreen}1A`,
        borderRadius: 20,
        padding: '6px 18px',
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.solutionGreen,
          textTransform: 'none',
          letterSpacing: 0,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ---- Compact Layer Box ----
const CompactLayer: React.FC<{
  label: string;
  layerColor: string;
  startFrame: number;
}> = ({ label, layerColor, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const progress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 650,
        maxWidth: '100%',
        height: 60,
        borderRadius: 12,
        backgroundColor: `${layerColor}1A`,
        border: `1px solid ${layerColor}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 32,
          color: layerColor,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ---- SVG Checkmark ----
const SolvedCheckmark: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const drawProgress = interpolate(rel, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gentle pulse
  const pulseOpacity = 0.8 + 0.2 * Math.sin(rel * 0.157);

  return (
    <svg width={28} height={28} style={{ opacity: pulseOpacity, flexShrink: 0 }}>
      <circle
        cx={14}
        cy={14}
        r={12}
        fill="none"
        stroke={COLORS.solutionGreen}
        strokeWidth={1.5}
        opacity={0.4}
      />
      <path
        d="M8 14 L12 18 L20 10"
        fill="none"
        stroke={COLORS.solutionGreen}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={30}
        strokeDashoffset={30 * (1 - drawProgress)}
      />
    </svg>
  );
};

// ---- Era Row ----
const EraRow: React.FC<{
  year: string;
  layerLabel: string;
  badges: { text: string; startFrame: number }[];
  checkFrame: number;
  yearStartFrame: number;
  layerStartFrame: number;
  layerColor: string;
  opacity?: number;
}> = ({
  year,
  layerLabel,
  badges,
  checkFrame,
  yearStartFrame,
  layerStartFrame,
  layerColor,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  const yearOpacity = interpolate(
    frame,
    [yearStartFrame, yearStartFrame + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity,
        width: '100%',
      }}
    >
      {/* Year label */}
      <div
        style={{
          opacity: yearOpacity,
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.historyGold,
        }}
      >
        {year}
      </div>

      {/* Layer box */}
      <CompactLayer label={layerLabel} layerColor={layerColor} startFrame={layerStartFrame} />

      {/* Solution badges + checkmark */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {badges.map((badge, i) => (
          <SolutionBadge key={i} text={badge.text} startFrame={badge.startFrame} />
        ))}
        <SolvedCheckmark startFrame={checkFrame} />
      </div>
    </div>
  );
};

export const Scene3_ErrorHandling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame: frame - BEATS.TITLE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleDimOpacity = interpolate(
    frame,
    [BEATS.TITLE_DIM, BEATS.TITLE_DIM + 15],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Rows dimming
  const rowsDim = interpolate(
    frame,
    [BEATS.ROWS_DIM, BEATS.ROWS_DIM + 15],
    [1, 0.25],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const rowsFade = interpolate(
    frame,
    [BEATS.ROWS_FADE, BEATS.ROWS_FADE + 20],
    [0.25, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const rowsOpacity = frame >= BEATS.ROWS_FADE ? rowsFade : rowsDim;

  // AI row
  const aiRowOpacity = interpolate(
    frame,
    [BEATS.AI_ROW_YEAR, BEATS.AI_ROW_YEAR + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // AI error badge pulsing
  const aiErrorPulse = 0.3 + 0.4 * Math.sin(frame * 0.1);

  // Dashed outline for missing solution
  const dashPulse = 0.3 + 0.4 * Math.sin(frame * 0.08);

  // AI layer entrance
  const aiLayerProgress = spring({
    frame: frame - BEATS.AI_ROW_LAYER,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const aiLayerScale = interpolate(aiLayerProgress, [0, 1], [0.85, 1]);
  const aiLayerOpacity = interpolate(aiLayerProgress, [0, 1], [0, 1]);

  // AI year label
  const aiYearOpacity = interpolate(
    frame,
    [BEATS.AI_ROW_YEAR, BEATS.AI_ROW_YEAR + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={290}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 20,
          paddingTop: 120,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleOpacity * titleDimOpacity,
            transform: `translateY(${titleY}px)`,
            ...TYPOGRAPHY.title,
            fontSize: 52,
            color: COLORS.solutionGreen,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          The Fix
        </div>

        {/* Three era rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            width: '100%',
            alignItems: 'center',
            opacity: rowsOpacity,
          }}
        >
          {/* Row 1: Compilers */}
          <EraRow
            year="1950s"
            layerLabel="COMPILER"
            layerColor={COLORS.historyGold}
            yearStartFrame={BEATS.ROW1_YEAR}
            layerStartFrame={BEATS.ROW1_LAYER}
            badges={[
              { text: 'Debuggers', startFrame: BEATS.ROW1_BADGE_1 },
              { text: 'Error Messages', startFrame: BEATS.ROW1_BADGE_2 },
            ]}
            checkFrame={BEATS.ROW1_CHECK}
          />

          {/* Row 2: OS */}
          <EraRow
            year="1970s"
            layerLabel="OS KERNEL"
            layerColor={COLORS.historyGold}
            yearStartFrame={BEATS.ROW2_YEAR}
            layerStartFrame={BEATS.ROW2_LAYER}
            badges={[
              { text: 'Process Isolation', startFrame: BEATS.ROW2_BADGE_1 },
              { text: 'Protected Memory', startFrame: BEATS.ROW2_BADGE_2 },
            ]}
            checkFrame={BEATS.ROW2_CHECK}
          />

          {/* Row 3: Networking */}
          <EraRow
            year="1990s"
            layerLabel="TCP/IP STACK"
            layerColor={COLORS.historyGold}
            yearStartFrame={BEATS.ROW3_YEAR}
            layerStartFrame={BEATS.ROW3_LAYER}
            badges={[
              { text: 'Error Correction', startFrame: BEATS.ROW3_BADGE_1 },
              { text: 'Checksums', startFrame: BEATS.ROW3_BADGE_2 },
              { text: 'Retransmission', startFrame: BEATS.ROW3_BADGE_3 },
            ]}
            checkFrame={BEATS.ROW3_CHECK}
          />
        </div>

        {/* Insight text: "Until we forgot they were ever a problem" */}
        {frame >= BEATS.INSIGHT_TEXT_IN && (
          <div
            style={{
              textAlign: 'center',
              maxWidth: 860,
              marginTop: 16,
            }}
          >
            <BlurText
              startFrame={BEATS.INSIGHT_TEXT_IN}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={8}
              fontSize={48}
              color={COLORS.textPrimary}
              fontWeight={600}
            >
              Until we forgot they were ever a problem
            </BlurText>
          </div>
        )}

        {/* AI Row (no solutions yet) */}
        {frame >= BEATS.AI_ROW_YEAR && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              opacity: aiRowOpacity,
              width: '100%',
              marginTop: 24,
            }}
          >
            {/* Year */}
            <div
              style={{
                opacity: aiYearOpacity,
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.aiPurple,
              }}
            >
              2024-26
            </div>

            {/* AI Layer box */}
            <div
              style={{
                width: 650,
                maxWidth: '100%',
                height: 60,
                borderRadius: 12,
                backgroundColor: `${COLORS.aiPurple}1A`,
                border: `1px solid ${COLORS.aiPurple}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: aiLayerOpacity,
                transform: `scale(${aiLayerScale})`,
                position: 'relative',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 32,
                  color: COLORS.aiPurple,
                  fontWeight: 600,
                }}
              >
                AI LAYER
              </span>

              {/* Error badge */}
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  top: -10,
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  border: `1px solid ${COLORS.errorRed}`,
                  borderRadius: 8,
                  padding: '4px 12px',
                  boxShadow: `0 0 12px ${COLORS.glowRed}`,
                }}
              >
                <span style={{ ...TYPOGRAPHY.label, fontSize: 18, color: COLORS.errorRed }}>
                  New failure modes
                </span>
              </div>
            </div>

            {/* Empty solution space (dashed outline with "?") */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  border: `2px dashed ${COLORS.aiPurple}`,
                  borderRadius: 20,
                  padding: '6px 24px',
                  opacity: dashPulse,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 40,
                    color: COLORS.textDim,
                    opacity: aiErrorPulse,
                  }}
                >
                  ?
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
