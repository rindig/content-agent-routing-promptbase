import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  TEXT_IN: 0,
  CRACKS_START: 20,
  SHATTER: 45,
  LOOM_SILHOUETTE: 65,
  YEAR_IN: 70,
};

// ── Crack data — SVG lines that spiderweb across the text ──
const CRACKS = [
  // Wave 1 (frame 20): 1 crack
  { x1: 480, y1: 900, x2: 600, y2: 940, wave: 0 },
  // Wave 2 (frame 28): 2 cracks
  { x1: 540, y1: 920, x2: 420, y2: 870, wave: 1 },
  { x1: 560, y1: 910, x2: 680, y2: 880, wave: 1 },
  // Wave 3 (frame 35): 3 cracks
  { x1: 400, y1: 880, x2: 340, y2: 940, wave: 2 },
  { x1: 620, y1: 890, x2: 740, y2: 930, wave: 2 },
  { x1: 500, y1: 930, x2: 580, y2: 960, wave: 2 },
];

const CRACK_WAVE_STARTS = [20, 28, 35];

// ── Shatter fragments — one per word ──
const SHATTER_FRAGMENTS = [
  { word: 'AI', dx: -120, dy: -80, rot: -12 },
  { word: 'IS', dx: 40, dy: -110, rot: 8 },
  { word: 'TOTALLY', dx: -60, dy: 60, rot: -15 },
  { word: 'UNPRECEDENTED', dx: 80, dy: 90, rot: 10 },
];

// ── Cracks Overlay ──
const CracksOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {CRACKS.map((crack, i) => {
        const waveStart = CRACK_WAVE_STARTS[crack.wave];
        const relFrame = frame - waveStart;
        if (relFrame < 0) return null;

        const drawProgress = interpolate(
          relFrame,
          [0, 5],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Fade out during shatter
        const shatterFade = interpolate(
          frame,
          [BEATS.SHATTER, BEATS.SHATTER + 10],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const dx = crack.x2 - crack.x1;
        const dy = crack.y2 - crack.y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        return (
          <line
            key={i}
            x1={crack.x1}
            y1={crack.y1}
            x2={crack.x1 + dx * drawProgress}
            y2={crack.y1 + dy * drawProgress}
            stroke={COLORS.historyGold}
            strokeWidth={1}
            opacity={shatterFade}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

// ── Loom Silhouette (geometric outline) ──
const LoomSilhouette: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.LOOM_SILHOUETTE;
  if (relFrame < 0) return null;

  const fadeIn = interpolate(
    relFrame,
    [0, 20],
    [0, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn,
      }}
    >
      <svg width={400} height={500} viewBox="0 0 400 500">
        {/* Left vertical beam */}
        <rect
          x={50}
          y={50}
          width={20}
          height={400}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        {/* Right vertical beam */}
        <rect
          x={330}
          y={50}
          width={20}
          height={400}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        {/* Top crossbar */}
        <rect
          x={50}
          y={50}
          width={300}
          height={20}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        {/* Warp threads */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={i}
            x1={90 + i * 30}
            y1={70}
            x2={90 + i * 30}
            y2={420}
            stroke={COLORS.historyGold}
            strokeWidth={1}
            opacity={0.3}
          />
        ))}
        {/* Shuttle / crossbar mid */}
        <rect
          x={70}
          y={230}
          width={260}
          height={8}
          fill={COLORS.historyGold}
          opacity={0.3}
          rx={2}
        />
      </svg>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background transition: dark to warm
  const bgTransition = interpolate(
    frame,
    [BEATS.SHATTER, 90],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Main text entrance
  const textEnter = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const textScale = interpolate(textEnter, [0, 1], [0.9, 1]);
  const textOpacity = interpolate(textEnter, [0, 1], [0, 1]);

  // Shatter: text fragments scatter after frame 45
  const isShattered = frame >= BEATS.SHATTER;
  const shatterProgress = isShattered
    ? spring({
        frame: frame - BEATS.SHATTER,
        fps,
        config: SPRING_CONFIGS.snappy,
      })
    : 0;

  // Warm glow behind shattered text
  const glowScale = interpolate(
    frame,
    [BEATS.SHATTER, BEATS.SHATTER + 20],
    [0, 3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const glowOpacity = interpolate(
    frame,
    [BEATS.SHATTER, BEATS.SHATTER + 15],
    [0, 0.1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Year "1804" entrance
  const yearRelFrame = frame - BEATS.YEAR_IN;
  const yearProgress =
    yearRelFrame >= 0
      ? spring({ frame: yearRelFrame, fps, config: SPRING_CONFIGS.slow })
      : 0;
  const yearOpacity = interpolate(
    yearRelFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const yearScale = interpolate(yearProgress, [0, 1], [0.8, 1]);

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={80}
      fadeOutDuration={10}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Background transition glow */}
        {frame >= BEATS.SHATTER && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.historyGold} 0%, transparent 70%)`,
              transform: `translate(-50%, -50%) scale(${glowScale})`,
              opacity: glowOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Loom silhouette (behind text) */}
        <LoomSilhouette frame={frame} fps={fps} />

        {/* Cracks overlay */}
        {frame >= BEATS.CRACKS_START && frame < BEATS.SHATTER + 15 && (
          <CracksOverlay frame={frame} />
        )}

        {/* Main text — intact or shattered */}
        {!isShattered ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 54px',
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 64,
                color: COLORS.textPrimary,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: 4,
                transform: `scale(${textScale})`,
                opacity: textOpacity,
              }}
            >
              AI IS TOTALLY UNPRECEDENTED
            </div>
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 54px',
            }}
          >
            {SHATTER_FRAGMENTS.map((frag, i) => {
              const dx = frag.dx * shatterProgress;
              const dy = frag.dy * shatterProgress;
              const rot = frag.rot * shatterProgress;
              const fragOpacity = interpolate(
                shatterProgress,
                [0, 0.6, 1],
                [1, 0.5, 0]
              );

              return (
                <span
                  key={i}
                  style={{
                    ...TYPOGRAPHY.hero,
                    fontSize: 64,
                    color: COLORS.textPrimary,
                    textTransform: 'uppercase',
                    letterSpacing: 4,
                    position: 'absolute',
                    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                    opacity: fragOpacity,
                  }}
                >
                  {frag.word}
                </span>
              );
            })}
          </div>
        )}

        {/* Year "1804" below loom */}
        {yearRelFrame >= 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 340,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.hero,
                fontSize: 72,
                color: COLORS.historyGold,
                opacity: yearOpacity,
                transform: `scale(${yearScale})`,
                display: 'inline-block',
              }}
            >
              1804
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
