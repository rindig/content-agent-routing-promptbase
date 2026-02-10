/**
 * Scene 3F: Spec File Demo
 * [3:35 - 4:00] — 750 frames
 *
 * "I'll show you what one of my specs looks like. It's just a markdown
 *  file. Headings for each scene, descriptions of what happens, notes
 *  on timing and emphasis. Nothing fancy. But it's the document that
 *  makes everything else possible."
 *
 * Visual: Animated spec preview with callouts, then video placeholder
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
  TRANSITION: 0,
  SPEC_PREVIEW: 120,
  CALLOUTS: 300,
  NOTHING_FANCY: 360,
  VIDEO_PLACEHOLDER: 450,
  CLOSING: 700,
};

// Spec content lines with syntax highlighting
const SPEC_LINES: Array<{
  text: string;
  color: string;
  indent: number;
  bold?: boolean;
}> = [
  { text: '# Scene 1: Opening Hook', color: '#C084FC', indent: 0, bold: true },
  { text: '**[0:00 - 0:15]** — 450 frames', color: '#60A5FA', indent: 0 },
  { text: '', color: 'transparent', indent: 0 },
  { text: '**Narration:** "The animations in', color: '#FCD34D', indent: 0 },
  { text: 'this video would have taken me..."', color: '#FCD34D', indent: 0 },
  { text: '', color: 'transparent', indent: 0 },
  { text: '**Visual Concept:** Time compression', color: '#34D399', indent: 0 },
  { text: '', color: 'transparent', indent: 0 },
  { text: '## Animation Sequence:', color: '#C084FC', indent: 0, bold: true },
  { text: '1. Text fades in: "ONE WEEK"', color: '#D1D5DB', indent: 1 },
  { text: '   - 84px, muted red (#EF4444)', color: '#9CA3AF', indent: 2 },
  { text: '2. Days compress toward center', color: '#D1D5DB', indent: 1 },
  { text: '   - spring: snappy, damping 20', color: '#9CA3AF', indent: 2 },
  { text: '3. GlitchText transformation →', color: '#D1D5DB', indent: 1 },
  { text: '   "< 1 HOUR" bright green', color: '#9CA3AF', indent: 2 },
];

// Callout labels
const CALLOUTS = [
  { label: 'Scene headings', targetLine: 0, x: -60, y: -10, color: '#C084FC' },
  { label: 'Timing + frames', targetLine: 1, x: -50, y: 0, color: '#60A5FA' },
  { label: 'What happens', targetLine: 6, x: -60, y: 0, color: '#34D399' },
  { label: 'Animation steps', targetLine: 9, x: -50, y: 0, color: '#D1D5DB' },
];

// ============================================================
// ANIMATED SPEC DOCUMENT
// ============================================================
const SpecDocument: React.FC<{ startFrame: number; scale?: number }> = ({
  startFrame,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const docScale = interpolate(entrance, [0, 1], [0.9, 1]);

  // Scan line
  const scanPosition = ((frame % 150) / 150) * 100;

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${docScale * scale})`,
        width: 420,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.spec}40`,
        borderRadius: 16,
        padding: '24px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: `1px solid ${COLORS.textDim}20`,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444', opacity: 0.6 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B', opacity: 0.6 }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22C55E', opacity: 0.6 }} />
        <span
          style={{
            fontSize: 12,
            fontFamily: TYPOGRAPHY.code.fontFamily,
            color: COLORS.textDim,
            marginLeft: 12,
          }}
        >
          spec.md
        </span>
      </div>

      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderTop: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 8, left: 8, width: 14, height: 14, borderBottom: `2px solid ${COLORS.spec}`, borderLeft: `2px solid ${COLORS.spec}`, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: `2px solid ${COLORS.spec}`, borderRight: `2px solid ${COLORS.spec}`, opacity: 0.5 }} />

      {/* Spec lines with typewriter effect */}
      {SPEC_LINES.map((line, i) => {
        const lineDelay = startFrame + 15 + i * 8;
        const lineEntrance = spring({
          frame: frame - lineDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const lineOpacity = interpolate(lineEntrance, [0, 1], [0, 1]);

        // Typewriter: show characters progressively
        const typeProgress = interpolate(
          frame,
          [lineDelay, lineDelay + 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const charsToShow = Math.floor(typeProgress * line.text.length);

        if (line.text === '') {
          return <div key={i} style={{ height: 8 }} />;
        }

        return (
          <div
            key={i}
            style={{
              fontSize: 16,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              color: line.color,
              fontWeight: line.bold ? 700 : 400,
              opacity: lineOpacity,
              marginBottom: 4,
              paddingLeft: line.indent * 12,
              lineHeight: 1.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {line.text.slice(0, charsToShow)}
            {charsToShow < line.text.length && (
              <span style={{ opacity: Math.floor(frame * 0.1) % 2 === 0 ? 1 : 0, color: COLORS.text }}>▋</span>
            )}
          </div>
        );
      })}

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanPosition}%`,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.spec}20, transparent)`,
        }}
      />
    </div>
  );
};

// ============================================================
// CALLOUT LABELS
// ============================================================
const CalloutLabels: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame) return null;

  return (
    <>
      {CALLOUTS.map((callout, i) => {
        const entrance = spring({
          frame: frame - startFrame - i * 15,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const opacity = interpolate(entrance, [0, 1], [0, 1]);
        const xOff = interpolate(entrance, [0, 1], [-20, 0]);

        // Position relative to document (left side)
        const topPos = 80 + callout.targetLine * 22;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              right: '56%',
              top: topPos,
              opacity,
              transform: `translateX(${xOff}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: callout.color,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {callout.label}
            </span>
            <svg width="40" height="2">
              <line x1="0" y1="1" x2="40" y2="1" stroke={callout.color} strokeWidth="2" strokeDasharray="4 2" opacity={0.6} />
            </svg>
          </div>
        );
      })}
    </>
  );
};

// ============================================================
// VIDEO PLACEHOLDER
// ============================================================
const VideoPlaceholder: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(entrance, [0, 1], [0, 1]);
  const scale = interpolate(entrance, [0, 1], [0.95, 1]);

  if (frame < startFrame) return null;

  const scanPos = ((frame % 120) / 120) * 100;
  const bracketPulse = Math.sin(frame * 0.06) * 0.15 + 0.5;

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        width: 800,
        height: 450,
        backgroundColor: COLORS.surface,
        border: `2px solid ${COLORS.build}40`,
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
      <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: `3px solid ${COLORS.build}`, borderLeft: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />
      <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: `3px solid ${COLORS.build}`, borderRight: `3px solid ${COLORS.build}`, opacity: bracketPulse }} />

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 28,
          fontSize: 16,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textDim,
        }}
      >
        INSERT: Screen recording — scrolling through spec
      </div>

      {/* Duration badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 28,
          padding: '6px 14px',
          backgroundColor: `${COLORS.build}20`,
          borderRadius: 6,
          border: `1px solid ${COLORS.build}40`,
          fontSize: 14,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.build,
        }}
      >
        ~20 sec
      </div>

      {/* Center play icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="none" stroke={COLORS.textDim} strokeWidth="2" opacity={0.3} />
          <polygon points="26,20 26,44 46,32" fill={COLORS.textDim} opacity={0.3} />
        </svg>
      </div>

      {/* Scan line */}
      <div
        style={{
          position: 'absolute',
          top: `${scanPos}%`,
          left: 0,
          right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.build}30, transparent)`,
        }}
      />
    </div>
  );
};

// ============================================================
// MAIN SCENE
// ============================================================
export const Scene3F_SpecFileDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase transitions
  const transitionEntrance = spring({ frame, fps, config: SPRING_CONFIGS.gentle });
  const transitionOpacity = interpolate(transitionEntrance, [0, 1], [0, 1]);

  // "Let me show you" fades out
  const showYouFade = interpolate(
    frame,
    [PHASE.SPEC_PREVIEW - 30, PHASE.SPEC_PREVIEW],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Spec document shrinks when video placeholder appears
  const specShrink = interpolate(
    frame,
    [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER + 30],
    [1, 0.45],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const specMoveX = interpolate(
    frame,
    [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER + 30],
    [0, -420],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const specMoveY = interpolate(
    frame,
    [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER + 30],
    [0, -200],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Callouts fade when nothing-fancy starts
  const calloutsFade = interpolate(
    frame,
    [PHASE.NOTHING_FANCY - 15, PHASE.NOTHING_FANCY],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // "Nothing fancy" text
  const nothingFancyEntrance = spring({
    frame: frame - PHASE.NOTHING_FANCY,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const nothingFancyOpacity = frame >= PHASE.NOTHING_FANCY
    ? interpolate(nothingFancyEntrance, [0, 1], [0, 1])
    : 0;
  const nothingFancyFade = interpolate(
    frame,
    [PHASE.VIDEO_PLACEHOLDER - 30, PHASE.VIDEO_PLACEHOLDER],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Closing text
  const closingEntrance = spring({
    frame: frame - PHASE.CLOSING,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const closingOpacity = frame >= PHASE.CLOSING
    ? interpolate(closingEntrance, [0, 1], [0, 1])
    : 0;

  // Video placeholder fades for closing
  const placeholderFade = interpolate(
    frame,
    [PHASE.CLOSING - 15, PHASE.CLOSING],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* "Let me show you" transition text */}
      {frame < PHASE.SPEC_PREVIEW + 10 && (
        <div
          style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: transitionOpacity * showYouFade,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* Document icon expanding */}
            <svg width="64" height="76" viewBox="0 0 64 76" fill="none">
              <path d="M12 4H44L56 16V72H12V4Z" stroke={COLORS.spec} strokeWidth="2.5" fill={`${COLORS.spec}10`} />
              <path d="M44 4V16H56" stroke={COLORS.spec} strokeWidth="2.5" />
              <line x1="20" y1="28" x2="44" y2="28" stroke={COLORS.spec} strokeWidth="2" opacity={0.5} />
              <line x1="20" y1="38" x2="36" y2="38" stroke={COLORS.spec} strokeWidth="2" opacity={0.4} />
              <line x1="20" y1="48" x2="40" y2="48" stroke={COLORS.spec} strokeWidth="2" opacity={0.3} />
            </svg>
            <div
              style={{
                fontSize: SIZES.body,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                color: COLORS.text,
              }}
            >
              Let me show you
            </div>
          </div>
        </div>
      )}

      {/* Spec document */}
      {frame >= PHASE.SPEC_PREVIEW && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${specMoveX}px), calc(-50% + ${specMoveY}px)) scale(${specShrink})`,
            transformOrigin: 'center center',
          }}
        >
          <SpecDocument startFrame={PHASE.SPEC_PREVIEW} />
        </div>
      )}

      {/* Callout labels */}
      {frame >= PHASE.CALLOUTS && frame < PHASE.NOTHING_FANCY + 15 && (
        <div style={{ opacity: calloutsFade }}>
          <CalloutLabels startFrame={PHASE.CALLOUTS} />
        </div>
      )}

      {/* "Nothing fancy" text */}
      {frame >= PHASE.NOTHING_FANCY && frame < PHASE.VIDEO_PLACEHOLDER + 15 && (
        <div
          style={{
            position: 'absolute',
            bottom: 140,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: nothingFancyOpacity * nothingFancyFade,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: SIZES.subtext,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              marginBottom: 12,
            }}
          >
            Nothing fancy. Just a{' '}
            <span
              style={{
                color: COLORS.text,
                fontWeight: 600,
                padding: '4px 12px',
                backgroundColor: `${COLORS.spec}15`,
                borderRadius: 6,
                border: `1px solid ${COLORS.spec}30`,
              }}
            >
              .md
            </span>{' '}
            file
          </div>
        </div>
      )}

      {/* Video placeholder */}
      {frame >= PHASE.VIDEO_PLACEHOLDER && frame < PHASE.CLOSING + 15 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '53%',
            transform: 'translate(-50%, -50%)',
            opacity: placeholderFade,
          }}
        >
          <VideoPlaceholder startFrame={PHASE.VIDEO_PLACEHOLDER} />
        </div>
      )}

      {/* Closing emphasis */}
      {frame >= PHASE.CLOSING && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: closingOpacity,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: SIZES.body,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              color: COLORS.text,
              lineHeight: 1.4,
            }}
          >
            The document that makes
          </div>
          <div
            style={{
              fontSize: SIZES.title,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 700,
              color: COLORS.spec,
              marginTop: 8,
              textShadow: `0 0 ${Math.sin(frame * 0.08) * 4 + 8}px ${COLORS.spec}40`,
            }}
          >
            everything else possible
          </div>

          {/* Spec doc icon pulsing */}
          <div style={{ marginTop: 32 }}>
            <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
              <path d="M8 2H32L42 12V54H8V2Z" stroke={COLORS.spec} strokeWidth="2" fill={`${COLORS.spec}10`} />
              <path d="M32 2V12H42" stroke={COLORS.spec} strokeWidth="2" />
              <line x1="14" y1="22" x2="34" y2="22" stroke={COLORS.spec} strokeWidth="2" opacity={0.5} />
              <line x1="14" y1="30" x2="28" y2="30" stroke={COLORS.spec} strokeWidth="2" opacity={0.4} />
              <line x1="14" y1="38" x2="32" y2="38" stroke={COLORS.spec} strokeWidth="2" opacity={0.3} />
            </svg>
          </div>
        </div>
      )}

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene3F_SpecFileDemo;
