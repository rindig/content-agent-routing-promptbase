import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_CosmicZoom,
  Scene3_BitFlip,
  Scene4_EccDefense,
  Scene5_Closing,
} from './scenes';

export const S02_CosmicRay: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.cosmicZoom}>
          <Scene2_CosmicZoom />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.bitFlip}>
          <Scene3_BitFlip />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.eccDefense}>
          <Scene4_EccDefense />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
