import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  INTERFACE_IN: 0,
  TYPING_START: 30,
  TYPING_END: 75,
  BUTTON_PRESS: 80,
  WAVEFORM_OUT: 90,
  WARNING_ICON: 100,
  INTERFACE_DIM: 110,
  POWERFUL_TEXT: 115,
  NOT_GOOD_BAD: 135,
  SHIELD_ICON: 160,
  LOCK_ICON: 172,
  CHAIN_ICON: 184,
  BRACE: 230,
  INFRASTRUCTURE_LABEL: 240,
  NOT_BUILT_YET: 260,
  SCENE_END: 300,
};

// ── Typed text ──
const TYPED_TEXT = 'I approve the transfer of funds to account ending in 4872.';
const CHARS_PER_FRAME = 2;

// ── Waveform bars ──
const OUTPUT_BAR_COUNT = 24;
const outputBarHeights: number[] = [];
for (let i = 0; i < OUTPUT_BAR_COUNT; i++) {
  const x = (i + 11) * 1.9;
  outputBarHeights.push(0.3 + 0.7 * Math.abs(Math.sin(x * 0.6) * Math.cos(x * 1.1)));
}

// ── Text-to-Speech Interface Card ──
const InterfaceCard: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const enterProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.95, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Dim after INTERFACE_DIM
  const dimOpacity = frame >= BEATS.INTERFACE_DIM
    ? interpolate(
        frame,
        [BEATS.INTERFACE_DIM, BEATS.INTERFACE_DIM + 15],
        [1, 0.3],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Typewriter
  const typeFrame = frame - BEATS.TYPING_START;
  const charsVisible = typeFrame >= 0
    ? Math.min(Math.floor(typeFrame / CHARS_PER_FRAME), TYPED_TEXT.length)
    : 0;

  // Color shift on last chars
  const colorShiftStart = TYPED_TEXT.length - 10;

  // Button state
  const buttonPressed = frame >= BEATS.BUTTON_PRESS;
  const buttonSpinning = buttonPressed && frame < BEATS.BUTTON_PRESS + 10;
  const buttonDone = frame >= BEATS.BUTTON_PRESS + 10;

  // Output waveform
  const showWaveform = frame >= BEATS.WAVEFORM_OUT;

  // Warning icon
  const showWarning = frame >= BEATS.WARNING_ICON;
  const warningProgress = showWarning
    ? spring({
        frame: frame - BEATS.WARNING_ICON,
        fps,
        config: SPRING_CONFIGS.bouncy,
      })
    : 0;

  return (
    <div
      style={{
        width: 900,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 16,
        padding: 32,
        opacity: opacity * dimOpacity,
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Voice selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ ...TYPOGRAPHY.label, fontSize: 20, color: COLORS.textMuted, textTransform: 'none', letterSpacing: 0 }}>
          Voice:
        </span>
        <span
          style={{
            ...TYPOGRAPHY.code,
            fontSize: 24,
            color: COLORS.techBlue,
            backgroundColor: COLORS.codeBg,
            padding: '4px 12px',
            borderRadius: 6,
          }}
        >
          Your_Voice_Clone
        </span>
      </div>

      {/* Text area */}
      <div
        style={{
          backgroundColor: COLORS.codeBg,
          borderRadius: 8,
          padding: 20,
          minHeight: 100,
          position: 'relative',
        }}
      >
        <span style={{ ...TYPOGRAPHY.code, fontSize: 28, lineHeight: 1.5 }}>
          {TYPED_TEXT.slice(0, charsVisible).split('').map((char, i) => {
            const isColorShifted = i >= colorShiftStart && charsVisible >= TYPED_TEXT.length;
            const shiftProgress = isColorShifted
              ? interpolate(
                  i - colorShiftStart,
                  [0, 10],
                  [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                )
              : 0;
            const r = interpolate(shiftProgress, [0, 1], [229, 245]);
            const g = interpolate(shiftProgress, [0, 1], [232, 158]);
            const b = interpolate(shiftProgress, [0, 1], [240, 11]);
            return (
              <span key={i} style={{ color: `rgb(${r},${g},${b})` }}>
                {char}
              </span>
            );
          })}
          {/* Blinking cursor */}
          {charsVisible > 0 && charsVisible < TYPED_TEXT.length && (
            <span style={{ color: COLORS.textMuted, opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>
              |
            </span>
          )}
        </span>
      </div>

      {/* Speak button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            backgroundColor: buttonDone ? COLORS.solutionGreen : COLORS.techBlue,
            color: COLORS.textPrimary,
            padding: '10px 28px',
            borderRadius: 8,
            ...TYPOGRAPHY.label,
            fontSize: 24,
            textTransform: 'none',
            letterSpacing: 0,
            transform: buttonPressed && !buttonDone ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          {buttonSpinning ? 'Processing...' : buttonDone ? 'Done' : 'Speak'}
        </div>
      </div>

      {/* Output waveform */}
      {showWaveform && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
            {outputBarHeights.map((h, i) => {
              const drawDelay = (i / OUTPUT_BAR_COUNT) * 20;
              const barProgress = interpolate(
                frame - BEATS.WAVEFORM_OUT,
                [drawDelay, drawDelay + 5],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h * 40 * barProgress,
                    backgroundColor: COLORS.aiPurple,
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </div>
          {/* Warning icon */}
          {showWarning && (
            <div
              style={{
                opacity: warningProgress,
                transform: `scale(${warningProgress})`,
              }}
            >
              <svg width={24} height={24} viewBox="0 0 24 24">
                <polygon
                  points="12,2 22,20 2,20"
                  fill="none"
                  stroke={COLORS.insightOrange}
                  strokeWidth={2}
                  strokeLinejoin="round"
                />
                <line x1={12} y1={10} x2={12} y2={15} stroke={COLORS.insightOrange} strokeWidth={2} strokeLinecap="round" />
                <circle cx={12} cy={18} r={1} fill={COLORS.insightOrange} />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Infrastructure Icon ──
interface IconConfig {
  type: 'shield' | 'lock' | 'chain';
  label: string;
  color: string;
  startFrame: number;
}

const ICONS: IconConfig[] = [
  { type: 'shield', label: 'Authentication', color: COLORS.solutionGreen, startFrame: BEATS.SHIELD_ICON },
  { type: 'lock', label: 'Verification', color: COLORS.techBlue, startFrame: BEATS.LOCK_ICON },
  { type: 'chain', label: 'Trust Protocols', color: COLORS.insightOrange, startFrame: BEATS.CHAIN_ICON },
];

const ShieldIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={40} height={44} viewBox="0 0 40 44">
    <path
      d="M20,2 L36,12 L36,24 C36,34 20,42 20,42 C20,42 4,34 4,24 L4,12 Z"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinejoin="round"
    />
  </svg>
);

const LockIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={36} height={44} viewBox="0 0 36 44">
    <rect x={4} y={18} width={28} height={22} rx={4} fill="none" stroke={color} strokeWidth={2.5} />
    <path d="M10,18 L10,12 C10,6 26,6 26,12 L26,18" fill="none" stroke={color} strokeWidth={2.5} />
    <circle cx={18} cy={29} r={3} fill={color} />
  </svg>
);

const ChainIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={56} height={32} viewBox="0 0 56 32">
    <ellipse cx={18} cy={16} rx={14} ry={10} fill="none" stroke={color} strokeWidth={2.5} />
    <ellipse cx={38} cy={16} rx={14} ry={10} fill="none" stroke={color} strokeWidth={2.5} />
  </svg>
);

const InfrastructureIcon: React.FC<{
  config: IconConfig;
  frame: number;
  fps: number;
  index: number;
}> = ({ config, frame, fps, index }) => {
  const relFrame = frame - config.startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const y = interpolate(enterProgress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {config.type === 'shield' && <ShieldIcon color={config.color} />}
      {config.type === 'lock' && <LockIcon color={config.color} />}
      {config.type === 'chain' && <ChainIcon color={config.color} />}
      <span style={{ ...TYPOGRAPHY.label, fontSize: 28, color: config.color, textTransform: 'none', letterSpacing: 0 }}>
        {config.label}
      </span>
    </div>
  );
};

// ── Dotted connector between icons ──
const DottedConnector: React.FC<{
  frame: number;
  startFrame: number;
}> = ({ frame, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const opacity = interpolate(relFrame, [0, 10], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 2,
        height: 20,
        borderLeft: `2px dashed ${COLORS.textMuted}`,
        marginLeft: 20,
        opacity,
      }}
    />
  );
};

// ── Bracket SVG ──
const BracketSVG: React.FC<{
  frame: number;
  startFrame: number;
}> = ({ frame, startFrame }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const totalLength = 300;
  const dashOffset = totalLength * (1 - drawProgress);

  return (
    <svg width={24} height={200} viewBox="0 0 24 200" style={{ marginRight: 12 }}>
      <path
        d="M20,10 L8,10 L8,190 L20,190"
        fill="none"
        stroke={COLORS.textPrimary}
        strokeWidth={2}
        strokeDasharray={totalLength}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};

// ── Main Scene ──
export const Scene4_Reproduction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Show interface
  const showInterface = frame < BEATS.INTERFACE_DIM + 30;

  // Show "Powerful" text
  const showPowerful = frame >= BEATS.POWERFUL_TEXT;
  const showNotGoodBad = frame >= BEATS.NOT_GOOD_BAD;

  // Infrastructure section
  const showInfra = frame >= BEATS.SHIELD_ICON;
  const showBrace = frame >= BEATS.BRACE;
  const showInfraLabel = frame >= BEATS.INFRASTRUCTURE_LABEL;
  const showNotBuilt = frame >= BEATS.NOT_BUILT_YET;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 16,
          position: 'relative',
        }}
      >
        {/* Interface card */}
        {showInterface && (
          <InterfaceCard frame={frame} fps={fps} />
        )}

        {/* "Powerful." hero text */}
        {showPowerful && (
          <div style={{ position: showInterface ? 'absolute' : 'relative', zIndex: 2 }}>
            <AnimatedText
              variant="hero"
              size={72}
              color="#FFFFFF"
              entrance="scale"
              springPreset="slow"
              startFrame={BEATS.POWERFUL_TEXT}
            >
              Powerful.
            </AnimatedText>
          </div>
        )}

        {/* "Not good or bad." subtitle */}
        {showNotGoodBad && (
          <div style={{ position: showInterface ? 'absolute' : 'relative', marginTop: showInterface ? 80 : 0, zIndex: 2 }}>
            <AnimatedText
              variant="body"
              size={44}
              color={COLORS.textMuted}
              entrance="fade"
              startFrame={BEATS.NOT_GOOD_BAD}
            >
              Not good or bad.
            </AnimatedText>
          </div>
        )}

        {/* Infrastructure icons column */}
        {showInfra && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginTop: 24,
            }}
          >
            {/* Bracket */}
            {showBrace && (
              <BracketSVG frame={frame} startFrame={BEATS.BRACE} />
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {ICONS.map((icon, i) => (
                <React.Fragment key={i}>
                  <InfrastructureIcon
                    config={icon}
                    frame={frame}
                    fps={fps}
                    index={i}
                  />
                  {i < ICONS.length - 1 && (
                    <DottedConnector
                      frame={frame}
                      startFrame={icon.startFrame + 8}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Infrastructure label */}
            {showInfraLabel && (
              <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
                <AnimatedText
                  variant="title"
                  size={48}
                  color={COLORS.techBlue}
                  entrance="slideUp"
                  startFrame={BEATS.INFRASTRUCTURE_LABEL}
                >
                  Infrastructure
                </AnimatedText>
                {showNotBuilt && (
                  <AnimatedText
                    variant="body"
                    size={40}
                    color={COLORS.errorRed}
                    entrance="fade"
                    startFrame={BEATS.NOT_BUILT_YET}
                  >
                    The part we haven't built yet.
                  </AnimatedText>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
