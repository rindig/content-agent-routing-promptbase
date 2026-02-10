import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  CHAT_SHRINK: 0,
  PROB_BARS_1: 30,
  WORD_SELECT_1: 70,
  PROB_BARS_2: 100,
  PROB_BARS_3: 140,
  INSIGHT_LABEL: 180,
  NETWORK_ICONS: 220,
};

// ── Probability data ──
const ROUND_1 = [
  { word: 'invented', prob: 0.85 },
  { word: 'created', prob: 0.45 },
  { word: 'built', prob: 0.3 },
  { word: 'discovered', prob: 0.2 },
  { word: 'was', prob: 0.15 },
  { word: 'originated', prob: 0.1 },
] as const;

const ROUND_2 = [
  { word: 'in', prob: 0.78 },
  { word: 'by', prob: 0.5 },
  { word: 'during', prob: 0.2 },
  { word: 'around', prob: 0.12 },
  { word: 'before', prob: 0.08 },
] as const;

const ROUND_3 = [
  { word: '1817', prob: 0.32 },
  { word: '1860', prob: 0.28 },
  { word: '1790', prob: 0.22 },
  { word: '1900', prob: 0.18 },
  { word: '1850', prob: 0.16 },
  { word: '1830', prob: 0.14 },
] as const;

// ── Probability Bars ──
const ProbabilityBars: React.FC<{
  data: ReadonlyArray<{ word: string; prob: number }>;
  frame: number;
  fps: number;
  startFrame: number;
  barColor: string;
  highlightWinner?: boolean;
  highlightFrame?: number;
}> = ({
  data,
  frame,
  fps,
  startFrame,
  barColor,
  highlightWinner = false,
  highlightFrame = 0,
}) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const maxProb = Math.max(...data.map((d) => d.prob));
  const barMaxWidth = 480;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        maxWidth: 820,
      }}
    >
      {data.map((item, i) => {
        const barProgress = spring({
          frame: Math.max(0, rel - i * 4),
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const barWidth = interpolate(
          barProgress,
          [0, 1],
          [0, (item.prob / maxProb) * barMaxWidth]
        );
        const barOpacity = interpolate(barProgress, [0, 1], [0, 1]);

        const isWinner = item.prob === maxProb;

        // Highlight pulse for winner
        let pulseOpacity = item.prob;
        if (highlightWinner && isWinner && frame >= highlightFrame) {
          const pulseRel = frame - highlightFrame;
          const cycle = (pulseRel % 15) / 15;
          pulseOpacity = interpolate(
            Math.sin(cycle * Math.PI * 2),
            [-1, 1],
            [0.3, 0.8]
          );
        }

        return (
          <div
            key={item.word}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: barOpacity,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: COLORS.textMuted,
                minWidth: 140,
                textAlign: 'right',
              }}
            >
              {item.word}
            </span>
            <div
              style={{
                height: 20,
                width: barWidth,
                backgroundColor: barColor,
                opacity: pulseOpacity,
                borderRadius: 4,
                transition: 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// ── Network Icon ──
const NetworkIcon: React.FC<{
  type: 'dense' | 'sparse';
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  label: string;
  markType: 'check' | 'x';
}> = ({ type, color, frame, fps, startFrame, label, markType }) => {
  const rel = frame - startFrame;
  if (rel < 0) return null;

  const enterProgress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const scale = interpolate(enterProgress, [0, 1], [0.8, 1]);

  const size = 120;
  const isDense = type === 'dense';

  // Node positions
  const nodes: Array<{ cx: number; cy: number }> = isDense
    ? [
        { cx: 30, cy: 30 },
        { cx: 60, cy: 15 },
        { cx: 90, cy: 35 },
        { cx: 20, cy: 60 },
        { cx: 50, cy: 55 },
        { cx: 80, cy: 65 },
        { cx: 45, cy: 85 },
        { cx: 75, cy: 90 },
        { cx: 60, cy: 45 },
        { cx: 100, cy: 55 },
      ]
    : [
        { cx: 25, cy: 30 },
        { cx: 70, cy: 25 },
        { cx: 90, cy: 70 },
        { cx: 35, cy: 80 },
      ];

  // Lines between nodes (connections)
  const connections: Array<[number, number]> = isDense
    ? [
        [0, 1], [1, 2], [0, 3], [3, 4], [4, 5],
        [1, 4], [2, 5], [4, 6], [5, 7], [4, 8],
        [8, 9], [2, 9], [6, 7], [0, 4], [1, 8],
      ]
    : [[0, 1], [2, 3]];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Connections */}
        {connections.map(([a, b], i) => (
          <line
            key={`l-${i}`}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke={color}
            strokeWidth={1}
            opacity={isDense ? 0.25 : 0.15}
          />
        ))}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <circle
            key={`n-${i}`}
            cx={n.cx}
            cy={n.cy}
            r={isDense ? 5 : 6}
            fill={color}
            opacity={isDense
              ? interpolate(i, [0, nodes.length - 1], [0.5, 1.0])
              : interpolate(i, [0, nodes.length - 1], [0.3, 0.8])
            }
          />
        ))}
      </svg>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 28,
            color: markType === 'check' ? COLORS.solutionGreen : COLORS.errorRed,
            fontWeight: 700,
          }}
        >
          {markType === 'check' ? '\u2713' : '\u2717'}
        </span>
      </div>
    </div>
  );
};

