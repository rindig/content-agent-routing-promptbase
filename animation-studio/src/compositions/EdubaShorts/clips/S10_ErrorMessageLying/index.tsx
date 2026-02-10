import React from 'react';
import { Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_FirstBug,
  Scene3_Gallery,
  Scene4_Fixes,
  Scene5_Closing,
} from './scenes';

/**
 * S10: The Error Message Is Lying
 *
 * 38 seconds (1140 frames at 30fps) -- 9:16 vertical (1080x1920)
 * Theme D: History/abstraction -- every era has its own "moth"
 *
 * Scene breakdown:
 *   1. Hook (90f) -- NullPointerException that's wrong
 *   2. First Bug (210f) -- 1947 moth in relay
 *   3. Gallery (360f) -- Gallery of "moths" through history
 *   4. Fixes (240f) -- Each era's fix
 *   5. Closing (240f) -- "Different moths. Same pattern..."
 */
export const S10_ErrorMessageLying: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Scene1_Hook />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.moth}>
        <Scene2_FirstBug />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.gallery}>
        <Scene3_Gallery />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.fixes}>
        <Scene4_Fixes />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
        <Scene5_Closing />
      </Series.Sequence>
    </Series>
  );
};
