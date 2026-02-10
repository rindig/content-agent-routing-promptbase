import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_FailuresAndFixes,
  Scene3_AIProblems,
  Scene4_TheStack,
  Scene5_Closing,
} from './scenes';

export const S20_SolvedThisOnce: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.failuresAndFixes}>
          <Scene2_FailuresAndFixes />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.aiProblems}>
          <Scene3_AIProblems />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.theStack}>
          <Scene4_TheStack />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
