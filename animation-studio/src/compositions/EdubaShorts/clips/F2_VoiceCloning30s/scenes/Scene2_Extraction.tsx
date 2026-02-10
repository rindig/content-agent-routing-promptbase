import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start, Scene 2 starts at frame 90 globally) ──
const BEATS = {
  WAVEFORMS_EXIT: 0,
  INPUT_STRIP: 30,
  TIMER_START: 35,
  INPUT_LABEL: 45,
  ARROW_DOWN: 60,
  BREATHING_CARD: 65,
  PACING_CARD: 77,
  VOCAL_TICS_CARD: 89,
  CONVERGENCE_LINES: 120,
  VOICE_MODEL_NODE: 140,
  PIPELINE_COMPLETE: 170,
  SUMMARY_TEXT: 175,
  SCENE_END: 210,
};

// ── Mini waveform bars for input strip ──
const INPUT_BAR_COUNT = 40;
const inputBarHeights: number[] = [];
for (let i = 0; i < INPUT_BAR_COUNT; i++) {
  const x = i * 1.618;
  inputBarHeights.push(
    0.2 + 0.8 * Math.abs(Math.sin(x * 0.5) * Math.cos(x * 1.2))
  );
}

// ── Mini waveform for voice model node ──
const MODEL_BAR_COUNT = 20;
const modelBarHeights: number[] = [];
for (let i = 0; i < MODEL_BAR_COUNT; i++) {
  const x = (i + 7) * 2.1;
  modelBarHeights.push(
    0.3 + 0.7 * Math.abs(Math.sin(x * 0.8) * Math.cos(x * 0.9))
  );
}

// ── Compact Waveform Strip ──
const WaveformStrip: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const barWidth = 600 / INPUT_BAR_COUNT * 0.65;
  const barGap = 600 / INPUT_BAR_COUNT * 0.35;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: barGap,
        width: 600,
        height: 60,
        opacity: enterProgress,
        transform: `translateY(${interpolate(enterProgress, [0, 1], [20, 0])}px)`,
      }}
    >
      {inputBarHeights.map((h, i) => {
        const drawDelay = (i / INPUT_BAR_COUNT) * 15;
        const barProgress = interpolate(
          relFrame,
          [drawDelay, drawDelay + 5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: h * 50 * barProgress,
              backgroundColor: COLORS.techBlue,
              borderRadius: 1.5,
            }}
          />
        );
      })}
    </div>
  );
};

// ── SVG Arrow Down ──
const ArrowDown: React.FC<{
  frame: number;
  startFrame: number;
  color: string;
  height?: number;
}> = ({ frame, startFrame, color, height = 50 }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const totalLength = height + 20;
  const dashOffset = totalLength * (1 - drawProgress);

  return (
    <svg
      width={20}
      height={height}
      viewBox={`0 0 20 ${height}`}
      style={{ display: 'block', margin: '0 auto' }}
    >
      <line
        x1={10}
        y1={0}
        x2={10}
        y2={height - 10}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
      <polyline
        points={`4,${height - 14} 10,${height - 4} 16,${height - 14}`}
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};

// ── Extraction Card ──
interface CardConfig {
  label: string;
  borderColor: string;
  startFrame: number;
  visualType: 'breath' | 'rhythm' | 'spectrum';
}

const CARDS: CardConfig[] = [
  { label: 'Breathing patterns', borderColor: COLORS.solutionGreen, startFrame: BEATS.BREATHING_CARD, visualType: 'breath' },
  { label: 'Pacing & rhythm', borderColor: COLORS.insightOrange, startFrame: BEATS.PACING_CARD, visualType: 'rhythm' },
  { label: 'Vocal tics & formants', borderColor: COLORS.aiPurple, startFrame: BEATS.VOCAL_TICS_CARD, visualType: 'spectrum' },
];

const BreathCurve: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Two breath cycles
  const pathLength = 200;
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <svg width={160} height={40} viewBox="0 0 160 40">
      <path
        d="M0,30 Q20,5 40,30 Q60,5 80,30 Q100,5 120,30 Q140,5 160,30"
        fill="none"
        stroke={COLORS.solutionGreen}
        strokeWidth={2}
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={0.8}
      />
    </svg>
  );
};

const RhythmDots: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  // Morse-like: dot=short, dash=long
  const pattern: Array<{ type: 'dot' | 'dash' }> = [
    { type: 'dot' }, { type: 'dot' }, { type: 'dash' },
    { type: 'dot' }, { type: 'dash' }, { type: 'dash' },
    { type: 'dot' }, { type: 'dot' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40 }}>
      {pattern.map((p, i) => {
        const itemDelay = i * 2;
        const itemOpacity = interpolate(
          relFrame,
          [itemDelay, itemDelay + 5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              width: p.type === 'dot' ? 8 : 24,
              height: 6,
              borderRadius: 3,
              backgroundColor: COLORS.insightOrange,
              opacity: itemOpacity,
            }}
          />
        );
      })}
    </div>
  );
};

