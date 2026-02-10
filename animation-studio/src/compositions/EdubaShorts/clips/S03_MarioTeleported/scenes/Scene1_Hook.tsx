import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_IN: 0,
  GAME_PANEL_IN: 0,
  PLATFORM_IN: 5,
  CHARACTER_IN: 8,
  IDLE: 10,
  FALL_START: 25,
  FALL_END: 35,
  FREEZE: 35,
  QUESTION_MARKS: 40,
  HOLD: 55,
};

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Game panel entrance ---
  const panelProgress = spring({
    frame: frame - BEATS.GAME_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);
  const panelScale = interpolate(panelProgress, [0, 1], [0.95, 1]);

  // --- Platform entrance ---
  const platformProgress = spring({
    frame: frame - BEATS.PLATFORM_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // --- Character entrance ---
  const characterProgress = spring({
    frame: frame - BEATS.CHARACTER_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const characterScale = interpolate(characterProgress, [0, 1], [0, 1]);

  // --- Idle bob ---
  const idleOffset =
    frame >= BEATS.IDLE && frame < BEATS.FALL_START
      ? Math.sin(frame * 0.2) * 2
      : 0;

  // --- Fall animation ---
  const isFalling = frame >= BEATS.FALL_START && frame < BEATS.FALL_END;
  const fallProgress = isFalling
    ? interpolate(
        frame,
        [BEATS.FALL_START, BEATS.FALL_END],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : frame >= BEATS.FALL_END
      ? 1
      : 0;
  // Accelerating fall using quadratic easing
  const fallDistance = Easing.in(Easing.quad)(fallProgress) * 300;
  const characterVisible = fallDistance < 280;

  // Red flash on character during fall
  const fallFlashOpacity =
    isFalling && frame >= BEATS.FALL_START + 2 && frame <= BEATS.FALL_START + 6
      ? interpolate(
          frame,
          [BEATS.FALL_START + 2, BEATS.FALL_START + 4, BEATS.FALL_START + 6],
          [0, 0.8, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  // --- Freeze frame scanlines ---
  const isFrozen = frame >= BEATS.FREEZE;

  // --- "???" entrance ---
  const questionProgress = spring({
    frame: frame - BEATS.QUESTION_MARKS,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const questionScale = interpolate(questionProgress, [0, 1], [0.3, 1]);
  const questionOpacity = interpolate(questionProgress, [0, 1], [0, 1]);

  // --- Purple border glow at HOLD ---
  const holdGlowOpacity =
    frame >= BEATS.HOLD
      ? interpolate(
          frame,
          [BEATS.HOLD, BEATS.HOLD + 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 0;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={10}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        {/* Game screen panel */}
        <div
          style={{
            width: 860,
            height: 600,
            backgroundColor: COLORS.bgSurface,
            border: `1px solid ${COLORS.panelBorder}`,
            borderRadius: 16,
            opacity: panelOpacity,
            transform: `scale(${panelScale})`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: holdGlowOpacity > 0
              ? `0 0 15px rgba(139,92,246,${0.3 * holdGlowOpacity})`
              : 'none',
          }}
        >
          {/* Sky hint background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(107,147,214,0.1)',
            }}
          />

          {/* Platform */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '60%',
              transform: `translateX(-50%) scaleX(${interpolate(
                platformProgress,
                [0, 1],
                [0, 1]
              )})`,
              width: 400,
              height: 16,
              backgroundColor: COLORS.solutionGreen,
              borderRadius: 4,
            }}
          />

          {/* Character (square body + circle head) */}
          {characterVisible && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '60%',
                transform: `translate(-50%, ${-60 + idleOffset + fallDistance}px) scale(${characterScale})`,
                transformOrigin: 'center bottom',
              }}
            >
              {/* Head */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: COLORS.errorRed,
                  margin: '0 auto',
                  marginBottom: -2,
                }}
              />
              {/* Body */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: COLORS.errorRed,
                  borderRadius: 4,
                  position: 'relative',
                }}
              >
                {/* Red flash glow on fall */}
                {fallFlashOpacity > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: 8,
                      boxShadow: `0 0 20px rgba(239,68,68,${fallFlashOpacity})`,
                      backgroundColor: `rgba(239,68,68,${fallFlashOpacity * 0.3})`,
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Scanline overlay (freeze frame) */}
          {isFrozen && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                pointerEvents: 'none',
                // Subtle flicker
                opacity: 0.7 + Math.sin(frame * 0.3) * 0.3,
              }}
            />
          )}

          {/* "???" glitch text */}
          {frame >= BEATS.QUESTION_MARKS && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: questionOpacity,
                transform: `scale(${questionScale})`,
              }}
            >
              <GlitchText
                color={COLORS.insightOrange}
                fontSize={72}
                fontWeight={900}
                intensity={0.5}
                speed={4}
              >
                ???
              </GlitchText>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
