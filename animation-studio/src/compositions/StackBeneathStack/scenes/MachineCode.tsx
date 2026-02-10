import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';
import { LayerStack } from '../components/LayerStack';

/**
 * SCENE 7: MACHINE CODE (Section 6)
 * Duration: 35 seconds (1050 frames)
 *
 * Raw hexadecimal bytes. This is as low as software goes.
 * Terminal aesthetic with green-on-dark and subtle CRT effects.
 *
 * Animation Sequence:
 * | Frames | Action |
 * |--------|--------|
 * | 0-30   | Layer stack visible, scene title appears |
 * | 30-180 | Hex bytes appear line by line with annotations |
 * | 180-400| Hold on complete display |
 * | 400-550| "Bottom of software stack" emphasis |
 * | 550-700| "But we're not done" - floor breaking effect |
 * | 700-850| Transition to hardware |
 * | 850-1050| Descent indicator |
 */

// Machine code lines with hex and assembly annotations
const MACHINE_CODE_LINES = [
  { hex: '55', annotation: 'push rbp', address: '0x00' },
  { hex: '48 89 e5', annotation: 'mov rbp, rsp', address: '0x01' },
  { hex: '48 83 ec 20', annotation: 'sub rsp, 32', address: '0x04' },
  { hex: '48 89 7d e8', annotation: 'mov [rbp-24], rdi', address: '0x08' },
  { hex: '48 89 75 f0', annotation: 'mov [rbp-16], rsi', address: '0x0c' },
  { hex: '48 89 55 f8', annotation: 'mov [rbp-8], rdx', address: '0x10' },
];

// Scene title
const SceneTitle: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;
  const translateY = interpolate(progress, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 32,
          color: COLORS.danger,
          letterSpacing: '0.05em',
        }}
      >
        Layer 6: Machine Code
      </div>
    </div>
  );
};

// CRT scanline effect
const CRTEffect: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.1) 2px,
          rgba(0, 0, 0, 0.1) 4px
        )`,
      }}
    />
  );
};

// Single machine code line
const MachineCodeLine: React.FC<{
  hex: string;
  annotation: string;
  address: string;
  entranceFrame: number;
  glitchIntensity: number;
}> = ({ hex, annotation, address, entranceFrame, glitchIntensity }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - entranceFrame;
  if (adjustedFrame < 0) return null;

  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const translateX = interpolate(entranceProgress, [0, 1], [-20, 0]);

  // Glitch offset for breaking effect
  const glitchX = glitchIntensity * (Math.sin(frame * 0.5 + hex.length) * 10);
  const glitchOpacity = 1 - glitchIntensity * 0.8;

  return (
    <div
      style={{
        opacity: opacity * glitchOpacity,
        transform: `translateX(${translateX + glitchX}px)`,
        fontFamily: TYPOGRAPHY.code.fontFamily,
        fontSize: 20,
        lineHeight: 2,
        display: 'flex',
        gap: 24,
      }}
    >
      {/* Address */}
      <span style={{ color: COLORS.textDim, width: 50 }}>{address}</span>

      {/* Hex bytes */}
      <span style={{ color: COLORS.accent, width: 140, letterSpacing: '0.1em' }}>
        {hex}
      </span>

      {/* Annotation */}
      <span style={{ color: COLORS.textMuted }}>
        ; <span style={{ color: COLORS.text }}>{annotation}</span>
      </span>
    </div>
  );
};

// Machine code display with terminal styling
const MachineCodeDisplay: React.FC<{
  frame: number;
  startFrame: number;
  breakStart: number;
}> = ({ frame, startFrame, breakStart }) => {
  const { fps } = useVideoConfig();

  const LINE_DELAY = 25;

  // Breaking/glitch animation
  const breakProgress = frame >= breakStart
    ? interpolate(frame, [breakStart, breakStart + 150], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const containerScale = interpolate(breakProgress, [0, 0.5, 1], [1, 1.02, 0.3]);
  const containerOpacity = interpolate(breakProgress, [0.6, 1], [1, 0], { extrapolateLeft: 'clamp' });
  const containerY = interpolate(breakProgress, [0.5, 1], [0, 300], { extrapolateLeft: 'clamp' });

  // CRT effect intensity
  const crtOpacity = interpolate(frame, [startFrame, startFrame + 60], [0, 0.15], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${containerScale}) translateY(${containerY}px)`,
        opacity: containerOpacity,
      }}
    >
      {/* Terminal container */}
      <div
        style={{
          backgroundColor: '#0a0f0a',
          border: `1px solid ${COLORS.accent}40`,
          borderRadius: 8,
          padding: '24px 32px',
          boxShadow: `0 0 30px ${COLORS.accent}20, inset 0 0 60px rgba(0,0,0,0.5)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* CRT effect overlay */}
        <CRTEffect opacity={crtOpacity} />

        {/* Terminal header */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.accent,
            marginBottom: 16,
            opacity: 0.7,
            letterSpacing: '0.1em',
          }}
        >
          $ objdump -d PyObject_Call
        </div>

        {/* Code lines */}
        <div>
          {MACHINE_CODE_LINES.map((line, i) => (
            <MachineCodeLine
              key={i}
              hex={line.hex}
              annotation={line.annotation}
              address={line.address}
              entranceFrame={startFrame + i * LINE_DELAY}
              glitchIntensity={breakProgress}
            />
          ))}
        </div>

        {/* Blinking cursor */}
        {breakProgress === 0 && (
          <div
            style={{
              marginTop: 16,
              width: 10,
              height: 20,
              backgroundColor: COLORS.accent,
              opacity: Math.sin(frame * 0.2) > 0 ? 0.8 : 0,
            }}
          />
        )}
      </div>
    </div>
  );
};

// "Bottom of software stack" text
const BottomStackText: React.FC<{
  frame: number;
  startFrame: number;
  fadeOutFrame: number;
}> = ({ frame, startFrame, fadeOutFrame }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.text,
        }}
      >
        The bottom of the software stack.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.textMuted,
          marginTop: 8,
        }}
      >
        Raw bytes. What the CPU actually reads.
      </div>
    </div>
  );
};

// Floor breaking effect with particles
const FloorBreakEffect: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = interpolate(adjustedFrame, [0, 150], [0, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0]);

  // Generate breaking particles
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const speed = 2 + (i % 5);
    const size = 4 + (i % 3) * 2;
    const distance = progress * speed * 50;

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + progress * 100,
      size,
      rotation: adjustedFrame * (i % 2 === 0 ? 1 : -1) * 2,
    };
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: i % 2 === 0 ? COLORS.accent : COLORS.danger,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
};

// Transition text
const TransitionText: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const line1Progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const line2Progress = spring({
    frame: frame - startFrame - 30,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 28,
          color: COLORS.textMuted,
          marginBottom: 16,
          opacity: interpolate(line1Progress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line1Progress, [0, 1], [20, 0])}px)`,
        }}
      >
        But we're not done yet.
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.text,
          opacity: interpolate(line2Progress, [0, 1], [0, 1]),
          transform: `translateY(${interpolate(line2Progress, [0, 1], [20, 0])}px)`,
        }}
      >
        These bytes still need something to run on.
      </div>
    </div>
  );
};

