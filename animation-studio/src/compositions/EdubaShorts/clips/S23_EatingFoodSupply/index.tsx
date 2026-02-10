import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_FlowDiagram,
  Scene3_Decline,
  Scene4_Deterioration,
  Scene5_Closing,
} from './scenes';

export const S23_EatingFoodSupply: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.flowDiagram}>
          <Scene2_FlowDiagram />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.decline}>
          <Scene3_Decline />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.deterioration}>
          <Scene4_Deterioration />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
