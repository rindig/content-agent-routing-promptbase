import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, GradientText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  QUANTUM_LAYER_IN: 20,
  QUANTUM_LABEL: 25,
  ENGINEERING_IN: 35,
  ENGINEERING_LABEL: 40,
  AI_LAYER_IN: 50,
  AI_LABEL: 55,
  SYMMETRY_LINES: 70,
  SYMMETRY_NODES: 80,
  SAME_UNCERTAINTY_LABEL: 85,
  STACK_DIM: 100,
  LINE_1_IN: 130,
  LINE_2_IN: 155,
  LINE_3_IN: 175,
  GLOW_BUILD: 190,
  HOLD: 220,
  FADE_OUT: 285,
};

// ── S14 accent colors ──
const S14 = {
  electronCloud: '#A78BFA',
  probabilisticPurple: '#C084FC',
};

// ── Pulsing probability layer (shared visual for quantum and AI layers) ──
const ProbabilityFill: React.FC<{
  frame: number;
  width: number;
  height: number;
}> = ({ frame, width, height }) => {
  const breathe = 0.6 + 0.15 * Math.sin((frame * 2 * Math.PI) / 40);

  const dots = [
    { amp: 15, speed: 0.15, phase: 0, size: 3 },
    { amp: 10, speed: 0.22, phase: 1.2, size: 2 },
    { amp: 20, speed: 0.12, phase: 2.5, size: 2 },
    { amp: 8, speed: 0.28, phase: 3.8, size: 3 },
    { amp: 12, speed: 0.18, phase: 5.0, size: 2 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 8,
      }}
    >
      {/* Gradient fill */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${S14.electronCloud} 0%, rgba(167,139,250,0.2) 60%, transparent 100%)`,
          opacity: breathe,
        }}
      />
      {/* Jittering dots */}
      {dots.map((dot, i) => {
        const x = (width / 2) + dot.amp * Math.sin(frame * dot.speed + dot.phase);
        const y = (height / 2) + dot.amp * Math.cos(frame * dot.speed * 0.8 + dot.phase + 1.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: 0.4 + 0.2 * Math.sin(frame * 0.1 + dot.phase),
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const STACK_WIDTH = 700;
  const QUANTUM_HEIGHT = 100;
  const ENGINEERING_HEIGHT = 200;
  const AI_HEIGHT = 100;
  const STACK_GAP = 4;

  // ── Layer entrance animations ──
  const quantumProgress = spring({
    frame: frame - BEATS.QUANTUM_LAYER_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const quantumY = interpolate(quantumProgress, [0, 1], [30, 0]);
  const quantumOpacity = interpolate(quantumProgress, [0, 1], [0, 1]);

  const quantumLabelProgress = spring({
    frame: frame - BEATS.QUANTUM_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const engProgress = spring({
    frame: frame - BEATS.ENGINEERING_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const engY = interpolate(engProgress, [0, 1], [30, 0]);
  const engOpacity = interpolate(engProgress, [0, 1], [0, 1]);

  const engLabelProgress = spring({
    frame: frame - BEATS.ENGINEERING_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const aiProgress = spring({
    frame: frame - BEATS.AI_LAYER_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const aiY = interpolate(aiProgress, [0, 1], [30, 0]);
  const aiOpacity = interpolate(aiProgress, [0, 1], [0, 1]);

  const aiLabelProgress = spring({
    frame: frame - BEATS.AI_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // ── Symmetry lines ──
  const symmetryProgress =
    frame >= BEATS.SYMMETRY_LINES
      ? spring({
          frame: frame - BEATS.SYMMETRY_LINES,
          fps,
          config: SPRING_CONFIGS.slow,
        })
      : 0;

  const symmetryNodeProgress =
    frame >= BEATS.SYMMETRY_NODES
      ? spring({
          frame: frame - BEATS.SYMMETRY_NODES,
          fps,
          config: SPRING_CONFIGS.bouncy,
        })
      : 0;

  const sameUncertaintyProgress =
    frame >= BEATS.SAME_UNCERTAINTY_LABEL
      ? spring({
          frame: frame - BEATS.SAME_UNCERTAINTY_LABEL,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;

  // ── Stack dim ──
  const stackDimOpacity =
    frame >= BEATS.STACK_DIM
      ? interpolate(
          frame,
          [BEATS.STACK_DIM, BEATS.STACK_DIM + 30],
          [1, 0.1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  const stackDimY =
    frame >= BEATS.STACK_DIM
      ? interpolate(
          frame,
          [BEATS.STACK_DIM, BEATS.STACK_DIM + 30],
          [0, -80],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  // ── Glow build ──
  const glowOpacity =
    frame >= BEATS.GLOW_BUILD
      ? interpolate(
          frame,
          [BEATS.GLOW_BUILD, BEATS.GLOW_BUILD + 30],
          [0, 0.25],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        ) *
        (0.85 + 0.15 * Math.sin((frame - BEATS.GLOW_BUILD) * (Math.PI / 40)))
      : 0;

  // ── "one layer up" progress ──
  const line3Progress =
    frame >= BEATS.LINE_3_IN
      ? spring({
          frame: frame - BEATS.LINE_3_IN,
          fps,
          config: SPRING_CONFIGS.bouncy,
        })
      : 0;

  // ── Fade out ──
  const fadeOutOpacity =
    frame >= BEATS.FADE_OUT
      ? interpolate(
          frame,
          [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  // ── Synced pulse for quantum and AI layers during hold ──
  const syncPulse =
    frame >= BEATS.HOLD
      ? 1 + 0.03 * Math.sin((frame - BEATS.HOLD) * (Math.PI / 20))
      : 1;

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={20}>
      <div style={{ opacity: fadeOutOpacity }}>
        {/* ── Background glow ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(139,92,246,${glowOpacity}) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Stack visualization ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `0 ${LAYOUT.safeMarginX}px`,
            opacity: stackDimOpacity,
            transform: `translateY(${stackDimY}px) scale(${stackDimOpacity < 0.5 ? syncPulse : 1})`,
          }}
        >
          {/* ── AI Layer (top) ── */}
          <div
            style={{
              position: 'relative',
              width: STACK_WIDTH,
              maxWidth: `calc(100% - ${LAYOUT.safeMarginX * 2}px)`,
              height: AI_HEIGHT,
              borderRadius: 8,
              border: `1px solid rgba(167,139,250,0.3)`,
              overflow: 'hidden',
              opacity: aiOpacity,
              transform: `translateY(${aiY}px) scale(${frame >= BEATS.HOLD ? syncPulse : 1})`,
              boxShadow: `0 0 15px rgba(167,139,250,0.2)`,
              marginBottom: STACK_GAP,
            }}
          >
            <ProbabilityFill frame={frame} width={STACK_WIDTH} height={AI_HEIGHT} />
            {/* AI label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(aiLabelProgress, [0, 1], [0, 1]),
              }}
            >
              <GradientText
                colors={[COLORS.aiPurple, S14.probabilisticPurple, COLORS.insightOrange]}
                direction="horizontal"
                fontSize={36}
                fontWeight={700}
                duration={90}
                yoyo
                startFrame={BEATS.AI_LABEL}
              >
                AI
              </GradientText>
            </div>
          </div>

          {/* ── Engineering Layer (middle) ── */}
          <div
            style={{
              position: 'relative',
              width: STACK_WIDTH,
              maxWidth: `calc(100% - ${LAYOUT.safeMarginX * 2}px)`,
              height: ENGINEERING_HEIGHT,
              backgroundColor: COLORS.bgSurface,
              borderRadius: 8,
              border: `1px solid ${COLORS.panelBorder}`,
              overflow: 'hidden',
              opacity: engOpacity,
              transform: `translateY(${engY}px)`,
              marginBottom: STACK_GAP,
            }}
          >
            {/* Internal division lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
              <div
                key={ratio}
                style={{
                  position: 'absolute',
                  left: '10%',
                  right: '10%',
                  top: `${ratio * 100}%`,
                  height: 1,
                  backgroundColor: COLORS.textDim,
                  opacity: 0.3,
                }}
              />
            ))}
            {/* Engineering label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(engLabelProgress, [0, 1], [0, 1]),
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.solutionGreen,
                  letterSpacing: 3,
                }}
              >
                ENGINEERING
              </span>
            </div>
          </div>

          {/* ── Quantum Foundation Layer (bottom) ── */}
          <div
            style={{
              position: 'relative',
              width: STACK_WIDTH,
              maxWidth: `calc(100% - ${LAYOUT.safeMarginX * 2}px)`,
              height: QUANTUM_HEIGHT,
              borderRadius: 8,
              border: `1px solid rgba(167,139,250,0.3)`,
              overflow: 'hidden',
              opacity: quantumOpacity,
              transform: `translateY(${quantumY}px) scale(${frame >= BEATS.HOLD ? syncPulse : 1})`,
              boxShadow: `0 0 15px rgba(167,139,250,0.2)`,
            }}
          >
            <ProbabilityFill frame={frame} width={STACK_WIDTH} height={QUANTUM_HEIGHT} />
            {/* Quantum label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: interpolate(quantumLabelProgress, [0, 1], [0, 1]),
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.aiPurple,
                  letterSpacing: 3,
                }}
              >
                QUANTUM
              </span>
            </div>
          </div>

          {/* ── Symmetry dashed lines (left and right) ── */}
          {frame >= BEATS.SYMMETRY_LINES && (
            <>
              {/* Left dashed line */}
              <svg
                style={{
                  position: 'absolute',
                  left: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 20,
                  overflow: 'visible',
                  opacity: interpolate(symmetryProgress, [0, 1], [0, 0.6]),
                }}
              >
                <line
                  x1="20"
                  y1="10"
                  x2="20"
                  y2={AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 10}
                  stroke={COLORS.aiPurple}
                  strokeWidth={1}
                  strokeDasharray="6 4"
                  strokeDashoffset={-frame * 0.5}
                />
                {/* Mid node */}
                <circle
                  cx="20"
                  cy={(AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 20) / 2}
                  r={6 * interpolate(symmetryNodeProgress, [0, 1], [0, 1])}
                  fill={COLORS.aiPurple}
                  opacity={0.6 + 0.2 * Math.sin(frame * (Math.PI / 20))}
                />
              </svg>

              {/* Right dashed line */}
              <svg
                style={{
                  position: 'absolute',
                  right: 20,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 20,
                  overflow: 'visible',
                  opacity: interpolate(symmetryProgress, [0, 1], [0, 0.6]),
                }}
              >
                <line
                  x1="20"
                  y1="10"
                  x2="20"
                  y2={AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 10}
                  stroke={COLORS.aiPurple}
                  strokeWidth={1}
                  strokeDasharray="6 4"
                  strokeDashoffset={-frame * 0.5}
                />
                {/* Mid node */}
                <circle
                  cx="20"
                  cy={(AI_HEIGHT + ENGINEERING_HEIGHT + QUANTUM_HEIGHT + STACK_GAP * 2 + 20) / 2}
                  r={6 * interpolate(symmetryNodeProgress, [0, 1], [0, 1])}
                  fill={COLORS.aiPurple}
                  opacity={0.6 + 0.2 * Math.sin(frame * (Math.PI / 20))}
                />
              </svg>

              {/* "SAME UNCERTAINTY" label */}
              {frame >= BEATS.SAME_UNCERTAINTY_LABEL && (
                <div
                  style={{
                    position: 'absolute',
                    left: 5,
                    top: '50%',
                    transform: 'translateY(-50%) rotate(-90deg)',
                    transformOrigin: 'center center',
                    ...TYPOGRAPHY.label,
                    fontSize: 20,
                    color: COLORS.aiPurple,
                    opacity: interpolate(sameUncertaintyProgress, [0, 1], [0, 0.7]),
                    letterSpacing: 2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  SAME UNCERTAINTY
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Closing text ── */}
        {frame >= BEATS.LINE_1_IN && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `0 ${LAYOUT.safeMarginX}px`,
              gap: 16,
              textShadow: glowOpacity > 0
                ? `0 0 40px rgba(139,92,246,${glowOpacity})`
                : 'none',
            }}
          >
            <div
              style={{
                maxWidth: 860,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {/* Line 1 */}
              <BlurText
                startFrame={BEATS.LINE_1_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={3}
                blurAmount={12}
                distance={30}
                color={COLORS.textPrimary}
                fontSize={48}
                fontWeight={600}
              >
                It's not a different problem.
              </BlurText>

              {/* Line 2 */}
              {frame >= BEATS.LINE_2_IN && (
                <BlurText
                  startFrame={BEATS.LINE_2_IN}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={3}
                  blurAmount={12}
                  distance={30}
                  color={COLORS.textPrimary}
                  fontSize={48}
                  fontWeight={600}
                >
                  It's the same problem,
                </BlurText>
              )}

              {/* Line 3: "one layer up." — the punch */}
              {frame >= BEATS.LINE_3_IN && (
                <div
                  style={{
                    ...TYPOGRAPHY.title,
                    fontSize: 56,
                    fontWeight: 700,
                    color: COLORS.insightOrange,
                    opacity: interpolate(line3Progress, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(line3Progress, [0, 1], [0.7, 1])})`,
                    textShadow: `0 0 30px rgba(245,158,11,${glowOpacity > 0 ? 0.3 : 0})`,
                    textAlign: 'center',
                  }}
                >
                  one layer up.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
