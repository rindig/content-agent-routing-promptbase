import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  random,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GradientText } from '../../../../../components/core/effects';
import { ChatWindow } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  PRESS_RELEASE_IN: 0,
  CONFETTI_BURST: 15,
  CURSOR_CLICK: 40,
  REVEAL_CHATBOT: 45,
  STAMP_IMPACT: 60,
  SCREEN_SHAKE: 62,
  SCENE_END: 90,
};

// ── Confetti particle data ──
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'square' | 'circle';
  rotation: number;
}

const PARTICLE_COLORS: string[] = [
  COLORS.aiPurple,
  COLORS.techBlue,
  COLORS.insightOrange,
  COLORS.aiPurple,
  COLORS.techBlue,
];

const PARTICLES: Particle[] = Array.from({ length: 14 }, (_, i) => ({
  x: 0,
  y: 0,
  vx: (random(`px-${i}`) - 0.5) * 18,
  vy: (random(`py-${i}`) - 0.8) * 14,
  size: 6 + random(`ps-${i}`) * 8,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  shape: (i % 2 === 0 ? 'square' : 'circle') as 'square' | 'circle',
  rotation: random(`pr-${i}`) * 360,
}));

// ── Chat messages for the revealed chatbot ──
const CHAT_MESSAGES: { role: 'user' | 'ai'; text: string; delay?: number }[] = [
  { role: 'user', text: "What's the weather?", delay: 0 },
  { role: 'ai', text: 'The weather in your area is...', delay: 8 },
];

// ── Confetti burst ──
const ConfettiBurst: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.CONFETTI_BURST;
  if (relFrame < 0 || relFrame > 35) return null;

  const fadeOut = interpolate(relFrame, [15, 35], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        opacity: fadeOut,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {PARTICLES.map((p, i) => {
        const progress = spring({
          frame: relFrame,
          fps,
          config: { damping: 12, mass: 0.5, stiffness: 200 },
        });
        const px = p.vx * progress * 12;
        const py = p.vy * progress * 12;
        const rot = p.rotation + relFrame * 4;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : 2,
              transform: `translate(${px}px, ${py}px) rotate(${rot}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

// ── Press Release Card ──
const PressReleaseCard: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.PRESS_RELEASE_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const cardY = interpolate(enterProgress, [0, 1], [-80, 0]);
  const cardOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // After reveal, cross-dissolve the card content
  const revealProgress =
    frame >= BEATS.REVEAL_CHATBOT
      ? interpolate(frame - BEATS.REVEAL_CHATBOT, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: 900,
        opacity: cardOpacity,
        transform: `translateY(${cardY}px)`,
      }}
    >
      {/* Press release front */}
      <div
        style={{
          backgroundColor: COLORS.bgSurface,
          border: `2px solid ${COLORS.panelBorder}`,
          borderRadius: 16,
          padding: '36px 32px',
          opacity: 1 - revealProgress,
          display: revealProgress >= 1 ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Fake logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${COLORS.aiPurple}, ${COLORS.techBlue})`,
            }}
          />
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 24,
              color: COLORS.textMuted,
            }}
          >
            ACME AI
          </span>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center' }}>
          <GradientText
            startFrame={0}
            colors={[COLORS.aiPurple, COLORS.techBlue]}
            duration={120}
            direction="horizontal"
            yoyo
            fontSize={56}
          >
            INTRODUCING OUR AI AGENT
          </GradientText>
        </div>
      </div>

      {/* Chatbot reveal behind */}
      {revealProgress > 0 && (
        <div
          style={{
            opacity: revealProgress,
            position: revealProgress >= 1 ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <ChatWindow
            messages={CHAT_MESSAGES}
            startFrame={BEATS.REVEAL_CHATBOT}
            messageStagger={12}
          />
        </div>
      )}
    </div>
  );
};

// ── Cursor ──
const ClickCursor: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  if (frame < BEATS.CURSOR_CLICK - 10 || frame > BEATS.REVEAL_CHATBOT + 5)
    return null;

  const moveProgress = interpolate(
    frame,
    [BEATS.CURSOR_CLICK - 10, BEATS.CURSOR_CLICK],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const cursorX = interpolate(moveProgress, [0, 1], [200, 0]);
  const cursorY = interpolate(moveProgress, [0, 1], [-100, 0]);

  // Click dip
  const clickScale =
    frame >= BEATS.CURSOR_CLICK && frame < BEATS.CURSOR_CLICK + 6
      ? interpolate(frame - BEATS.CURSOR_CLICK, [0, 3, 6], [1, 0.85, 1])
      : 1;

  const fadeOut = interpolate(
    frame,
    [BEATS.REVEAL_CHATBOT, BEATS.REVEAL_CHATBOT + 5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        opacity: fadeOut,
        transform: `translate(${cursorX}px, ${cursorY}px) scale(${clickScale})`,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {/* Simple cursor arrow */}
      <svg width="24" height="32" viewBox="0 0 24 32">
        <path
          d="M2 2 L2 26 L8 20 L14 28 L18 26 L12 18 L20 18 Z"
          fill={COLORS.textBody}
          stroke={COLORS.bg}
          strokeWidth={1.5}
        />
      </svg>
    </div>
  );
};

// ── Stamp ──
const SameChatbotStamp: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.STAMP_IMPACT;
  if (relFrame < 0) return null;

  const stampProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const stampScale = interpolate(stampProgress, [0, 1], [2.5, 1]);
  const stampOpacity = interpolate(stampProgress, [0, 1], [0, 1]);
  const stampRotation = interpolate(stampProgress, [0, 1], [-30, -8]);

  // Screen shake
  let shakeX = 0;
  const shakeFrame = frame - BEATS.SCREEN_SHAKE;
  if (shakeFrame >= 0 && shakeFrame < 12) {
    shakeX = Math.sin(shakeFrame * 2.5) * 3 * (1 - shakeFrame / 12);
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(calc(-50% + ${shakeX}px), -50%) scale(${stampScale}) rotate(${stampRotation}deg)`,
        opacity: stampOpacity,
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          border: `4px solid ${COLORS.errorRed}`,
          borderRadius: 8,
          padding: '12px 28px',
          backgroundColor: 'rgba(239,68,68,0.1)',
        }}
      >
        <span
          style={{
            ...TYPOGRAPHY.title,
            fontSize: 40,
            color: COLORS.errorRed,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          SAME CHATBOT
        </span>
      </div>
    </div>
  );
};

// ── Main Scene ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screen shake offset for the whole scene
  let shakeX = 0;
  const shakeFrame = frame - BEATS.SCREEN_SHAKE;
  if (shakeFrame >= 0 && shakeFrame < 12) {
    shakeX = Math.sin(shakeFrame * 2.5) * 3 * (1 - shakeFrame / 12);
  }

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={8}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Confetti */}
        <ConfettiBurst frame={frame} fps={fps} />

        {/* Press release / chatbot card */}
        <PressReleaseCard frame={frame} fps={fps} />

        {/* Click cursor */}
        <ClickCursor frame={frame} fps={fps} />

        {/* SAME CHATBOT stamp */}
        <SameChatbotStamp frame={frame} fps={fps} />
      </div>
    </SceneContainer>
  );
};
