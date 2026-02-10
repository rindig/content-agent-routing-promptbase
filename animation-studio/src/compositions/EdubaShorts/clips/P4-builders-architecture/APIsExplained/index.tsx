import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Context,
  Scene3_Core,
  Scene4_Resolution,
  Scene5_Closing,
} from './scenes';

export const APIsExplained: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.context}>
          <Scene2_Context />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.core}>
          <Scene3_Core />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.resolution}>
          <Scene4_Resolution />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
