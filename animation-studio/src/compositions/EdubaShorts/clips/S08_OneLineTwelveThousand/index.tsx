import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_LayerFall,
  Scene3_BridgesUp,
  Scene4_Closing,
} from './scenes';

export const S08_OneLineTwelveThousand: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.layerFall}>
          <Scene2_LayerFall />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.bridgesUp}>
          <Scene3_BridgesUp />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene4_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
