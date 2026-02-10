import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUp } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

/**
 * Scene 4: The Scale (18s-25s, 210 frames)
 *
 * Single chip multiplies into a grid of millions, all flash red,
 * CountUp to $475,000,000.
 */

const BEATS = {
  CHIP_SINGLE_IN: 0,
  CHIP_MULTIPLY_START: 30,
  MULTIPLY_WAVE_STAGGER: 8,
  RED_WAVE: 70,
  RED_WAVE_SPEED: 2,
  CHIPS_DIM: 100,
  COUNTUP_START: 100,
  COUNTUP_DURATION: 40,
  LABEL_IN: 140,
  HOLD_START: 180,
};

// Chip grid waves: 1 -> 4 -> 16 -> 64 -> 256
const CHIP_WAVES = [1, 4, 16, 64, 256];
const CHIP_SIZE = 18;
const GRID_COLS = 16;

// Generate chip positions for a grid
const generateChipGrid = (count: number): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = [];
  const cols = Math.min(count, GRID_COLS);
  const rows = Math.ceil(count / cols);
  const spacingX = 22;
  const spacingY = 22;
  const offsetX = -(cols * spacingX) / 2;
  const offsetY = -(rows * spacingY) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols && positions.length < count; c++) {
      positions.push({
        x: offsetX + c * spacingX,
        y: offsetY + r * spacingY,
      });
    }
  }
  return positions;
};

export const Scene4_Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background color transition: warm -> dark
  const bgTransition = interpolate(
    frame,
    [0, 70],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const bgColor = bgTransition < 0.5 ? COLORS.bgWarm : COLORS.bg;

  // --- Single chip entrance ---
  const singleChipProgress = spring({
    frame: frame - BEATS.CHIP_SINGLE_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const singleChipScale = interpolate(singleChipProgress, [0, 1], [0, 1]);

  // --- Current chip wave ---
  let currentWaveIndex = 0;
  for (let i = 0; i < CHIP_WAVES.length; i++) {
    const waveStart = BEATS.CHIP_MULTIPLY_START + i * BEATS.MULTIPLY_WAVE_STAGGER;
    if (frame >= waveStart) {
      currentWaveIndex = i;
    }
  }

  const showMultiply = frame >= BEATS.CHIP_MULTIPLY_START;
  const chipCount = showMultiply ? CHIP_WAVES[currentWaveIndex] : 1;
  const chipPositions = generateChipGrid(chipCount);

  // --- Red wave ---
  const redWaveActive = frame >= BEATS.RED_WAVE;
  const redWaveFrame = frame - BEATS.RED_WAVE;

  // --- Chips dim ---
  const chipsDimOpacity = interpolate(
    frame,
    [BEATS.CHIPS_DIM, BEATS.CHIPS_DIM + 15],
    [1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Chips fade to 0 at end of scene
  const chipsFinalFade = interpolate(
    frame,
    [BEATS.HOLD_START, BEATS.HOLD_START + 30],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- "Every single one." label ---
  const everyProgress = spring({
    frame: frame - BEATS.RED_WAVE - 15,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const everyOpacity = frame >= BEATS.RED_WAVE + 15
    ? interpolate(everyProgress, [0, 1], [0, 1])
    : 0;
  const everyFade = interpolate(
    frame,
    [BEATS.CHIPS_DIM, BEATS.CHIPS_DIM + 10],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- CountUp visibility ---
  const showCountUp = frame >= BEATS.COUNTUP_START;
  const countUpOpacity = interpolate(
    frame,
    [BEATS.COUNTUP_START, BEATS.COUNTUP_START + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Red glow pulse behind number ---
  const glowPulse = showCountUp
    ? 0.1 + 0.05 * Math.sin((frame - BEATS.COUNTUP_START) * 0.21)
    : 0;
  const glowScale = showCountUp
    ? 1.0 + 0.1 * Math.sin((frame - BEATS.COUNTUP_START) * 0.21)
    : 1;

  // --- "Five missing values." label ---
  const fiveProgress = spring({
    frame: frame - BEATS.LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const fiveOpacity = frame >= BEATS.LABEL_IN
    ? interpolate(fiveProgress, [0, 1], [0, 1])
    : 0;

  return (
    <SceneContainer background={bgColor}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '96px 54px',
          position: 'relative',
        }}
      >
        {/* Chip grid */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: chipsDimOpacity * chipsFinalFade,
          }}
        >
          {!showMultiply ? (
            // Single chip
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                border: `2px solid ${COLORS.historyGold}`,
                backgroundColor: COLORS.bgSurfaceAlt,
                transform: `scale(${singleChipScale})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 10,
                  color: COLORS.historyGold,
                }}
              >
                P
              </span>
            </div>
          ) : (
            // Multiplied chip grid
            <div style={{ position: 'relative', width: 400, height: 400 }}>
              {chipPositions.map((pos, i) => {
                // Distance from center for red wave
                const dist = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
                const maxDist = 250;
                const ringDelay = (dist / maxDist) * 20; // frames per ring
                const isRed =
                  redWaveActive && redWaveFrame > ringDelay * BEATS.RED_WAVE_SPEED;

                const chipWaveIdx = CHIP_WAVES.findIndex((w) => i < w);
                const waveStart =
                  BEATS.CHIP_MULTIPLY_START +
                  (chipWaveIdx >= 0 ? chipWaveIdx : CHIP_WAVES.length - 1) *
                    BEATS.MULTIPLY_WAVE_STAGGER;
                const chipAppearProgress = spring({
                  frame: frame - waveStart,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });
                const chipOpacity = frame >= waveStart
                  ? interpolate(chipAppearProgress, [0, 1], [0, 1])
                  : 0;

                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${pos.x}px)`,
                      top: `calc(50% + ${pos.y}px)`,
                      width: CHIP_SIZE,
                      height: CHIP_SIZE,
                      borderRadius: 3,
                      border: `1px solid ${
                        isRed
                          ? COLORS.errorRed
                          : `${COLORS.historyGold}4D`
                      }`,
                      backgroundColor: isRed
                        ? 'rgba(239,68,68,0.15)'
                        : COLORS.bgSurfaceAlt,
                      opacity: chipOpacity,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* "Every single one." label */}
          {redWaveActive && frame < BEATS.CHIPS_DIM + 10 && (
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                opacity: everyOpacity * everyFade,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 44,
                  color: COLORS.textPrimary,
                }}
              >
                Every single one.
              </span>
            </div>
          )}
        </div>

        {/* CountUp and label */}
        {showCountUp && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 24,
              opacity: countUpOpacity,
              position: 'relative',
            }}
          >
            {/* Red glow background */}
            <div
              style={{
                position: 'absolute',
                top: -40,
                width: 400,
                height: 150,
                borderRadius: '50%',
                backgroundColor: `rgba(239,68,68,${glowPulse})`,
                transform: `scale(${glowScale})`,
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            <CountUp
              to={475000000}
              from={0}
              startFrame={BEATS.COUNTUP_START}
              duration={BEATS.COUNTUP_DURATION}
              prefix="$"
              separator=","
              decimals={0}
              useSpring
              color={COLORS.errorRed}
              fontSize={72}
            />

            {/* "Five missing values." */}
            <div style={{ opacity: fiveOpacity }}>
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 44,
                  color: COLORS.historyGold,
                }}
              >
                Five missing values.
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
