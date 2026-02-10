import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SPARK_PLUG_IN: 0,
  DEBATE_TOP: 40,
  DEBATE_BOTTOM: 55,
  PULLBACK_START: 70,
  PULLBACK_END: 110,
  ENGINE_LABELS_START: 120,
  ENGINE_LABELS_END: 180,
  DEBATE_FADE: 180,
  CALLOUT_TEXT: 200,
  ENGINE_PULSE: 210,
  SCENE_END: 240,
};

// ── Engine component labels ──
const ENGINE_PARTS: Array<{
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}> = [
  { label: 'Fuel system', color: COLORS.techBlue, x: 80, y: 100, width: 260, height: 140 },
  { label: 'Transmission', color: COLORS.solutionGreen, x: 400, y: 80, width: 220, height: 160 },
  { label: 'Cooling', color: COLORS.insightOrange, x: 680, y: 120, width: 200, height: 120 },
  { label: 'Exhaust', color: COLORS.textMuted, x: 300, y: 340, width: 380, height: 100 },
];

// ── Spark plug SVG (geometric) ──
const SparkPlug: React.FC<{ size: number; sparkOpacity?: number }> = ({
  size,
  sparkOpacity = 1,
}) => {
  const scale = size / 200; // baseline 200px

  return (
    <svg
      width={80 * scale}
      height={200 * scale}
      viewBox="0 0 80 200"
      fill="none"
    >
      {/* Hexagonal top (terminal) */}
      <polygon
        points="20,10 60,10 70,30 60,50 20,50 10,30"
        fill={COLORS.textMuted}
        stroke={COLORS.textDim}
        strokeWidth={1.5}
      />

      {/* Insulator (ceramic body) */}
      <rect
        x={25}
        y={50}
        width={30}
        height={60}
        rx={4}
        fill="#6B7280"
        stroke={COLORS.textDim}
        strokeWidth={1}
      />

      {/* Threaded shaft */}
      <rect x={30} y={110} width={20} height={50} fill={COLORS.textMuted} />
      {/* Thread lines */}
      {[0, 8, 16, 24, 32, 40].map((offset) => (
        <line
          key={offset}
          x1={30}
          y1={112 + offset}
          x2={50}
          y2={116 + offset}
          stroke={COLORS.textDim}
          strokeWidth={0.8}
          opacity={0.5}
        />
      ))}

      {/* Ground electrode */}
      <path
        d="M 30 160 L 30 180 L 50 180"
        stroke={COLORS.textMuted}
        strokeWidth={3}
        fill="none"
      />

      {/* Center electrode */}
      <rect x={37} y={155} width={6} height={20} fill={COLORS.textMuted} />

      {/* Spark gap glow */}
      <circle
        cx={43}
        cy={177}
        r={6}
        fill={COLORS.insightOrange}
        opacity={sparkOpacity * 0.8}
      />
      <circle
        cx={43}
        cy={177}
        r={12}
        fill={COLORS.insightOrange}
        opacity={sparkOpacity * 0.3}
      />
    </svg>
  );
};

