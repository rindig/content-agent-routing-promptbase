import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_MadLibs,
  Scene3_AstComparison,
  Scene4_SystemPrompt,
  Scene5_Closing,
} from './scenes';

export const S16_EverythingOldNewAgain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.madLibs}>
          <Scene2_MadLibs />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.astComparison}>
          <Scene3_AstComparison />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.systemPrompt}>
          <Scene4_SystemPrompt />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
