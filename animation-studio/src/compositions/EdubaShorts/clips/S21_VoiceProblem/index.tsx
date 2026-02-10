import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_CloningProcess,
  Scene3_EvolutionaryTrust,
  Scene4_Reproducible,
  Scene5_Closing,
} from './scenes';

export const S21_VoiceProblem: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.cloningProcess}>
          <Scene2_CloningProcess />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.evolutionaryTrust}>
          <Scene3_EvolutionaryTrust />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.reproducible}>
          <Scene4_Reproducible />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
