import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SYSTEM_BUILD_START: 0,
  DATA_LAYER: 0,
  LOGIC_LAYER: 8,
  API_LAYER: 16,
  MODEL_LAYER: 24,
  MODEL_HIGHLIGHT: 40,
  MODEL_GRAB: 50,
  MODEL_REMOVE: 60,
  EMPTY_SLOT: 80,
  NEW_MODEL_IN: 85,
  NEW_MODEL_SNAP: 100,
  CHECKMARK: 110,
  SYSTEM_PULSE: 120,
  BARELY_CHANGED_TEXT: 125,
  DELTA_COUNTUP: 130,
  SYSTEM_SLIDE_UP: 160,
  VS_TEXT: 170,
  MONOLITH_IN: 240,
  MONOLITH_CRACK: 260,
  SHATTER: 270,
  EVERYTHING_BREAKS: 280,
  SCENE_END: 300,
};

// ── Architecture layer data ──
interface LayerConfig {
  label: string;
  sublabel: string;
  height: number;
  color: string;
  beatFrame: number;
}

const LAYERS: LayerConfig[] = [
  {
    label: 'Data Layer',
    sublabel: '\u2501\u2501\u2501  \u2501\u2501\u2501  \u2501\u2501\u2501',
    height: 200,
    color: COLORS.techBlue,
    beatFrame: BEATS.DATA_LAYER,
  },
  {
    label: 'Business Logic',
    sublabel: 'if (x > threshold)',
    height: 140,
    color: COLORS.insightOrange,
    beatFrame: BEATS.LOGIC_LAYER,
  },
  {
    label: 'API Layer',
    sublabel: '/api/v2/predict',
    height: 80,
    color: COLORS.solutionGreen,
    beatFrame: BEATS.API_LAYER,
  },
];