// Next layer preview
const NextLayerPreview: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 0.7]);
  const scale = interpolate(progress, [0, 1], [0.9, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 42,
          color: COLORS.cosmicPrimary,
          marginBottom: 16,
        }}
      >
        The Hardware
      </div>

      {/* CPU pipeline hint */}
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.textMuted,
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
        }}
      >
        {['Fetch', 'Decode', 'Execute', 'Write'].map((stage, i) => (
          <span
            key={stage}
            style={{
              padding: '4px 8px',
              backgroundColor: `${COLORS.cosmicPrimary}20`,
              border: `1px solid ${COLORS.cosmicPrimary}40`,
              borderRadius: 4,
              color: COLORS.cosmicPrimary,
            }}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
};

// Descent indicator
const DescentIndicator: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;

  const entranceProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const bobOffset = Math.sin(adjustedFrame * 0.15) * 8;
  const opacity = interpolate(entranceProgress, [0, 1], [0, 0.8]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${bobOffset}px)`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 14,
          color: COLORS.cosmicPrimary,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        Descending to Layer 7: Hardware
      </div>
      <div style={{ fontSize: 32, color: COLORS.cosmicPrimary }}>↓</div>
    </div>
  );
};

export const MachineCode: React.FC = () => {
  const frame = useCurrentFrame();

  // Timeline markers
  const TITLE_APPEAR = 0;
  const CODE_START = 30;
  const BOTTOM_TEXT_APPEAR = 350;
  const BOTTOM_TEXT_FADEOUT = 500;
  const BREAK_START = 550;
  const TRANSITION_TEXT_APPEAR = 650;
  const NEXT_LAYER_PREVIEW = 780;
  const LAYER_STACK_UPDATE = 800;
  const DESCENT_APPEAR = 900;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Layer stack */}
      <LayerStack
        activeLayer={frame >= LAYER_STACK_UPDATE ? 'machine' : 'assembly'}
        entranceFrame={0}
        visible={true}
      />

      {/* Scene title */}
      <SceneTitle
        frame={frame}
        startFrame={TITLE_APPEAR}
        fadeOutFrame={BREAK_START}
      />

      {/* Machine code display */}
      <MachineCodeDisplay
        frame={frame}
        startFrame={CODE_START}
        breakStart={BREAK_START}
      />

      {/* Bottom of stack text */}
      {frame >= BOTTOM_TEXT_APPEAR && frame < BOTTOM_TEXT_FADEOUT + 60 && (
        <BottomStackText
          frame={frame}
          startFrame={BOTTOM_TEXT_APPEAR}
          fadeOutFrame={BOTTOM_TEXT_FADEOUT}
        />
      )}

      {/* Floor breaking effect */}
      {frame >= BREAK_START && frame < BREAK_START + 200 && (
        <FloorBreakEffect frame={frame} startFrame={BREAK_START} />
      )}

      {/* Transition text */}
      {frame >= TRANSITION_TEXT_APPEAR && frame < NEXT_LAYER_PREVIEW && (
        <TransitionText frame={frame} startFrame={TRANSITION_TEXT_APPEAR} />
      )}

      {/* Next layer preview */}
      {frame >= NEXT_LAYER_PREVIEW && (
        <NextLayerPreview frame={frame} startFrame={NEXT_LAYER_PREVIEW} />
      )}

      {/* Descent indicator */}
      {frame >= DESCENT_APPEAR && (
        <DescentIndicator frame={frame} startFrame={DESCENT_APPEAR} />
      )}
    </AbsoluteFill>
  );
};
