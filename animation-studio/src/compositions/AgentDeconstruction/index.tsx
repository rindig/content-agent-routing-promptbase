import React from 'react';
import { Composition, Sequence, AbsoluteFill } from 'remotion';
import { SCENE_DURATIONS, TOTAL_DURATION, FPS, COLORS, seconds } from './constants';
import {
  ColdOpen,
  Section1Agent,
  Section2Orchestration,
  Section3Protocols,
  Section4DataMath,
  Section5Reframe,
  Close,
} from './scenes';
import {
  EthicsEngineInterface,
  ExplodedLayers,
  RatioBar,
  AgentLoop,
  FunctionVsProcess,
  AsyncPipeline,
  JSONFlow,
  ProtocolTimeline,
  MCPArchitecture,
  ParsingPipeline,
  FullStack,
  ScreenFrame,
} from './components';
import { AmbientBackground, Vignette } from '../Memory/components/AmbientBackground';

// Composition config
export const AGENT_CONFIG = {
  durationInFrames: TOTAL_DURATION,
  fps: FPS,
  width: 1920,
  height: 1080,
};

// Preview configs (shorter for quick iteration)
export const PREVIEW_CONFIG = {
  durationInFrames: seconds(10),
  fps: FPS,
  width: 1920,
  height: 1080,
};

// Calculate cumulative frame offsets for each scene
const SCENE_STARTS = {
  coldOpen: 0,
  section1Agent: SCENE_DURATIONS.coldOpen,
  section2Orchestration: SCENE_DURATIONS.coldOpen + SCENE_DURATIONS.section1Agent,
  section3Protocols: SCENE_DURATIONS.coldOpen + SCENE_DURATIONS.section1Agent + SCENE_DURATIONS.section2Orchestration,
  section4DataMath: SCENE_DURATIONS.coldOpen + SCENE_DURATIONS.section1Agent + SCENE_DURATIONS.section2Orchestration + SCENE_DURATIONS.section3Protocols,
  section5Reframe: SCENE_DURATIONS.coldOpen + SCENE_DURATIONS.section1Agent + SCENE_DURATIONS.section2Orchestration + SCENE_DURATIONS.section3Protocols + SCENE_DURATIONS.section4DataMath,
  close: SCENE_DURATIONS.coldOpen + SCENE_DURATIONS.section1Agent + SCENE_DURATIONS.section2Orchestration + SCENE_DURATIONS.section3Protocols + SCENE_DURATIONS.section4DataMath + SCENE_DURATIONS.section5Reframe,
};

/**
 * Main composition for "Reverse-Engineering an AI Agent"
 * Video 3 in the trilogy
 *
 * Total duration: ~16 minutes (28,800 frames at 30fps)
 *
 * Scene breakdown:
 * - Cold Open: 0:00 - 1:15 (75s)
 * - Section 1 Agent: 1:15 - 3:30 (135s)
 * - Section 2 Orchestration: 3:30 - 6:30 (180s)
 * - Section 3 Protocols: 6:30 - 9:30 (180s)
 * - Section 4 Data/Math: 9:30 - 12:00 (150s)
 * - Section 5 Reframe: 12:00 - 15:00 (180s)
 * - Close: 15:00 - 16:00 (60s)
 */
