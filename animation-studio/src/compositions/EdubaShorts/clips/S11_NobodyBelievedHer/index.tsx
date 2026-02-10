import React from 'react';
import { Series } from 'remotion';
import { SCENE_DURATIONS } from './timing';
import {
  Scene1_Hook,
  Scene2_HopperDemo,
  Scene3_YearsIgnored,
  Scene4_CompilersEverywhere,
  Scene5_Closing,
} from './scenes';

/**
 * S11: Nobody Believed Her
 *
 * 35 seconds (1050 frames at 30fps) -- 9:16 vertical (1080x1920)
 * Theme D: History/abstraction -- Grace Hopper built the first compiler
 * but nobody used it for 3 years. The same dismissal pattern repeats.
 *
 * Scene breakdown:
 *   1. Hook (90f) -- Skeptical silhouettes, "3 years."
 *   2. Hopper Demo (210f) -- 1952, compiler transformation diagram
 *   3. Years Ignored (240f) -- Quote, CountUp 1095 days, year bars, rejection stamp
 *   4. Compilers Everywhere (210f) -- Icon replication, "Foundation of everything."
 *   5. Closing (300f) -- 1952 vs 2026 parallel, timeline, "keeps getting shorter."
 */
export const S11_NobodyBelievedHer: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Scene1_Hook />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.hopperDemo}>
        <Scene2_HopperDemo />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.yearsIgnored}>
        <Scene3_YearsIgnored />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.compilersEverywhere}>
        <Scene4_CompilersEverywhere />
      </Series.Sequence>

      <Series.Sequence durationInFrames={SCENE_DURATIONS.closing}>
        <Scene5_Closing />
      </Series.Sequence>
    </Series>
  );
};
