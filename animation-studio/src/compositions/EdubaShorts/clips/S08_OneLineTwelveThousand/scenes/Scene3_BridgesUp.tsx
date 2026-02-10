import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  REVERSE_ZOOM: 0,
  FIGURES_IN: 30,
  EIGHTH_FIGURE: 80,
  AI_LAYER: 80,
  LABEL_IN: 120,
  FINAL_COMPRESS: 180,
  OBSERVATION: 180,
  FADE_LAYERS: 240,
};

interface LayerDef {
  label: string;
  color: string;
}

const LAYERS: LayerDef[] = [
  { label: 'Electrons', color: COLORS.errorRed },
  { label: 'Transistors', color: COLORS.errorRed },
  { label: 'Machine Code', color: COLORS.insightOrange },
  { label: 'Assembly', color: COLORS.insightOrange },
  { label: 'C Interpreter', color: COLORS.techBlue },
  { label: 'Bytecode', color: COLORS.techBlue },
  { label: 'Syntax Tree', color: COLORS.techBlue },
];

const FIGURE_COLORS: string[] = [
  COLORS.errorRed,
  COLORS.errorRed,
  COLORS.insightOrange,
  COLORS.insightOrange,
  COLORS.techBlue,
  COLORS.techBlue,
  COLORS.techBlue,
];

/** Simple stick figure icon */
const FigureIcon: React.FC<{
  color: string;
  size: number;
  opacity: number;
  glow?: boolean;
}> = ({ color, size, opacity, glow }) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 40 60"
    style={{
      opacity,
      filter: glow ? `drop-shadow(0 0 8px ${color})` : undefined,
    }}
  >
    {/* Head */}
    <circle cx={20} cy={10} r={7} fill={color} />
    {/* Body */}
    <line x1={20} y1={17} x2={20} y2={38} stroke={color} strokeWidth={3} strokeLinecap="round" />
    {/* Arms */}
    <line x1={8} y1={26} x2={32} y2={26} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    {/* Left leg */}
    <line x1={20} y1={38} x2={10} y2={55} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    {/* Right leg */}
    <line x1={20} y1={38} x2={30} y2={55} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

