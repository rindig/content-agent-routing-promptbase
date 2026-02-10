import React from 'react';
import { Series, AbsoluteFill } from 'remotion';
import {
  Scene1A_TimeTransformation,
  Scene1B_PreviousWorkShowcase,
  Scene1C_Skepticism,
  Scene1D_ProcessOverMagic,
  Scene2A_ToolIntroduction,
  Scene2B_ToolsDemo,
  Scene2C_ConnectionInsight,
  Scene3A_SurpriseReveal,
  Scene3B_PrecisionNotVague,
  Scene3C_OgilvyInsight,
  Scene3D_CreativeThinking,
  Scene3E_SpecDetailLevels,
  Scene3F_SpecFileDemo,
  Scene3G_PauseMoment,
  Scene4A_SpecToAnimation,
  Scene4B_ClaudeReads,
  Scene4C_JonnyBurger,
  Scene4D_WebEcosystem,
  Scene4E_WorkflowDemo,
  Scene4F_ComponentLibrary,
  Scene4G_SeparationConcerns,
  Scene5A_ExportCapcut,
  Scene5B_EditWork,
  Scene5C_HonestyMoment,
  Scene5D_TimeClarification,
  Scene6A_ZoomOut,
  Scene6B_GarageBand,
  Scene6C_Canva,
  Scene6D_ThePattern,
  Scene7A_Counterintuitive,
  Scene7B_InvertedU,
  Scene7C_GreenEggsHam,
  Scene7D_Jaws,
  Scene8A_FullCircle,
  Scene8B_CreativeWorkMoved,
  Scene9A_WhatChanged,
  Scene9B_FinalEmpowerment,
} from './scenes';
import { SCENE_DURATIONS, FPS } from './constants';

// Export config — all scenes
export const HIMA_CONFIG = {
  fps: FPS,
  width: 1920,
  height: 1080,
  durationInFrames: Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0),
};

/**
 * HowIMakeTheseAnimations - Main Composition
 *
 * A video about the process of creating animated YouTube videos
 * using Claude Code, Remotion, and CapCut.
 */
export const HowIMakeTheseAnimations: React.FC = () => {
  return (
    <Series>
      {/* COLD OPEN (0:00 - 0:45) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1A_TimeTransformation}>
        <Scene1A_TimeTransformation />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1B_PreviousWork}>
        <Scene1B_PreviousWorkShowcase />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1C_Skepticism}>
        <Scene1C_Skepticism />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene1D_PromiseProcess}>
        <Scene1D_ProcessOverMagic />
      </Series.Sequence>

      {/* THE TOOLS (0:45 - 1:45) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene2A_ToolIntro}>
        <Scene2A_ToolIntroduction />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene2B_ToolsDemo}>
        <Scene2B_ToolsDemo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene2C_Connection}>
        <Scene2C_ConnectionInsight />
      </Series.Sequence>

      {/* STAGE ONE: THE SPEC (1:45 - 4:15) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3A_SurpriseReveal}>
        <Scene3A_SurpriseReveal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3B_PrecisionNotVague}>
        <Scene3B_PrecisionNotVague />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3C_OgilvyInsight}>
        <Scene3C_OgilvyInsight />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3D_CreativeThinking}>
        <Scene3D_CreativeThinking />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3E_SpecDetailLevels}>
        <Scene3E_SpecDetailLevels />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3F_SpecFileDemo}>
        <Scene3F_SpecFileDemo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene3G_PauseMoment}>
        <Scene3G_PauseMoment />
      </Series.Sequence>

      {/* STAGE TWO: BUILDING (4:15 - 7:15) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4A_SpecToAnimation}>
        <Scene4A_SpecToAnimation />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4B_ClaudeReads}>
        <Scene4B_ClaudeReads />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4C_JonnyBurger}>
        <Scene4C_JonnyBurger />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4D_WebEcosystem}>
        <Scene4D_WebEcosystem />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4E_WorkflowDemo}>
        <Scene4E_WorkflowDemo />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4F_ComponentLibrary}>
        <Scene4F_ComponentLibrary />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene4G_SeparationConcerns}>
        <Scene4G_SeparationConcerns />
      </Series.Sequence>

      {/* STAGE THREE: FINISHING (7:15 - 9:00) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5A_ExportCapcut}>
        <Scene5A_ExportCapcut />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5B_EditWork}>
        <Scene5B_EditWork />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5C_HonestyMoment}>
        <Scene5C_HonestyMoment />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene5D_TimeClarification}>
        <Scene5D_TimeClarification />
      </Series.Sequence>

      {/* THE BIGGER PICTURE (9:00 - 10:30) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene6A_ZoomOut}>
        <Scene6A_ZoomOut />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene6B_GarageBand}>
        <Scene6B_GarageBand />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene6C_Canva}>
        <Scene6C_Canva />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene6D_ThePattern}>
        <Scene6D_ThePattern />
      </Series.Sequence>

      {/* THE CONSTRAINTS INSIGHT (10:30 - 11:45) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene7A_Counterintuitive}>
        <Scene7A_Counterintuitive />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene7B_InvertedU}>
        <Scene7B_InvertedU />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene7C_GreenEggsHam}>
        <Scene7C_GreenEggsHam />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene7D_Jaws}>
        <Scene7D_Jaws />
      </Series.Sequence>

      {/* RETURN (11:45 - 12:30) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene8A_FullCircle}>
        <Scene8A_FullCircle />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene8B_CreativeWorkMoved}>
        <Scene8B_CreativeWorkMoved />
      </Series.Sequence>

      {/* CLOSE (12:30 - 13:15) */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene9A_WhatChanged}>
        <Scene9A_WhatChanged />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_DURATIONS.scene9B_FinalEmpowerment}>
        <Scene9B_FinalEmpowerment />
      </Series.Sequence>
    </Series>
  );
};

