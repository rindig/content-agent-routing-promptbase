import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText, GlitchBurst } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

const BEATS = {
  TIMELINE_LINE: 0,
  NODES_IN: 20,
  GLOW_TRACE: 60,
  NODE_PULSE: 100,
  BRACKET_IN: 140,
  COMPRESS: 180,
  DIM_OUT: 240,
};

interface TimelineNodeData {
  label: string;
  year: string;
  color: string;
  descriptor: string;
}

const TIMELINE_NODES: TimelineNodeData[] = [
  { label: 'Autocomplete', year: '1993', color: COLORS.historyGold, descriptor: 'Pattern' },
  { label: 'Autofill', year: '1997', color: COLORS.historyGold, descriptor: 'Pattern' },
  { label: 'Flash Fill', year: '2013', color: COLORS.techBlue, descriptor: 'Pattern' },
  { label: 'Smart Compose', year: '2018', color: COLORS.techBlue, descriptor: 'Pattern' },
  { label: 'ChatGPT', year: '2022', color: COLORS.aiPurple, descriptor: 'Pattern' },
];

const LINE_LEFT = 54;
const LINE_RIGHT = 1026;
const LINE_Y = 860;
const NODE_SPACING = (LINE_RIGHT - LINE_LEFT) / (TIMELINE_NODES.length - 1);

