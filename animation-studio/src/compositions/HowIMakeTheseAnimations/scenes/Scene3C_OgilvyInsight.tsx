/**
 * Scene 3C: The Ogilvy Insight
 * [2:25 - 2:55] — 900 frames
 *
 * "Give me the freedom of a tight brief." — David Ogilvy
 *
 * Visual: Elegant quote reveal with paradox illustration and resolution
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

// Timeline
const PHASE = {
  CONTEXT_BRIDGE: 0,
  QUOTE_IN: 90,
  PARADOX: 300,
  RESOLUTION: 450,
  APPLICATION: 600,
  FOCUS_STATEMENT: 750,
};

// ============================================================
// DESIGNER/ANIMATOR ICONS
// ============================================================
const DesignerIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="12" r="6" stroke={color} strokeWidth="2" />
    <path d="M8 36 C8 26 32 26 32 36" stroke={color} strokeWidth="2" fill="none" />
    <rect x="26" y="18" width="10" height="14" rx="2" stroke={color} strokeWidth="1.5" opacity={0.6} />
    <line x1="28" y1="22" x2="34" y2="22" stroke={color} strokeWidth="1" opacity={0.4} />
    <line x1="28" y1="25" x2="32" y2="25" stroke={color} strokeWidth="1" opacity={0.4} />
  </svg>
);

const AnimatorIcon: React.FC<{ color: string; size?: number; frame: number }> = ({ color, size = 40, frame }) => {
  const wobble = Math.sin(frame * 0.15) * 3;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="12" r="6" stroke={color} strokeWidth="2" />
      <path d="M8 36 C8 26 32 26 32 36" stroke={color} strokeWidth="2" fill="none" />
      {/* Film strip */}
      <rect x="4" y="16" width="10" height="18" rx="1" stroke={color} strokeWidth="1.5" opacity={0.6} />
      <rect x="6" y={19 + wobble * 0.3} width="6" height="4" fill={color} opacity={0.3} />
      <rect x="6" y={25 + wobble * 0.3} width="6" height="4" fill={color} opacity={0.3} />
    </svg>
  );
};

// ============================================================
// QUOTE CARD
// ============================================================
const QuoteCard: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const y = interpolate(entrance, [0, 1], [30, 0]);

  // Word-by-word reveal
  const words = ['Give', 'me', 'the', 'freedom', 'of', 'a', 'tight', 'brief.'];
  const wordDelay = 12;
  const relativeFrame = frame - startFrame;

  // Subtle glow on card
  const pulseGlow = Math.sin(frame * 0.04) * 3 + 8;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        backgroundColor: '#1a1814',
        border: `2px solid ${COLORS.emphasis}40`,
        borderRadius: 16,
        padding: '48px 64px',
        maxWidth: 700,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        boxShadow: `0 0 ${pulseGlow}px ${COLORS.emphasis}20`,
        position: 'relative',
      }}
    >
      {/* Decorative quote mark */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 24,
          fontSize: 80,
          fontFamily: 'Georgia, serif',
          color: `${COLORS.emphasis}20`,
          lineHeight: 1,
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          fontSize: 48,
          fontFamily: 'Georgia, serif',
          fontWeight: 400,
          color: '#FEF3C7',
          lineHeight: 1.4,
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        {words.map((word, i) => {
          const wordStart = startFrame + 30 + i * wordDelay;
          const wordEntrance = spring({ frame: frame - wordStart, fps, config: { damping: 20, stiffness: 150 } });
          const wordOpacity = interpolate(wordEntrance, [0, 1], [0, 1]);
          const wordBlur = interpolate(wordEntrance, [0, 1], [8, 0]);

          // Special styling for "freedom" and "tight"
          const isSpecial = word === 'freedom' || word === 'tight';
          const wordColor = word === 'freedom' ? COLORS.possibility : word === 'tight' ? COLORS.spec : '#FEF3C7';

          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                filter: `blur(${wordBlur}px)`,
                display: 'inline-block',
                marginRight: '0.3em',
                color: wordColor,
                fontWeight: isSpecial ? 600 : 400,
                fontStyle: isSpecial ? 'italic' : 'normal',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Attribution */}
      <div
        style={{
          fontSize: 24,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.textMuted,
          textAlign: 'right',
          opacity: interpolate(relativeFrame, [150, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        — David Ogilvy
      </div>
    </div>
  );
};

// ============================================================
// PARADOX VISUALIZATION
// ============================================================
const ParadoxVis: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.snappy });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Tension line animation
  const tensionPulse = Math.sin(frame * 0.1) * 2;

  // Question mark entrance
  const qEntrance = spring({ frame: frame - startFrame - 60, fps, config: SPRING_CONFIGS.bouncy });
  const qOpacity = interpolate(qEntrance, [0, 1], [0, 1]);
  const qScale = interpolate(qEntrance, [0, 1], [0.5, 1]);

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 40,
        opacity,
      }}
    >
      {/* FREEDOM */}
      <div
        style={{
          fontSize: 32,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.possibility,
          letterSpacing: '0.1em',
        }}
      >
        FREEDOM
      </div>

      {/* Tension line with arrows */}
      <svg width="160" height="40" viewBox="0 0 160 40">
        <defs>
          <linearGradient id="tensionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.possibility} />
            <stop offset="50%" stopColor={COLORS.emphasis} />
            <stop offset="100%" stopColor={COLORS.spec} />
          </linearGradient>
        </defs>
        {/* Arrows pointing inward (tension) */}
        <path d="M10 20 L35 20 M25 14 L35 20 L25 26" stroke={COLORS.possibility} strokeWidth="2" strokeLinecap="round" />
        <path d="M150 20 L125 20 M135 14 L125 20 L135 26" stroke={COLORS.spec} strokeWidth="2" strokeLinecap="round" />
        {/* Pulsing center line */}
        <line
          x1="45"
          y1="20"
          x2="115"
          y2="20"
          stroke="url(#tensionGrad)"
          strokeWidth={2 + tensionPulse * 0.5}
          strokeDasharray="6 4"
          opacity={0.6}
        />
      </svg>

      {/* TIGHT */}
      <div
        style={{
          fontSize: 32,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.spec,
          letterSpacing: '0.1em',
        }}
      >
        TIGHT
      </div>

      {/* Question mark */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: `translate(-50%, 20px) scale(${qScale})`,
          opacity: qOpacity,
          fontSize: 48,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.emphasis,
        }}
      >
        ?
      </div>
    </div>
  );
};

