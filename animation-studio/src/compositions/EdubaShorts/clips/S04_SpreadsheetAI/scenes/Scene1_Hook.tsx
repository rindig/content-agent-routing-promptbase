import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  GRID_IN: 0,
  CURSOR_APPEAR: 15,
  TYPING_START: 15,
  AUTOCOMPLETE_DROPDOWN: 25,
  FORMULA_FILL: 35,
  RESULTS_CASCADE: 50,
  LABEL_IN: 70,
};

const GRID_COLS = 5;
const GRID_ROWS = 8;
const CELL_W = 170;
const CELL_H = 48;

const COLUMN_HEADERS = ['A', 'B', 'C', 'D', 'E'];
const SAMPLE_DATA: (string | number)[][] = [
  ['Item', 'Q1', 'Q2', 'Q3', 'Q4'],
  ['Revenue', 4200, 5100, 4800, 6300],
  ['Costs', 2100, 2400, 2300, 2800],
  ['Profit', 2100, 2700, 2500, 3500],
  ['Tax', 420, 540, 500, 700],
  ['Net', 1680, 2160, 2000, 2800],
  ['Growth', '12%', '15%', '8%', '22%'],
  ['', '', '', '', ''],
];

const AUTOCOMPLETE_OPTIONS = ['SUM()', 'SUMIF()', 'SUMPRODUCT()'];

const FORMULA_TEXT = 'SUM(B2:B8)';
const TYPED_PREFIX = '=SU';

