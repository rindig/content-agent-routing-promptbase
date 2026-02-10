import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GradientText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  BG_TO_DARK: 0,
  TIMELINE_FADE: 0,
  INTERFACE_CARD: 30,
  TYPING_START: 40,
  VOICE_DROPDOWN: 60,
  TYPING_END: 80,
  GENERATE_BUTTON: 80,
  BUTTON_PRESS: 95,
  LOADING: 98,
  DONE: 110,
  AI_WAVEFORM: 120,
  ORIGINAL_WAVEFORM: 150,
  INTERFACE_DIM: 180,
  WAVEFORMS_MERGE: 185,
  INDISTINGUISHABLE: 195,
  FROM_TEXT_BOX: 210,
  SCENE_END: 240,
};

const TYPED_TEXT = 'This is a demonstration of voice synthesis technology.';

// ── Mini waveform bar data ──
const generateBars = (seed: number): number[] => {
  const bars: number[] = [];
  for (let i = 0; i < 60; i++) {
    bars.push(
      Math.abs(Math.sin(i * 0.35 + seed) + Math.sin(i * 0.8 + seed) * 0.4) / 1.4
    );
  }
  return bars;
};

const AI_BARS: number[] = generateBars(1.5);
const ORIGINAL_BARS: number[] = generateBars(1.52); // Nearly identical

