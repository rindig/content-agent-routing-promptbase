import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type Blank = {
  id: string;
  type: string;           // "adjective", "noun", "verb", etc.
  filledWord?: string;    // Word to fill in
  fillAtFrame?: number;   // When to animate fill
};

type MadLibsPageProps = {
  /** Template with blanks marked as {id} */
  template: string;
  /** Blank definitions */
  blanks: Blank[];
  /** Overall page opacity */
  opacity?: number;
  /** Scale of the page */
  scale?: number;
  /** Show paper texture */
  showTexture?: boolean;
  /** Custom style overrides */
  style?: React.CSSProperties;
};

const BlankSlot: React.FC<{
  blank: Blank;
  frame: number;
  fps: number;
}> = ({ blank, frame, fps }) => {
  const isFilling = blank.fillAtFrame !== undefined && frame >= blank.fillAtFrame;
  const isFilled = blank.filledWord && isFilling;

  // Drop animation for the word
  const dropProgress = isFilling
    ? spring({
        frame: frame - (blank.fillAtFrame || 0),
        fps,
        config: SPRING_CONFIGS.drop,
      })
    : 0;

  const wordY = interpolate(dropProgress, [0, 1], [-40, 0]);
  const wordScale = interpolate(dropProgress, [0, 1], [1.2, 1]);
  const wordOpacity = interpolate(dropProgress, [0, 0.3, 1], [0, 1, 1]);

  // Highlight flash when word lands
  const highlightOpacity = interpolate(
    dropProgress,
    [0.7, 0.85, 1],
    [0, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        minWidth: 120,
        textAlign: 'center',
        marginLeft: 4,
        marginRight: 4,
      }}
    >
      {/* Highlight flash */}
      <span
        style={{
          position: 'absolute',
          top: -4,
          left: -8,
          right: -8,
          bottom: -4,
          backgroundColor: COLORS.madLibsBlank,
          borderRadius: 4,
          opacity: highlightOpacity,
        }}
      />

      {/* The word or blank line */}
      <span
        style={{
          position: 'relative',
          display: 'inline-block',
          borderBottom: `3px solid ${COLORS.madLibsLine}`,
          minWidth: 100,
          paddingBottom: 2,
        }}
      >
        {isFilled ? (
          <span
            style={{
              display: 'inline-block',
              transform: `translateY(${wordY}px) scale(${wordScale})`,
              opacity: wordOpacity,
              fontWeight: 600,
              color: COLORS.madLibsText,
            }}
          >
            {blank.filledWord}
          </span>
        ) : (
          <span style={{ visibility: 'hidden' }}>____</span>
        )}
      </span>

      {/* Type label below */}
      <span
        style={{
          display: 'block',
          fontSize: 14,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: '#6b7280',
          marginTop: 4,
          fontStyle: 'italic',
        }}
      >
        ({blank.type})
      </span>
    </span>
  );
};

export const MadLibsPage: React.FC<MadLibsPageProps> = ({
  template,
  blanks,
  opacity = 1,
  scale = 1,
  showTexture = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Parse template and create elements
  const renderTemplate = () => {
    const blankMap = new Map(blanks.map(b => [b.id, b]));
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\{(\w+)\}/g;
    let match;

    while ((match = regex.exec(template)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {template.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add the blank slot
      const blankId = match[1];
      const blank = blankMap.get(blankId);
      if (blank) {
        parts.push(
          <BlankSlot
            key={`blank-${blankId}`}
            blank={blank}
            frame={frame}
            fps={fps}
          />
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < template.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {template.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: COLORS.madLibsPaper,
        borderRadius: 8,
        padding: '60px 80px',
        maxWidth: 900,
        margin: '0 auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {/* Paper texture overlay */}
      {showTexture && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 8,
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.03) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Title area */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 40,
          borderBottom: `2px solid ${COLORS.madLibsLine}`,
          paddingBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontFamily: TYPOGRAPHY.handwritten.fontFamily,
            fontWeight: 700,
            color: COLORS.madLibsText,
            letterSpacing: 2,
          }}
        >
          MAD LIBS
        </div>
        <div
          style={{
            fontSize: 18,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: '#6b7280',
            marginTop: 8,
          }}
        >
          The Game That Makes Sense of Nonsense
        </div>
      </div>

      {/* Template content */}
      <div
        style={{
          fontSize: 32,
          fontFamily: TYPOGRAPHY.handwritten.fontFamily,
          color: COLORS.madLibsText,
          lineHeight: 2.4,
          textAlign: 'left',
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};

export default MadLibsPage;
