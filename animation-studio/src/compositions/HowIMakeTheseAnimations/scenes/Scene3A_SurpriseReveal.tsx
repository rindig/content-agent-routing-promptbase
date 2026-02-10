/**
 * Scene 3A: The Surprise Reveal
 * [1:45 - 2:05] — 600 frames
 *
 * "Here's the part that surprised me when I started doing this.
 *  The hard work isn't the AI. It isn't the code. It's the spec."
 *
 * Visual: Expectation subversion - AI and CODE get crossed out, SPEC illuminates
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
  HEADER_IN: 0,
  SURPRISE_TEXT: 45,
  CANDIDATES_IN: 90,
  AI_CROSS: 180,
  CODE_CROSS: 240,
  SPEC_ILLUMINATE: 300,
  SPEC_EXPAND: 360,
  DOC_TRANSFORM: 420,
  DEFINITION: 500,
};

// ============================================================
// SVG ICONS
// ============================================================
const BrainIcon: React.FC<{ color: string; size?: number; frame: number }> = ({ color, size = 48, frame }) => {
  const pulse = Math.sin(frame * 0.1) * 0.15 + 0.85;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Brain outline */}
      <path
        d="M24 8C18 8 14 12 14 18C10 18 8 22 8 26C8 32 12 36 18 36C18 40 22 44 28 44C34 44 38 40 38 34C42 32 44 28 44 24C44 18 40 14 34 14C34 10 30 8 24 8Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity={pulse}
      />
      {/* Neural connections */}
      <circle cx="18" cy="22" r="3" fill={color} opacity={0.6} />
      <circle cx="30" cy="20" r="3" fill={color} opacity={0.6} />
      <circle cx="24" cy="30" r="3" fill={color} opacity={0.6} />
      <line x1="18" y1="22" x2="30" y2="20" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <line x1="18" y1="22" x2="24" y2="30" stroke={color} strokeWidth="1.5" opacity={0.4} />
      <line x1="30" y1="20" x2="24" y2="30" stroke={color} strokeWidth="1.5" opacity={0.4} />
    </svg>
  );
};

const CodeIcon: React.FC<{ color: string; size?: number; frame: number }> = ({ color, size = 48, frame }) => {
  const blink = Math.floor(frame * 0.12) % 2 === 0;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Brackets */}
      <path d="M16 14L8 24L16 34" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 14L40 24L32 34" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Slash */}
      <line x1="28" y1="12" x2="20" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
      {/* Cursor */}
      {blink && <rect x="22" y="22" width="2" height="8" fill={color} opacity={0.8} />}
    </svg>
  );
};

const DocIcon: React.FC<{ color: string; size?: number; frame: number; expanded?: boolean }> = ({ color, size = 48, frame, expanded }) => {
  const scanY = ((frame % 60) / 60) * 100;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Document */}
      <path
        d="M12 6H30L36 12V42H12V6Z"
        stroke={color}
        strokeWidth="2"
        fill={expanded ? `${color}15` : 'none'}
      />
      {/* Fold */}
      <path d="M30 6V12H36" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Lines */}
      <line x1="16" y1="18" x2="32" y2="18" stroke={color} strokeWidth="2" opacity={0.5} />
      <line x1="16" y1="24" x2="28" y2="24" stroke={color} strokeWidth="2" opacity={0.4} />
      <line x1="16" y1="30" x2="30" y2="30" stroke={color} strokeWidth="2" opacity={0.3} />
      <line x1="16" y1="36" x2="24" y2="36" stroke={color} strokeWidth="2" opacity={0.2} />
      {/* Scan line */}
      {expanded && (
        <line x1="14" y1={10 + scanY * 0.3} x2="34" y2={10 + scanY * 0.3} stroke={color} strokeWidth="1" opacity={0.3} />
      )}
    </svg>
  );
};

