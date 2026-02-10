import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

interface CodePanelProps {
  lines: string[];
  startFrame?: number;
  highlightLines?: number[];
  highlightColor?: string;
  staggerDelay?: number;
  fontSize?: number;
  showLineNumbers?: boolean;
  maxWidth?: number;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  lines,
  startFrame = 0,
  highlightLines = [],
  highlightColor = COLORS.errorRed,
  staggerDelay = 4,
  fontSize = TYPOGRAPHY.code.fontSize,
  showLineNumbers = false,
  maxWidth,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Panel entrance
  const panelProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);
  const panelScale = interpolate(panelProgress, [0, 1], [0.97, 1]);

  return (
    <div
      style={{
        backgroundColor: COLORS.codeBg,
        borderRadius: 16,
        padding: '28px 32px',
        opacity: panelOpacity,
        transform: `scale(${panelScale})`,
        border: `1px solid ${COLORS.panelBorder}`,
        maxWidth: maxWidth || '100%',
        width: '100%',
      }}
    >
      {/* Terminal dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
      </div>

      {/* Code lines */}
      {lines.map((line, i) => {
        const lineStart = staggerDelay * i;
        const lineOpacity = interpolate(
          relativeFrame,
          [lineStart + 5, lineStart + 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const isHighlighted = highlightLines.includes(i);

        return (
          <div
            key={i}
            style={{
              opacity: lineOpacity,
              padding: '4px 8px',
              marginBottom: 4,
              borderRadius: 4,
              backgroundColor: isHighlighted
                ? `${highlightColor}15`
                : 'transparent',
              borderLeft: isHighlighted
                ? `3px solid ${highlightColor}`
                : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {showLineNumbers && (
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: fontSize - 4,
                  color: COLORS.textDim,
                  minWidth: 32,
                  textAlign: 'right',
                }}
              >
                {i + 1}
              </span>
            )}
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize,
                color: isHighlighted ? highlightColor : COLORS.codeText,
              }}
            >
              {line}
            </span>
          </div>
        );
      })}
    </div>
  );
};
