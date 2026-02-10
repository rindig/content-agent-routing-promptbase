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
  CROSSFADE: 0,
  STACK_BUILD: 20,
  GLOW_PULSE: 80,
  STACK_SHIFT: 120,
  AI_BLOCK: 130,
  CONNECTION: 160,
  SUBTITLE: 200,
};

interface LayerDef {
  label: string;
  accent: boolean;
  isTop: boolean;
  isCode: boolean;
}

const LAYERS: LayerDef[] = [
  { label: 'Hardware / OS', accent: false, isTop: false, isCode: false },
  { label: 'C Libraries', accent: false, isTop: false, isCode: false },
  { label: 'CPython Runtime', accent: false, isTop: false, isCode: false },
  { label: 'NumPy', accent: true, isTop: false, isCode: false },
  { label: 'pandas', accent: true, isTop: false, isCode: false },
  { label: 'import pandas', accent: true, isTop: true, isCode: true },
];

/** Individual stack layer */
const StackLayer: React.FC<{
  layer: LayerDef;
  index: number;
  totalLayers: number;
  glowFrame: number;
  shiftX: number;
}> = ({ layer, index, totalLayers, glowFrame, shiftX }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered entrance from bottom
  const enterFrame = BEATS.STACK_BUILD + (index * 8);
  const enterProgress = spring({
    frame: frame - enterFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const scaleY = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const slideUpY = interpolate(enterProgress, [0, 1], [30, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  if (frame < enterFrame) return null;

  // Glow pulse: travels from top (index=5) downward (index=0)
  const glowLayerIndex = totalLayers - 1 - Math.floor(
    (frame - BEATS.GLOW_PULSE) / 6
  );
  const isGlowing = frame >= BEATS.GLOW_PULSE && index === glowLayerIndex;

  // Background
  let bgColor = COLORS.bgSurfaceAlt;
  if (layer.isTop) bgColor = COLORS.codeBg;
  else if (layer.label === 'pandas') bgColor = COLORS.codeBg;

  // Border
  let borderStyle = `1px solid rgba(255,255,255,0.06)`;
  if (layer.isTop) borderStyle = `2px solid ${COLORS.techBlue}`;
  else if (layer.accent) borderStyle = `1px solid rgba(255,255,255,0.06)`;

  // Left accent bar for NumPy and pandas
  const showLeftAccent = layer.accent && !layer.isTop;

  return (
    <div
      style={{
        width: 860,
        maxWidth: '100%',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: isGlowing
          ? `rgba(59,130,246,0.15)`
          : bgColor,
        border: borderStyle,
        borderRadius: 8,
        opacity,
        transform: `scaleY(${scaleY}) translateY(${slideUpY}px) translateX(${shiftX}px)`,
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar */}
      {showLeftAccent && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: COLORS.techBlue,
          }}
        />
      )}

      {/* Glow overlay */}
      {isGlowing && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)`,
          }}
        />
      )}

      <span
        style={{
          ...(layer.isCode ? TYPOGRAPHY.code : {}),
          fontFamily: layer.isCode
            ? TYPOGRAPHY.code.fontFamily
            : 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: layer.isCode ? 28 : 32,
          color: layer.label === 'pandas'
            ? COLORS.techBlue
            : layer.isTop
              ? COLORS.techBlue
              : COLORS.textMuted,
        }}
      >
        {layer.label}
      </span>
    </div>
  );
};

/** AI code block that appears on the right */
const AICodeBlock: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const y = interpolate(progress, [0, 1], [30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        width: 380,
        padding: 20,
        backgroundColor: COLORS.codeBg,
        border: `2px solid ${COLORS.aiPurple}`,
        borderRadius: 8,
        opacity,
        transform: `translateY(${y}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color: COLORS.aiPurple,
        }}
      >
        AI-GENERATED
      </span>
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 24,
          color: COLORS.aiPurple,
        }}
      >
        {'function calculateTax(...)'}
      </span>
    </div>
  );
};

/** Animated dashed connection line */
const ConnectionLine: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const drawProgress = interpolate(
    relativeFrame,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const labelOpacity = interpolate(
    relativeFrame,
    [15, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg
        width={200}
        height={4}
        style={{ overflow: 'visible' }}
      >
        <line
          x1={0}
          y1={2}
          x2={200 * drawProgress}
          y2={2}
          stroke={COLORS.insightOrange}
          strokeWidth={2}
          strokeDasharray="8 4"
          strokeDashoffset={-frame * 0.5}
        />
      </svg>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 22,
          color: COLORS.insightOrange,
          opacity: labelOpacity,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        SAME TRUST MODEL
      </span>
    </div>
  );
};

export const Scene3_LayerStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Crossfade in
  const fadeInOpacity = interpolate(
    frame,
    [BEATS.CROSSFADE, BEATS.CROSSFADE + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Stack shifts left after STACK_SHIFT
  const shiftProgress = spring({
    frame: frame - BEATS.STACK_SHIFT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const stackShiftX = interpolate(shiftProgress, [0, 1], [0, -120]);

  // When in side-by-side mode, scale down the stack slightly
  const stackScale = interpolate(shiftProgress, [0, 1], [1, 0.75]);

  const showSideBySide = frame >= BEATS.STACK_SHIFT;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 12,
          opacity: fadeInOpacity,
          position: 'relative',
        }}
      >
        {/* Subtitle at top */}
        {frame >= BEATS.SUBTITLE && (
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            <BlurText
              startFrame={BEATS.SUBTITLE}
              animateBy="words"
              staggerDelay={3}
              fontSize={44}
              fontWeight={400}
              color={COLORS.textBody}
            >
              {"You didn't write either one"}
            </BlurText>
          </div>
        )}

        {/* Main content: stack + AI block side by side */}
        <div
          style={{
            display: 'flex',
            flexDirection: showSideBySide ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: showSideBySide ? 40 : 12,
            position: 'relative',
          }}
        >
          {/* Layer stack */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column-reverse',
              gap: 6,
              transform: `scale(${stackScale})`,
              transformOrigin: 'center center',
            }}
          >
            {LAYERS.map((layer, i) => (
              <StackLayer
                key={i}
                layer={layer}
                index={i}
                totalLayers={LAYERS.length}
                glowFrame={frame}
                shiftX={0}
              />
            ))}
          </div>

          {/* Connection line + AI block (appears when side-by-side) */}
          {showSideBySide && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
              }}
            >
              {frame >= BEATS.CONNECTION && (
                <ConnectionLine startFrame={BEATS.CONNECTION} />
              )}
              <AICodeBlock startFrame={BEATS.AI_BLOCK} />
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