const CrossOut: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    <line x1="20" y1="20" x2={20 + progress * 60} y2={20 + progress * 60} stroke={color} strokeWidth="4" strokeLinecap="round" />
    <line x1="80" y1="20" x2={80 - progress * 60} y2={20 + progress * 60} stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// ============================================================
// CANDIDATE CARD
// ============================================================
interface CandidateProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  isCrossed: boolean;
  crossFrame: number;
  isIlluminated: boolean;
  illuminateFrame: number;
}

const CandidateCard: React.FC<CandidateProps> = ({
  label,
  icon,
  color,
  delay,
  isCrossed,
  crossFrame,
  isIlluminated,
  illuminateFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance
  const entrance = spring({ frame: frame - delay, fps, config: SPRING_CONFIGS.snappy });
  const entranceOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const entranceY = interpolate(entrance, [0, 1], [40, 0]);
  const entranceScale = interpolate(entrance, [0, 1], [0.8, 1]);

  // Cross out animation
  const crossProgress = isCrossed
    ? spring({ frame: frame - crossFrame, fps, config: { damping: 15, stiffness: 200 } })
    : 0;

  // Dim when crossed
  const dimOpacity = isCrossed ? interpolate(crossProgress, [0, 1], [1, 0.25]) : 1;
  const dimScale = isCrossed ? interpolate(crossProgress, [0, 1], [1, 0.7]) : 1;

  // Illuminate animation
  const illuminateProgress = isIlluminated
    ? spring({ frame: frame - illuminateFrame, fps, config: SPRING_CONFIGS.bouncy })
    : 0;

  const glowIntensity = isIlluminated ? interpolate(illuminateProgress, [0, 1], [0, 1]) : 0;
  const illuminateScale = isIlluminated ? interpolate(illuminateProgress, [0, 1], [1, 1.4]) : 1;
  const pulseGlow = isIlluminated && illuminateProgress > 0.5
    ? Math.sin((frame - illuminateFrame) * 0.1) * 8 + 20
    : 0;

  const finalScale = entranceScale * dimScale * illuminateScale;
  const finalOpacity = entranceOpacity * dimOpacity;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        opacity: finalOpacity,
        transform: `translateY(${entranceY}px) scale(${finalScale})`,
        position: 'relative',
      }}
    >
      {/* Glow effect */}
      {isIlluminated && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            opacity: glowIntensity,
            filter: `blur(${pulseGlow}px)`,
          }}
        />
      )}

      {/* Icon container */}
      <div
        style={{
          width: 100,
          height: 100,
          backgroundColor: COLORS.surface,
          border: `2px solid ${isIlluminated ? color : `${color}60`}`,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: isIlluminated ? `0 0 ${pulseGlow}px ${color}60` : 'none',
        }}
      >
        {icon}
        {/* Cross out X */}
        {isCrossed && crossProgress > 0 && (
          <CrossOut progress={crossProgress} color={COLORS.time} />
        )}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: isIlluminated ? 36 : 28,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: isIlluminated ? color : COLORS.text,
          letterSpacing: '0.1em',
          textShadow: isIlluminated ? `0 0 ${pulseGlow}px ${color}80` : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ============================================================
