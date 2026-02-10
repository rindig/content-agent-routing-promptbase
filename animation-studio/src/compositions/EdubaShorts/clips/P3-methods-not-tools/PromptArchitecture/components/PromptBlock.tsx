import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';

const SECTIONS = [
  { label: 'CONTEXT', color: COLORS.techBlue },
  { label: 'TASK', color: COLORS.insightOrange },
  { label: 'FORMAT', color: COLORS.solutionGreen },
  { label: 'EXAMPLES', color: COLORS.aiPurple },
];

const MESSY_TEXT =
  'Write me something about machine learning that covers the basics and is formatted nicely with examples and make sure to include context about who this is for and what the output should look like please be specific';

const SECTION_BODIES = [
  'You are a technical writer for developers new to ML.',
  'Write a beginner-friendly guide to supervised learning.',
  'Use H2 headings, bullet points, code snippets.',
  'Good: concise with code. Bad: walls of text.',
];

interface PromptBlockProps {
  mode: 'messy' | 'structured';
  width: number;
  height: number;
  x: number;
  y: number;
  startFrame: number;
  springPreset?: 'snappy' | 'gentle' | 'bouncy';
  highlightSection?: number;
}

export const PromptBlock: React.FC<PromptBlockProps> = ({
  mode,
  width,
  height,
  x,
  y,
  startFrame,
  springPreset = 'snappy',
  highlightSection,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entranceProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS[springPreset],
  });

  const opacity = frame >= startFrame ? interpolate(entranceProgress, [0, 1], [0, 1]) : 0;
  const scale = frame >= startFrame ? interpolate(entranceProgress, [0, 1], [0.95, 1]) : 0.95;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        border: `2px solid ${COLORS.bgSurfaceAlt}`,
        opacity,
        transform: `scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      {/* Terminal dots */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '12px 16px',
          alignItems: 'center',
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.errorRed }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.insightOrange }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS.solutionGreen }} />
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontWeight: 500,
            fontSize: 20,
            color: COLORS.textDim,
          }}
        >
          prompt.txt
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '8px 24px 24px' }}>
        {mode === 'messy' ? (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 1.5,
                color: COLORS.textMuted,
              }}
            >
              {MESSY_TEXT}
            </div>
            {/* Faint red tint */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: COLORS.errorRed,
                opacity: 0.03,
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SECTIONS.map((section, i) => {
              const sectionIndex = i + 1;
              const isHighlighted = highlightSection === sectionIndex;
              const isDimmed = highlightSection !== undefined && !isHighlighted;
              return (
                <div
                  key={section.label}
                  style={{
                    borderLeft: `4px solid ${section.color}`,
                    paddingLeft: 12,
                    opacity: isDimmed ? 0.4 : 1,
                    boxShadow: isHighlighted
                      ? `0 0 12px ${section.color}66`
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontWeight: 600,
                      fontSize: 22,
                      color: section.color,
                      marginBottom: 4,
                    }}
                  >
                    {section.label}
                  </div>
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontWeight: 400,
                      fontSize: 22,
                      color: COLORS.textBody,
                      lineHeight: 1.4,
                    }}
                  >
                    {SECTION_BODIES[i]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
