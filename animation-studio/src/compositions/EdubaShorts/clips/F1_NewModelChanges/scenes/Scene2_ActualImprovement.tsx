import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  TRANSITION: 0,
  WHAT_CHANGED_HEADER: 10,
  BENCHMARK_1: 30,
  BENCHMARK_1_ANIMATE: 35,
  DELTA_1: 40,
  BENCHMARK_2: 55,
  DIVIDER: 90,
  WHAT_DIDNT_HEADER: 95,
  LIST_ITEM_1: 130,
  LIST_ITEM_2: 140,
  LIST_ITEM_3: 150,
  LIST_ITEM_4: 160,
  ITEM_3_HIGHLIGHT: 170,
  SCENE_END: 210,
};

// ── Benchmark bar component ──
const BenchmarkBar: React.FC<{
  label: string;
  prevValue: string;
  newValue: string;
  prevWidth: number;
  newWidth: number;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  animateFrame: number;
}> = ({
  label,
  prevValue,
  newValue,
  prevWidth,
  newWidth,
  color,
  frame,
  fps,
  startFrame,
  animateFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Animate the new bar width
  const barRelFrame = frame - animateFrame;
  const barProgress =
    barRelFrame >= 0
      ? spring({
          frame: barRelFrame,
          fps,
          config: SPRING_CONFIGS.snappy,
        })
      : 0;
  const animatedNewWidth = interpolate(
    barProgress,
    [0, 1],
    [prevWidth, newWidth]
  );

  return (
    <div style={{ opacity, marginBottom: 20 }}>
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 26,
          color: COLORS.textMuted,
          marginBottom: 12,
        }}
      >
        {label}
      </div>

      {/* Previous bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 24,
            color: COLORS.textDim,
            minWidth: 100,
          }}
        >
          Previous
        </div>
        <div
          style={{
            height: 28,
            width: `${prevWidth}%`,
            backgroundColor: `${color}66`,
            borderRadius: 6,
          }}
        />
        <span style={{ ...TYPOGRAPHY.code, fontSize: 24, color: COLORS.textMuted }}>
          {prevValue}
        </span>
      </div>

      {/* New bar (animated width) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 24,
            color: COLORS.textBody,
            minWidth: 100,
          }}
        >
          New
        </div>
        <div
          style={{
            height: 28,
            width: `${animatedNewWidth}%`,
            backgroundColor: `${color}CC`,
            borderRadius: 6,
          }}
        />
        <span style={{ ...TYPOGRAPHY.code, fontSize: 24, color: COLORS.textBody }}>
          {newValue}
        </span>
      </div>
    </div>
  );
};

// ── Didn't-change list item ──
interface DidntChangeItem {
  text: string;
  color: string;
  startFrame: number;
  highlight?: boolean;
}

const DIDNT_CHANGE_ITEMS: DidntChangeItem[] = [
  { text: 'Your deployment pipeline', color: COLORS.textBody, startFrame: BEATS.LIST_ITEM_1 },
  { text: 'Your data quality problems', color: COLORS.textBody, startFrame: BEATS.LIST_ITEM_2 },
  {
    text: 'The 60% that should be a database',
    color: COLORS.insightOrange,
    startFrame: BEATS.LIST_ITEM_3,
    highlight: true,
  },
  { text: "Your users' actual needs", color: COLORS.textBody, startFrame: BEATS.LIST_ITEM_4 },
];

const ListItem: React.FC<{
  item: DidntChangeItem;
  frame: number;
  fps: number;
}> = ({ item, frame, fps }) => {
  const relFrame = frame - item.startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const translateX = interpolate(enterProgress, [0, 1], [20, 0]);

  // Highlight scale for item 3
  const highlightRelFrame = frame - BEATS.ITEM_3_HIGHLIGHT;
  const highlightScale =
    item.highlight && highlightRelFrame >= 0
      ? interpolate(
          spring({ frame: highlightRelFrame, fps, config: SPRING_CONFIGS.slow }),
          [0, 1],
          [1, 1.05]
        )
      : 1;

  const showBorder = item.highlight && highlightRelFrame >= 0;
  const borderOpacity =
    showBorder
      ? interpolate(
          spring({ frame: highlightRelFrame, fps, config: SPRING_CONFIGS.slow }),
          [0, 1],
          [0, 1]
        )
      : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${highlightScale})`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 16px',
        borderLeft: showBorder
          ? `4px solid rgba(245,158,11,${borderOpacity})`
          : '4px solid transparent',
        marginBottom: 8,
      }}
    >
      {/* X icon */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: `${COLORS.errorRed}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ color: COLORS.errorRed, fontSize: 18, fontWeight: 700 }}>
          {'\u2715'}
        </span>
      </div>

      {/* Text */}
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 40,
          color: item.color,
        }}
      >
        {item.text}
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene2_ActualImprovement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section headers
  const showChangedHeader = frame >= BEATS.WHAT_CHANGED_HEADER;
  const showDivider = frame >= BEATS.DIVIDER;
  const showDidntHeader = frame >= BEATS.WHAT_DIDNT_HEADER;

  // Header underline animation
  const changedUnderlineProgress =
    showChangedHeader
      ? interpolate(
          frame,
          [BEATS.WHAT_CHANGED_HEADER, BEATS.WHAT_CHANGED_HEADER + 15],
          [0, 100],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  const didntUnderlineProgress =
    showDidntHeader
      ? interpolate(
          frame,
          [BEATS.WHAT_DIDNT_HEADER, BEATS.WHAT_DIDNT_HEADER + 15],
          [0, 100],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  // Divider line fade
  const dividerOpacity = showDivider
    ? interpolate(
        frame,
        [BEATS.DIVIDER, BEATS.DIVIDER + 10],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          paddingTop: 80,
        }}
      >
        {/* WHAT CHANGED section */}
        {showChangedHeader && (
          <div style={{ marginBottom: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 8 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 30,
                  color: COLORS.solutionGreen,
                }}
              >
                WHAT CHANGED
              </span>
              {/* Animated underline */}
              <div
                style={{
                  height: 2,
                  width: `${changedUnderlineProgress}%`,
                  backgroundColor: COLORS.solutionGreen,
                  marginTop: 6,
                  maxWidth: 250,
                }}
              />
            </div>

            {/* Benchmark 1: Context Window */}
            <BenchmarkBar
              label="Context Window"
              prevValue="128K"
              newValue="1M"
              prevWidth={40}
              newWidth={85}
              color={COLORS.aiPurple}
              frame={frame}
              fps={fps}
              startFrame={BEATS.BENCHMARK_1}
              animateFrame={BEATS.BENCHMARK_1_ANIMATE}
            />

            {/* Delta for benchmark 1 */}
            {frame >= BEATS.DELTA_1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: 16,
                  marginTop: -8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: COLORS.solutionGreen, fontSize: 14 }}>{'\u25B2'}</span>
                  <CountUp
                    to={8}
                    from={1}
                    startFrame={BEATS.DELTA_1}
                    duration={30}
                    suffix="x"
                    color={COLORS.solutionGreen}
                    fontSize={40}
                    useSpring
                  />
                </div>
              </div>
            )}

            {/* Benchmark 2: Reasoning */}
            <BenchmarkBar
              label="Reasoning (GPQA)"
              prevValue="71.2%"
              newValue="74.8%"
              prevWidth={71}
              newWidth={75}
              color={COLORS.aiPurple}
              frame={frame}
              fps={fps}
              startFrame={BEATS.BENCHMARK_2}
              animateFrame={BEATS.BENCHMARK_2 + 5}
            />

            {/* Delta for benchmark 2 (small) */}
            {frame >= BEATS.BENCHMARK_2 + 15 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: -8,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 36,
                    color: COLORS.insightOrange,
                  }}
                >
                  +3.6%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        {showDivider && (
          <div
            style={{
              height: 1,
              backgroundColor: COLORS.panelBorder,
              opacity: dividerOpacity,
              marginBottom: 24,
            }}
          />
        )}

        {/* WHAT DIDN'T CHANGE section */}
        {showDidntHeader && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 30,
                  color: COLORS.errorRed,
                }}
              >
                {"WHAT DIDN'T CHANGE"}
              </span>
              <div
                style={{
                  height: 2,
                  width: `${didntUnderlineProgress}%`,
                  backgroundColor: COLORS.errorRed,
                  marginTop: 6,
                  maxWidth: 330,
                }}
              />
            </div>

            {/* List items */}
            {DIDNT_CHANGE_ITEMS.map((item, i) => (
              <ListItem key={i} item={item} frame={frame} fps={fps} />
            ))}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
