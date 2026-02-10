import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
} from '../../../../../Memory/components/AmbientBackground';
import { ShinyText, CountUp } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';
import { FoodCourtGrid } from '../components';

/**
 * Scene 4: Resolution — The Internet as a Food Court (local frames 0–240)
 * Global frames 660–900; subtract 660 from spec BEATS.
 */

const BEATS = {
  PREV_FADE_COMPLETE: 0,       // global 660
  PARTICLE_SHIFT_PURPLE: 10,   // global 670
  SINGLE_INTERACTION_IN: 10,   // global 670
  SINGLE_RESPONSE: 25,         // global 685
  GRID_POPULATE_START: 35,     // global 695
  GRID_IDLE_ACTIVE: 80,        // global 740
  COUNTUP_START: 80,           // global 740
  CALLS_LABEL_IN: 88,          // global 748
  COUNTUP_COMPLETE: 110,       // global 770
  REFRAME_TEXT_IN: 125,        // global 785
  SHINE_SWEEP: 130,            // global 790
  UNDERLINE_DRAW: 135,         // global 795
  GRID_EDGE_DIM: 150,          // global 810
  COUNTUP_DIM: 155,            // global 815
  CENTER_FOCUS: 180,           // global 840
  RADIAL_GLOW_IN: 180,         // global 840
  FADE_TO_BLACK: 210,          // global 870
  SCENE_END: 240,              // global 900
};

export const Scene4_Resolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CountUp visible
  const countUpVisible = frame >= BEATS.COUNTUP_START;
  const countUpDimOpacity = frame >= BEATS.COUNTUP_DIM
    ? interpolate(frame, [BEATS.COUNTUP_DIM, BEATS.COUNTUP_DIM + 15], [1, 0.4], { extrapolateRight: 'clamp' })
    : 1;

  // "API calls per second" label
  const callsLabelEntrance = spring({
    frame: frame - BEATS.CALLS_LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const callsLabelOpacity = frame >= BEATS.CALLS_LABEL_IN
    ? interpolate(callsLabelEntrance, [0, 1], [0, 1]) * countUpDimOpacity
    : 0;

  // "Software asking software." text
  const reframeEntrance = spring({
    frame: frame - BEATS.REFRAME_TEXT_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const reframeScale = frame >= BEATS.REFRAME_TEXT_IN
    ? interpolate(reframeEntrance, [0, 1], [0.5, 1]) : 0;
  const reframeOpacity = frame >= BEATS.REFRAME_TEXT_IN
    ? interpolate(reframeEntrance, [0, 1], [0, 1]) : 0;

  // Underline draw
  const underlineProgress = spring({
    frame: frame - BEATS.UNDERLINE_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const underlineWidth = frame >= BEATS.UNDERLINE_DRAW
    ? interpolate(underlineProgress, [0, 1], [0, 500]) : 0;

  // Radial glow
  const glowOpacity = frame >= BEATS.RADIAL_GLOW_IN
    ? interpolate(frame, [BEATS.RADIAL_GLOW_IN, BEATS.RADIAL_GLOW_IN + 20], [0, 0.04], { extrapolateRight: 'clamp' })
    : 0;

  // Global fade to black
  const fadeOpacity = frame >= BEATS.FADE_TO_BLACK
    ? interpolate(frame, [BEATS.FADE_TO_BLACK, BEATS.SCENE_END], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.aiPurple}
      />
      <Vignette intensity={0.5} />

      <div style={{ opacity: fadeOpacity }}>
        {/* CountUp */}
        {countUpVisible && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 350,
              transform: 'translate(-50%, -50%)',
              opacity: countUpDimOpacity,
            }}
          >
            <CountUp
              from={0}
              to={1000000}
              startFrame={BEATS.COUNTUP_START}
              duration={30}
              separator=","
              fontSize={64}
              color={COLORS.aiPurple}
              useSpring={true}
            />
          </div>
        )}

        {/* "API calls per second" */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 430,
            transform: 'translate(-50%, -50%)',
            opacity: callsLabelOpacity,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontWeight: 400,
            fontSize: 36,
            color: COLORS.textMuted,
          }}
        >
          API calls per second
        </div>

        {/* Food Court Grid */}
        <FoodCourtGrid
          count={24}
          columns={6}
          startFrame={BEATS.GRID_POPULATE_START}
          staggerDelay={2}
        />

        {/* Radial glow behind grid */}
        <div
          style={{
            position: 'absolute',
            top: 960 - 250,
            left: 540 - 250,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.aiPurple} 0%, transparent 70%)`,
            opacity: glowOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* "Software asking software." */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1500,
            transform: `translate(-50%, -50%) scale(${reframeScale})`,
            opacity: reframeOpacity,
          }}
        >
          <ShinyText
            startFrame={BEATS.SHINE_SWEEP}
            shineColor="#FFFFFF"
            duration={30}
            fontSize={52}
          >
            Software asking software.
          </ShinyText>
        </div>

        {/* Accent underline */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 1540,
            transform: 'translateX(-50%)',
            width: underlineWidth,
            height: 2,
            backgroundColor: COLORS.insightOrange,
            opacity: 0.6,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
