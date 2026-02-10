import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { ShinyText } from '../../../../../components/core/effects';
import { HistoricalPanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  YEAR_BADGE_IN: 0,
  NAME_IN: 10,
  VESSEL_IN: 30,
  ROPE_DRAW: 50,
  COGWHEEL_IN: 70,
  STAGE_IN: 90,
  ANIMATION_START: 110,
  ANIMATION_DURATION: 80,
  MECHANISM_DIM: 190,
  TAGLINE_IN: 200,
};

// ── Millet seeds data ──
const SEED_COUNT = 10;
const SEED_POSITIONS = Array.from({ length: SEED_COUNT }, (_, i) => ({
  x: -20 + Math.random() * 40,
  y: -20 + Math.random() * 30,
  delay: i * 8,
}));

// ── Mechanism sub-components ──

const MilletVessel: React.FC<{ frame: number; fps: number; animFrame: number; dimOpacity: number }> = ({
  frame,
  fps,
  animFrame,
  dimOpacity,
}) => {
  const relFrame = frame - BEATS.VESSEL_IN;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * dimOpacity;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        TIMER
      </div>
      {/* Vessel trapezoid */}
      <div style={{ position: 'relative', width: 100, height: 80 }}>
        <svg width={100} height={80} viewBox="0 0 100 80">
          {/* Trapezoid shape: wider at top */}
          <path
            d="M 10 0 L 90 0 L 75 70 L 25 70 Z"
            fill="none"
            stroke={COLORS.historyGold}
            strokeWidth={2}
          />
          {/* Hole at bottom */}
          <line
            x1={45}
            y1={70}
            x2={55}
            y2={70}
            stroke={COLORS.historyGold}
            strokeWidth={3}
          />
        </svg>
        {/* Millet seeds */}
        {SEED_POSITIONS.map((seed, i) => {
          // During animation, seeds drain downward
          const seedDrain = animFrame > 0
            ? interpolate(
                animFrame - seed.delay,
                [0, 20],
                [0, 120],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
            : 0;
          const seedFade = animFrame > 0
            ? interpolate(
                animFrame - seed.delay,
                [0, 10, 20],
                [1, 1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )
            : 1;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 50 + seed.x,
                top: 25 + seed.y,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: COLORS.historyGold,
                opacity: 0.6 * seedFade,
                transform: `translateY(${seedDrain}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const Rope: React.FC<{ frame: number; fps: number; animFrame: number; dimOpacity: number }> = ({
  frame,
  fps,
  animFrame,
  dimOpacity,
}) => {
  const relFrame = frame - BEATS.ROPE_DRAW;
  if (relFrame < 0) return null;

  // SVG stroke draw animation
  const drawProgress = interpolate(
    relFrame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const ropeLength = 120;
  const dashOffset = ropeLength * (1 - drawProgress);

  // Weight descends during animation
  const weightDescent = animFrame > 0
    ? interpolate(
        animFrame,
        [0, BEATS.ANIMATION_DURATION],
        [0, 30],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const opacity = interpolate(drawProgress, [0, 0.3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * dimOpacity;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
      }}
    >
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        ROPE
      </div>
      <svg width={30} height={ropeLength + 40} viewBox={`0 0 30 ${ropeLength + 40}`}>
        {/* Rope line */}
        <line
          x1={15}
          y1={0}
          x2={15}
          y2={ropeLength}
          stroke={COLORS.historyGold}
          strokeWidth={2}
          strokeDasharray={ropeLength}
          strokeDashoffset={dashOffset}
        />
        {/* Weight block */}
        <rect
          x={0}
          y={ropeLength + weightDescent}
          width={30}
          height={20}
          fill={COLORS.historyGold}
          fillOpacity={0.3}
          stroke={COLORS.historyGold}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};

const Cogwheel: React.FC<{ frame: number; fps: number; animFrame: number; dimOpacity: number }> = ({
  frame,
  fps,
  animFrame,
  dimOpacity,
}) => {
  const relFrame = frame - BEATS.COGWHEEL_IN;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const scale = interpolate(enter, [0, 1], [0, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * dimOpacity;

  // Rotation during animation
  const rotation = animFrame > 0
    ? interpolate(
        animFrame,
        [0, BEATS.ANIMATION_DURATION],
        [0, 45],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const size = 60;
  const notchCount = 8;
  const notches = Array.from({ length: notchCount }, (_, i) => {
    const angle = (i / notchCount) * Math.PI * 2;
    const innerR = 20;
    const outerR = 28;
    return {
      x1: size / 2 + Math.cos(angle) * innerR,
      y1: size / 2 + Math.sin(angle) * innerR,
      x2: size / 2 + Math.cos(angle) * outerR,
      y2: size / 2 + Math.sin(angle) * outerR,
    };
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        DRIVE
      </div>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={22}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={2}
        />
        {/* Inner circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={8}
          fill="none"
          stroke={COLORS.historyGold}
          strokeWidth={1.5}
        />
        {/* Notches */}
        {notches.map((n, i) => (
          <line
            key={i}
            x1={n.x1}
            y1={n.y1}
            x2={n.x2}
            y2={n.y2}
            stroke={COLORS.historyGold}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
};

const Stage: React.FC<{ frame: number; fps: number; animFrame: number; dimOpacity: number }> = ({
  frame,
  fps,
  animFrame,
  dimOpacity,
}) => {
  const relFrame = frame - BEATS.STAGE_IN;
  if (relFrame < 0) return null;

  const enter = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enter, [0, 1], [0.5, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]) * dimOpacity;

  // Figures shift during animation
  const figureShift = animFrame > 0
    ? interpolate(
        animFrame,
        [0, BEATS.ANIMATION_DURATION],
        [0, 20],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 20,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        STAGE
      </div>
      <div style={{ position: 'relative' }}>
        {/* Stage platform */}
        <div
          style={{
            width: 200,
            height: 20,
            backgroundColor: COLORS.historyGold,
            opacity: 0.4,
            borderRadius: 2,
          }}
        />
        {/* Stick figures */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: 60,
            display: 'flex',
            gap: 30,
            transform: `translateX(${figureShift}px)`,
          }}
        >
          {[0, 1].map((i) => (
            <svg key={i} width={15} height={20} viewBox="0 0 15 20">
              {/* Head */}
              <circle cx={7.5} cy={3} r={3} fill={COLORS.historyGold} />
              {/* Body */}
              <line x1={7.5} y1={6} x2={7.5} y2={14} stroke={COLORS.historyGold} strokeWidth={1.5} />
              {/* Arms */}
              <line x1={2} y1={9} x2={13} y2={9} stroke={COLORS.historyGold} strokeWidth={1.5} />
              {/* Legs */}
              <line x1={7.5} y1={14} x2={3} y2={20} stroke={COLORS.historyGold} strokeWidth={1.5} />
              <line x1={7.5} y1={14} x2={12} y2={20} stroke={COLORS.historyGold} strokeWidth={1.5} />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene2_HeronTheater: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation frame (relative to animation start)
  const animFrame = Math.max(0, frame - BEATS.ANIMATION_START);

  // Mechanism dim after animation
  const dimOpacity = frame >= BEATS.MECHANISM_DIM
    ? interpolate(
        frame,
        [BEATS.MECHANISM_DIM, BEATS.MECHANISM_DIM + 15],
        [1, 0.4],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  // Tagline
  const showTagline = frame >= BEATS.TAGLINE_IN;
  const taglineProgress = spring({
    frame: Math.max(0, frame - BEATS.TAGLINE_IN),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const taglineY = interpolate(taglineProgress, [0, 1], [20, 0]);
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={12}
      fadeOut
      fadeOutStart={250}
      fadeOutDuration={20}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          paddingTop: 40,
        }}
      >
        {/* Historical panel header */}
        <HistoricalPanel
          year="62 CE"
          label="Automatic Theater"
          startFrame={BEATS.YEAR_BADGE_IN}
          badgeColor={COLORS.historyGold}
        >
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 48,
              color: COLORS.historyGold,
              textAlign: 'center',
            }}
          >
            Heron of Alexandria
          </div>
        </HistoricalPanel>

        {/* Mechanism diagram */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            marginTop: 40,
            flex: 1,
          }}
        >
          {/* Vessel */}
          <MilletVessel
            frame={frame}
            fps={fps}
            animFrame={animFrame}
            dimOpacity={dimOpacity}
          />

          {/* Rope + Cogwheel row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 40,
            }}
          >
            <Rope
              frame={frame}
              fps={fps}
              animFrame={animFrame}
              dimOpacity={dimOpacity}
            />
            <Cogwheel
              frame={frame}
              fps={fps}
              animFrame={animFrame}
              dimOpacity={dimOpacity}
            />
          </div>

          {/* Stage */}
          <Stage
            frame={frame}
            fps={fps}
            animFrame={animFrame}
            dimOpacity={dimOpacity}
          />
        </div>

        {/* Tagline: "A program made of physics." */}
        {showTagline && (
          <div
            style={{
              position: 'absolute',
              bottom: 320,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity: taglineOpacity,
              transform: `translateY(${taglineY}px)`,
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 44,
                color: COLORS.historyGold,
                textAlign: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0 10px',
              }}
            >
              <span>A </span>
              <ShinyText
                startFrame={BEATS.TAGLINE_IN + 10}
                color={COLORS.historyGold}
                shineColor="#FFFFFF"
                duration={45}
                pauseDuration={30}
                fontSize={44}
                fontWeight={600}
              >
                program
              </ShinyText>
              <span> made of physics.</span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
