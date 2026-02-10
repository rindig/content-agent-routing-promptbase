import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { HistoricalPanel } from '../../../components';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  YEAR_BADGE_IN: 0,
  TITLE_IN: 5,
  CARD_BUILD: 30,
  TEMPLATE_LINES_START: 40,
  LINE_STAGGER: 8,
  FILL_START: 110,
  FILL_STAGGER: 8,
  BRACKETS_IN: 160,
};

// ── Template data ──
interface TemplateLine {
  prefix: string;
  blankType: string;
  suffix: string;
  fillWord: string;
}

const TEMPLATE_LINES: TemplateLine[] = [
  { prefix: 'The ', blankType: 'ADJECTIVE', suffix: ' explorer', fillWord: 'fearless' },
  { prefix: 'sailed to ', blankType: 'PLACE', suffix: '', fillWord: 'Mars' },
  { prefix: 'and found a ', blankType: 'NOUN', suffix: '', fillWord: 'algorithm' },
  { prefix: 'that could ', blankType: 'VERB', suffix: ' forever.', fillWord: 'compute' },
];

// ── Blank slot component ──
const BlankSlot: React.FC<{
  blankType: string;
  fillWord: string;
  isFilled: boolean;
  fillProgress: number;
}> = ({ blankType, fillWord, isFilled, fillProgress }) => {
  const labelOpacity = interpolate(fillProgress, [0, 0.5], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wordScale = interpolate(fillProgress, [0, 1], [0, 1]);
  const wordOpacity = interpolate(fillProgress, [0, 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 4px', position: 'relative' }}>
      {/* Type label above */}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.insightOrange,
          opacity: labelOpacity,
          position: 'absolute',
          top: -24,
          whiteSpace: 'nowrap',
        }}
      >
        {blankType}
      </span>

      {/* Blank underline or filled word */}
      {isFilled ? (
        <span
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 40,
            color: COLORS.insightOrange,
            fontWeight: 600,
            transform: `scale(${wordScale})`,
            opacity: wordOpacity,
            display: 'inline-block',
          }}
        >
          {fillWord}
        </span>
      ) : (
        <span
          style={{
            display: 'inline-block',
            minWidth: 120,
            borderBottom: `2px dotted ${COLORS.historyGold}`,
            height: 40,
            lineHeight: '40px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.body,
              fontSize: 36,
              color: COLORS.historyGold,
              opacity: 0.5,
            }}
          >
            [{blankType}]
          </span>
        </span>
      )}
    </span>
  );
};

// ── Bracket annotation ──
const BracketLabel: React.FC<{
  label: string;
  color: string;
  side: 'left' | 'right';
  progress: number;
}> = ({ label, color, side, progress }) => {
  const x = interpolate(progress, [0, 1], [side === 'left' ? -30 : 30, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        [side]: -60,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      {/* Bracket line */}
      <div
        style={{
          width: 2,
          height: '80%',
          backgroundColor: color,
          opacity: 0.6,
          borderRadius: 1,
        }}
      />
      {/* Label */}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color,
          writingMode: 'vertical-rl' as const,
          textOrientation: 'mixed' as const,
          position: 'absolute',
          letterSpacing: 3,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Scene2_MadLibs ──
export const Scene2_MadLibs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Card build ──
  const cardRelFrame = frame - BEATS.CARD_BUILD;
  const cardProgress =
    cardRelFrame >= 0
      ? spring({ frame: cardRelFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const cardScale = interpolate(cardProgress, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // ── Bracket progress ──
  const bracketRelFrame = frame - BEATS.BRACKETS_IN;
  const bracketProgress =
    bracketRelFrame >= 0
      ? spring({ frame: bracketRelFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={200}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          paddingTop: 80,
          gap: 40,
        }}
      >
        {/* Historical panel header */}
        <HistoricalPanel year="1953" label="Mad Libs" startFrame={BEATS.YEAR_BADGE_IN}>
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 56,
              color: COLORS.historyGold,
              textAlign: 'center',
            }}
          >
            Mad Libs
          </div>
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.textMuted,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            Price & Stern
          </div>
        </HistoricalPanel>

        {/* Mad Libs card */}
        <div
          style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale})`,
            backgroundColor: 'rgba(201,162,39,0.08)',
            border: `2px solid rgba(201,162,39,0.6)`,
            borderRadius: 12,
            padding: '32px 40px',
            width: 900,
            maxWidth: '100%',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Card title */}
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 28,
              color: COLORS.historyGold,
              textAlign: 'center',
              marginBottom: 32,
              letterSpacing: 4,
            }}
          >
            THE ADVENTURE
          </div>

          {/* Template lines */}
          {TEMPLATE_LINES.map((line, i) => {
            const lineStart = BEATS.TEMPLATE_LINES_START + i * BEATS.LINE_STAGGER;
            const lineOpacity = interpolate(
              frame,
              [lineStart, lineStart + 12],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );
            const lineY = interpolate(
              frame,
              [lineStart, lineStart + 12],
              [15, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Fill timing
            const fillStart = BEATS.FILL_START + i * BEATS.FILL_STAGGER;
            const isFilled = frame >= fillStart;
            const fillProgress =
              isFilled
                ? spring({
                    frame: frame - fillStart,
                    fps,
                    config: SPRING_CONFIGS.bouncy,
                  })
                : 0;

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${lineY}px)`,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  paddingTop: 28,
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 40,
                    color: COLORS.textBody,
                  }}
                >
                  {line.prefix}
                </span>
                <BlankSlot
                  blankType={line.blankType}
                  fillWord={line.fillWord}
                  isFilled={isFilled}
                  fillProgress={fillProgress}
                />
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 40,
                    color: COLORS.textBody,
                  }}
                >
                  {line.suffix}
                </span>
              </div>
            );
          })}

          {/* Structure / Content brackets */}
          <BracketLabel
            label="STRUCTURE"
            color={COLORS.techBlue}
            side="left"
            progress={bracketProgress}
          />
          <BracketLabel
            label="CONTENT"
            color={COLORS.insightOrange}
            side="right"
            progress={bracketProgress}
          />
        </div>
      </div>
    </SceneContainer>
  );
};
