import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { GlitchBurst } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 4: Compilers Everywhere
 * Duration: 210 frames (7 seconds)
 *
 * X stamp shatters → compiler diagram heals (green) → icons replicate
 * outward in waves → labels float in → compress to green dot →
 * "Foundation of everything." expands.
 */

const BEATS = {
  X_SHATTER: 0,
  DIAGRAM_HEAL: 10,
  MULTIPLY_START: 30,
  MULTIPLY_STAGGER: 6,
  LABELS_IN: 70,
  LABEL_STAGGER: 4,
  COMPRESS_TO_DOT: 100,
  EXPANSION_TEXT: 140,
  HOLD: 180,
};

const TECH_LABELS = ['iOS', 'Android', 'Chrome', 'Python', 'ChatGPT', 'Linux', 'Windows'];

// Pre-computed random positions for labels within safe area
const LABEL_POSITIONS = [
  { x: 120, y: 300 },
  { x: 650, y: 420 },
  { x: 200, y: 750 },
  { x: 580, y: 880 },
  { x: 100, y: 1100 },
  { x: 700, y: 600 },
  { x: 400, y: 1250 },
];

// Replication wave helper: generates grid positions for compiler icons
const getGridPositions = (wave: number): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];
  const cols = Math.min(wave * 2, 8);
  const rows = Math.min(wave * 2, 10);
  const spacingX = 900 / cols;
  const spacingY = 1400 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push({
        x: 90 + c * spacingX + spacingX / 2,
        y: 260 + r * spacingY + spacingY / 2,
      });
    }
  }
  return positions;
};

