import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GradientText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  TECH_TEXT_IN: 0,
  MORPH_START: 20,
  MORPH_COMPLETE: 45,
  EST_LABEL: 50,
  CARD_SILHOUETTE: 65,
};

// ── Mad Libs card silhouette ──
const MadLibsCardSilhouette: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const relFrame = frame - BEATS.CARD_SILHOUETTE;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(enterProgress, [0, 1], [0.8, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(2deg)`,
        backgroundColor: 'rgba(201,162,39,0.1)',
        border: `1px solid rgba(201,162,39,0.5)`,
        borderRadius: 12,
        padding: '16px 28px',
        width: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.code,
          fontSize: 28,
          color: COLORS.historyGold,
        }}
      >
        The ___ ran ___ly
      </span>
    </div>
  );
};

// ── Scene1_Hook ──
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Tech text entrance (GradientText) ──
  const techEnter = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const techScale = interpolate(techEnter, [0, 1], [0.7, 1]);
  const techY = interpolate(techEnter, [0, 1], [40, 0]);

  // ── Morph: cross-fade from tech style to vintage ──
  const morphProgress = interpolate(
    frame,
    [BEATS.MORPH_START, BEATS.MORPH_COMPLETE],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Tech text fades out, vintage fades in
  const techOpacity = interpolate(
    frame,
    [BEATS.MORPH_START + 5, BEATS.MORPH_START + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const vintageOpacity = interpolate(
    frame,
    [BEATS.MORPH_START + 10, BEATS.MORPH_COMPLETE],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Letter spacing morph
  const letterSpacing = interpolate(morphProgress, [0, 1], [2, 6]);

  // ── Est. label ──
  const estRelFrame = frame - BEATS.EST_LABEL;
  const estProgress =
    estRelFrame >= 0
      ? spring({ frame: estRelFrame, fps, config: SPRING_CONFIGS.gentle })
      : 0;
  const estY = interpolate(estProgress, [0, 1], [20, 0]);
  const estOpacity = interpolate(estProgress, [0, 1], [0, 1]);

  // ── Background warm tint bleed ──
  const warmBleed = interpolate(
    frame,
    [BEATS.MORPH_COMPLETE, 90],
    [0, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={8}>
      {/* Warm edge vignette bleeding in */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, ${COLORS.bgWarm} 100%)`,
          opacity: warmBleed,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 24,
          position: 'relative',
        }}
      >
        {/* Tech text (gradient, monospace) */}
        <div
          style={{
            opacity: techOpacity,
            transform: `scale(${techScale}) translateY(${techY}px)`,
            letterSpacing,
            position: 'absolute',
          }}
        >
          <GradientText
            startFrame={0}
            colors={[COLORS.aiPurple, COLORS.techBlue, COLORS.aiPurple]}
            duration={120}
            direction="horizontal"
            fontSize={64}
          >
            PROMPT ENGINEERING
          </GradientText>
        </div>

        {/* Vintage text (warm, serif feel) */}
        <div
          style={{
            opacity: vintageOpacity,
            letterSpacing: 6,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.quote,
              fontSize: 52,
              color: COLORS.historyGold,
              fontStyle: 'normal',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
            }}
          >
            PROMPT ENGINEERING
          </span>
        </div>

        {/* Est. 1953 subtitle */}
        <div
          style={{
            opacity: estOpacity,
            transform: `translateY(${estY}px)`,
          }}
        >
          <span
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 32,
              color: COLORS.historyGold,
              letterSpacing: 4,
            }}
          >
            est. 1953
          </span>
        </div>

        {/* Mad Libs card silhouette */}
        <MadLibsCardSilhouette frame={frame} fps={fps} />
      </div>
    </SceneContainer>
  );
};
