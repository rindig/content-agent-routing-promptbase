import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';

/**
 * ParsingPipeline: Shows the transformation from AI text to structured data
 * with animated icons and flowing data visualization
 */

// SVG Icons for pipeline stages
const TextIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const cursorBlink = Math.sin(frame * 0.15) > 0;
  const typeProgress = (frame % 45) / 45;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Text lines with typing animation */}
      <rect x="4" y="6" width={4 + typeProgress * 16} height="3" rx="1" fill={color} opacity={0.9} />
      <rect x="4" y="13" width="20" height="3" rx="1" fill={color} opacity={0.6} />
      <rect x="4" y="20" width="16" height="3" rx="1" fill={color} opacity={0.5} />
      <rect x="4" y="27" width="12" height="2" rx="1" fill={color} opacity={0.4} />
      {/* Cursor */}
      {cursorBlink && (
        <rect x={6 + typeProgress * 16} y="5" width="2" height="5" fill={color} />
      )}
    </svg>
  );
};

const RegexIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const scanPos = (frame % 30) / 30;
  const matchPulse = Math.sin(frame * 0.2) * 0.3 + 0.7;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Regex pattern */}
      <text x="4" y="14" fontSize="10" fontFamily="monospace" fill={color} opacity={0.7}>/\d+/</text>
      {/* Scan bar */}
      <rect x={4 + scanPos * 20} y="4" width="4" height="16" fill={color} opacity={0.3} />
      {/* Match highlight */}
      <rect x="10" y="18" width="12" height="10" rx="2" fill={color} opacity={matchPulse * 0.3} />
      <text x="12" y="26" fontSize="10" fontFamily="monospace" fill={color} fontWeight="bold">4</text>
    </svg>
  );
};

const ExtractIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const extractY = interpolate((frame % 40) / 40, [0, 0.5, 1], [0, -5, 0]);
  const glow = Math.sin(frame * 0.1) * 0.2 + 0.8;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Extraction funnel */}
      <path d="M6 6 L26 6 L20 16 L20 26 L12 26 L12 16 Z" fill="none" stroke={color} strokeWidth="2" opacity={0.5} />
      {/* Extracted value floating up */}
      <g style={{ transform: `translateY(${extractY}px)` }}>
        <rect x="10" y="12" width="12" height="10" rx="2" fill={color} opacity={glow * 0.3} />
        <text x="12" y="20" fontSize="11" fontFamily="monospace" fill={color} fontWeight="bold">"4"</text>
      </g>
    </svg>
  );
};

const ConvertIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const rotation = Math.sin(frame * 0.05) * 15;
  const morphProgress = (frame % 60) / 60;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Transformation arrows */}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}>
        <path d="M8 16 L16 8 L24 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M8 16 L16 24 L24 16" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Morphing number */}
      <circle cx="16" cy="16" r={6 + morphProgress * 2} fill={color} opacity={0.3} />
      <text x="12" y="20" fontSize="12" fontFamily="monospace" fill={color} fontWeight="bold">4</text>
    </svg>
  );
};

const ScoreIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const barHeight1 = Math.sin(frame * 0.08) * 4 + 12;
  const barHeight2 = Math.sin(frame * 0.08 + 1) * 4 + 16;
  const barHeight3 = Math.sin(frame * 0.08 + 2) * 4 + 10;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Bar chart */}
      <rect x="6" y={28 - barHeight1} width="6" height={barHeight1} rx="1" fill={color} opacity={0.7} />
      <rect x="13" y={28 - barHeight2} width="6" height={barHeight2} rx="1" fill={color} opacity={0.85} />
      <rect x="20" y={28 - barHeight3} width="6" height={barHeight3} rx="1" fill={color} opacity={0.6} />
      {/* Trend line */}
      <path d="M8 20 L16 12 L23 18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

