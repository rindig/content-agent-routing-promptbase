import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { AnimatedText } from '../../../../../../components/core';
import { ShinyText, GradientText } from '../../../../../../components/core/effects';
import { AbstractionLayer } from '../components/AbstractionLayer';
import { ConnectorArrow } from '../components/ConnectorArrow';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

/**
 * Scene 4: The Reframe (local frames 0–240, global 660–900)
 *
 * "Abstraction" title appears. Original 7 layers dim, AI layer emerges on top.
 * Layers simplify to border-only silhouettes. Everything fades to black.
 */

const BEATS = {
  ABSTRACTION_LABEL: 5,
  SHINE_SWEEP: 10,
  LAYERS_DIM_START: 45,
  AI_LAYER_IN: 55,
  STACK_SIMPLIFY: 105,
  SUBTITLE_IN: 115,
  FADE_TO_BLACK: 180,
  SCENE_END: 240,
};

const LAYERS = [
  { label: 'Python', sublabel: '→ Syntax Tree', color: '#3B82F6', y: 440 },
  { label: 'Bytecode', sublabel: 'compiled', color: '#6366F1', y: 535 },
  { label: 'C Interpreter', color: '#818CF8', y: 630 },
  { label: 'Assembly', color: '#8B5CF6', y: 725 },
  { label: 'Machine Code', color: '#7C3AED', y: 820 },
  { label: 'Transistors', color: '#6D28D9', y: 915 },
  { label: 'Electrons', color: '#5B21B6', y: 1010 },
];

const ARROWS = [
  { fromY: 390, toY: 440, color: '#3B82F6' },
  { fromY: 520, toY: 535, color: '#6366F1' },
  { fromY: 615, toY: 630, color: '#818CF8' },
  { fromY: 710, toY: 725, color: '#8B5CF6' },
  { fromY: 805, toY: 820, color: '#7C3AED' },
  { fromY: 900, toY: 915, color: '#6D28D9' },
  { fromY: 995, toY: 1010, color: '#5B21B6' },
];

