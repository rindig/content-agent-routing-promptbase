import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  TOP_PANEL_IN: 5,
  AI_TEXT_IN: 8,
  VS_IN: 20,
  BOTTOM_PANEL_IN: 25,
  TRAD_TEXT_IN: 28,
  HOLD: 50,
};

// ── S14 accent colors ──
const S14 = {
  probabilisticPurple: '#C084FC',
  deterministicBlue: '#60A5FA',
  vsRed: '#F87171',
};

// ── Debate Panel ──
const DebatePanel: React.FC<{
  frame: number;
  fps: number;
  text: string;
  textColor: string;
  glowColor: string;
  startFrame: number;
  textStartFrame: number;
  waver?: boolean;
}> = ({ frame, fps, text, textColor, glowColor, startFrame, textStartFrame, waver = false }) => {
  const panelProgress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const panelY = interpolate(panelProgress, [0, 1], [40, 0]);
  const panelOpacity = interpolate(panelProgress, [0, 1], [0, 1]);

  // Text entrance
  const textProgress = spring({
    frame: frame - textStartFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textY = interpolate(textProgress, [0, 1], [15, 0]);

  // Subtle waver for "unreliable" side
  const waverOpacity = waver
    ? interpolate(
        Math.sin(frame * (Math.PI / 10)),
        [-1, 1],
        [0.9, 1.0]
      )
    : 1;

  return (
    <div
      style={{
        backgroundColor: COLORS.bgSurface,
        borderRadius: 12,
        border: `1px solid ${COLORS.panelBorder}`,
        padding: '32px 36px',
        width: 800,
        maxWidth: '100%',
        boxShadow: `0 0 15px ${glowColor}`,
        opacity: panelOpacity,
        transform: `translateY(${panelY}px)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140,
      }}
    >
      <div
        style={{
          ...TYPOGRAPHY.title,
          fontSize: 48,
          color: textColor,
          textAlign: 'center',
          opacity: textOpacity * waverOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ── VS Badge ──
const VSBadge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.VS_IN;
  if (relFrame < 0) return null;

  const scaleProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const scale = interpolate(scaleProgress, [0, 1], [0, 1]);

  // Subtle pulse during hold phase
  const pulseScale = frame >= BEATS.HOLD
    ? 1 + 0.05 * Math.sin((frame - BEATS.HOLD) * (Math.PI / 20))
    : 1;

  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: S14.vsRed,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale * pulseScale})`,
        boxShadow: '0 0 20px rgba(248,113,113,0.3)',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: 1,
        }}
      >
        VS
      </span>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneContainer
      background={COLORS.bg}
      fadeIn
      fadeInDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 24,
          padding: `0 ${LAYOUT.safeMarginX}px`,
        }}
      >
        {/* Top panel: AI is just probabilistic */}
        <DebatePanel
          frame={frame}
          fps={fps}
          text={'"AI is just probabilistic."'}
          textColor={S14.probabilisticPurple}
          glowColor="rgba(139,92,246,0.15)"
          startFrame={BEATS.TOP_PANEL_IN}
          textStartFrame={BEATS.AI_TEXT_IN}
          waver
        />

        {/* VS badge */}
        <VSBadge frame={frame} fps={fps} />

        {/* Bottom panel: Traditional computing is deterministic */}
        <DebatePanel
          frame={frame}
          fps={fps}
          text={'"Traditional computing is deterministic."'}
          textColor={S14.deterministicBlue}
          glowColor="rgba(59,130,246,0.15)"
          startFrame={BEATS.BOTTOM_PANEL_IN}
          textStartFrame={BEATS.TRAD_TEXT_IN}
        />
      </div>
    </SceneContainer>
  );
};
