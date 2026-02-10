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
  FADE_PREV: 0,
  METERS_IN: 30,
  POETRY_FILL: 70,
  MATH_FILL: 120,
  FACTUAL_FILL: 170,
  EQUATION_IN: 210,
  HOLD: 220,
  PRE_FADE: 250,
};

// ── Scenario data ──
const SCENARIOS = [
  {
    label: 'Poetry',
    confidence: 0.9,
    correctness: 0.85,
    startFrame: BEATS.POETRY_FILL,
    correctnessColor: COLORS.solutionGreen,
    showCheck: true,
  },
  {
    label: 'Arithmetic',
    confidence: 0.9,
    correctness: 0.2,
    startFrame: BEATS.MATH_FILL,
    correctnessColor: COLORS.errorRed,
    showCheck: false,
  },
  {
    label: 'Obscure facts',
    confidence: 0.85,
    correctness: 0.4,
    startFrame: BEATS.FACTUAL_FILL,
    correctnessColor: COLORS.errorRed,
    showCheck: false,
  },
] as const;

// ── MeterBar ──
const MeterBar: React.FC<{
  label: string;
  fillPercent: number;
  fillColor: string;
  frame: number;
  fps: number;
  startFrame: number;
  meterWidth?: number;
}> = ({
  label,
  fillPercent,
  fillColor,
  frame,
  fps,
  startFrame,
  meterWidth = 680,
}) => {
  const rel = Math.max(0, frame - startFrame);
  const fillProgress = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const currentFill = interpolate(fillProgress, [0, 1], [0, fillPercent]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        maxWidth: 860,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.title,
            fontSize: 44,
            color: fillColor,
          }}
        >
          {label}
        </span>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: COLORS.textMuted,
          }}
        >
          {Math.round(currentFill * 100)}%
        </span>
      </div>
      <div
        style={{
          width: meterWidth,
          height: 24,
          backgroundColor: COLORS.bgSurfaceAlt,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${currentFill * 100}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: 12,
            transition: 'none',
          }}
        />
      </div>
    </div>
  );
};

