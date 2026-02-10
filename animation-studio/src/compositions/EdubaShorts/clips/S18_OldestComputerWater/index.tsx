import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_HeronTheater,
  Scene3_KnotsBinary,
  Scene4_BinaryTimeline,
  Scene5_Closing,
} from './scenes';

export const S18_OldestComputerWater: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.heronTheater}>
          <Scene2_HeronTheater />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.knotsBinary}>
          <Scene3_KnotsBinary />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.binaryTimeline}>
          <Scene4_BinaryTimeline />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
