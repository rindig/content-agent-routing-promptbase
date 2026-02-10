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

// ── Frame markers (relative to scene start) ──
const BEATS = {
  ELEMENTS_FADE: 0,
  PAUSE: 20,
  LINE_1_IN: 40,
  LINE_2_IN: 80,
  PAUSE_2: 120,
  LINE_3_IN: 140,
  LINE_4_IN: 170,
  HOLD_START: 220,
  GLOW_IN: 220,
  SCENE_END: 300,
};

// ── Closing line data ──
interface ClosingLine {
  text: string;
  color: string;
  beatFrame: number;
  useShiny?: boolean;
  useBlur?: boolean;
}

const CLOSING_LINES: ClosingLine[] = [
  {
    text: 'The signal we trusted most',
    color: COLORS.textPrimary,
    beatFrame: BEATS.LINE_1_IN,
    useBlur: true,
  },
  {
    text: 'is the easiest one to fake.',
    color: COLORS.errorRed,
    beatFrame: BEATS.LINE_2_IN,
    useBlur: true,
  },
  {
    text: "That's not a reason to panic.",
    color: COLORS.textBody,
    beatFrame: BEATS.LINE_3_IN,
  },
  {
    text: "It's a reason to understand.",
    color: COLORS.insightOrange,
    beatFrame: BEATS.LINE_4_IN,
    useShiny: true,
  },
];

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Radial glow
  const glowOpacity = frame >= BEATS.GLOW_IN
    ? interpolate(frame - BEATS.GLOW_IN, [0, 30], [0, 0.04], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <SceneContainer background="dark">
      {/* Radial glow behind text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1000,
          height: 1000,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.insightOrange} 0%, transparent 70%)`,
          opacity: glowOpacity,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {CLOSING_LINES.map((line, i) => {
          if (frame < line.beatFrame) return null;

          // Line 3 uses slow spring entrance (gentle contrast with urgency)
          if (i === 2) {
            const lineProgress = spring({
              frame: frame - line.beatFrame,
              fps,
              config: SPRING_CONFIGS.slow,
            });
            const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);
            const lineY = interpolate(lineProgress, [0, 1], [20, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${lineY}px)`,
                  textAlign: 'center',
                  maxWidth: 860,
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.closingText,
                    fontSize: 44,
                    color: line.color,
                  }}
                >
                  {line.text}
                </span>
              </div>
            );
          }

          // Line 4 uses ShinyText
          if (line.useShiny) {
            const lineProgress = spring({
              frame: frame - line.beatFrame,
              fps,
              config: SPRING_CONFIGS.gentle,
            });
            const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);
            const lineY = interpolate(lineProgress, [0, 1], [20, 0]);

            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  transform: `translateY(${lineY}px)`,
                  textAlign: 'center',
                  maxWidth: 860,
                }}
              >
                <ShinyText
                  startFrame={line.beatFrame}
                  color={line.color}
                  shineColor="#FFFFFF"
                  duration={90}
                  pauseDuration={120}
                  fontSize={44}
                  fontWeight={600}
                >
                  {line.text}
                </ShinyText>
              </div>
            );
          }

          // Lines 1 and 2 use BlurText
          if (line.useBlur) {
            return (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  maxWidth: 860,
                }}
              >
                <BlurText
                  startFrame={line.beatFrame}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={4}
                  blurAmount={8}
                  distance={20}
                  fontSize={44}
                  fontWeight={600}
                  color={line.color}
                >
                  {line.text}
                </BlurText>
              </div>
            );
          }

          return null;
        })}
      </div>
    </SceneContainer>
  );
};
