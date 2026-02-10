/**
 * Scene 3B: Precision, Not Vagueness
 * [2:05 - 2:25] — 600 frames
 *
 * "Not vaguely, not 'make it look cool,' but precisely. What's the structure.
 *  What happens in each scene. What's the timing. What visual elements appear
 *  and when. What you want to emphasize and what should stay in the background."
 *
 * Visual: Contrast vague vs. precise, then itemize what precision means
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';

// Timeline
const PHASE = {
  CONTRAST_IN: 0,
  VAGUE_X: 60,
  PRECISE_CHECK: 80,
  CONTRAST_RESOLVE: 100,
  CHECKLIST_START: 140,
  CHECKLIST_SETTLE: 500,
};

// Checklist items
const CHECKLIST_ITEMS = [
  { text: 'Structure', delay: 0 },
  { text: 'Scene-by-scene breakdown', delay: 50 },
  { text: 'Timing', delay: 100 },
  { text: 'Visual elements + when they appear', delay: 150 },
  { text: 'What to emphasize', delay: 200 },
  { text: 'What stays in background', delay: 250 },
];

// ============================================================
// VAGUE BLOB (amorphous, unfocused)
// ============================================================
const VagueBlob: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  // Wobbly animation
  const wobble1 = Math.sin(frame * 0.08) * 10;
  const wobble2 = Math.cos(frame * 0.06) * 8;
  const wobble3 = Math.sin(frame * 0.1 + 1) * 6;

  return (
    <div style={{ position: 'relative', width: 280, height: 200, opacity }}>
      {/* Amorphous blob */}
      <svg width="280" height="200" viewBox="0 0 280 200">
        <defs>
          <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>
        <path
          d={`M ${60 + wobble1} ${40 + wobble2}
              Q ${140 + wobble2} ${20 + wobble3}, ${220 + wobble1} ${50 + wobble2}
              Q ${260 + wobble3} ${100 + wobble1}, ${230 + wobble2} ${150 + wobble3}
              Q ${180 + wobble1} ${190 + wobble2}, ${100 + wobble3} ${170 + wobble1}
              Q ${30 + wobble2} ${150 + wobble3}, ${40 + wobble1} ${90 + wobble2}
              Q ${50 + wobble3} ${50 + wobble1}, ${60 + wobble1} ${40 + wobble2}`}
          fill={`${COLORS.textDim}30`}
          stroke={COLORS.textDim}
          strokeWidth="2"
          filter="url(#blur)"
          opacity={0.6}
        />
        {/* Fuzzy text inside */}
        <text
          x="140"
          y="100"
          textAnchor="middle"
          fill={COLORS.textDim}
          fontSize="18"
          fontFamily={TYPOGRAPHY.body.fontFamily}
          fontStyle="italic"
          opacity={0.5}
          filter="url(#blur)"
        >
          "make it look cool"
        </text>
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 24,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.textMuted,
          letterSpacing: '0.1em',
        }}
      >
        VAGUE
      </div>
    </div>
  );
};

