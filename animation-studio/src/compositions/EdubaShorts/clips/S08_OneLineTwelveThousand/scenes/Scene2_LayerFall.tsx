import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  PANEL_SHRINK: 0,
  ORB_DROP: 20,
  LAYER_1: 40,
  LAYER_2: 80,
  LAYER_3: 120,
  LAYER_4: 160,
  LAYER_5: 200,
  LAYER_6: 240,
  LAYER_7: 280,
  ORB_BURST: 320,
  SPEECH_BUBBLES: 320,
  COMPRESS: 360,
  ABSTRACTION_LABEL: 410,
};

interface LayerDef {
  label: string;
  detail: string;
  color: string;
  fromRight: boolean;
}

const LAYERS: LayerDef[] = [
  { label: 'Syntax Tree', detail: 'AST', color: COLORS.techBlue, fromRight: true },
  { label: 'Bytecode', detail: 'LOAD_CONST 0', color: COLORS.techBlue, fromRight: false },
  { label: 'C Interpreter', detail: '{PyObject *result}', color: COLORS.insightOrange, fromRight: true },
  { label: 'Assembly', detail: 'MOV RAX, 0x1', color: COLORS.insightOrange, fromRight: false },
  { label: 'Machine Code', detail: '01001000 10001011', color: COLORS.insightOrange, fromRight: true },
  { label: 'Transistors', detail: 'AND gate', color: COLORS.errorRed, fromRight: false },
  { label: 'Electrons', detail: 'wave/particle', color: COLORS.errorRed, fromRight: true },
];

const LAYER_BEATS = [
  BEATS.LAYER_1,
  BEATS.LAYER_2,
  BEATS.LAYER_3,
  BEATS.LAYER_4,
  BEATS.LAYER_5,
  BEATS.LAYER_6,
  BEATS.LAYER_7,
];

