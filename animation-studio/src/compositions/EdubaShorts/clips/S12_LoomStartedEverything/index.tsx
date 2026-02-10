import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_JacquardLoom,
  Scene3_WeavingPortrait,
  Scene4_LovelaceQuote,
  Scene5_Closing,
} from './scenes';

export const S12_LoomStartedEverything: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.jacquardLoom}>
          <Scene2_JacquardLoom />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.portrait}>
          <Scene3_WeavingPortrait />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.lovelaceQuote}>
          <Scene4_LovelaceQuote />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
