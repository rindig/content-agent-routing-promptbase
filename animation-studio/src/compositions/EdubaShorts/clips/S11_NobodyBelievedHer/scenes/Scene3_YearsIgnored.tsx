import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchBurst, CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 3: Three Years of Doubt
 * Duration: 240 frames (8 seconds)
 *
 * Quote card "Computers can only do arithmetic" → CountUp 0-1095 days →
 * Three year bars (1952-1954) → Rejection "X" stamp with GlitchBurst.
 */

const BEATS = {
  DIAGRAM_SHRINK: 0,
  QUOTE_IN: 15,
  COUNTER_LABEL: 30,
  COUNTUP_START: 35,
  COUNTUP_DURATION: 50,
  YEAR_BARS_IN: 80,
  YEAR_STAGGER: 5,
  REJECTION_STAMP: 120,
  HOLD: 180,
};

const YEAR_DATA = [
  { year: '1952', opacity: 0.3 },
  { year: '1953', opacity: 0.4 },
  { year: '1954', opacity: 0.5 },
];

// Mini compiler diagram at top (shrunk representation from Scene 2)
const MiniCompilerDiagram: React.FC<{
  rejected: boolean;
  rejectionProgress: number;
}> = ({ rejected, rejectionProgress }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        position: 'relative',
      }}
    >
      {/* Input box */}
      <div
        style={{
          width: 280,
          height: 36,
          borderRadius: 6,
          backgroundColor: 'rgba(201,162,39,0.1)',
          border: `1px solid ${COLORS.historyGold}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ ...TYPOGRAPHY.code, fontSize: 16, color: COLORS.historyGold }}>
          HUMAN CODE
        </span>
      </div>

      {/* Arrow */}
      <svg width={2} height={16}>
        <line x1={1} y1={0} x2={1} y2={16} stroke={COLORS.historyGold} strokeWidth={1.5} />
      </svg>

      {/* Output box */}
      <div
        style={{
          width: 280,
          height: 36,
          borderRadius: 6,
          backgroundColor: 'rgba(59,130,246,0.1)',
          border: `1px solid ${COLORS.techBlue}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ ...TYPOGRAPHY.code, fontSize: 16, color: COLORS.techBlue }}>
          MACHINE CODE
        </span>
      </div>

      {/* Rejection X stamp */}
      {rejected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              transform: `scale(${interpolate(rejectionProgress, [0, 1], [2, 1])}) rotate(-5deg)`,
              opacity: rejectionProgress,
            }}
          >
            <GlitchBurst
              startFrame={BEATS.REJECTION_STAMP}
              burstInterval={60}
              burstDuration={8}
              fontSize={60}
              color={COLORS.errorRed}
              fontWeight={900}
              backgroundColor="transparent"
            >
              X
            </GlitchBurst>
          </div>
        </div>
      )}
    </div>
  );
};

// Year bar showing no adoption
const YearBar: React.FC<{
  year: string;
  barOpacity: number;
  startFrame: number;
}> = ({ year, barOpacity, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const entrance = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const translateX = interpolate(entrance, [0, 1], [-100, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity,
        transform: `translateX(${translateX}px)`,
        width: '100%',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.textMuted,
          width: 60,
          textAlign: 'right',
        }}
      >
        {year}
      </span>
      <div
        style={{
          flex: 1,
          height: 40,
          borderRadius: 6,
          backgroundColor: COLORS.errorRed,
          opacity: barOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 12,
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 20,
            color: COLORS.textMuted,
            textTransform: 'none',
            letterSpacing: 0,
          }}
        >
          No adoption
        </span>
      </div>
    </div>
  );
};

export const Scene3_YearsIgnored: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Diagram shrink animation
  const diagramScale = interpolate(
    frame,
    [BEATS.DIAGRAM_SHRINK, BEATS.DIAGRAM_SHRINK + 20],
    [1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Quote entrance
  const quoteProgress = spring({
    frame: frame - BEATS.QUOTE_IN,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const quoteOpacity = interpolate(quoteProgress, [0, 1], [0, 1]);
  const quoteY = interpolate(quoteProgress, [0, 1], [30, 0]);

  // Counter label
  const counterLabelOpacity = interpolate(
    frame,
    [BEATS.COUNTER_LABEL, BEATS.COUNTER_LABEL + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bars + counter dim after rejection stamp
  const barsDimOpacity = interpolate(
    frame,
    [BEATS.REJECTION_STAMP - 5, BEATS.REJECTION_STAMP + 5],
    [1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Rejection stamp
  const isRejected = frame >= BEATS.REJECTION_STAMP;
  const rejectionProgress = spring({
    frame: frame - BEATS.REJECTION_STAMP,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Hold fade
  const holdOpacity = interpolate(
    frame,
    [BEATS.HOLD, BEATS.HOLD + 20],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={230}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          gap: 20,
          opacity: holdOpacity,
          paddingTop: LAYOUT.platformTopSafe + LAYOUT.safeMarginY,
        }}
      >
        {/* Mini compiler diagram at top */}
        <div style={{ transform: `scale(${diagramScale})`, transformOrigin: 'center top' }}>
          <MiniCompilerDiagram
            rejected={isRejected}
            rejectionProgress={rejectionProgress}
          />
        </div>

        {/* Quote Card */}
        {frame >= BEATS.QUOTE_IN && (
          <div
            style={{
              backgroundColor: 'rgba(201,162,39,0.05)',
              borderLeft: `3px solid ${COLORS.historyGold}`,
              borderRadius: 8,
              padding: '20px 24px',
              maxWidth: 860,
              width: '100%',
              opacity: quoteOpacity,
              transform: `translateY(${quoteY}px)`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.quote,
                fontSize: 44,
                color: COLORS.historyGold,
              }}
            >
              &ldquo;Computers can only do arithmetic.&rdquo;
            </span>
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.textMuted,
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                -- Every expert, 1952-1955
              </span>
            </div>
          </div>
        )}

        {/* Days Ignored Counter */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: barsDimOpacity,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.textMuted,
              opacity: counterLabelOpacity,
            }}
          >
            DAYS IGNORED
          </span>
          {frame >= BEATS.COUNTUP_START && (
            <CountUp
              to={1095}
              from={0}
              startFrame={BEATS.COUNTUP_START}
              duration={BEATS.COUNTUP_DURATION}
              separator=","
              color={COLORS.historyGold}
              fontSize={56}
              fontWeight={700}
            />
          )}
        </div>

        {/* Year Bars */}
        <div
          style={{
            width: '100%',
            maxWidth: 700,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            opacity: barsDimOpacity,
          }}
        >
          {YEAR_DATA.map((data, i) => (
            <YearBar
              key={data.year}
              year={data.year}
              barOpacity={data.opacity}
              startFrame={BEATS.YEAR_BARS_IN + i * BEATS.YEAR_STAGGER}
            />
          ))}
        </div>
      </div>
    </SceneContainer>
  );
};
