import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_ScaleReveal,
  Scene3_TheStack,
  Scene4_TheReframe,
  Scene5_Closing,
} from './scenes';

export const HelloWorldLayers: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.scaleReveal}>
          <Scene2_ScaleReveal />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.theStack}>
          <Scene3_TheStack />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.theReframe}>
          <Scene4_TheReframe />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