/** Glowing orb that falls through layers */
const FallingOrb: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  // Calculate orb Y based on which layer it's passing through
  const orbFrame = frame - BEATS.ORB_DROP;
  if (orbFrame < 0) return null;

  // Find current position based on layer beats
  let orbY = 0;
  const startY = 60;    // below code panel
  const layerSpacing = 100;

  // Between layers, the orb falls with gravity easing
  for (let i = 0; i < LAYERS.length; i++) {
    const layerStart = LAYER_BEATS[i] - BEATS.ORB_DROP;
    const nextLayerStart = i < LAYERS.length - 1
      ? LAYER_BEATS[i + 1] - BEATS.ORB_DROP
      : BEATS.ORB_BURST - BEATS.ORB_DROP;

    if (orbFrame < layerStart) {
      // Still falling to first layer
      const t = interpolate(
        orbFrame,
        [0, layerStart],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      const eased = Easing.in(Easing.quad)(t);
      orbY = startY + eased * layerSpacing;
      break;
    } else if (orbFrame >= layerStart && orbFrame < layerStart + 10) {
      // Pausing at layer
      orbY = startY + (i + 1) * layerSpacing;
      break;
    } else if (orbFrame < nextLayerStart) {
      // Falling to next layer
      const t = interpolate(
        orbFrame,
        [layerStart + 10, nextLayerStart],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      );
      const eased = Easing.in(Easing.quad)(t);
      orbY = startY + (i + 1) * layerSpacing + eased * layerSpacing;
      break;
    } else if (i === LAYERS.length - 1) {
      orbY = startY + (LAYERS.length) * layerSpacing;
    }
  }

  // Burst at the bottom
  const burstFrame = frame - BEATS.ORB_BURST;
  const isBurst = burstFrame >= 0;

  if (isBurst) {
    // Render burst particles
    const particles: React.ReactNode[] = [];
    const particleCount = 12;
    for (let p = 0; p < particleCount; p++) {
      const angle = (p / particleCount) * Math.PI * 2;
      const burstProgress = spring({
        frame: burstFrame,
        fps,
        config: SPRING_CONFIGS.bouncy,
      });
      const dist = interpolate(burstProgress, [0, 1], [0, 50]);
      const particleOpacity = interpolate(burstProgress, [0, 0.5, 1], [1, 0.6, 0]);
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      particles.push(
        <div
          key={p}
          style={{
            position: 'absolute',
            left: '50%',
            top: orbY,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: COLORS.techBlue,
            boxShadow: `0 0 8px ${COLORS.glowBlue}`,
            transform: `translate(${px - 3}px, ${py - 3}px)`,
            opacity: particleOpacity,
          }}
        />
      );
    }
    return <>{particles}</>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: orbY,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.techBlue} 30%, transparent 70%)`,
        boxShadow: `0 0 16px ${COLORS.glowBlue}, 0 0 32px ${COLORS.glowBlue}`,
        transform: 'translate(-10px, -10px)',
      }}
    />
  );
};

export const Scene2_LayerFall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Code panel shrinks and rises
  const shrinkProgress = spring({
    frame: frame - BEATS.PANEL_SHRINK,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelScale = interpolate(shrinkProgress, [0, 1], [1, 0.6]);
  const panelY = interpolate(shrinkProgress, [0, 1], [0, -300]);

  // Stack compression after speech bubbles
  const compressProgress = spring({
    frame: frame - BEATS.COMPRESS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const stackScaleY = interpolate(compressProgress, [0, 1], [1, 0.85]);

  // Speech bubble visibility
  const bubblesVisible = frame >= BEATS.SPEECH_BUBBLES && frame < BEATS.COMPRESS + 15;

  // Abstraction label
  const abstractionProgress = spring({
    frame: frame - BEATS.ABSTRACTION_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // Layer cascade pulse after ABSTRACTION_LABEL + 20
  const pulseStart = BEATS.ABSTRACTION_LABEL + 20;

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
        }}
      >
        {/* Vertically centered container that compresses */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scaleY(${stackScaleY})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Shrunk code panel at top */}
          <div
            style={{
              width: 860,
              maxWidth: '90%',
              backgroundColor: COLORS.codeBg,
              borderRadius: 12,
              padding: '12px 20px',
              border: `1px solid ${COLORS.panelBorder}`,
              transform: `scale(${panelScale}) translateY(${panelY}px)`,
              transformOrigin: 'center top',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <div
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: COLORS.codeText,
              }}
            >
              <span style={{ color: COLORS.techBlue }}>print</span>
              <span style={{ color: COLORS.textMuted }}>(</span>
              <span style={{ color: COLORS.solutionGreen }}>"Hello, World!"</span>
              <span style={{ color: COLORS.textMuted }}>)</span>
            </div>
          </div>

          {/* Falling orb */}
          <FallingOrb frame={frame} fps={fps} />

          {/* Layer bars */}
          {LAYERS.map((layer, i) => {
            const layerBeat = LAYER_BEATS[i];
            const layerProgress = spring({
              frame: frame - layerBeat,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            if (frame < layerBeat) return null;

            const slideX = interpolate(
              layerProgress,
              [0, 1],
              [layer.fromRight ? 400 : -400, 0]
            );
            const layerOpacity = interpolate(layerProgress, [0, 1], [0, 1]);

            // Pulse effect after all layers are visible
            let pulseOpacity = 1;
            if (frame >= pulseStart) {
              const pulseCycle = (frame - pulseStart - i * 3) % 42;
              if (pulseCycle >= 0 && pulseCycle < 6) {
                pulseOpacity = interpolate(pulseCycle, [0, 3, 6], [0.7, 1, 0.7]);
              }
            }

            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  width: 780,
                  maxWidth: '85%',
                  height: 80,
                  backgroundColor: COLORS.bgSurface,
                  borderRadius: 8,
                  border: `1px solid ${COLORS.panelBorder}`,
                  borderLeft: `3px solid ${layer.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px',
                  marginBottom: 8,
                  transform: `translateX(${slideX}px)`,
                  opacity: layerOpacity * pulseOpacity,
                }}
              >
                {/* Layer label */}
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.title.fontFamily,
                    fontWeight: 500,
                    fontSize: 32,
                    color: layer.color,
                  }}
                >
                  {layer.label}
                </span>

                {/* Decorative detail */}
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 20,
                    color: COLORS.textDim,
                  }}
                >
                  {layer.detail}
                </span>

                {/* Speech bubble */}
                {bubblesVisible && (
                  (() => {
                    const bubbleDelay = (frame - BEATS.SPEECH_BUBBLES) - i * 4;
                    if (bubbleDelay < 0) return null;
                    const bubbleProgress = spring({
                      frame: bubbleDelay,
                      fps,
                      config: SPRING_CONFIGS.snappy,
                    });
                    const bubbleOpacity = interpolate(
                      frame,
                      [BEATS.COMPRESS, BEATS.COMPRESS + 15],
                      [1, 0],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ) * interpolate(bubbleProgress, [0, 1], [0, 1]);

                    const isRight = i % 2 === 0;

                    return (
                      <div
                        style={{
                          position: 'absolute',
                          [isRight ? 'right' : 'left']: -160,
                          top: '50%',
                          transform: `translateY(-50%) scale(${interpolate(bubbleProgress, [0, 1], [0.8, 1])})`,
                          opacity: bubbleOpacity,
                          backgroundColor: COLORS.bgSurfaceAlt,
                          borderRadius: 8,
                          padding: '6px 12px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: TYPOGRAPHY.body.fontFamily,
                            fontWeight: 400,
                            fontSize: 18,
                            color: COLORS.textDim,
                            fontStyle: 'italic',
                          }}
                        >
                          "Let me make it simpler"
                        </span>
                        {/* Triangle pointer */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            [isRight ? 'left' : 'right']: -6,
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 0,
                            borderTop: '6px solid transparent',
                            borderBottom: '6px solid transparent',
                            [isRight ? 'borderRight' : 'borderLeft']: `6px solid ${COLORS.bgSurfaceAlt}`,
                          }}
                        />
                      </div>
                    );
                  })()
                )}
              </div>
            );
          })}
        </div>

        {/* "That's abstraction." label at bottom */}
        {frame >= BEATS.ABSTRACTION_LABEL && (
          <div
            style={{
              position: 'absolute',
              bottom: 200,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: interpolate(abstractionProgress, [0, 1], [0, 1]),
            }}
          >
            <BlurText
              startFrame={BEATS.ABSTRACTION_LABEL}
              animateBy="words"
              direction="bottom"
              staggerDelay={4}
              blurAmount={10}
              distance={30}
              fontSize={56}
            >
              That's abstraction.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
