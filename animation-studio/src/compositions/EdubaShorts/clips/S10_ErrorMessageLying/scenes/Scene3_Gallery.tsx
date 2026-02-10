import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { BlurText } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, LAYOUT } from '../../../constants';

/**
 * Scene 3: Gallery of Moths
 * Duration: 360 frames (12 seconds)
 *
 * Vertical timeline of 5 computing eras, each with their own "moth."
 * Cosmic rays, floating point, race conditions, memory leaks, AI hallucinations.
 * Ends with "Different moths. Same pattern."
 */

const BEATS = {
  SPINE_DRAW: 0,
  ERA_1_NODE: 30,
  ERA_1_PANEL: 45,
  ERA_1_DIM: 70,
  ERA_2_NODE: 90,
  ERA_2_PANEL: 105,
  ERA_2_DIM: 130,
  ERA_3_NODE: 150,
  ERA_3_PANEL: 165,
  ERA_3_DIM: 190,
  ERA_4_NODE: 210,
  ERA_4_PANEL: 225,
  ERA_4_DIM: 245,
  ERA_5_NODE: 260,
  ERA_5_PANEL: 275,
  ERA_5_HOLD: 310,
  CONCLUSION_IN: 330,
};

const SCROLL_PER_ERA = 180; // px to scroll up per dimmed era

/** Binary display with flipping bit */
const BinaryDisplay: React.FC<{ startFrame: number; flipFrame: number }> = ({
  startFrame,
  flipFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const original = '01001010';
  const flipped = '01011010';
  const hasFlipped = frame >= flipFrame;
  const bits = hasFlipped ? flipped : original;
  const flipBitIndex = 3; // 4th bit (0-indexed)

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {bits.split('').map((bit, i) => {
        const isFlipBit = i === flipBitIndex;
        const bitColor = isFlipBit && hasFlipped
          ? COLORS.errorRed
          : COLORS.codeText;
        const pulseOpacity = isFlipBit && !hasFlipped
          ? 0.5 + 0.5 * Math.sin(relativeFrame * 0.2)
          : 1;

        const bitScale = isFlipBit && hasFlipped
          ? interpolate(
              spring({
                frame: frame - flipFrame,
                fps,
                config: SPRING_CONFIGS.bouncy,
              }),
              [0, 1],
              [1.5, 1]
            )
          : 1;

        return (
          <span
            key={i}
            style={{
              ...TYPOGRAPHY.code,
              fontSize: 32,
              color: bitColor,
              opacity: pulseOpacity,
              transform: `scale(${bitScale})`,
              display: 'inline-block',
            }}
          >
            {bit}
          </span>
        );
      })}
    </div>
  );
};

/** Thread race visualization */
const RaceCondition: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const barWidth = interpolate(relativeFrame, [0, 15], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hasClash = relativeFrame >= 15;
  const clashFlash = hasClash
    ? interpolate(relativeFrame, [15, 20], [0.5, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <div style={{ position: 'relative', height: 70, width: '100%' }}>
      {/* Thread 1 */}
      <div
        style={{
          position: 'absolute',
          top: 5,
          left: 20,
          height: 16,
          width: barWidth,
          backgroundColor: COLORS.techBlue,
          borderRadius: 4,
        }}
      />
      {/* Thread 2 */}
      <div
        style={{
          position: 'absolute',
          top: 35,
          left: 20,
          height: 16,
          width: barWidth,
          backgroundColor: COLORS.aiPurple,
          borderRadius: 4,
        }}
      />
      {/* Lock icon in center */}
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 165,
          fontSize: 28,
          color: hasClash ? COLORS.errorRed : COLORS.insightOrange,
        }}
      >
        {hasClash ? '\u26A0' : '\uD83D\uDD12'}
      </div>
      {/* Clash flash */}
      {clashFlash > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: COLORS.errorRed,
            opacity: clashFlash,
            borderRadius: 8,
          }}
        />
      )}
      {/* Label */}
      {hasClash && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            left: 20,
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: COLORS.errorRed,
            textTransform: 'none' as const,
            letterSpacing: 0,
          }}
        >
          Race Condition
        </span>
      )}
    </div>
  );
};

