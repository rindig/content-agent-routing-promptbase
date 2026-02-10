import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { BlurText, GlitchBurst } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  MINI_STACK: 10,
  LAYER_5_IN: 25,
  LAYER_6_IN: 32,
  LAYER_7_IN: 39,
  LAYER_8_IN: 46,
  LAYER_9_IN: 53,
  BRACKETS_IN: 60,
  ENGINEERING_LABEL: 65,
  QUANTUM_LABEL: 70,
  STACK_DIM: 90,
  LINE_1_IN: 120,
  LINE_2_IN: 135,
  UNDERLINE_DRAW: 155,
  GLOW_BUILD: 160,
  HOLD: 175,
  FADE_OUT: 225,
};

// ── Stack layer data ──
const BASE_LAYERS = [
  { label: 'QUANTUM TUNNELING', color: COLORS.aiPurple, isBase: true },
  { label: 'MATERIALS', color: COLORS.solutionGreen, isBase: false },
  { label: 'FinFET', color: COLORS.techBlue, isBase: false },
  { label: 'GAA', color: COLORS.solutionGreen, isBase: false },
];

const UPPER_LAYERS = [
  { label: 'TRANSISTORS', color: COLORS.techBlue, beatFrame: BEATS.LAYER_5_IN },
  { label: 'LOGIC GATES', color: '#5B9CF6', beatFrame: BEATS.LAYER_6_IN },
  { label: 'MACHINE CODE', color: COLORS.textBody, beatFrame: BEATS.LAYER_7_IN },
  { label: 'OPERATING SYSTEM', color: COLORS.textBody, beatFrame: BEATS.LAYER_8_IN },
  { label: 'APPLICATION', color: COLORS.solutionGreen, beatFrame: BEATS.LAYER_9_IN },
];

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Overall fade out ──
  const fadeOutRelFrame = frame - BEATS.FADE_OUT;
  const fadeOutOpacity =
    fadeOutRelFrame >= 0
      ? interpolate(fadeOutRelFrame, [0, 15], [1, 0], {
          extrapolateRight: 'clamp',
        })
      : 1;

  // ── Mini stack entrance ──
  const miniStackProgress = spring({
    frame: frame - BEATS.MINI_STACK,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const miniStackOpacity = interpolate(miniStackProgress, [0, 1], [0, 1]);

  // ── Stack dims for closing text ──
  const stackDimRelFrame = frame - BEATS.STACK_DIM;
  const stackDimOpacity =
    stackDimRelFrame >= 0
      ? interpolate(stackDimRelFrame, [0, 30], [1, 0.15], {
          extrapolateRight: 'clamp',
        })
      : 1;

  const stackShiftY =
    stackDimRelFrame >= 0
      ? interpolate(stackDimRelFrame, [0, 30], [0, -80], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // Stack layout
  const layerHeight = 40;
  const layerGap = 3;
  const stackWidth = 500;
  const stackLeft = (1080 - stackWidth) / 2;
  const allLayers = [...BASE_LAYERS, ...UPPER_LAYERS];
  const totalStackHeight =
    allLayers.length * layerHeight + (allLayers.length - 1) * layerGap;
  const stackStartY = 600; // vertical center offset

  // Base layer pulse
  const basePulseOpacity = 0.15 + 0.1 * Math.sin(frame * 0.06);

  // ── Brackets ──
  const bracketsProgress = spring({
    frame: frame - BEATS.BRACKETS_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const bracketsOpacity = interpolate(bracketsProgress, [0, 1], [0, 1]);

  // Engineering label
  const engLabelProgress = spring({
    frame: frame - BEATS.ENGINEERING_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const engLabelOpacity = interpolate(engLabelProgress, [0, 1], [0, 1]);

  // Quantum label
  const qLabelProgress = spring({
    frame: frame - BEATS.QUANTUM_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const qLabelOpacity = interpolate(qLabelProgress, [0, 1], [0, 1]);

  // ── Closing text ──
  const line1Visible = frame >= BEATS.LINE_1_IN;
  const line2Visible = frame >= BEATS.LINE_2_IN;

  // Glow build
  const glowRelFrame = frame - BEATS.GLOW_BUILD;
  const textGlowOpacity =
    glowRelFrame >= 0
      ? interpolate(glowRelFrame, [0, 15], [0, 0.25], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // Glow breathing during hold
  const glowBreath =
    frame >= BEATS.HOLD
      ? textGlowOpacity + 0.05 * Math.sin((frame - BEATS.HOLD) * 0.05)
      : textGlowOpacity;

  // ── Underline ──
  const underlineRelFrame = frame - BEATS.UNDERLINE_DRAW;
  const underlineProgress =
    underlineRelFrame >= 0
      ? interpolate(underlineRelFrame, [0, 20], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: fadeOutOpacity,
        }}
      >
        {/* ── Layer Stack ── */}
        <div
          style={{
            position: 'absolute',
            left: stackLeft,
            top: stackStartY,
            width: stackWidth,
            opacity: miniStackOpacity * stackDimOpacity,
            transform: `scale(0.5) translateY(${stackShiftY}px)`,
            transformOrigin: 'top center',
          }}
        >
          {allLayers.map((layer, i) => {
            const isBase = i === 0;
            const isUpper = i >= BASE_LAYERS.length;
            const upperIndex = i - BASE_LAYERS.length;

            // Upper layer entrance spring
            let layerScale = 1;
            let layerOpacityLocal = 1;
            if (isUpper) {
              const upperBeat = UPPER_LAYERS[upperIndex].beatFrame;
              const layerProgress = spring({
                frame: frame - upperBeat,
                fps,
                config: SPRING_CONFIGS.snappy,
              });
              layerScale = interpolate(layerProgress, [0, 1], [0.8, 1]);
              layerOpacityLocal = interpolate(layerProgress, [0, 1], [0, 1]);
            }

            const layerTop = i * (layerHeight + layerGap);

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: layerTop,
                  width: stackWidth,
                  height: layerHeight,
                  borderRadius: 4,
                  backgroundColor: isBase
                    ? `${layer.color}22`
                    : `${COLORS.bgSurfaceAlt}`,
                  border: isBase
                    ? `1px solid ${layer.color}44`
                    : `1px solid ${COLORS.panelBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${layerScale})`,
                  opacity: layerOpacityLocal,
                  boxShadow: isBase
                    ? `0 0 12px ${COLORS.aiPurple}${Math.round(basePulseOpacity * 255).toString(16).padStart(2, '0')}`
                    : 'none',
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 18,
                    color: layer.color,
                    letterSpacing: 1,
                  }}
                >
                  {layer.label}
                </span>
              </div>
            );
          })}

          {/* ── Brackets ── */}
          {bracketsOpacity > 0 && (
            <>
              {/* Engineering bracket (upper layers) */}
              <div
                style={{
                  position: 'absolute',
                  right: -80,
                  top: BASE_LAYERS.length * (layerHeight + layerGap),
                  height:
                    UPPER_LAYERS.length * (layerHeight + layerGap) - layerGap,
                  opacity: bracketsOpacity,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* Brace shape */}
                <svg width={20} height="100%" viewBox="0 0 20 100" preserveAspectRatio="none">
                  <path
                    d="M 2,0 Q 18,0 18,25 Q 18,48 8,50 Q 18,52 18,75 Q 18,100 2,100"
                    fill="none"
                    stroke={COLORS.textBody}
                    strokeWidth={2}
                  />
                </svg>
                {engLabelOpacity > 0 && (
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 16,
                      color: COLORS.solutionGreen,
                      marginLeft: 8,
                      opacity: engLabelOpacity,
                      whiteSpace: 'nowrap',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                    }}
                  >
                    ENGINEERING
                  </span>
                )}
              </div>

              {/* Quantum bracket (base layer only) */}
              <div
                style={{
                  position: 'absolute',
                  right: -80,
                  top: 0,
                  height: layerHeight,
                  opacity: bracketsOpacity,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width={20} height="100%" viewBox="0 0 20 100" preserveAspectRatio="none">
                  <path
                    d="M 2,0 Q 18,0 18,25 Q 18,48 8,50 Q 18,52 18,75 Q 18,100 2,100"
                    fill="none"
                    stroke={COLORS.aiPurple}
                    strokeWidth={2}
                  />
                </svg>
                {qLabelOpacity > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      opacity: qLabelOpacity,
                    }}
                  >
                    <GlitchBurst
                      burstInterval={90}
                      burstDuration={8}
                      intensity={0.2}
                      color={COLORS.aiPurple}
                      fontSize={16}
                      fontWeight={500}
                      enableShadows={false}
                      backgroundColor="transparent"
                    >
                      QUANTUM
                    </GlitchBurst>
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Closing Text ── */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: LAYOUT.safePadding,
            gap: 20,
            textShadow:
              glowBreath > 0
                ? `0 0 40px rgba(139,92,246,${glowBreath})`
                : 'none',
          }}
        >
          {line1Visible && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={12}
              distance={30}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
              style={{ justifyContent: 'center', textAlign: 'center' }}
            >
              Humans building predictable systems
            </BlurText>
          )}

          {line2Visible && (
            <div style={{ position: 'relative' }}>
              <BlurText
                startFrame={BEATS.LINE_2_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={3}
                blurAmount={12}
                distance={30}
                fontSize={44}
                fontWeight={600}
                color={COLORS.textPrimary}
                style={{ justifyContent: 'center', textAlign: 'center' }}
              >
                on top of physics that isn't.
              </BlurText>

              {/* Underline under "physics that isn't" */}
              {underlineProgress > 0 && (
                <svg
                  style={{
                    position: 'absolute',
                    bottom: -8,
                    left: '15%',
                    width: '70%',
                    height: 4,
                  }}
                >
                  <line
                    x1={0}
                    y1={2}
                    x2={`${underlineProgress * 100}%`}
                    y2={2}
                    stroke={COLORS.aiPurple}
                    strokeWidth={2}
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
