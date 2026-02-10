import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchBurst, BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  FADE_PREV: 0,
  SPECTRUM_IN: 30,
  MARKER_AI: 70,
  MARKER_EXPECT: 100,
  GAP_FILL: 140,
  BRACKET: 150,
  SUMMARY_1: 170,
  SUMMARY_2: 210,
};

// ── Spectrum Bar dimensions ──
const BAR_WIDTH = 780;
const BAR_HEIGHT = 32;
const AI_MARKER_POS = 0.35; // 35% from left
const EXPECT_MARKER_POS = 0.85; // 85% from left

// ── Spectrum Bar ──
const SpectrumBar: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.SPECTRUM_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scaleX = interpolate(enterProgress, [0, 1], [0, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'relative',
        width: BAR_WIDTH,
        opacity,
      }}
    >
      {/* Main gradient bar */}
      <div
        style={{
          width: BAR_WIDTH,
          height: BAR_HEIGHT,
          borderRadius: 16,
          background: `linear-gradient(to right, ${COLORS.techBlue}, ${COLORS.insightOrange} 50%, ${COLORS.solutionGreen})`,
          transform: `scaleX(${scaleX})`,
          transformOrigin: 'left center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dim the right 40% to show unachieved zone */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '40%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.55)',
          }}
        />
      </div>

      {/* Left label */}
      <div
        style={{
          position: 'absolute',
          top: BAR_HEIGHT + 12,
          left: 0,
          ...TYPOGRAPHY.label,
          fontSize: 26,
          color: COLORS.techBlue,
        }}
      >
        Fewer errors
      </div>

      {/* Right label */}
      <div
        style={{
          position: 'absolute',
          top: BAR_HEIGHT + 12,
          right: 0,
          ...TYPOGRAPHY.label,
          fontSize: 26,
          color: COLORS.solutionGreen,
          textAlign: 'right',
        }}
      >
        Understanding
      </div>
    </div>
  );
};

// ── Marker (vertical line + label) ──
const Marker: React.FC<{
  position: number;
  label: string;
  color: string;
  dashed?: boolean;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ position, label, color, dashed, startFrame, frame, fps }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: dashed ? SPRING_CONFIGS.snappy : SPRING_CONFIGS.bouncy,
  });
  const scaleY = interpolate(enterProgress, [0, 1], [0, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position * BAR_WIDTH,
        top: -56,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `translateX(-50%)`,
      }}
    >
      {/* Label above */}
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 26,
          color,
          whiteSpace: 'nowrap',
          marginBottom: 4,
        }}
      >
        {label}
      </span>

      {/* Vertical line */}
      <div
        style={{
          width: 3,
          height: 48,
          backgroundColor: dashed ? 'transparent' : '#FFFFFF',
          borderLeft: dashed ? `3px dashed ${color}` : 'none',
          transformOrigin: 'top center',
          transform: `scaleY(${scaleY})`,
        }}
      />
    </div>
  );
};

// ── Gap Highlight ──
const GapHighlight: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.GAP_FILL;
  if (relFrame < 0) return null;

  const fillProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const scaleX = interpolate(fillProgress, [0, 1], [0, 1]);
  const opacity = interpolate(fillProgress, [0, 1], [0, 1]);

  const gapLeft = AI_MARKER_POS * BAR_WIDTH;
  const gapWidth = (EXPECT_MARKER_POS - AI_MARKER_POS) * BAR_WIDTH;

  // Bracket + label (appears 10 frames after fill)
  const bracketFrame = frame - BEATS.BRACKET;
  const showBracket = bracketFrame > 0;
  const bracketProgress = showBracket
    ? spring({ frame: bracketFrame, fps, config: SPRING_CONFIGS.gentle })
    : 0;

  return (
    <>
      {/* Red overlay on spectrum */}
      <div
        style={{
          position: 'absolute',
          left: gapLeft,
          top: 0,
          width: gapWidth,
          height: BAR_HEIGHT,
          backgroundColor: COLORS.errorRed,
          opacity: opacity * 0.15,
          transform: `scaleX(${scaleX})`,
          transformOrigin: 'center',
          borderRadius: 4,
        }}
      />

      {/* Bracket above gap */}
      {showBracket && (
        <div
          style={{
            position: 'absolute',
            left: gapLeft,
            top: -100,
            width: gapWidth,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: interpolate(bracketProgress, [0, 1], [0, 1]),
          }}
        >
          {/* Bracket SVG */}
          <svg
            width={gapWidth}
            height={24}
            viewBox={`0 0 ${gapWidth} 24`}
          >
            <path
              d={`M 5 24 L 5 8 L ${gapWidth / 2} 2 L ${gapWidth - 5} 8 L ${gapWidth - 5} 24`}
              fill="none"
              stroke={COLORS.errorRed}
              strokeWidth={2}
              opacity={0.7}
            />
          </svg>

          {/* Gap label with glitch */}
          <div style={{ marginTop: 4 }}>
            <GlitchBurst
              startFrame={BEATS.BRACKET}
              burstInterval={90}
              burstDuration={12}
              fontSize={42}
            >
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 42,
                  color: COLORS.errorRed,
                }}
              >
                The disappointment gap
              </span>
            </GlitchBurst>
          </div>

          {/* Small arrows pointing inward */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 4,
            }}
          >
            <span style={{ color: COLORS.errorRed, fontSize: 20 }}>&rarr;</span>
            <span style={{ color: COLORS.errorRed, fontSize: 20 }}>&larr;</span>
          </div>
        </div>
      )}
    </>
  );
};

// ── Main Scene ──
export const Scene4_GapSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showSummary1 = frame >= BEATS.SUMMARY_1;
  const showSummary2 = frame >= BEATS.SUMMARY_2;

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
        }}
      >
        {/* Spectrum bar with markers */}
        <div
          style={{
            position: 'relative',
            width: BAR_WIDTH,
            marginTop: 120,
          }}
        >
          <SpectrumBar frame={frame} fps={fps} />

          {/* AI marker */}
          <Marker
            position={AI_MARKER_POS}
            label="Current AI"
            color={COLORS.aiPurple}
            startFrame={BEATS.MARKER_AI}
            frame={frame}
            fps={fps}
          />

          {/* Expectations marker */}
          <Marker
            position={EXPECT_MARKER_POS}
            label="What people expect"
            color={COLORS.insightOrange}
            dashed
            startFrame={BEATS.MARKER_EXPECT}
            frame={frame}
            fps={fps}
          />

          {/* Gap highlight + bracket */}
          <GapHighlight frame={frame} fps={fps} />
        </div>

        {/* Summary lines */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            maxWidth: 860,
            textAlign: 'center',
            marginTop: 60,
          }}
        >
          {showSummary1 && (
            <BlurText
              startFrame={BEATS.SUMMARY_1}
              animateBy="words"
              direction="bottom"
              staggerDelay={2}
              blurAmount={10}
              distance={20}
              fontSize={40}
              fontWeight={400}
              color={COLORS.textBody}
            >
              The gap between &apos;fewer errors&apos; and &apos;actual understanding&apos;
            </BlurText>
          )}

          {showSummary2 && (
            <BlurText
              startFrame={BEATS.SUMMARY_2}
              animateBy="words"
              direction="bottom"
              staggerDelay={3}
              blurAmount={10}
              distance={20}
              fontSize={40}
              fontWeight={400}
              color={COLORS.errorRed}
            >
              is where most AI disappointment lives.
            </BlurText>
          )}
        </div>
      </div>
    </SceneContainer>
  );
};