// Preview components for individual scenes
export const Scene1APreview: React.FC = () => (<AbsoluteFill><Scene1A_TimeTransformation /></AbsoluteFill>);
export const Scene1BPreview: React.FC = () => (<AbsoluteFill><Scene1B_PreviousWorkShowcase /></AbsoluteFill>);
export const Scene1CPreview: React.FC = () => (<AbsoluteFill><Scene1C_Skepticism /></AbsoluteFill>);
export const Scene1DPreview: React.FC = () => (<AbsoluteFill><Scene1D_ProcessOverMagic /></AbsoluteFill>);
export const Scene2APreview: React.FC = () => (<AbsoluteFill><Scene2A_ToolIntroduction /></AbsoluteFill>);
export const Scene2BPreview: React.FC = () => (<AbsoluteFill><Scene2B_ToolsDemo /></AbsoluteFill>);
export const Scene2CPreview: React.FC = () => (<AbsoluteFill><Scene2C_ConnectionInsight /></AbsoluteFill>);
export const Scene3APreview: React.FC = () => (<AbsoluteFill><Scene3A_SurpriseReveal /></AbsoluteFill>);
export const Scene3BPreview: React.FC = () => (<AbsoluteFill><Scene3B_PrecisionNotVague /></AbsoluteFill>);
export const Scene3CPreview: React.FC = () => (<AbsoluteFill><Scene3C_OgilvyInsight /></AbsoluteFill>);
export const Scene3DPreview: React.FC = () => (<AbsoluteFill><Scene3D_CreativeThinking /></AbsoluteFill>);
export const Scene3EPreview: React.FC = () => (<AbsoluteFill><Scene3E_SpecDetailLevels /></AbsoluteFill>);
export const Scene3FPreview: React.FC = () => (<AbsoluteFill><Scene3F_SpecFileDemo /></AbsoluteFill>);
export const Scene3GPreview: React.FC = () => (<AbsoluteFill><Scene3G_PauseMoment /></AbsoluteFill>);
export const Scene4APreview: React.FC = () => (<AbsoluteFill><Scene4A_SpecToAnimation /></AbsoluteFill>);
export const Scene4BPreview: React.FC = () => (<AbsoluteFill><Scene4B_ClaudeReads /></AbsoluteFill>);
export const Scene4CPreview: React.FC = () => (<AbsoluteFill><Scene4C_JonnyBurger /></AbsoluteFill>);
export const Scene4DPreview: React.FC = () => (<AbsoluteFill><Scene4D_WebEcosystem /></AbsoluteFill>);
export const Scene4EPreview: React.FC = () => (<AbsoluteFill><Scene4E_WorkflowDemo /></AbsoluteFill>);
export const Scene4FPreview: React.FC = () => (<AbsoluteFill><Scene4F_ComponentLibrary /></AbsoluteFill>);
export const Scene4GPreview: React.FC = () => (<AbsoluteFill><Scene4G_SeparationConcerns /></AbsoluteFill>);
export const Scene5APreview: React.FC = () => (<AbsoluteFill><Scene5A_ExportCapcut /></AbsoluteFill>);
export const Scene5BPreview: React.FC = () => (<AbsoluteFill><Scene5B_EditWork /></AbsoluteFill>);
export const Scene5CPreview: React.FC = () => (<AbsoluteFill><Scene5C_HonestyMoment /></AbsoluteFill>);
export const Scene5DPreview: React.FC = () => (<AbsoluteFill><Scene5D_TimeClarification /></AbsoluteFill>);
export const Scene6APreview: React.FC = () => (<AbsoluteFill><Scene6A_ZoomOut /></AbsoluteFill>);
export const Scene6BPreview: React.FC = () => (<AbsoluteFill><Scene6B_GarageBand /></AbsoluteFill>);
export const Scene6CPreview: React.FC = () => (<AbsoluteFill><Scene6C_Canva /></AbsoluteFill>);
export const Scene6DPreview: React.FC = () => (<AbsoluteFill><Scene6D_ThePattern /></AbsoluteFill>);
export const Scene7APreview: React.FC = () => (<AbsoluteFill><Scene7A_Counterintuitive /></AbsoluteFill>);
export const Scene7BPreview: React.FC = () => (<AbsoluteFill><Scene7B_InvertedU /></AbsoluteFill>);
export const Scene7CPreview: React.FC = () => (<AbsoluteFill><Scene7C_GreenEggsHam /></AbsoluteFill>);
export const Scene7DPreview: React.FC = () => (<AbsoluteFill><Scene7D_Jaws /></AbsoluteFill>);
export const Scene8APreview: React.FC = () => (<AbsoluteFill><Scene8A_FullCircle /></AbsoluteFill>);
export const Scene8BPreview: React.FC = () => (<AbsoluteFill><Scene8B_CreativeWorkMoved /></AbsoluteFill>);
export const Scene9APreview: React.FC = () => (<AbsoluteFill><Scene9A_WhatChanged /></AbsoluteFill>);
export const Scene9BPreview: React.FC = () => (<AbsoluteFill><Scene9B_FinalEmpowerment /></AbsoluteFill>);

export default HowIMakeTheseAnimations;