// ============================================================
// PRECISE WIREFRAME (structured, clean)
// ============================================================
const PreciseWireframe: React.FC<{ opacity: number; frame: number; expanded?: boolean }> = ({ opacity, frame, expanded }) => {
  const scanY = ((frame % 60) / 60) * 100;
  const pulse = Math.sin(frame * 0.08) * 0.1 + 0.9;

  return (
    <div style={{ position: 'relative', width: expanded ? 400 : 280, height: expanded ? 280 : 200, opacity, transition: 'all 0.3s' }}>
      <svg width="100%" height="100%" viewBox="0 0 280 200">
        {/* Clean rectangle */}
        <rect
          x="10"
          y="10"
          width="260"
          height="180"
          rx="8"
          fill={COLORS.surface}
          stroke={COLORS.spec}
          strokeWidth="2"
        />

        {/* Corner brackets */}
        <path d="M10 30 L10 10 L30 10" fill="none" stroke={COLORS.spec} strokeWidth="2" opacity={pulse} />
        <path d="M250 10 L270 10 L270 30" fill="none" stroke={COLORS.spec} strokeWidth="2" opacity={pulse} />
        <path d="M270 170 L270 190 L250 190" fill="none" stroke={COLORS.spec} strokeWidth="2" opacity={pulse} />
        <path d="M30 190 L10 190 L10 170" fill="none" stroke={COLORS.spec} strokeWidth="2" opacity={pulse} />

        {/* Structured content lines */}
        <rect x="30" y="30" width="100" height="12" rx="2" fill={COLORS.spec} opacity={0.6} />
        <rect x="30" y="52" width="180" height="8" rx="2" fill={COLORS.textDim} opacity={0.4} />
        <rect x="30" y="68" width="140" height="8" rx="2" fill={COLORS.textDim} opacity={0.3} />

        <rect x="30" y="92" width="80" height="12" rx="2" fill={COLORS.build} opacity={0.5} />
        <rect x="30" y="112" width="200" height="8" rx="2" fill={COLORS.textDim} opacity={0.4} />
        <rect x="30" y="128" width="160" height="8" rx="2" fill={COLORS.textDim} opacity={0.3} />

        <rect x="30" y="152" width="60" height="12" rx="2" fill={COLORS.refine} opacity={0.5} />
        <rect x="30" y="172" width="120" height="8" rx="2" fill={COLORS.textDim} opacity={0.3} />

        {/* Scan line */}
        <line x1="10" y1={10 + scanY * 1.8} x2="270" y2={10 + scanY * 1.8} stroke={COLORS.spec} strokeWidth="1" opacity={0.3} />
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: -40,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 24,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.spec,
          letterSpacing: '0.1em',
        }}
      >
        PRECISE
      </div>
    </div>
  );
};

// ============================================================
// X MARK (animated)
// ============================================================
const XMark: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <circle cx="40" cy="40" r={35 * progress} fill={`${COLORS.time}20`} />
    <line x1="24" y1="24" x2={24 + progress * 32} y2={24 + progress * 32} stroke={COLORS.time} strokeWidth="4" strokeLinecap="round" />
    <line x1="56" y1="24" x2={56 - progress * 32} y2={24 + progress * 32} stroke={COLORS.time} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// ============================================================
