import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  STACK_COMPRESS: 0,
  LINE_1_IN: 30,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 70,
  LINE_2_STAGGER: 5,
  HOLD_START: 100,
  FINAL_PULSE: 110,
  FADE_OUT: 135,
};

// ── Layer data for compressed stack reference ──
const MINI_LAYERS = [
  { year: '1947', label: 'Debugging', color: COLORS.solutionGreen },
  { year: '1960s', label: 'Isolation', color: COLORS.solutionGreen },
  { year: '1970s', label: 'TCP/IP', color: COLORS.solutionGreen },
  { year: '1994', label: 'Validation', color: COLORS.solutionGreen },
  { year: '2024', label: 'AI', color: COLORS.aiPurple },
];

// ── Compressed Mini Stack ──
const MiniStack: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const compressProgress = spring({
    frame: frame - BEATS.STACK_COMPRESS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(compressProgress, [0, 1], [1, 0.4]);
  const translateY = interpolate(compressProgress, [0, 1], [0, -500]);
  const opacity = interpolate(compressProgress, [0, 1], [1, 0.6]);

  // Progress spinner for AI layer
  const dotCycle = Math.floor(frame / 10) % 3;

  // Final pulse for solved layers
  const isPulsing = frame >= BEATS.FINAL_PULSE;

  return (
    <div
      style={{
        position: 'absolute',
        top: 200,
        left: '50%',
        transform: `translateX(-50%) translateY(${translateY}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column-reverse',
        alignItems: 'center',
        gap: 4,
        zIndex: 1,
      }}
    >
      {MINI_LAYERS.map((layer, i) => {
        const isSolved = layer.color === COLORS.solutionGreen;
        const isAI = !isSolved;
        const barWidth = 200 + i * 20;

        // Pulse glow for solved layers during final pulse
        const pulseDelay = i * 3;
        const pulseGlow = isPulsing && isSolved
          ? interpolate(
              frame - (BEATS.FINAL_PULSE + pulseDelay),
              [0, 4, 8],
              [0, 0.5, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )
          : 0;

        return (
          <div
            key={i}
            style={{
              width: barWidth,
              height: 24,
              backgroundColor: `${layer.color}${isSolved ? '33' : '26'}`,
              border: `1px solid ${layer.color}`,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              boxShadow: pulseGlow > 0
                ? `0 0 ${12 * pulseGlow}px ${layer.color}`
                : 'none',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontFamily: TYPOGRAPHY.label.fontFamily,
                fontWeight: 500,
                color: layer.color,
              }}
            >
              {layer.year} {'\u2014'} {layer.label}
            </span>
            {isAI && (
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: COLORS.insightOrange,
                      opacity: d === dotCycle ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            )}
            {isSolved && (
              <span
                style={{
                  color: COLORS.solutionGreen,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {'\u2713'}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT}
      fadeOutDuration={15}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Compressed LayerStack at top */}
        <MiniStack frame={frame} fps={fps} />

        {/* Closing statements centered */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            padding: '96px 54px',
          }}
        >
          {/* Line 1: "The engineering isn't done." */}
          {showLine1 && (
            <BlurText
              startFrame={BEATS.LINE_1_IN}
              animateBy="words"
              staggerDelay={BEATS.LINE_1_STAGGER}
              direction="bottom"
              blurAmount={10}
              fontSize={44}
              fontWeight={600}
              color={COLORS.textPrimary}
            >
              The engineering isn't done.
            </BlurText>
          )}

          {/* Line 2: "But the pattern says it will be." */}
          {showLine2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3em' }}>
              <BlurText
                startFrame={BEATS.LINE_2_IN}
                animateBy="words"
                staggerDelay={BEATS.LINE_2_STAGGER}
                direction="bottom"
                blurAmount={8}
                fontSize={44}
                fontWeight={600}
                color={COLORS.textPrimary}
              >
                But the pattern says
              </BlurText>
              <BlurText
                startFrame={BEATS.LINE_2_IN + 4 * BEATS.LINE_2_STAGGER}
                animateBy="words"
                staggerDelay={BEATS.LINE_2_STAGGER}
                direction="bottom"
                blurAmount={8}
                fontSize={44}
                fontWeight={600}
                color={COLORS.solutionGreen}
              >
                it will be.
              </BlurText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
