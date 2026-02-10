import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUpWithLabel } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  MORPH_TO_BAR: 0,
  BAR_STABLE: 40,
  MODEL_SWAP_START: 40,
  ZOOM_IN: 90,
  COUNTUP_START: 100,
  ZOOM_OUT: 160,
  NOISE_TEXT: 170,
  SECOND_BAR: 220,
  NEEDLE_TEXT: 240,
  SCENE_END: 300,
};

// ── Bar segments ──
const SEGMENTS = [
  { label: '60%', width: 0.6, color: COLORS.techBlue },
  { label: '30%', width: 0.3, color: COLORS.insightOrange },
  { label: '10%', width: 0.1, color: COLORS.aiPurple },
];

const BAR_WIDTH = 900; // total width for the bar
const BAR_HEIGHT = 80;

// ── Stacked horizontal bar ──
const StackedBar: React.FC<{
  frame: number;
  fps: number;
  highlight?: 'ai' | 'database' | null;
  glowDatabase?: boolean;
  yOffset?: number;
}> = ({ frame, fps, highlight = null, glowDatabase = false, yOffset = 0 }) => {
  // Model swap pulsing on AI segment
  const swapActive = frame >= BEATS.MODEL_SWAP_START && highlight !== 'database';
  const swapCycle = swapActive ? Math.floor((frame - BEATS.MODEL_SWAP_START) / 15) % 2 : 0;
  const aiColor = swapCycle === 0 ? '#8B5CF6' : '#7C3AED';

  return (
    <div
      style={{
        display: 'flex',
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        borderRadius: 8,
        overflow: 'hidden',
        transform: `translateY(${yOffset}px)`,
      }}
    >
      {SEGMENTS.map((seg, i) => {
        const segColor = i === 2 ? aiColor : seg.color;
        const isHighlighted =
          (highlight === 'database' && i === 0) ||
          (highlight === 'ai' && i === 2);
        const opacity = highlight === 'database' && i !== 0 ? 0.5 : 1;
        const brightness = isHighlighted ? 1.3 : 1;

        return (
          <div
            key={i}
            style={{
              width: `${seg.width * 100}%`,
              height: '100%',
              backgroundColor: segColor,
              opacity,
              filter: `brightness(${brightness})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow:
                glowDatabase && i === 0
                  ? `0 0 20px ${COLORS.glowBlue}`
                  : 'none',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: i === 2 ? 20 : 26,
                color: '#FFFFFF',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}
            >
              {seg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Scene3_BarBreakdown ──
export const Scene3_BarBreakdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Morph-in animation (bar appears via rotation/spring)
  const morphProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const barRotate = interpolate(morphProgress, [0, 1], [90, 0]);
  const barOpacity = interpolate(morphProgress, [0, 1], [0, 1]);

  // Zoom in on AI section
  const zoomInProgress =
    frame >= BEATS.ZOOM_IN
      ? interpolate(
          spring({
            frame: frame - BEATS.ZOOM_IN,
            fps,
            config: SPRING_CONFIGS.snappy,
          }),
          [0, 1],
          [1, 1.8],
        )
      : 1;

  // Zoom back out
  const zoomOutProgress =
    frame >= BEATS.ZOOM_OUT
      ? interpolate(
          spring({
            frame: frame - BEATS.ZOOM_OUT,
            fps,
            config: SPRING_CONFIGS.gentle,
          }),
          [0, 1],
          [1.8, 1],
        )
      : zoomInProgress;

  const currentScale = frame >= BEATS.ZOOM_OUT ? zoomOutProgress : zoomInProgress;

  // Model A/B toggling when zoomed in
  const showModelToggle = frame >= BEATS.ZOOM_IN && frame < BEATS.ZOOM_OUT;
  const modelToggleCycle = showModelToggle
    ? Math.floor((frame - BEATS.ZOOM_IN) / 20) % 2
    : 0;

  // "Swapping models = noise" text
  const showNoiseText = frame >= BEATS.NOISE_TEXT;
  const noiseProgress = spring({
    frame: Math.max(0, frame - BEATS.NOISE_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const noiseY = interpolate(noiseProgress, [0, 1], [20, 0]);
  const noiseOpacity = interpolate(noiseProgress, [0, 1], [0, 1]);

  // Second bar appearance
  const showSecondBar = frame >= BEATS.SECOND_BAR;
  const secondBarProgress = spring({
    frame: Math.max(0, frame - BEATS.SECOND_BAR),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const secondBarOpacity = interpolate(secondBarProgress, [0, 1], [0, 1]);
  const secondBarY = interpolate(secondBarProgress, [0, 1], [40, 0]);

  // "Improve this to actually move the needle" text
  const showNeedleText = frame >= BEATS.NEEDLE_TEXT;
  const needleProgress = spring({
    frame: Math.max(0, frame - BEATS.NEEDLE_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const needleOpacity = interpolate(needleProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={285}
      fadeOutDuration={15}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* Main bar with zoom */}
        <div
          style={{
            transform: `rotate(${barRotate}deg) scale(${currentScale})`,
            transformOrigin: 'right center',
            opacity: barOpacity,
            position: 'relative',
          }}
        >
          <StackedBar frame={frame} fps={fps} />

          {/* Model A/B toggle label (visible during zoom) */}
          {showModelToggle && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: -40,
                width: `${0.1 * 100}%`,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: COLORS.aiPurple,
                  opacity: 0.9,
                }}
              >
                {modelToggleCycle === 0 ? 'Model A' : 'Model B'}
              </span>
            </div>
          )}
        </div>

        {/* CountUp delta indicator */}
        {frame >= BEATS.COUNTUP_START && frame < BEATS.ZOOM_OUT + 30 && (
          <div style={{ marginTop: 16 }}>
            <CountUpWithLabel
              to={2.7}
              from={0}
              suffix="%"
              decimals={1}
              label="OUTPUT CHANGE"
              labelPosition="bottom"
              startFrame={BEATS.COUNTUP_START}
              fontSize={48}
              color={COLORS.aiPurple}
            />
          </div>
        )}

        {/* "Swapping models = noise" */}
        {showNoiseText && (
          <div
            style={{
              opacity: noiseOpacity,
              transform: `translateY(${noiseY}px)`,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 44,
                color: COLORS.insightOrange,
              }}
            >
              Swapping models = noise
            </span>
          </div>
        )}

        {/* Second bar — database highlighted */}
        {showSecondBar && (
          <div
            style={{
              opacity: secondBarOpacity,
              transform: `translateY(${secondBarY}px)`,
            }}
          >
            <StackedBar
              frame={frame}
              fps={fps}
              highlight="database"
              glowDatabase
            />
          </div>
        )}

        {/* "Improve this to actually move the needle" */}
        {showNeedleText && (
          <div
            style={{
              opacity: needleOpacity,
              textAlign: 'center',
              maxWidth: 860,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.techBlue,
              }}
            >
              Improve this to actually move the needle
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
