import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { HistoricalPanel } from '../../../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

/**
 * Scene 2: The Pentium Chip (3s-10s, 210 frames)
 *
 * 1994 badge, Pentium chip build-in, FPU highlight, zoom into
 * lookup table, 5 missing (red) cells.
 */

const BEATS = {
  WARM_BG_IN: 0,
  YEAR_BADGE_IN: 10,
  CHIP_BUILD_IN: 20,
  FPU_HIGHLIGHT: 60,
  CHIP_ZOOM: 80,
  TABLE_GRID_IN: 130,
  TABLE_STAGGER: 2,
  RED_CELLS_IN: 170,
  MISSING_LABEL_IN: 185,
};

const CHIP_SIZE = 280;
const FPU_W = 120;
const FPU_H = 60;
const TABLE_COLS = 5;
const TABLE_ROWS = 4;
const CELL_W = 60;
const CELL_H = 40;
const RED_CELL_INDICES = [3, 7, 12, 16, 19]; // 5 out of 20

// Simulated circuit trace lines inside the chip
const CIRCUIT_TRACES = [
  { x1: 40, y1: 80, x2: 240, y2: 80 },
  { x1: 60, y1: 120, x2: 220, y2: 120 },
  { x1: 80, y1: 160, x2: 200, y2: 160 },
  { x1: 40, y1: 200, x2: 240, y2: 200 },
  { x1: 140, y1: 40, x2: 140, y2: 240 },
  { x1: 100, y1: 60, x2: 100, y2: 220 },
  { x1: 180, y1: 60, x2: 180, y2: 220 },
];

