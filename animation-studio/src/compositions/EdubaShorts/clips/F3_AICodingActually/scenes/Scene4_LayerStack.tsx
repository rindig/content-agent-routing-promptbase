import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start = frame 540 global, 0 local) ──
const BEATS = {
  TRANSITION: 0,
  LAYER_1: 30,
  LAYER_2: 42,
  LAYER_3: 54,
  LAYER_4: 66,
  LAYER_5: 78,
  STACK_COMPLETE: 110,
  DEVELOPER_FIGURE: 110,
  KNOWLEDGE_LINE: 115,
  BUG_FLASH: 160,
  ERROR_ICON: 165,
  DEVELOPER_DESCEND: 170,
  LAYER_3_HIGHLIGHT: 190,
  BUG_FOUND: 200,
  DEVELOPER_ASCEND: 205,
  NOT_TO_WRITE: 225,
  WHERE_TO_LOOK: 240,
  WAVE_PULSE: 275,
  FADE_START: 290,
  SCENE_END: 300,
};

// ── Layer data ──
interface LayerData {
  label: string;
  color: string;
  decorativeText: string;
  width: number;
  beat: number;
}

const LAYERS: LayerData[] = [
  {
    label: 'Machine Code',
    color: COLORS.errorRed,
    decorativeText: '01001 10110 00101 11010',
    width: 800,
    beat: BEATS.LAYER_1,
  },
  {
    label: 'Compiled Output',
    color: COLORS.insightOrange,
    decorativeText: 'MOV EAX  PUSH  RET',
    width: 760,
    beat: BEATS.LAYER_2,
  },
  {
    label: 'Source Code',
    color: COLORS.techBlue,
    decorativeText: 'if (x) { return y; }',
    width: 720,
    beat: BEATS.LAYER_3,
  },
  {
    label: 'Framework',
    color: COLORS.solutionGreen,
    decorativeText: 'import { App }  <Route>',
    width: 680,
    beat: BEATS.LAYER_4,
  },
  {
    label: 'AI Prompt',
    color: COLORS.aiPurple,
    decorativeText: '"Build a REST API..."',
    width: 640,
    beat: BEATS.LAYER_5,
  },
];

// Layer height and gap
const LAYER_HEIGHT = 80;
const LAYER_GAP = 10;
const STACK_HEIGHT = LAYERS.length * (LAYER_HEIGHT + LAYER_GAP);

