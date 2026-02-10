import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { Timeline } from '../../../components';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SPINE_DRAW: 0,
  NODES_START: 20,
  NODE_STAGGER: 6,
  LIGHT_SWEEP: 40,
  COMPRESS_UP: 80,
  LINE_1_IN: 120,
  LINE_1_STAGGER: 4,
  LINE_2_IN: 170,
  LINE_2_STAGGER: 5,
  HOLD_START: 210,
  FADE_OUT: 285,
};

// Timeline nodes
const TIMELINE_NODES = [
  { year: '1804', label: 'Punched Cards', color: COLORS.historyGold },
  { year: '1940s', label: 'Vacuum Tubes', color: COLORS.historyGold },
  { year: '1960s', label: 'Transistors', color: COLORS.techBlue },
  { year: '2010s', label: 'Neural Nets', color: COLORS.aiPurple },
  { year: '2026', label: '?', color: COLORS.insightOrange },
];

// ── Light Sweep Animation ──
const LightSweep: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.LIGHT_SWEEP;
  if (relFrame < 0 || relFrame > 30) return null;

  // Sweep from left to right over 20 frames
  const sweepProgress = interpolate(
    relFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const dotX = interpolate(sweepProgress, [0, 1], [10, 90]);
  const dotOpacity = interpolate(
    relFrame,
    [0, 5, 15, 20],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${dotX}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          opacity: dotOpacity,
          boxShadow: '0 0 20px 8px rgba(255,255,255,0.6)',
        }}
      />
    </div>
  );
};

// ── Node Flare Effect ──
const NodeFlares: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const sweepRel = frame - BEATS.LIGHT_SWEEP;
  if (sweepRel < 0 || sweepRel > 30) return null;

  // As sweep passes each node position, it flares
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        pointerEvents: 'none',
        padding: '0 32px',
      }}
    >
      {TIMELINE_NODES.map((node, i) => {
        // Each node flares when sweep reaches its position
        const nodePosition = i / (TIMELINE_NODES.length - 1);
        const sweepPosition = interpolate(
          sweepRel,
          [0, 20],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const distance = Math.abs(sweepPosition - nodePosition);
        const flareIntensity = interpolate(
          distance,
          [0, 0.15],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const flareScale = interpolate(flareIntensity, [0, 1], [1, 1.3]);

        return (
          <div
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: node.color,
              transform: `scale(${flareScale})`,
              boxShadow:
                flareIntensity > 0
                  ? `0 0 ${20 * flareIntensity}px ${node.color}`
                  : 'none',
              opacity: flareIntensity > 0 ? 0.8 : 0,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Scene5_Closing ──
export const Scene5_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline compress up after light sweep
  const compressRel = frame - BEATS.COMPRESS_UP;
  const compressProgress =
    compressRel >= 0
      ? spring({ frame: compressRel, fps, config: SPRING_CONFIGS.slow })
      : 0;
  const timelineScale = interpolate(compressProgress, [0, 1], [1, 0.6]);
  const timelineY = interpolate(compressProgress, [0, 1], [0, -200]);

  // Spine draw animation
  const spineDrawProgress = interpolate(
    frame,
    [BEATS.SPINE_DRAW, BEATS.SPINE_DRAW + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Last node pulse (2026 / "?")
  const lastNodePulse =
    frame >= BEATS.HOLD_START
      ? 1 + 0.15 * Math.sin((frame - BEATS.HOLD_START) * 0.12)
      : 1;

  // Final fade out
  const fadeOut = interpolate(
    frame,
    [BEATS.FADE_OUT, BEATS.FADE_OUT + 15],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={15}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          opacity: fadeOut,
        }}
      >
        {/* Timeline area */}
        <div
          style={{
            position: 'absolute',
            top: 500,
            left: 0,
            right: 0,
            transform: `scale(${timelineScale}) translateY(${timelineY}px)`,
            transformOrigin: 'center top',
          }}
        >
          {/* Spine line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '5%',
              right: '5%',
              height: 2,
              backgroundColor: `${COLORS.historyGold}80`,
              transform: 'translateY(-50%)',
              transformOrigin: 'left center',
              clipPath: `inset(0 ${(1 - spineDrawProgress) * 100}% 0 0)`,
            }}
          />

          {/* Timeline nodes */}
          <div style={{ position: 'relative' }}>
            <Timeline
              nodes={TIMELINE_NODES}
              startFrame={BEATS.NODES_START}
              staggerDelay={BEATS.NODE_STAGGER}
              activeIndex={4}
            />
          </div>

          {/* Light sweep effect */}
          <LightSweep frame={frame} fps={fps} />
        </div>

        {/* Closing text area */}
        <div
          style={{
            position: 'absolute',
            bottom: 350,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 32,
            padding: '0 54px',
          }}
        >
          {/* Line 1: "It was never about the electronics." */}
          {frame >= BEATS.LINE_1_IN && (
            <div style={{ textAlign: 'center' }}>
              <BlurText
                startFrame={BEATS.LINE_1_IN}
                animateBy="words"
                direction="bottom"
                staggerDelay={BEATS.LINE_1_STAGGER}
                blurAmount={8}
                distance={20}
                fontSize={44}
              >
                It was never about the electronics.
              </BlurText>
            </div>
          )}

          {/* Line 2: "It's about the patterns." */}
          {frame >= BEATS.LINE_2_IN && (
            <div
              style={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.closingText,
                  fontSize: 44,
                  color: COLORS.textPrimary,
                  opacity: (() => {
                    const rel = frame - BEATS.LINE_2_IN;
                    return interpolate(rel, [0, 15], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });
                  })(),
                  filter: `blur(${interpolate(
                    frame - BEATS.LINE_2_IN,
                    [0, 15],
                    [8, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}px)`,
                  transform: `translateY(${interpolate(
                    frame - BEATS.LINE_2_IN,
                    [0, 15],
                    [20, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}px)`,
                }}
              >
                It's about
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.closingText,
                  fontSize: 44,
                  color: COLORS.historyGold,
                  opacity: (() => {
                    const rel = frame - BEATS.LINE_2_IN - 10;
                    return interpolate(Math.max(0, rel), [0, 15], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });
                  })(),
                  filter: `blur(${interpolate(
                    Math.max(0, frame - BEATS.LINE_2_IN - 10),
                    [0, 15],
                    [8, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}px)`,
                  transform: `translateY(${interpolate(
                    Math.max(0, frame - BEATS.LINE_2_IN - 10),
                    [0, 15],
                    [20, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  )}px)`,
                }}
              >
                the patterns.
              </span>
            </div>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
