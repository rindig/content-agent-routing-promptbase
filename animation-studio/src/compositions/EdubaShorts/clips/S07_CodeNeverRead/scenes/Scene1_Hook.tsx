import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { CountUp } from '../../../../../components/core/effects';

const BEATS = {
  PANEL_IN: 0,
  TYPING_IMPORT: 10,
  TYPING_LINE_2: 35,
  LABEL_IN: 50,
  COUNTUP_START: 65,
};

/** Typewriter text — renders progressively based on frame */
const TypewriterCode: React.FC<{
  text: string;
  startFrame: number;
  charDelay: number;
  colorMap: { range: [number, number]; color: string }[];
  fontSize: number;
}> = ({ text, startFrame, charDelay, colorMap, fontSize }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const charsVisible = Math.min(
    Math.floor(relativeFrame / charDelay),
    text.length
  );

  const visibleText = text.slice(0, charsVisible);

  // Build colored spans
  const elements: JSX.Element[] = [];
  let pos = 0;
  for (const char of visibleText) {
    let color = COLORS.textBody;
    for (const cm of colorMap) {
      if (pos >= cm.range[0] && pos < cm.range[1]) {
        color = cm.color;
        break;
      }
    }
    elements.push(
      <span key={pos} style={{ color }}>
        {char}
      </span>
    );
    pos++;
  }

  // Blinking cursor
  const cursorOpacity = Math.sin(frame * 0.42) > 0 ? 1 : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize,
          display: 'inline',
        }}
      >
        {elements}
      </span>
      <span
        style={{
          width: 2,
          height: fontSize + 4,
          backgroundColor: COLORS.textBody,
          opacity: cursorOpacity,
          marginLeft: 2,
          display: 'inline-block',
        }}
      />
    </div>
  );
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Panel entrance spring
  const panelProgress = spring({
    frame: frame - BEATS.PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelScale = interpolate(panelProgress, [0, 1], [0.96, 1]);
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

  // Label entrance
  const labelProgress = spring({
    frame: frame - BEATS.LABEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const labelY = interpolate(labelProgress, [0, 1], [20, 0]);
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Blue glow on code panel after COUNTUP_START
  const glowProgress = spring({
    frame: frame - BEATS.COUNTUP_START,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const glowOpacity = interpolate(glowProgress, [0, 1], [0, 0.2]);

  // Line 1: "import pandas as pd"
  const line1 = 'import pandas as pd';
  const line1Colors = [
    { range: [0, 6] as [number, number], color: COLORS.aiPurple },   // "import"
    { range: [7, 13] as [number, number], color: COLORS.techBlue },  // "pandas"
    { range: [14, 16] as [number, number], color: COLORS.aiPurple }, // "as"
    { range: [17, 19] as [number, number], color: COLORS.textBody }, // "pd"
  ];

  // Line 2: 'df = pd.read_csv("data.csv")'
  const line2 = 'df = pd.read_csv("data.csv")';
  const line2Colors = [
    { range: [0, 2] as [number, number], color: COLORS.textBody },    // "df"
    { range: [3, 4] as [number, number], color: COLORS.textMuted },   // "="
    { range: [5, 7] as [number, number], color: COLORS.textBody },    // "pd"
    { range: [7, 8] as [number, number], color: COLORS.textMuted },   // "."
    { range: [8, 16] as [number, number], color: COLORS.techBlue },   // "read_csv"
    { range: [16, 17] as [number, number], color: COLORS.textMuted }, // "("
    { range: [17, 27] as [number, number], color: COLORS.solutionGreen }, // '"data.csv"'
    { range: [27, 28] as [number, number], color: COLORS.textMuted }, // ")"
  ];

  // Label text transitions
  const isCountingUp = frame >= BEATS.COUNTUP_START;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 32,
        }}
      >
        {/* Code Panel */}
        <div
          style={{
            backgroundColor: COLORS.codeBg,
            borderRadius: 12,
            padding: 32,
            width: 860,
            maxWidth: '100%',
            opacity: panelOpacity,
            transform: `scale(${panelScale})`,
            boxShadow: `0 0 20px rgba(59,130,246,${glowOpacity})`,
            border: `1px solid ${COLORS.panelBorder}`,
          }}
        >
          {/* Terminal dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#EF4444',
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#10B981',
              }}
            />
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 24,
                color: COLORS.textMuted,
                marginLeft: 12,
              }}
            >
              main.py
            </span>
          </div>

          {/* Code lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <TypewriterCode
              text={line1}
              startFrame={BEATS.TYPING_IMPORT}
              charDelay={2}
              colorMap={line1Colors}
              fontSize={36}
            />
            <TypewriterCode
              text={line2}
              startFrame={BEATS.TYPING_LINE_2}
              charDelay={2}
              colorMap={line2Colors}
              fontSize={36}
            />
          </div>
        </div>

        {/* Label + CountUp below code panel */}
        {frame >= BEATS.LABEL_IN && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
            }}
          >
            {isCountingUp ? (
              <CountUp
                from={2}
                to={300000}
                startFrame={BEATS.COUNTUP_START}
                duration={25}
                color={COLORS.techBlue}
                fontSize={48}
                fontWeight={700}
              />
            ) : (
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 48,
                  color: COLORS.textBody,
                  fontWeight: 700,
                }}
              >
                2
              </span>
            )}
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.textMuted,
              }}
            >
              {isCountingUp
                ? 'LINES RUNNING UNDER THE HOOD'
                : 'LINES OF CODE'}
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
