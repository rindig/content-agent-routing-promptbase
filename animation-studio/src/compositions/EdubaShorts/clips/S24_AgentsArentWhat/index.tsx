import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_TwoLanes,
  Scene3_BadgePeel,
  Scene4_DemoVsWild,
  Scene5_Closing,
} from './scenes';

export const S24_AgentsArentWhat: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.twoLanes}>
          <Scene2_TwoLanes />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.badgePeel}>
          <Scene3_BadgePeel />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.demoVsWild}>
          <Scene4_DemoVsWild />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
