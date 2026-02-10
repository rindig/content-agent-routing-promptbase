import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_PatternZoom,
  Scene3_ScaleSlider,
  Scene4_Timeline,
  Scene5_Closing,
} from './scenes';

export const S04_SpreadsheetAI: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.patternZoom}>
          <Scene2_PatternZoom />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.scaleSlider}>
          <Scene3_ScaleSlider />
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
