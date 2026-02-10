import React from 'react';
import { Series } from 'remotion';
import { ColdOpen, Section1Template, Section2Memory, Section3AIMemory, Section4GraceHopper, Section5Prompting, Close } from './scenes';
import { SCENE_DURATIONS, TOTAL_DURATION, FPS } from './constants';

// Export config for RemotionRoot
export const MEMORY_CONFIG = {
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: TOTAL_DURATION,
};

export const Memory: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.coldOpen}>
        <ColdOpen />
      </Series.Sequence>

      {/* Section 1: The Template */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.section1Template}>
        <Section1Template />
      </Series.Sequence>

      {/* Section 2: Traditional Memory */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.section2Memory}>
        <Section2Memory />
      </Series.Sequence>

      {/* Section 3: AI Memory */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.section3AIMemory}>
        <Section3AIMemory />
      </Series.Sequence>

      {/* Section 4: Grace Hopper */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.section4GraceHopper}>
        <Section4GraceHopper />
      </Series.Sequence>

      {/* Section 5: Prompting */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.section5Prompting}>
        <Section5Prompting />
      </Series.Sequence>

      {/* Close */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.close}>
        <Close />
      </Series.Sequence>
    </Series>
  );
};

export default Memory;
