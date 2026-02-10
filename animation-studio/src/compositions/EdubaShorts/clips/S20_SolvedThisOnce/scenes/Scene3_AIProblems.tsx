import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  HISTORICAL_COMPRESS: 0,
  AI_LABEL_IN: 30,
  AI_PROBLEMS_START: 40,
  PROBLEM_STAGGER: 5,
  DIVIDER_DRAW: 70,
  AI_FIXES_START: 110,
  FIX_STAGGER: 5,
  CONNECTING_LINES: 170,
  LINE_STAGGER: 3,
  ARC_DRAW: 220,
  SAME_PATTERN_LABEL: 230,
  HOLD: 260,
};

// ── Historical timeline data (compressed strip) ──
const HISTORICAL_ERAS = [
  { year: '1947', label: 'Debugging' },
  { year: '1960s', label: 'Isolation' },
  { year: '1970s', label: 'TCP/IP' },
  { year: '1994', label: 'Validation' },
];

// ── AI problem/fix pairs ──
const AI_PROBLEMS = [
  'Hallucinations',
  'Prompt injection',
  'Training bias',
  'Unpredictable outputs',
];

const AI_FIXES = [
  'Eval frameworks',
  'Input validation',
  'Data auditing',
  'Structured outputs',
];

// ── Compressed Historical Strip ──
const HistoricalStrip: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const compressProgress = spring({
    frame: frame - BEATS.HISTORICAL_COMPRESS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(compressProgress, [0, 1], [1, 0.2]);
  const opacity = interpolate(compressProgress, [0, 1], [1, 0.4]);
  const translateX = interpolate(compressProgress, [0, 1], [0, -380]);

  return (
    <div
      style={{
        position: 'absolute',
        left: 54,
        top: 300,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformOrigin: 'left center',
        opacity,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 1,
      }}
    >
      {HISTORICAL_ERAS.map((era, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: COLORS.solutionGreen,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 18,
              color: COLORS.historyGold,
              whiteSpace: 'nowrap',
            }}
          >
            {era.year}
          </div>
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 16,
              color: COLORS.textMuted,
              textTransform: 'none',
              letterSpacing: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {era.label}
          </div>
          <div
            style={{
              color: COLORS.solutionGreen,
              fontSize: 14,
              marginLeft: 4,
            }}
          >
            {'\u2713'}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Dot prefix ──
const DotPrefix: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
      marginTop: 14,
    }}
  />
);

// ── AI Section ──
const AISection: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  // AI label entrance
  const labelRelFrame = frame - BEATS.AI_LABEL_IN;
  const labelProgress = labelRelFrame >= 0
    ? spring({
        frame: labelRelFrame,
        fps,
        config: SPRING_CONFIGS.bouncy,
      })
    : 0;
  const labelScale = interpolate(labelProgress, [0, 1], [0.5, 1]);
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Divider draw
  const dividerRelFrame = frame - BEATS.DIVIDER_DRAW;
  const dividerProgress = dividerRelFrame >= 0
    ? interpolate(dividerRelFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'absolute',
        right: 54,
        top: 200,
        width: 580,
        zIndex: 2,
      }}
    >
      {/* AI — 2024 label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `scale(${labelScale})`,
          transformOrigin: 'left center',
          marginBottom: 20,
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(139,92,246,0.15)',
            border: `1px solid ${COLORS.aiPurple}`,
            borderRadius: 20,
            padding: '6px 18px',
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color: COLORS.aiPurple,
          }}
        >
          AI {'\u2014'} 2024
        </span>
      </div>

      {/* Problems section */}
      <div style={{ marginBottom: 8 }}>
        {frame >= BEATS.DIVIDER_DRAW && (
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 20,
              color: COLORS.errorRed,
              marginBottom: 8,
              opacity: dividerProgress,
            }}
          >
            PROBLEMS
          </div>
        )}
        {AI_PROBLEMS.map((problem, i) => {
          const problemStart = BEATS.AI_PROBLEMS_START + i * BEATS.PROBLEM_STAGGER;
          const relFrame = frame - problemStart;
          if (relFrame < 0) return null;

          const progress = spring({
            frame: relFrame,
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const x = interpolate(progress, [0, 1], [60, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 6,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <DotPrefix color={COLORS.errorRed} />
              <div
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.errorRed,
                }}
              >
                {problem}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashed divider */}
      <div
        style={{
          width: `${dividerProgress * 100}%`,
          height: 1,
          borderTop: `1px dashed ${COLORS.textMuted}`,
          marginTop: 16,
          marginBottom: 16,
        }}
      />

      {/* Fixes section */}
      <div>
        {frame >= BEATS.AI_FIXES_START && (
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 20,
              color: COLORS.solutionGreen,
              marginBottom: 8,
              opacity: interpolate(
                frame - BEATS.AI_FIXES_START,
                [0, 10],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            FIXES
          </div>
        )}
        {AI_FIXES.map((fix, i) => {
          const fixStart = BEATS.AI_FIXES_START + i * BEATS.FIX_STAGGER;
          const relFrame = frame - fixStart;
          if (relFrame < 0) return null;

          const progress = spring({
            frame: relFrame,
            fps,
            config: SPRING_CONFIGS.gentle,
          });
          const x = interpolate(progress, [0, 1], [-60, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                marginBottom: 6,
                opacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <DotPrefix color={COLORS.solutionGreen} />
              <div
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.solutionGreen,
                }}
              >
                {fix}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connecting lines between problem-fix pairs */}
      {frame >= BEATS.CONNECTING_LINES && (
        <svg
          width={580}
          height={400}
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            pointerEvents: 'none',
          }}
        >
          {AI_PROBLEMS.map((_, i) => {
            const lineStart = BEATS.CONNECTING_LINES + i * BEATS.LINE_STAGGER;
            const lineRelFrame = frame - lineStart;
            if (lineRelFrame < 0) return null;

            const lineProgress = interpolate(
              lineRelFrame,
              [0, 12],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Problem Y position: ~(30 + i * 48)
            // Fix Y position: ~(220 + i * 48)
            const problemY = 55 + i * 48;
            const fixY = 255 + i * 48;
            const lineLength = fixY - problemY;
            const dashOffset = lineLength * (1 - lineProgress);

            return (
              <line
                key={i}
                x1={15}
                y1={problemY}
                x2={15}
                y2={fixY}
                stroke={COLORS.insightOrange}
                strokeWidth={1}
                strokeDasharray={`${lineLength}`}
                strokeDashoffset={dashOffset}
                opacity={0.6}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

// ── Connecting Arc ──
const ConnectingArc: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.ARC_DRAW;
  if (relFrame < 0) return null;

  const arcProgress = interpolate(
    relFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Arc path from historical strip to AI section
  const pathD = 'M 120,500 C 250,300 350,300 480,400';
  const pathLength = 400; // approximate
  const dashOffset = pathLength * (1 - arcProgress);

  // "Same pattern" label
  const labelRelFrame = frame - BEATS.SAME_PATTERN_LABEL;
  const labelProgress = labelRelFrame >= 0
    ? spring({
        frame: labelRelFrame,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        <path
          d={pathD}
          fill="none"
          stroke={COLORS.insightOrange}
          strokeWidth={2}
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          opacity={0.8}
        />
      </svg>

      {/* "Same pattern" label */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4,
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 36,
            color: COLORS.insightOrange,
            fontWeight: 600,
            textAlign: 'center',
            backgroundColor: 'rgba(20,14,8,0.9)',
            padding: '8px 20px',
            borderRadius: 8,
          }}
        >
          Same pattern
        </div>
      </div>
    </>
  );
};

// ── Scene3_AIProblems ──
export const Scene3_AIProblems: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background transition: warm to dark
  const bgTransition = interpolate(
    frame,
    [0, 70],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const bgColor = bgTransition < 0.5 ? COLORS.bgWarm : COLORS.bg;

  return (
    <SceneContainer
      background={bgColor}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={285}
      fadeOutDuration={15}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Compressed historical strip on left */}
        <HistoricalStrip frame={frame} fps={fps} />

        {/* AI section on right */}
        <AISection frame={frame} fps={fps} />

        {/* Connecting arc between historical and AI */}
        <ConnectingArc frame={frame} fps={fps} />
      </div>
    </SceneContainer>
  );
};