// ============================================================
// RESOLUTION VISUALIZATION (constraint opens to space)
// ============================================================
const ResolutionVis: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Door opening animation
  const doorOpen = interpolate(frame, [startFrame + 30, startFrame + 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Particles flowing through
  const particleProgress = frame >= startFrame + 60 ? ((frame - startFrame - 60) % 60) / 60 : 0;

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, position: 'relative', width: 500, height: 200 }}>
      <svg width="500" height="200" viewBox="0 0 500 200">
        {/* Constraint box (narrow) */}
        <rect
          x="50"
          y="60"
          width="80"
          height="80"
          rx="4"
          fill={COLORS.surface}
          stroke={COLORS.spec}
          strokeWidth="2"
        />
        <text x="90" y="105" textAnchor="middle" fill={COLORS.spec} fontSize="12" fontFamily={TYPOGRAPHY.code.fontFamily}>
          TIGHT
        </text>

        {/* Arrow/opening */}
        <path
          d={`M 140 100 L ${180 + doorOpen * 40} ${100 - doorOpen * 30} M ${180 + doorOpen * 40} ${100 - doorOpen * 30} L ${180 + doorOpen * 40} ${100 + doorOpen * 30} L 140 100`}
          fill={`${COLORS.possibility}20`}
          stroke={COLORS.possibility}
          strokeWidth="2"
        />

        {/* Expansive space (wide) */}
        <rect
          x={220 + doorOpen * 20}
          y="30"
          width={220 * doorOpen}
          height={140 * doorOpen}
          rx="8"
          fill={`${COLORS.possibility}10`}
          stroke={COLORS.possibility}
          strokeWidth="2"
          strokeDasharray={doorOpen < 0.5 ? "8 4" : "none"}
        />
        {doorOpen > 0.5 && (
          <text x={330 + doorOpen * 20} y="105" textAnchor="middle" fill={COLORS.possibility} fontSize="16" fontFamily={TYPOGRAPHY.display.fontFamily} fontWeight="600">
            FREEDOM
          </text>
        )}

        {/* Flowing particles */}
        {doorOpen > 0.3 && [0, 1, 2].map((i) => {
          const px = 150 + ((particleProgress + i * 0.33) % 1) * 250;
          const py = 100 + Math.sin((particleProgress + i * 0.33) * Math.PI * 4) * 20;
          return (
            <circle key={i} cx={px} cy={py} r={4} fill={COLORS.possibility} opacity={0.7} />
          );
        })}

        {/* Labels */}
        <text x="90" y="165" textAnchor="middle" fill={COLORS.textMuted} fontSize="12" fontFamily={TYPOGRAPHY.body.fontFamily}>
          constraints
        </text>
        {doorOpen > 0.8 && (
          <text x="330" y="165" textAnchor="middle" fill={COLORS.textMuted} fontSize="12" fontFamily={TYPOGRAPHY.body.fontFamily}>
            clear direction
          </text>
        )}
      </svg>
    </div>
  );
};

// ============================================================
// PATH VISUALIZATION (foggy vs clear)
// ============================================================
const PathVis: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  // Arrow animation
  const arrowProgress = interpolate(frame, [startFrame + 60, startFrame + 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 28,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.text,
          marginBottom: 24,
        }}
      >
        When the brief is clear...
      </div>

      <svg width="400" height="100" viewBox="0 0 400 100">
        {/* Path */}
        <line x1="50" y1="50" x2="350" y2="50" stroke={COLORS.refine} strokeWidth="3" opacity={0.4} />

        {/* Arrow */}
        <path
          d={`M 50 50 L ${50 + arrowProgress * 280} 50`}
          stroke={COLORS.refine}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d={`M ${30 + arrowProgress * 280} 40 L ${50 + arrowProgress * 280} 50 L ${30 + arrowProgress * 280} 60`}
          stroke={COLORS.refine}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Destination marker */}
        <circle cx="350" cy="50" r="8" fill={COLORS.refine} opacity={arrowProgress} />
      </svg>

      <div
        style={{
          fontSize: 24,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.textMuted,
          marginTop: 16,
          opacity: arrowProgress,
        }}
      >
        ...they know exactly where they're going
      </div>
    </div>
  );
};

