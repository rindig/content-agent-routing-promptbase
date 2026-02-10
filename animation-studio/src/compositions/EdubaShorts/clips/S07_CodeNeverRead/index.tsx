import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Explosion,
  Scene3_LayerStack,
  Scene4_AIComparison,
  Scene5_Closing,
} from './scenes';

export const S07_CodeNeverRead: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.explosion}>
          <Scene2_Explosion />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.layerStack}>
          <Scene3_LayerStack />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.aiComparison}>
          <Scene4_AIComparison />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
