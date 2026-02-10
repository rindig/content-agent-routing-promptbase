import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { HistoricalPanel } from '../../../components';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  TRANSITION: 0,
  YEAR_BADGE_IN: 15,
  QUOTE_START: 30,
  QUOTE_STAGGER: 3,
  SPLIT_SCREEN_IN: 100,
  SPLIT_STAGGER: 10,
  ARROW_DRAW: 120,
  HOLD: 150,
};

// ── Quote Block ──
const QuoteBlock: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.QUOTE_START;
  if (relFrame < 0) return null;

  const quoteEnter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const quoteOpacity = interpolate(quoteEnter, [0, 1], [0, 1]);

  // Shine on highlighted words (after full quote is revealed, ~frame 150)
  const shineActive = frame >= BEATS.HOLD;

  return (
    <div
      style={{
        padding: '0 54px',
        opacity: quoteOpacity,
        position: 'relative',
      }}
    >
      {/* Opening quotation mark */}
      <div
        style={{
          ...TYPOGRAPHY.hero,
          fontSize: 120,
          color: COLORS.historyGold,
          opacity: 0.3,
          position: 'absolute',
          top: -40,
          left: 30,
          lineHeight: 1,
        }}
      >
        {'\u201C'}
      </div>

      {/* Quote text — word-by-word reveal */}
      <div
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 20,
        }}
      >
        {/* Line 1 */}
        <div style={{ marginBottom: 8 }}>
          <BlurText
            startFrame={BEATS.QUOTE_START}
            animateBy="words"
            direction="bottom"
            staggerDelay={BEATS.QUOTE_STAGGER}
            blurAmount={10}
            distance={30}
            fontSize={40}
          >
            The Analytical Engine weaves
          </BlurText>
        </div>

        {/* Line 2 — highlighted */}
        <div style={{ marginBottom: 8 }}>
          {shineActive ? (
            <ShinyText
              startFrame={BEATS.HOLD}
              color={COLORS.historyGold}
              shineColor="#FFFFFF"
              duration={60}
              pauseDuration={30}
              fontSize={40}
            >
              algebraical patterns
            </ShinyText>
          ) : (
            <BlurText
              startFrame={BEATS.QUOTE_START + 12}
              animateBy="words"
              direction="bottom"
              staggerDelay={BEATS.QUOTE_STAGGER}
              blurAmount={10}
              distance={30}
              fontSize={40}
            >
              algebraical patterns
            </BlurText>
          )}
        </div>

        {/* Line 3 */}
        <div style={{ marginBottom: 8 }}>
          <BlurText
            startFrame={BEATS.QUOTE_START + 20}
            animateBy="words"
            direction="bottom"
            staggerDelay={BEATS.QUOTE_STAGGER}
            blurAmount={10}
            distance={30}
            fontSize={40}
          >
            just as the Jacquard loom weaves
          </BlurText>
        </div>

        {/* Line 4 — highlighted */}
        <div style={{ marginBottom: 8 }}>
          {shineActive ? (
            <ShinyText
              startFrame={BEATS.HOLD}
              color={COLORS.historyGold}
              shineColor="#FFFFFF"
              duration={60}
              pauseDuration={30}
              fontSize={40}
            >
              flowers and leaves.
            </ShinyText>
          ) : (
            <BlurText
              startFrame={BEATS.QUOTE_START + 40}
              animateBy="words"
              direction="bottom"
              staggerDelay={BEATS.QUOTE_STAGGER}
              blurAmount={10}
              distance={30}
              fontSize={40}
            >
              flowers and leaves.
            </BlurText>
          )}
        </div>
      </div>

      {/* Closing quotation mark */}
      <div
        style={{
          ...TYPOGRAPHY.hero,
          fontSize: 120,
          color: COLORS.historyGold,
          opacity: 0.3,
          textAlign: 'right',
          lineHeight: 1,
          marginTop: -20,
          paddingRight: 30,
        }}
      >
        {'\u201D'}
      </div>
    </div>
  );
};

