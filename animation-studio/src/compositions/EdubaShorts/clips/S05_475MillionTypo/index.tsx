import React from 'react';
import { Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_PentiumChip,
  Scene3_Cascade,
  Scene4_Scale,
  Scene5_Closing,
} from './scenes';

/**
 * S05: The $475 Million Typo
 *
 * 35 seconds (1050 frames at 30fps) -- 9:16 vertical (1080x1920)
 * Theme D: History/abstraction
 *
 * Five missing values in a Pentium lookup table cost Intel $475M.
 * Reliability is about systems, not technology.
 *
 * Scene breakdown:
 *   1. Hook (90f) -- Missing semicolon, error cascade, $475M reveal
 *   2. Pentium Chip (210f) -- 1994 badge, chip build, FPU zoom, lookup table
 *   3. Cascade (240f) -- Division hits empty slot, wrong result flows downstream
 *   4. Scale (210f) -- Chip multiplication, red wave, $475M CountUp
 *   5. Closing (300f) -- Testing rings + "Reliability isn't a property of the technology..."
 */
export const S05_475MillionTypo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Scene1_Hook />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.pentiumChip}>
        <Scene2_PentiumChip />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.cascade}>
        <Scene3_Cascade />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.scale}>
        <Scene4_Scale />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
        <Scene5_Closing />
      </Series.Sequence>
    </Series>
  );
};
