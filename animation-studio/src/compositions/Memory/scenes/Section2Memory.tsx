import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  MemoryPyramid,
  CodeDataBoundary,
  AmbientBackground,
  Vignette,
  AnimatedLine,
  MemoryLayerDetail,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (180 seconds = 5400 frames at 30fps)
const BEATS = {
  // Beat 1: Pyramid appears
  PYRAMID_IN: 0,
  PYRAMID_VISIBLE: 90,

  // Beat 2: Registers
  REGISTERS_START: 300,
  REGISTERS_END: 750,

  // Beat 3: Cache
  CACHE_START: 750,
  CACHE_END: 1200,

  // Beat 4: RAM
  RAM_START: 1200,
  RAM_END: 1800,

  // Beat 5: Disk + Archive
  DISK_START: 1800,
  DISK_END: 2400,

  // Beat 6: Tradeoff summary
  TRADEOFF_START: 2400,
  TRADEOFF_END: 3300,

  // Beat 7: Code vs Data boundary
  BOUNDARY_START: 3300,
  BREACH_START: 4200,
  BOUNDARY_END: 4800,

  // Beat 8: Transition
  TRANSITION_START: 4800,
  SCENE_END: 5400,
};

// Layer descriptions
const LAYER_INFO: Record<string, { title: string; desc: string; stat: string }> = {
  registers: {
    title: 'Registers',
    desc: 'The fastest memory in your computer. Directly inside the CPU.',
    stat: '64 bits each • Single cycle access',
  },
  cache: {
    title: 'Cache',
    desc: 'Small, fast memory that predicts what you will need next.',
    stat: 'Kilobytes to Megabytes • ~10 cycles',
  },
  ram: {
    title: 'RAM',
    desc: 'Working memory. Everything your programs actively use lives here.',
    stat: 'Gigabytes • ~100 cycles',
  },
  disk: {
    title: 'Disk / SSD',
    desc: 'Persistent storage. Survives power off.',
    stat: 'Terabytes • ~10,000 cycles',
  },
  archive: {
    title: 'Archive',
    desc: 'Cold storage. Tape drives, offline backups.',
    stat: 'Petabytes • ~1,000,000 cycles',
  },
};

