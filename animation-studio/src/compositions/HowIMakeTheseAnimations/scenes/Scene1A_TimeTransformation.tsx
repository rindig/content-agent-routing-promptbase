/**
 * Scene 1A: Time Transformation Hook
 * [0:00 - 0:08] — 240 frames
 *
 * "The animations in this video would have taken me a full week to make.
 *  Maybe longer. Now I make them in under an hour."
 *
 * Visual: Dramatic time compression - ONE WEEK → < 1 HOUR
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SIZES, SPRING_CONFIGS } from '../constants';
import { GlitchText } from '../../../components/core/effects';

// Timeline markers
const PHASE = {
  WEEK_FADE_IN: 0,
  DAYS_APPEAR: 30,
  COMPRESSION_START: 90,
  COMPRESSION_END: 150,
  GLITCH_TRANSFORM: 150,
  RESOLUTION: 180,
  HOLD: 210,
};

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const Scene1A_TimeTransformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === PHASE 1: "ONE WEEK" fade in ===
  const weekFadeIn = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const weekOpacity = interpolate(weekFadeIn, [0, 1], [0, 1]);

  // === PHASE 2: Days appear (30-90) ===
  const daysProgress = interpolate(
    frame,
    [PHASE.DAYS_APPEAR, PHASE.DAYS_APPEAR + 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === PHASE 3: Compression (90-150) ===
  const compressionProgress = interpolate(
    frame,
    [PHASE.COMPRESSION_START, PHASE.COMPRESSION_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Apply easing for dramatic effect
  const compressionEased = Math.pow(compressionProgress, 2);

  // Days collapse to center
  const daySpacing = interpolate(compressionEased, [0, 1], [90, 0]);
  const daysOpacity = interpolate(compressionProgress, [0.7, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === PHASE 4: Glitch transformation (150-180) ===
  const isGlitching = frame >= PHASE.GLITCH_TRANSFORM && frame < PHASE.RESOLUTION;

  // === PHASE 5: Resolution (180+) ===
  const resolutionProgress = spring({
    frame: frame - PHASE.RESOLUTION,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const showHour = frame >= PHASE.RESOLUTION;

  // Color transition from red to green
  const colorProgress = interpolate(
    frame,
    [PHASE.RESOLUTION, PHASE.RESOLUTION + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // === PHASE 6: Hold with breathing (210+) ===
  const breathingScale = frame >= PHASE.HOLD
    ? 1 + Math.sin((frame - PHASE.HOLD) * 0.08) * 0.02
    : 1;

  // Glow pulse on final number
  const glowIntensity = frame >= PHASE.HOLD
    ? Math.sin((frame - PHASE.HOLD) * 0.1) * 10 + 15
    : 0;

  // Week text visibility
  const weekVisible = frame < PHASE.RESOLUTION;

  // CountUp simulation for time display
  const countProgress = interpolate(
    frame,
    [PHASE.RESOLUTION, PHASE.RESOLUTION + 45],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Format time: interpolate from 168:00:00 to 0:58:00
  const totalMinutes = interpolate(countProgress, [0, 1], [168 * 60, 58]);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const timeDisplay = `${hours}:${String(minutes).padStart(2, '0')}:00`;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* ONE WEEK / < 1 HOUR text */}
        {weekVisible && !isGlitching && (
          <div
            style={{
              opacity: weekOpacity * (1 - compressionProgress * 0.3),
              transform: `scale(${1 - compressionProgress * 0.1})`,
            }}
          >
            <span
              style={{
                fontSize: SIZES.hero,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 800,
                color: `${COLORS.time}99`, // 60% opacity red
                letterSpacing: '-0.02em',
              }}
            >
              ONE WEEK
            </span>
          </div>
        )}

        {/* Glitch transformation */}
        {isGlitching && (
          <GlitchText
            intensity={1.2}
            speed={2}
            enableShadows
            color={COLORS.time}
            backgroundColor={COLORS.background}
            fontSize={SIZES.hero}
            fontWeight={800}
            fontFamily={TYPOGRAPHY.display.fontFamily}
          >
            ONE WEEK
          </GlitchText>
        )}

        {/* < 1 HOUR reveal */}
        {showHour && (
          <div
            style={{
              opacity: resolutionProgress,
              transform: `scale(${interpolate(resolutionProgress, [0, 1], [0.8, breathingScale])})`,
            }}
          >
            <span
              style={{
                fontSize: SIZES.hero,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 800,
                color: COLORS.possibility,
                letterSpacing: '-0.02em',
                textShadow: `0 0 ${glowIntensity}px ${COLORS.possibility}60`,
              }}
            >
              {'< 1 HOUR'}
            </span>
          </div>
        )}

        {/* Subtext: hours display */}
        {weekVisible && !isGlitching && (
          <div
            style={{
              opacity: weekOpacity * 0.7,
              marginTop: -8,
            }}
          >
            <span
              style={{
                fontSize: SIZES.subtext,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.textMuted,
              }}
            >
              168 hours of work
            </span>
          </div>
        )}

        {/* CountUp time display */}
        {showHour && (
          <div
            style={{
              opacity: resolutionProgress,
              marginTop: -8,
            }}
          >
            <span
              style={{
                fontSize: SIZES.body,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontWeight: 600,
                color: COLORS.possibility,
                fontVariantNumeric: 'tabular-nums',
                opacity: 0.8,
              }}
            >
              {timeDisplay}
            </span>
          </div>
        )}

        {/* Day markers (compression visualization) */}
        {frame >= PHASE.DAYS_APPEAR && frame < PHASE.RESOLUTION && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: daySpacing,
              marginTop: 48,
              opacity: daysProgress * daysOpacity,
            }}
          >
            {DAYS.map((day, index) => {
              const dayDelay = index * 5;
              const dayProgress = spring({
                frame: frame - PHASE.DAYS_APPEAR - dayDelay,
                fps,
                config: SPRING_CONFIGS.snappy,
              });

              // Progress bar fill animation
              const fillDelay = index * 8;
              const fillProgress = interpolate(
                frame,
                [PHASE.DAYS_APPEAR + 30 + fillDelay, PHASE.DAYS_APPEAR + 50 + fillDelay],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              // Compression: all days move toward center
              const centerOffset = (index - 3) * daySpacing;
              const compressedOffset = interpolate(
                compressionEased,
                [0, 1],
                [centerOffset, 0]
              );

              return (
                <div
                  key={day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    opacity: dayProgress,
                    transform: `translateX(${compressedOffset}px) scale(${interpolate(
                      compressionEased,
                      [0, 1],
                      [1, 0.6]
                    )})`,
                  }}
                >
                  <span
                    style={{
                      fontSize: SIZES.label,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontWeight: 600,
                      color: COLORS.textMuted,
                    }}
                  >
                    {day}
                  </span>
                  {/* Progress bar */}
                  <div
                    style={{
                      width: 50,
                      height: 6,
                      backgroundColor: `${COLORS.time}30`,
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${fillProgress * 100}%`,
                        height: '100%',
                        backgroundColor: `${COLORS.time}80`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Motion blur lines during compression */}
        {frame >= PHASE.COMPRESSION_START && frame < PHASE.COMPRESSION_END && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: 4,
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {[...Array(7)].map((_, i) => {
              const lineOffset = (i - 3) * 60 * (1 - compressionEased);
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${lineOffset}px)`,
                    width: interpolate(compressionEased, [0, 1], [40, 4]),
                    height: 3,
                    backgroundColor: `${COLORS.time}${Math.floor(
                      (1 - compressionEased) * 40
                    )
                      .toString(16)
                      .padStart(2, '0')}`,
                    borderRadius: 2,
                    filter: `blur(${compressionEased * 2}px)`,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default Scene1A_TimeTransformation;
