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
  WARM_BG_IN: 0,
  PAIR_1_NODE: 20,
  PAIR_1_FAIL: 35,
  PAIR_1_FIX: 60,
  PAIR_1_CHECK: 80,
  PAIR_2_SCROLL: 100,
  PAIR_2_FAIL: 105,
  PAIR_2_FIX: 130,
  PAIR_2_CHECK: 150,
  PAIR_3_SCROLL: 180,
  PAIR_3_FAIL: 185,
  PAIR_3_FIX: 210,
  PAIR_3_CHECK: 230,
  PAIR_4_SCROLL: 260,
  PAIR_4_FAIL: 265,
  PAIR_4_FIX: 290,
  PAIR_4_CHECK: 310,
  PATTERN_LABEL: 340,
};

// ── Failure/Fix pair data ──
interface FailFixPair {
  year: string;
  failure: string;
  fix: string;
  nodeStart: number;
  failStart: number;
  fixStart: number;
  checkStart: number;
  scrollStart: number;
}

const PAIRS: FailFixPair[] = [
  {
    year: '1947',
    failure: 'Moth shorts relay',
    fix: 'Debugging',
    nodeStart: BEATS.PAIR_1_NODE,
    failStart: BEATS.PAIR_1_FAIL,
    fixStart: BEATS.PAIR_1_FIX,
    checkStart: BEATS.PAIR_1_CHECK,
    scrollStart: 0,
  },
  {
    year: '1960s',
    failure: 'Programs crash each other',
    fix: 'Process Isolation',
    nodeStart: BEATS.PAIR_2_SCROLL + 5,
    failStart: BEATS.PAIR_2_FAIL,
    fixStart: BEATS.PAIR_2_FIX,
    checkStart: BEATS.PAIR_2_CHECK,
    scrollStart: BEATS.PAIR_2_SCROLL,
  },
  {
    year: '1970s',
    failure: 'Data corrupts in transit',
    fix: 'TCP/IP checksums',
    nodeStart: BEATS.PAIR_3_SCROLL + 5,
    failStart: BEATS.PAIR_3_FAIL,
    fixStart: BEATS.PAIR_3_FIX,
    checkStart: BEATS.PAIR_3_CHECK,
    scrollStart: BEATS.PAIR_3_SCROLL,
  },
  {
    year: '1994',
    failure: 'Chip does math wrong',
    fix: 'Independent validation',
    nodeStart: BEATS.PAIR_4_SCROLL + 5,
    failStart: BEATS.PAIR_4_FAIL,
    fixStart: BEATS.PAIR_4_FIX,
    checkStart: BEATS.PAIR_4_CHECK,
    scrollStart: BEATS.PAIR_4_SCROLL,
  },
];

const SCROLL_PER_PAIR = 220;

// ── Timeline Node ──
const TimelineNode: React.FC<{
  year: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ year, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const nodeProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(nodeProgress, [0, 1], [0, 1]);
  const opacity = interpolate(nodeProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
        marginBottom: 8,
      }}
    >
      {/* Timeline dot */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: COLORS.historyGold,
          boxShadow: `0 0 12px ${COLORS.glowGold}`,
          flexShrink: 0,
        }}
      />
      {/* Year badge */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          color: COLORS.historyGold,
          letterSpacing: 2,
        }}
      >
        {year}
      </div>
    </div>
  );
};

// ── Failure Panel ──
const FailurePanel: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const x = interpolate(enterProgress, [0, 1], [-80, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(239,68,68,0.08)',
          borderLeft: `3px solid ${COLORS.errorRed}`,
          borderRadius: 8,
          padding: '12px 20px',
          flex: 1,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 32,
            color: COLORS.errorRed,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ── Fix Panel ──
const FixPanel: React.FC<{
  text: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ text, frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const x = interpolate(enterProgress, [0, 1], [80, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Arrow */}
      <div
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 28,
          color: COLORS.textMuted,
          flexShrink: 0,
        }}
      >
        {'\u2192'}
      </div>
      <div
        style={{
          backgroundColor: 'rgba(16,185,129,0.08)',
          borderLeft: `3px solid ${COLORS.solutionGreen}`,
          borderRadius: 8,
          padding: '12px 20px',
          flex: 1,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 32,
            color: COLORS.solutionGreen,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ── Checkmark ──
const Checkmark: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const checkProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(checkProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: 20,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(16,185,129,0.15)',
          border: `2px solid ${COLORS.solutionGreen}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: COLORS.solutionGreen,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {'\u2713'}
        </span>
      </div>
    </div>
  );
};

// ── Failure/Fix Pair Group ──
const PairGroup: React.FC<{
  pair: FailFixPair;
  frame: number;
  fps: number;
}> = ({ pair, frame, fps }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <TimelineNode
        year={pair.year}
        frame={frame}
        fps={fps}
        startFrame={pair.nodeStart}
      />
      <div style={{ marginLeft: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <FailurePanel
          text={pair.failure}
          frame={frame}
          fps={fps}
          startFrame={pair.failStart}
        />
        <FixPanel
          text={pair.fix}
          frame={frame}
          fps={fps}
          startFrame={pair.fixStart}
        />
        <Checkmark
          frame={frame}
          fps={fps}
          startFrame={pair.checkStart}
        />
      </div>
    </div>
  );
};

// ── Scene2_FailuresAndFixes ──
export const Scene2_FailuresAndFixes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate vertical scroll offset based on which pair we're on
  let scrollOffset = 0;
  for (let i = 1; i < PAIRS.length; i++) {
    if (frame >= PAIRS[i].scrollStart) {
      const scrollProgress = spring({
        frame: frame - PAIRS[i].scrollStart,
        fps,
        config: SPRING_CONFIGS.gentle,
      });
      scrollOffset = i * SCROLL_PER_PAIR * scrollProgress;
    }
  }

  // Pattern label at the end
  const showPatternLabel = frame >= BEATS.PATTERN_LABEL;
  const patternProgress = showPatternLabel
    ? spring({
        frame: frame - BEATS.PATTERN_LABEL,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;
  const patternOpacity = interpolate(patternProgress, [0, 1], [0, 1]);
  const patternY = interpolate(patternProgress, [0, 1], [20, 0]);

  // Warm bg fade-in
  const warmBgOpacity = interpolate(
    frame,
    [BEATS.WARM_BG_IN, BEATS.WARM_BG_IN + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={345}
      fadeOutDuration={15}
    >
      {/* Warm background overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(201,162,39,0.05) 0%, transparent 70%)`,
          opacity: warmBgOpacity,
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          padding: '96px 54px',
        }}
      >
        {/* Scrollable timeline container */}
        <div
          style={{
            transform: `translateY(${-scrollOffset}px)`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Vertical timeline spine */}
          <div
            style={{
              position: 'absolute',
              left: 63,
              top: 0,
              width: 2,
              height: PAIRS.length * SCROLL_PER_PAIR + 200,
              backgroundColor: COLORS.panelBorder,
            }}
          />

          {/* Pairs */}
          {PAIRS.map((pair, i) => (
            <PairGroup key={i} pair={pair} frame={frame} fps={fps} />
          ))}
        </div>

        {/* Pattern label at bottom */}
        {showPatternLabel && (
          <div
            style={{
              position: 'absolute',
              bottom: 140,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: patternOpacity,
              transform: `translateY(${patternY}px)`,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.insightOrange,
                textAlign: 'center',
                fontWeight: 600,
              }}
            >
              Failure {'\u2192'} Fix {'\u2192'} Trust
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
