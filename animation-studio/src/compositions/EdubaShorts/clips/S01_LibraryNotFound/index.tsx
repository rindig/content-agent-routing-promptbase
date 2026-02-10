import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Parallel,
  Scene3_Skepticism,
  Scene4_Timeline,
  Scene5_Closing,
} from './scenes';

export const S01_LibraryNotFound: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.parallel}>
          <Scene2_Parallel />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.skepticism}>
          <Scene3_Skepticism />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.timeline}>
          <Scene4_Timeline />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