const SpectrumBars: React.FC<{ frame: number }> = ({ frame }) => {
  const barHeights = [0.4, 0.8, 0.6, 1.0, 0.5];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 40 }}>
      {barHeights.map((h, i) => {
        // Oscillating bars at different phases
        const oscillation = Math.sin(frame * 0.15 + i * 1.5) * 2;
        const barH = h * 30 + oscillation;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: Math.max(4, barH),
              backgroundColor: COLORS.aiPurple,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
};

const ExtractionCard: React.FC<{
  config: CardConfig;
  frame: number;
  fps: number;
}> = ({ config, frame, fps }) => {
  const relFrame = frame - config.startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const y = interpolate(enterProgress, [0, 1], [30, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        width: 700,
        height: 80,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        borderLeft: `4px solid ${config.borderColor}`,
        paddingLeft: 20,
        paddingRight: 20,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          color: COLORS.textBody,
          flex: 1,
          textTransform: 'none',
          letterSpacing: 0,
          fontWeight: 500,
        }}
      >
        {config.label}
      </span>
      <div style={{ flexShrink: 0 }}>
        {config.visualType === 'breath' && (
          <BreathCurve frame={frame} startFrame={config.startFrame + 5} />
        )}
        {config.visualType === 'rhythm' && (
          <RhythmDots frame={frame} startFrame={config.startFrame + 5} />
        )}
        {config.visualType === 'spectrum' && <SpectrumBars frame={frame} />}
      </div>
    </div>
  );
};

// ── Convergence Lines (dashed, flowing down) ──
const ConvergenceLines: React.FC<{
  frame: number;
  startFrame: number;
}> = ({ frame, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [
    { x1: 150, y1: 0, x2: 250, y2: 60 },
    { x1: 250, y1: 0, x2: 250, y2: 60 },
    { x1: 350, y1: 0, x2: 250, y2: 60 },
  ];

  return (
    <svg width={500} height={60} viewBox="0 0 500 60" style={{ display: 'block', margin: '0 auto' }}>
      {lines.map((line, i) => {
        const len = Math.sqrt((line.x2 - line.x1) ** 2 + (line.y2 - line.y1) ** 2);
        const offset = len * (1 - drawProgress);
        return (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={COLORS.textMuted}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            strokeDashoffset={offset}
            opacity={0.3 + drawProgress * 0.4}
          />
        );
      })}
    </svg>
  );
};

// ── Voice Model Node ──
const VoiceModelNode: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ frame, fps, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Gentle pulse after complete
  const pulseFrame = frame - (startFrame + 30);
  const pulseScale = pulseFrame > 0
    ? 1 + 0.05 * Math.sin(pulseFrame * (Math.PI / 30))
    : 1;

  // Rotating gradient angle
  const gradientAngle = (frame * 2) % 360;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        opacity,
        transform: `scale(${scale * pulseScale})`,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `conic-gradient(from ${gradientAngle}deg, ${COLORS.techBlue}, ${COLORS.solutionGreen}, ${COLORS.insightOrange}, ${COLORS.aiPurple}, ${COLORS.techBlue})`,
          padding: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 114,
            height: 114,
            borderRadius: '50%',
            backgroundColor: COLORS.bgSurface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Tiny waveform inside */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {modelBarHeights.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: h * 40,
                  backgroundColor: COLORS.textPrimary,
                  borderRadius: 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          color: COLORS.textPrimary,
          textTransform: 'none',
          letterSpacing: 0,
        }}
      >
        Voice Model
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene2_Extraction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Previous waveforms exit (handled via wrapper opacity/translate)
  const exitProgress = interpolate(frame, [0, 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitY = interpolate(exitProgress, [0, 1], [-100, 0]);

  const showSummary = frame >= BEATS.SUMMARY_TEXT;

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
          paddingTop: 120,
          gap: 12,
        }}
      >
        {/* Previous scene waveforms fading out */}
        {exitProgress > 0.01 && (
          <div
            style={{
              opacity: exitProgress,
              transform: `translateY(${exitY}px)`,
              height: 0,
              overflow: 'visible',
              position: 'absolute',
              top: 100,
            }}
          />
        )}

        {/* Input audio strip */}
        <WaveformStrip frame={frame} fps={fps} startFrame={BEATS.INPUT_STRIP} />

        {/* Timer: counting to 30s */}
        {frame >= BEATS.TIMER_START && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <CountUp
              to={30}
              from={0}
              startFrame={BEATS.TIMER_START}
              duration={25}
              suffix="s"
              separator=""
              decimals={0}
              useSpring
              color={COLORS.techBlue}
              fontSize={40}
            />
            {frame >= BEATS.INPUT_LABEL && (
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.textMuted,
                  opacity: interpolate(
                    frame,
                    [BEATS.INPUT_LABEL, BEATS.INPUT_LABEL + 10],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                }}
              >
                Raw audio input
              </span>
            )}
          </div>
        )}

        {/* Arrow from input to extraction */}
        <ArrowDown
          frame={frame}
          startFrame={BEATS.ARROW_DOWN}
          color={COLORS.techBlue}
          height={40}
        />

        {/* Extraction cards */}
        {CARDS.map((card, i) => (
          <ExtractionCard key={i} config={card} frame={frame} fps={fps} />
        ))}

        {/* Convergence lines */}
        <ConvergenceLines frame={frame} startFrame={BEATS.CONVERGENCE_LINES} />

        {/* Voice Model Node */}
        <VoiceModelNode
          frame={frame}
          fps={fps}
          startFrame={BEATS.VOICE_MODEL_NODE}
        />

        {/* Summary text */}
        {showSummary && (
          <div style={{ marginTop: 16, maxWidth: 700, textAlign: 'center' }}>
            <AnimatedText
              variant="body"
              size={40}
              color={COLORS.textBody}
              entrance="fade"
              startFrame={BEATS.SUMMARY_TEXT}
            >
              30 seconds in. Full voice out.
            </AnimatedText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
