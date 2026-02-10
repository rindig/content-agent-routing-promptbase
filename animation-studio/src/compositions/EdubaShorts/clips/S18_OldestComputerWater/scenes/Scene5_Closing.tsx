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
  TIMELINE_COMPRESS: 0,
  LINE_1_IN: 30,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 80,
  LINE_2_STAGGER: 5,
  LINE_3_IN: 120,
  HOLD_START: 150,
  FADE_OUT: 225,
};

// ── Compressed timeline dots (from Scene 4 eras) ──
const TIMELINE_DOTS = [
  { color: COLORS.historyGold, label: '62 CE' },
  { color: COLORS.historyGold, label: '1804' },
  { color: COLORS.techBlue, label: '1940s' },
  { color: COLORS.techBlue, label: '1960s' },
  { color: COLORS.aiPurple, label: '2020s' },
];

// ── Compressed Timeline Bar ──
const CompressedTimeline: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const compressProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const barOpacity = interpolate(compressProgress, [0, 1], [0, 1]);
  const barScale = interpolate(compressProgress, [0, 1], [0.6, 1]);

  // Dot wave during hold
  const isHolding = frame >= BEATS.HOLD_START;
  const waveCycle = isHolding ? (frame - BEATS.HOLD_START) : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        opacity: barOpacity,
        transform: `scale(${barScale})`,
        marginBottom: 60,
      }}
    >
      {TIMELINE_DOTS.map((dot, i) => {
        // Wave pulse: each dot flares for 10 frames, sequentially
        const wavePosition = (waveCycle / 10) % (TIMELINE_DOTS.length + 2);
        const distFromWave = Math.abs(wavePosition - i);
        const flareScale = isHolding && distFromWave < 1
          ? interpolate(distFromWave, [0, 1], [1.8, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 1;
        const flareGlow = isHolding && distFromWave < 0.5;

        return (
          <React.Fragment key={i}>
            {/* Connector line between dots */}
            {i > 0 && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  backgroundColor: COLORS.panelBorder,
                }}
              />
            )}
            {/* Dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: dot.color,
                transform: `scale(${flareScale})`,
                boxShadow: flareGlow
                  ? `0 0 16px ${dot.color}`
                  : 'none',
                flexShrink: 0,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Main Scene ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showLine1 = frame >= BEATS.LINE_1_IN;
  const showLine2 = frame >= BEATS.LINE_2_IN;
  const showLine3 = frame >= BEATS.LINE_3_IN;

  // Line 3 entrance
  const line3Progress = spring({
    frame: Math.max(0, frame - BEATS.LINE_3_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const line3Opacity = interpolate(line3Progress, [0, 1], [0, 1]);
  const line3Y = interpolate(line3Progress, [0, 1], [15, 0]);

  // Fade to black at end
  const fadeOut = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={15}
    >
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
        }}
      >
        {/* Compressed timeline bar at top */}
        <div style={{ position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <CompressedTimeline frame={frame} fps={fps} />
        </div>

        {/* Closing text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 28,
            maxWidth: 860,
            textAlign: 'center',
          }}
        >
          {/* Line 1: "Computing isn't a technology." */}
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
              Computing isn't a technology.
            </BlurText>
          )}

          {/* Line 2: "It's a pattern." — "a pattern" in historyGold */}
          {showLine2 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 8px' }}>
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
                It's
              </BlurText>
              <BlurText
                startFrame={BEATS.LINE_2_IN + BEATS.LINE_2_STAGGER}
                animateBy="words"
                staggerDelay={BEATS.LINE_2_STAGGER}
                direction="bottom"
                blurAmount={8}
                fontSize={44}
                fontWeight={600}
                color={COLORS.historyGold}
              >
                a pattern.
              </BlurText>
            </div>
          )}

          {/* Line 3: "And it's older than anyone thinks." */}
          {showLine3 && (
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 36,
                color: COLORS.textMuted,
                opacity: line3Opacity,
                transform: `translateY(${line3Y}px)`,
                marginTop: 8,
              }}
            >
              And it's older than anyone thinks.
            </div>
          )}
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: fadeOut,
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />
    </SceneContainer>
  );
};
