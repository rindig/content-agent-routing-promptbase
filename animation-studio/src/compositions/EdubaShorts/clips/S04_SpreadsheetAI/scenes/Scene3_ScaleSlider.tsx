import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText, ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  PREV_OUT: 0,
  SLIDER_BAR_IN: 20,
  HANDLE_IN: 50,
  HANDLE_SLIDE: 80,
  LABEL_SWITCH: 140,
  COMPARISON_BOXES: 170,
  EQUALS_SIGN: 220,
  DIM_HOLD: 260,
};

const SCALE_LABELS = [
  { text: '100 cells', frame: 85 },
  { text: '10K rows', frame: 100 },
  { text: '1M documents', frame: 115 },
  { text: '1B web pages', frame: 130 },
  { text: 'The entire internet', frame: 140 },
];

const BAR_HEIGHT = 700;
const BAR_WIDTH = 40;

export const Scene3_ScaleSlider: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Previous scene fade out
  const prevOutOpacity = interpolate(
    frame,
    [BEATS.PREV_OUT, BEATS.PREV_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Slider bar entrance
  const barProgress = spring({
    frame: frame - BEATS.SLIDER_BAR_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const barScaleY = interpolate(barProgress, [0, 1], [0, 1]);
  const barOpacity = interpolate(barProgress, [0, 1], [0, 1]);

  // Handle entrance
  const handleProgress = spring({
    frame: frame - BEATS.HANDLE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const handleScale = interpolate(handleProgress, [0, 1], [0, 1]);

  // Handle slide: slow spring from bottom to top
  const slideProgress = spring({
    frame: frame - BEATS.HANDLE_SLIDE,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  // Handle position: 0 = bottom, 1 = top
  const handlePosition = interpolate(slideProgress, [0, 1], [0, 1]);

  // Fill gradient follows the handle
  const fillHeight = handlePosition * BAR_HEIGHT;

  // Label switch: Spreadsheet -> LLM with glitch
  const glitchOutStart = BEATS.LABEL_SWITCH;
  const glitchInStart = BEATS.LABEL_SWITCH + 10;
  const showLLM = frame >= glitchInStart;

  // Comparison boxes
  const leftBoxProgress = spring({
    frame: frame - BEATS.COMPARISON_BOXES,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const rightBoxProgress = spring({
    frame: frame - BEATS.COMPARISON_BOXES - 10,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Equals sign
  const equalsProgress = spring({
    frame: frame - BEATS.EQUALS_SIGN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const equalsScale = interpolate(equalsProgress, [0, 1], [0.5, 1]);
  const equalsOpacity = interpolate(equalsProgress, [0, 1], [0, 1]);

  // Dim everything except "Same mechanism"
  const dimOpacity = interpolate(
    frame,
    [BEATS.DIM_HOLD, BEATS.DIM_HOLD + 20],
    [1, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Equals glow
  const equalsGlow = frame >= BEATS.EQUALS_SIGN
    ? 0.15 + 0.1 * Math.sin((frame - BEATS.EQUALS_SIGN) * 0.08)
    : 0;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            opacity: frame < BEATS.SLIDER_BAR_IN ? 0 : 1,
          }}
        >
          {/* Label above slider: "Spreadsheet" or "LLM" */}
          {frame >= BEATS.HANDLE_IN && (
            <div style={{ opacity: dimOpacity, marginBottom: 8 }}>
              {showLLM ? (
                <GlitchText
                  startFrame={glitchInStart}
                  intensity={0.6}
                  speed={4}
                  color={COLORS.aiPurple}
                  fontSize={56}
                  fontWeight={700}
                >
                  LLM
                </GlitchText>
              ) : frame >= glitchOutStart ? (
                <GlitchText
                  startFrame={glitchOutStart}
                  intensity={0.8}
                  speed={2}
                  color={COLORS.techBlue}
                  fontSize={48}
                  fontWeight={600}
                >
                  Spreadsheet
                </GlitchText>
              ) : (
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 48,
                    color: COLORS.techBlue,
                    fontWeight: 600,
                  }}
                >
                  Spreadsheet
                </span>
              )}
            </div>
          )}

          {/* Slider visualization */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              opacity: dimOpacity,
            }}
          >
            {/* Scale labels (left side) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: BAR_HEIGHT,
                alignItems: 'flex-end',
                width: 200,
              }}
            >
              {/* Top label: The Internet */}
              <div
                style={{
                  opacity: barOpacity,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Globe icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity={barOpacity}>
                  <circle cx="12" cy="12" r="10" stroke={COLORS.aiPurple} strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="5" ry="10" stroke={COLORS.aiPurple} strokeWidth="1" />
                  <line x1="2" y1="12" x2="22" y2="12" stroke={COLORS.aiPurple} strokeWidth="1" />
                  <line x1="12" y1="2" x2="12" y2="22" stroke={COLORS.aiPurple} strokeWidth="0.5" />
                </svg>
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.aiPurple,
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  The Internet
                </span>
              </div>

              {/* Bottom label: Your Column */}
              <div
                style={{
                  opacity: barOpacity,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {/* Spreadsheet icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity={barOpacity}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke={COLORS.techBlue} strokeWidth="1.5" />
                  <line x1="3" y1="9" x2="21" y2="9" stroke={COLORS.techBlue} strokeWidth="1" />
                  <line x1="3" y1="15" x2="21" y2="15" stroke={COLORS.techBlue} strokeWidth="1" />
                  <line x1="9" y1="3" x2="9" y2="21" stroke={COLORS.techBlue} strokeWidth="1" />
                </svg>
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.techBlue,
                    textTransform: 'none',
                    letterSpacing: 0,
                  }}
                >
                  Your Column
                </span>
              </div>
            </div>

            {/* The bar itself */}
            <div
              style={{
                width: BAR_WIDTH,
                height: BAR_HEIGHT,
                borderRadius: 20,
                backgroundColor: COLORS.bgSurfaceAlt,
                position: 'relative',
                opacity: barOpacity,
                transform: `scaleY(${barScaleY})`,
                transformOrigin: 'bottom',
                overflow: 'hidden',
              }}
            >
              {/* Fill gradient */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: fillHeight,
                  borderRadius: 20,
                  background: `linear-gradient(to top, ${COLORS.techBlue}, ${COLORS.aiPurple})`,
                }}
              />

              {/* Tick marks */}
              {[0.2, 0.4, 0.6, 0.8].map((pos) => (
                <div
                  key={pos}
                  style={{
                    position: 'absolute',
                    bottom: `${pos * 100}%`,
                    left: -4,
                    width: BAR_WIDTH + 8,
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}

              {/* Slider handle */}
              {frame >= BEATS.HANDLE_IN && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: handlePosition * (BAR_HEIGHT - 32),
                    left: '50%',
                    transform: `translateX(-50%) scale(${handleScale})`,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                    zIndex: 2,
                  }}
                />
              )}
            </div>

            {/* Scale labels (right side) - appear as handle passes */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                justifyContent: 'space-between',
                height: BAR_HEIGHT,
                alignItems: 'flex-start',
                width: 240,
              }}
            >
              {SCALE_LABELS.map((label, i) => {
                const labelProgress = spring({
                  frame: frame - label.frame,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });
                const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
                const labelX = interpolate(labelProgress, [0, 1], [10, 0]);

                return (
                  <div
                    key={label.text}
                    style={{
                      opacity: labelOpacity,
                      transform: `translateX(${labelX}px)`,
                      ...TYPOGRAPHY.label,
                      fontSize: 24,
                      color: COLORS.textMuted,
                      textTransform: 'none',
                      letterSpacing: 0,
                    }}
                  >
                    {label.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparison boxes */}
          {frame >= BEATS.COMPARISON_BOXES && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginTop: 20,
                opacity: dimOpacity,
              }}
            >
              {/* Left box - Spreadsheet */}
              <div
                style={{
                  opacity: interpolate(leftBoxProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(leftBoxProgress, [0, 1], [20, 0])}px)`,
                  backgroundColor: COLORS.bgSurface,
                  borderRadius: 12,
                  padding: 24,
                  border: `1px solid ${COLORS.techBlue}`,
                  width: 280,
                }}
              >
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 22,
                    color: COLORS.textMuted,
                    marginBottom: 8,
                  }}
                >
                  LEARNED FROM
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 36,
                    color: COLORS.techBlue,
                    fontWeight: 600,
                  }}
                >
                  Your column
                </div>
                {/* Mini spreadsheet icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginTop: 8 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke={COLORS.techBlue} strokeWidth="1.5" />
                  <line x1="3" y1="9" x2="21" y2="9" stroke={COLORS.techBlue} strokeWidth="1" />
                  <line x1="3" y1="15" x2="21" y2="15" stroke={COLORS.techBlue} strokeWidth="1" />
                  <line x1="9" y1="3" x2="9" y2="21" stroke={COLORS.techBlue} strokeWidth="1" />
                </svg>
              </div>

              {/* Equals sign */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: frame >= BEATS.EQUALS_SIGN ? 1 : 0,
                }}
              >
                <span
                  style={{
                    fontSize: 72,
                    color: COLORS.insightOrange,
                    fontWeight: 700,
                    fontFamily: TYPOGRAPHY.hero.fontFamily,
                    transform: `scale(${equalsScale})`,
                    display: 'inline-block',
                    textShadow: `0 0 20px rgba(245,158,11,${equalsGlow})`,
                    opacity: equalsOpacity,
                  }}
                >
                  =
                </span>
              </div>

              {/* Right box - Internet */}
              <div
                style={{
                  opacity: interpolate(rightBoxProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(rightBoxProgress, [0, 1], [20, 0])}px)`,
                  backgroundColor: COLORS.bgSurface,
                  borderRadius: 12,
                  padding: 24,
                  border: `1px solid ${COLORS.aiPurple}`,
                  width: 280,
                }}
              >
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 22,
                    color: COLORS.textMuted,
                    marginBottom: 8,
                  }}
                >
                  LEARNED FROM
                </div>
                <div
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 36,
                    color: COLORS.aiPurple,
                    fontWeight: 600,
                  }}
                >
                  The internet
                </div>
                {/* Globe icon */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ marginTop: 8 }}>
                  <circle cx="12" cy="12" r="10" stroke={COLORS.aiPurple} strokeWidth="1.5" />
                  <ellipse cx="12" cy="12" rx="5" ry="10" stroke={COLORS.aiPurple} strokeWidth="1" />
                  <line x1="2" y1="12" x2="22" y2="12" stroke={COLORS.aiPurple} strokeWidth="1" />
                </svg>
              </div>
            </div>
          )}

          {/* "Same mechanism" text */}
          {frame >= BEATS.EQUALS_SIGN && (
            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
              }}
            >
              <ShinyText
                startFrame={0}
                color={COLORS.insightOrange}
                shineColor="#FFFFFF"
                duration={45}
                pauseDuration={9999}
                fontSize={48}
                fontWeight={600}
              >
                Same mechanism
              </ShinyText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
