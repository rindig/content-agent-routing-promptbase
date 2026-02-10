import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';
import { HistoricalPanel } from '../../../components';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  WARM_BG_IN: 0,
  YEAR_BADGE_IN: 10,
  LOOM_FRAME_BUILD: 30,
  CARD_IN: 60,
  BINARY_LABELS_START: 80,
  BINARY_STAGGER: 3,
  BINARY_TAGLINE: 130,
  CARD_ADVANCE: 170,
};

// Punched card pattern: hole=true, solid=false
// Pattern: hole, solid, hole, hole, solid, hole, solid, hole
const CARD_PATTERN = [true, false, true, true, false, true, false, true];
const CARD2_PATTERN = [false, true, true, false, true, false, true, true];

// ── Loom Frame SVG ──
const LoomFrame: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.LOOM_FRAME_BUILD;
  if (relFrame < 0) return null;

  // Draw progress for the frame structure (30 frames)
  const drawProgress = interpolate(
    relFrame,
    [0, 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const frameOpacity = interpolate(
    relFrame,
    [0, 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Left beam total length (400), right beam (400), crossbar (600)
  const totalStructureLength = 400 + 400 + 600;
  const dashOffset = totalStructureLength * (1 - drawProgress);

  return (
    <svg
      width={700}
      height={500}
      viewBox="0 0 700 500"
      style={{ opacity: frameOpacity }}
    >
      {/* Left vertical beam */}
      <rect
        x={50}
        y={30}
        width={20}
        height={400}
        fill="none"
        stroke={COLORS.historyGold}
        strokeWidth={2}
        strokeDasharray={totalStructureLength}
        strokeDashoffset={dashOffset}
      />
      {/* Right vertical beam */}
      <rect
        x={630}
        y={30}
        width={20}
        height={400}
        fill="none"
        stroke={COLORS.historyGold}
        strokeWidth={2}
        strokeDasharray={totalStructureLength}
        strokeDashoffset={dashOffset}
      />
      {/* Top crossbar */}
      <rect
        x={50}
        y={30}
        width={600}
        height={20}
        fill="none"
        stroke={COLORS.historyGold}
        strokeWidth={2}
        strokeDasharray={totalStructureLength}
        strokeDashoffset={dashOffset}
      />
      {/* Warp threads */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const threadOpacity = interpolate(
          drawProgress,
          [0.6, 0.9],
          [0, 0.25],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <line
            key={i}
            x1={140 + i * 60}
            y1={50}
            x2={140 + i * 60}
            y2={430}
            stroke={COLORS.historyGold}
            strokeWidth={1}
            opacity={threadOpacity}
          />
        );
      })}
    </svg>
  );
};

// ── Punched Card ──
const PunchedCard: React.FC<{
  pattern: boolean[];
  frame: number;
  fps: number;
  startFrame: number;
  offsetX?: number;
}> = ({ pattern, frame, fps, startFrame, offsetX = 0 }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const cardEnter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const cardScale = interpolate(cardEnter, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardEnter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        opacity: cardOpacity,
        transform: `scale(${cardScale}) translateX(${offsetX}px)`,
      }}
    >
      <div
        style={{
          width: 640,
          height: 120,
          backgroundColor: `${COLORS.historyGold}26`,
          border: `1px solid ${COLORS.historyGold}`,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: '0 24px',
        }}
      >
        {pattern.map((isHole, i) => (
          <div
            key={i}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isHole ? COLORS.historyGold : COLORS.bgWarm,
              border: `2px solid ${COLORS.historyGold}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Binary Labels ──
const BinaryLabels: React.FC<{
  pattern: boolean[];
  frame: number;
  fps: number;
}> = ({ pattern, frame, fps }) => {
  const relFrame = frame - BEATS.BINARY_LABELS_START;
  if (relFrame < 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 32,
        padding: '0 24px',
        width: 640,
        margin: '0 auto',
      }}
    >
      {pattern.map((isHole, i) => {
        const labelStart = i * BEATS.BINARY_STAGGER;
        const labelRel = relFrame - labelStart;
        if (labelRel < 0) return <div key={i} style={{ width: 40 }} />;

        const labelProgress = spring({
          frame: labelRel,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
        const labelScale = interpolate(labelProgress, [0, 1], [0.5, 1]);

        return (
          <div
            key={i}
            style={{
              width: 40,
              textAlign: 'center',
              opacity: labelOpacity,
              transform: `scale(${labelScale})`,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 28,
                color: isHole ? COLORS.solutionGreen : COLORS.errorRed,
              }}
            >
              {isHole ? '1' : '0'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ── Scene2_JacquardLoom ──
export const Scene2_JacquardLoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card advance animation (frame 170+)
  const advanceRel = frame - BEATS.CARD_ADVANCE;
  const advanceProgress =
    advanceRel >= 0
      ? spring({ frame: advanceRel, fps, config: SPRING_CONFIGS.slow })
      : 0;
  const cardSlideX = interpolate(advanceProgress, [0, 1], [0, 20]);

  // Tagline entrance
  const taglineRel = frame - BEATS.BINARY_TAGLINE;
  const taglineProgress =
    taglineRel >= 0
      ? spring({ frame: taglineRel, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const taglineOpacity = interpolate(
    taglineRel,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const taglineY = interpolate(taglineProgress, [0, 1], [20, 0]);

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={195}
      fadeOutDuration={15}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 100,
        }}
      >
        {/* Historical Panel: year badge + name */}
        <HistoricalPanel year="1804" startFrame={BEATS.YEAR_BADGE_IN}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 48,
                color: COLORS.historyGold,
              }}
            >
              Joseph Marie Jacquard
            </div>
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                textTransform: 'none',
                letterSpacing: 0,
                marginTop: 8,
              }}
            >
              Lyon, France
            </div>
          </div>
        </HistoricalPanel>

        {/* Loom frame illustration */}
        <div style={{ marginTop: 40, position: 'relative' }}>
          <LoomFrame frame={frame} fps={fps} />
        </div>

        {/* Punched card area */}
        <div
          style={{
            marginTop: -60,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            transform: `translateX(${cardSlideX}px)`,
          }}
        >
          <PunchedCard
            pattern={CARD_PATTERN}
            frame={frame}
            fps={fps}
            startFrame={BEATS.CARD_IN}
          />

          {/* Binary labels below card */}
          <BinaryLabels pattern={CARD_PATTERN} frame={frame} fps={fps} />
        </div>

        {/* "Binary" tagline */}
        {taglineRel >= 0 && (
          <div
            style={{
              marginTop: 32,
              textAlign: 'center',
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.historyGold,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <ShinyText
                startFrame={BEATS.BINARY_TAGLINE}
                color={COLORS.historyGold}
                shineColor="#FFFFFF"
                duration={45}
                pauseDuration={30}
                fontSize={40}
              >
                Binary
              </ShinyText>
              <span style={{ color: COLORS.textBody }}>
                {' '}
                — before anyone called it that.
              </span>
            </div>
          </div>
        )}

        {/* Second card peeking in from left during advance */}
        {advanceRel >= 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 480,
              left: -500,
              transform: `translateX(${interpolate(advanceProgress, [0, 1], [0, 120])}px)`,
              opacity: interpolate(advanceProgress, [0, 1], [0, 0.5]),
            }}
          >
            <PunchedCard
              pattern={CARD2_PATTERN}
              frame={frame}
              fps={fps}
              startFrame={0}
            />
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