export const Section2Memory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which layer to highlight based on frame
  const getHighlightedLayer = (): string | undefined => {
    if (frame >= BEATS.REGISTERS_START && frame < BEATS.CACHE_START) return 'registers';
    if (frame >= BEATS.CACHE_START && frame < BEATS.RAM_START) return 'cache';
    if (frame >= BEATS.RAM_START && frame < BEATS.DISK_START) return 'ram';
    if (frame >= BEATS.DISK_START && frame < BEATS.TRADEOFF_START) return 'disk';
    return undefined;
  };

  const highlightedLayer = getHighlightedLayer();
  const currentInfo = highlightedLayer ? LAYER_INFO[highlightedLayer] : null;

  // Show different sections
  const showPyramid = frame < BEATS.BOUNDARY_START;
  const showBoundary = frame >= BEATS.BOUNDARY_START && frame < BEATS.TRANSITION_START;
  const showTransition = frame >= BEATS.TRANSITION_START;

  // Tradeoff section
  const showTradeoff = frame >= BEATS.TRADEOFF_START && frame < BEATS.BOUNDARY_START;
  const showDataFlow = showTradeoff;

  // Info panel animation
  const infoProgress = highlightedLayer
    ? spring({
        frame: frame - (BEATS[`${highlightedLayer.toUpperCase()}_START` as keyof typeof BEATS] || 0),
        fps,
        config: SPRING_CONFIGS.snappy,
      })
    : 0;

  // Boundary animations
  const boundaryProgress = spring({
    frame: frame - BEATS.BOUNDARY_START,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Transition text
  const transitionProgress = spring({
    frame: frame - BEATS.TRANSITION_START,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  return (
    <AbsoluteFill>
      <AmbientBackground
        color={COLORS.background}
        particleCount={15}
        particleColor="#22c55e"
        gradientDirection="bottom"
        gradientColor="#0a1a0f"
      />
      <Vignette intensity={0.4} />

      {/* Pyramid intro - no layer selected */}
      {showPyramid && !highlightedLayer && !showTradeoff && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <MemoryPyramid
            startFrame={BEATS.PYRAMID_IN}
            highlightLayer={undefined}
            showStats={false}
            showSideLabels={true}
            showDataFlow={false}
          />
        </AbsoluteFill>
      )}

      {/* Pyramid with layer detail - when a specific layer is highlighted */}
      {showPyramid && highlightedLayer && !showTradeoff && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4%',
          }}
        >
          {/* Smaller pyramid at top */}
          <div style={{ transform: 'scale(0.6)', marginBottom: -60 }}>
            <MemoryPyramid
              startFrame={BEATS.PYRAMID_IN}
              highlightLayer={highlightedLayer}
              showStats={false}
              showSideLabels={false}
              showDataFlow={false}
            />
          </div>

          {/* Detailed layer info below */}
          <MemoryLayerDetail
            layer={highlightedLayer as 'registers' | 'cache' | 'ram' | 'disk'}
            startFrame={BEATS[`${highlightedLayer.toUpperCase()}_START` as keyof typeof BEATS] as number}
          />
        </AbsoluteFill>
      )}

      {/* Tradeoff section with pyramid and data flow */}
      {showPyramid && showTradeoff && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          {/* Scaled pyramid at top */}
          <div style={{ transform: 'scale(0.55)', marginBottom: -100 }}>
            <MemoryPyramid
              startFrame={BEATS.PYRAMID_IN}
              highlightLayer={undefined}
              showStats={false}
              showSideLabels={false}
              showDataFlow={true}
            />
          </div>

          {/* Tradeoff text below */}
          <div style={{ textAlign: 'center', maxWidth: 800 }}>
            <AnimatedLine
              startFrame={BEATS.TRADEOFF_START}
              wordDelay={4}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Fast: { color: '#ef4444', weight: 700 },
                expensive: { color: '#ef4444', weight: 600 },
                small: { color: '#ef4444', weight: 600 },
              }}
            >
              Fast memory is expensive and small
            </AnimatedLine>

            <div style={{ marginTop: 24 }}>
              <AnimatedLine
                startFrame={BEATS.TRADEOFF_START + 60}
                wordDelay={4}
                fontSize={48}
                color={COLORS.textPrimary}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  Cheap: { color: '#22c55e', weight: 700 },
                  slow: { color: '#22c55e', weight: 600 },
                  large: { color: '#22c55e', weight: 600 },
                }}
              >
                Cheap memory is slow and large
              </AnimatedLine>
            </div>

            <div style={{ marginTop: 40 }}>
              <AnimatedLine
                startFrame={BEATS.TRADEOFF_START + 150}
                wordDelay={5}
                fontSize={32}
                color={COLORS.textMuted}
                fontFamily={TYPOGRAPHY.body.fontFamily}
              >
                This tradeoff shapes everything in computing
              </AnimatedLine>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Code vs Data Boundary section */}
      {showBoundary && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: interpolate(boundaryProgress, [0, 1], [0, 1]),
          }}
        >
          <AnimatedLine
            startFrame={BEATS.BOUNDARY_START}
            wordDelay={4}
            fontSize={48}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              hard: { color: COLORS.warning, weight: 700 },
              boundary: { color: COLORS.warning, weight: 700 },
              code: { color: COLORS.accentSecondary, weight: 600 },
              data: { color: COLORS.success, weight: 600 },
            }}
            style={{ marginBottom: 60 }}
          >
            In all of this there is a hard boundary between code and data
          </AnimatedLine>

          <CodeDataBoundary
            startFrame={BEATS.BOUNDARY_START + 60}
            showBreach={frame >= BEATS.BREACH_START}
            breachFrame={BEATS.BREACH_START}
          />

          {frame >= BEATS.BREACH_START + 60 && (
            <div style={{ marginTop: 50 }}>
              <AnimatedLine
                startFrame={BEATS.BREACH_START + 60}
                wordDelay={5}
                fontSize={32}
                color={COLORS.textMuted}
                fontFamily={TYPOGRAPHY.body.fontFamily}
                emphasis={{
                  security: { color: '#ef4444', weight: 600 },
                  vulnerabilities: { color: '#ef4444', weight: 600 },
                }}
              >
                Cross this boundary incorrectly and you get security vulnerabilities
              </AnimatedLine>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Transition: "Until it isn't" */}
      {showTransition && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: interpolate(transitionProgress, [0, 1], [0, 1]),
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 300,
              color: COLORS.text,
              textAlign: 'center',
            }}
          >
            <AnimatedLine
              startFrame={BEATS.TRANSITION_START}
              wordDelay={15}
              fontSize={80}
              color={COLORS.text}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Until: { weight: 300 },
                it: { weight: 300 },
                "isn't.": { color: COLORS.accent, weight: 600, glow: true },
              }}
            >
              Until it isn't.
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Section2Memory;
