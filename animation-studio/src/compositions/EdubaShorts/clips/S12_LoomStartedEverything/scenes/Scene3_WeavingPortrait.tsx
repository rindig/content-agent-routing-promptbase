import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  LOOM_SHRINK: 0,
  CANVAS_IN: 15,
  WEAVE_START: 30,
  WEAVE_LINE_STAGGER: 1,
  COUNTER_START: 100,
  COUNTER_DURATION: 30,
  COMPARISON_IN: 130,
  CONNECTING_LINE: 170,
};

// ── Mini Loom (shrunk from previous scene) ──
const MiniLoom: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const shrinkProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(shrinkProgress, [0, 1], [0.6, 0.3]);
  const moveX = interpolate(shrinkProgress, [0, 1], [0, -280]);
  const moveY = interpolate(shrinkProgress, [0, 1], [0, -580]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 400,
        left: '50%',
        transform: `translate(-50%, 0) translate(${moveX}px, ${moveY}px) scale(${scale})`,
        opacity: 0.6,
      }}
    >
      <svg width={300} height={250} viewBox="0 0 300 250">
        <rect
          x={20}
          y={10}
          width={12}
          height={200}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        <rect
          x={268}
          y={10}
          width={12}
          height={200}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        <rect
          x={20}
          y={10}
          width={260}
          height={12}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={i}
            x1={60 + i * 36}
            y1={22}
            x2={60 + i * 36}
            y2={210}
            stroke={COLORS.historyGold}
            strokeWidth={1}
            opacity={0.25}
          />
        ))}
      </svg>
    </div>
  );
};

// ── Weaving Canvas ──
const WeavingCanvas: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const canvasRel = frame - BEATS.CANVAS_IN;
  if (canvasRel < 0) return null;

  const canvasEnter = spring({
    frame: canvasRel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const canvasOpacity = interpolate(canvasEnter, [0, 1], [0, 1]);
  const canvasScale = interpolate(canvasEnter, [0, 1], [0.9, 1]);

  // Weave lines
  const weaveRel = frame - BEATS.WEAVE_START;
  const totalLines = 120;
  const canvasWidth = 520;
  const canvasHeight = 650;
  const lineHeight = 4;

  // Generate scan lines with varying gold opacities
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < totalLines; i++) {
    const lineStart = i * BEATS.WEAVE_LINE_STAGGER;
    const lineRel = weaveRel - lineStart;
    if (lineRel < 0) break;

    const lineEnter = spring({
      frame: lineRel,
      fps,
      config: SPRING_CONFIGS.snappy,
    });

    const y = i * (canvasHeight / totalLines);
    // Vary opacity to create portrait-like gradient texture
    const baseOpacity = 0.2 + 0.6 * Math.abs(Math.sin(i * 0.15 + i * 0.03));
    const lineOpacity = interpolate(lineEnter, [0, 1], [0, baseOpacity]);

    lines.push(
      <rect
        key={i}
        x={0}
        y={y}
        width={canvasWidth * lineEnter}
        height={lineHeight}
        fill={COLORS.historyGold}
        opacity={lineOpacity}
        rx={1}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 220,
        right: 80,
        opacity: canvasOpacity,
        transform: `scale(${canvasScale})`,
      }}
    >
      <div
        style={{
          width: canvasWidth,
          height: canvasHeight,
          border: `1px solid ${COLORS.historyGold}4D`,
          backgroundColor: COLORS.bg,
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        <svg width={canvasWidth} height={canvasHeight}>
          {lines}
        </svg>
      </div>
    </div>
  );
};

// ── Comparison Panel ──
const ComparisonPanel: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.COMPARISON_IN;
  if (relFrame < 0) return null;

  const panelProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const panelY = interpolate(panelProgress, [0, 1], [40, 0]);
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

  // Connecting line
  const lineRel = frame - BEATS.CONNECTING_LINE;
  const lineProgress =
    lineRel >= 0
      ? interpolate(lineRel, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const lineOpacity =
    lineRel >= 0
      ? interpolate(lineRel, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 180,
        left: 54,
        right: 54,
        opacity: panelOpacity,
        transform: `translateY(${panelY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.bgSurfaceAlt,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        {/* Left: Punched card */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Card icon */}
          <svg width={36} height={24} viewBox="0 0 36 24">
            <rect
              x={0}
              y={0}
              width={36}
              height={24}
              rx={2}
              fill="none"
              stroke={COLORS.historyGold}
              strokeWidth={1.5}
            />
            <circle cx={10} cy={12} r={3} fill={COLORS.historyGold} />
            <circle
              cx={20}
              cy={12}
              r={3}
              fill="none"
              stroke={COLORS.historyGold}
              strokeWidth={1}
            />
            <circle cx={30} cy={12} r={3} fill={COLORS.historyGold} />
          </svg>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.historyGold,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            1 card = 1 row
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 40,
            backgroundColor: COLORS.textMuted,
          }}
        />

        {/* Right: Code bracket */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Code bracket icon */}
          <svg width={36} height={24} viewBox="0 0 36 24">
            <text
              x={18}
              y={18}
              textAnchor="middle"
              fill={COLORS.techBlue}
              fontSize={20}
              fontFamily={TYPOGRAPHY.code.fontFamily}
            >
              {'{ }'}
            </text>
          </svg>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.techBlue,
              textTransform: 'none',
              letterSpacing: 0,
            }}
          >
            1 line = 1 instruction
          </span>
        </div>
      </div>

      {/* Connecting line with label */}
      {lineRel >= 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 12,
            opacity: lineOpacity,
          }}
        >
          <svg width={300} height={30} viewBox="0 0 300 30">
            <line
              x1={50}
              y1={15}
              x2={50 + 200 * lineProgress}
              y2={15}
              stroke={COLORS.insightOrange}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          </svg>
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 20,
              color: COLORS.insightOrange,
              textTransform: 'none',
              letterSpacing: 0,
              opacity: interpolate(lineProgress, [0.5, 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Same pattern
          </span>
        </div>
      )}
    </div>
  );
};

// ── Scene3_WeavingPortrait ──
export const Scene3_WeavingPortrait: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={225}
      fadeOutDuration={15}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Miniaturized loom (top-left) */}
        <MiniLoom frame={frame} fps={fps} />

        {/* Weaving canvas */}
        <WeavingCanvas frame={frame} fps={fps} />

        {/* Card counter */}
        {frame >= BEATS.COUNTER_START && (
          <div
            style={{
              position: 'absolute',
              top: 260,
              left: 60,
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <CountUp
              to={24000}
              from={0}
              startFrame={BEATS.COUNTER_START}
              duration={BEATS.COUNTER_DURATION}
              separator=","
              decimals={0}
              useSpring
              color={COLORS.historyGold}
              fontSize={40}
            />
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 28,
                color: COLORS.textMuted,
                textTransform: 'none',
                letterSpacing: 0,
              }}
            >
              cards
            </span>
          </div>
        )}

        {/* Comparison panel */}
        <ComparisonPanel frame={frame} fps={fps} />
      </div>
    </SceneContainer>
  );
};
