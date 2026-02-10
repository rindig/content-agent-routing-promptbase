import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUpWithLabel } from '../../../../../components/core/effects';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  ZOOM_START: 0,
  EXPLODE: 20,
  WATERFALL: 40,
  COUNTUP: 40,
  BADGES_IN: 80,
  WATERFALL_FADE: 110,
  THATS_NOT_NEW: 170,
};

/** Generates pseudo-random code line widths for the waterfall */
const generateLineWidths = (count: number): number[] => {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random using sin
    widths.push(80 + Math.abs(Math.sin(i * 3.7 + 1.2)) * 600);
  }
  return widths;
};

const CODE_LINE_WIDTHS = generateLineWidths(60);

/** Code waterfall — cascading lines of code falling down the screen */
const CodeWaterfall: React.FC<{
  startFrame: number;
  fadeStartFrame: number;
}> = ({ startFrame, fadeStartFrame }) => {
  const frame = useCurrentFrame();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Fade out the waterfall
  const waterfallOpacity = interpolate(
    frame,
    [fadeStartFrame, fadeStartFrame + 40],
    [1, 0.05],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const lines: JSX.Element[] = [];
  for (let i = 0; i < CODE_LINE_WIDTHS.length; i++) {
    // Each line falls at a different speed using looping interpolation
    const speed = 2 + (i % 5) * 0.5;
    const yOffset = ((relativeFrame * speed + i * 40) % 2200) - 200;
    const lineOpacity = 0.15 + Math.abs(Math.sin(i * 2.1)) * 0.25;

    lines.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: yOffset,
          left: 100 + (i % 7) * 120,
          width: CODE_LINE_WIDTHS[i],
          height: 3,
          backgroundColor: COLORS.textDim,
          opacity: lineOpacity * waterfallOpacity,
          borderRadius: 1,
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {lines}
    </div>
  );
};

/** Exploding letter that scatters and trails code */
const ExplodingLetter: React.FC<{
  letter: string;
  index: number;
  startFrame: number;
  totalLetters: number;
}> = ({ letter, index, startFrame, totalLetters }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  // Each letter explodes outward in a different direction
  const angle = (index / totalLetters) * Math.PI * 2 + Math.PI / 4;
  const distance = 200 + index * 30;

  const explodeProgress = spring({
    frame: relativeFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const x = Math.cos(angle) * distance * explodeProgress;
  const y = Math.sin(angle) * distance * explodeProgress;

  // Fade out as they scatter
  const opacity = interpolate(
    relativeFrame,
    [0, 10, 20],
    [1, 0.6, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <span
      style={{
        position: 'absolute',
        ...TYPOGRAPHY.code,
        fontSize: 48,
        color: COLORS.techBlue,
        fontWeight: 700,
        transform: `translate(${x}px, ${y}px)`,
        opacity,
      }}
    >
      {letter}
    </span>
  );
};

/** Badge pill component */
const Badge: React.FC<{
  text: string;
  color: string;
  startFrame: number;
}> = ({ text, color, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const y = interpolate(progress, [0, 1], [20, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  if (frame < startFrame) return null;

  const bgColor = color === COLORS.errorRed
    ? 'rgba(239,68,68,0.08)'
    : 'rgba(245,158,11,0.08)';

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        backgroundColor: bgColor,
        borderRadius: 100,
        padding: '12px 28px',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: 36,
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Scene2_Explosion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom on the "pandas" word
  const zoomProgress = interpolate(
    frame,
    [BEATS.ZOOM_START, BEATS.EXPLODE],
    [1, 4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  // Zoom phase opacity (fades out as we transition to waterfall)
  const zoomOpacity = interpolate(
    frame,
    [BEATS.EXPLODE, BEATS.WATERFALL],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Show exploding letters
  const showExplosion = frame >= BEATS.EXPLODE && frame < BEATS.WATERFALL + 10;

  // Divider line
  const dividerProgress = spring({
    frame: frame - (BEATS.BADGES_IN + 30),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const dividerOpacity = interpolate(dividerProgress, [0, 1], [0, 1]);

  const pandasLetters = 'pandas'.split('');

  return (
    <SceneContainer background="dark">
      {/* Code waterfall background */}
      {frame >= BEATS.WATERFALL && (
        <CodeWaterfall
          startFrame={BEATS.WATERFALL}
          fadeStartFrame={BEATS.WATERFALL_FADE}
        />
      )}

      {/* Zoom phase — "pandas" scaling up */}
      {frame < BEATS.WATERFALL + 10 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${zoomProgress})`,
            opacity: zoomOpacity,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 48,
              color: COLORS.techBlue,
              fontWeight: 700,
            }}
          >
            pandas
          </span>
        </div>
      )}

      {/* Exploding letters */}
      {showExplosion && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {pandasLetters.map((letter, i) => (
            <ExplodingLetter
              key={i}
              letter={letter}
              index={i}
              startFrame={BEATS.EXPLODE}
              totalLetters={pandasLetters.length}
            />
          ))}
        </div>
      )}

      {/* Center content — CountUp + badges */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 54px',
          gap: 24,
          zIndex: 2,
        }}
      >
        {/* CountUpWithLabel */}
        {frame >= BEATS.COUNTUP && (
          <div style={{ marginBottom: 32 }}>
            <CountUpWithLabel
              to={300000}
              from={0}
              startFrame={BEATS.COUNTUP}
              duration={40}
              color={COLORS.techBlue}
              fontSize={64}
              label="LINES OF CODE"
              labelPosition="bottom"
              labelColor={COLORS.textMuted}
            />
          </div>
        )}

        {/* Trust badges */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Badge
            text="Never read it"
            color={COLORS.errorRed}
            startFrame={BEATS.BADGES_IN}
          />
          <Badge
            text="Never audited it"
            color={COLORS.errorRed}
            startFrame={BEATS.BADGES_IN + 8}
          />
          <Badge
            text="Just trust it works"
            color={COLORS.insightOrange}
            startFrame={BEATS.BADGES_IN + 16}
          />
        </div>

        {/* Divider */}
        {frame >= BEATS.BADGES_IN + 30 && (
          <div
            style={{
              width: 600,
              height: 1,
              backgroundColor: 'rgba(255,255,255,0.08)',
              opacity: dividerOpacity,
              marginTop: 16,
              marginBottom: 16,
            }}
          />
        )}

        {/* "That's not new." */}
        {frame >= BEATS.THATS_NOT_NEW && (
          <BlurText
            startFrame={BEATS.THATS_NOT_NEW}
            animateBy="words"
            staggerDelay={4}
            fontSize={56}
            fontWeight={600}
            color={COLORS.textPrimary}
          >
            {"That's not new."}
          </BlurText>
        )}
      </div>
    </SceneContainer>
  );
};
