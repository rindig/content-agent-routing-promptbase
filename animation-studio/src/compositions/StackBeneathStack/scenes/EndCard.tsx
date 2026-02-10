import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * SCENE 16: END CARD
 * Duration: 15 seconds (450 frames)
 *
 * The Python code one final time, with a poetic closing line.
 *
 * Animation Sequence:
 * | Frames  | Action |
 * |---------|--------|
 * | 0-60    | Fade in from black |
 * | 60-120  | Python code appears, centered |
 * | 120-240 | Closing text fades in below |
 * | 240-390 | Hold |
 * | 390-450 | Fade to black |
 */

// Timeline markers
const FADE_IN = 0;
const CODE_APPEAR = 60;
const CLOSING_TEXT = 120;
const HOLD = 240;
const FADE_OUT = 390;

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overall fade in/out
  const fadeIn = interpolate(frame, [FADE_IN, FADE_IN + 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [FADE_OUT, 450], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  const masterOpacity = fadeIn * fadeOut;

  // Code entrance
  const codeProgress = spring({
    frame: Math.max(0, frame - CODE_APPEAR),
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const codeOpacity = frame >= CODE_APPEAR ? interpolate(codeProgress, [0, 1], [0, 1]) : 0;

  // Closing text entrance
  const closingProgress = spring({
    frame: Math.max(0, frame - CLOSING_TEXT),
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const closingOpacity = frame >= CLOSING_TEXT ? interpolate(closingProgress, [0, 1], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: masterOpacity,
        }}
      >
        {/* Python code */}
        <div
          style={{
            opacity: codeOpacity,
            marginBottom: 60,
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.surface,
              padding: '20px 40px',
              borderRadius: 12,
              border: `1px solid ${COLORS.surfaceAlt}`,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 28,
            }}
          >
            <span style={{ color: COLORS.syntaxFunction }}>print</span>
            <span style={{ color: COLORS.text }}>(</span>
            <span style={{ color: COLORS.syntaxString }}>"Hello, World!"</span>
            <span style={{ color: COLORS.text }}>)</span>
          </div>
        </div>

        {/* Closing text */}
        <div
          style={{
            opacity: closingOpacity,
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.quote.fontFamily,
              fontStyle: 'italic',
              fontSize: 24,
              color: COLORS.text,
              lineHeight: 1.6,
            }}
          >
            Built on the shoulders of every engineer
            <br />
            who ever taped a moth into a logbook.
          </div>
        </div>

        {/* Subtle decorative line */}
        <div
          style={{
            marginTop: 60,
            width: interpolate(closingOpacity, [0, 1], [0, 200]),
            height: 2,
            backgroundColor: COLORS.warmAccent,
            opacity: closingOpacity * 0.5,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
