import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  WAVEFORM_DRAW: 0,
  TRANSCRIPT_TYPE: 5,
  GENERATED_LABEL: 25,
  ARROW: 30,
  WAVEFORM_FREEZE: 45,
  ORIGINAL_WAVEFORM: 48,
  PULSE: 65,
  SAME_VOICE_TEXT: 70,
  SCENE_END: 90,
};

// ── Deterministic waveform bar heights ──
const BAR_COUNT = 32;
const generateBarHeights = (seed: number): number[] => {
  const heights: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const x = (i + seed) * 2.39996;
    const h = 0.3 + 0.7 * Math.abs(Math.sin(x * 0.7) * Math.cos(x * 1.3) * Math.sin(x * 0.3 + 1.5));
    heights.push(h);
  }
  return heights;
};

const CLONE_BARS = generateBarHeights(42);
// Original bars: < 2% variance from clone
const ORIGINAL_BARS: number[] = CLONE_BARS.map((h) => h * (0.985 + Math.random() * 0.03));

// ── Typewriter text ──
const TRANSCRIPT = '"I never said this."';
const CHARS_PER_1_5_FRAMES = 1.5;

// ── Waveform Component ──
const WaveformDisplay: React.FC<{
  bars: number[];
  color: string;
  frame: number;
  fps: number;
  drawStart: number;
  drawDuration: number;
  width?: number;
  height?: number;
  pulseFrame?: number;
}> = ({
  bars,
  color,
  frame,
  fps,
  drawStart,
  drawDuration,
  width = 700,
  height = 100,
  pulseFrame,
}) => {
  const relFrame = frame - drawStart;
  if (relFrame < 0) return null;

  const barWidth = (width / bars.length) * 0.7;
  const barGap = (width / bars.length) * 0.3;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: barGap,
        width,
        height,
      }}
    >
      {bars.map((h, i) => {
        // Draw-in: bars appear left to right
        const barDrawFrame = (i / bars.length) * drawDuration;
        const drawProgress = interpolate(
          relFrame,
          [barDrawFrame, barDrawFrame + 5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Pulse effect
        let pulseScale = 1;
        if (pulseFrame !== undefined && frame >= pulseFrame) {
          const pulseRel = frame - pulseFrame;
          const waveOffset = (i / bars.length) * 15;
          const pulseT = pulseRel - waveOffset;
          if (pulseT >= 0 && pulseT <= 15) {
            pulseScale = interpolate(pulseT, [0, 7, 15], [1, 1.1, 1]);
          }
        }

        const barHeight = h * height * drawProgress * pulseScale;

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderRadius: 2,
              opacity: drawProgress,
              transition: 'none',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Arrow SVG (animated stroke-draw) ──
const AnimatedArrow: React.FC<{
  frame: number;
  startFrame: number;
  color: string;
}> = ({ frame, startFrame, color }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const totalLength = 60;
  const dashOffset = totalLength * (1 - drawProgress);

  return (
    <svg
      width={20}
      height={60}
      viewBox="0 0 20 60"
      style={{ display: 'block', margin: '4px auto' }}
    >
      <line
        x1={10}
        y1={0}
        x2={10}
        y2={50}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
      <polyline
        points="4,44 10,54 16,44"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typewriter
  const typeFrame = frame - BEATS.TRANSCRIPT_TYPE;
  const charsVisible =
    typeFrame >= 0
      ? Math.min(
          Math.floor(typeFrame / CHARS_PER_1_5_FRAMES),
          TRANSCRIPT.length
        )
      : 0;
  const visibleTranscript = TRANSCRIPT.slice(0, charsVisible);

  // Generated label
  const showGeneratedLabel = frame >= BEATS.GENERATED_LABEL;
  const generatedLabelProgress = showGeneratedLabel
    ? spring({
        frame: frame - BEATS.GENERATED_LABEL,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  // Original waveform
  const showOriginal = frame >= BEATS.ORIGINAL_WAVEFORM;
  const originalEnter = showOriginal
    ? spring({
        frame: frame - BEATS.ORIGINAL_WAVEFORM,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  // "Same voice" text
  const showSameVoice = frame >= BEATS.SAME_VOICE_TEXT;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 16,
        }}
      >
        {/* Cloned waveform (aiPurple) */}
        <div style={{ position: 'relative' }}>
          <WaveformDisplay
            bars={CLONE_BARS}
            color={COLORS.aiPurple}
            frame={frame}
            fps={fps}
            drawStart={BEATS.WAVEFORM_DRAW}
            drawDuration={20}
            pulseFrame={frame >= BEATS.PULSE ? BEATS.PULSE : undefined}
          />
        </div>

        {/* Transcript typewriter */}
        <div
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 32,
            color: COLORS.textBody,
            textAlign: 'center',
            minHeight: 48,
            marginTop: 8,
          }}
        >
          {visibleTranscript}
          {charsVisible > 0 && charsVisible < TRANSCRIPT.length && (
            <span
              style={{
                color: COLORS.textMuted,
                opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </div>

        {/* Generated label + arrow */}
        {showGeneratedLabel && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: generatedLabelProgress,
            }}
          >
            <AnimatedArrow
              frame={frame}
              startFrame={BEATS.ARROW}
              color={COLORS.aiPurple}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.aiPurple,
              }}
            >
              Generated from text
            </span>
          </div>
        )}

        {/* "Same voice. Different origin." text */}
        {showSameVoice && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <AnimatedText
              variant="title"
              size={48}
              color="#FFFFFF"
              entrance="fade"
              startFrame={BEATS.SAME_VOICE_TEXT}
            >
              Same voice. Different origin.
            </AnimatedText>
          </div>
        )}

        {/* Original waveform (techBlue) */}
        {showOriginal && (
          <div
            style={{
              opacity: originalEnter,
              transform: `translateY(${interpolate(originalEnter, [0, 1], [30, 0])}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <WaveformDisplay
              bars={ORIGINAL_BARS}
              color={COLORS.techBlue}
              frame={frame}
              fps={fps}
              drawStart={BEATS.ORIGINAL_WAVEFORM}
              drawDuration={12}
              pulseFrame={frame >= BEATS.PULSE ? BEATS.PULSE : undefined}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.techBlue,
              }}
            >
              Original recording
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
