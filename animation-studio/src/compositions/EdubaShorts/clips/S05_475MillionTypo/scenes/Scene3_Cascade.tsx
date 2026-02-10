import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

/**
 * Scene 3: The Cascade (10s-18s, 240 frames)
 *
 * Division hits an empty lookup slot, returns wrong answer.
 * Wrong number cascades downstream through a pipeline.
 * "No crash. No error. Just wrong."
 */

const BEATS = {
  DIVISION_OP_IN: 0,
  POINTER_SCAN_START: 30,
  POINTER_HIT_RED: 50,
  TABLE_FADE: 70,
  RESULTS_IN: 80,
  DIGIT_HIGHLIGHT: 90,
  PIPELINE_START: 100,
  PIPELINE_STAGGER: 10,
  CASCADE_SPREAD: 130,
  CONCLUSION_TEXT_IN: 180,
};

const TABLE_COLS = 5;
const TABLE_ROWS = 4;
const CELL_W = 56;
const CELL_H = 36;
const RED_CELL_INDICES = [3, 7, 12, 16, 19];
const TOTAL_CELLS = TABLE_ROWS * TABLE_COLS;

const PIPELINE_STAGES = [
  'Calculation A',
  'Calculation B',
  'Final Report',
];

export const Scene3_Cascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Division operation label ---
  const divProgress = spring({
    frame: frame - BEATS.DIVISION_OP_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const divOpacity = interpolate(divProgress, [0, 1], [0, 1]);
  const divY = interpolate(divProgress, [0, 1], [-20, 0]);

  // --- Pointer scanning ---
  const pointerActive =
    frame >= BEATS.POINTER_SCAN_START && frame < BEATS.TABLE_FADE;
  const scanFrame = frame - BEATS.POINTER_SCAN_START;
  // Move pointer across cells: 3 frames per cell
  const pointerCellIndex = pointerActive
    ? Math.min(Math.floor(scanFrame / 3), TOTAL_CELLS - 1)
    : -1;
  const hitRed =
    frame >= BEATS.POINTER_HIT_RED &&
    RED_CELL_INDICES.includes(pointerCellIndex);

  // --- Table fade out ---
  const tableFadeOpacity = interpolate(
    frame,
    [BEATS.TABLE_FADE, BEATS.TABLE_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Results entrance ---
  const showResults = frame >= BEATS.RESULTS_IN;
  const expectedProgress = spring({
    frame: frame - BEATS.RESULTS_IN,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const gotProgress = spring({
    frame: frame - (BEATS.RESULTS_IN + 8),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const expectedX = interpolate(expectedProgress, [0, 1], [-80, 0]);
  const expectedOpacity = showResults
    ? interpolate(expectedProgress, [0, 1], [0, 1])
    : 0;
  const gotX = interpolate(gotProgress, [0, 1], [80, 0]);
  const gotOpacity = showResults
    ? interpolate(gotProgress, [0, 1], [0, 1])
    : 0;

  // --- Digit highlight box ---
  const highlightOpacity = interpolate(
    frame,
    [BEATS.DIGIT_HIGHLIGHT, BEATS.DIGIT_HIGHLIGHT + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Results and table visibility ---
  const resultsSectionOpacity = interpolate(
    frame,
    [BEATS.RESULTS_IN, BEATS.RESULTS_IN + 10, BEATS.PIPELINE_START - 5, BEATS.PIPELINE_START + 10],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Pipeline visualization ---
  const showPipeline = frame >= BEATS.PIPELINE_START;
  const pipelineOpacity = interpolate(
    frame,
    [BEATS.PIPELINE_START, BEATS.PIPELINE_START + 15, BEATS.CONCLUSION_TEXT_IN - 10, BEATS.CONCLUSION_TEXT_IN],
    [0, 1, 1, 0.2],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Red dot position through pipeline
  const dotFrame = frame - BEATS.PIPELINE_START;
  const dotStageIndex = Math.min(
    Math.floor(dotFrame / BEATS.PIPELINE_STAGGER),
    PIPELINE_STAGES.length - 1
  );

  // --- Cascade spread (smaller dots) ---
  const showCascade = frame >= BEATS.CASCADE_SPREAD;
  const cascadeOpacity = interpolate(
    frame,
    [BEATS.CASCADE_SPREAD, BEATS.CASCADE_SPREAD + 15, BEATS.CONCLUSION_TEXT_IN - 10, BEATS.CONCLUSION_TEXT_IN],
    [0, 0.6, 0.6, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // --- Conclusion dim ---
  const conclusionActive = frame >= BEATS.CONCLUSION_TEXT_IN;

  return (
    <SceneContainer background={COLORS.bgWarm}>
      {/* Radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(201,162,39,0.05) 0%, transparent 70%)`,
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
          padding: '96px 54px',
          position: 'relative',
        }}
      >
        {/* --- Table + Division Operation (first phase) --- */}
        {frame < BEATS.TABLE_FADE + 20 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              opacity: tableFadeOpacity,
            }}
          >
            {/* Division operation */}
            <div
              style={{
                opacity: divOpacity,
                transform: `translateY(${divY}px)`,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 32,
                  color: COLORS.textBody,
                }}
              >
                4,195,835 / 3,145,727
              </span>
            </div>

            {/* Lookup table mini-grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${TABLE_COLS}, ${CELL_W}px)`,
                gap: 6,
                position: 'relative',
              }}
            >
              {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
                const isRed = RED_CELL_INDICES.includes(i);
                const isPointerHere = pointerActive && pointerCellIndex === i;
                const col = i % TABLE_COLS;
                const row = Math.floor(i / TABLE_COLS);

                return (
                  <div
                    key={i}
                    style={{
                      width: CELL_W,
                      height: CELL_H,
                      borderRadius: 5,
                      backgroundColor: COLORS.codeBg,
                      border: `1px solid ${
                        isRed
                          ? COLORS.errorRed
                          : isPointerHere
                          ? COLORS.techBlue
                          : COLORS.panelBorder
                      }`,
                      boxShadow:
                        isPointerHere && isRed
                          ? `0 0 16px ${COLORS.glowRed}`
                          : isPointerHere
                          ? `0 0 10px ${COLORS.glowBlue}`
                          : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform:
                        isPointerHere && isRed ? 'scale(1.3)' : 'scale(1)',
                      transition: 'none',
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.code,
                        fontSize: 18,
                        color: isRed ? COLORS.errorRed : COLORS.textMuted,
                      }}
                    >
                      {isRed ? '---' : (i * 53 + 17).toString().slice(0, 3)}
                    </span>
                  </div>
                );
              })}

              {/* "MISS" label on hit */}
              {frame >= BEATS.POINTER_HIT_RED && frame < BEATS.TABLE_FADE && (
                <div
                  style={{
                    position: 'absolute',
                    top: -28,
                    right: -10,
                    opacity: interpolate(
                      frame,
                      [BEATS.POINTER_HIT_RED, BEATS.POINTER_HIT_RED + 5],
                      [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                    ),
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 24,
                      color: COLORS.errorRed,
                    }}
                  >
                    MISS
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Expected vs Got results --- */}
        {showResults && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              opacity: resultsSectionOpacity,
              position: 'absolute',
              top: '30%',
            }}
          >
            <div
              style={{
                opacity: expectedOpacity,
                transform: `translateX(${expectedX}px)`,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: COLORS.solutionGreen,
                }}
              >
                Expected: 1.333
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: COLORS.solutionGreen,
                  opacity: 0.7,
                }}
              >
                {' '}820 449...
              </span>
            </div>

            <div
              style={{
                opacity: gotOpacity,
                transform: `translateX(${gotX}px)`,
                position: 'relative',
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: COLORS.errorRed,
                }}
              >
                Got:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.333
              </span>
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 36,
                  color: COLORS.errorRed,
                  position: 'relative',
                }}
              >
                {' '}739 068...
                {/* Highlight box around diverging digits */}
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    left: 0,
                    right: -4,
                    bottom: -4,
                    border: `2px solid ${COLORS.errorRed}`,
                    borderRadius: 4,
                    opacity: highlightOpacity,
                    pointerEvents: 'none',
                  }}
                />
              </span>
            </div>
          </div>
        )}

        {/* --- Pipeline visualization --- */}
        {showPipeline && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              opacity: pipelineOpacity,
              position: 'absolute',
              top: '25%',
            }}
          >
            {PIPELINE_STAGES.map((stage, i) => {
              const stageReached = dotFrame >= i * BEATS.PIPELINE_STAGGER;
              const stageProgress = spring({
                frame: frame - (BEATS.PIPELINE_START + i * BEATS.PIPELINE_STAGGER),
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              const stageOpacity = interpolate(stageProgress, [0, 1], [0.4, 1]);

              return (
                <React.Fragment key={i}>
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      style={{
                        width: 2,
                        height: 30,
                        backgroundColor: stageReached
                          ? COLORS.errorRed
                          : COLORS.panelBorder,
                        opacity: 0.6,
                      }}
                    />
                  )}

                  {/* Stage box */}
                  <div
                    style={{
                      width: 260,
                      height: 60,
                      borderRadius: 12,
                      border: `1.5px solid ${
                        stageReached ? COLORS.errorRed : COLORS.panelBorder
                      }`,
                      backgroundColor: stageReached
                        ? 'rgba(239,68,68,0.08)'
                        : COLORS.codeBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: stageOpacity,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 24,
                        color: stageReached ? COLORS.errorRed : COLORS.textMuted,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {stage}
                    </span>

                    {/* Red dot traveling through */}
                    {stageReached && dotStageIndex === i && (
                      <div
                        style={{
                          position: 'absolute',
                          left: -8,
                          top: '50%',
                          marginTop: -6,
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: COLORS.errorRed,
                          boxShadow: `0 0 10px ${COLORS.glowRed}`,
                        }}
                      />
                    )}
                  </div>

                  {/* Cascade spread - smaller dots spreading laterally */}
                  {showCascade && stageReached && (
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        opacity: cascadeOpacity,
                      }}
                    >
                      {[
                        { x: -80, y: 10 },
                        { x: 90, y: 15 },
                        { x: -50, y: -5 },
                      ].map((offset, j) => {
                        const spreadProgress = spring({
                          frame: frame - (BEATS.CASCADE_SPREAD + i * 8 + j * 4),
                          fps,
                          config: SPRING_CONFIGS.gentle,
                        });
                        const spreadX = interpolate(spreadProgress, [0, 1], [0, offset.x]);
                        const spreadY = interpolate(spreadProgress, [0, 1], [0, offset.y]);
                        const spreadOp = interpolate(spreadProgress, [0, 1], [0, 0.8]);

                        return (
                          <div
                            key={j}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: 0,
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: COLORS.errorRed,
                              opacity: spreadOp,
                              transform: `translate(${spreadX}px, ${spreadY}px)`,
                            }}
                          />
                        );
                      })}
                      {/* Thin red lines connecting spread dots */}
                      <svg
                        width={300}
                        height={40}
                        style={{
                          position: 'absolute',
                          left: 'calc(50% - 150px)',
                          top: -10,
                          pointerEvents: 'none',
                        }}
                      >
                        {[
                          { x: -80, y: 10 },
                          { x: 90, y: 15 },
                          { x: -50, y: -5 },
                        ].map((offset, j) => {
                          const lProgress = spring({
                            frame: frame - (BEATS.CASCADE_SPREAD + i * 8 + j * 4),
                            fps,
                            config: SPRING_CONFIGS.gentle,
                          });
                          const lOp = interpolate(lProgress, [0, 1], [0, 0.4]);

                          return (
                            <line
                              key={j}
                              x1={150}
                              y1={20}
                              x2={150 + offset.x}
                              y2={20 + offset.y}
                              stroke={COLORS.errorRed}
                              strokeWidth={1}
                              opacity={lOp}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* --- Conclusion text --- */}
        {conclusionActive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '96px 54px',
            }}
          >
            <BlurText
              startFrame={BEATS.CONCLUSION_TEXT_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={5}
              blurAmount={10}
              distance={30}
              fontSize={52}
            >
              No crash. No error. Just wrong.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
