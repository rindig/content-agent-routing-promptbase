import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  PANELS_START: 0,
  PANELS_FLOOD: 10,
  JITTER_START: 40,
  WRONG_QUESTION: 40,
  GLITCH_HIT: 75,
  PANELS_FADE: 70,
  SCENE_END: 90,
};

// ── Panel data ──
const INITIAL_PANELS = [
  { model: 'GPT-4o', metric: 'Reasoning', bars: [0.85, 0.72, 0.91] },
  { model: 'Claude', metric: 'Speed', bars: [0.78, 0.88, 0.65] },
  { model: 'Gemini', metric: 'Cost', bars: [0.62, 0.95, 0.73] },
];

const FLOOD_PANELS = [
  { model: 'GPT-4o', metric: 'Code', bars: [0.9, 0.68, 0.82], from: 'left' as const },
  { model: 'Claude', metric: 'MMLU', bars: [0.75, 0.92, 0.58], from: 'left' as const },
  { model: 'Gemini', metric: 'Reasoning', bars: [0.88, 0.7, 0.8], from: 'right' as const },
  { model: 'GPT-4o', metric: 'Speed', bars: [0.55, 0.82, 0.77], from: 'right' as const },
];

const MODEL_NAMES = ['GPT-4o', 'Claude', 'Gemini'];
const BAR_SHADES = ['#8B5CF6', '#7C3AED', '#A78BFA'];

// ── Single comparison panel ──
const ComparisonPanel: React.FC<{
  metric: string;
  bars: number[];
  frame: number;
  fps: number;
  enterFrame: number;
  fromDirection: 'top' | 'left' | 'right';
  index: number;
  totalPanels: number;
}> = ({ metric, bars, frame, fps, enterFrame, fromDirection, index, totalPanels }) => {
  const relFrame = frame - enterFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: fromDirection === 'top' ? SPRING_CONFIGS.snappy : SPRING_CONFIGS.bouncy,
  });

  // Entrance transform
  const startX = fromDirection === 'left' ? -400 : fromDirection === 'right' ? 400 : 0;
  const startY = fromDirection === 'top' ? -300 : 0;
  const x = interpolate(enterProgress, [0, 1], [startX, 0]);
  const y = interpolate(enterProgress, [0, 1], [startY, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Jitter after JITTER_START
  let jitterX = 0;
  if (frame >= BEATS.JITTER_START && frame < BEATS.PANELS_FADE) {
    jitterX = Math.sin(frame * 2.5 + index * 1.7) * 2;
  }

  // Red flash at frame 60
  const showRedFlash = frame >= 60 && frame <= 61;

  // Fade out
  const fadeOut = interpolate(
    frame,
    [BEATS.PANELS_FADE, BEATS.SCENE_END],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        border: `1.5px solid ${showRedFlash ? COLORS.errorRed : COLORS.panelBorder}`,
        borderRadius: 10,
        padding: '12px 16px',
        width: 280,
        opacity: opacity * fadeOut,
        transform: `translate(${x + jitterX}px, ${y}px)`,
        boxShadow: showRedFlash
          ? `0 0 12px ${COLORS.glowRed}`
          : 'none',
      }}
    >
      {/* Metric label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        {metric}
      </div>

      {/* Bars */}
      {bars.map((val, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 4,
            gap: 8,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 18,
              color: COLORS.textDim,
              width: 60,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            {MODEL_NAMES[i]}
          </span>
          <div
            style={{
              flex: 1,
              height: 10,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: 5,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${val * 100}%`,
                height: '100%',
                backgroundColor: BAR_SHADES[i],
                borderRadius: 5,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question text
  const showQuestion = frame >= BEATS.WRONG_QUESTION;
  const questionProgress = spring({
    frame: Math.max(0, frame - BEATS.WRONG_QUESTION),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const questionScale = interpolate(questionProgress, [0, 1], [0.3, 1]);
  const questionOpacity = interpolate(questionProgress, [0, 1], [0, 1]);

  // Use GlitchText at glitch hit
  const showGlitch = frame >= BEATS.GLITCH_HIT;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={8}
      fadeOut
      fadeOutStart={82}
      fadeOutDuration={8}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Initial 3 panels from top */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            marginTop: 80,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {INITIAL_PANELS.map((panel, i) => (
            <ComparisonPanel
              key={`init-${i}`}
              metric={panel.metric}
              bars={panel.bars}
              frame={frame}
              fps={fps}
              enterFrame={BEATS.PANELS_START + i * 4}
              fromDirection="top"
              index={i}
              totalPanels={7}
            />
          ))}
        </div>

        {/* Flood panels - positioned around the initial panels */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          {FLOOD_PANELS.map((panel, i) => {
            const positions = [
              { top: 60, left: 20 },
              { top: 380, left: 30 },
              { top: 180, right: 20 },
              { top: 520, right: 10 },
            ];
            const pos = positions[i];

            return (
              <div
                key={`flood-${i}`}
                style={{
                  position: 'absolute',
                  ...pos,
                }}
              >
                <ComparisonPanel
                  metric={panel.metric}
                  bars={panel.bars}
                  frame={frame}
                  fps={fps}
                  enterFrame={BEATS.PANELS_FLOOD + i * 3}
                  fromDirection={panel.from}
                  index={i + 3}
                  totalPanels={7}
                />
              </div>
            );
          })}
        </div>

        {/* "WHICH ONE IS BEST?" question */}
        {showQuestion && (
          <div
            style={{
              position: 'absolute',
              top: 280,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 20,
            }}
          >
            {showGlitch ? (
              <GlitchText
                startFrame={BEATS.GLITCH_HIT}
                intensity={0.6}
                speed={4}
                color={COLORS.insightOrange}
                fontSize={52}
              >
                WHICH ONE IS BEST?
              </GlitchText>
            ) : (
              <div
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 52,
                  color: COLORS.insightOrange,
                  opacity: questionOpacity,
                  transform: `scale(${questionScale})`,
                  textAlign: 'center',
                }}
              >
                WHICH ONE IS BEST?
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