// CHECKMARK (animated)
// ============================================================
const CheckMark: React.FC<{ progress: number; size?: number }> = ({ progress, size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <circle cx="40" cy="40" r={35 * progress} fill={`${COLORS.refine}20`} />
    <path
      d={`M24 42 L${24 + progress * 12} ${42 + progress * 12} L${24 + progress * 12 + progress * 20} ${42 + progress * 12 - progress * 24}`}
      fill="none"
      stroke={COLORS.refine}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================
// CHECKBOX ITEM (with typing animation)
// ============================================================
interface CheckboxItemProps {
  text: string;
  startFrame: number;
  index: number;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ text, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const entranceX = interpolate(entrance, [0, 1], [30, 0]);

  // Typing animation
  const typingProgress = interpolate(
    frame,
    [startFrame + 10, startFrame + 10 + text.length * 2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const visibleChars = Math.floor(typingProgress * text.length);

  // Checkbox fill animation (after typing complete)
  const checkFrame = startFrame + 10 + text.length * 2 + 15;
  const checkProgress = spring({
    frame: frame - checkFrame,
    fps,
    config: { damping: 12, stiffness: 300 },
  });

  const isChecked = frame >= checkFrame;
  const boxFill = isChecked ? interpolate(checkProgress, [0, 1], [0, 1]) : 0;

  // Checkmark path animation
  const checkmarkProgress = isChecked ? interpolate(checkProgress, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: entranceOpacity,
        transform: `translateX(${entranceX}px)`,
        marginBottom: 18,
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          border: `2px solid ${isChecked ? COLORS.refine : COLORS.textDim}`,
          backgroundColor: isChecked ? `${COLORS.refine}${Math.floor(boxFill * 255).toString(16).padStart(2, '0')}` : 'transparent',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.2s',
        }}
      >
        {/* Checkmark */}
        {isChecked && (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d={`M3 9 L${3 + checkmarkProgress * 4} ${9 + checkmarkProgress * 4} L${3 + 4 + checkmarkProgress * 8} ${13 - checkmarkProgress * 8}`}
              fill="none"
              stroke={COLORS.background}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Text with typing effect */}
      <span
        style={{
          fontSize: 28,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: isChecked ? COLORS.text : COLORS.textMuted,
          transition: 'color 0.3s',
        }}
      >
        {text.slice(0, visibleChars)}
        {visibleChars < text.length && (
          <span style={{ opacity: Math.floor(frame * 0.15) % 2 === 0 ? 1 : 0, color: COLORS.spec }}>▋</span>
        )}
      </span>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3B_PrecisionNotVague: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Contrast phase animations
  const contrastEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const contrastOpacity = interpolate(contrastEntrance, [0, 1], [0, 1]);

  // X on vague
  const xProgress = spring({ frame: frame - PHASE.VAGUE_X, fps, config: { damping: 15, stiffness: 200 } });

  // Check on precise
  const checkProgress = spring({ frame: frame - PHASE.PRECISE_CHECK, fps, config: { damping: 15, stiffness: 200 } });

  // Resolve: vague fades, precise expands
  const resolveProgress = spring({ frame: frame - PHASE.CONTRAST_RESOLVE, fps, config: SPRING_CONFIGS.gentle });
  const vagueOpacity = interpolate(resolveProgress, [0, 1], [1, 0]);
  const preciseExpand = interpolate(resolveProgress, [0, 1], [0, 1]);

  // Hide contrast when checklist starts
  const contrastFade = interpolate(frame, [PHASE.CHECKLIST_START - 20, PHASE.CHECKLIST_START + 20], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Checklist visible
  const showChecklist = frame >= PHASE.CHECKLIST_START;

  // Checklist settles (shrinks/moves)
  const checklistSettle = spring({ frame: frame - PHASE.CHECKLIST_SETTLE, fps, config: SPRING_CONFIGS.gentle });
  const checklistScale = showChecklist && frame >= PHASE.CHECKLIST_SETTLE
    ? interpolate(checklistSettle, [0, 1], [1, 0.85])
    : 1;
  const checklistX = showChecklist && frame >= PHASE.CHECKLIST_SETTLE
    ? interpolate(checklistSettle, [0, 1], [0, -200])
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Vague vs Precise contrast */}
      {frame < PHASE.CHECKLIST_START + 40 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: 120,
            opacity: contrastOpacity * contrastFade,
          }}
        >
          {/* Vague side */}
          <div style={{ position: 'relative', opacity: vagueOpacity }}>
            <VagueBlob opacity={1} frame={frame} />
            {frame >= PHASE.VAGUE_X && <XMark progress={xProgress} />}
          </div>

          {/* VS divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              opacity: vagueOpacity,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 700,
                color: COLORS.textDim,
              }}
            >
              vs
            </span>
          </div>

          {/* Precise side */}
          <div style={{ position: 'relative' }}>
            <PreciseWireframe opacity={1} frame={frame} expanded={preciseExpand > 0.5} />
            {frame >= PHASE.PRECISE_CHECK && <CheckMark progress={checkProgress} />}
          </div>
        </div>
      )}

      {/* Checklist */}
      {showChecklist && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${checklistX}px), -50%) scale(${checklistScale})`,
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: 32,
              fontSize: 28,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 600,
              color: COLORS.spec,
              letterSpacing: '0.05em',
            }}
          >
            What the spec contains:
          </div>

          {/* Checkbox items */}
          {CHECKLIST_ITEMS.map((item, i) => (
            <CheckboxItem
              key={i}
              text={item.text}
              startFrame={PHASE.CHECKLIST_START + item.delay}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene3B_PrecisionNotVague;
