import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
} from '../../../../../Memory/components/AmbientBackground';
import { AbstractionLayer } from '../components/AbstractionLayer';
import { ConnectorArrow } from '../components/ConnectorArrow';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

/**
 * Scene 3: The Stack (local frames 0–420, global 240–660)
 *
 * Seven abstraction layers build downward beneath the print statement.
 * Stack zooms out, then energy pulse ripples bottom-to-top.
 */

const BEATS = {
  SEVEN_LAYERS_FADE: 0,
  PYTHON_IN: 5,
  PYTHON_ARROW: 10,
  BYTECODE_IN: 60,
  C_INTERPRETER_IN: 105,
  ASSEMBLY_IN: 150,
  MACHINE_CODE_IN: 195,
  TRANSISTORS_IN: 240,
  ELECTRONS_IN: 285,
  ZOOM_OUT_START: 325,
  ENERGY_PULSE: 375,
  SCENE_END: 420,
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

const LAYER_BEATS = [
  BEATS.PYTHON_IN,
  BEATS.BYTECODE_IN,
  BEATS.C_INTERPRETER_IN,
  BEATS.ASSEMBLY_IN,
  BEATS.MACHINE_CODE_IN,
  BEATS.TRANSISTORS_IN,
  BEATS.ELECTRONS_IN,
];

const ARROW_BEATS = [
  BEATS.PYTHON_ARROW,
  BEATS.BYTECODE_IN + 5,
  BEATS.C_INTERPRETER_IN + 5,
  BEATS.ASSEMBLY_IN + 5,
  BEATS.MACHINE_CODE_IN + 5,
  BEATS.TRANSISTORS_IN + 5,
  BEATS.ELECTRONS_IN + 5,
];

// Arrow connections: first arrow from print (Y:390) to Python (Y:440),
// then from bottom of each layer to top of next
const ARROWS = [
  { fromY: 390, toY: 440, color: '#3B82F6' },
  { fromY: 520, toY: 535, color: '#6366F1' },
  { fromY: 615, toY: 630, color: '#818CF8' },
  { fromY: 710, toY: 725, color: '#8B5CF6' },
  { fromY: 805, toY: 820, color: '#7C3AED' },
  { fromY: 900, toY: 915, color: '#6D28D9' },
  { fromY: 995, toY: 1010, color: '#5B21B6' },
];

export const Scene3_TheStack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- "7 layers" text fade out (frames 0–15) ---
  const sevenFadeOpacity = interpolate(frame, [0, 15], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // --- Zoom out (frames 325–375) ---
  const zoomProgress = spring({
    frame: frame - BEATS.ZOOM_OUT_START,
    fps,
    config: SPRING_CONFIGS.gentle,
    durationInFrames: 50,
  });
  const stackScale =
    frame >= BEATS.ZOOM_OUT_START
      ? interpolate(zoomProgress, [0, 1], [1.0, 0.82])
      : 1.0;

  // --- Energy pulse (frames 375–420) ---
  // Each layer's border opacity oscillates, staggered bottom-to-top
  const getLayerBorderPulse = (layerIndex: number): number => {
    if (frame < BEATS.ENERGY_PULSE) return 1;
    // Reverse index: 0 = bottom (Electrons), 6 = top (Python)
    const reverseIndex = 6 - layerIndex;
    return (
      Math.sin((frame - BEATS.ENERGY_PULSE - reverseIndex * 5) * 0.12) * 0.25 +
      0.75
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={30}
        particleColor={COLORS.techBlue}
      />

      {/* "7 layers" text fading out */}
      {sevenFadeOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1060,
            transform: 'translate(-50%, -50%)',
            opacity: sevenFadeOpacity,
            fontFamily: TYPOGRAPHY.title.fontFamily,
            fontWeight: 600,
            fontSize: 56,
            color: COLORS.insightOrange,
          }}
        >
          7 layers
        </div>
      )}

      {/* Stack wrapper — scales together */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
          transform: `scale(${stackScale})`,
          transformOrigin: '540px 700px',
        }}
      >
        {/* Print statement at Y:350 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 350,
            transform: 'translate(-50%, -50%) scale(0.6)',
            opacity: 0.5,
            ...TYPOGRAPHY.code,
            fontSize: 40,
            color: COLORS.techBlue,
            whiteSpace: 'nowrap',
          }}
        >
          print(&quot;Hello, World!&quot;)
        </div>

        {/* Connector arrows (SVGs) */}
        {ARROWS.map((arrow, i) => (
          <ConnectorArrow
            key={`arrow-${i}`}
            fromY={arrow.fromY}
            toY={arrow.toY}
            color={arrow.color}
            startFrame={ARROW_BEATS[i]}
            drawDuration={15}
          />
        ))}

        {/* Abstraction layers */}
        {LAYERS.map((layer, i) => (
          <AbstractionLayer
            key={layer.label}
            label={layer.label}
            sublabel={layer.sublabel}
            color={layer.color}
            y={layer.y}
            entrance="slideDown"
            startFrame={LAYER_BEATS[i]}
            springPreset="snappy"
            opacity={getLayerBorderPulse(i)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