// ── Scene2_ProbabilityMachine ──
export const Scene2_ProbabilityMachine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sentence building state
  const sentenceParts: string[] = ['The bicycle was'];
  if (frame >= BEATS.WORD_SELECT_1) sentenceParts.push('invented');
  if (frame >= BEATS.PROB_BARS_2 + 40) sentenceParts.push('in');
  if (frame >= BEATS.PROB_BARS_3 + 40) sentenceParts.push('____');

  // Determine which round to show
  const showRound1 = frame >= BEATS.PROB_BARS_1 && frame < BEATS.PROB_BARS_2;
  const showRound2 = frame >= BEATS.PROB_BARS_2 && frame < BEATS.PROB_BARS_3;
  const showRound3 = frame >= BEATS.PROB_BARS_3 && frame < BEATS.INSIGHT_LABEL;

  // Sentence entrance
  const sentenceProgress = spring({
    frame: Math.max(0, frame - BEATS.PROB_BARS_1),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const sentenceOpacity = interpolate(sentenceProgress, [0, 1], [0, 1]);

  // Insight labels
  const showInsight = frame >= BEATS.INSIGHT_LABEL;
  const showNetworks = frame >= BEATS.NETWORK_ICONS;

  // Probability bars fade out for insight
  const barsFade = frame >= BEATS.INSIGHT_LABEL
    ? interpolate(
        frame,
        [BEATS.INSIGHT_LABEL, BEATS.INSIGHT_LABEL + 20],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Update sentence for round 3
  const sentenceText =
    frame >= BEATS.PROB_BARS_3 + 40
      ? 'The bicycle was invented in ____'
      : frame >= BEATS.PROB_BARS_2 + 40
        ? 'The bicycle was invented in ____'
        : frame >= BEATS.WORD_SELECT_1
          ? 'The bicycle was invented ____'
          : 'The bicycle was ____';

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          height: '100%',
          paddingTop: 160,
          gap: 32,
        }}
      >
        {/* Forming sentence at top */}
        <div style={{ opacity: sentenceOpacity, marginBottom: 8 }}>
          <span
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 32,
              color: COLORS.textBody,
            }}
          >
            {sentenceText}
          </span>
        </div>

        {/* Probability bars section */}
        <div style={{ opacity: barsFade, width: '100%', display: 'flex', justifyContent: 'center' }}>
          {showRound1 && (
            <ProbabilityBars
              data={ROUND_1}
              frame={frame}
              fps={fps}
              startFrame={BEATS.PROB_BARS_1}
              barColor={COLORS.techBlue}
              highlightWinner
              highlightFrame={BEATS.WORD_SELECT_1}
            />
          )}
          {showRound2 && (
            <ProbabilityBars
              data={ROUND_2}
              frame={frame}
              fps={fps}
              startFrame={BEATS.PROB_BARS_2}
              barColor={COLORS.techBlue}
            />
          )}
          {showRound3 && (
            <ProbabilityBars
              data={ROUND_3}
              frame={frame}
              fps={fps}
              startFrame={BEATS.PROB_BARS_3}
              barColor={COLORS.insightOrange}
            />
          )}
        </div>

        {/* Insight labels */}
        {showInsight && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              maxWidth: 860,
              textAlign: 'center',
            }}
          >
            <BlurText
              startFrame={BEATS.INSIGHT_LABEL}
              animateBy="words"
              staggerDelay={3}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.errorRed}
            >
              Weak pattern = Confident mistake
            </BlurText>

            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: COLORS.textMuted,
                  opacity: interpolate(
                    frame,
                    [BEATS.INSIGHT_LABEL + 15, BEATS.INSIGHT_LABEL + 30],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                }}
              >
                Strong pattern = many training examples
              </span>
            </div>

            <div>
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 36,
                  color: `${COLORS.errorRed}CC`,
                  opacity: interpolate(
                    frame,
                    [BEATS.INSIGHT_LABEL + 25, BEATS.INSIGHT_LABEL + 40],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                }}
              >
                Weak pattern = fewer, conflicting examples
              </span>
            </div>
          </div>
        )}

        {/* Network Icons */}
        {showNetworks && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 80,
              marginTop: 24,
            }}
          >
            <NetworkIcon
              type="dense"
              color={COLORS.techBlue}
              frame={frame}
              fps={fps}
              startFrame={BEATS.NETWORK_ICONS}
              label="Strong pattern"
              markType="check"
            />
            <NetworkIcon
              type="sparse"
              color={COLORS.errorRed}
              frame={frame}
              fps={fps}
              startFrame={BEATS.NETWORK_ICONS + 10}
              label="Weak pattern"
              markType="x"
            />
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
