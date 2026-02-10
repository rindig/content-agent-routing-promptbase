import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  TOP_PANEL_IN: 15,
  TOP_LABEL: 18,
  TOP_MINISTACK: 22,
  TOP_SUBTITLE: 35,
  BOTTOM_PANEL_IN: 25,
  BOTTOM_LABEL: 28,
  BOTTOM_CLOUD: 32,
  BOTTOM_SUBTITLE: 40,
  VS_RETURN: 50,
  VS_CRACK: 60,
  VS_SPLIT: 65,
  EQUALS_IN: 70,
  PANELS_MERGE: 80,
  SHARED_CLOUD: 90,
  SAME_FOUNDATION: 100,
  ENG_LAYER_1: 130,
  ENG_LAYER_2: 136,
  ENG_LAYER_3: 142,
  ENG_LAYER_4: 148,
  ENG_LAYER_5: 154,
  AI_IN_PROGRESS: 165,
  PANELS_DIM: 190,
  LINE_1_IN: 200,
  LINE_2_IN: 220,
  LINE_3_IN: 240,
  HOLD: 260,
};

// ── S14 accent colors ──
const S14 = {
  electronCloud: '#A78BFA',
  probabilisticPurple: '#C084FC',
  deterministicBlue: '#60A5FA',
  vsRed: '#F87171',
};

// ── Engineering layer labels ──
const ENG_LAYERS = [
  'error correction',
  'architecture',
  'protocols',
  'abstractions',
  'testing',
];

