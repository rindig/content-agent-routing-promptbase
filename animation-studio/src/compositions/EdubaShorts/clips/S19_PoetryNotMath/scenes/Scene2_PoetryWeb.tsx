import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  CHATS_SHRINK: 0,
  CENTER_NODE: 30,
  RING_1: 60,
  RING_2: 90,
  RING_3: 100,
  SIGNALS_START: 120,
  LABEL_IN: 160,
  SENTENCE_GEN: 160,
  TRAINING_DATA: 200,
  HOLD: 240,
};

// ── Node data ──
interface WebNode {
  label: string;
  ring: 1 | 2 | 3;
  angle: number; // degrees
  radius: number;
  size: number;
}

const NODES: WebNode[] = [
  // Ring 1 — strong connections
  { label: 'waves', ring: 1, angle: 0, radius: 160, size: 32 },
  { label: 'tide', ring: 1, angle: 72, radius: 155, size: 32 },
  { label: 'shore', ring: 1, angle: 144, radius: 165, size: 32 },
  { label: 'salt', ring: 1, angle: 216, radius: 150, size: 32 },
  { label: 'deep', ring: 1, angle: 288, radius: 170, size: 32 },
  // Ring 2 — weaker connections
  { label: 'moon', ring: 2, angle: 30, radius: 280, size: 24 },
  { label: 'silver', ring: 2, angle: 90, radius: 290, size: 24 },
  { label: 'night', ring: 2, angle: 150, radius: 275, size: 24 },
  { label: 'breath', ring: 2, angle: 210, radius: 295, size: 24 },
  { label: 'remember', ring: 2, angle: 260, radius: 270, size: 24 },
  { label: 'song', ring: 2, angle: 330, radius: 285, size: 24 },
  // Ring 3 — distant poetic associations
  { label: 'longing', ring: 3, angle: 50, radius: 380, size: 16 },
  { label: 'infinity', ring: 3, angle: 140, radius: 390, size: 16 },
  { label: 'whisper', ring: 3, angle: 230, radius: 375, size: 16 },
  { label: 'ancient', ring: 3, angle: 310, radius: 385, size: 16 },
];

// Cross-links between Ring 2 nodes (indices within NODES)
const CROSS_LINKS: [number, number][] = [
  [5, 6], // moon-silver
  [7, 8], // night-breath
  [9, 10], // remember-song
];

// Center of the web
const CX = 540;
const CY = 760;

// Convert polar to cartesian
const toXY = (angle: number, radius: number) => ({
  x: CX + radius * Math.cos((angle * Math.PI) / 180),
  y: CY + radius * Math.sin((angle * Math.PI) / 180),
});

// ── Signal dot traveling along a path ──
const Signal: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  frame: number;
  startFrame: number;
  speed: number;
}> = ({ x1, y1, x2, y2, frame, startFrame, speed }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const cycleDuration = speed;
  const t = (relFrame % cycleDuration) / cycleDuration;
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  const opacity = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <circle cx={x} cy={y} r={3} fill="#FFFFFF" opacity={opacity * 0.8} />
  );
};

// ── Typewriter text (simple) ──
const TypewriterSpan: React.FC<{
  text: string;
  frame: number;
  startFrame: number;
  speed: number;
  style?: React.CSSProperties;
}> = ({ text, frame, startFrame, speed, style }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const visibleChars = Math.min(text.length, Math.floor(relFrame / speed));
  return <span style={style}>{text.slice(0, visibleChars)}</span>;
};

