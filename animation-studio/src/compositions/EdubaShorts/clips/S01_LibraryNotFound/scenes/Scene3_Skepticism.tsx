import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { ShinyText, FocusBlur } from '../../../../../components/core/effects';
import { HistoricalPanel, CodePanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  HISTORICAL_PANEL_IN: 5,
  COMPILER_LABEL: 15,
  COMPILER_CODE_IN: 20,
  SKEPTIC_QUOTE_1952: 50,
  HISTORICAL_DIM: 80,
  MODERN_LABEL_IN: 100,
  MODERN_OUTPUT_LABEL: 108,
  MODERN_CODE_IN: 112,
  SKEPTIC_QUOTE_2026: 130,
  FOCUS_BLUR_START: 150,
  BRIDGE_TEXT_IN: 158,
  PANELS_FADE_OUT: 180,
  LAYER_1_IN: 200,
  LAYER_2_IN: 218,
  LAYER_3_IN: 236,
  LAYER_4_IN: 254,
  LAYER_5_IN: 272,
  BUILDING_LABEL: 280,
  HOLD_START: 310,
  FADE_OUT_START: 345,
};

const COMPILER_CODE = [
  'LOAD A, 0x4F2',
  'STORE B, ???',
  'JUMP 0xERR',
];

const MODERN_CODE = [
  "import { validate } from 'schema-guard-pro';",
  '// npm: package not found',
];

/** A single layer in the error-correction stack */
const StackLayer: React.FC<{
  label: string;
  borderColor: string;
  startFrame: number;
  dashed?: boolean;
  pulseOpacity?: boolean;
  showProgress?: boolean;
  progressWidth?: number;
}> = ({ label, borderColor, startFrame, dashed, pulseOpacity, showProgress, progressWidth = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(progress, [0, 1], [0.8, 1]);
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const baseOpacity = pulseOpacity
    ? 0.4 + 0.4 * Math.sin((frame - startFrame) * 0.08)
    : 1;

  return (
    <div
      style={{
        width: 700,
        height: 80,
        borderRadius: 12,
        backgroundColor: COLORS.bgSurface,
        border: dashed
          ? `2px dashed ${borderColor}`
          : `1.5px solid ${borderColor}33`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: opacity * baseOpacity,
        transform: `scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 36,
          color: COLORS.textBody,
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {label}
      </span>

      {/* Progress bar inside layer */}
      {showProgress && frame > startFrame && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            right: 16,
            height: 3,
            backgroundColor: `${COLORS.bgSurfaceAlt}`,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressWidth}%`,
              backgroundColor: COLORS.techBlue,
              borderRadius: 2,
            }}
          />
        </div>
      )}
    </div>
  );
};

