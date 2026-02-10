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
  SILENCE: 0,
  WAVEFORM_A_START: 15,
  WAVEFORM_B_START: 18,
  WAVEFORMS_COMPLETE: 50,
  QUESTION_IN: 50,
  PLAYHEAD_START: 65,
  SCENE_END: 90,
};

const BAR_COUNT = 80;
const CONTENT_WIDTH = 972;
const BAR_GAP = 2;
const BAR_WIDTH = (CONTENT_WIDTH - BAR_COUNT * BAR_GAP) / BAR_COUNT;

// Generate a deterministic waveform pattern
const generateWaveform = (seed: number): number[] => {
  const bars: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    const val =
      Math.sin(i * 0.3 + seed) +
      Math.sin(i * 0.7 + seed) * 0.5 +
      Math.sin(i * 1.3 + seed * 2) * 0.25;
    bars.push(Math.abs(val) / 1.75); // Normalize 0-1
  }
  return bars;
};

// Waveform A and B (nearly identical, < 2% difference)
const WAVEFORM_A: number[] = generateWaveform(0);
const WAVEFORM_B: number[] = WAVEFORM_A.map(
  (v) => v + (Math.random() * 0.02 - 0.01) * 0 + (Math.sin(v * 100) * 0.015)
);

const MAX_BAR_HEIGHT = 120;

// ── Waveform Display ──
const WaveformDisplay: React.FC<{
  frame: number;
  fps: number;
  bars: number[];
  color: string;
  startFrame: number;
  yPosition: number;
  label: string;
  labelColor: string;
  playheadActive: boolean;
  playheadStartFrame: number;
}> = ({
  frame,
  fps,
  bars,
  color,
  startFrame,
  yPosition,
  label,
  labelColor,
  playheadActive,
  playheadStartFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  // Playhead position
  const playheadFrame = frame - playheadStartFrame;
  const playheadX = playheadActive && playheadFrame >= 0
    ? interpolate(playheadFrame, [0, 60], [0, CONTENT_WIDTH], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : -10;

  return (
    <div
      style={{
        position: 'absolute',
        top: yPosition,
        left: 54,
        width: CONTENT_WIDTH,
        height: MAX_BAR_HEIGHT + 40,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Label */}
      <div
        style={{
          position: 'absolute',
          left: -44,
          top: '50%',
          transform: 'translateY(-50%)',
          ...TYPOGRAPHY.label,
          fontSize: 36,
          color: labelColor,
          opacity: interpolate(relFrame, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {label}
      </div>

      {/* Bars */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: BAR_GAP,
          height: MAX_BAR_HEIGHT,
          width: '100%',
        }}
      >
        {bars.map((barHeight, i) => {
          const barDelay = i * 1; // 1-frame stagger
          const barProgress = interpolate(
            relFrame - barDelay,
            [0, 8],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          // Bar brightness when playhead passes
          const barX = i * (BAR_WIDTH + BAR_GAP);
          const distFromPlayhead = Math.abs(barX - playheadX);
          const brightBoost =
            playheadActive && playheadFrame >= 0 && distFromPlayhead < 30
              ? interpolate(distFromPlayhead, [0, 30], [0.2, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
              : 0;

          const height = barHeight * MAX_BAR_HEIGHT * barProgress;
          const opacity = 0.8 + brightBoost;

          return (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                height: Math.max(2, height),
                backgroundColor: color,
                opacity,
                borderRadius: 1,
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      {/* Playhead line */}
      {playheadActive && playheadFrame >= 0 && (
        <div
          style={{
            position: 'absolute',
            left: playheadX,
            top: 0,
            width: 2,
            height: MAX_BAR_HEIGHT,
            backgroundColor: '#FFFFFF',
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question text entrance
  const questionProgress = spring({
    frame: frame - BEATS.QUESTION_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const questionScale = interpolate(questionProgress, [0, 1], [0.3, 1]);
  const questionOpacity = interpolate(questionProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Waveform A (top) */}
        <WaveformDisplay
          frame={frame}
          fps={fps}
          bars={WAVEFORM_A}
          color={COLORS.techBlue}
          startFrame={BEATS.WAVEFORM_A_START}
          yPosition={580}
          label="A"
          labelColor={COLORS.techBlue}
          playheadActive={frame >= BEATS.PLAYHEAD_START}
          playheadStartFrame={BEATS.PLAYHEAD_START}
        />

        {/* Waveform B (bottom) */}
        <WaveformDisplay
          frame={frame}
          fps={fps}
          bars={WAVEFORM_B}
          color={COLORS.insightOrange}
          startFrame={BEATS.WAVEFORM_B_START}
          yPosition={920}
          label="B"
          labelColor={COLORS.insightOrange}
          playheadActive={frame >= BEATS.PLAYHEAD_START}
          playheadStartFrame={BEATS.PLAYHEAD_START}
        />

        {/* Question text between waveforms */}
        {frame >= BEATS.QUESTION_IN && (
          <div
            style={{
              position: 'absolute',
              top: 750,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: questionOpacity,
              transform: `scale(${questionScale})`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 56,
                color: COLORS.textPrimary,
                textAlign: 'center',
              }}
            >
              Which one is real?
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
