import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  PIPELINE_SLIDE_UP: 0,
  GRID_APPEAR: 30,
  DATA_POINTS_START: 40,
  DATA_POINTS_END: 90,
  CONSTELLATION_LINES: 100,
  FINGERPRINT_LABEL: 110,
  MORPH_TO_WAVEFORM: 150,
  COMPARISON_WAVEFORMS: 190,
  MATCH_COUNTUP: 200,
  SCENE_END: 240,
};

// ── Data Points for the vocal fingerprint map ──
interface DataPoint {
  x: number;
  y: number;
  color: string;
  // Target positions for the waveform morph
  morphX: number;
  morphY: number;
}

const generateDataPoints = (): DataPoint[] => {
  const points: DataPoint[] = [];
  const colorsByFreq = [COLORS.techBlue, COLORS.solutionGreen, COLORS.insightOrange, COLORS.aiPurple];

  for (let i = 0; i < 40; i++) {
    const seed = i * 3.14159;
    const x = 60 + (i % 10) * 68 + Math.sin(seed) * 20;
    const y = 40 + Math.floor(i / 10) * 120 + Math.cos(seed * 1.7) * 40;
    const freqBand = Math.floor(i / 10);
    const color = colorsByFreq[freqBand];

    // Morph target: arrange into a waveform-like shape
    const morphX = 40 + (i / 40) * 720;
    const waveVal = Math.sin((i / 40) * Math.PI * 4) * 80;
    const morphY = 250 + waveVal;

    points.push({ x, y, color, morphX, morphY });
  }
  return points;
};

const DATA_POINTS: DataPoint[] = generateDataPoints();

// ── Connection lines between nearby points ──
interface Connection {
  from: number;
  to: number;
}

const generateConnections = (): Connection[] => {
  const conns: Connection[] = [];
  for (let i = 0; i < DATA_POINTS.length; i++) {
    for (let j = i + 1; j < DATA_POINTS.length; j++) {
      const dx = DATA_POINTS[i].x - DATA_POINTS[j].x;
      const dy = DATA_POINTS[i].y - DATA_POINTS[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        conns.push({ from: i, to: j });
      }
    }
  }
  return conns;
};

const CONNECTIONS: Connection[] = generateConnections();

// ── Compact waveform bars ──
const COMPACT_BAR_COUNT = 24;
const generateCompactBars = (seed: number): number[] => {
  const bars: number[] = [];
  for (let i = 0; i < COMPACT_BAR_COUNT; i++) {
    const x = (i + seed) * 2.1;
    bars.push(0.3 + 0.7 * Math.abs(Math.sin(x * 0.7) * Math.cos(x * 1.1)));
  }
  return bars;
};

const ORIGINAL_COMPACT = generateCompactBars(42);
const RECONSTRUCTED_COMPACT = generateCompactBars(42.3);

// ── Compact Waveform ──
const CompactWaveform: React.FC<{
  bars: number[];
  color: string;
  width?: number;
  height?: number;
}> = ({ bars, color, width = 280, height = 50 }) => {
  const barWidth = (width / bars.length) * 0.65;
  const barGap = (width / bars.length) * 0.35;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: barGap, width, height }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            height: h * height * 0.8,
            backgroundColor: color,
            borderRadius: 1.5,
          }}
        />
      ))}
    </div>
  );
};

