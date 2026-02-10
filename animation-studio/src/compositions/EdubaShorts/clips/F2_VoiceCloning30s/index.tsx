import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_Extraction,
  Scene3_Fingerprint,
  Scene4_Reproduction,
  Scene5_Closing,
} from './scenes';

export const F2_VoiceCloning30s: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0F' }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene1_Hook />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.extraction}>
          <Scene2_Extraction />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.fingerprint}>
          <Scene3_Fingerprint />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.reproduction}>
          <Scene4_Reproduction />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
          <Scene5_Closing />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
