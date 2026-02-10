import React from 'react';
import { Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_HistoricalMontage,
  Scene3_ErrorHandling,
  Scene4_AILayer,
  Scene5_Closing,
} from './scenes';

/**
 * S06: When the AI Fixes One Thing and Breaks Three
 *
 * 38 seconds (1140 frames at 30fps) -- 9:16 vertical (1080x1920)
 * Theme A: AI failures -- each abstraction layer introduces new failure modes
 *
 * Scene breakdown:
 *   1. Hook (90f) -- Chat window: fix one bug, three errors pop up
 *   2. Historical Montage (270f) -- Compilers, OS, networking same pattern
 *   3. Error Handling (300f) -- Solutions built at each era
 *   4. AI Layer (240f) -- AI's error handling being built
 *   5. Closing (240f) -- "Every layer has an awkward phase. This is AI's."
 */
export const S06_FixOneBreakThree: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Scene1_Hook />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.historicalMontage}>
        <Scene2_HistoricalMontage />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.errorHandling}>
        <Scene3_ErrorHandling />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.aiLayer}>
        <Scene4_AILayer />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
        <Scene5_Closing />
      </Series.Sequence>
    </Series>
  );
};
