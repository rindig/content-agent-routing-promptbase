import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (relative to scene start = frame 0 within this scene) ──
const BEATS = {
  ZOOM_OUT_START: 0,
  ZOOM_OUT_END: 30,
  DATABASE_IN: 30,
  RULES_IN: 50,
  AI_IN: 65,
  PERCENT_60: 70,
  PERCENT_30: 85,
  PERCENT_10: 95,
  ANNOTATION_ARROW: 110,
  THIS_MATTERS_TEXT: 130,
  MODEL_PULSE: 190,
  ONE_PIECE_TEXT: 210,
  SCENE_END: 270,
};

// ── Animated SVG arrow ──
const AnnotationArrow: React.FC<{
  frame: number;
  fps: number;
  startFrame: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}> = ({ frame, fps, startFrame, x1, y1, x2, y2 }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const drawProgress = interpolate(relFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={COLORS.textMuted}
        strokeWidth={2}
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        opacity={0.6}
      />
      {/* Arrowhead */}
      {drawProgress > 0.8 && (
        <polygon
          points={`${x2},${y2} ${x2 - 8},${y2 + 12} ${x2 + 8},${y2 + 12}`}
          fill={COLORS.textMuted}
          opacity={interpolate(drawProgress, [0.8, 1], [0, 0.6], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      )}
    </svg>
  );
};

// ── System block component ──
const SystemBlock: React.FC<{
  label: string;
  height: number;
  color: string;
  frame: number;
  fps: number;
  enterFrame: number;
  interiorLines?: number;
  codeLines?: string[];
}> = ({ label, height, color, frame, fps, enterFrame, interiorLines, codeLines }) => {
  const relFrame = frame - enterFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const y = interpolate(enterProgress, [0, 1], [100, 0]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: `${color}15`,
        border: `2px solid ${color}`,
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        transform: `translateY(${y}px)`,
        position: 'relative',
        padding: '8px 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Label */}
      <div
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 28,
          color,
          marginBottom: interiorLines || codeLines ? 8 : 0,
        }}
      >
        {label}
      </div>

      {/* Interior table lines (for database) */}
      {interiorLines && (
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: interiorLines }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 2,
                backgroundColor: color,
                opacity: 0.3,
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      )}

      {/* Interior code lines (for rules) */}
      {codeLines && (
        <div style={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {codeLines.map((line, i) => (
            <div
              key={i}
              style={{
                ...TYPOGRAPHY.code,
                fontSize: 24,
                color,
                opacity: 0.7,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Scene2_SystemDiagram ──
export const Scene2_SystemDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Zoom-out effect
  const zoomProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const scale = interpolate(zoomProgress, [0, 1], [1.3, 1.0]);

  // Percentage labels
  const show60 = frame >= BEATS.PERCENT_60;
  const show30 = frame >= BEATS.PERCENT_30;
  const show10 = frame >= BEATS.PERCENT_10;

  const pct60Progress = spring({
    frame: Math.max(0, frame - BEATS.PERCENT_60),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const pct30Progress = spring({
    frame: Math.max(0, frame - BEATS.PERCENT_30),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const pct10Progress = spring({
    frame: Math.max(0, frame - BEATS.PERCENT_10),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // "This is what matters" text
  const showThisMatters = frame >= BEATS.THIS_MATTERS_TEXT;
  const thisMattersProgress = spring({
    frame: Math.max(0, frame - BEATS.THIS_MATTERS_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const thisMattersY = interpolate(thisMattersProgress, [0, 1], [20, 0]);
  const thisMattersOpacity = interpolate(thisMattersProgress, [0, 1], [0, 1]);

  // Database pulse
  const dbPulseScale =
    frame >= BEATS.PERCENT_60 && frame < BEATS.PERCENT_60 + 20
      ? interpolate(frame - BEATS.PERCENT_60, [0, 10, 20], [1, 1.02, 1])
      : 1;

  // AI model pulse glow
  const aiGlowOpacity =
    frame >= BEATS.MODEL_PULSE
      ? interpolate(Math.sin((frame - BEATS.MODEL_PULSE) * 0.15) * 0.5 + 0.5, [0, 1], [0.1, 0.4])
      : 0;

  // "The model is one piece" text
  const showOnePiece = frame >= BEATS.ONE_PIECE_TEXT;
  const onePieceProgress = spring({
    frame: Math.max(0, frame - BEATS.ONE_PIECE_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const onePieceOpacity = interpolate(onePieceProgress, [0, 1], [0, 1]);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={15}
      fadeOut
      fadeOutStart={255}
      fadeOutDuration={15}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
        }}
      >
        {/* System diagram container */}
        <div
          style={{
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative',
          }}
        >
          {/* "This is what matters" above DB */}
          {showThisMatters && (
            <div
              style={{
                textAlign: 'center',
                opacity: thisMattersOpacity,
                transform: `translateY(${thisMattersY}px)`,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 44,
                  color: COLORS.textBody,
                }}
              >
                This is what matters
              </span>
            </div>
          )}

          {/* Database block (60%) — largest */}
          <div style={{ position: 'relative', transform: `scale(${dbPulseScale})` }}>
            <SystemBlock
              label="DATABASE"
              height={360}
              color={COLORS.techBlue}
              frame={frame}
              fps={fps}
              enterFrame={BEATS.DATABASE_IN}
              interiorLines={3}
            />
            {/* 60% label */}
            {show60 && (
              <div
                style={{
                  position: 'absolute',
                  right: -10,
                  top: '50%',
                  transform: 'translateY(-50%) translateX(100%)',
                  opacity: interpolate(pct60Progress, [0, 1], [0, 1]),
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.title,
                    fontSize: 56,
                    color: COLORS.techBlue,
                  }}
                >
                  60%
                </span>
              </div>
            )}
          </div>

          {/* Rules block (30%) — medium */}
          <div style={{ position: 'relative' }}>
            <SystemBlock
              label="BUSINESS RULES"
              height={180}
              color={COLORS.insightOrange}
              frame={frame}
              fps={fps}
              enterFrame={BEATS.RULES_IN}
              codeLines={['if (x > threshold)']}
            />
            {/* 30% label */}
            {show30 && (
              <div
                style={{
                  position: 'absolute',
                  right: -10,
                  top: '50%',
                  transform: 'translateY(-50%) translateX(100%)',
                  opacity: interpolate(pct30Progress, [0, 1], [0, 1]),
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.title,
                    fontSize: 56,
                    color: COLORS.insightOrange,
                  }}
                >
                  30%
                </span>
              </div>
            )}
          </div>

          {/* AI Model block (10%) — smallest */}
          <div style={{ position: 'relative' }}>
            <SystemBlock
              label="AI MODEL"
              height={70}
              color={COLORS.aiPurple}
              frame={frame}
              fps={fps}
              enterFrame={BEATS.AI_IN}
            />
            {/* AI glow pulse */}
            {aiGlowOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: 14,
                  boxShadow: `0 0 20px ${COLORS.glowPurple}`,
                  opacity: aiGlowOpacity,
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* 10% label */}
            {show10 && (
              <div
                style={{
                  position: 'absolute',
                  right: -10,
                  top: '50%',
                  transform: 'translateY(-50%) translateX(100%)',
                  opacity: interpolate(pct10Progress, [0, 1], [0, 1]),
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.title,
                    fontSize: 56,
                    color: COLORS.aiPurple,
                  }}
                >
                  10%
                </span>
              </div>
            )}
          </div>

          {/* Annotation arrow from AI block to DB block */}
          {frame >= BEATS.ANNOTATION_ARROW && (
            <AnnotationArrow
              frame={frame}
              fps={fps}
              startFrame={BEATS.ANNOTATION_ARROW}
              x1={100}
              y1={580}
              x2={100}
              y2={60}
            />
          )}
        </div>

        {/* "The model is one piece" */}
        {showOnePiece && (
          <div
            style={{
              marginTop: 24,
              opacity: onePieceOpacity,
              textAlign: 'center',
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.textMuted,
              }}
            >
              The model is one piece
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
