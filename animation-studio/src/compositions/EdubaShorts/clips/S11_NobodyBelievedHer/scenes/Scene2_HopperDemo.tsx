import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { HistoricalPanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 2: Hopper's Compiler
 * Duration: 210 frames (7 seconds)
 *
 * 1952 Grace Hopper HistoricalPanel → compiler transformation diagram
 * (human instructions → A-0 compiler → machine code) with flowing dots
 * and typewriter binary.
 */

const BEATS = {
  WARM_BG_IN: 0,
  YEAR_BADGE_IN: 10,
  NAME_IN: 15,
  TOP_PANEL_IN: 30,
  ARROW_DRAW: 55,
  COMPILER_LABEL: 60,
  BOTTOM_PANEL_IN: 70,
  BINARY_TYPEWRITER: 75,
  TAGLINE_IN: 160,
};

const BINARY_STRING = '10110010 01001101 11100001';

// Flowing dot along the arrow
const FlowingDot: React.FC<{
  startFrame: number;
  delay: number;
  arrowHeight: number;
}> = ({ startFrame, delay, arrowHeight }) => {
  const frame = useCurrentFrame();
  const rel = frame - startFrame - delay;
  if (rel < 0) return null;

  // Loop every 30 frames
  const cycleLen = 30;
  const t = (rel % cycleLen) / cycleLen;
  const y = t * arrowHeight;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: y,
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: COLORS.historyGold,
        transform: 'translateX(-50%)',
        opacity: 0.8,
      }}
    />
  );
};

export const Scene2_HopperDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Top panel entrance
  const topPanelProgress = spring({
    frame: frame - BEATS.TOP_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const topPanelOpacity = interpolate(topPanelProgress, [0, 1], [0, 1]);
  const topPanelY = interpolate(topPanelProgress, [0, 1], [20, 0]);

  // Arrow draw progress
  const arrowDrawProgress = interpolate(
    frame,
    [BEATS.ARROW_DRAW, BEATS.ARROW_DRAW + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Compiler label
  const compilerLabelOpacity = interpolate(
    frame,
    [BEATS.COMPILER_LABEL, BEATS.COMPILER_LABEL + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bottom panel entrance
  const bottomPanelProgress = spring({
    frame: frame - BEATS.BOTTOM_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const bottomPanelOpacity = interpolate(bottomPanelProgress, [0, 1], [0, 1]);
  const bottomPanelY = interpolate(bottomPanelProgress, [0, 1], [20, 0]);

  // Binary typewriter: chars revealed over time
  const typewriterRel = frame - BEATS.BINARY_TYPEWRITER;
  const charsRevealed =
    typewriterRel > 0 ? Math.min(Math.floor(typewriterRel / 2), BINARY_STRING.length) : 0;
  const typedBinary = BINARY_STRING.substring(0, charsRevealed);

  // Arrow pulse after diagram complete
  const pulseOpacity =
    frame >= BEATS.BOTTOM_PANEL_IN + 30
      ? 0.1 + 0.2 * Math.abs(Math.sin(((frame - BEATS.BOTTOM_PANEL_IN) / 45) * Math.PI))
      : 0;

  // Tagline
  const taglineProgress = spring({
    frame: frame - BEATS.TAGLINE_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);
  const taglineY = interpolate(taglineProgress, [0, 1], [15, 0]);

  // Subtitle below name
  const subtitleOpacity = interpolate(
    frame,
    [BEATS.NAME_IN + 10, BEATS.NAME_IN + 25],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const arrowHeight = 80;

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={200}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 16,
        }}
      >
        {/* Historical Panel: Year + Name */}
        <HistoricalPanel
          year="1952"
          startFrame={BEATS.YEAR_BADGE_IN}
          badgeColor={COLORS.historyGold}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 52,
                color: COLORS.historyGold,
              }}
            >
              Grace Hopper
            </span>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                textTransform: 'none',
                letterSpacing: 0,
                opacity: subtitleOpacity,
              }}
            >
              U.S. Navy / Remington Rand
            </span>
          </div>
        </HistoricalPanel>

        {/* Compiler Transformation Diagram */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            width: '100%',
            maxWidth: 860,
          }}
        >
          {/* Top Panel — Human Instructions */}
          <div style={{ width: '100%', textAlign: 'center' }}>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 20,
                color: COLORS.textMuted,
                opacity: topPanelOpacity,
              }}
            >
              HUMAN INSTRUCTIONS
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 100,
              borderRadius: 12,
              backgroundColor: 'rgba(201,162,39,0.1)',
              border: `1px solid ${COLORS.historyGold}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: topPanelOpacity,
              transform: `translateY(${topPanelY}px)`,
              marginTop: 8,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: COLORS.historyGold,
              }}
            >
              MULTIPLY PRICE BY QUANTITY
            </span>
          </div>

          {/* Arrow with flowing dots */}
          <div
            style={{
              position: 'relative',
              width: 2,
              height: arrowHeight,
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            {/* Arrow line */}
            <svg
              width={20}
              height={arrowHeight}
              style={{ position: 'absolute', left: -9, top: 0 }}
            >
              <line
                x1={10}
                y1={0}
                x2={10}
                y2={arrowHeight - 10}
                stroke={COLORS.historyGold}
                strokeWidth={2}
                strokeDasharray={arrowHeight}
                strokeDashoffset={arrowHeight * (1 - arrowDrawProgress)}
              />
              {/* Arrowhead */}
              <polygon
                points={`5,${arrowHeight - 14} 10,${arrowHeight - 4} 15,${arrowHeight - 14}`}
                fill={COLORS.historyGold}
                opacity={arrowDrawProgress}
              />
            </svg>

            {/* Flowing dots */}
            {frame >= BEATS.ARROW_DRAW + 10 && (
              <>
                <FlowingDot startFrame={BEATS.ARROW_DRAW + 10} delay={0} arrowHeight={arrowHeight} />
                <FlowingDot startFrame={BEATS.ARROW_DRAW + 10} delay={8} arrowHeight={arrowHeight} />
                <FlowingDot startFrame={BEATS.ARROW_DRAW + 10} delay={16} arrowHeight={arrowHeight} />
              </>
            )}

            {/* Compiler label on arrow */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: COLORS.bgWarm,
                padding: '4px 12px',
                borderRadius: 6,
                opacity: compilerLabelOpacity,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.historyGold,
                }}
              >
                A-0 COMPILER
              </span>
            </div>

            {/* Glow pulse on arrow area */}
            <div
              style={{
                position: 'absolute',
                inset: -20,
                backgroundColor: COLORS.historyGold,
                opacity: pulseOpacity,
                filter: 'blur(20px)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Bottom Panel — Machine Code */}
          <div
            style={{
              width: '100%',
              height: 100,
              borderRadius: 12,
              backgroundColor: 'rgba(59,130,246,0.1)',
              border: `1px solid ${COLORS.techBlue}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: bottomPanelOpacity,
              transform: `translateY(${bottomPanelY}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: COLORS.techBlue,
              }}
            >
              {typedBinary}
              {charsRevealed < BINARY_STRING.length && (
                <span
                  style={{
                    opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0,
                    color: COLORS.techBlue,
                  }}
                >
                  _
                </span>
              )}
            </span>
          </div>
          <div style={{ width: '100%', textAlign: 'center', marginTop: 4 }}>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 20,
                color: COLORS.textMuted,
                opacity: bottomPanelOpacity,
              }}
            >
              MACHINE CODE
            </span>
          </div>
        </div>

        {/* Tagline */}
        {frame >= BEATS.TAGLINE_IN && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 16,
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.textBody,
              }}
            >
              The first time a computer understood words.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