// ── Main Scene ──
export const Scene3_Fingerprint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Voice model circle slides up and repositions
  const slideUpProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const modelY = interpolate(slideUpProgress, [0, 1], [0, -200]);
  const modelOpacity = interpolate(slideUpProgress, [0, 1], [1, 0]);

  // Grid appearance
  const showGrid = frame >= BEATS.GRID_APPEAR;
  const gridOpacity = showGrid
    ? interpolate(
        frame,
        [BEATS.GRID_APPEAR, BEATS.GRID_APPEAR + 15],
        [0, 0.15],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Morph progress (0 = original position, 1 = waveform position)
  const morphProgress = frame >= BEATS.MORPH_TO_WAVEFORM
    ? interpolate(
        spring({
          frame: frame - BEATS.MORPH_TO_WAVEFORM,
          fps,
          config: SPRING_CONFIGS.slow,
        }),
        [0, 1],
        [0, 1]
      )
    : 0;

  // Comparison section
  const showComparison = frame >= BEATS.COMPARISON_WAVEFORMS;
  const comparisonProgress = showComparison
    ? spring({
        frame: frame - BEATS.COMPARISON_WAVEFORMS,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

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
          paddingTop: 100,
          position: 'relative',
        }}
      >
        {/* Previous pipeline sliding up (ghost) */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            opacity: modelOpacity,
            transform: `translateY(${modelY}px)`,
            pointerEvents: 'none',
          }}
        />

        {/* Axis labels */}
        {showGrid && (
          <>
            <span
              style={{
                position: 'absolute',
                left: 30,
                top: 750,
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                opacity: gridOpacity * 4,
                transform: 'rotate(-90deg)',
                transformOrigin: 'center center',
              }}
            >
              Amplitude
            </span>
            <span
              style={{
                position: 'absolute',
                bottom: 540,
                left: '50%',
                transform: 'translateX(-50%)',
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                opacity: gridOpacity * 4,
              }}
            >
              Frequency
            </span>
          </>
        )}

        {/* Coordinate grid + data points */}
        <div
          style={{
            position: 'relative',
            width: 800,
            height: 500,
            marginTop: 40,
          }}
        >
          {/* Grid lines */}
          {showGrid && (
            <svg
              width={800}
              height={500}
              viewBox="0 0 800 500"
              style={{ position: 'absolute', top: 0, left: 0, opacity: gridOpacity }}
            >
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={`h${i}`}
                  x1={0}
                  y1={i * 100}
                  x2={800}
                  y2={i * 100}
                  stroke={COLORS.textMuted}
                  strokeWidth={0.5}
                />
              ))}
              {/* Vertical grid lines */}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line
                  key={`v${i}`}
                  x1={i * 100}
                  y1={0}
                  x2={i * 100}
                  y2={500}
                  stroke={COLORS.textMuted}
                  strokeWidth={0.5}
                />
              ))}
            </svg>
          )}

          {/* Connection lines (constellation) */}
          {frame >= BEATS.CONSTELLATION_LINES && (
            <svg
              width={800}
              height={500}
              viewBox="0 0 800 500"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {CONNECTIONS.map((conn, i) => {
                const lineDelay = i * 0.5;
                const lineProgress = interpolate(
                  frame - BEATS.CONSTELLATION_LINES,
                  [lineDelay, lineDelay + 10],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                const fromPt = DATA_POINTS[conn.from];
                const toPt = DATA_POINTS[conn.to];

                // Apply morph
                const x1 = interpolate(morphProgress, [0, 1], [fromPt.x, fromPt.morphX]);
                const y1 = interpolate(morphProgress, [0, 1], [fromPt.y, fromPt.morphY]);
                const x2 = interpolate(morphProgress, [0, 1], [toPt.x, toPt.morphX]);
                const y2 = interpolate(morphProgress, [0, 1], [toPt.y, toPt.morphY]);

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={COLORS.textMuted}
                    strokeWidth={1}
                    opacity={lineProgress * 0.3}
                  />
                );
              })}
            </svg>
          )}

          {/* Data points */}
          {DATA_POINTS.map((pt, i) => {
            const pointDelay = BEATS.DATA_POINTS_START + (i / DATA_POINTS.length) * (BEATS.DATA_POINTS_END - BEATS.DATA_POINTS_START);
            if (frame < pointDelay) return null;

            const pointProgress = spring({
              frame: frame - pointDelay,
              fps,
              config: SPRING_CONFIGS.bouncy,
            });

            // Glow pulse on appearance
            const glowFrame = frame - pointDelay;
            const glowOpacity = glowFrame < 10
              ? interpolate(glowFrame, [0, 3, 10], [0, 0.6, 0])
              : 0;

            // Apply morph
            const x = interpolate(morphProgress, [0, 1], [pt.x, pt.morphX]);
            const y = interpolate(morphProgress, [0, 1], [pt.y, pt.morphY]);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - 4,
                  top: y - 4,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: pt.color,
                  transform: `scale(${pointProgress})`,
                  boxShadow: `0 0 8px ${pt.color}`,
                  opacity: pointProgress,
                }}
              >
                {glowOpacity > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: pt.color,
                      opacity: glowOpacity,
                      filter: 'blur(4px)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Fingerprint label */}
        {frame >= BEATS.FINGERPRINT_LABEL && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <AnimatedText
              variant="title"
              size={52}
              color="#FFFFFF"
              entrance="slideUp"
              startFrame={BEATS.FINGERPRINT_LABEL}
            >
              Vocal Fingerprint
            </AnimatedText>
          </div>
        )}

        {/* Comparison waveforms + match % */}
        {showComparison && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginTop: 32,
              opacity: comparisonProgress,
              transform: `translateY(${interpolate(comparisonProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            {/* Original */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.techBlue,
                  width: 140,
                  textAlign: 'right',
                }}
              >
                Original
              </span>
              <CompactWaveform bars={ORIGINAL_COMPACT} color={COLORS.techBlue} />
            </div>

            {/* Reconstructed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.aiPurple,
                  width: 140,
                  textAlign: 'right',
                }}
              >
                Reconstructed
              </span>
              <CompactWaveform bars={RECONSTRUCTED_COMPACT} color={COLORS.aiPurple} />
            </div>

            {/* Match percentage */}
            {frame >= BEATS.MATCH_COUNTUP && (
              <div style={{ marginTop: 8 }}>
                <CountUp
                  to={99.7}
                  from={0}
                  startFrame={BEATS.MATCH_COUNTUP}
                  duration={30}
                  suffix="%"
                  separator=""
                  decimals={1}
                  useSpring
                  color={COLORS.solutionGreen}
                  fontSize={44}
                />
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                    marginTop: 4,
                  }}
                >
                  match
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