// ── Waveform Row ──
const WaveformRow: React.FC<{
  frame: number;
  bars: number[];
  color: string;
  label: string;
  startFrame: number;
  labelFrame: number;
  yTarget?: number;
  mergeActive: boolean;
  mergeFrame: number;
}> = ({ frame, bars, color, label, startFrame, labelFrame, yTarget = 0, mergeActive, mergeFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  // Merge slide
  const mergeProgress = mergeActive
    ? spring({
        frame: frame - mergeFrame,
        fps: 30,
        config: { damping: 200, mass: 1, stiffness: 100 },
      })
    : 0;
  const mergeY = interpolate(mergeProgress, [0, 1], [0, yTarget]);

  // Speaker pulse
  const speakerPulse = interpolate(
    Math.sin((frame - startFrame) * 0.15),
    [-1, 1],
    [0.6, 1]
  );

  // Label opacity
  const labelOpacity = interpolate(frame - labelFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        transform: `translateY(${mergeY}px)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Speaker icon */}
        <svg width={28} height={28} viewBox="0 0 28 28" style={{ opacity: speakerPulse }}>
          <circle cx={14} cy={14} r={6} fill="none" stroke={color} strokeWidth={2} />
          <path d="M21 8 Q26 14 21 20" fill="none" stroke={color} strokeWidth={1.5} opacity={0.6} />
          <path d="M23 5 Q30 14 23 23" fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
        </svg>

        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 60 }}>
          {bars.map((h, i) => {
            const barProgress = interpolate(relFrame - i * 0.5, [0, 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: Math.max(2, h * 50 * barProgress),
                  backgroundColor: color,
                  opacity: 0.8,
                  borderRadius: 1,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Label */}
      {frame >= labelFrame && (
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color,
            textTransform: 'none' as const,
            letterSpacing: 0,
            opacity: labelOpacity,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// ── Main Scene ──
export const Scene4_Reproducible: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardProgress = spring({
    frame: frame - BEATS.INTERFACE_CARD,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
  const cardY = interpolate(cardProgress, [0, 1], [30, 0]);

  // Typewriter
  const typeFrame = frame - BEATS.TYPING_START;
  const charsVisible = typeFrame >= 0
    ? Math.min(Math.floor(typeFrame * 1.25), TYPED_TEXT.length)
    : 0;
  const visibleText = TYPED_TEXT.slice(0, charsVisible);
  const cursorBlink = Math.sin(frame * 0.2) > 0;

  // Voice dropdown
  const dropdownProgress = spring({
    frame: frame - BEATS.VOICE_DROPDOWN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const dropdownOpacity = interpolate(dropdownProgress, [0, 1], [0, 1]);

  // Generate button
  const btnProgress = spring({
    frame: frame - BEATS.GENERATE_BUTTON,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const btnScale = interpolate(btnProgress, [0, 1], [0.5, 1]);
  const btnOpacity = interpolate(btnProgress, [0, 1], [0, 1]);

  // Button press
  const pressFrame = frame - BEATS.BUTTON_PRESS;
  const pressScale = pressFrame >= 0 && pressFrame < 6
    ? interpolate(pressFrame, [0, 3, 6], [1, 0.95, 1])
    : 1;

  // Loading spinner
  const isLoading = frame >= BEATS.LOADING && frame < BEATS.DONE;
  const spinAngle = isLoading ? (frame - BEATS.LOADING) * 36 : 0;
  const isDone = frame >= BEATS.DONE;

  // Interface dim
  const dimOpacity = frame >= BEATS.INTERFACE_DIM
    ? interpolate(frame - BEATS.INTERFACE_DIM, [0, 15], [1, 0.3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Indistinguishable text
  const indistProgress = spring({
    frame: frame - BEATS.INDISTINGUISHABLE,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const indistScale = interpolate(indistProgress, [0, 1], [0.5, 1]);
  const indistOpacity = interpolate(indistProgress, [0, 1], [0, 1]);

  // "From a text box" text
  const fromTextProgress = spring({
    frame: frame - BEATS.FROM_TEXT_BOX,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const fromTextOpacity = interpolate(fromTextProgress, [0, 1], [0, 1]);

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
          gap: 24,
        }}
      >
        {/* Interface Card */}
        {frame >= BEATS.INTERFACE_CARD && (
          <div
            style={{
              width: 900,
              backgroundColor: COLORS.bgSurface,
              borderRadius: 16,
              border: `1px solid ${COLORS.panelBorder}`,
              padding: '28px 32px',
              opacity: cardOpacity * dimOpacity,
              transform: `translateY(${cardY}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            {/* Text label */}
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                textTransform: 'none' as const,
                letterSpacing: 0,
              }}
            >
              Enter text to speak:
            </span>

            {/* Text area */}
            <div
              style={{
                backgroundColor: COLORS.codeBg,
                borderRadius: 8,
                padding: '16px 20px',
                minHeight: 80,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 32,
                  color: COLORS.codeText,
                }}
              >
                {visibleText}
                {charsVisible < TYPED_TEXT.length && charsVisible > 0 && (
                  <span style={{ opacity: cursorBlink ? 1 : 0, color: COLORS.textMuted }}>
                    |
                  </span>
                )}
              </span>
            </div>

            {/* Voice dropdown */}
            {frame >= BEATS.VOICE_DROPDOWN && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: dropdownOpacity,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.textMuted,
                    textTransform: 'none' as const,
                    letterSpacing: 0,
                  }}
                >
                  Voice:
                </span>
                <div
                  style={{
                    backgroundColor: COLORS.bgSurfaceAlt,
                    borderRadius: 8,
                    padding: '8px 16px',
                    border: `1px solid ${COLORS.panelBorder}`,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 24,
                      color: COLORS.techBlue,
                      textTransform: 'none' as const,
                      letterSpacing: 0,
                    }}
                  >
                    John_Clone_v2
                  </span>
                </div>
              </div>
            )}

            {/* Generate button */}
            {frame >= BEATS.GENERATE_BUTTON && (
              <div
                style={{
                  alignSelf: 'center',
                  opacity: btnOpacity,
                  transform: `scale(${btnScale * pressScale})`,
                }}
              >
                <div
                  style={{
                    backgroundColor: isDone ? COLORS.solutionGreen : COLORS.techBlue,
                    borderRadius: 24,
                    padding: '12px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    minWidth: 160,
                  }}
                >
                  {/* Loading spinner */}
                  {isLoading && (
                    <svg width={20} height={20} viewBox="0 0 20 20" style={{ transform: `rotate(${spinAngle}deg)` }}>
                      <circle
                        cx={10}
                        cy={10}
                        r={8}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        strokeDasharray="30 20"
                      />
                    </svg>
                  )}
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 28,
                      color: '#FFFFFF',
                      textTransform: 'none' as const,
                      letterSpacing: 0,
                    }}
                  >
                    {isDone ? 'Done' : 'Generate'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI-generated waveform */}
        {frame >= BEATS.AI_WAVEFORM && (
          <WaveformRow
            frame={frame}
            bars={AI_BARS}
            color={COLORS.aiPurple}
            label="AI-generated voice"
            startFrame={BEATS.AI_WAVEFORM}
            labelFrame={BEATS.AI_WAVEFORM + 20}
            yTarget={40}
            mergeActive={frame >= BEATS.WAVEFORMS_MERGE}
            mergeFrame={BEATS.WAVEFORMS_MERGE}
          />
        )}

        {/* Original voice waveform */}
        {frame >= BEATS.ORIGINAL_WAVEFORM && (
          <WaveformRow
            frame={frame}
            bars={ORIGINAL_BARS}
            color={COLORS.techBlue}
            label="Original voice"
            startFrame={BEATS.ORIGINAL_WAVEFORM}
            labelFrame={BEATS.ORIGINAL_WAVEFORM + 10}
            yTarget={-40}
            mergeActive={frame >= BEATS.WAVEFORMS_MERGE}
            mergeFrame={BEATS.WAVEFORMS_MERGE}
          />
        )}

        {/* Indistinguishable text */}
        {frame >= BEATS.INDISTINGUISHABLE && (
          <div
            style={{
              opacity: indistOpacity,
              transform: `scale(${indistScale})`,
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            <GradientText
              startFrame={BEATS.INDISTINGUISHABLE}
              colors={[COLORS.techBlue, COLORS.aiPurple]}
              fontSize={52}
              fontWeight={600}
              direction="horizontal"
            >
              Indistinguishable
            </GradientText>
          </div>
        )}

        {/* "From a text box." */}
        {frame >= BEATS.FROM_TEXT_BOX && (
          <div
            style={{
              opacity: fromTextOpacity,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 44,
                color: COLORS.insightOrange,
              }}
            >
              From a text box.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