// ── Scene2_PoetryWeb ──
export const Scene2_PoetryWeb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center node entrance
  const centerProgress = spring({
    frame: Math.max(0, frame - BEATS.CENTER_NODE),
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const centerScale = interpolate(centerProgress, [0, 1], [0, 1]);
  const centerOpacity = interpolate(centerProgress, [0, 1], [0, 1]);

  // Label entrance
  const labelProgress = spring({
    frame: Math.max(0, frame - BEATS.LABEL_IN),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);

  // Training data label
  const trainingProgress = spring({
    frame: Math.max(0, frame - BEATS.TRAINING_DATA),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const trainingOpacity = interpolate(trainingProgress, [0, 1], [0, 1]);
  const trainingY = interpolate(trainingProgress, [0, 1], [20, 0]);

  // Generated sentence glow (after HOLD)
  const glowPulse =
    frame >= BEATS.HOLD
      ? 0.3 + 0.1 * Math.sin((frame - BEATS.HOLD) * 0.05)
      : 0;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* SVG Constellation */}
        <svg
          width={1080}
          height={1920}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {/* Connection lines from center to nodes */}
          {NODES.map((node, i) => {
            const ringBeat =
              node.ring === 1
                ? BEATS.RING_1
                : node.ring === 2
                ? BEATS.RING_2
                : BEATS.RING_3;

            const stagger =
              node.ring === 1
                ? i * 4
                : node.ring === 2
                ? (i - 5) * 3
                : (i - 11) * 3;

            const lineProgress = spring({
              frame: Math.max(0, frame - (ringBeat + stagger)),
              fps,
              config: SPRING_CONFIGS.gentle,
            });

            if (lineProgress <= 0) return null;

            const pos = toXY(node.angle, node.radius);
            const lineOpacity =
              node.ring === 1 ? 0.8 : node.ring === 2 ? 0.4 : 0.2;
            const lineWidth =
              node.ring === 1 ? 2 : node.ring === 2 ? 1 : 1;
            const dashArray =
              node.ring === 3 ? '4,4' : 'none';

            // Animate line drawing with dashoffset
            const dx = pos.x - CX;
            const dy = pos.y - CY;
            const lineLength = Math.sqrt(dx * dx + dy * dy);
            const dashOffset = lineLength * (1 - lineProgress);

            return (
              <line
                key={`line-${i}`}
                x1={CX}
                y1={CY}
                x2={pos.x}
                y2={pos.y}
                stroke={COLORS.aiPurple}
                strokeWidth={lineWidth}
                opacity={lineOpacity * lineProgress}
                strokeDasharray={
                  dashArray === 'none' ? lineLength : dashArray
                }
                strokeDashoffset={
                  dashArray === 'none' ? dashOffset : 0
                }
              />
            );
          })}

          {/* Cross-links between Ring 2 nodes */}
          {CROSS_LINKS.map(([a, b], i) => {
            const crossProgress = spring({
              frame: Math.max(0, frame - (BEATS.RING_2 + 20 + i * 5)),
              fps,
              config: SPRING_CONFIGS.gentle,
            });
            if (crossProgress <= 0) return null;

            const posA = toXY(NODES[a].angle, NODES[a].radius);
            const posB = toXY(NODES[b].angle, NODES[b].radius);

            return (
              <line
                key={`cross-${i}`}
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke={COLORS.aiPurple}
                strokeWidth={1}
                opacity={0.25 * crossProgress}
              />
            );
          })}

          {/* Signal dots traveling along connections */}
          {frame >= BEATS.SIGNALS_START &&
            NODES.slice(0, 8).map((node, i) => {
              const pos = toXY(node.angle, node.radius);
              return (
                <Signal
                  key={`sig-${i}`}
                  x1={CX}
                  y1={CY}
                  x2={pos.x}
                  y2={pos.y}
                  frame={frame}
                  startFrame={BEATS.SIGNALS_START + i * 8}
                  speed={30 + i * 5}
                />
              );
            })}

          {/* Center node */}
          {frame >= BEATS.CENTER_NODE && (
            <>
              {/* Glow */}
              <circle
                cx={CX}
                cy={CY}
                r={80}
                fill={COLORS.aiPurple}
                opacity={0.2 * centerOpacity}
              />
              {/* Node circle */}
              <circle
                cx={CX}
                cy={CY}
                r={48}
                fill={COLORS.aiPurple}
                stroke="#FFFFFF"
                strokeWidth={2}
                opacity={centerOpacity}
                transform={`translate(${CX * (1 - centerScale)}, ${
                  CY * (1 - centerScale)
                }) scale(${centerScale})`}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
              {/* Label */}
              <text
                x={CX}
                y={CY + 7}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={24}
                fontFamily={TYPOGRAPHY.code.fontFamily}
                opacity={centerOpacity}
              >
                ocean
              </text>
            </>
          )}

          {/* Outer nodes */}
          {NODES.map((node, i) => {
            const ringBeat =
              node.ring === 1
                ? BEATS.RING_1
                : node.ring === 2
                ? BEATS.RING_2
                : BEATS.RING_3;

            const stagger =
              node.ring === 1
                ? i * 4
                : node.ring === 2
                ? (i - 5) * 3
                : (i - 11) * 3;

            const nodeProgress = spring({
              frame: Math.max(0, frame - (ringBeat + stagger)),
              fps,
              config: SPRING_CONFIGS.gentle,
            });

            if (nodeProgress <= 0) return null;

            const pos = toXY(node.angle, node.radius);
            const fillOpacity =
              node.ring === 1 ? 0.6 : node.ring === 2 ? 0.3 : 0.15;

            // Pulse effect when sentence is generating and word matches
            const generatedWords = [
              'ocean',
              'speaks',
              'silver',
              'tongues',
            ];
            const isPulsing =
              frame >= BEATS.SENTENCE_GEN &&
              generatedWords.some(
                (w) => w.toLowerCase() === node.label.toLowerCase()
              );
            const pulseScale = isPulsing
              ? 1 + 0.15 * Math.sin((frame - BEATS.SENTENCE_GEN) * 0.1)
              : 1;

            return (
              <g
                key={`node-${i}`}
                opacity={nodeProgress}
                transform={`translate(${pos.x}, ${pos.y}) scale(${
                  nodeProgress * pulseScale
                })`}
              >
                <circle
                  cx={0}
                  cy={0}
                  r={node.size / 2}
                  fill={COLORS.aiPurple}
                  opacity={fillOpacity}
                />
                <text
                  x={0}
                  y={node.size / 2 + 16}
                  textAnchor="middle"
                  fill={COLORS.aiPurple}
                  fontSize={node.ring === 3 ? 16 : 20}
                  fontFamily={TYPOGRAPHY.code.fontFamily}
                  opacity={0.9}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Label: "Dense language patterns" */}
        {frame >= BEATS.LABEL_IN && (
          <div
            style={{
              position: 'absolute',
              top: 380,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: labelOpacity,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.aiPurple,
              }}
            >
              DENSE LANGUAGE PATTERNS
            </span>
          </div>
        )}

        {/* Generated sentence */}
        {frame >= BEATS.SENTENCE_GEN && (
          <div
            style={{
              position: 'absolute',
              bottom: 350,
              left: 0,
              right: 0,
              textAlign: 'center',
              textShadow:
                frame >= BEATS.HOLD
                  ? `0 0 20px rgba(139,92,246,${glowPulse})`
                  : 'none',
            }}
          >
            <TypewriterSpan
              text="The ocean speaks in silver tongues"
              frame={frame}
              startFrame={BEATS.SENTENCE_GEN}
              speed={2}
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 32,
                color: COLORS.aiPurple,
                fontStyle: 'italic',
              }}
            />
          </div>
        )}

        {/* Training data label */}
        {frame >= BEATS.TRAINING_DATA && (
          <div
            style={{
              position: 'absolute',
              bottom: 260,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: trainingOpacity,
              transform: `translateY(${trainingY}px)`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 48,
                  color: COLORS.techBlue,
                }}
              >
                Millions
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 22,
                  color: COLORS.textMuted,
                }}
              >
                POEMS IN TRAINING DATA
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