// ── Single layer component ──
const StackLayer: React.FC<{
  layer: LayerData;
  index: number;
  frame: number;
  fps: number;
  isHighlighted: boolean;
  showBugFlash: boolean;
  waveFrame: number;
}> = ({ layer, index, frame, fps, isHighlighted, showBugFlash, waveFrame }) => {
  const relFrame = frame - layer.beat;
  if (relFrame < 0) return null;

  const progress = spring({ frame: relFrame, fps, config: SPRING_CONFIGS.gentle });
  const y = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  // Bug flash on top layer (layer 5 = index 4)
  const isTopLayer = index === 4;
  const flashOpacity = isTopLayer && showBugFlash
    ? interpolate(
        frame - BEATS.BUG_FLASH,
        [0, 5, 10, 15],
        [0, 0.3, 0.1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Wave pulse: each layer pulses in sequence bottom to top
  const wavePulse = waveFrame >= 0
    ? (() => {
        const layerWaveStart = index * 5;
        const relWave = waveFrame - layerWaveStart;
        if (relWave < 0 || relWave > 10) return 0;
        return interpolate(relWave, [0, 5, 10], [0, 0.2, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
      })()
    : 0;

  return (
    <div
      style={{
        width: layer.width,
        height: LAYER_HEIGHT,
        borderRadius: 8,
        backgroundColor: COLORS.bgSurface,
        borderLeft: `4px solid ${layer.color}`,
        border: isHighlighted
          ? `2px solid ${layer.color}`
          : `1px solid ${COLORS.panelBorder}`,
        boxShadow: isHighlighted
          ? `0 0 12px ${layer.color}44`
          : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px 0 16px',
        opacity: opacity + wavePulse,
        transform: `translateY(${y}px)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative text (background) */}
      <span
        style={{
          position: 'absolute',
          right: 16,
          ...TYPOGRAPHY.code,
          fontSize: 18,
          color: `${layer.color}25`,
          whiteSpace: 'nowrap',
        }}
      >
        {layer.decorativeText}
      </span>

      {/* Label */}
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 36,
          color: COLORS.textBody,
          zIndex: 1,
        }}
      >
        {layer.label}
      </span>

      {/* Bug flash overlay */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.errorRed,
            opacity: flashOpacity,
            borderRadius: 8,
          }}
        />
      )}
    </div>
  );
};

// ── Developer figure ──
const DeveloperFigure: React.FC<{
  frame: number;
  fps: number;
  yPosition: number;
  opacity: number;
}> = ({ frame, fps, yPosition, opacity }) => {
  return (
    <div
      style={{
        position: 'absolute',
        right: -50,
        top: yPosition,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Head */}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${COLORS.textBody}`,
        }}
      />
      {/* Body */}
      <div
        style={{
          width: 14,
          height: 24,
          borderRadius: '4px 4px 0 0',
          border: `2px solid ${COLORS.textBody}`,
          borderTop: 'none',
          marginTop: -2,
        }}
      />
    </div>
  );
};

// ── Main Scene ──
export const Scene4_LayerStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Developer figure entrance
  const devFrame = frame - BEATS.DEVELOPER_FIGURE;
  const devProgress = devFrame >= 0
    ? spring({ frame: devFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const devOpacity = interpolate(devProgress, [0, 1], [0, 1]);

  // Knowledge line (dotted line from figure to bottom)
  const lineFrame = frame - BEATS.KNOWLEDGE_LINE;
  const lineProgress = lineFrame >= 0
    ? interpolate(lineFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Developer descend animation
  const descendFrame = frame - BEATS.DEVELOPER_DESCEND;
  const descendProgress = descendFrame >= 0
    ? spring({ frame: descendFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;

  // Developer ascend animation
  const ascendFrame = frame - BEATS.DEVELOPER_ASCEND;
  const ascendProgress = ascendFrame >= 0
    ? spring({ frame: ascendFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;

  // Developer Y position (at top = layer 5, descends to layer 3)
  // Layer 5 is at top (index 4 reversed), layer 3 is index 2 reversed
  // In our stack, layers go bottom-to-top: index 0 at bottom, index 4 at top
  const topPosition = 0; // Top of stack
  const layer3Position = 2 * (LAYER_HEIGHT + LAYER_GAP); // 2 layers down from top
  const devYBase = interpolate(descendProgress, [0, 1], [topPosition, layer3Position]);
  const devY = interpolate(ascendProgress, [0, 1], [devYBase, topPosition]);

  // Error icon on top layer
  const errorFrame = frame - BEATS.ERROR_ICON;
  const errorProgress = errorFrame >= 0
    ? spring({ frame: errorFrame, fps, config: SPRING_CONFIGS.bouncy })
    : 0;
  const errorScale = interpolate(errorProgress, [0, 1], [0.3, 1]);
  const errorOpacity = interpolate(errorProgress, [0, 1], [0, 1]);

  // Bug found checkmark (replaces !)
  const foundFrame = frame - BEATS.BUG_FOUND;
  const showCheck = foundFrame >= 0;
  const checkProgress = showCheck
    ? interpolate(foundFrame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Layer 3 highlight
  const layer3Highlight = frame >= BEATS.LAYER_3_HIGHLIGHT && frame < BEATS.DEVELOPER_ASCEND + 30;

  // "Not to write it." text
  const notWriteFrame = frame - BEATS.NOT_TO_WRITE;
  const notWriteProgress = notWriteFrame >= 0
    ? spring({ frame: notWriteFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const notWriteOpacity = interpolate(notWriteProgress, [0, 1], [0, 1]);

  // "To know where to look." text
  const whereFrame = frame - BEATS.WHERE_TO_LOOK;
  const whereProgress = whereFrame >= 0
    ? spring({ frame: whereFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;
  const whereY = interpolate(whereProgress, [0, 1], [15, 0]);
  const whereOpacity = interpolate(whereProgress, [0, 1], [0, 1]);

  // Wave pulse
  const waveFrame = frame - BEATS.WAVE_PULSE;

  // Fade out
  const showBugFlash = frame >= BEATS.BUG_FLASH;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={BEATS.FADE_START}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Layer Stack + Developer Figure container */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: LAYER_GAP,
          }}
        >
          {/* Layers rendered top-to-bottom (reversed: layer 5 at top) */}
          {[...LAYERS].reverse().map((layer, reverseIndex) => {
            const originalIndex = LAYERS.length - 1 - reverseIndex;
            return (
              <StackLayer
                key={originalIndex}
                layer={layer}
                index={originalIndex}
                frame={frame}
                fps={fps}
                isHighlighted={originalIndex === 2 && layer3Highlight}
                showBugFlash={showBugFlash}
                waveFrame={waveFrame}
              />
            );
          })}

          {/* Developer figure */}
          {devFrame >= 0 && (
            <DeveloperFigure
              frame={frame}
              fps={fps}
              yPosition={devY + 25}
              opacity={devOpacity}
            />
          )}

          {/* Knowledge line (dotted, right side) */}
          {lineProgress > 0 && (
            <svg
              style={{
                position: 'absolute',
                right: -38,
                top: 25,
                width: 4,
                height: STACK_HEIGHT,
                overflow: 'visible',
              }}
            >
              <line
                x1="2"
                y1="0"
                x2="2"
                y2={STACK_HEIGHT * lineProgress}
                stroke={COLORS.textMuted}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={0.5}
              />
            </svg>
          )}

          {/* Error/Check icon on top layer */}
          {errorFrame >= 0 && (
            <div
              style={{
                position: 'absolute',
                right: 24,
                top: 20,
                opacity: showCheck ? 1 - checkProgress * 0.5 + checkProgress : errorOpacity,
                transform: `scale(${showCheck ? 1 : errorScale})`,
              }}
            >
              {showCheck ? (
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <path
                    d="M6 14 L12 20 L22 8"
                    stroke={COLORS.solutionGreen}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={40}
                    strokeDashoffset={40 * (1 - checkProgress)}
                  />
                </svg>
              ) : (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: COLORS.errorRed,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      color: COLORS.textPrimary,
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    !
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Annotation text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginTop: 16,
          }}
        >
          {notWriteFrame >= 0 && (
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.textMuted,
                opacity: notWriteOpacity,
              }}
            >
              Not to write it.
            </span>
          )}
          {whereFrame >= 0 && (
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 44,
                color: COLORS.insightOrange,
                opacity: whereOpacity,
                transform: `translateY(${whereY}px)`,
                display: 'inline-block',
              }}
            >
              To know where to look.
            </span>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
