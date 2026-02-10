import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

type QuoteCardProps = {
  quote: string;
  attribution: string;
  startFrame?: number;
  /** Word-by-word reveal delay */
  wordDelay?: number;
  accentColor?: string;
  style?: React.CSSProperties;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution,
  startFrame = 0,
  wordDelay = 4,
  accentColor = COLORS.accent,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
  const cardScale = interpolate(cardProgress, [0, 1], [0.95, 1]);

  // Quote words
  const words = quote.split(' ');
  const quoteStartFrame = startFrame + 30; // After card appears

  // Attribution appears after quote
  const attributionStartFrame = quoteStartFrame + words.length * wordDelay + 30;
  const attributionProgress = spring({
    frame: frame - attributionStartFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        padding: 60,
        maxWidth: 1100,
        ...style,
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontSize: 180,
          fontFamily: TYPOGRAPHY.quote.fontFamily,
          color: accentColor,
          opacity: 0.3,
          lineHeight: 0.5,
          marginBottom: 20,
          marginLeft: -20,
        }}
      >
        "
      </div>

      {/* Quote text - word by word */}
      <div
        style={{
          fontSize: 52,
          fontFamily: TYPOGRAPHY.quote.fontFamily,
          fontStyle: 'italic',
          color: COLORS.textPrimary,
          lineHeight: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25em',
          marginBottom: 40,
        }}
      >
        {words.map((word, i) => {
          const wordStart = quoteStartFrame + i * wordDelay;
          const wordProgress = spring({
            frame: frame - wordStart,
            fps,
            config: { damping: 25, stiffness: 200, mass: 0.7 },
          });

          const opacity = interpolate(wordProgress, [0, 1], [0, 1]);
          const y = interpolate(wordProgress, [0, 1], [15, 0]);

          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Closing quote mark */}
      <div
        style={{
          fontSize: 180,
          fontFamily: TYPOGRAPHY.quote.fontFamily,
          color: accentColor,
          opacity: 0.3,
          lineHeight: 0.5,
          textAlign: 'right',
          marginTop: -60,
          marginRight: -20,
        }}
      >
        "
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: interpolate(attributionProgress, [0, 1], [0, 200]),
          height: 3,
          backgroundColor: accentColor,
          marginTop: 30,
          marginBottom: 20,
          borderRadius: 2,
        }}
      />

      {/* Attribution */}
      <div
        style={{
          opacity: interpolate(attributionProgress, [0, 1], [0, 1]),
          transform: `translateX(${interpolate(attributionProgress, [0, 1], [-20, 0])}px)`,
          fontSize: 32,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: accentColor,
          letterSpacing: '0.02em',
        }}
      >
        — {attribution}
      </div>
    </div>
  );
};

/**
 * Stylized tribute panel for Grace Hopper (no photo required)
 */
type HopperTributeProps = {
  startFrame?: number;
  style?: React.CSSProperties;
};

export const HopperTribute: React.FC<HopperTributeProps> = ({
  startFrame = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns-like slow zoom
  const zoomProgress = interpolate(
    frame - startFrame,
    [0, 300],
    [1, 1.05],
    { extrapolateRight: 'clamp' }
  );

  // Card entrance
  const cardProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const opacity = interpolate(cardProgress, [0, 1], [0, 1]);

  // Name reveal
  const nameProgress = spring({
    frame: frame - startFrame - 30,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Title reveal
  const titleProgress = spring({
    frame: frame - startFrame - 60,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Years reveal
  const yearsProgress = spring({
    frame: frame - startFrame - 90,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${zoomProgress})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      {/* Ornamental frame */}
      <div
        style={{
          position: 'relative',
          padding: 8,
          background: `linear-gradient(135deg, #c9a227 0%, #f4d03f 25%, #c9a227 50%, #f4d03f 75%, #c9a227 100%)`,
          borderRadius: 8,
        }}
      >
        {/* Inner frame */}
        <div
          style={{
            backgroundColor: '#0f0f18',
            padding: 50,
            borderRadius: 4,
            border: '2px solid #c9a22750',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 500,
          }}
        >
          {/* Stylized portrait placeholder - geometric pattern */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%, #3b82f640 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, #8b5cf640 0%, transparent 50%),
                linear-gradient(135deg, #1a1a2e 0%, #2a2a4a 100%)
              `,
              border: '4px solid #c9a227',
              marginBottom: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Abstract naval insignia inspired pattern */}
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ opacity: 0.6 }}>
              <defs>
                <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c9a227" />
                  <stop offset="100%" stopColor="#f4d03f" />
                </linearGradient>
              </defs>
              {/* Star pattern */}
              <polygon
                points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40"
                fill="url(#gold-grad)"
                opacity="0.8"
              />
              {/* Inner circle */}
              <circle cx="50" cy="50" r="20" fill="none" stroke="#c9a227" strokeWidth="2" />
            </svg>
          </div>

          {/* Name */}
          <div
            style={{
              opacity: interpolate(nameProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(nameProgress, [0, 1], [10, 0])}px)`,
              fontSize: 48,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 700,
              color: '#f4d03f',
              letterSpacing: '0.05em',
              marginBottom: 8,
            }}
          >
            GRACE HOPPER
          </div>

          {/* Title */}
          <div
            style={{
              opacity: interpolate(titleProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(titleProgress, [0, 1], [10, 0])}px)`,
              fontSize: 24,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 500,
              color: COLORS.textMuted,
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}
          >
            REAR ADMIRAL, U.S. NAVY
          </div>

          {/* Years */}
          <div
            style={{
              opacity: interpolate(yearsProgress, [0, 1], [0, 1]),
              fontSize: 20,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              color: COLORS.accent,
              letterSpacing: '0.15em',
            }}
          >
            1906 — 1992
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: interpolate(yearsProgress, [0, 1], [0, 1]),
          marginTop: 30,
          fontSize: 28,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          color: COLORS.textMuted,
          fontStyle: 'italic',
        }}
      >
        Pioneer of Computer Programming
      </div>
    </div>
  );
};

export default QuoteCard;