// ============================================================
// FOCUS STATEMENT
// ============================================================
const FocusStatement: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const line2Entrance = spring({ frame: frame - startFrame - 45, fps, config: SPRING_CONFIGS.gentle });
  const line2Opacity = interpolate(line2Entrance, [0, 1], [0, 0.5]);

  // Checkmark animation
  const checkProgress = spring({ frame: frame - startFrame - 30, fps, config: { damping: 12, stiffness: 200 } });

  if (frame < startFrame) return null;

  return (
    <div style={{ opacity, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
      {/* Line 1: Focus on SOLVING */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill={`${COLORS.refine}30`} />
          <path
            d={`M8 16 L${8 + checkProgress * 6} ${16 + checkProgress * 6} L${8 + 6 + checkProgress * 10} ${22 - checkProgress * 12}`}
            stroke={COLORS.refine}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span style={{ fontSize: 32, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 600, color: COLORS.text }}>
          Focus on <span style={{ color: COLORS.refine }}>SOLVING</span> the problem
        </span>
      </div>

      {/* Line 2: Not figuring out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: line2Opacity }}>
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill={`${COLORS.textDim}20`} />
          <text x="16" y="22" textAnchor="middle" fill={COLORS.textDim} fontSize="20" fontFamily={TYPOGRAPHY.display.fontFamily}>?</text>
        </svg>
        <span style={{ fontSize: 28, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.textDim }}>
          Not <span style={{ textDecoration: 'line-through' }}>figuring out what the problem is</span>
        </span>
      </div>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3C_OgilvyInsight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Context bridge
  const bridgeEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const bridgeOpacity = interpolate(bridgeEntrance, [0, 1], [0, 1]);
  const bridgeFade = interpolate(frame, [PHASE.QUOTE_IN - 30, PHASE.QUOTE_IN], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Quote fade for paradox
  const quoteFade = interpolate(frame, [PHASE.PARADOX - 30, PHASE.PARADOX], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const quoteHide = interpolate(frame, [PHASE.RESOLUTION - 30, PHASE.RESOLUTION], [0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const finalQuoteOpacity = frame >= PHASE.RESOLUTION ? quoteHide : quoteFade;

  // Paradox fade
  const paradoxFade = interpolate(frame, [PHASE.RESOLUTION - 30, PHASE.RESOLUTION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Resolution fade
  const resolutionFade = interpolate(frame, [PHASE.APPLICATION - 30, PHASE.APPLICATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Application fade
  const applicationFade = interpolate(frame, [PHASE.FOCUS_STATEMENT - 30, PHASE.FOCUS_STATEMENT], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Context bridge: "the brief" */}
      {frame < PHASE.QUOTE_IN + 30 && (
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: bridgeOpacity * bridgeFade,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 60, marginBottom: 20 }}>
            <DesignerIcon color={COLORS.spec} size={48} />
            <AnimatorIcon color={COLORS.build} size={48} frame={frame} />
          </div>
          <span style={{ fontSize: 36, fontFamily: TYPOGRAPHY.body.fontFamily, color: COLORS.text }}>
            You know this as <span style={{ color: COLORS.spec, fontWeight: 600 }}>the brief</span>
          </span>
        </div>
      )}

      {/* Quote card */}
      {frame >= PHASE.QUOTE_IN && frame < PHASE.RESOLUTION + 30 && (
        <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%, -50%)', opacity: finalQuoteOpacity }}>
          <QuoteCard startFrame={PHASE.QUOTE_IN} />
        </div>
      )}

      {/* Paradox visualization */}
      {frame >= PHASE.PARADOX && frame < PHASE.RESOLUTION + 30 && (
        <div style={{ position: 'absolute', top: '68%', left: '50%', transform: 'translate(-50%, -50%)', opacity: paradoxFade }}>
          <ParadoxVis startFrame={PHASE.PARADOX} />
        </div>
      )}

      {/* Resolution visualization */}
      {frame >= PHASE.RESOLUTION && frame < PHASE.APPLICATION + 30 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: resolutionFade }}>
          <ResolutionVis startFrame={PHASE.RESOLUTION} />
        </div>
      )}

      {/* Path/application visualization */}
      {frame >= PHASE.APPLICATION && frame < PHASE.FOCUS_STATEMENT + 30 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: applicationFade }}>
          <PathVis startFrame={PHASE.APPLICATION} />
        </div>
      )}

      {/* Focus statement */}
      {frame >= PHASE.FOCUS_STATEMENT && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <FocusStatement startFrame={PHASE.FOCUS_STATEMENT} />
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene3C_OgilvyInsight;