// ── Architecture stack (clean system) ──
const ArchitectureStack: React.FC<{
  frame: number;
  fps: number;
  scale: number;
  opacity: number;
  translateY: number;
}> = ({ frame, fps, scale, opacity, translateY }) => {
  // Model removal animation
  const modelRemoveProgress =
    frame >= BEATS.MODEL_REMOVE
      ? spring({
          frame: frame - BEATS.MODEL_REMOVE,
          fps,
          config: SPRING_CONFIGS.snappy,
        })
      : 0;
  const modelSlideX = interpolate(modelRemoveProgress, [0, 1], [0, 400]);
  const modelFadeOut = interpolate(modelRemoveProgress, [0, 1], [1, 0]);

  // New model slides in
  const newModelProgress =
    frame >= BEATS.NEW_MODEL_IN
      ? spring({
          frame: frame - BEATS.NEW_MODEL_IN,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;
  const newModelX = interpolate(newModelProgress, [0, 1], [-400, 0]);
  const newModelOpacity = interpolate(newModelProgress, [0, 1], [0, 1]);

  // Snap bounce
  const snapProgress =
    frame >= BEATS.NEW_MODEL_SNAP
      ? spring({
          frame: frame - BEATS.NEW_MODEL_SNAP,
          fps,
          config: SPRING_CONFIGS.bouncy,
        })
      : 0;
  const snapScale = interpolate(snapProgress, [0, 1], [1.08, 1]);

  // Model glow highlight
  const glowProgress =
    frame >= BEATS.MODEL_HIGHLIGHT
      ? interpolate(
          spring({ frame: frame - BEATS.MODEL_HIGHLIGHT, fps, config: SPRING_CONFIGS.slow }),
          [0, 1],
          [0, 0.5]
        )
      : 0;

  // System pulse
  const pulseActive = frame >= BEATS.SYSTEM_PULSE && frame < BEATS.SYSTEM_PULSE + 10;
  const pulseScale = pulseActive
    ? 1 + Math.sin(((frame - BEATS.SYSTEM_PULSE) / 10) * Math.PI) * 0.02
    : 1;

  // Checkmark
  const showCheckmark = frame >= BEATS.CHECKMARK;
  const checkProgress = showCheckmark
    ? spring({
        frame: frame - BEATS.CHECKMARK,
        fps,
        config: SPRING_CONFIGS.bouncy,
      })
    : 0;

  // Determine if old model still visible, removed, or new model in place
  const showOldModel = frame < BEATS.MODEL_REMOVE;
  const showRemovingModel =
    frame >= BEATS.MODEL_REMOVE && frame < BEATS.NEW_MODEL_IN;
  const showEmptySlot =
    frame >= BEATS.EMPTY_SLOT && frame < BEATS.NEW_MODEL_SNAP;
  const showNewModel = frame >= BEATS.NEW_MODEL_IN;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        transform: `scale(${scale * pulseScale}) translateY(${translateY}px)`,
        opacity,
        transition: 'none',
      }}
    >
      {/* Model slot (top) */}
      <div style={{ position: 'relative', width: 800, marginBottom: 8 }}>
        {/* Old model (before removal) */}
        {showOldModel && (
          <div
            style={{
              width: '100%',
              height: 70,
              backgroundColor: `${COLORS.aiPurple}20`,
              border: `2px solid ${COLORS.aiPurple}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 ${15 * glowProgress}px rgba(139,92,246,${glowProgress})`,
            }}
          >
            <span style={{ ...TYPOGRAPHY.code, fontSize: 30, color: COLORS.aiPurple }}>
              GPT-4o
            </span>
          </div>
        )}

        {/* Model being removed */}
        {showRemovingModel && (
          <div
            style={{
              width: '100%',
              height: 70,
              backgroundColor: `${COLORS.aiPurple}20`,
              border: `2px solid ${COLORS.aiPurple}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateX(${modelSlideX}px)`,
              opacity: modelFadeOut,
            }}
          >
            <span style={{ ...TYPOGRAPHY.code, fontSize: 30, color: COLORS.aiPurple }}>
              GPT-4o
            </span>
          </div>
        )}

        {/* Empty dashed slot */}
        {showEmptySlot && !showNewModel && (
          <div
            style={{
              width: '100%',
              height: 70,
              border: `2px dashed ${COLORS.aiPurple}`,
              borderRadius: 12,
              opacity: 0.6,
            }}
          />
        )}

        {/* New model sliding in */}
        {showNewModel && (
          <div
            style={{
              width: '100%',
              height: 70,
              backgroundColor: `${COLORS.aiPurple}20`,
              border: `2px solid ${COLORS.aiPurple}`,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translateX(${newModelX}px) scale(${snapScale})`,
              opacity: newModelOpacity,
            }}
          >
            <span style={{ ...TYPOGRAPHY.code, fontSize: 30, color: COLORS.aiPurple }}>
              Claude Opus
            </span>
          </div>
        )}

        {/* Checkmark */}
        {showCheckmark && (
          <div
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: COLORS.solutionGreen,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${checkProgress})`,
            }}
          >
            <svg width={20} height={20} viewBox="0 0 20 20">
              <path
                d="M4 10 L8 14 L16 6"
                stroke="#FFF"
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={20}
                strokeDashoffset={interpolate(checkProgress, [0, 1], [20, 0])}
              />
            </svg>
          </div>
        )}
      </div>

      {/* Connecting line */}
      <div style={{ width: 2, height: 12, backgroundColor: COLORS.panelBorder }} />

      {/* Architecture layers (bottom to top visually, but rendered top to bottom) */}
      {[...LAYERS].reverse().map((layer, i) => {
        const layerProgress =
          frame >= layer.beatFrame
            ? spring({
                frame: frame - layer.beatFrame,
                fps,
                config: SPRING_CONFIGS.gentle,
              })
            : 0;
        const layerOpacity = interpolate(layerProgress, [0, 1], [0, 1]);
        const layerY = interpolate(layerProgress, [0, 1], [40, 0]);

        return (
          <React.Fragment key={layer.label}>
            <div
              style={{
                width: 800,
                height: layer.height,
                backgroundColor: `${layer.color}15`,
                border: `2px solid ${layer.color}`,
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: layerOpacity,
                transform: `translateY(${layerY}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 26,
                  color: layer.color,
                  marginBottom: 8,
                }}
              >
                {layer.label}
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 22,
                  color: `${layer.color}70`,
                }}
              >
                {layer.sublabel}
              </span>
            </div>
            {/* Connecting line between layers */}
            {i < LAYERS.length - 1 && (
              <div
                style={{
                  width: 2,
                  height: 12,
                  backgroundColor: COLORS.panelBorder,
                  opacity: layerOpacity,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ── Monolith block (fragile system) ──
const MonolithBlock: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.MONOLITH_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const enterOpacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const enterY = interpolate(enterProgress, [0, 1], [40, 0]);

  // Crack phase
  const crackFrame = frame - BEATS.MONOLITH_CRACK;
  const isCracking = crackFrame >= 0;

  // Shatter phase
  const shatterFrame = frame - BEATS.SHATTER;
  const isShattered = shatterFrame >= 0;

  // Fragment positions (8 pieces)
  const FRAGMENTS: Array<{ x: number; y: number; w: number; h: number; rot: number }> = [
    { x: -120, y: -80, w: 180, h: 100, rot: -25 },
    { x: 100, y: -100, w: 200, h: 80, rot: 15 },
    { x: -140, y: 60, w: 150, h: 120, rot: 30 },
    { x: 130, y: 40, w: 170, h: 90, rot: -20 },
    { x: -80, y: -140, w: 160, h: 70, rot: 40 },
    { x: 160, y: -50, w: 130, h: 110, rot: -35 },
    { x: -100, y: 120, w: 190, h: 80, rot: 20 },
    { x: 90, y: 130, w: 140, h: 100, rot: -45 },
  ];

  if (isShattered) {
    // Render shattered fragments
    return (
      <div
        style={{
          position: 'relative',
          width: 800,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {FRAGMENTS.map((frag, i) => {
          const fragProgress = spring({
            frame: shatterFrame,
            fps,
            config: SPRING_CONFIGS.bouncy,
          });
          const fragX = interpolate(fragProgress, [0, 1], [0, frag.x]);
          const fragY = interpolate(fragProgress, [0, 1], [0, frag.y]);
          const fragRot = interpolate(fragProgress, [0, 1], [0, frag.rot]);
          const fragOpacity = interpolate(
            shatterFrame,
            [0, 30],
            [1, 0.4],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: frag.w,
                height: frag.h,
                backgroundColor: `${COLORS.errorRed}15`,
                border: `2px solid ${COLORS.errorRed}`,
                borderRadius: 4,
                transform: `translate(${fragX}px, ${fragY}px) rotate(${fragRot}deg)`,
                opacity: fragOpacity,
              }}
            />
          );
        })}
      </div>
    );
  }

  // Pre-shatter: solid monolith with optional crack lines
  const crackDrawProgress = isCracking
    ? interpolate(crackFrame, [0, 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: 800,
        height: 300,
        backgroundColor: `${COLORS.errorRed}10`,
        border: `2px solid ${COLORS.textDim}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: enterOpacity,
        transform: `translateY(${enterY}px)`,
      }}
    >
      {/* Mixed-up labels inside monolith */}
      <span style={{ ...TYPOGRAPHY.code, fontSize: 26, color: COLORS.techBlue }}>
        Data +
      </span>
      <span style={{ ...TYPOGRAPHY.code, fontSize: 26, color: COLORS.insightOrange }}>
        Logic +
      </span>
      <span style={{ ...TYPOGRAPHY.code, fontSize: 26, color: COLORS.aiPurple }}>
        Model
      </span>
      <span style={{ ...TYPOGRAPHY.label, fontSize: 20, color: COLORS.textDim, marginTop: 8 }}>
        ALL COUPLED TOGETHER
      </span>

      {/* Crack SVG overlay */}
      {isCracking && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
          viewBox="0 0 800 300"
          preserveAspectRatio="none"
        >
          {[
            'M 400 0 L 380 100 L 350 150 L 320 200 L 280 300',
            'M 400 0 L 420 80 L 460 160 L 500 220 L 520 300',
            'M 0 150 L 200 140 L 350 155 L 450 145 L 600 160 L 800 150',
          ].map((d, i) => {
            const totalLength = 600;
            return (
              <path
                key={i}
                d={d}
                stroke={COLORS.errorRed}
                strokeWidth={2}
                fill="none"
                strokeDasharray={totalLength}
                strokeDashoffset={totalLength * (1 - crackDrawProgress)}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

// ── Main Scene ──
export const Scene3_SystemView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clean system slides up when "vs." appears
  const slideUpProgress =
    frame >= BEATS.SYSTEM_SLIDE_UP
      ? spring({
          frame: frame - BEATS.SYSTEM_SLIDE_UP,
          fps,
          config: SPRING_CONFIGS.gentle,
        })
      : 0;
  const systemScale = interpolate(slideUpProgress, [0, 1], [1, 0.55]);
  const systemY = interpolate(slideUpProgress, [0, 1], [0, -250]);
  const systemOpacity = 1;

  // "System barely changed" text
  const showBarely = frame >= BEATS.BARELY_CHANGED_TEXT;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          paddingTop: 40,
        }}
      >
        {/* Clean architecture stack */}
        <ArchitectureStack
          frame={frame}
          fps={fps}
          scale={systemScale}
          opacity={systemOpacity}
          translateY={systemY}
        />

        {/* "System barely changed" + delta indicator (shown before slide-up) */}
        {showBarely && frame < BEATS.SYSTEM_SLIDE_UP && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              marginTop: 20,
            }}
          >
            <AnimatedText
              variant="body"
              size={44}
              color={COLORS.solutionGreen}
              entrance="slideUp"
              springPreset="snappy"
              startFrame={BEATS.BARELY_CHANGED_TEXT}
              align="center"
            >
              System barely changed
            </AnimatedText>
            {frame >= BEATS.DELTA_COUNTUP && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CountUp
                  to={2.3}
                  from={0}
                  startFrame={BEATS.DELTA_COUNTUP}
                  duration={30}
                  suffix="%"
                  decimals={1}
                  color={COLORS.solutionGreen}
                  fontSize={40}
                  useSpring
                />
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 22,
                    color: COLORS.textMuted,
                    marginTop: 4,
                  }}
                >
                  TOTAL OUTPUT CHANGE
                </span>
              </div>
            )}
          </div>
        )}

        {/* "vs." text */}
        {frame >= BEATS.VS_TEXT && (
          <div
            style={{
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
            }}
          >
            <AnimatedText
              variant="hero"
              size={72}
              color={COLORS.errorRed}
              entrance="scale"
              springPreset="bouncy"
              startFrame={BEATS.VS_TEXT}
              align="center"
            >
              vs.
            </AnimatedText>
          </div>
        )}

        {/* Monolith (below vs.) */}
        {frame >= BEATS.MONOLITH_IN && (
          <div
            style={{
              position: 'absolute',
              bottom: 180,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <MonolithBlock frame={frame} fps={fps} />

            {/* "Everything breaks" label */}
            {frame >= BEATS.EVERYTHING_BREAKS && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <AnimatedText
                  variant="body"
                  size={44}
                  color={COLORS.errorRed}
                  entrance="fade"
                  springPreset="snappy"
                  startFrame={BEATS.EVERYTHING_BREAKS}
                  align="center"
                >
                  Everything breaks
                </AnimatedText>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
