import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  CLOUD_REPOSITION: 10,
  PROBABILITY_LABEL: 20,
  SEPARATOR_LINE: 25,
  LAYER_TRANSISTOR: 35,
  LAYER_LOGIC: 55,
  LAYER_MACHINE: 75,
  LAYER_OS: 95,
  LAYER_APP: 115,
  YOU_ARE_HERE: 125,
  BRACKET_DETERMINISTIC: 135,
  DET_LABEL: 140,
  BRACKET_PROBABILISTIC: 145,
  PROB_LABEL: 150,
  GLOW_PULSE_START: 180,
  GLOW_PULSE_L1: 180,
  GLOW_PULSE_L2: 186,
  GLOW_PULSE_L3: 192,
  GLOW_PULSE_L4: 198,
  GLOW_PULSE_L5: 204,
  HOLD: 210,
};

// ── S14 accent colors ──
const S14 = {
  electronCloud: '#A78BFA',
  probabilisticPurple: '#C084FC',
  deterministicBlue: '#60A5FA',
};

// ── Layer definitions ──
const LAYERS = [
  { label: 'TRANSISTOR', color: COLORS.techBlue, beat: BEATS.LAYER_TRANSISTOR },
  { label: 'LOGIC GATE', color: COLORS.techBlue, beat: BEATS.LAYER_LOGIC },
  { label: 'MACHINE CODE', color: COLORS.textBody, beat: BEATS.LAYER_MACHINE },
  { label: 'OPERATING SYSTEM', color: COLORS.textBody, beat: BEATS.LAYER_OS },
  { label: 'APPLICATION', color: COLORS.solutionGreen, beat: BEATS.LAYER_APP },
];

const GLOW_PULSE_STARTS = [
  BEATS.GLOW_PULSE_L1,
  BEATS.GLOW_PULSE_L2,
  BEATS.GLOW_PULSE_L3,
  BEATS.GLOW_PULSE_L4,
  BEATS.GLOW_PULSE_L5,
];

