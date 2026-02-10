import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Confusion,
  Scene3_TenPercent,
  Scene4_Alternative,
  Scene5_Closing,
} from './scenes';

export const S17_CompanyStoppedAI: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.confusion}>
          <Scene2_Confusion />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.tenPercent}>
          <Scene3_TenPercent />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.alternative}>
          <Scene4_Alternative />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