// Mini compiler icon (two stacked rects)
const CompilerIcon: React.FC<{
  x: number;
  y: number;
  startFrame: number;
  compressFrame: number;
  compressProgress: number;
}> = ({ x, y, startFrame, compressFrame, compressProgress }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rel = frame - startFrame;
  if (rel < 0) return null;

  const entrance = spring({
    frame: rel,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const scale = interpolate(entrance, [0, 1], [0, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 0.7]);

  // Compress toward center
  const centerX = 540;
  const centerY = 960;
  const compX = interpolate(compressProgress, [0, 1], [x, centerX]);
  const compY = interpolate(compressProgress, [0, 1], [y, centerY]);
  const compScale = interpolate(compressProgress, [0, 1], [scale, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: compX - 15,
        top: compY - 15,
        opacity: frame >= compressFrame ? interpolate(compressProgress, [0, 0.8], [opacity, 0], { extrapolateRight: 'clamp' }) : opacity,
        transform: `scale(${frame >= compressFrame ? compScale : scale})`,
      }}
    >
      <div
        style={{
          width: 30,
          height: 12,
          borderRadius: 3,
          border: `1px solid ${COLORS.solutionGreen}`,
          marginBottom: 2,
        }}
      />
      <div
        style={{
          width: 30,
          height: 12,
          borderRadius: 3,
          border: `1px solid ${COLORS.solutionGreen}`,
        }}
      />
    </div>
  );
};

export const Scene4_CompilersEverywhere: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background transition: warm → dark
  const bgTransition = interpolate(
    frame,
    [0, 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // X shatter: GlitchBurst for 10 frames, then fade out
  const xVisible = frame < 15;
  const xFadeOut = interpolate(
    frame,
    [BEATS.X_SHATTER, BEATS.X_SHATTER + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Diagram border color transition (red → green)
  const diagColorProgress = interpolate(
    frame,
    [BEATS.DIAGRAM_HEAL, BEATS.DIAGRAM_HEAL + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Replication waves
  const wave1Active = frame >= BEATS.MULTIPLY_START;
  const wave2Active = frame >= BEATS.MULTIPLY_START + BEATS.MULTIPLY_STAGGER;
  const wave3Active = frame >= BEATS.MULTIPLY_START + BEATS.MULTIPLY_STAGGER * 2;
  const wave4Active = frame >= BEATS.MULTIPLY_START + BEATS.MULTIPLY_STAGGER * 3;

  // All icons visible phase
  const allIconsPhase = frame >= BEATS.MULTIPLY_START && frame < BEATS.COMPRESS_TO_DOT + 30;

  // Compress progress
  const compressProgress = frame >= BEATS.COMPRESS_TO_DOT
    ? spring({
        frame: frame - BEATS.COMPRESS_TO_DOT,
        fps,
        config: SPRING_CONFIGS.snappy,
      })
    : 0;

  // Center dot
  const dotVisible = frame >= BEATS.COMPRESS_TO_DOT + 10;
  const dotProgress = spring({
    frame: frame - (BEATS.COMPRESS_TO_DOT + 10),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const dotScale = interpolate(dotProgress, [0, 1], [0, 1]);
  const dotPulse = dotVisible
    ? 1 + 0.3 * Math.sin((frame - BEATS.COMPRESS_TO_DOT) * 0.157)
    : 0;

  // Labels fade
  const labelsVisible = frame >= BEATS.LABELS_IN && frame < BEATS.COMPRESS_TO_DOT;
  const labelsFadeOut = interpolate(
    frame,
    [BEATS.COMPRESS_TO_DOT - 10, BEATS.COMPRESS_TO_DOT],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Expansion text
  const expansionTextProgress = spring({
    frame: frame - BEATS.EXPANSION_TEXT,
    fps,
    config: SPRING_CONFIGS.slow,
  });
  const expansionScale = interpolate(expansionTextProgress, [0, 1], [0.5, 1]);
  const expansionOpacity = interpolate(expansionTextProgress, [0, 1], [0, 1]);

  // Diagram fade out as icons take over
  const diagramOpacity = interpolate(
    frame,
    [BEATS.MULTIPLY_START, BEATS.MULTIPLY_START + 30],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Generate grid positions for different waves
  const wave1Positions = getGridPositions(1).slice(0, 4);
  const wave2Positions = getGridPositions(2).slice(0, 16);
  const wave3Positions = getGridPositions(3).slice(0, 48);

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={200}
      fadeOutDuration={10}
    >
      {/* Warm bg overlay that fades out */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.bgWarm,
          opacity: 1 - bgTransition,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: LAYOUT.safePadding,
          position: 'relative',
        }}
      >
        {/* Mini compiler diagram at start (healing) */}
        {frame < BEATS.MULTIPLY_START + 30 && (
          <div
            style={{
              position: 'absolute',
              top: LAYOUT.platformTopSafe + LAYOUT.safeMarginY,
              left: '50%',
              transform: 'translateX(-50%) scale(0.5)',
              opacity: diagramOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                width: 280,
                height: 36,
                borderRadius: 6,
                backgroundColor: 'rgba(201,162,39,0.1)',
                border: `1px solid ${
                  diagColorProgress > 0.5 ? COLORS.solutionGreen : COLORS.historyGold
                }`,
                transition: 'none',
              }}
            />
            <svg width={2} height={16}>
              <line
                x1={1}
                y1={0}
                x2={1}
                y2={16}
                stroke={diagColorProgress > 0.5 ? COLORS.solutionGreen : COLORS.historyGold}
                strokeWidth={1.5}
              />
            </svg>
            <div
              style={{
                width: 280,
                height: 36,
                borderRadius: 6,
                backgroundColor: 'rgba(59,130,246,0.1)',
                border: `1px solid ${
                  diagColorProgress > 0.5 ? COLORS.solutionGreen : COLORS.techBlue
                }`,
              }}
            />

            {/* X stamp that shatters */}
            {xVisible && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: xFadeOut,
                }}
              >
                <GlitchBurst
                  startFrame={0}
                  burstInterval={5}
                  burstDuration={4}
                  fontSize={60}
                  color={COLORS.errorRed}
                  fontWeight={900}
                  intensity={1}
                  backgroundColor="transparent"
                >
                  X
                </GlitchBurst>
              </div>
            )}
          </div>
        )}

        {/* Replicating compiler icons */}
        {allIconsPhase && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {wave1Active &&
              wave1Positions.map((pos, i) => (
                <CompilerIcon
                  key={`w1-${i}`}
                  x={pos.x}
                  y={pos.y}
                  startFrame={BEATS.MULTIPLY_START}
                  compressFrame={BEATS.COMPRESS_TO_DOT}
                  compressProgress={compressProgress}
                />
              ))}
            {wave2Active &&
              wave2Positions.map((pos, i) => (
                <CompilerIcon
                  key={`w2-${i}`}
                  x={pos.x}
                  y={pos.y}
                  startFrame={BEATS.MULTIPLY_START + BEATS.MULTIPLY_STAGGER}
                  compressFrame={BEATS.COMPRESS_TO_DOT}
                  compressProgress={compressProgress}
                />
              ))}
            {wave3Active &&
              wave3Positions.map((pos, i) => (
                <CompilerIcon
                  key={`w3-${i}`}
                  x={pos.x}
                  y={pos.y}
                  startFrame={BEATS.MULTIPLY_START + BEATS.MULTIPLY_STAGGER * 2}
                  compressFrame={BEATS.COMPRESS_TO_DOT}
                  compressProgress={compressProgress}
                />
              ))}
          </div>
        )}

        {/* Floating tech labels */}
        {labelsVisible && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {TECH_LABELS.map((label, i) => {
              const labelStart = BEATS.LABELS_IN + i * BEATS.LABEL_STAGGER;
              const labelProgress = spring({
                frame: frame - labelStart,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]) * labelsFadeOut;

              return (
                <div
                  key={label}
                  style={{
                    position: 'absolute',
                    left: LABEL_POSITIONS[i].x,
                    top: LABEL_POSITIONS[i].y,
                    opacity: labelOpacity,
                    textAlign: 'center',
                  }}
                >
                  {/* Glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: -10,
                      backgroundColor: COLORS.solutionGreen,
                      opacity: 0.1,
                      filter: 'blur(15px)',
                      borderRadius: '50%',
                    }}
                  />
                  <span
                    style={{
                      ...TYPOGRAPHY.body,
                      fontSize: 32,
                      color: COLORS.textPrimary,
                      position: 'relative',
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Center dot */}
        {dotVisible && (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: COLORS.solutionGreen,
              transform: `scale(${dotScale * dotPulse})`,
              boxShadow: `0 0 30px ${COLORS.glowGreen}, 0 0 60px ${COLORS.glowGreen}`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        )}

        {/* "Foundation of everything." */}
        {frame >= BEATS.EXPANSION_TEXT && (
          <div
            style={{
              textAlign: 'center',
              opacity: expansionOpacity,
              transform: `scale(${expansionScale})`,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <span
              style={{
                ...TYPOGRAPHY.title,
                fontSize: 56,
                color: COLORS.solutionGreen,
              }}
            >
              Foundation of everything.
            </span>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