// ── Debate bubble ──
const DebateBubble: React.FC<{
  text: string;
  borderColor: string;
  frame: number;
  fps: number;
  enterFrame: number;
}> = ({ text, borderColor, frame, fps, enterFrame }) => {
  const relFrame = frame - enterFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.5, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Fade out at DEBATE_FADE
  const fadeOut = interpolate(
    frame,
    [BEATS.DEBATE_FADE, BEATS.DEBATE_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        border: `2px solid ${borderColor}`,
        borderRadius: 16,
        padding: '16px 24px',
        opacity: opacity * fadeOut,
        transform: `scale(${scale})`,
        maxWidth: 400,
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.body,
          fontSize: 40,
          color: COLORS.textBody,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ── Scene4_SparkPlug ──
export const Scene4_SparkPlug: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spark plug entrance
  const plugProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const plugScale = interpolate(plugProgress, [0, 1], [0.3, 1]);
  const plugOpacity = interpolate(plugProgress, [0, 1], [0, 1]);

  // Pullback: everything shrinks to reveal engine
  const pullbackActive = frame >= BEATS.PULLBACK_START;
  const pullbackProgress = pullbackActive
    ? spring({
        frame: frame - BEATS.PULLBACK_START,
        fps,
        config: SPRING_CONFIGS.slow,
      })
    : 0;
  const overallScale = interpolate(pullbackProgress, [0, 1], [1, 0.25]);
  const engineOpacity = interpolate(pullbackProgress, [0, 1], [0, 1]);

  // Engine pulse at end
  const enginePulseScale =
    frame >= BEATS.ENGINE_PULSE
      ? 1 +
        interpolate(
          spring({
            frame: frame - BEATS.ENGINE_PULSE,
            fps,
            config: SPRING_CONFIGS.slow,
          }),
          [0, 0.5, 1],
          [0, 0.01, 0],
        )
      : 1;

  // Callout text
  const showCallout = frame >= BEATS.CALLOUT_TEXT;
  const calloutProgress = spring({
    frame: Math.max(0, frame - BEATS.CALLOUT_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const calloutOpacity = interpolate(calloutProgress, [0, 1], [0, 1]);

  // Spark flicker
  const sparkFlicker = Math.sin(frame * 0.8) * 0.3 + 0.7;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={225}
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
          position: 'relative',
        }}
      >
        {/* Engine outline (revealed on pullback) */}
        {pullbackActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: engineOpacity,
              transform: `scale(${enginePulseScale})`,
            }}
          >
            <svg width={960} height={520} viewBox="0 0 960 520" fill="none">
              {/* Engine block outline */}
              <rect
                x={60}
                y={60}
                width={840}
                height={400}
                rx={20}
                stroke={COLORS.textMuted}
                strokeWidth={2}
                opacity={0.4}
              />

              {/* Cylinder outlines */}
              {[160, 340, 520, 700].map((cx) => (
                <rect
                  key={cx}
                  x={cx}
                  y={100}
                  width={80}
                  height={160}
                  rx={8}
                  stroke={COLORS.textDim}
                  strokeWidth={1.5}
                  opacity={0.3}
                />
              ))}

              {/* Header pipes */}
              <path
                d="M 80 200 Q 60 200, 60 220 L 60 300"
                stroke={COLORS.textDim}
                strokeWidth={1.5}
                opacity={0.3}
              />
              <path
                d="M 880 200 Q 900 200, 900 220 L 900 300"
                stroke={COLORS.textDim}
                strokeWidth={1.5}
                opacity={0.3}
              />
            </svg>

            {/* Engine part labels */}
            {ENGINE_PARTS.map((part, i) => {
              const labelDelay =
                BEATS.ENGINE_LABELS_START + i * 5 - BEATS.PULLBACK_START;
              const labelRelFrame = frame - BEATS.PULLBACK_START - labelDelay;
              if (labelRelFrame < 0 || frame < BEATS.ENGINE_LABELS_START) return null;

              const labelProgress = spring({
                frame: Math.max(0, frame - (BEATS.ENGINE_LABELS_START + i * 5)),
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

              // Border opacity pulse
              const borderPulse = interpolate(
                labelProgress,
                [0, 0.5, 1],
                [0.4, 0.8, 0.5],
              );

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `calc(50% - 480px + ${part.x}px)`,
                    top: `calc(50% - 260px + ${part.y}px)`,
                    width: part.width,
                    height: part.height,
                    border: `1.5px solid ${part.color}`,
                    borderRadius: 8,
                    opacity: labelOpacity * borderPulse,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 24,
                      color: part.color,
                      opacity: labelOpacity,
                    }}
                  >
                    {part.label}
                  </span>
                </div>
              );
            })}

            {/* Spark plug label (tiny) */}
            {frame >= BEATS.ENGINE_LABELS_START + 20 && (
              <div
                style={{
                  position: 'absolute',
                  left: 'calc(50% - 30px)',
                  top: 'calc(50% - 40px)',
                  opacity: interpolate(
                    spring({
                      frame: Math.max(0, frame - (BEATS.ENGINE_LABELS_START + 20)),
                      fps,
                      config: SPRING_CONFIGS.gentle,
                    }),
                    [0, 1],
                    [0, 1],
                  ),
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 20,
                    color: COLORS.aiPurple,
                  }}
                >
                  Spark plug
                </span>
              </div>
            )}
          </div>
        )}

        {/* Spark plug + debate bubbles (scale down on pullback) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            transform: `scale(${plugScale * overallScale})`,
            opacity: plugOpacity,
            zIndex: 10,
          }}
        >
          {/* Top debate bubble */}
          <DebateBubble
            text={'"Iridium is better!"'}
            borderColor={COLORS.techBlue}
            frame={frame}
            fps={fps}
            enterFrame={BEATS.DEBATE_TOP}
          />

          {/* Spark plug */}
          <SparkPlug size={300} sparkOpacity={sparkFlicker} />

          {/* Bottom debate bubble */}
          <DebateBubble
            text={'"No, platinum!"'}
            borderColor={COLORS.insightOrange}
            frame={frame}
            fps={fps}
            enterFrame={BEATS.DEBATE_BOTTOM}
          />
        </div>

        {/* Callout: "This is the model debate" */}
        {showCallout && (
          <div
            style={{
              position: 'absolute',
              bottom: 200,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: calloutOpacity,
              zIndex: 20,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.insightOrange,
              }}
            >
              This is the model debate
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
