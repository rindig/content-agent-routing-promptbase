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

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SIMPLIFY: 0,
  TIERS_BUILD: 30,
  FORWARD_ARROWS: 70,
  RETURN_ATTEMPT: 110,
  RETURN_BREAK: 130,
  LABELS: 150,
  HOLD: 190,
  BRACKET: 230,
};

// ── Tier box component ──
const TierBox: React.FC<{
  label: string;
  icon: string;
  width: number;
  height: number;
  borderColor: string;
  borderWidth: number;
  labelColor: string;
  fontSize: number;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({
  label,
  icon,
  width,
  height,
  borderColor,
  borderWidth,
  labelColor,
  fontSize,
  frame,
  fps,
  startFrame,
}) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enterProgress, [0, 1], [0.9, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.bgSurface,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span style={{ fontSize: fontSize + 4 }}>{icon}</span>
      <span
        style={{
          ...TYPOGRAPHY.title,
          fontSize,
          color: labelColor,
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Forward arrow with label ──
const ForwardArrow: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  direction: 'up' | 'down';
  color: string;
  label: string;
  height?: number;
}> = ({ frame, fps, startFrame, direction, color, label, height = 80 }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const drawProgress = interpolate(relFrame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const dashOffset = height * (1 - drawProgress);
  const opacity = interpolate(drawProgress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Animate dashes for pulsing flow after draw completes
  const flowOffset = relFrame > 15 ? (relFrame - 15) * 0.8 : 0;

  const arrowY1 = direction === 'up' ? height - 5 : 5;
  const arrowY2 = direction === 'up' ? 10 : height - 10;
  const arrowPoints = direction === 'up'
    ? `14,18 22,6 30,18`
    : `14,${height - 18} 22,${height - 6} 30,${height - 18}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        opacity,
        position: 'relative',
      }}
    >
      <svg width={44} height={height}>
        <line
          x1={22}
          y1={arrowY1}
          x2={22}
          y2={arrowY2}
          stroke={color}
          strokeWidth={3}
          strokeDasharray="8 4"
          strokeDashoffset={
            drawProgress < 1 ? dashOffset : (direction === 'up' ? -flowOffset : flowOffset)
          }
        />
        <polygon points={arrowPoints} fill={color} opacity={drawProgress} />
      </svg>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color,
          textTransform: 'none',
          letterSpacing: 0,
          position: 'absolute',
          left: 52,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Broken return arrow ──
const BrokenReturnArrow: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const attemptStart = BEATS.RETURN_ATTEMPT;
  const breakStart = BEATS.RETURN_BREAK;
  const relFrame = frame - attemptStart;
  if (relFrame < 0) return null;

  const arrowHeight = 80;

  // Phase 1: Draw attempt (stuttering)
  const drawDuration = breakStart - attemptStart; // 20 frames
  let drawProgress: number;
  if (relFrame < drawDuration) {
    // Stuttering draw: advance 3 frames, regress 2 frames, repeat
    const cycle = 5; // 3 forward + 2 back
    const cyclePos = relFrame % cycle;
    const cyclesComplete = Math.floor(relFrame / cycle);
    const baseProgress = cyclesComplete * 0.15;
    if (cyclePos < 3) {
      drawProgress = baseProgress + (cyclePos / 3) * 0.15;
    } else {
      drawProgress = baseProgress + 0.15 - ((cyclePos - 3) / 2) * 0.08;
    }
    drawProgress = Math.min(drawProgress, 0.6);
  } else {
    drawProgress = 0.6;
  }

  // Phase 2: Break effect
  const breakRelFrame = frame - breakStart;
  const isBroken = breakRelFrame >= 0;

  // Fragment drift
  const fragmentDrift = isBroken
    ? interpolate(breakRelFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
    : 0;
  const fragmentOpacity = isBroken
    ? interpolate(breakRelFrame, [0, 15], [1, 0.2], { extrapolateRight: 'clamp' })
    : 1;

  // Red X at break point
  const xProgress = isBroken
    ? spring({ frame: breakRelFrame, fps, config: SPRING_CONFIGS.bouncy })
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        height: arrowHeight + 20,
      }}
    >
      <svg width={44} height={arrowHeight} style={{ position: 'relative', zIndex: 1 }}>
        {!isBroken ? (
          // Drawing dashed line
          <line
            x1={22}
            y1={5}
            x2={22}
            y2={arrowHeight - 5}
            stroke={COLORS.errorRed}
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeDashoffset={arrowHeight * (1 - drawProgress)}
          />
        ) : (
          // Broken fragments
          <>
            {/* Top fragment */}
            <line
              x1={22}
              y1={5}
              x2={22}
              y2={arrowHeight * 0.3}
              stroke={COLORS.errorRed}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={fragmentOpacity}
              transform={`translate(0, ${-fragmentDrift * 8})`}
            />
            {/* Middle fragment */}
            <line
              x1={22}
              y1={arrowHeight * 0.35}
              x2={22}
              y2={arrowHeight * 0.55}
              stroke={COLORS.errorRed}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={fragmentOpacity}
              transform={`translate(${fragmentDrift * 5}, 0)`}
            />
            {/* Bottom fragment */}
            <line
              x1={22}
              y1={arrowHeight * 0.6}
              x2={22}
              y2={arrowHeight - 5}
              stroke={COLORS.errorRed}
              strokeWidth={2}
              strokeDasharray="6 4"
              opacity={fragmentOpacity}
              transform={`translate(0, ${fragmentDrift * 8})`}
            />
          </>
        )}
      </svg>

      {/* Red X at break point */}
      {isBroken && (
        <div
          style={{
            position: 'absolute',
            top: arrowHeight * 0.4 - 12,
            left: '50%',
            transform: `translateX(-50%) scale(${xProgress})`,
            opacity: xProgress,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.errorRed,
              textShadow: `0 0 8px ${COLORS.glowRed}`,
            }}
          >
            X
          </span>
        </div>
      )}
    </div>
  );
};

// ── Broken arrow labels ──
const BrokenLabels: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const labels = ['No bug reports', 'No contributions', 'No donations'];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {labels.map((label, i) => {
        const labelStart = BEATS.LABELS + i * 6;
        const relFrame = frame - labelStart;
        if (relFrame < 0) return null;

        const enterProgress = spring({
          frame: relFrame,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const x = interpolate(enterProgress, [0, 1], [-20, 0]);
        const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

        return (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity,
              transform: `translateX(${x}px)`,
            }}
          >
            <span style={{ color: COLORS.errorRed, fontSize: 20, fontWeight: 700 }}>✕</span>
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.errorRed,
                textTransform: 'none',
                letterSpacing: 0.5,
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Scene2_FlowDiagram ──
export const Scene2_FlowDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bracket animation
  const bracketRelFrame = frame - BEATS.BRACKET;
  const bracketProgress = bracketRelFrame >= 0
    ? interpolate(bracketRelFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  // Forward arrow pulsing (after they are drawn)
  const pulseActive = frame >= BEATS.HOLD;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
          gap: 0,
        }}
      >
        {/* Flow diagram wrapper */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
          }}
        >
          {/* Bracket around the whole diagram */}
          {bracketRelFrame >= 0 && (
            <div
              style={{
                position: 'absolute',
                top: -20,
                left: -30,
                right: -30,
                bottom: -20,
                border: `2px solid ${COLORS.errorRed}`,
                borderRadius: 16,
                opacity: bracketProgress,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Top tier: AI Coding Tool */}
          <TierBox
            label="AI Coding Tool"
            icon="✦"
            width={400}
            height={100}
            borderColor={COLORS.aiPurple}
            borderWidth={2}
            labelColor={COLORS.aiPurple}
            fontSize={30}
            frame={frame}
            fps={fps}
            startFrame={BEATS.TIERS_BUILD}
          />

          {/* Arrow: AI Tool → Developer (generated code) */}
          <ForwardArrow
            frame={frame}
            fps={fps}
            startFrame={BEATS.FORWARD_ARROWS}
            direction="down"
            color={COLORS.aiPurple}
            label="Generated code"
            height={70}
          />

          {/* Middle tier: Developer */}
          <TierBox
            label="Developer"
            icon="👤"
            width={300}
            height={80}
            borderColor={COLORS.techBlue}
            borderWidth={1}
            labelColor={COLORS.textBody}
            fontSize={26}
            frame={frame}
            fps={fps}
            startFrame={BEATS.TIERS_BUILD + 10}
          />

          {/* Broken return arrow: Developer → Open Source */}
          <BrokenReturnArrow frame={frame} fps={fps} />

          {/* Bottom tier: Open Source */}
          <TierBox
            label="Open Source"
            icon="< >"
            width={400}
            height={100}
            borderColor={COLORS.solutionGreen}
            borderWidth={2}
            labelColor={COLORS.solutionGreen}
            fontSize={30}
            frame={frame}
            fps={fps}
            startFrame={BEATS.TIERS_BUILD + 20}
          />

          {/* Left side: upward extraction arrow — Open Source → AI Tool */}
          {frame >= BEATS.FORWARD_ARROWS && (
            <div
              style={{
                position: 'absolute',
                left: -60,
                top: 20,
                bottom: 20,
              }}
            >
              <svg width={40} height={'100%'} viewBox="0 0 40 400" preserveAspectRatio="none">
                {(() => {
                  const drawRelFrame = frame - BEATS.FORWARD_ARROWS;
                  const drawProg = interpolate(drawRelFrame, [0, 15], [0, 1], {
                    extrapolateRight: 'clamp',
                  });
                  const flowOffset = drawRelFrame > 15 ? (drawRelFrame - 15) * 0.6 : 0;
                  return (
                    <>
                      <line
                        x1={20}
                        y1={380}
                        x2={20}
                        y2={20}
                        stroke={COLORS.techBlue}
                        strokeWidth={3}
                        strokeDasharray="8 4"
                        strokeDashoffset={
                          drawProg < 1 ? 360 * (1 - drawProg) : -flowOffset
                        }
                        opacity={drawProg}
                      />
                      <polygon
                        points="12,28 20,8 28,28"
                        fill={COLORS.techBlue}
                        opacity={drawProg}
                      />
                    </>
                  );
                })()}
              </svg>
              {/* Label */}
              {frame >= BEATS.FORWARD_ARROWS + 10 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -10,
                    transform: 'translateY(-50%) rotate(-90deg)',
                    whiteSpace: 'nowrap',
                    opacity: interpolate(
                      frame - BEATS.FORWARD_ARROWS - 10,
                      [0, 8],
                      [0, 1],
                      { extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 18,
                      color: COLORS.techBlue,
                      textTransform: 'none',
                      letterSpacing: 0,
                    }}
                  >
                    Training data
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Broken labels */}
        {frame >= BEATS.LABELS && (
          <div style={{ marginTop: 20 }}>
            <BrokenLabels frame={frame} fps={fps} />
          </div>
        )}

        {/* "One-way extraction" bracket label */}
        {bracketRelFrame >= 0 && (
          <div style={{ marginTop: 30 }}>
            <BlurText
              startFrame={BEATS.BRACKET}
              animateBy="words"
              staggerDelay={4}
              fontSize={44}
              color={COLORS.errorRed}
            >
              One-way extraction
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
