import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { GradientText } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';
import { HouseMetaphor } from '../components';

/**
 * Scene 2: Context — "Architecture, Not Wording" (local frames 0–210)
 * Global frames 90–300; subtract 90 from spec BEATS.
 */

const BEATS = {
  STRUCTURE_TITLE_IN: 5,       // global 95
  NOT_WORDING_IN: 15,          // global 105
  TITLE_SHIFT_UP: 30,          // global 120
  HOUSE_PAINT_IN: 45,          // global 135
  PAINT_LABEL_IN: 55,          // global 145
  STRUCTURE_REVEAL_START: 95,  // global 185
  STRUCTURE_LABEL_IN: 110,     // global 200
  FULL_HOUSE_PHASE: 125,       // global 215
  WRONG_STRUCTURE_TEXT: 130,   // global 220
  HOUSE_FADE_OUT: 160,         // global 250
  TITLE_FADE_OUT: 165,         // global 255
  TRANSITION_BLACK: 190,       // global 280
  SCENE_END: 210,              // global 300
};

export const Scene2_Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Structure" title entrance
  const structureEntrance = spring({
    frame: frame - BEATS.STRUCTURE_TITLE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const structureScale = frame >= BEATS.STRUCTURE_TITLE_IN
    ? interpolate(structureEntrance, [0, 1], [0.5, 1]) : 0;
  const structureOpacity = frame >= BEATS.STRUCTURE_TITLE_IN
    ? interpolate(structureEntrance, [0, 1], [0, 1]) : 0;

  // "not wording." entrance
  const notWordingEntrance = spring({
    frame: frame - BEATS.NOT_WORDING_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const notWordingOpacity = frame >= BEATS.NOT_WORDING_IN
    ? interpolate(notWordingEntrance, [0, 1], [0, 1]) : 0;

  // Title shift up
  const shiftProgress = spring({
    frame: frame - BEATS.TITLE_SHIFT_UP,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const titleShiftY = frame >= BEATS.TITLE_SHIFT_UP
    ? interpolate(shiftProgress, [0, 1], [0, -200]) : 0;

  // Title fade out
  const titleFadeOpacity = frame >= BEATS.TITLE_FADE_OUT
    ? interpolate(frame, [BEATS.TITLE_FADE_OUT, BEATS.TITLE_FADE_OUT + 20], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Determine house phase
  let housePhase: 'paint' | 'structure' | 'full' = 'paint';
  if (frame >= BEATS.FULL_HOUSE_PHASE) housePhase = 'full';
  else if (frame >= BEATS.STRUCTURE_REVEAL_START) housePhase = 'structure';

  // House fade out
  const houseFadeOpacity = frame >= BEATS.HOUSE_FADE_OUT
    ? interpolate(frame, [BEATS.HOUSE_FADE_OUT, BEATS.HOUSE_FADE_OUT + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // House entrance
  const houseEntrance = spring({
    frame: frame - BEATS.HOUSE_PAINT_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const houseOpacity = frame >= BEATS.HOUSE_PAINT_IN
    ? interpolate(houseEntrance, [0, 1], [0, 1]) * houseFadeOpacity
    : 0;

  // "Wrong structure" text
  const wrongTextEntrance = spring({
    frame: frame - BEATS.WRONG_STRUCTURE_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const wrongTextOpacity = frame >= BEATS.WRONG_STRUCTURE_TEXT
    ? interpolate(wrongTextEntrance, [0, 1], [0, 1]) * houseFadeOpacity
    : 0;
  const wrongTextY = frame >= BEATS.WRONG_STRUCTURE_TEXT
    ? interpolate(wrongTextEntrance, [0, 1], [20, 0]) : 20;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* Title group */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 400 + titleShiftY,
          transform: 'translate(-50%, -50%)',
          opacity: structureOpacity * titleFadeOpacity,
          textAlign: 'center',
        }}
      >
        <div style={{ transform: `scale(${structureScale})` }}>
          <GradientText
            colors={['#F59E0B', '#FBBF24', '#F59E0B']}
            direction="horizontal"
            duration={90}
            fontSize={64}
          >
            Structure
          </GradientText>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 490 + titleShiftY,
          transform: 'translate(-50%, -50%)',
          opacity: notWordingOpacity * titleFadeOpacity,
          fontFamily: TYPOGRAPHY.title.fontFamily,
          fontWeight: 600,
          fontSize: 44,
          color: COLORS.textMuted,
        }}
      >
        not wording.
      </div>

      {/* House metaphor */}
      <div style={{ opacity: houseOpacity }}>
        <HouseMetaphor
          startFrame={BEATS.HOUSE_PAINT_IN}
          phase={housePhase}
          width={800}
          height={500}
          x={140}
          y={650}
        />
      </div>

      {/* "Wrong structure" text */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 380,
          transform: `translate(-50%, -50%) translateY(${wrongTextY}px)`,
          opacity: wrongTextOpacity,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 400,
          fontSize: 36,
          color: COLORS.textBody,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        Wrong structure = no amount of better paint fixes it.
      </div>
    </AbsoluteFill>
  );
};
