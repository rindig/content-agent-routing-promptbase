import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_ProbabilityMachine,
  Scene3_SplitComparison,
  Scene4_Meters,
  Scene5_Closing,
} from './scenes';

export const S13_RealReasonAIWrong: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.probabilityMachine}>
          <Scene2_ProbabilityMachine />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.splitComparison}>
          <Scene3_SplitComparison />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.meters}>
          <Scene4_Meters />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
