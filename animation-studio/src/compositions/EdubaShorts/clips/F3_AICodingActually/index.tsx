import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_IntentNotTyping,
  Scene3_HistoricalPattern,
  Scene4_LayerStack,
  Scene5_Closing,
} from './scenes';

export const F3_AICodingActually: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.intentToCode}>
          <Scene2_IntentNotTyping />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.layerTimeline}>
          <Scene3_HistoricalPattern />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.understandLayers}>
          <Scene4_LayerStack />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