export const Scene4_TheReframe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Layer dimming (frames 45–75, staggered bottom-to-top) ---
  // Electrons (index 6) dims first at frame 45, Python (index 0) at frame 63
  const getLayerOpacity = (layerIndex: number): number => {
    const reverseIndex = 6 - layerIndex; // bottom-to-top
    const dimFrame = BEATS.LAYERS_DIM_START + reverseIndex * 3;
    if (frame < dimFrame) return 1;
    return interpolate(frame - dimFrame, [0, 30], [1, 0.35], {
      extrapolateRight: 'clamp',
    });
  };

  // --- Stack simplification (frames 105+): border-only silhouettes ---
  const isSimplified = frame >= BEATS.STACK_SIMPLIFY;

  // --- Print statement also dims ---
  const printOpacity = frame >= BEATS.LAYERS_DIM_START
    ? interpolate(
        frame - BEATS.LAYERS_DIM_START,
        [0, 30],
        [0.5, 0.35],
        { extrapolateRight: 'clamp' }
      )
    : 0.5;

  // --- AI layer entrance (frame 55) ---
  const aiProgress = spring({
    frame: frame - BEATS.AI_LAYER_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const aiVisible = frame >= BEATS.AI_LAYER_IN;
  const aiTranslateY = aiVisible
    ? interpolate(aiProgress, [0, 1], [-40, 0])
    : -40;
  const aiScale = aiVisible
    ? interpolate(aiProgress, [0, 1], [0.95, 1.0])
    : 0.95;
  const aiOpacity = aiVisible
    ? interpolate(aiProgress, [0, 1], [0, 1])
    : 0;

  // --- AI layer glow ---
  const glowOpacity = aiVisible
    ? interpolate(aiProgress, [0, 1], [0, 0.05])
    : 0;

  // --- "Making the hard part invisible" (frame 115) ---
  const subtitleProgress = spring({
    frame: frame - BEATS.SUBTITLE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const subtitleY = frame >= BEATS.SUBTITLE_IN
    ? interpolate(subtitleProgress, [0, 1], [30, 0])
    : 30;
  const subtitleOpacity = frame >= BEATS.SUBTITLE_IN
    ? interpolate(subtitleProgress, [0, 1], [0, 1])
    : 0;

  // --- Fade to black (frames 180–240) ---
  const fadeOutOpacity = frame >= BEATS.FADE_TO_BLACK
    ? interpolate(frame - BEATS.FADE_TO_BLACK, [0, 60], [1, 0], {
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <div style={{ opacity: fadeOutOpacity }}>
        {/* "Abstraction" title at Y:220 */}
        {frame >= BEATS.ABSTRACTION_LABEL && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 220 * 0.82 + (1920 * (1 - 0.82)) / 2 * (220 / 960),
              // Approximate position within the zoomed-out context
              zIndex: 10,
            }}
          >
            <div
              style={{
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ShinyText
                startFrame={BEATS.SHINE_SWEEP}
                shineColor="#FFFFFF"
                duration={40}
                fontSize={52}
                color={COLORS.insightOrange}
              >
                Abstraction
              </ShinyText>
            </div>
          </div>
        )}

        {/* Stack wrapper at 0.82 scale (inherited from Scene 3 end state) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1080,
            height: 1920,
            transform: 'scale(0.82)',
            transformOrigin: '540px 700px',
          }}
        >
          {/* Print statement */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 350,
              transform: 'translate(-50%, -50%) scale(0.6)',
              opacity: printOpacity,
              ...TYPOGRAPHY.code,
              fontSize: 40,
              color: COLORS.techBlue,
              whiteSpace: 'nowrap',
            }}
          >
            print(&quot;Hello, World!&quot;)
          </div>

          {/* Connector arrows (static, fully drawn) */}
          {ARROWS.map((arrow, i) => (
            <ConnectorArrow
              key={`arrow-${i}`}
              fromY={arrow.fromY}
              toY={arrow.toY}
              color={arrow.color}
              startFrame={0}
              drawDuration={1}
              opacity={0.4 * getLayerOpacity(i)}
            />
          ))}

          {/* 7 original layers (dimming + simplifying) */}
          {LAYERS.map((layer, i) => (
            <AbstractionLayer
              key={layer.label}
              label={layer.label}
              sublabel={layer.sublabel}
              color={layer.color}
              y={layer.y}
              entrance="fadeIn"
              startFrame={0}
              springPreset="gentle"
              opacity={getLayerOpacity(i)}
              simplified={isSimplified}
            />
          ))}

          {/* AI Layer — between print statement and Python (Y:395) */}
          {aiVisible && (
            <div
              style={{
                position: 'absolute',
                top: 395,
                left: (1080 - 880) / 2,
                width: 880,
                height: 80,
                backgroundColor: '#12121A',
                borderRadius: 16,
                borderLeft: `3px solid ${COLORS.insightOrange}`,
                padding: '24px 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: aiOpacity,
                transform: `translateY(${aiTranslateY}px) scale(${aiScale})`,
                boxSizing: 'border-box',
              }}
            >
              <GradientText
                colors={['#F59E0B', '#8B5CF6', '#F59E0B']}
                direction="horizontal"
                duration={120}
                fontSize={36}
                startFrame={BEATS.AI_LAYER_IN}
              >
                AI
              </GradientText>
              <span
                style={{
                  fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: 24,
                  color: '#9CA3AF',
                }}
              >
                the next layer
              </span>
            </div>
          )}

          {/* Radial glow behind AI layer */}
          {aiVisible && (
            <div
              style={{
                position: 'absolute',
                top: 395 + 40 - 150,
                left: 540 - 150,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
                opacity: glowOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* "Making the hard part invisible" at Y:1150 (outside zoom wrapper) */}
        {frame >= BEATS.SUBTITLE_IN && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 1150,
              transform: `translate(-50%, ${-subtitleY}px)`,
              opacity: subtitleOpacity,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              fontWeight: 400,
              fontSize: 40,
              color: COLORS.textBody,
            }}
          >
            Making the hard part invisible.
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