export const Scene3_BridgesUp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Reverse zoom: scale down from 0.85 to smaller
  const zoomProgress = spring({
    frame: frame - BEATS.REVERSE_ZOOM,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const stackScale = interpolate(zoomProgress, [0, 1], [0.85, 0.5]);

  // Final compress
  const compressProgress = spring({
    frame: frame - BEATS.FINAL_COMPRESS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const finalScale = frame >= BEATS.FINAL_COMPRESS
    ? interpolate(compressProgress, [0, 1], [stackScale, 0.4])
    : stackScale;

  // Fade layers out
  const fadeLayersProgress = frame >= BEATS.FADE_LAYERS
    ? interpolate(
        frame,
        [BEATS.FADE_LAYERS, BEATS.FADE_LAYERS + 40],
        [1, 0.05],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Fade figures
  const fadeFiguresProgress = frame >= BEATS.FADE_LAYERS
    ? interpolate(
        frame,
        [BEATS.FADE_LAYERS, BEATS.FADE_LAYERS + 40],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  const layerHeight = 52;
  const layerGap = 8;
  const totalLayerHeight = LAYERS.length * (layerHeight + layerGap);

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Stack container with zoom */}
        <div
          style={{
            transform: `scale(${finalScale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: layerGap,
            opacity: fadeLayersProgress,
          }}
        >
          {/* AI Layer (8th, at top) */}
          {frame >= BEATS.AI_LAYER && (() => {
            const aiProgress = spring({
              frame: frame - BEATS.AI_LAYER,
              fps,
              config: SPRING_CONFIGS.slow,
            });
            const aiOpacity = interpolate(aiProgress, [0, 1], [0, 1]);
            const aiScale = interpolate(aiProgress, [0, 1], [0.9, 1]);

            return (
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: aiOpacity * fadeFiguresProgress,
                  transform: `scale(${aiScale})`,
                  marginBottom: 12,
                }}
              >
                {/* 8th figure */}
                <FigureIcon color={COLORS.aiPurple} size={56} opacity={1} glow />

                {/* AI layer bar */}
                <div
                  style={{
                    width: 780,
                    height: layerHeight,
                    backgroundColor: COLORS.bgSurface,
                    borderRadius: 8,
                    border: `2px solid ${COLORS.aiPurple}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    boxShadow: `0 0 20px ${COLORS.glowPurple}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.title.fontFamily,
                      fontWeight: 500,
                      fontSize: 28,
                      color: COLORS.aiPurple,
                    }}
                  >
                    Prompt &rarr; Code
                  </span>
                </div>

                {/* AI label */}
                {frame >= BEATS.LABEL_IN && (() => {
                  const labelProgress = spring({
                    frame: frame - BEATS.LABEL_IN,
                    fps,
                    config: SPRING_CONFIGS.snappy,
                  });
                  return (
                    <div
                      style={{
                        position: 'absolute',
                        right: -260,
                        top: '50%',
                        transform: `translateY(-50%)`,
                        opacity: interpolate(labelProgress, [0, 1], [0, 1]),
                      }}
                    >
                      <BlurText
                        startFrame={BEATS.LABEL_IN}
                        animateBy="words"
                        direction="bottom"
                        staggerDelay={3}
                        blurAmount={8}
                        distance={20}
                        fontSize={36}
                      >
                        AI is just the next layer
                      </BlurText>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* Code panel miniature at top */}
          <div
            style={{
              width: 780,
              backgroundColor: COLORS.codeBg,
              borderRadius: 8,
              padding: '8px 16px',
              border: `1px solid ${COLORS.panelBorder}`,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 20,
                color: COLORS.codeText,
              }}
            >
              <span style={{ color: COLORS.techBlue }}>print</span>
              <span style={{ color: COLORS.textMuted }}>(</span>
              <span style={{ color: COLORS.solutionGreen }}>"Hello, World!"</span>
              <span style={{ color: COLORS.textMuted }}>)</span>
            </div>
          </div>

          {/* 7 layers in reverse order (top = Syntax Tree, bottom = Electrons) */}
          {[...LAYERS].reverse().map((layer, i) => {
            const figureIndex = LAYERS.length - 1 - i;
            const figureDelay = BEATS.FIGURES_IN + i * 5;
            const figureVisible = frame >= figureDelay;

            const figureProgress = figureVisible
              ? spring({
                  frame: frame - figureDelay,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                })
              : 0;

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                {/* Figure icon */}
                <div
                  style={{
                    width: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    opacity: fadeFiguresProgress,
                  }}
                >
                  {figureVisible && (
                    <FigureIcon
                      color={FIGURE_COLORS[figureIndex]}
                      size={32}
                      opacity={interpolate(figureProgress, [0, 1], [0, 1])}
                    />
                  )}
                </div>

                {/* Layer bar */}
                <div
                  style={{
                    width: 780,
                    height: layerHeight,
                    backgroundColor: COLORS.bgSurface,
                    borderRadius: 8,
                    border: `1px solid ${COLORS.panelBorder}`,
                    borderLeft: `3px solid ${layer.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: TYPOGRAPHY.title.fontFamily,
                      fontWeight: 500,
                      fontSize: 24,
                      color: layer.color,
                    }}
                  >
                    {layer.label}
                  </span>
                </div>

                {/* Bridge arc (SVG line from this layer upward) */}
                {figureVisible && i > 0 && (
                  <svg
                    style={{
                      position: 'absolute',
                      left: 20,
                      top: -(layerGap + 10),
                      width: 20,
                      height: layerGap + 20,
                      overflow: 'visible',
                      opacity: fadeFiguresProgress,
                    }}
                  >
                    <path
                      d={`M 0 ${layerGap + 20} Q 10 ${(layerGap + 20) / 2} 0 0`}
                      fill="none"
                      stroke={FIGURE_COLORS[figureIndex]}
                      strokeWidth={2}
                      strokeDasharray={30}
                      strokeDashoffset={interpolate(
                        figureProgress,
                        [0, 1],
                        [30, 0]
                      )}
                      opacity={0.5}
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Observation text at bottom */}
        {frame >= BEATS.OBSERVATION && (
          <div
            style={{
              position: 'absolute',
              bottom: 220,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: '0 54px',
            }}
          >
            {(() => {
              const obsProgress = spring({
                frame: frame - BEATS.OBSERVATION,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const obsY = interpolate(obsProgress, [0, 1], [20, 0]);
              const obsOpacity = interpolate(obsProgress, [0, 1], [0, 1]);

              // Fade out with layers
              const obsFade = frame >= BEATS.FADE_LAYERS
                ? interpolate(
                    frame,
                    [BEATS.FADE_LAYERS, BEATS.FADE_LAYERS + 60],
                    [1, 1],  // observation text holds through fade
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )
                : 1;

              return (
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontWeight: 400,
                    fontSize: 40,
                    color: COLORS.textBody,
                    textAlign: 'center',
                    opacity: obsOpacity * obsFade,
                    transform: `translateY(${obsY}px)`,
                    lineHeight: 1.3,
                  }}
                >
                  Each one made the hard part invisible
                </span>
              );
            })()}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
