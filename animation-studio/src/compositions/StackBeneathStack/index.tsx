import React from 'react';
import { AbsoluteFill, Series, Sequence } from 'remotion';
import { COLORS, FPS, SCENE_FRAMES, TOTAL_FRAMES } from './constants';
import { ColdOpen, TitleCard, Surface, Parser, Bytecode, Interpreter, Assembly, MachineCode, Hardware, Loom, ErrorsTimeline, ElectronProblem, ProbabilityBeneath, EngineeringDeterminism, AILayer, Close, EndCard } from './scenes';

// Export configuration for the composition
export const STACK_CONFIG = {
  fps: FPS,
  width: 1920,
  height: 1080,
  // COMPLETE VIDEO - all 17 scenes
  durationInFrames: SCENE_FRAMES.coldOpen + SCENE_FRAMES.titleCard + SCENE_FRAMES.surface + SCENE_FRAMES.parser + SCENE_FRAMES.bytecode + SCENE_FRAMES.interpreter + SCENE_FRAMES.assembly + SCENE_FRAMES.machineCode + SCENE_FRAMES.hardware + SCENE_FRAMES.loom + SCENE_FRAMES.errorsTimeline + SCENE_FRAMES.electronProblem + SCENE_FRAMES.probabilityBeneath + SCENE_FRAMES.engineeringDeterminism + SCENE_FRAMES.aiLayer + SCENE_FRAMES.close + SCENE_FRAMES.endCard,
};

export const StackBeneathStack: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <Series>
        {/* Scene 0: Cold Open - 45s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.coldOpen}>
          <ColdOpen />
        </Series.Sequence>

        {/* Scene 1: Title Card - 7s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.titleCard}>
          <TitleCard />
        </Series.Sequence>

        {/* Scene 2: The Surface - 33s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.surface}>
          <Surface />
        </Series.Sequence>

        {/* Scene 3: The Parser - 50s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.parser}>
          <Parser />
        </Series.Sequence>

        {/* Scene 4: Bytecode - 45s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.bytecode}>
          <Bytecode />
        </Series.Sequence>

        {/* Scene 5: The Interpreter (C) - 75s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.interpreter}>
          <Interpreter />
        </Series.Sequence>

        {/* Scene 6: Assembly - 40s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.assembly}>
          <Assembly />
        </Series.Sequence>

        {/* Scene 7: Machine Code - 35s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.machineCode}>
          <MachineCode />
        </Series.Sequence>

        {/* Scene 8: Hardware - 45s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.hardware}>
          <Hardware />
        </Series.Sequence>

        {/* Scene 9: The Loom - 105s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.loom}>
          <Loom />
        </Series.Sequence>

        {/* Scene 10: Errors Timeline - 60s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.errorsTimeline}>
          <ErrorsTimeline />
        </Series.Sequence>

        {/* Scene 11: The Electron Problem - 90s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.electronProblem}>
          <ElectronProblem />
        </Series.Sequence>

        {/* Scene 12: Probability Beneath - 60s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.probabilityBeneath}>
          <ProbabilityBeneath />
        </Series.Sequence>

        {/* Scene 13: Engineering Determinism - 45s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.engineeringDeterminism}>
          <EngineeringDeterminism />
        </Series.Sequence>

        {/* Scene 14: AI Layer - 75s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.aiLayer}>
          <AILayer />
        </Series.Sequence>

        {/* Scene 15: Close - 45s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.close}>
          <Close />
        </Series.Sequence>

        {/* Scene 16: End Card - 15s */}
        <Series.Sequence durationInFrames={SCENE_FRAMES.endCard}>
          <EndCard />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
