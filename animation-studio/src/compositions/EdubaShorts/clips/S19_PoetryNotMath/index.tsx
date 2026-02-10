import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_PoetryWeb,
  Scene3_MathVoid,
  Scene4_SplitView,
  Scene5_Closing,
} from './scenes';

export const S19_PoetryNotMath: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.poetryWeb}>
          <Scene2_PoetryWeb />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.mathVoid}>
          <Scene3_MathVoid />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.splitView}>
          <Scene4_SplitView />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