export const AgentDeconstruction: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: Cold Open [0:00 - 1:15] */}
      <Sequence from={SCENE_STARTS.coldOpen} durationInFrames={SCENE_DURATIONS.coldOpen}>
        <ColdOpen />
      </Sequence>

      {/* Scene 2: What We See vs What Is Happening [1:15 - 3:30] */}
      <Sequence from={SCENE_STARTS.section1Agent} durationInFrames={SCENE_DURATIONS.section1Agent}>
        <Section1Agent />
      </Sequence>

      {/* Scene 3: The Orchestration Layer [3:30 - 6:30] */}
      <Sequence from={SCENE_STARTS.section2Orchestration} durationInFrames={SCENE_DURATIONS.section2Orchestration}>
        <Section2Orchestration />
      </Sequence>

      {/* Scene 4: How Systems Talk [6:30 - 9:30] */}
      <Sequence from={SCENE_STARTS.section3Protocols} durationInFrames={SCENE_DURATIONS.section3Protocols}>
        <Section3Protocols />
      </Sequence>

      {/* Scene 5: The Data and The Math [9:30 - 12:00] - THE RATIO REVEAL */}
      <Sequence from={SCENE_STARTS.section4DataMath} durationInFrames={SCENE_DURATIONS.section4DataMath}>
        <Section4DataMath />
      </Sequence>

      {/* Scene 6: The Reframe [12:00 - 15:00] */}
      <Sequence from={SCENE_STARTS.section5Reframe} durationInFrames={SCENE_DURATIONS.section5Reframe}>
        <Section5Reframe />
      </Sequence>

      {/* Scene 7: Close [15:00 - 16:00] */}
      <Sequence from={SCENE_STARTS.close} durationInFrames={SCENE_DURATIONS.close}>
        <Close />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Preview composition for Cold Open only
 */
export const AgentColdOpenPreview: React.FC = () => {
  return <ColdOpen />;
};

/**
 * Preview composition for the ExplodedLayers component
 */
export const ExplodedLayersPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.accent}
        particleCount={20}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ExplodedLayers
          startFrame={0}
          explodeAmount={0.8}
          showPercentages={true}
        />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for the RatioBar component
 */
export const RatioBarPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.dataProcessing}
        particleCount={15}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RatioBar startFrame={0} width={900} height={70} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for the Agent Loop diagram
 */
export const AgentLoopPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.orchestration}
        particleCount={20}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AgentLoop startFrame={0} showAnnotation={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for the Function vs Process comparison
 */
export const FunctionVsProcessPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.accent}
        particleCount={15}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FunctionVsProcess startFrame={0} showComparison="both" />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for the Ethics Engine Interface
 */
export const EthicsEnginePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.ethicsAccent}
        particleCount={25}
        gradientDirection="radial"
        gradientColor="#0F0A1A"
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <EthicsEngineInterface startFrame={0} showResults={true} explodeProgress={0} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for AsyncPipeline
 */
export const AsyncPipelinePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.orchestration}
        particleCount={20}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AsyncPipeline startFrame={0} showLabels={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for ProtocolTimeline
 */
export const ProtocolTimelinePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.dataProcessing}
        particleCount={20}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ProtocolTimeline startFrame={0} showSolution={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for MCPArchitecture
 */
export const MCPArchitecturePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.mcp}
        particleCount={20}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <MCPArchitecture startFrame={0} showFlow={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for ParsingPipeline
 */
export const ParsingPipelinePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.dataProcessing}
        particleCount={20}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ParsingPipeline startFrame={0} showScoring={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for FullStack
 */
export const FullStackPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.accent}
        particleCount={20}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FullStack startFrame={0} buildSequence={true} showEthicsEngine={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Preview composition for ScreenFrame (video placeholder)
 * This shows the monitor frame where real footage can be composited in CapCut
 */
export const ScreenFramePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AmbientBackground
        color={COLORS.background}
        particleColor={COLORS.ethicsAccent}
        particleCount={25}
        gradientDirection="radial"
        gradientColor="#0F0A1A"
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ScreenFrame startFrame={0} explodeProgress={0} showStatusBar={true} />
      </AbsoluteFill>
      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

/**
 * Individual Scene Preview compositions
 */
export const Section1Preview: React.FC = () => <Section1Agent />;
export const Section2Preview: React.FC = () => <Section2Orchestration />;
export const Section3Preview: React.FC = () => <Section3Protocols />;
export const Section4Preview: React.FC = () => <Section4DataMath />;
export const Section5Preview: React.FC = () => <Section5Reframe />;
export const ClosePreview: React.FC = () => <Close />;

export default AgentDeconstruction;
