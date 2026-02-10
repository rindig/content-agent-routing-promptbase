import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_ActualImprovement,
  Scene3_SystemView,
  Scene4_Diagnosis,
  Scene5_Closing,
} from './scenes';

export const F1_NewModelChanges: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.actualImprovement}>
          <Scene2_ActualImprovement />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.systemView}>
          <Scene3_SystemView />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.badSystem}>
          <Scene4_Diagnosis />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
