import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_LibraryMetaphor,
  Scene3_PatternMatch,
  Scene4_GapSpectrum,
  Scene5_Closing,
} from './scenes';

export const S22_SmarterModel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.libraryMetaphor}>
          <Scene2_LibraryMetaphor />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.patternMatch}>
          <Scene3_PatternMatch />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.gapSpectrum}>
          <Scene4_GapSpectrum />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
