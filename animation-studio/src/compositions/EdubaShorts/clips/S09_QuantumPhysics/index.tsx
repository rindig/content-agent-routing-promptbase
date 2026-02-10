import React from 'react';
import { Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Tunneling,
  Scene3_ShrinkingTimeline,
  Scene4_Countermeasures,
  Scene5_Closing,
} from './scenes';

/**
 * S09: Your Computer Has a Quantum Physics Problem
 *
 * 38 seconds (1140 frames at 30fps) -- 9:16 vertical (1080x1920)
 * Theme B: Physics/uncertainty -- quantum tunneling in modern transistors
 *
 * Scene breakdown:
 *   1. Hook (90f) -- Phone hot, zoom into transistor
 *   2. Tunneling (210f) -- Electron ghosts through gate barrier
 *   3. Shrinking Timeline (300f) -- Transistor sizes 1971-2026
 *   4. Countermeasures (300f) -- Engineering layer stack
 *   5. Closing (240f) -- "Humans building predictable systems..."
 */
export const S09_QuantumPhysics: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Scene1_Hook />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.tunneling}>
        <Scene2_Tunneling />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.shrinkingTimeline}>
        <Scene3_ShrinkingTimeline />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.countermeasures}>
        <Scene4_Countermeasures />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
        <Scene5_Closing />
      </Series.Sequence>
    </Series>
  );
};
