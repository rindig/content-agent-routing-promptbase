import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── S09 extended palette ──
const S09_COLORS = {
  electronGlow: '#A78BFA',
  ghostElectron: 'rgba(167,139,250,0.35)',
};

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  BASE_LAYER_IN: 15,
  BASE_LABEL: 20,
  BASE_SUBTITLE: 30,
  MATERIALS_IN: 50,
  MATERIALS_ICON: 55,
  MATERIALS_LABEL: 58,
  MATERIALS_SUBTITLE: 68,
  FINFET_IN: 100,
  FINFET_ICON: 105,
  FINFET_LABEL: 108,
  FINFET_SUBTITLE: 118,
  GAA_IN: 155,
  GAA_ICON: 160,
  GAA_LABEL: 163,
  GAA_SUBTITLE: 173,
  GLOW_WAVE: 210,
  PATCHES_LABEL: 225,
  HOLD: 260,
};

// ── Ghost electron for base layer ──
const GhostCloud: React.FC<{
  frame: number;
  index: number;
  opacity: number;
}> = ({ frame, index, opacity }) => {
  const x = 120 + index * 280;
  const jitterX = Math.sin(frame * 0.06 + index * 2) * 8;
  const jitterY = Math.cos(frame * 0.05 + index * 3) * 6;
  const size = 18 + 4 * Math.sin(frame * 0.08 + index);

  return (
    <div
      style={{
        position: 'absolute',
        left: x + jitterX,
        top: 40 + jitterY,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${S09_COLORS.electronGlow}88 0%, transparent 70%)`,
        opacity,
      }}
    />
  );
};

// ── Lattice Grid Icon (New Materials) ──
const LatticeIcon: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={60} height={60} style={{ opacity, flexShrink: 0 }}>
    {/* 3x3 grid of circles connected by lines */}
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => {
        const cx = 10 + col * 20;
        const cy = 10 + row * 20;
        return (
          <React.Fragment key={`${row}-${col}`}>
            <circle
              cx={cx}
              cy={cy}
              r={4}
              fill={COLORS.solutionGreen}
              opacity={0.8}
            />
            {/* Horizontal connector */}
            {col < 2 && (
              <line
                x1={cx + 4}
                y1={cy}
                x2={cx + 16}
                y2={cy}
                stroke={COLORS.solutionGreen}
                strokeWidth={1}
                opacity={0.5}
              />
            )}
            {/* Vertical connector */}
            {row < 2 && (
              <line
                x1={cx}
                y1={cy + 4}
                x2={cx}
                y2={cy + 16}
                stroke={COLORS.solutionGreen}
                strokeWidth={1}
                opacity={0.5}
              />
            )}
          </React.Fragment>
        );
      })
    )}
  </svg>
);

// ── FinFET Icon ──
const FinFETIcon: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={60} height={60} style={{ opacity, flexShrink: 0 }}>
    {/* Base line */}
    <line
      x1={5}
      y1={50}
      x2={55}
      y2={50}
      stroke={COLORS.techBlue}
      strokeWidth={2}
    />
    {/* Three vertical fins */}
    {[15, 30, 45].map((x, i) => (
      <rect
        key={i}
        x={x - 4}
        y={12}
        width={8}
        height={38}
        rx={2}
        fill={COLORS.techBlue}
        opacity={0.8}
      />
    ))}
  </svg>
);

// ── Gate-All-Around Icon ──
const GAAIcon: React.FC<{ opacity: number }> = ({ opacity }) => (
  <svg width={60} height={60} style={{ opacity, flexShrink: 0 }}>
    {/* Outer circle (gate) */}
    <circle
      cx={30}
      cy={30}
      r={24}
      fill="none"
      stroke={COLORS.solutionGreen}
      strokeWidth={2}
    />
    {/* Inner square (channel) */}
    <rect
      x={18}
      y={18}
      width={24}
      height={24}
      rx={2}
      fill={COLORS.techBlue}
      opacity={0.7}
    />
  </svg>
);

// ── Layer component ──
interface LayerConfig {
  label: string;
  subtitle: string;
  labelColor: string;
  icon: React.ReactNode;
  height: number;
  bgColor: string;
  enterFrame: number;
  iconFrame: number;
  labelFrame: number;
  subtitleFrame: number;
  fromDirection: 'below' | 'above';
}

// ── Scene4_Countermeasures ──
export const Scene4_Countermeasures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const layerWidth = 860;
  const stackLeft = (1080 - layerWidth) / 2;
  const stackBottom = 1400; // bottom of the stack

  // ── Base layer: Quantum Tunneling problem ──
  const baseProgress = spring({
    frame: frame - BEATS.BASE_LAYER_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const baseY = interpolate(baseProgress, [0, 1], [50, 0]);
  const baseOpacity = interpolate(baseProgress, [0, 1], [0, 1]);

  // Base label
  const baseLabelProgress = spring({
    frame: frame - BEATS.BASE_LABEL,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Base subtitle
  const baseSubProgress = spring({
    frame: frame - BEATS.BASE_SUBTITLE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Determine how much the base layer dims based on how many countermeasures are in
  const baseDimFactor = (() => {
    if (frame >= BEATS.GAA_IN + 20) return 0.4;
    if (frame >= BEATS.FINFET_IN + 20) return 0.6;
    if (frame >= BEATS.MATERIALS_IN + 20) return 0.8;
    return 1.0;
  })();

  // Ghost electron speed slowing as countermeasures land
  const ghostSpeedFactor = (() => {
    if (frame >= BEATS.GAA_IN + 20) return 0.3;
    if (frame >= BEATS.FINFET_IN + 20) return 0.5;
    if (frame >= BEATS.MATERIALS_IN + 20) return 0.7;
    return 1.0;
  })();

  // ── Countermeasure layers ──
  const layers: LayerConfig[] = [
    {
      label: 'NEW MATERIALS',
      subtitle: 'High-K dielectrics, strained silicon',
      labelColor: COLORS.solutionGreen,
      icon: <LatticeIcon opacity={1} />,
      height: 90,
      bgColor: COLORS.bgSurfaceAlt,
      enterFrame: BEATS.MATERIALS_IN,
      iconFrame: BEATS.MATERIALS_ICON,
      labelFrame: BEATS.MATERIALS_LABEL,
      subtitleFrame: BEATS.MATERIALS_SUBTITLE,
      fromDirection: 'above',
    },
    {
      label: 'FinFET DESIGN',
      subtitle: '3D transistor wraps gate around channel',
      labelColor: COLORS.techBlue,
      icon: <FinFETIcon opacity={1} />,
      height: 90,
      bgColor: '#1D1D28',
      enterFrame: BEATS.FINFET_IN,
      iconFrame: BEATS.FINFET_ICON,
      labelFrame: BEATS.FINFET_LABEL,
      subtitleFrame: BEATS.FINFET_SUBTITLE,
      fromDirection: 'above',
    },
    {
      label: 'GATE-ALL-AROUND',
      subtitle: 'Nanosheets \u2014 complete gate control',
      labelColor: COLORS.solutionGreen,
      icon: <GAAIcon opacity={1} />,
      height: 90,
      bgColor: '#202030',
      enterFrame: BEATS.GAA_IN,
      iconFrame: BEATS.GAA_ICON,
      labelFrame: BEATS.GAA_LABEL,
      subtitleFrame: BEATS.GAA_SUBTITLE,
      fromDirection: 'above',
    },
  ];

  // Calculate cumulative heights for stacking
  const baseHeight = 100;
  const layerYPositions: number[] = [];
  let currentTop = stackBottom - baseHeight; // base layer top
  layerYPositions.push(currentTop); // index 0 = base
  for (let i = 0; i < layers.length; i++) {
    currentTop -= layers[i].height;
    layerYPositions.push(currentTop);
  }

  // ── Glow wave ──
  const glowWaveRelFrame = frame - BEATS.GLOW_WAVE;
  const glowWaveProgress =
    glowWaveRelFrame >= 0
      ? interpolate(glowWaveRelFrame, [0, 30], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : -1;
  const glowWaveFade =
    glowWaveRelFrame >= 0
      ? interpolate(glowWaveRelFrame, [20, 40], [0.15, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  // ── "Patches" label ──
  const patchesProgress = spring({
    frame: frame - BEATS.PATCHES_LABEL,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const patchesOpacity = interpolate(patchesProgress, [0, 1], [0, 1]);

  // ── Dim on exit ──
  const holdRelFrame = frame - BEATS.HOLD;
  const exitDim =
    holdRelFrame >= 20
      ? interpolate(holdRelFrame, [20, 40], [1, 0.8], {
          extrapolateRight: 'clamp',
        })
      : 1;

  return (
    <SceneContainer background="surface" fadeIn fadeInDuration={15}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: exitDim,
        }}
      >
        {/* ── Base layer: Quantum Tunneling ── */}
        <div
          style={{
            position: 'absolute',
            left: stackLeft,
            top: layerYPositions[0],
            width: layerWidth,
            height: baseHeight,
            borderRadius: 8,
            background: `linear-gradient(to right, ${COLORS.aiPurple}26, transparent)`,
            opacity: baseOpacity * baseDimFactor,
            transform: `translateY(${baseY}px)`,
            overflow: 'hidden',
          }}
        >
          {/* Ghost electron clouds inside */}
          {[0, 1, 2].map((i) => (
            <GhostCloud
              key={i}
              frame={Math.round(frame * ghostSpeedFactor)}
              index={i}
              opacity={baseDimFactor * 0.6}
            />
          ))}

          {/* Base layer content */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              padding: '0 24px',
              gap: 16,
            }}
          >
            {/* Glitch label */}
            {baseLabelProgress > 0.01 && (
              <div
                style={{
                  opacity: interpolate(baseLabelProgress, [0, 1], [0, 1]),
                }}
              >
                <GlitchText
                  color={COLORS.aiPurple}
                  fontSize={32}
                  fontWeight={700}
                  intensity={0.3}
                  speed={5}
                  enableShadows={false}
                  backgroundColor="transparent"
                >
                  QUANTUM TUNNELING
                </GlitchText>
              </div>
            )}
          </div>

          {/* "THE PROBLEM" subtitle */}
          {baseSubProgress > 0.01 && (
            <div
              style={{
                position: 'absolute',
                left: 24,
                bottom: 8,
                opacity: interpolate(baseSubProgress, [0, 1], [0, 1]),
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.errorRed,
              }}
            >
              THE PROBLEM
            </div>
          )}

          {/* Pulsing bottom layer glow */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: COLORS.aiPurple,
              opacity:
                0.2 + 0.15 * Math.sin(frame * 0.06),
            }}
          />
        </div>

        {/* ── Countermeasure layers ── */}
        {layers.map((layer, i) => {
          const layerProgress = spring({
            frame: frame - layer.enterFrame,
            fps,
            config: SPRING_CONFIGS.snappy,
          });
          const layerY = interpolate(layerProgress, [0, 1], [-30, 0]);
          const layerOpacity = interpolate(layerProgress, [0, 1], [0, 1]);

          // Icon entrance
          const iconProgress = spring({
            frame: frame - layer.iconFrame,
            fps,
            config: SPRING_CONFIGS.gentle,
          });
          const iconOpacity = interpolate(iconProgress, [0, 1], [0, 1]);

          // Label entrance
          const labelProgress = spring({
            frame: frame - layer.labelFrame,
            fps,
            config: SPRING_CONFIGS.gentle,
          });
          const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
          const labelSlideY = interpolate(labelProgress, [0, 1], [15, 0]);

          // Subtitle
          const subProgress = spring({
            frame: frame - layer.subtitleFrame,
            fps,
            config: SPRING_CONFIGS.gentle,
          });
          const subOpacity = interpolate(subProgress, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: stackLeft,
                top: layerYPositions[i + 1],
                width: layerWidth,
                height: layer.height,
                backgroundColor: layer.bgColor,
                borderTop: `1px solid ${COLORS.panelBorder}`,
                borderRadius: 8,
                opacity: layerOpacity,
                transform: `translateY(${layerY}px)`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                gap: 20,
              }}
            >
              {/* Icon */}
              <div style={{ opacity: iconOpacity }}>
                {layer.icon}
              </div>

              {/* Text content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  flex: 1,
                }}
              >
                {/* Title */}
                {labelOpacity > 0 && (
                  <div
                    style={{
                      ...TYPOGRAPHY.title,
                      fontSize: 40,
                      color: layer.labelColor,
                      opacity: labelOpacity,
                      transform: `translateY(${labelSlideY}px)`,
                    }}
                  >
                    {layer.label}
                  </div>
                )}

                {/* Subtitle */}
                {subOpacity > 0 && (
                  <div
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 26,
                      color: COLORS.textMuted,
                      opacity: subOpacity,
                    }}
                  >
                    {layer.subtitle}
                  </div>
                )}
              </div>

              {/* solutionGreen accent bar on left edge */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  borderRadius: '8px 0 0 8px',
                  backgroundColor: layer.labelColor,
                  opacity: 0.6,
                }}
              />
            </div>
          );
        })}

        {/* ── Glow wave propagating upward ── */}
        {glowWaveProgress >= 0 && glowWaveFade > 0 && (
          <div
            style={{
              position: 'absolute',
              left: stackLeft,
              width: layerWidth,
              top: interpolate(
                glowWaveProgress,
                [0, 1],
                [layerYPositions[0] + baseHeight, layerYPositions[layerYPositions.length - 1]]
              ),
              height: 20,
              background: `linear-gradient(to bottom, ${COLORS.aiPurple}00, ${COLORS.aiPurple}${Math.round(glowWaveFade * 255).toString(16).padStart(2, '0')}, ${COLORS.aiPurple}00)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── "Patches over quantum reality" label ── */}
        {patchesOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 40,
              top: layerYPositions[2] - 30,
              maxWidth: 300,
              opacity: patchesOpacity,
            }}
          >
            <AnimatedText
              variant="body"
              size={34}
              color={COLORS.insightOrange}
              startFrame={BEATS.PATCHES_LABEL}
              springPreset="slow"
              entrance="fade"
              style={{ lineHeight: 1.4 }}
            >
              Each one a patch over the quantum reality underneath
            </AnimatedText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
