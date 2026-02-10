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

// ── S09 extended palette ──
const S09_COLORS = {
  electronGlow: '#A78BFA',
  barrierGray: '#4B5563',
  ghostElectron: 'rgba(167,139,250,0.35)',
  historyGold: '#C9A227',
};

// ── Frame markers (relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  TIMELINE_DRAW: 15,
  ERA_1_NODE: 40,
  ERA_1_YEAR: 45,
  ERA_1_SIZE: 50,
  ERA_1_BARRIER: 55,
  ERA_1_ELECTRON: 65,
  ERA_2_NODE: 90,
  ERA_2_YEAR: 95,
  ERA_2_SIZE: 100,
  ERA_2_BARRIER: 105,
  ERA_2_GHOST: 115,
  ERA_3_NODE: 140,
  ERA_3_YEAR: 145,
  ERA_3_SIZE: 150,
  ERA_3_BARRIER: 155,
  ERA_3_GHOST: 165,
  ERA_3_WARNING: 175,
  ERA_4_NODE: 190,
  ERA_4_YEAR: 195,
  ERA_4_SIZE: 200,
  ERA_4_BARRIER: 205,
  ERA_4_GHOSTS: 215,
  COMPARISON: 240,
  COMPARISON_ARROW: 250,
  HOLD: 270,
};

// ── Era data ──
const ERAS = [
  {
    year: '1971',
    size: '10,000 nm',
    sizeColor: COLORS.textBody,
    barrierWidth: 60,
    nodeColor: COLORS.techBlue,
    nodeSize: 16,
    ghostCount: 0,
    ghostOpacity: 0,
    nodeStart: BEATS.ERA_1_NODE,
    yearStart: BEATS.ERA_1_YEAR,
    sizeStart: BEATS.ERA_1_SIZE,
    barrierStart: BEATS.ERA_1_BARRIER,
    ghostStart: BEATS.ERA_1_ELECTRON,
    xPercent: 0.05,
  },
  {
    year: '1999',
    size: '180 nm',
    sizeColor: COLORS.textBody,
    barrierWidth: 30,
    nodeColor: COLORS.techBlue,
    nodeSize: 14,
    ghostCount: 1,
    ghostOpacity: 0.1,
    nodeStart: BEATS.ERA_2_NODE,
    yearStart: BEATS.ERA_2_YEAR,
    sizeStart: BEATS.ERA_2_SIZE,
    barrierStart: BEATS.ERA_2_BARRIER,
    ghostStart: BEATS.ERA_2_GHOST,
    xPercent: 0.3,
  },
  {
    year: '2015',
    size: '14 nm',
    sizeColor: COLORS.insightOrange,
    barrierWidth: 12,
    nodeColor: COLORS.techBlue,
    nodeSize: 12,
    ghostCount: 2,
    ghostOpacity: 0.3,
    nodeStart: BEATS.ERA_3_NODE,
    yearStart: BEATS.ERA_3_YEAR,
    sizeStart: BEATS.ERA_3_SIZE,
    barrierStart: BEATS.ERA_3_BARRIER,
    ghostStart: BEATS.ERA_3_GHOST,
    xPercent: 0.6,
  },
  {
    year: '2026',
    size: '2 nm',
    sizeColor: COLORS.errorRed,
    barrierWidth: 4,
    nodeColor: COLORS.errorRed,
    nodeSize: 10,
    ghostCount: 3,
    ghostOpacity: 0.5,
    nodeStart: BEATS.ERA_4_NODE,
    yearStart: BEATS.ERA_4_YEAR,
    sizeStart: BEATS.ERA_4_SIZE,
    barrierStart: BEATS.ERA_4_BARRIER,
    ghostStart: BEATS.ERA_4_GHOSTS,
    xPercent: 0.9,
  },
];

// ── Mini electron cloud for timeline ──
const MiniElectronCloud: React.FC<{
  frame: number;
  opacity: number;
  size?: number;
}> = ({ frame, opacity, size = 20 }) => {
  if (opacity <= 0) return null;
  const pulse = size + 4 * Math.sin(frame * 0.1);
  return (
    <div
      style={{
        width: pulse,
        height: pulse,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${S09_COLORS.electronGlow}AA 0%, transparent 70%)`,
        opacity,
        flexShrink: 0,
      }}
    />
  );
};

// ── Ghost electron for "wrong side" ──
const GhostElectron: React.FC<{
  frame: number;
  opacity: number;
  index: number;
}> = ({ frame, opacity, index }) => {
  if (opacity <= 0) return null;
  const offsetY = Math.sin(frame * 0.08 + index * 2) * 5;
  const pulse = 14 + 4 * Math.sin(frame * 0.1 + index * 1.5);
  return (
    <div
      style={{
        width: pulse,
        height: pulse,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${S09_COLORS.electronGlow}88 0%, transparent 70%)`,
        opacity,
        transform: `translateY(${offsetY}px)`,
        flexShrink: 0,
      }}
    />
  );
};