export const Scene4_Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline line entrance
  const lineProgress = spring({
    frame: frame - BEATS.TIMELINE_LINE,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const lineWidth = interpolate(lineProgress, [0, 1], [0, LINE_RIGHT - LINE_LEFT]);

  // Glow trace: animated line from left to right
  const traceProgress = interpolate(
    frame,
    [BEATS.GLOW_TRACE, BEATS.GLOW_TRACE + 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Compress animation
  const compressProgress = spring({
    frame: frame - BEATS.COMPRESS,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const compressScale = interpolate(compressProgress, [0, 1], [1, 0.7]);
  const compressY = interpolate(compressProgress, [0, 1], [0, -100]);

  // Dim out
  const dimOpacity = interpolate(
    frame,
    [BEATS.DIM_OUT, BEATS.DIM_OUT + 30],
    [1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Bracket entrance
  const bracketProgress = spring({
    frame: frame - BEATS.BRACKET_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <SceneContainer background="dark">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Timeline container with compression */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 500,
            transform: `scaleX(${compressScale}) translateY(${compressY}px)`,
            transformOrigin: 'center center',
            opacity: dimOpacity,
          }}
        >
          {/* Horizontal timeline line */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          >
            {/* Base line */}
            <line
              x1={LINE_LEFT}
              y1={LINE_Y - 660}
              x2={LINE_LEFT + lineWidth}
              y2={LINE_Y - 660}
              stroke={COLORS.textDim}
              strokeWidth={2}
            />

            {/* Glow trace line */}
            {frame >= BEATS.GLOW_TRACE && (
              <line
                x1={LINE_LEFT}
                y1={LINE_Y - 660}
                x2={LINE_LEFT + traceProgress * (LINE_RIGHT - LINE_LEFT)}
                y2={LINE_Y - 660}
                stroke="url(#traceGradient)"
                strokeWidth={3}
              />
            )}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={COLORS.historyGold} />
                <stop offset="50%" stopColor={COLORS.techBlue} />
                <stop offset="100%" stopColor={COLORS.aiPurple} />
              </linearGradient>
            </defs>

            {/* Bracket under timeline */}
            {frame >= BEATS.BRACKET_IN && (
              <path
                d={`M ${LINE_LEFT + 20} ${LINE_Y - 620}
                    Q ${LINE_LEFT + 20} ${LINE_Y - 595} ${(LINE_LEFT + LINE_RIGHT) / 2} ${LINE_Y - 590}
                    Q ${LINE_RIGHT - 20} ${LINE_Y - 595} ${LINE_RIGHT - 20} ${LINE_Y - 620}`}
                fill="none"
                stroke={COLORS.insightOrange}
                strokeWidth={2.5}
                opacity={interpolate(bracketProgress, [0, 1], [0, 0.8])}
                strokeDasharray={600}
                strokeDashoffset={interpolate(bracketProgress, [0, 1], [600, 0])}
              />
            )}
          </svg>

          {/* Timeline nodes */}
          {TIMELINE_NODES.map((node, i) => {
            const nodeX = LINE_LEFT + i * NODE_SPACING;
            const nodeDelay = i * 8;
            const nodeProgress = spring({
              frame: frame - BEATS.NODES_IN - nodeDelay,
              fps,
              config: SPRING_CONFIGS.bouncy,
            });
            const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);
            const nodeOpacity = interpolate(
              frame,
              [BEATS.NODES_IN + nodeDelay, BEATS.NODES_IN + nodeDelay + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Node pulse animation (sequential)
            const pulseStart = BEATS.NODE_PULSE + i * 6;
            const pulseProgress = spring({
              frame: frame - pulseStart,
              fps,
              config: SPRING_CONFIGS.snappy,
            });
            const pulseScale = frame >= pulseStart
              ? interpolate(
                  pulseProgress,
                  [0, 0.5, 1],
                  [1, 1.3, 1],
                )
              : 1;

            // Descriptor appears after pulse
            const descriptorOpacity = interpolate(
              frame,
              [BEATS.NODE_PULSE + i * 6, BEATS.NODE_PULSE + i * 6 + 10],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            // Alternate labels above/below
            const isAbove = i % 2 === 0;

            return (
              <div
                key={node.year}
                style={{
                  position: 'absolute',
                  left: nodeX - 60,
                  top: LINE_Y - 660 - 12,
                  width: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  opacity: nodeOpacity,
                  transform: `scale(${nodeScale * pulseScale})`,
                }}
              >
                {/* Label above node (for even indices) */}
                {isAbove && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 36,
                      textAlign: 'center',
                      width: 140,
                      left: -10,
                    }}
                  >
                    <div
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 22,
                        color: node.color,
                        textTransform: 'none',
                        letterSpacing: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                )}

                {/* Node dot */}
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: node.color,
                    boxShadow: `0 0 8px ${node.color}60`,
                    zIndex: 2,
                  }}
                />

                {/* Label below node (for odd indices) */}
                {!isAbove && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 28,
                      textAlign: 'center',
                      width: 140,
                      left: -10,
                    }}
                  >
                    <div
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 22,
                        color: node.color,
                        textTransform: 'none',
                        letterSpacing: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {node.label}
                    </div>
                  </div>
                )}

                {/* Year */}
                <div
                  style={{
                    position: 'absolute',
                    top: isAbove ? 28 : -30,
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 20,
                      color: node.color,
                      fontWeight: 600,
                    }}
                  >
                    {node.year}
                  </span>
                </div>

                {/* Descriptor: "Pattern" */}
                <div
                  style={{
                    position: 'absolute',
                    top: isAbove ? 52 : -54,
                    textAlign: 'center',
                    opacity: descriptorOpacity,
                    width: 120,
                  }}
                >
                  {i === 4 ? (
                    <GlitchBurst
                      startFrame={BEATS.NODE_PULSE + i * 6}
                      burstInterval={90}
                      burstDuration={10}
                      fontSize={22}
                      fontWeight={500}
                      color={COLORS.textMuted}
                      intensity={0.4}
                    >
                      {node.descriptor}
                    </GlitchBurst>
                  ) : (
                    <span
                      style={{
                        ...TYPOGRAPHY.label,
                        fontSize: 22,
                        color: COLORS.textMuted,
                        textTransform: 'none',
                        letterSpacing: 0,
                      }}
                    >
                      {node.descriptor}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bracket text: "Same idea, 30 years apart" */}
        {frame >= BEATS.BRACKET_IN && (
          <div
            style={{
              textAlign: 'center',
              marginTop: frame >= BEATS.COMPRESS ? -40 : 0,
              transform: `translateY(${interpolate(compressProgress, [0, 1], [0, -80])}px)`,
            }}
          >
            <BlurText
              startFrame={0}
              animateBy="words"
              staggerDelay={3}
              fontSize={48}
              fontWeight={600}
              color={COLORS.insightOrange}
              direction="bottom"
            >
              Same idea, 30 years apart
            </BlurText>
          </div>
        )}

        {/* "We just didn't call it AI" subtitle */}
        {frame >= BEATS.COMPRESS && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            {(() => {
              const subtitleProgress = spring({
                frame: frame - BEATS.COMPRESS - 10,
                fps,
                config: SPRING_CONFIGS.gentle,
              });
              return (
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 44,
                    color: COLORS.textBody,
                    opacity: interpolate(subtitleProgress, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(subtitleProgress, [0, 1], [15, 0])}px)`,
                    display: 'inline-block',
                  }}
                >
                  We just didn't call it AI
                </span>
              );
            })()}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