// ── Mini probability cloud ──
const MiniCloud: React.FC<{ frame: number; size?: number }> = ({ frame, size = 40 }) => {
  const breathe = size + 3 * Math.sin((frame * 2 * Math.PI) / 40);
  const dots = [
    { amp: 8, speed: 0.15, phase: 0 },
    { amp: 6, speed: 0.22, phase: 1.2 },
    { amp: 10, speed: 0.12, phase: 2.5 },
    { amp: 5, speed: 0.28, phase: 3.8 },
  ];

  return (
    <div style={{ position: 'relative', width: breathe * 2, height: breathe * 2 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${S14.electronCloud} 0%, rgba(167,139,250,0.3) 40%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
      {dots.map((dot, i) => {
        const x = dot.amp * Math.sin(frame * dot.speed + dot.phase);
        const y = dot.amp * Math.cos(frame * dot.speed * 0.8 + dot.phase + 1.5);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              width: 2,
              height: 2,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: 0.5,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};

// ── Mini layer stack (inside Traditional Computing panel) ──
const MiniLayerStack: React.FC<{ frame: number }> = ({ frame }) => {
  const layers = ['APP', 'OS', 'CODE', 'GATE'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      {layers.map((label, i) => (
        <div
          key={label}
          style={{
            width: 160,
            height: 18,
            backgroundColor: COLORS.bgSurfaceAlt,
            borderTop: `1px solid ${COLORS.techBlue}`,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontFamily: TYPOGRAPHY.label.fontFamily,
              fontWeight: 500,
              color: COLORS.textMuted,
              letterSpacing: 1,
            }}
          >
            {label}
          </span>
        </div>
      ))}
      {/* Probability base */}
      <div style={{ marginTop: 2 }}>
        <MiniCloud frame={frame} size={12} />
      </div>
    </div>
  );
};

// ── VS Badge ──
const VSBadge: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  if (frame < BEATS.VS_RETURN) return null;

  // VS fades in
  const vsProgress = spring({
    frame: frame - BEATS.VS_RETURN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Crack and split
  const hasCrack = frame >= BEATS.VS_CRACK;
  const isSplit = frame >= BEATS.VS_SPLIT;

  const crackProgress = hasCrack
    ? interpolate(
        frame,
        [BEATS.VS_CRACK, BEATS.VS_CRACK + 5],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const splitProgress = isSplit
    ? interpolate(
        frame,
        [BEATS.VS_SPLIT, BEATS.VS_SPLIT + 15],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  const splitFade = isSplit
    ? interpolate(
        frame,
        [BEATS.VS_SPLIT + 5, BEATS.VS_SPLIT + 15],
        [1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 1;

  const vsScale = interpolate(vsProgress, [0, 1], [0, 1]);

  return (
    <div style={{ position: 'relative', width: 60, height: 60 }}>
      {/* VS circle - splits into two halves */}
      {splitFade > 0 && (
        <>
          {/* Left half */}
          <div
            style={{
              position: 'absolute',
              width: 30,
              height: 60,
              left: 0,
              overflow: 'hidden',
              transform: `translateX(${-15 * splitProgress}px) rotate(${-5 * splitProgress}deg) scale(${vsScale})`,
              opacity: splitFade,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: S14.vsRed,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
          </div>
          {/* Right half */}
          <div
            style={{
              position: 'absolute',
              width: 30,
              height: 60,
              right: 0,
              overflow: 'hidden',
              transform: `translateX(${15 * splitProgress}px) rotate(${5 * splitProgress}deg) scale(${vsScale})`,
              opacity: splitFade,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: S14.vsRed,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -30,
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
          </div>
          {/* Crack line */}
          {hasCrack && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '10%',
                width: 2,
                height: `${crackProgress * 80}%`,
                backgroundColor: S14.vsRed,
                transform: 'translateX(-50%) rotate(15deg)',
                opacity: splitFade,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

// ── Equals Badge ──
const EqualsBadge: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  if (frame < BEATS.EQUALS_IN) return null;

  const progress = spring({
    frame: frame - BEATS.EQUALS_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const scale = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.solutionGreen,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale})`,
        boxShadow: '0 0 20px rgba(16,185,129,0.3)',
      }}
    >
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: 0,
        }}
      >
        =
      </span>
    </div>
  );
};

// ── Engineering Layer ──
const EngLayer: React.FC<{
  label: string;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ label, frame, fps, startFrame }) => {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const y = interpolate(progress, [0, 1], [15, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: 280,
        height: 26,
        backgroundColor: COLORS.bgSurface,
        borderTop: `1px solid ${COLORS.solutionGreen}`,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontFamily: TYPOGRAPHY.label.fontFamily,
          fontWeight: 500,
          color: COLORS.solutionGreen,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Main Scene ──
export const Scene4_Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Panel animations ──
  const topPanelProgress = spring({
    frame: frame - BEATS.TOP_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const topPanelY = interpolate(topPanelProgress, [0, 1], [40, 0]);
  const topPanelOpacity = interpolate(topPanelProgress, [0, 1], [0, 1]);

  const bottomPanelProgress = spring({
    frame: frame - BEATS.BOTTOM_PANEL_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const bottomPanelY = interpolate(bottomPanelProgress, [0, 1], [40, 0]);
  const bottomPanelOpacity = interpolate(bottomPanelProgress, [0, 1], [0, 1]);

  // ── Label animations ──
  const topLabelProgress = spring({
    frame: frame - BEATS.TOP_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const bottomLabelProgress = spring({
    frame: frame - BEATS.BOTTOM_LABEL,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const topSubtitleProgress = spring({
    frame: frame - BEATS.TOP_SUBTITLE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const bottomSubtitleProgress = spring({
    frame: frame - BEATS.BOTTOM_SUBTITLE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // ── Merge animation ──
  const mergeProgress =
    frame >= BEATS.PANELS_MERGE
      ? spring({
          frame: frame - BEATS.PANELS_MERGE,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;

  const topMergeY = interpolate(mergeProgress, [0, 1], [0, 50]);
  const bottomMergeY = interpolate(mergeProgress, [0, 1], [0, -50]);

  // ── "SAME FOUNDATION" text ──
  const sameFoundationProgress =
    frame >= BEATS.SAME_FOUNDATION
      ? spring({
          frame: frame - BEATS.SAME_FOUNDATION,
          fps,
          config: SPRING_CONFIGS.bouncy,
        })
      : 0;

  // ── Shared cloud ──
  const sharedCloudProgress =
    frame >= BEATS.SHARED_CLOUD
      ? spring({
          frame: frame - BEATS.SHARED_CLOUD,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;

  // ── "AI IN PROGRESS" label ──
  const aiInProgressProgress =
    frame >= BEATS.AI_IN_PROGRESS
      ? spring({
          frame: frame - BEATS.AI_IN_PROGRESS,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;

  // ── Panels dim for closing text ──
  const panelsDimOpacity =
    frame >= BEATS.PANELS_DIM
      ? interpolate(
          frame,
          [BEATS.PANELS_DIM, BEATS.PANELS_DIM + 20],
          [1, 0.15],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  // ── Closing text phase ──
  const showClosingText = frame >= BEATS.PANELS_DIM;

  // ── "???" pulse for AI subtitle ──
  const questionPulse = 0.7 + 0.3 * Math.sin(frame * (Math.PI / 15));

  // ── Final line progress ──
  const line3Progress =
    frame >= BEATS.LINE_3_IN
      ? spring({
          frame: frame - BEATS.LINE_3_IN,
          fps,
          config: SPRING_CONFIGS.slow,
        })
      : 0;

  return (
    <SceneContainer background={COLORS.bg} fadeIn fadeInDuration={15}>
      {/* ── Panels container ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: `0 ${LAYOUT.safeMarginX}px`,
          gap: 20,
          opacity: panelsDimOpacity,
        }}
      >
        {/* ── Top Panel: Traditional Computing ── */}
        <div
          style={{
            backgroundColor: COLORS.bgSurface,
            borderRadius: 12,
            border: `1px solid ${COLORS.panelBorder}`,
            padding: '24px 28px',
            width: 800,
            maxWidth: '100%',
            boxShadow: `0 0 15px rgba(59,130,246,0.15)`,
            opacity: topPanelOpacity,
            transform: `translateY(${topPanelY + topMergeY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Label */}
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 40,
              color: S14.deterministicBlue,
              opacity: interpolate(topLabelProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(topLabelProgress, [0, 1], [10, 0])}px)`,
              textAlign: 'center',
            }}
          >
            TRADITIONAL COMPUTING
          </div>

          {/* Mini stack */}
          {frame >= BEATS.TOP_MINISTACK && (
            <MiniLayerStack frame={frame} />
          )}

          {/* Subtitle */}
          {frame >= BEATS.TOP_SUBTITLE && (
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.textMuted,
                opacity: interpolate(topSubtitleProgress, [0, 1], [0, 1]),
              }}
            >
              probabilistic + engineering
            </div>
          )}
        </div>

        {/* ── VS / Equals Badge (centered between panels) ── */}
        <div style={{ position: 'relative', height: 60 }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <VSBadge frame={frame} fps={fps} />
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <EqualsBadge frame={frame} fps={fps} />
          </div>
        </div>

        {/* ── Bottom Panel: AI ── */}
        <div
          style={{
            backgroundColor: COLORS.bgSurface,
            borderRadius: 12,
            border: `1px solid ${COLORS.panelBorder}`,
            padding: '24px 28px',
            width: 800,
            maxWidth: '100%',
            boxShadow: `0 0 15px rgba(139,92,246,0.15)`,
            opacity: bottomPanelOpacity,
            transform: `translateY(${bottomPanelY + bottomMergeY}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Label */}
          <div
            style={{
              ...TYPOGRAPHY.title,
              fontSize: 40,
              color: S14.probabilisticPurple,
              opacity: interpolate(bottomLabelProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(bottomLabelProgress, [0, 1], [10, 0])}px)`,
              textAlign: 'center',
            }}
          >
            AI
          </div>

          {/* Cloud */}
          {frame >= BEATS.BOTTOM_CLOUD && (
            <MiniCloud frame={frame} size={30} />
          )}

          {/* "In progress" dashed outlines (fewer layers) */}
          {frame >= BEATS.AI_IN_PROGRESS && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                alignItems: 'center',
                opacity: interpolate(aiInProgressProgress, [0, 1], [0, 1]),
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 140,
                    height: 16,
                    border: `1px dashed ${COLORS.textDim}`,
                    borderRadius: 2,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
          )}

          {/* Subtitle */}
          {frame >= BEATS.BOTTOM_SUBTITLE && (
            <div
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 22,
                color: COLORS.textMuted,
                opacity: interpolate(bottomSubtitleProgress, [0, 1], [0, 1]),
              }}
            >
              probabilistic +{' '}
              <span style={{ opacity: questionPulse, color: COLORS.insightOrange }}>
                ???
              </span>
            </div>
          )}
        </div>

        {/* ── Engineering layers (appear between merged panels) ── */}
        {frame >= BEATS.ENG_LAYER_1 && frame < BEATS.PANELS_DIM && (
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: '42%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              alignItems: 'center',
            }}
          >
            {ENG_LAYERS.map((label, i) => (
              <EngLayer
                key={label}
                label={label}
                frame={frame}
                fps={fps}
                startFrame={BEATS.ENG_LAYER_1 + i * 6}
              />
            ))}
          </div>
        )}

        {/* ── AI "ENGINEERING IN PROGRESS" label ── */}
        {frame >= BEATS.AI_IN_PROGRESS && frame < BEATS.PANELS_DIM && (
          <div
            style={{
              position: 'absolute',
              right: 40,
              bottom: '32%',
              ...TYPOGRAPHY.label,
              fontSize: 20,
              color: COLORS.insightOrange,
              opacity: interpolate(aiInProgressProgress, [0, 1], [0, 1]),
              letterSpacing: 1,
            }}
          >
            ENGINEERING
            <br />
            IN PROGRESS
          </div>
        )}

        {/* ── Shared probability cloud at base ── */}
        {frame >= BEATS.SHARED_CLOUD && frame < BEATS.PANELS_DIM && (
          <div
            style={{
              position: 'absolute',
              bottom: '18%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              opacity: interpolate(sharedCloudProgress, [0, 1], [0, 1]),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <MiniCloud frame={frame} size={40} />
          </div>
        )}

        {/* ── "SAME FOUNDATION" text ── */}
        {frame >= BEATS.SAME_FOUNDATION && frame < BEATS.PANELS_DIM && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${interpolate(sameFoundationProgress, [0, 1], [0.5, 1])})`,
              opacity: interpolate(sameFoundationProgress, [0, 1], [0, 1]),
            }}
          >
            <div
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 48,
                fontWeight: 700,
                color: COLORS.insightOrange,
                textAlign: 'center',
                textShadow: '0 0 30px rgba(245,158,11,0.3)',
              }}
            >
              SAME FOUNDATION
            </div>
          </div>
        )}
      </div>

      {/* ── Closing text (on top of dimmed panels) ── */}
      {showClosingText && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `0 ${LAYOUT.safeMarginX}px`,
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 860, textAlign: 'center' }}>
            {frame >= BEATS.LINE_1_IN && (
              <div style={{ marginBottom: 16 }}>
                <BlurText
                  startFrame={BEATS.LINE_1_IN}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={3}
                  blurAmount={10}
                  distance={25}
                  color={COLORS.textBody}
                  fontSize={44}
                  fontWeight={600}
                >
                  Not breaking a sacred rule.
                </BlurText>
              </div>
            )}

            {frame >= BEATS.LINE_2_IN && (
              <div style={{ marginBottom: 16 }}>
                <BlurText
                  startFrame={BEATS.LINE_2_IN}
                  animateBy="words"
                  direction="bottom"
                  staggerDelay={3}
                  blurAmount={10}
                  distance={25}
                  color={COLORS.textPrimary}
                  fontSize={48}
                  fontWeight={600}
                >
                  Just the newest layer
                </BlurText>
              </div>
            )}

            {frame >= BEATS.LINE_3_IN && (
              <div
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 44,
                  fontWeight: 600,
                  color: COLORS.insightOrange,
                  opacity: interpolate(line3Progress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(line3Progress, [0, 1], [15, 0])}px)`,
                }}
              >
                we haven't finished engineering yet.
              </div>
            )}
          </div>
        </div>
      )}
    </SceneContainer>
  );
};
