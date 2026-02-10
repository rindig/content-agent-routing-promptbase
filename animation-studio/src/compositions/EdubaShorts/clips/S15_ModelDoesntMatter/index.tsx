import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_SystemDiagram,
  Scene3_BarBreakdown,
  Scene4_SparkPlug,
  Scene5_Closing,
} from './scenes';

export const S15_ModelDoesntMatter: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.systemDiagram}>
          <Scene2_SystemDiagram />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.barBreakdown}>
          <Scene3_BarBreakdown />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.sparkPlug}>
          <Scene4_SparkPlug />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