// ── Mini Electron Cloud ──
const MiniElectronCloud: React.FC<{ frame: number }> = ({ frame }) => {
  const radius = 30;
  const breathe = radius + 5 * Math.sin((frame * 2 * Math.PI) / 40);

  const dots = [
    { amp: 12, speed: 0.15, phase: 0, size: 2 },
    { amp: 8, speed: 0.22, phase: 1.2, size: 2 },
    { amp: 15, speed: 0.12, phase: 2.5, size: 2 },
    { amp: 6, speed: 0.28, phase: 3.8, size: 3 },
    { amp: 10, speed: 0.18, phase: 5.0, size: 2 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: breathe * 2,
        height: breathe * 2,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S14.electronCloud} 0%, rgba(167,139,250,0.3) 40%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
      {dots.map((dot, i) => {
        const x = dot.amp * Math.sin(frame * dot.speed + dot.phase);
        const y = dot.amp * Math.cos(frame * dot.speed * 0.8 + dot.phase + 1.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: 0.5 + 0.2 * Math.sin(frame * 0.1 + dot.phase),
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Stack Layer ──
const StackLayer: React.FC<{
  label: string;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  glowPulseStart: number;
  isTop?: boolean;
}> = ({ label, color, frame, fps, startFrame, glowPulseStart, isTop = false }) => {
  const layerProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const y = interpolate(layerProgress, [0, 1], [30, 0]);
  const opacity = interpolate(layerProgress, [0, 1], [0, 1]);

  // Purple glow pulse
  const glowPulseDuration = 8;
  const glowFrame = frame - glowPulseStart;
  const isGlowing = glowFrame >= 0 && glowFrame < glowPulseDuration;
  const glowIntensity = isGlowing
    ? Math.sin((glowFrame / glowPulseDuration) * Math.PI)
    : 0;

  const borderColor = isGlowing
    ? interpolate(glowIntensity, [0, 1], [0, 1]) > 0.5
      ? COLORS.aiPurple
      : color
    : color;

  return (
    <div
      style={{
        width: 800,
        maxWidth: `calc(100% - ${LAYOUT.safeMarginX * 2}px)`,
        height: 70,
        backgroundColor: COLORS.bgSurface,
        borderTop: `2px solid ${borderColor}`,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        boxShadow: isGlowing
          ? `0 0 12px rgba(139,92,246,${glowIntensity * 0.4})`
          : 'none',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 36,
          color,
          fontWeight: isTop ? 600 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene3_LayerStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Probability label with glitch-like flicker ──
  const probLabelProgress = spring({
    frame: frame - BEATS.PROBABILITY_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Simple flicker effect (glitch-like, avoids importing GlitchBurst)
  const flickerCycle = Math.floor(frame / 120) % 2 === 0;
  const flickerFrame = frame % 120;
  const isFlickering =
    flickerCycle && flickerFrame > 114 && flickerFrame < 120;
  const probLabelOpacity = isFlickering ? 0.6 : 1;

  // ── Separator line shiver ──
  const separatorProgress = spring({
    frame: frame - BEATS.SEPARATOR_LINE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const separatorShiver =
    frame >= BEATS.HOLD ? Math.sin(frame * 0.3) * 1 : 0;

  // ── "You are here" indicator ──
  const youAreHereProgress = spring({
    frame: frame - BEATS.YOU_ARE_HERE,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // ── Bracket labels ──
  const detBracketProgress = spring({
    frame: frame - BEATS.BRACKET_DETERMINISTIC,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const detLabelProgress = spring({
    frame: frame - BEATS.DET_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const probBracketProgress = spring({
    frame: frame - BEATS.BRACKET_PROBABILISTIC,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const probBracketLabelProgress = spring({
    frame: frame - BEATS.PROB_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // ── Cloud reposition ──
  const cloudRepoProgress = spring({
    frame: frame - BEATS.CLOUD_REPOSITION,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '100%',
          padding: `0 ${LAYOUT.safeMarginX}px`,
          paddingBottom: 200,
          gap: 0,
        }}
      >
        {/* ── "You are here" indicator ── */}
        {frame >= BEATS.YOU_ARE_HERE && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: interpolate(youAreHereProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(youAreHereProgress, [0, 1], [20, 0])}px)`,
              marginBottom: 6,
              alignSelf: 'flex-end',
              paddingRight: 60,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.textMuted,
              }}
            >
              you are here
            </span>
            <span style={{ color: COLORS.textMuted, fontSize: 18 }}>
              {'<'}
            </span>
          </div>
        )}

        {/* ── Layer Stack (top to bottom: APP, OS, MACHINE, LOGIC, TRANSISTOR) ── */}
        {[...LAYERS].reverse().map((layer, reverseIdx) => {
          const idx = LAYERS.length - 1 - reverseIdx;
          return (
            <StackLayer
              key={layer.label}
              label={layer.label}
              color={layer.color}
              frame={frame}
              fps={fps}
              startFrame={layer.beat}
              glowPulseStart={GLOW_PULSE_STARTS[idx]}
              isTop={idx === LAYERS.length - 1}
            />
          );
        })}

        {/* ── Separator line ── */}
        <div
          style={{
            width: 800,
            maxWidth: `calc(100% - ${LAYOUT.safeMarginX * 2}px)`,
            height: 1,
            backgroundColor: COLORS.aiPurple,
            opacity: interpolate(separatorProgress, [0, 1], [0, 0.6]),
            transform: `translateX(${separatorShiver}px)`,
            marginTop: 4,
            marginBottom: 4,
          }}
        />

        {/* ── Probability Cloud base ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: interpolate(cloudRepoProgress, [0, 1], [0, 1]),
            transform: `scale(${interpolate(cloudRepoProgress, [0, 1], [1.5, 1])})`,
          }}
        >
          <MiniElectronCloud frame={frame} />

          {/* "PROBABILITY" label */}
          {frame >= BEATS.PROBABILITY_LABEL && (
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.aiPurple,
                opacity: interpolate(probLabelProgress, [0, 1], [0, 1]) * probLabelOpacity,
                transform: `translateY(${interpolate(probLabelProgress, [0, 1], [10, 0])}px)`,
              }}
            >
              PROBABILITY
            </div>
          )}
        </div>

        {/* ── Right-side brackets ── */}
        {/* "DETERMINISTIC" bracket for top 5 layers */}
        {frame >= BEATS.BRACKET_DETERMINISTIC && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              top: '28%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: interpolate(detBracketProgress, [0, 1], [0, 1]),
            }}
          >
            {/* Bracket shape */}
            <div
              style={{
                width: 12,
                height: 340,
                borderRight: `2px solid ${COLORS.textBody}`,
                borderTop: `2px solid ${COLORS.textBody}`,
                borderBottom: `2px solid ${COLORS.textBody}`,
                borderRadius: '0 6px 6px 0',
              }}
            />
            {/* Label */}
            {frame >= BEATS.DET_LABEL && (
              <div
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: S14.deterministicBlue,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  opacity: interpolate(detLabelProgress, [0, 1], [0, 1]),
                  letterSpacing: 3,
                }}
              >
                DETERMINISTIC
              </div>
            )}
          </div>
        )}

        {/* "PROBABILISTIC" bracket for base cloud */}
        {frame >= BEATS.BRACKET_PROBABILISTIC && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              bottom: 180,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              opacity: interpolate(probBracketProgress, [0, 1], [0, 1]),
            }}
          >
            {/* Bracket shape */}
            <div
              style={{
                width: 12,
                height: 80,
                borderRight: `2px solid ${COLORS.aiPurple}`,
                borderTop: `2px solid ${COLORS.aiPurple}`,
                borderBottom: `2px solid ${COLORS.aiPurple}`,
                borderRadius: '0 6px 6px 0',
              }}
            />
            {/* Label */}
            {frame >= BEATS.PROB_LABEL && (
              <div
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: S14.probabilisticPurple,
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  opacity: interpolate(probBracketLabelProgress, [0, 1], [0, 1]) * probLabelOpacity,
                  letterSpacing: 3,
                }}
              >
                PROBABILISTIC
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