// ── Scene3_ShrinkingTimeline ──
export const Scene3_ShrinkingTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline line draw
  const lineDrawRelFrame = frame - BEATS.TIMELINE_DRAW;
  const lineProgress = spring({
    frame: lineDrawRelFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const lineLength = interpolate(lineProgress, [0, 1], [0, 860]);

  // Layout constants
  const timelineY = 520; // positioned in upper-mid area
  const timelineLeft = 110;
  const timelineWidth = 860;
  const barrierZoneY = 760; // below timeline for barrier visualizations

  // Comparison mode
  const comparisonProgress = spring({
    frame: frame - BEATS.COMPARISON,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const comparisonOpacity = interpolate(comparisonProgress, [0, 1], [0, 1]);

  // Comparison arrow
  const arrowProgress = spring({
    frame: frame - BEATS.COMPARISON_ARROW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const arrowOpacity = interpolate(arrowProgress, [0, 1], [0, 1]);
  const arrowY = interpolate(arrowProgress, [0, 1], [20, 0]);

  return (
    <SceneContainer background="dark" fadeIn fadeInDuration={15}>
      {/* Timeline base line */}
      {lineProgress > 0 && (
        <svg
          style={{
            position: 'absolute',
            top: timelineY,
            left: timelineLeft,
          }}
          width={timelineWidth}
          height={4}
        >
          <line
            x1={0}
            y1={2}
            x2={lineLength}
            y2={2}
            stroke={COLORS.textMuted}
            strokeWidth={2}
          />
        </svg>
      )}

      {/* Era nodes */}
      {ERAS.map((era, eraIndex) => {
        const nodeX = timelineLeft + timelineWidth * era.xPercent;

        // Node entrance
        const nodeProgress = spring({
          frame: frame - era.nodeStart,
          fps,
          config: SPRING_CONFIGS.bouncy,
        });
        const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);
        const nodeOpacity = interpolate(
          frame,
          [era.nodeStart, era.nodeStart + 10],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Year label
        const yearProgress = spring({
          frame: frame - era.yearStart,
          fps,
          config: SPRING_CONFIGS.gentle,
        });
        const yearOpacity = interpolate(yearProgress, [0, 1], [0, 1]);

        // Size label
        const sizeProgress = spring({
          frame: frame - era.sizeStart,
          fps,
          config: SPRING_CONFIGS.gentle,
        });
        const sizeOpacity = interpolate(sizeProgress, [0, 1], [0, 1]);
        const sizeY = interpolate(sizeProgress, [0, 1], [10, 0]);

        // Barrier
        const barrierProgress = spring({
          frame: frame - era.barrierStart,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const barrierScale = interpolate(barrierProgress, [0, 1], [0, 1]);

        // Ghost electrons
        const ghostRelFrame = frame - era.ghostStart;
        const ghostOpacity =
          ghostRelFrame >= 0
            ? interpolate(ghostRelFrame, [0, 15], [0, era.ghostOpacity], {
                extrapolateRight: 'clamp',
              })
            : 0;

        // 2026 barrier flicker
        const isEra4 = eraIndex === 3;
        const barrierFlicker =
          isEra4 && frame >= era.barrierStart
            ? Math.sin(frame * 0.3) > 0.3
              ? COLORS.aiPurple
              : S09_COLORS.barrierGray
            : S09_COLORS.barrierGray;

        // Barrier zone x positioning for comparison mode
        const compBarrierX =
          timelineLeft + 80 + eraIndex * (timelineWidth - 160) / 3;

        return (
          <React.Fragment key={eraIndex}>
            {/* Timeline node dot */}
            <div
              style={{
                position: 'absolute',
                left: nodeX - era.nodeSize / 2,
                top: timelineY - era.nodeSize / 2 + 2,
                width: era.nodeSize,
                height: era.nodeSize,
                borderRadius: '50%',
                backgroundColor: era.nodeColor,
                transform: `scale(${nodeScale})`,
                opacity: nodeOpacity,
              }}
            />

            {/* Year label (above) */}
            {yearOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX,
                  top: timelineY - 50,
                  transform: 'translateX(-50%)',
                  opacity: yearOpacity,
                  ...TYPOGRAPHY.label,
                  fontSize: 24,
                  color: S09_COLORS.historyGold,
                  textAlign: 'center' as const,
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {era.year}
              </div>
            )}

            {/* Size label (below timeline) */}
            {sizeOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX,
                  top: timelineY + 30,
                  transform: `translateX(-50%) translateY(${sizeY}px)`,
                  opacity: sizeOpacity,
                  ...TYPOGRAPHY.code,
                  fontSize: isEra4 ? 36 : 32,
                  color: era.sizeColor,
                  textAlign: 'center' as const,
                  whiteSpace: 'nowrap' as const,
                }}
              >
                {isEra4 ? (
                  <GlitchBurst
                    burstInterval={60}
                    burstDuration={8}
                    intensity={0.3}
                    color={era.sizeColor}
                    fontSize={36}
                    fontFamily={TYPOGRAPHY.code.fontFamily}
                    fontWeight={TYPOGRAPHY.code.fontWeight}
                  >
                    {era.size}
                  </GlitchBurst>
                ) : (
                  era.size
                )}
              </div>
            )}

            {/* Barrier visualization (individual, before comparison) */}
            {comparisonOpacity < 0.5 && barrierScale > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX - era.barrierWidth / 2,
                  top: barrierZoneY,
                  width: era.barrierWidth,
                  height: 100,
                  backgroundColor: eraIndex === 3 ? barrierFlicker : S09_COLORS.barrierGray,
                  borderRadius: 4,
                  transformOrigin: 'bottom center',
                  transform: `scaleY(${barrierScale})`,
                  boxShadow: isEra4
                    ? '0 0 15px rgba(239,68,68,0.2)'
                    : eraIndex === 2
                    ? `0 0 8px ${COLORS.aiPurple}33`
                    : 'none',
                }}
              />
            )}

            {/* Electron cloud to left of barrier (individual) */}
            {comparisonOpacity < 0.5 && barrierScale > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX - era.barrierWidth / 2 - 30,
                  top: barrierZoneY + 40,
                }}
              >
                <MiniElectronCloud
                  frame={frame}
                  opacity={barrierScale}
                  size={eraIndex === 0 ? 24 : 18}
                />
              </div>
            )}

            {/* Ghost electrons on wrong side (individual) */}
            {comparisonOpacity < 0.5 && ghostOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX + era.barrierWidth / 2 + 8,
                  top: barrierZoneY + 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {Array.from({ length: era.ghostCount }, (_, gi) => (
                  <GhostElectron
                    key={gi}
                    frame={frame}
                    opacity={ghostOpacity + gi * 0.05}
                    index={gi}
                  />
                ))}
              </div>
            )}

            {/* Era 3 warning label */}
            {eraIndex === 2 && frame >= BEATS.ERA_3_WARNING && comparisonOpacity < 0.5 && (
              <div
                style={{
                  position: 'absolute',
                  left: nodeX,
                  top: barrierZoneY + 115,
                  transform: 'translateX(-50%)',
                  opacity: interpolate(
                    frame,
                    [BEATS.ERA_3_WARNING, BEATS.ERA_3_WARNING + 10],
                    [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                  ),
                  ...TYPOGRAPHY.label,
                  fontSize: 20,
                  color: COLORS.insightOrange,
                  textAlign: 'center' as const,
                  whiteSpace: 'nowrap' as const,
                  letterSpacing: 1,
                }}
              >
                TUNNELING INCREASING
              </div>
            )}

            {/* Comparison mode barriers (side by side) */}
            {comparisonOpacity > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: compBarrierX - era.barrierWidth / 2,
                  top: barrierZoneY + 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: comparisonOpacity,
                }}
              >
                {/* Barrier */}
                <div
                  style={{
                    width: Math.max(era.barrierWidth, 2),
                    height: 100,
                    backgroundColor:
                      isEra4 ? barrierFlicker : S09_COLORS.barrierGray,
                    borderRadius: 4,
                    boxShadow: isEra4
                      ? '0 0 15px rgba(239,68,68,0.2)'
                      : 'none',
                  }}
                />
                {/* Year under barrier */}
                <div
                  style={{
                    ...TYPOGRAPHY.label,
                    fontSize: 18,
                    color: S09_COLORS.historyGold,
                    textAlign: 'center' as const,
                  }}
                >
                  {era.year}
                </div>
                {/* Ghost electrons next to barrier */}
                {era.ghostCount > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: -25,
                      top: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    {Array.from({ length: era.ghostCount }, (_, gi) => (
                      <GhostElectron
                        key={gi}
                        frame={frame}
                        opacity={era.ghostOpacity}
                        index={gi}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Comparison arrow label */}
      {arrowOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: timelineLeft,
            right: timelineLeft,
            top: barrierZoneY + 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            opacity: arrowOpacity,
            transform: `translateY(${arrowY}px)`,
          }}
        >
          <div
            style={{
              ...TYPOGRAPHY.label,
              fontSize: 22,
              color: COLORS.insightOrange,
              textAlign: 'center' as const,
              letterSpacing: 1,
            }}
          >
            SHRINKING BARRIERS {'>'} MORE TUNNELING
          </div>
        </div>
      )}

      {/* Era 2 warning flash */}
      {frame >= BEATS.ERA_2_GHOST && frame < BEATS.ERA_2_GHOST + 18 && (
        <div
          style={{
            position: 'absolute',
            left: timelineLeft + timelineWidth * ERAS[1].xPercent + 30,
            top: barrierZoneY + 30,
            opacity: interpolate(
              frame,
              [BEATS.ERA_2_GHOST, BEATS.ERA_2_GHOST + 6, BEATS.ERA_2_GHOST + 18],
              [0, 1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
            ...TYPOGRAPHY.label,
            fontSize: 20,
            color: COLORS.insightOrange,
            fontWeight: 700,
          }}
        >
          !
        </div>
      )}
    </SceneContainer>
  );
};