const StatsIcon: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const pulse = Math.sin(frame * 0.1) * 0.2 + 0.8;
  const rotation = frame * 0.3;

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {/* Sigma symbol */}
      <text x="8" y="22" fontSize="18" fontFamily="serif" fill={color} opacity={pulse}>Σ</text>
      {/* Orbiting data point */}
      <circle
        cx={16 + Math.cos((rotation * Math.PI) / 180) * 12}
        cy={16 + Math.sin((rotation * Math.PI) / 180) * 12}
        r="3"
        fill={color}
        opacity={0.7}
      />
    </svg>
  );
};

// Corner brackets
const CornerBrackets: React.FC<{ color: string; size?: number }> = ({ color, size = 8 }) => (
  <>
    <div style={{ position: 'absolute', top: 4, left: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', top: 4, right: 4, width: size, height: size, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, left: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}`, opacity: 0.6 }} />
    <div style={{ position: 'absolute', bottom: 4, right: 4, width: size, height: size, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}`, opacity: 0.6 }} />
  </>
);

// Internal animation for boxes
const BoxInternalAnimation: React.FC<{ frame: number; color: string }> = ({ frame, color }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      borderRadius: 12,
      pointerEvents: 'none',
    }}
  >
    {/* Scan line */}
    <div
      style={{
        position: 'absolute',
        top: `${((frame % 50) / 50) * 100}%`,
        left: 0,
        right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
      }}
    />
  </div>
);

// Animated arrow with flowing data
const FlowingArrow: React.FC<{ frame: number; color: string; delay: number }> = ({ frame, color, delay }) => {
  const dotPos = ((frame - delay) % 25) / 25;
  const opacity = frame > delay ? 0.6 : 0;

  return (
    <div style={{ position: 'relative', width: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={50} height={30}>
        <defs>
          <marker id="arrow-end" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={color} opacity={opacity} />
          </marker>
        </defs>
        <line x1={5} y1={15} x2={40} y2={15} stroke={color} strokeWidth={2} opacity={opacity} markerEnd="url(#arrow-end)" />
      </svg>
      {/* Flowing dot */}
      {frame > delay && (
        <div
          style={{
            position: 'absolute',
            left: 5 + dotPos * 35,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
            opacity: 0.9,
          }}
        />
      )}
    </div>
  );
};

type ParsingPipelineProps = {
  startFrame?: number;
  showFullPipeline?: boolean;
  showScoring?: boolean;
  showStats?: boolean;
  scale?: number;
};

export const ParsingPipeline: React.FC<ParsingPipelineProps> = ({
  startFrame = 0,
  showFullPipeline = true,
  showScoring = true,
  showStats = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - startFrame;

  const baseProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const stages = [
    { id: 'raw', label: 'AI Response', content: '"...rate this a 4..."', color: COLORS.ai, delay: 0, icon: TextIcon, isAI: true },
    { id: 'regex', label: 'Regex Match', content: '/\\d+/', color: COLORS.dataProcessing, delay: 30, icon: RegexIcon, isAI: false },
    { id: 'extract', label: 'Extract', content: '"4"', color: COLORS.dataProcessing, delay: 60, icon: ExtractIcon, isAI: false },
    { id: 'convert', label: 'Convert', content: '4', sublabel: 'integer', color: COLORS.dataProcessing, delay: 90, icon: ConvertIcon, isAI: false },
  ];

  const scoringStages = [
    { id: 'reverse', label: 'Reverse Score', content: '4 → 2', detail: '(6 - value)', color: COLORS.dataProcessing, delay: 120, icon: ScoreIcon },
    { id: 'subscale', label: 'Subscale', content: 'Σ items', detail: 'aggregate', color: COLORS.dataProcessing, delay: 150, icon: StatsIcon },
    { id: 'final', label: 'Score', content: '78.5', detail: 'normalized', color: COLORS.dataProcessing, delay: 180, icon: ScoreIcon },
  ];

  // Stats view
  if (showStats) {
    const statCards = [
      { name: 'SciPy', detail: "Cronbach's α", delay: 0 },
      { name: 'NumPy', detail: 'Correlation', delay: 15 },
      { name: 'pandas', detail: 'Data wrangling', delay: 30 },
    ];

    return (
      <div
        style={{
          width: 900,
          height: 500,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          transform: `scale(${scale})`,
          opacity: interpolate(baseProgress, [0, 1], [0, 1]),
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.textPrimary,
            marginBottom: 20,
          }}
        >
          Statistical Analysis
        </div>

        <div style={{ display: 'flex', gap: 60 }}>
          {statCards.map((card, i) => {
            const cardProgress = spring({
              frame: adjustedFrame - card.delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={card.name}
                style={{
                  position: 'relative',
                  padding: '30px 40px',
                  backgroundColor: COLORS.surface,
                  border: `2px solid ${COLORS.dataProcessing}60`,
                  borderRadius: 16,
                  textAlign: 'center',
                  opacity: interpolate(cardProgress, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(cardProgress, [0, 1], [20, 0])}px)`,
                  overflow: 'hidden',
                }}
              >
                <BoxInternalAnimation frame={adjustedFrame} color={COLORS.dataProcessing} />
                <CornerBrackets color={COLORS.dataProcessing} size={8} />
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.dataProcessing,
                    marginBottom: 12,
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 16,
                    color: COLORS.textMuted,
                  }}
                >
                  {card.detail}
                </div>
                {/* Type badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    padding: '4px 10px',
                    backgroundColor: COLORS.orchestration,
                    borderRadius: 6,
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 10,
                    fontWeight: 700,
                    color: COLORS.background,
                    boxShadow: `0 0 8px ${COLORS.orchestration}80`,
                  }}
                >
                  CODE
                </div>
              </div>
            );
          })}
        </div>

        {/* Key insight */}
        <div
          style={{
            marginTop: 30,
            opacity: interpolate(
              spring({ frame: adjustedFrame - 60, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 1]
            ),
          }}
        >
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 24, color: COLORS.textMuted }}>
            Decades-old math.{' '}
          </span>
          <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 24, color: COLORS.dataProcessing, fontWeight: 600 }}>
            Zero AI.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 1100,
        height: 550,
        position: 'relative',
        transform: `scale(${scale})`,
        opacity: interpolate(baseProgress, [0, 1], [0, 1]),
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.dataProcessing,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Data Transformation Pipeline
        </span>
      </div>

      {/* Main pipeline */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: 50,
          right: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {stages.map((stage, i) => {
          const stageProgress = spring({
            frame: adjustedFrame - stage.delay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          const IconComponent = stage.icon;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage box */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: interpolate(stageProgress, [0, 1], [0, 1]),
                  transform: `
                    translateY(${interpolate(stageProgress, [0, 1], [20, 0])}px)
                    scale(${interpolate(stageProgress, [0, 1], [0.9, 1])})
                  `,
                }}
              >
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.textMuted,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {stage.label}
                </div>
                <div
                  style={{
                    position: 'relative',
                    padding: '20px 24px',
                    backgroundColor: `${stage.color}15`,
                    border: `2px solid ${stage.color}`,
                    borderRadius: 12,
                    minWidth: 130,
                    textAlign: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <BoxInternalAnimation frame={adjustedFrame} color={stage.color} />
                  <CornerBrackets color={stage.color} size={6} />
                  <div style={{ marginBottom: 8 }}>
                    <IconComponent frame={adjustedFrame} color={stage.color} />
                  </div>
                  <code
                    style={{
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontSize: 18,
                      color: stage.color,
                      fontWeight: 600,
                    }}
                  >
                    {stage.content}
                  </code>
                  {stage.sublabel && (
                    <div
                      style={{
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 10,
                        color: COLORS.textMuted,
                        marginTop: 6,
                      }}
                    >
                      {stage.sublabel}
                    </div>
                  )}
                  {/* Type badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      padding: '3px 8px',
                      backgroundColor: stage.isAI ? COLORS.ai : COLORS.orchestration,
                      borderRadius: 4,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      fontSize: 9,
                      fontWeight: 700,
                      color: COLORS.background,
                      boxShadow: `0 0 6px ${stage.isAI ? COLORS.ai : COLORS.orchestration}80`,
                    }}
                  >
                    {stage.isAI ? 'AI' : 'CODE'}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              {i < stages.length - 1 && (
                <FlowingArrow frame={adjustedFrame} color={COLORS.dataProcessing} delay={stage.delay + 15} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Scoring pipeline (second row) */}
      {showScoring && (
        <div
          style={{
            position: 'absolute',
            top: 310,
            left: 150,
            right: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {scoringStages.map((stage, i) => {
            const stageProgress = spring({
              frame: adjustedFrame - stage.delay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const IconComponent = stage.icon;

            return (
              <React.Fragment key={stage.id}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: interpolate(stageProgress, [0, 1], [0, 1]),
                    transform: `
                      translateY(${interpolate(stageProgress, [0, 1], [20, 0])}px)
                      scale(${interpolate(stageProgress, [0, 1], [0.9, 1])})
                    `,
                  }}
                >
                  <div
                    style={{
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      fontSize: 13,
                      color: COLORS.textMuted,
                      marginBottom: 10,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                    }}
                  >
                    {stage.label}
                  </div>
                  <div
                    style={{
                      position: 'relative',
                      padding: '16px 20px',
                      backgroundColor: `${stage.color}15`,
                      border: `2px solid ${stage.color}`,
                      borderRadius: 10,
                      minWidth: 110,
                      textAlign: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <BoxInternalAnimation frame={adjustedFrame} color={stage.color} />
                    <CornerBrackets color={stage.color} size={5} />
                    <div style={{ marginBottom: 6 }}>
                      <IconComponent frame={adjustedFrame} color={stage.color} />
                    </div>
                    <code
                      style={{
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 16,
                        color: stage.color,
                        fontWeight: 600,
                      }}
                    >
                      {stage.content}
                    </code>
                    {stage.detail && (
                      <div
                        style={{
                          fontFamily: TYPOGRAPHY.code.fontFamily,
                          fontSize: 9,
                          color: COLORS.textMuted,
                          marginTop: 4,
                        }}
                      >
                        {stage.detail}
                      </div>
                    )}
                    {/* Type badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        padding: '2px 6px',
                        backgroundColor: COLORS.orchestration,
                        borderRadius: 4,
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 8,
                        fontWeight: 700,
                        color: COLORS.background,
                      }}
                    >
                      CODE
                    </div>
                  </div>
                </div>

                {i < scoringStages.length - 1 && (
                  <FlowingArrow frame={adjustedFrame} color={COLORS.dataProcessing} delay={stage.delay + 15} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Connecting arrow between rows */}
      {showScoring && (
        <div
          style={{
            position: 'absolute',
            top: 240,
            right: 180,
            opacity: interpolate(
              spring({ frame: adjustedFrame - 100, fps, config: SPRING_CONFIGS.gentle }),
              [0, 1],
              [0, 0.6]
            ),
          }}
        >
          <svg width="40" height="60">
            <path d="M20 5 L20 50 M10 42 L20 52 L30 42" fill="none" stroke={COLORS.dataProcessing} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Bottom insight */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({ frame: adjustedFrame - (showScoring ? 200 : 120), fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.textMuted }}>
          This is{' '}
        </span>
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.dataProcessing, fontWeight: 600 }}>
          arithmetic
        </span>
        <span style={{ fontFamily: TYPOGRAPHY.body.fontFamily, fontSize: 20, color: COLORS.textMuted }}>
          . Pattern matching. Data transformation.
        </span>
      </div>
    </div>
  );
};

export default ParsingPipeline;