/** Memory leak fill bar */
const MemoryLeakBar: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const relativeFrame = frame - startFrame;
  if (relativeFrame < 0) return null;

  const fillPercent = interpolate(relativeFrame, [0, 20], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isFull = fillPercent >= 100;
  const glitchShake = isFull ? Math.sin(relativeFrame * 3) * 2 : 0;

  // Gradient color based on fill
  const barColor =
    fillPercent < 40
      ? COLORS.solutionGreen
      : fillPercent < 75
        ? COLORS.insightOrange
        : COLORS.errorRed;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: 300,
          height: 40,
          backgroundColor: COLORS.bgSurfaceAlt,
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${COLORS.panelBorder}`,
          transform: `translateX(${glitchShake}px)`,
        }}
      >
        <div
          style={{
            width: `${fillPercent}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: 6,
            transition: 'none',
          }}
        />
      </div>
      <span
        style={{
          ...TYPOGRAPHY.label,
          fontSize: 24,
          color: COLORS.textMuted,
          textTransform: 'none' as const,
          letterSpacing: 0,
          marginTop: 8,
          display: 'block',
        }}
      >
        Memory Leak -- 6 months to crash
      </span>
    </div>
  );
};

/** A single era panel */
const EraPanel: React.FC<{
  year: string;
  title: string;
  nodeStartFrame: number;
  panelStartFrame: number;
  dimStartFrame: number;
  children: React.ReactNode;
}> = ({ year, title, nodeStartFrame, panelStartFrame, dimStartFrame, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Node entrance
  const nodeProgress = spring({
    frame: frame - nodeStartFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const nodeScale = interpolate(nodeProgress, [0, 1], [0, 1]);
  const nodeOpacity = interpolate(
    frame,
    [nodeStartFrame, nodeStartFrame + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Panel entrance
  const panelOpacity = interpolate(
    frame,
    [panelStartFrame, panelStartFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const panelX = interpolate(
    spring({
      frame: frame - panelStartFrame,
      fps,
      config: SPRING_CONFIGS.snappy,
    }),
    [0, 1],
    [40, 0]
  );

  // Dim
  const dimOpacity = interpolate(
    frame,
    [dimStartFrame, dimStartFrame + 20],
    [1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame < nodeStartFrame) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
        width: '100%',
        opacity: dimOpacity,
        marginBottom: 16,
      }}
    >
      {/* Node circle + year label */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          minWidth: 80,
          opacity: nodeOpacity,
          transform: `scale(${nodeScale})`,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: COLORS.historyGold,
          }}
        />
        <span
          style={{
            ...TYPOGRAPHY.label,
            fontSize: 24,
            color: COLORS.historyGold,
            textTransform: 'none' as const,
            letterSpacing: 0,
          }}
        >
          {year}
        </span>
      </div>

      {/* Panel */}
      <div
        style={{
          flex: 1,
          backgroundColor: COLORS.bgSurfaceAlt,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 8,
          padding: '16px 20px',
          opacity: panelOpacity,
          transform: `translateX(${panelX}px)`,
        }}
      >
        <div
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 36,
            color: COLORS.textPrimary,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export const Scene3_Gallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spine draw animation
  const spineHeight = interpolate(frame, [BEATS.SPINE_DRAW, BEATS.SPINE_DRAW + 30], [0, 1200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Calculate scroll offset: scroll up as eras are dimmed
  const scrollSteps = [
    { dimFrame: BEATS.ERA_1_DIM, amount: SCROLL_PER_ERA },
    { dimFrame: BEATS.ERA_2_DIM, amount: SCROLL_PER_ERA },
    { dimFrame: BEATS.ERA_3_DIM, amount: SCROLL_PER_ERA },
    { dimFrame: BEATS.ERA_4_DIM, amount: SCROLL_PER_ERA },
  ];

  let scrollY = 0;
  for (const step of scrollSteps) {
    scrollY -= interpolate(
      frame,
      [step.dimFrame, step.dimFrame + 20],
      [0, step.amount],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
  }

  // Background color transition (warm to dark during Era 5)
  const bgR = interpolate(frame, [BEATS.ERA_5_NODE, BEATS.ERA_5_PANEL + 35], [20, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgG = interpolate(frame, [BEATS.ERA_5_NODE, BEATS.ERA_5_PANEL + 35], [14, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgB = interpolate(frame, [BEATS.ERA_5_NODE, BEATS.ERA_5_PANEL + 35], [8, 15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Conclusion: all panels fade, text appears
  const conclusionDimOpacity = interpolate(
    frame,
    [BEATS.CONCLUSION_IN, BEATS.CONCLUSION_IN + 15],
    [1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const showConclusion = frame >= BEATS.CONCLUSION_IN;

  // Hallucination stamp
  const stampProgress = spring({
    frame: frame - (BEATS.ERA_5_PANEL + 15),
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const stampScale = interpolate(
    spring({
      frame: frame - (BEATS.ERA_5_PANEL + 15),
      fps,
      config: SPRING_CONFIGS.bouncy,
    }),
    [0, 1],
    [1.5, 1]
  );

  return (
    <SceneContainer
      background={`rgb(${Math.round(bgR)},${Math.round(bgG)},${Math.round(bgB)})`}
      fadeIn
      fadeInDuration={10}
      fadeOut
      fadeOutStart={350}
      fadeOutDuration={10}
    >
      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: LAYOUT.safePadding,
          overflow: 'hidden',
        }}
      >
        {/* Timeline content (scrollable) */}
        <div
          style={{
            position: 'relative',
            transform: `translateY(${scrollY}px)`,
            opacity: showConclusion ? conclusionDimOpacity : 1,
          }}
        >
          {/* Spine line */}
          <div
            style={{
              position: 'absolute',
              left: 38,
              top: 0,
              width: 2,
              height: spineHeight,
              backgroundColor: `rgba(201,162,39,0.4)`,
            }}
          />

          {/* Era 1: Cosmic Rays */}
          <EraPanel
            year="1970s"
            title="Cosmic Ray Bit Flip"
            nodeStartFrame={BEATS.ERA_1_NODE}
            panelStartFrame={BEATS.ERA_1_PANEL}
            dimStartFrame={BEATS.ERA_1_DIM}
          >
            <BinaryDisplay
              startFrame={BEATS.ERA_1_PANEL}
              flipFrame={BEATS.ERA_1_PANEL + 10}
            />
          </EraPanel>

          {/* Era 2: Floating Point */}
          <EraPanel
            year="1985"
            title="Floating Point"
            nodeStartFrame={BEATS.ERA_2_NODE}
            panelStartFrame={BEATS.ERA_2_PANEL}
            dimStartFrame={BEATS.ERA_2_DIM}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span
                style={{
                  ...TYPOGRAPHY.code,
                  fontSize: 32,
                  color: COLORS.techBlue,
                }}
              >
                0.1 + 0.2 =
              </span>
              {frame >= BEATS.ERA_2_PANEL + 10 && (
                <span
                  style={{
                    ...TYPOGRAPHY.code,
                    fontSize: 30,
                    color: COLORS.errorRed,
                    opacity: interpolate(
                      spring({
                        frame: frame - (BEATS.ERA_2_PANEL + 10),
                        fps,
                        config: SPRING_CONFIGS.snappy,
                      }),
                      [0, 1],
                      [0, 1]
                    ),
                    whiteSpace: 'nowrap',
                  }}
                >
                  0.30000000000000004
                </span>
              )}
            </div>
          </EraPanel>

          {/* Era 3: Race Conditions */}
          <EraPanel
            year="1990s"
            title="Race Condition"
            nodeStartFrame={BEATS.ERA_3_NODE}
            panelStartFrame={BEATS.ERA_3_PANEL}
            dimStartFrame={BEATS.ERA_3_DIM}
          >
            <RaceCondition startFrame={BEATS.ERA_3_PANEL} />
          </EraPanel>

          {/* Era 4: Memory Leaks */}
          <EraPanel
            year="2003"
            title="Memory Leak"
            nodeStartFrame={BEATS.ERA_4_NODE}
            panelStartFrame={BEATS.ERA_4_PANEL}
            dimStartFrame={BEATS.ERA_4_DIM}
          >
            <MemoryLeakBar startFrame={BEATS.ERA_4_PANEL} />
          </EraPanel>

          {/* Era 5: AI Hallucinations */}
          <EraPanel
            year="2024"
            title="AI Hallucination"
            nodeStartFrame={BEATS.ERA_5_NODE}
            panelStartFrame={BEATS.ERA_5_PANEL}
            dimStartFrame={BEATS.ERA_5_HOLD + 30}
          >
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 32,
                  color: COLORS.textBody,
                }}
              >
                According to Smith et al. (2019)...
              </span>
              {frame >= BEATS.ERA_5_PANEL + 15 && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    opacity: interpolate(stampProgress, [0, 1], [0, 1]),
                    transform: `scale(${stampScale}) rotate(-3deg)`,
                  }}
                >
                  <span
                    style={{
                      ...TYPOGRAPHY.label,
                      fontSize: 22,
                      color: COLORS.errorRed,
                      border: `2px solid ${COLORS.errorRed}`,
                      borderRadius: 4,
                      padding: '4px 10px',
                      textTransform: 'uppercase' as const,
                      letterSpacing: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    PAPER DOESN'T EXIST
                  </span>
                </div>
              )}
            </div>
          </EraPanel>
        </div>

        {/* Conclusion text */}
        {showConclusion && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: LAYOUT.safePadding,
            }}
          >
            <BlurText
              startFrame={BEATS.CONCLUSION_IN}
              animateBy="words"
              direction="bottom"
              staggerDelay={5}
              blurAmount={10}
              distance={30}
              fontSize={52}
              color={COLORS.insightOrange}
            >
              Different moths. Same pattern.
            </BlurText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
