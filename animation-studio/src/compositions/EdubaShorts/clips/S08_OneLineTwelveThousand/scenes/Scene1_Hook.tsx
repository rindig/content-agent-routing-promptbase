import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  PANEL_IN: 0,
  TYPING: 10,
  COUNTER_SPIN: 40,
  COUNTER_LAND: 55,
  LAYERS_HINT: 75,
};

// Characters for the typewriter
const CODE_TEXT = 'print("Hello, World!")';

// Syntax segments for coloring
const SYNTAX_SEGMENTS: Array<{ text: string; color: string }> = [
  { text: 'print', color: COLORS.techBlue },
  { text: '(', color: COLORS.textMuted },
  { text: '"Hello, World!"', color: COLORS.solutionGreen },
  { text: ')', color: COLORS.textMuted },
];

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

  // Typewriter: 2 frames per character
  const typingFrame = frame - BEATS.TYPING;
  const charsVisible = typingFrame > 0 ? Math.floor(typingFrame / 2) : 0;
  const cursorVisible = frame >= BEATS.TYPING && Math.floor(frame / 15) % 2 === 0;

  // Build the typed text with syntax coloring
  const renderTypedCode = () => {
    let charCount = 0;
    const elements: React.ReactNode[] = [];

    for (let s = 0; s < SYNTAX_SEGMENTS.length; s++) {
      const segment = SYNTAX_SEGMENTS[s];
      const segmentChars: string[] = [];

      for (let c = 0; c < segment.text.length; c++) {
        if (charCount < charsVisible) {
          segmentChars.push(segment.text[c]);
        }
        charCount++;
      }

      if (segmentChars.length > 0) {
        elements.push(
          <span key={s} style={{ color: segment.color }}>
            {segmentChars.join('')}
          </span>
        );
      }
    }

    return elements;
  };

  // Counter visibility
  const counterVisible = frame >= BEATS.COUNTER_SPIN;

  // Counter entrance spring
  const counterProgress = spring({
    frame: frame - BEATS.COUNTER_SPIN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const counterOpacity = interpolate(counterProgress, [0, 1], [0, 1]);
  const counterScale = interpolate(counterProgress, [0, 1], [0.9, 1]);

  // "across 7 layers" text
  const layersTextProgress = spring({
    frame: frame - BEATS.COUNTER_LAND,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const layersY = interpolate(layersTextProgress, [0, 1], [20, 0]);
  const layersOpacity = interpolate(layersTextProgress, [0, 1], [0, 1]);

  // Downward chevron pulse
  const chevronVisible = frame >= BEATS.LAYERS_HINT;
  const chevronCycle = (frame - BEATS.LAYERS_HINT) % 8;
  const chevronOpacity = chevronVisible
    ? interpolate(chevronCycle, [0, 4, 7], [0.2, 0.6, 0.2])
    : 0;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
    >
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
            width: 860,
            maxWidth: '100%',
            backgroundColor: COLORS.codeBg,
            borderRadius: 12,
            padding: '24px 32px',
            opacity: panelOpacity,
            transform: `scale(${panelScale})`,
            border: `1px solid ${COLORS.panelBorder}`,
          }}
        >
          {/* Terminal dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>

          {/* Typed code */}
          <div
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 40,
              color: COLORS.codeText,
              minHeight: 56,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {renderTypedCode()}
            {cursorVisible && (
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 44,
                  backgroundColor: COLORS.textPrimary,
                  marginLeft: 2,
                }}
              />
            )}
          </div>
        </div>

        {/* Counter section */}
        {counterVisible && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              opacity: counterOpacity,
              transform: `scale(${counterScale})`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.hero,
                  fontSize: 48,
                  color: COLORS.textMuted,
                }}
              >
                ~
              </span>
              <CountUp
                to={12000}
                from={1}
                startFrame={BEATS.COUNTER_SPIN}
                duration={15}
                separator=","
                decimals={0}
                useSpring
                color={COLORS.techBlue}
                fontSize={72}
              />
            </div>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.textMuted,
              }}
            >
              lines
            </span>
          </div>
        )}

        {/* "across 7 layers" */}
        {frame >= BEATS.COUNTER_LAND && (
          <div
            style={{
              opacity: layersOpacity,
              transform: `translateY(${layersY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.title.fontFamily,
                fontWeight: 500,
                fontSize: 36,
                color: COLORS.insightOrange,
              }}
            >
              across 7 layers
            </span>
          </div>
        )}

        {/* Pulsing downward chevron */}
        {chevronVisible && (
          <svg
            width={32}
            height={20}
            viewBox="0 0 32 20"
            style={{ opacity: chevronOpacity }}
          >
            <polyline
              points="4,4 16,16 28,4"
              fill="none"
              stroke={COLORS.textMuted}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </SceneContainer>
  );
};