// ── Loom vs Computer comparison ──
const LoomVsComputer: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.SPLIT_SCREEN_IN;
  if (relFrame < 0) return null;

  // Top panel (loom)
  const topProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const topOpacity = interpolate(topProgress, [0, 1], [0, 1]);
  const topY = interpolate(topProgress, [0, 1], [30, 0]);

  // Bottom panel (computer) — staggered
  const bottomRel = relFrame - BEATS.SPLIT_STAGGER;
  const bottomProgress =
    bottomRel >= 0
      ? spring({ frame: bottomRel, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const bottomOpacity = interpolate(
    bottomRel,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const bottomY =
    bottomRel >= 0 ? interpolate(bottomProgress, [0, 1], [30, 0]) : 30;

  // Arrow draw
  const arrowRel = frame - BEATS.ARROW_DRAW;
  const arrowProgress =
    arrowRel >= 0
      ? interpolate(arrowRel, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const arrowOpacity =
    arrowRel >= 0
      ? interpolate(arrowRel, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  const panelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 24px',
    borderRadius: 10,
    border: `1px solid ${COLORS.panelBorder}`,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        padding: '0 54px',
      }}
    >
      {/* Top: Loom */}
      <div
        style={{
          ...panelStyle,
          backgroundColor: `${COLORS.bgWarm}`,
          opacity: topOpacity,
          transform: `translateY(${topY}px)`,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Mini loom icon */}
        <svg width={48} height={40} viewBox="0 0 48 40">
          <rect
            x={2}
            y={2}
            width={6}
            height={36}
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={1.5}
          />
          <rect
            x={40}
            y={2}
            width={6}
            height={36}
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={1.5}
          />
          <rect
            x={2}
            y={2}
            width={44}
            height={6}
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={1.5}
          />
          {[0, 1, 2].map((j) => (
            <line
              key={j}
              x1={14 + j * 10}
              y1={8}
              x2={14 + j * 10}
              y2={38}
              stroke={COLORS.historyGold}
              strokeWidth={0.5}
              opacity={0.4}
            />
          ))}
        </svg>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color: COLORS.historyGold,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          Weaves flowers
        </span>
      </div>

      {/* Arrow */}
      <div
        style={{
          height: 48,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: arrowOpacity,
        }}
      >
        <svg width={40} height={48} viewBox="0 0 40 48">
          {/* Top arrowhead */}
          <polyline
            points="14,12 20,4 26,12"
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={40}
            strokeDashoffset={40 * (1 - arrowProgress)}
          />
          {/* Vertical line */}
          <line
            x1={20}
            y1={4}
            x2={20}
            y2={44}
            stroke={COLORS.historyGold}
            strokeWidth={2}
            strokeDasharray={40}
            strokeDashoffset={40 * (1 - arrowProgress)}
          />
          {/* Bottom arrowhead */}
          <polyline
            points="14,36 20,44 26,36"
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={40}
            strokeDashoffset={40 * (1 - arrowProgress)}
          />
        </svg>
      </div>

      {/* Bottom: Computer */}
      <div
        style={{
          ...panelStyle,
          backgroundColor: COLORS.bg,
          opacity: bottomOpacity,
          transform: `translateY(${bottomY}px)`,
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {/* Monitor icon */}
        <svg width={48} height={40} viewBox="0 0 48 40">
          <rect
            x={4}
            y={2}
            width={40}
            height={28}
            rx={3}
            fill="none"
            stroke={COLORS.techBlue}
            strokeWidth={1.5}
          />
          {/* Screen glow */}
          <rect
            x={8}
            y={6}
            width={32}
            height={20}
            rx={1}
            fill={COLORS.techBlue}
            opacity={0.15}
          />
          {/* Stand */}
          <line
            x1={24}
            y1={30}
            x2={24}
            y2={36}
            stroke={COLORS.techBlue}
            strokeWidth={1.5}
          />
          <line
            x1={16}
            y1={36}
            x2={32}
            y2={36}
            stroke={COLORS.techBlue}
            strokeWidth={1.5}
          />
        </svg>
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 28,
            color: COLORS.techBlue,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          Weaves patterns
        </span>
      </div>
    </div>
  );
};

// ── Scene4_LovelaceQuote ──
export const Scene4_LovelaceQuote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={195}
      fadeOutDuration={15}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 120,
          gap: 32,
        }}
      >
        {/* Historical Panel: 1843 + Ada Lovelace */}
        <div style={{ padding: '0 54px' }}>
          <HistoricalPanel year="1843" startFrame={BEATS.YEAR_BADGE_IN}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 48,
                  color: COLORS.historyGold,
                }}
              >
                Ada Lovelace
              </div>
            </div>
          </HistoricalPanel>
        </div>

        {/* Quote */}
        <div style={{ marginTop: 24 }}>
          <QuoteBlock frame={frame} fps={fps} />
        </div>

        {/* Loom vs Computer split */}
        <div style={{ marginTop: 24 }}>
          <LoomVsComputer frame={frame} fps={fps} />
        </div>
      </div>
    </SceneContainer>
  );
};