const RESULT_VALUES = [20370, 10640, 9730, 2580, 7160, '', ''];

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Grid entrance spring
  const gridProgress = spring({
    frame: frame - BEATS.GRID_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const gridScale = interpolate(gridProgress, [0, 1], [0.95, 1]);
  const gridOpacity = interpolate(gridProgress, [0, 1], [0, 1]);

  // Typing animation: "=" at 15, "S" at 19, "U" at 23
  const typedChars = frame < BEATS.TYPING_START
    ? 0
    : frame < 19
      ? 1
      : frame < 23
        ? 2
        : frame < BEATS.AUTOCOMPLETE_DROPDOWN
          ? 3
          : 3;
  const currentTypedText = TYPED_PREFIX.slice(0, typedChars);

  // Autocomplete dropdown
  const dropdownProgress = spring({
    frame: frame - BEATS.AUTOCOMPLETE_DROPDOWN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const dropdownOpacity = interpolate(dropdownProgress, [0, 1], [0, 1]);
  const dropdownSlide = interpolate(dropdownProgress, [0, 1], [8, 0]);

  // Formula fill typewriter: 2 frames per char starting at FORMULA_FILL
  const formulaFrame = frame - BEATS.FORMULA_FILL;
  const formulaChars = Math.max(0, Math.min(FORMULA_TEXT.length, Math.floor(formulaFrame / 2)));
  const currentFormula = FORMULA_TEXT.slice(0, formulaChars);
  const showFormula = frame >= BEATS.FORMULA_FILL;

  // Glow pulse on formula
  const glowOpacity = showFormula
    ? interpolate(
        frame,
        [BEATS.FORMULA_FILL, BEATS.FORMULA_FILL + 20],
        [0.3, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Label entrance
  const labelProgress = spring({
    frame: frame - BEATS.LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [15, 0]);

  // Cell cursor blink
  const cursorVisible = frame >= BEATS.CURSOR_APPEAR && frame < BEATS.FORMULA_FILL;
  const cursorBlink = Math.floor((frame - BEATS.CURSOR_APPEAR) / 10) % 2 === 0;

  // Total grid width/height
  const gridWidth = CELL_W * GRID_COLS;

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 24,
        }}
      >
        {/* Spreadsheet Grid */}
        <div
          style={{
            transform: `scale(${gridScale})`,
            opacity: gridOpacity,
            backgroundColor: COLORS.bgSurface,
            borderRadius: 12,
            border: `1px solid ${COLORS.panelBorder}`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Column headers */}
          <div style={{ display: 'flex' }}>
            {/* Empty corner cell */}
            <div
              style={{
                width: 48,
                height: 36,
                backgroundColor: COLORS.bgSurfaceAlt,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
              }}
            />
            {COLUMN_HEADERS.map((header, i) => (
              <div
                key={header}
                style={{
                  width: CELL_W,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.bgSurfaceAlt,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  borderRight: i < GRID_COLS - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: COLORS.textDim,
                }}
              >
                {header}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {SAMPLE_DATA.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex' }}>
              {/* Row number */}
              <div
                style={{
                  width: 48,
                  height: CELL_H,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: COLORS.bgSurfaceAlt,
                  borderBottom: rowIdx < GRID_ROWS - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  ...TYPOGRAPHY.label,
                  fontSize: 18,
                  color: COLORS.textDim,
                }}
              >
                {rowIdx + 1}
              </div>

              {row.map((cell, colIdx) => {
                const isActiveCell = rowIdx === 0 && colIdx === 1; // B1 becomes the typing cell
                const isResultCell = colIdx === 1 && rowIdx >= 1 && rowIdx <= 7;

                // Result cascade animation
                let resultOpacity = 1;
                let resultScale = 1;
                if (isResultCell && frame >= BEATS.RESULTS_CASCADE) {
                  const resultDelay = (rowIdx - 1) * 3;
                  const resultProgress = spring({
                    frame: frame - BEATS.RESULTS_CASCADE - resultDelay,
                    fps,
                    config: SPRING_CONFIGS.bouncy,
                  });
                  resultOpacity = interpolate(resultProgress, [0, 1], [0, 1]);
                  resultScale = interpolate(resultProgress, [0, 1], [0.8, 1]);
                }

                return (
                  <div
                    key={colIdx}
                    style={{
                      width: CELL_W,
                      height: CELL_H,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      backgroundColor: isActiveCell && (cursorVisible || showFormula)
                        ? COLORS.codeBg
                        : 'transparent',
                      borderBottom: rowIdx < GRID_ROWS - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      borderRight: colIdx < GRID_COLS - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      position: 'relative',
                      boxShadow: isActiveCell && cursorVisible && cursorBlink
                        ? `inset 0 0 0 1px ${COLORS.techBlue}, 0 0 8px ${COLORS.glowBlue}`
                        : isActiveCell && showFormula
                          ? `inset 0 0 0 1px ${COLORS.techBlue}40, 0 0 ${20 * glowOpacity}px ${COLORS.techBlue}`
                          : 'none',
                    }}
                  >
                    {isActiveCell ? (
                      <span
                        style={{
                          ...TYPOGRAPHY.code,
                          fontSize: 28,
                          color: COLORS.textBody,
                        }}
                      >
                        {showFormula
                          ? `=${currentFormula}`
                          : currentTypedText}
                      </span>
                    ) : isResultCell && frame >= BEATS.RESULTS_CASCADE && RESULT_VALUES[rowIdx - 1] !== '' ? (
                      <span
                        style={{
                          ...TYPOGRAPHY.code,
                          fontSize: 26,
                          color: COLORS.textBody,
                          opacity: resultOpacity,
                          transform: `scale(${resultScale})`,
                          display: 'inline-block',
                        }}
                      >
                        {RESULT_VALUES[rowIdx - 1].toLocaleString()}
                      </span>
                    ) : (
                      <span
                        style={{
                          ...TYPOGRAPHY.code,
                          fontSize: colIdx === 0 ? 24 : 26,
                          color: rowIdx === 0 ? COLORS.textMuted : COLORS.textBody,
                        }}
                      >
                        {cell}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Autocomplete dropdown */}
          {frame >= BEATS.AUTOCOMPLETE_DROPDOWN && frame < BEATS.FORMULA_FILL && (
            <div
              style={{
                position: 'absolute',
                top: 36 + CELL_H + 2, // below header + first data row
                left: 48 + CELL_W, // aligned with column B
                width: CELL_W + 40,
                backgroundColor: COLORS.bgSurfaceAlt,
                borderRadius: 8,
                border: `1px solid ${COLORS.panelBorder}`,
                overflow: 'hidden',
                opacity: dropdownOpacity,
                transform: `translateY(${dropdownSlide}px)`,
                zIndex: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}
            >
              {AUTOCOMPLETE_OPTIONS.map((option, i) => (
                <div
                  key={option}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: i === 0 ? `${COLORS.techBlue}20` : 'transparent',
                    borderLeft: i === 0 ? `3px solid ${COLORS.techBlue}` : '3px solid transparent',
                    ...TYPOGRAPHY.code,
                    fontSize: 24,
                    color: i === 0 ? COLORS.techBlue : COLORS.textMuted,
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Label: "Pattern recognition + prediction" */}
        {frame >= BEATS.LABEL_IN && (
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
              ...TYPOGRAPHY.label,
              fontSize: 28,
              color: COLORS.textMuted,
              textAlign: 'center',
            }}
          >
            PATTERN RECOGNITION + PREDICTION
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