// DOCUMENT PREVIEW (expanded spec visualization)
// ============================================================
const DocumentPreview: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame: frame - startFrame, fps, config: SPRING_CONFIGS.gentle });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);

  const scanY = ((frame % 80) / 80) * 100;
  const pulseOpacity = Math.sin(frame * 0.06) * 0.1 + 0.9;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        width: 320,
        height: 400,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.spec}`,
        borderRadius: 12,
        padding: 20,
        opacity,
        transform: `scale(${scale})`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      {[
        { top: 8, left: 8, bt: true, bl: true },
        { top: 8, right: 8, bt: true, br: true },
        { bottom: 8, left: 8, bb: true, bl: true },
        { bottom: 8, right: 8, bb: true, br: true },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            width: 16, height: 16,
            borderTop: c.bt ? `2px solid ${COLORS.spec}` : 'none',
            borderBottom: c.bb ? `2px solid ${COLORS.spec}` : 'none',
            borderLeft: c.bl ? `2px solid ${COLORS.spec}` : 'none',
            borderRight: c.br ? `2px solid ${COLORS.spec}` : 'none',
            opacity: pulseOpacity,
          }}
        />
      ))}

      {/* Scan line */}
      <div style={{ position: 'absolute', top: `${scanY}%`, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.spec}40, transparent)` }} />

      {/* Document content preview */}
      <div style={{ fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 12, color: COLORS.textMuted }}>
        <div style={{ color: COLORS.spec, marginBottom: 12 }}># spec.md</div>
        <div style={{ color: COLORS.textDim, marginBottom: 8 }}>## Scene 1A</div>
        <div style={{ marginLeft: 12, marginBottom: 4 }}>
          <span style={{ color: COLORS.spec }}>duration:</span> 240 frames
        </div>
        <div style={{ marginLeft: 12, marginBottom: 4 }}>
          <span style={{ color: COLORS.spec }}>visual:</span> Time transformation
        </div>
        <div style={{ marginLeft: 12, marginBottom: 12 }}>
          <span style={{ color: COLORS.spec }}>animation:</span>
        </div>
        <div style={{ marginLeft: 24, color: COLORS.textDim, fontSize: 11 }}>
          - ONE WEEK text appears<br />
          - Days compress to center<br />
          - Glitch transform to hour<br />
          - CountUp: 168 → 0:58
        </div>
        <div style={{ color: COLORS.textDim, marginTop: 16, marginBottom: 8 }}>## Scene 1B</div>
        <div style={{ marginLeft: 12 }}>
          <span style={{ color: COLORS.spec }}>duration:</span> 300 frames
        </div>
      </div>

      {/* Type badge */}
      <div style={{ position: 'absolute', top: 8, right: 32, padding: '4px 10px', backgroundColor: `${COLORS.spec}20`, borderRadius: 4, fontSize: 10, fontFamily: TYPOGRAPHY.code.fontFamily, color: COLORS.spec, fontWeight: 600 }}>
        SPEC
      </div>
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3A_SurpriseReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header animation
  const headerEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const headerOpacity = interpolate(headerEntrance, [0, 1], [0, 1]);
  const headerX = interpolate(headerEntrance, [0, 1], [-60, 0]);

  // Underline draw
  const underlineProgress = spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.snappy });

  // "Here's the part that surprised me"
  const surpriseEntrance = spring({ frame: frame - PHASE.SURPRISE_TEXT, fps, config: SPRING_CONFIGS.gentle });
  const surpriseOpacity = interpolate(surpriseEntrance, [0, 1], [0, 1]);

  // Fade surprise text when candidates appear
  const surpriseFade = interpolate(frame, [PHASE.CANDIDATES_IN, PHASE.CANDIDATES_IN + 30], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // "The hard work isn't..."
  const hardWorkEntrance = spring({ frame: frame - PHASE.AI_CROSS + 30, fps, config: SPRING_CONFIGS.gentle });
  const hardWorkOpacity = frame >= PHASE.AI_CROSS - 30 ? interpolate(hardWorkEntrance, [0, 1], [0, 1]) : 0;
  const hardWorkFade = interpolate(frame, [PHASE.SPEC_EXPAND, PHASE.DOC_TRANSFORM], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // State checks
  const isAICrossed = frame >= PHASE.AI_CROSS;
  const isCodeCrossed = frame >= PHASE.CODE_CROSS;
  const isSpecIlluminated = frame >= PHASE.SPEC_ILLUMINATE;
  const showDocPreview = frame >= PHASE.DOC_TRANSFORM;

  // Candidates fade when doc transforms
  const candidatesFade = interpolate(frame, [PHASE.DOC_TRANSFORM, PHASE.DOC_TRANSFORM + 60], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Definition text
  const definitionEntrance = spring({ frame: frame - PHASE.DEFINITION, fps, config: SPRING_CONFIGS.gentle });
  const definitionOpacity = frame >= PHASE.DEFINITION ? interpolate(definitionEntrance, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Section header */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 100,
          opacity: headerOpacity,
          transform: `translateX(${headerX}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 32, fontFamily: TYPOGRAPHY.code.fontFamily, fontWeight: 700, color: COLORS.spec, opacity: 0.5 }}>01</span>
          <span style={{ fontSize: 40, fontFamily: TYPOGRAPHY.display.fontFamily, fontWeight: 700, color: COLORS.text, letterSpacing: '0.08em' }}>
            STAGE ONE: THE SPEC
          </span>
        </div>
        <svg width="320" height="4" style={{ marginTop: 12, marginLeft: 52 }}>
          <line x1={0} y1={2} x2={320 * underlineProgress} y2={2} stroke={COLORS.spec} strokeWidth={3} strokeLinecap="round" />
        </svg>
      </div>

      {/* "Here's the part that surprised me" */}
      {frame >= PHASE.SURPRISE_TEXT && frame < PHASE.CANDIDATES_IN + 60 && (
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: surpriseOpacity * surpriseFade,
            fontSize: SIZES.body,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.text,
            textAlign: 'center',
          }}
        >
          Here's the part that surprised me...
        </div>
      )}

      {/* "The hard work isn't..." */}
      {frame >= PHASE.AI_CROSS - 30 && (
        <div
          style={{
            position: 'absolute',
            top: 200,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: hardWorkOpacity * hardWorkFade,
            fontSize: 32,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textMuted,
          }}
        >
          The hard work isn't...
        </div>
      )}

      {/* Three candidates */}
      {frame >= PHASE.CANDIDATES_IN && !showDocPreview && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: 100,
            opacity: candidatesFade,
          }}
        >
          <CandidateCard
            label="AI"
            icon={<BrainIcon color={COLORS.build} frame={frame} />}
            color={COLORS.build}
            delay={PHASE.CANDIDATES_IN}
            isCrossed={isAICrossed}
            crossFrame={PHASE.AI_CROSS}
            isIlluminated={false}
            illuminateFrame={0}
          />
          <CandidateCard
            label="CODE"
            icon={<CodeIcon color={COLORS.refine} frame={frame} />}
            color={COLORS.refine}
            delay={PHASE.CANDIDATES_IN + 15}
            isCrossed={isCodeCrossed}
            crossFrame={PHASE.CODE_CROSS}
            isIlluminated={false}
            illuminateFrame={0}
          />
          <CandidateCard
            label="SPEC"
            icon={<DocIcon color={COLORS.spec} frame={frame} expanded={isSpecIlluminated} />}
            color={COLORS.spec}
            delay={PHASE.CANDIDATES_IN + 30}
            isCrossed={false}
            crossFrame={0}
            isIlluminated={isSpecIlluminated}
            illuminateFrame={PHASE.SPEC_ILLUMINATE}
          />
        </div>
      )}

      {/* Document preview (after SPEC illuminates) */}
      {showDocPreview && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 60,
          }}
        >
          <DocumentPreview startFrame={PHASE.DOC_TRANSFORM} />

          {/* Definition text */}
          {frame >= PHASE.DEFINITION && (
            <div
              style={{
                maxWidth: 500,
                opacity: definitionOpacity,
              }}
            >
              <p
                style={{
                  fontSize: 28,
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  color: COLORS.text,
                  lineHeight: 1.5,
                }}
              >
                The spec is a document that describes{' '}
                <span style={{ color: COLORS.spec, fontWeight: 600 }}>
                  what the video should be
                </span>.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default Scene3A_SurpriseReveal;