// ── Scene4_Meters ──
export const Scene4_Meters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in
  const fadeIn = interpolate(
    frame,
    [BEATS.FADE_PREV, BEATS.FADE_PREV + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Determine current scenario
  const currentScenario =
    frame >= BEATS.FACTUAL_FILL
      ? SCENARIOS[2]
      : frame >= BEATS.MATH_FILL
        ? SCENARIOS[1]
        : SCENARIOS[0];

  const confidenceFill =
    frame >= currentScenario.startFrame ? currentScenario.confidence : 0;
  const correctnessFill =
    frame >= currentScenario.startFrame ? currentScenario.correctness : 0;

  // Meters entrance
  const metersProgress = spring({
    frame: Math.max(0, frame - BEATS.METERS_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const metersOpacity = interpolate(metersProgress, [0, 1], [0, 1]);
  const metersScale = interpolate(metersProgress, [0, 1], [0.95, 1]);

  // Scenario subtitle
  const subtitleProgress = spring({
    frame: Math.max(0, frame - currentScenario.startFrame),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  // Danger zone gap arrow (for math and factual)
  const showDangerGap =
    frame >= BEATS.MATH_FILL + 30 && currentScenario.showCheck === false;
  const gapProgress = spring({
    frame: Math.max(
      0,
      frame - (frame >= BEATS.FACTUAL_FILL ? BEATS.FACTUAL_FILL : BEATS.MATH_FILL) - 30
    ),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const gapOpacity = interpolate(gapProgress, [0, 1], [0, 1]);

  // Danger zone label
  const dangerLabel =
    frame >= BEATS.FACTUAL_FILL
      ? 'High confidence \u2260 correct'
      : 'The danger zone';

  // Equation section
  const showEquation = frame >= BEATS.EQUATION_IN;

  // Meters shrink to make room for equation
  const shrinkProgress = spring({
    frame: Math.max(0, frame - BEATS.EQUATION_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const metersShiftY = interpolate(shrinkProgress, [0, 1], [0, -60]);
  const metersSmallScale = interpolate(shrinkProgress, [0, 1], [1, 0.85]);

  // Equation entrance
  const eq1Progress = spring({
    frame: Math.max(0, frame - BEATS.EQUATION_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const eq2Progress = spring({
    frame: Math.max(0, frame - BEATS.EQUATION_IN - 8),
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Pre-fade
  const preFade =
    frame >= BEATS.PRE_FADE
      ? interpolate(
          frame,
          [BEATS.PRE_FADE, BEATS.PRE_FADE + 50],
          [1, 0.3],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  // Glow for equation code panel
  const glowPulse = frame >= BEATS.HOLD
    ? interpolate(
        Math.sin((frame - BEATS.HOLD) * 0.07),
        [-1, 1],
        [0.08, 0.2]
      )
    : 0;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
          opacity: fadeIn * preFade,
        }}
      >
        {/* Meters section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
            opacity: metersOpacity,
            transform: `scale(${metersScale * metersSmallScale}) translateY(${metersShiftY}px)`,
            width: '100%',
          }}
        >
          {/* Scenario subtitle */}
          {frame >= BEATS.POETRY_FILL && (
            <div style={{ opacity: subtitleOpacity }}>
              {frame >= BEATS.MATH_FILL && frame < BEATS.FACTUAL_FILL ? (
                <GlitchText
                  startFrame={BEATS.MATH_FILL}
                  intensity={0.5}
                  speed={4}
                  enableShadows={false}
                  color={COLORS.textMuted}
                  fontSize={28}
                >
                  {currentScenario.label}
                </GlitchText>
              ) : (
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 28,
                    color: COLORS.textMuted,
                  }}
                >
                  {currentScenario.label}
                </span>
              )}
            </div>
          )}

          {/* Confidence meter */}
          <MeterBar
            label="Confidence"
            fillPercent={confidenceFill}
            fillColor={COLORS.insightOrange}
            frame={frame}
            fps={fps}
            startFrame={currentScenario.startFrame}
          />

          {/* Correctness meter */}
          <MeterBar
            label="Correctness"
            fillPercent={correctnessFill}
            fillColor={currentScenario.correctnessColor}
            frame={frame}
            fps={fps}
            startFrame={currentScenario.startFrame}
          />

          {/* Mark indicators */}
          {frame >= currentScenario.startFrame + 25 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: 680,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  color: currentScenario.showCheck
                    ? COLORS.solutionGreen
                    : COLORS.insightOrange,
                }}
              >
                {currentScenario.showCheck ? '\u2713' : '\u26A0'}
              </span>
              <span
                style={{
                  fontSize: 32,
                  color: currentScenario.showCheck
                    ? COLORS.solutionGreen
                    : COLORS.errorRed,
                }}
              >
                {currentScenario.showCheck ? '\u2713' : '\u2717'}
              </span>
            </div>
          )}

          {/* Danger zone label */}
          {showDangerGap && (
            <div
              style={{
                opacity: gapOpacity,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.errorRed,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                {dangerLabel}
              </span>
            </div>
          )}
        </div>

        {/* Equation panel */}
        {showEquation && (
          <div
            style={{
              backgroundColor: COLORS.codeBg,
              borderRadius: 16,
              padding: '24px 32px',
              border: `1px solid ${COLORS.techBlue}`,
              boxShadow: `0 0 20px rgba(59,130,246,${glowPulse})`,
              maxWidth: 860,
              width: '90%',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                opacity: interpolate(eq1Progress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(eq1Progress, [0, 1], [10, 0])}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 28,
                  color: COLORS.insightOrange,
                }}
              >
                Confidence = f(pattern strength)
              </span>
            </div>
            <div
              style={{
                opacity: interpolate(eq2Progress, [0, 1], [0, 1]),
                transform: `translateY(${interpolate(eq2Progress, [0, 1], [10, 0])}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 28,
                  color: COLORS.solutionGreen,
                }}
              >
                Correctness = f(training data quality)
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