export const Scene3_Skepticism: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Historical panel dims at BEATS.HISTORICAL_DIM
  const historicalDim = interpolate(
    frame,
    [BEATS.HISTORICAL_DIM, BEATS.HISTORICAL_DIM + 20],
    [1, 0.3],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Panels fade out at BEATS.PANELS_FADE_OUT
  const panelsFade = interpolate(
    frame,
    [BEATS.PANELS_FADE_OUT, BEATS.PANELS_FADE_OUT + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // bgWarm overlay for historical segments
  const warmOverlay = interpolate(
    frame,
    [0, 10, BEATS.MODERN_LABEL_IN, BEATS.MODERN_LABEL_IN + 20],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Progress bar interpolation for the top "AI Error Correction" layer
  const progressBarWidth = interpolate(
    frame,
    [BEATS.LAYER_5_IN, BEATS.HOLD_START, BEATS.FADE_OUT_START],
    [0, 35, 42],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const showHistoricalSection = frame < BEATS.PANELS_FADE_OUT + 20;
  const showLayerStack = frame >= BEATS.LAYER_1_IN - 10;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT_START}
      fadeOutDuration={15}
    >
      {/* Warm overlay for historical segments */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.bgWarm,
          opacity: warmOverlay,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          gap: 20,
          position: 'relative',
        }}
      >
        {/* === HISTORICAL + MODERN PANELS === */}
        {showHistoricalSection && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              width: '100%',
              opacity: panelsFade,
            }}
          >
            {/* 1952 Historical Panel */}
            <div style={{ opacity: historicalDim, width: '100%' }}>
              <HistoricalPanel
                year="1952"
                label="Grace Hopper's Compiler"
                badgeColor={COLORS.historyGold}
                startFrame={BEATS.HISTORICAL_PANEL_IN}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <AnimatedText
                    variant="body"
                    size={40}
                    color={COLORS.textMuted}
                    entrance="fade"
                    startFrame={BEATS.COMPILER_LABEL}
                  >
                    Compiler output:
                  </AnimatedText>

                  <CodePanel
                    lines={COMPILER_CODE}
                    startFrame={BEATS.COMPILER_CODE_IN}
                    highlightLines={[1, 2]}
                    highlightColor={COLORS.errorRed}
                    staggerDelay={4}
                    fontSize={28}
                  />

                  {/* Skeptic quote 1952 */}
                  <AnimatedText
                    variant="body"
                    size={44}
                    color={COLORS.errorRed}
                    entrance="slideUp"
                    startFrame={BEATS.SKEPTIC_QUOTE_1952}
                    springPreset="snappy"
                    style={{ fontStyle: 'italic', textAlign: 'center' }}
                  >
                    {'"The compiler is broken."'}
                  </AnimatedText>
                </div>
              </HistoricalPanel>
            </div>

            {/* 2026 Modern Panel */}
            {frame >= BEATS.MODERN_LABEL_IN && (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                  <AnimatedText
                    variant="label"
                    size={28}
                    color={COLORS.techBlue}
                    entrance="fade"
                    startFrame={BEATS.MODERN_LABEL_IN}
                    align="center"
                  >
                    2026
                  </AnimatedText>

                  <AnimatedText
                    variant="body"
                    size={40}
                    color={COLORS.textMuted}
                    entrance="fade"
                    startFrame={BEATS.MODERN_OUTPUT_LABEL}
                  >
                    AI output:
                  </AnimatedText>

                  <div style={{ width: '100%' }}>
                    <CodePanel
                      lines={MODERN_CODE}
                      startFrame={BEATS.MODERN_CODE_IN}
                      highlightLines={[0]}
                      highlightColor={COLORS.errorRed}
                      staggerDelay={4}
                      fontSize={28}
                    />
                  </div>

                  {/* Skeptic quote 2026 */}
                  <AnimatedText
                    variant="body"
                    size={44}
                    color={COLORS.errorRed}
                    entrance="slideUp"
                    startFrame={BEATS.SKEPTIC_QUOTE_2026}
                    springPreset="snappy"
                    style={{ fontStyle: 'italic', textAlign: 'center' }}
                  >
                    {'"The AI is broken."'}
                  </AnimatedText>
                </div>
              </div>
            )}

            {/* Focus blur bridge text */}
            {frame >= BEATS.FOCUS_BLUR_START && frame < BEATS.PANELS_FADE_OUT && (
              <FocusBlur
                startFrame={BEATS.FOCUS_BLUR_START}
                focusFrame={BEATS.FOCUS_BLUR_START + 5}
                blurOutFrame={BEATS.FOCUS_BLUR_START + 25}
                blurAmount={6}
              >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <ShinyText
                    startFrame={BEATS.BRIDGE_TEXT_IN}
                    color="#FFFFFF"
                    shineColor={COLORS.historyGold}
                    fontSize={44}
                    fontWeight={600}
                    duration={45}
                  >
                    Same skepticism. Same window.
                  </ShinyText>
                </div>
              </FocusBlur>
            )}
          </div>
        )}

        {/* === LAYER STACK: Error correction being built === */}
        {showLayerStack && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              alignItems: 'center',
              gap: 10,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: interpolate(
                frame,
                [BEATS.LAYER_1_IN - 10, BEATS.LAYER_1_IN + 5],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            {/* Layer 1: Raw Code (bottom) */}
            <StackLayer
              label="Raw Code"
              borderColor={COLORS.techBlue}
              startFrame={BEATS.LAYER_1_IN}
            />

            {/* Layer 2: Debuggers */}
            <StackLayer
              label="Debuggers"
              borderColor={COLORS.solutionGreen}
              startFrame={BEATS.LAYER_2_IN}
            />

            {/* Layer 3: Error Handling */}
            <StackLayer
              label="Error Handling"
              borderColor={COLORS.solutionGreen}
              startFrame={BEATS.LAYER_3_IN}
            />

            {/* Layer 4: Testing Frameworks */}
            <StackLayer
              label="Testing Frameworks"
              borderColor={COLORS.solutionGreen}
              startFrame={BEATS.LAYER_4_IN}
            />

            {/* Layer 5: AI Error Correction (top, in-progress) */}
            <StackLayer
              label="AI Error Correction"
              borderColor={COLORS.aiPurple}
              startFrame={BEATS.LAYER_5_IN}
              dashed
              pulseOpacity
              showProgress
              progressWidth={progressBarWidth}
            />

            {/* BUILDING label */}
            {frame >= BEATS.BUILDING_LABEL && (
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 40,
                }}
              >
                <AnimatedText
                  variant="label"
                  size={24}
                  color={COLORS.aiPurple}
                  entrance="fade"
                  startFrame={BEATS.BUILDING_LABEL}
                >
                  BUILDING...
                </AnimatedText>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