export const Scene2_PentiumChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Chip entrance ---
  const chipProgress = spring({
    frame: frame - BEATS.CHIP_BUILD_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const chipOpacity = frame >= BEATS.CHIP_BUILD_IN
    ? interpolate(chipProgress, [0, 1], [0, 1])
    : 0;
  const chipScale = interpolate(chipProgress, [0, 1], [0.9, 1]);

  // --- FPU pulse ---
  const fpuVisible = frame >= BEATS.FPU_HIGHLIGHT;
  const fpuPulseOpacity = fpuVisible
    ? 0.3 + 0.4 * Math.sin((frame - BEATS.FPU_HIGHLIGHT) * 0.21)
    : 0;

  // --- Chip zoom (to FPU) ---
  const zoomPhase = frame >= BEATS.CHIP_ZOOM;
  const zoomProgress = interpolate(
    frame,
    [BEATS.CHIP_ZOOM, BEATS.CHIP_ZOOM + 50],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  // Ease in-out for zoom
  const zoomEased = 0.5 - 0.5 * Math.cos(zoomProgress * Math.PI);
  const zoomScale = interpolate(zoomEased, [0, 1], [1, 2.5]);
  const chipOuterOpacity = interpolate(zoomEased, [0, 1], [1, 0]);

  // --- Table grid entrance ---
  const tableVisible = frame >= BEATS.TABLE_GRID_IN;
  const tableProgress = spring({
    frame: frame - BEATS.TABLE_GRID_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const tableOpacity = tableVisible
    ? interpolate(tableProgress, [0, 1], [0, 1])
    : 0;

  // --- Missing label ---
  const labelProgress = spring({
    frame: frame - BEATS.MISSING_LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity = frame >= BEATS.MISSING_LABEL_IN
    ? interpolate(labelProgress, [0, 1], [0, 1])
    : 0;
  const labelY = interpolate(labelProgress, [0, 1], [20, 0]);

  // After zoom completes, hide chip, show table
  const showChip = frame < BEATS.TABLE_GRID_IN;
  const showTable = frame >= BEATS.TABLE_GRID_IN;

  return (
    <SceneContainer
      background={COLORS.bgWarm}
      fadeIn
      fadeInDuration={20}
    >
      {/* Subtle radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(201,162,39,0.05) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          height: '100%',
          paddingTop: 60,
          gap: 40,
        }}
      >
        {/* Year badge */}
        <HistoricalPanel year="1994" startFrame={BEATS.YEAR_BADGE_IN}>
          <div />
        </HistoricalPanel>

        {/* Chip illustration area */}
        {showChip && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              opacity: chipOpacity,
              transform: `scale(${zoomPhase ? zoomScale * chipScale : chipScale})`,
            }}
          >
            {/* Chip outer */}
            <div
              style={{
                width: CHIP_SIZE,
                height: CHIP_SIZE,
                borderRadius: 20,
                border: `2px solid ${COLORS.historyGold}`,
                backgroundColor: COLORS.bgSurfaceAlt,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: chipOuterOpacity,
                overflow: 'hidden',
              }}
            >
              {/* Circuit trace lines */}
              <svg
                width={CHIP_SIZE}
                height={CHIP_SIZE}
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                {CIRCUIT_TRACES.map((trace, i) => {
                  const traceStart = BEATS.CHIP_BUILD_IN + 10 + i * 4;
                  const traceLength = Math.sqrt(
                    (trace.x2 - trace.x1) ** 2 + (trace.y2 - trace.y1) ** 2
                  );
                  const traceProgress = interpolate(
                    frame,
                    [traceStart, traceStart + 30],
                    [traceLength, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  );

                  return (
                    <line
                      key={i}
                      x1={trace.x1}
                      y1={trace.y1}
                      x2={trace.x2}
                      y2={trace.y2}
                      stroke={COLORS.historyGold}
                      strokeWidth={1}
                      opacity={0.3}
                      strokeDasharray={traceLength}
                      strokeDashoffset={traceProgress}
                    />
                  );
                })}
              </svg>

              {/* PENTIUM label */}
              <span
                style={{
                  ...TYPOGRAPHY.label,
                  fontSize: 28,
                  color: COLORS.historyGold,
                  zIndex: 1,
                  letterSpacing: 4,
                  marginBottom: 20,
                }}
              >
                PENTIUM
              </span>

              {/* FPU region */}
              <div
                style={{
                  width: FPU_W,
                  height: FPU_H,
                  borderRadius: 8,
                  border: `2px solid ${COLORS.techBlue}`,
                  boxShadow: fpuVisible
                    ? `0 0 20px rgba(59,130,246,${fpuPulseOpacity})`
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  backgroundColor: 'rgba(59,130,246,0.08)',
                }}
              >
                <span
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 24,
                    color: COLORS.techBlue,
                    letterSpacing: 2,
                  }}
                >
                  FPU
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lookup table grid */}
        {showTable && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              opacity: tableOpacity,
              gap: 24,
            }}
          >
            {/* Table label */}
            <span
              style={{
                ...TYPOGRAPHY.label,
                fontSize: 24,
                color: COLORS.textMuted,
                letterSpacing: 2,
              }}
            >
              FPU LOOKUP TABLE
            </span>

            {/* Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${TABLE_COLS}, ${CELL_W}px)`,
                gap: 8,
              }}
            >
              {Array.from({ length: TABLE_ROWS * TABLE_COLS }).map((_, i) => {
                const cellStart = BEATS.TABLE_GRID_IN + i * BEATS.TABLE_STAGGER;
                const cellProgress = spring({
                  frame: frame - cellStart,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                });
                const cellOpacity = frame >= cellStart
                  ? interpolate(cellProgress, [0, 1], [0, 1])
                  : 0;

                const isRed = RED_CELL_INDICES.includes(i);
                const redActive = isRed && frame >= BEATS.RED_CELLS_IN;
                const glowOpacity = redActive
                  ? 0.2 + 0.4 * Math.sin((frame - BEATS.RED_CELLS_IN) * 0.15)
                  : 0;

                // Cell value: show a number for normal, "---" for red
                const cellValue = redActive
                  ? '---'
                  : (i * 53 + 17).toString().slice(0, 3);

                return (
                  <div
                    key={i}
                    style={{
                      width: CELL_W,
                      height: CELL_H,
                      borderRadius: 6,
                      backgroundColor: COLORS.codeBg,
                      border: `1px solid ${
                        redActive ? COLORS.errorRed : COLORS.panelBorder
                      }`,
                      boxShadow: redActive
                        ? `0 0 12px rgba(239,68,68,${glowOpacity})`
                        : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: cellOpacity,
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.code,
                        fontSize: 20,
                        color: redActive ? COLORS.errorRed : COLORS.textMuted,
                      }}
                    >
                      {frame >= cellStart ? cellValue : ''}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* "5 missing entries" label */}
            <div
              style={{
                opacity: labelOpacity,
                transform: `translateY(${labelY}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 44,
                  color: COLORS.errorRed,
                }}
              >
                5 missing entries
              </span>
            </div>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
