import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { COLORS, TYPOGRAPHY, SPRING_CONFIGS } from '../constants';

/**
 * SCENE 10: ERRORS ALL THE WAY DOWN (Section 9)
 * Duration: 60 seconds (1800 frames)
 *
 * Timeline of errors through computing history.
 * Return to cooler palette but keep some warmth - a transitional feel.
 *
 * Animation Sequence:
 * | Frames    | Action |
 * |-----------|--------|
 * | 0-60      | Timeline draws across screen |
 * | 60-180    | 1947 marker appears, moth illustration |
 * | 180-400   | Logbook entry text appears |
 * | 400-550   | 1994 marker appears, Pentium chip |
 * | 550-750   | "5 missing entries" → "$475 million" |
 * | 750-1100  | "This is engineering" - pattern emerges |
 * | 1100-1500 | All examples compress into pattern |
 * | 1500-1800 | Transition to electron section |
 */

// Timeline markers
const TIMELINE_DRAW = 0;
const MOTH_APPEAR = 60;
const LOGBOOK_APPEAR = 180;
const PENTIUM_APPEAR = 400;
const COST_APPEAR = 550;
const PATTERN_EMERGE = 750;
const PATTERN_COMPRESS = 1100;
const TRANSITION_START = 1500;

// Scene title
const SceneTitle: React.FC<{ frame: number; fadeOutFrame: number }> = ({ frame, fadeOutFrame }) => {
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 30], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 36,
          color: COLORS.warning,
          letterSpacing: '0.05em',
        }}
      >
        Errors All The Way Down
      </div>
    </div>
  );
};

// Timeline component
const Timeline: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  const adjustedFrame = frame - startFrame;

  const drawProgress = interpolate(adjustedFrame, [0, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const timelineWidth = 1400;
  const drawnWidth = timelineWidth * drawProgress;

  // Year markers
  const years = [
    { year: 1947, x: 100, label: 'First Bug' },
    { year: 1994, x: 700, label: 'Pentium' },
    { year: 2024, x: 1300, label: 'Today' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        left: '50%',
        transform: 'translateX(-50%)',
        width: timelineWidth,
      }}
    >
      {/* Main timeline line */}
      <div
        style={{
          position: 'relative',
          height: 4,
          backgroundColor: COLORS.surfaceAlt,
          borderRadius: 2,
        }}
      >
        {/* Drawn portion */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: drawnWidth,
            height: '100%',
            backgroundColor: COLORS.warning,
            borderRadius: 2,
            boxShadow: `0 0 20px ${COLORS.warning}60`,
          }}
        />
      </div>

      {/* Year markers */}
      {years.map((marker, i) => {
        const markerProgress = interpolate(adjustedFrame, [30 + i * 20, 60 + i * 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={marker.year}
            style={{
              position: 'absolute',
              left: marker.x,
              top: -8,
              transform: 'translateX(-50%)',
              opacity: markerProgress,
            }}
          >
            {/* Marker dot */}
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: COLORS.warning,
                margin: '0 auto',
                boxShadow: `0 0 10px ${COLORS.warning}80`,
              }}
            />
            {/* Year label */}
            <div
              style={{
                marginTop: 12,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 16,
                color: COLORS.text,
                textAlign: 'center',
              }}
            >
              {marker.year}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Moth illustration (stylized)
const MothIllustration: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;
  const scale = interpolate(progress, [0, 1], [0.5, 1]);

  // Wing flutter animation
  const wingAngle = Math.sin(adjustedFrame * 0.15) * 10;

  return (
    <div
      style={{
        position: 'absolute',
        top: '38%',
        left: '25%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {/* Moth SVG */}
      <svg width="200" height="160" viewBox="0 0 200 160">
        {/* Body */}
        <ellipse cx="100" cy="80" rx="12" ry="35" fill={COLORS.warning} opacity="0.9" />

        {/* Head */}
        <circle cx="100" cy="40" r="10" fill={COLORS.warning} opacity="0.9" />

        {/* Antennae */}
        <path
          d="M 95 35 Q 85 15 75 20"
          stroke={COLORS.warning}
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 105 35 Q 115 15 125 20"
          stroke={COLORS.warning}
          strokeWidth="2"
          fill="none"
        />

        {/* Left wing */}
        <ellipse
          cx="55"
          cy="75"
          rx="45"
          ry="30"
          fill={COLORS.warmAccent}
          opacity="0.7"
          transform={`rotate(${-20 + wingAngle} 55 75)`}
        />
        <ellipse
          cx="55"
          cy="75"
          rx="35"
          ry="22"
          fill={COLORS.warning}
          opacity="0.5"
          transform={`rotate(${-20 + wingAngle} 55 75)`}
        />

        {/* Right wing */}
        <ellipse
          cx="145"
          cy="75"
          rx="45"
          ry="30"
          fill={COLORS.warmAccent}
          opacity="0.7"
          transform={`rotate(${20 - wingAngle} 145 75)`}
        />
        <ellipse
          cx="145"
          cy="75"
          rx="35"
          ry="22"
          fill={COLORS.warning}
          opacity="0.5"
          transform={`rotate(${20 - wingAngle} 145 75)`}
        />

        {/* Wing patterns */}
        <circle cx="45" cy="70" r="8" fill={COLORS.background} opacity="0.6" />
        <circle cx="155" cy="70" r="8" fill={COLORS.background} opacity="0.6" />
      </svg>

      {/* Label */}
      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 24,
          color: COLORS.warning,
        }}
      >
        The First Bug
      </div>
    </div>
  );
};

// Logbook entry
const LogbookEntry: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  // Typewriter effect for the quote
  const fullText = '"First actual case of bug being found."';
  const charsToShow = Math.min(
    Math.floor(interpolate(adjustedFrame, [30, 120], [0, fullText.length], { extrapolateRight: 'clamp' })),
    fullText.length
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '55%',
        left: '25%',
        transform: 'translate(-50%, -50%)',
        opacity,
        maxWidth: 350,
      }}
    >
      {/* Logbook paper effect */}
      <div
        style={{
          backgroundColor: `${COLORS.warmText}F0`,
          padding: '24px 32px',
          borderRadius: 4,
          boxShadow: `0 4px 20px ${COLORS.background}80`,
          transform: 'rotate(-2deg)',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.code.fontFamily,
            fontSize: 12,
            color: COLORS.textDim,
            marginBottom: 12,
            borderBottom: `1px solid ${COLORS.textDim}`,
            paddingBottom: 8,
          }}
        >
          Harvard Mark II — Sept. 9, 1947
        </div>

        {/* Quote */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.quote.fontFamily,
            fontStyle: 'italic',
            fontSize: 18,
            color: COLORS.background,
            lineHeight: 1.5,
          }}
        >
          {fullText.slice(0, charsToShow)}
          {charsToShow < fullText.length && (
            <span style={{ opacity: Math.sin(adjustedFrame * 0.3) > 0 ? 1 : 0 }}>|</span>
          )}
        </div>

        {/* Attribution */}
        <div
          style={{
            marginTop: 16,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            fontSize: 12,
            color: COLORS.textMuted,
            textAlign: 'right',
          }}
        >
          — Grace Hopper's team
        </div>
      </div>
    </div>
  );
};

// Pentium chip illustration
const PentiumChip: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;
  const scale = interpolate(progress, [0, 1], [0.8, 1]);

  // Pulsing error effect
  const errorPulse = 0.5 + Math.sin(adjustedFrame * 0.1) * 0.3;

  return (
    <div
      style={{
        position: 'absolute',
        top: '38%',
        left: '75%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {/* CPU chip */}
      <div
        style={{
          width: 160,
          height: 160,
          backgroundColor: COLORS.surface,
          border: `3px solid ${COLORS.danger}`,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: `0 0 30px ${COLORS.danger}${Math.floor(errorPulse * 255).toString(16).padStart(2, '0')}`,
        }}
      >
        {/* Pins on sides */}
        {Array.from({ length: 8 }, (_, i) => (
          <React.Fragment key={i}>
            {/* Left pins */}
            <div
              style={{
                position: 'absolute',
                left: -10,
                top: 15 + i * 18,
                width: 10,
                height: 4,
                backgroundColor: COLORS.textMuted,
              }}
            />
            {/* Right pins */}
            <div
              style={{
                position: 'absolute',
                right: -10,
                top: 15 + i * 18,
                width: 10,
                height: 4,
                backgroundColor: COLORS.textMuted,
              }}
            />
            {/* Top pins */}
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: 15 + i * 18,
                width: 4,
                height: 10,
                backgroundColor: COLORS.textMuted,
              }}
            />
            {/* Bottom pins */}
            <div
              style={{
                position: 'absolute',
                bottom: -10,
                left: 15 + i * 18,
                width: 4,
                height: 10,
                backgroundColor: COLORS.textMuted,
              }}
            />
          </React.Fragment>
        ))}

        {/* Die */}
        <div
          style={{
            width: 80,
            height: 80,
            backgroundColor: COLORS.surfaceAlt,
            border: `2px solid ${COLORS.primary}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 14,
              color: COLORS.text,
            }}
          >
            FDIV
          </span>
        </div>

        {/* Error X overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: errorPulse,
          }}
        >
          <span
            style={{
              fontSize: 80,
              color: COLORS.danger,
              fontWeight: 'bold',
            }}
          >
            ✕
          </span>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          marginTop: 20,
          textAlign: 'center',
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 24,
          color: COLORS.danger,
        }}
      >
        Pentium FDIV Bug
      </div>
    </div>
  );
};

// Cost reveal
const CostReveal: React.FC<{ frame: number; startFrame: number; fadeOutFrame: number }> = ({
  frame,
  startFrame,
  fadeOutFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const fadeOut = frame >= fadeOutFrame
    ? interpolate(frame, [fadeOutFrame, fadeOutFrame + 60], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const opacity = interpolate(progress, [0, 1], [0, 1]) * fadeOut;

  // Counter animation
  const countProgress = interpolate(adjustedFrame, [30, 90], [0, 1], { extrapolateRight: 'clamp' });
  const displayCost = Math.floor(countProgress * 475);

  return (
    <div
      style={{
        position: 'absolute',
        top: '58%',
        left: '75%',
        transform: 'translate(-50%, -50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 16,
          color: COLORS.textMuted,
          marginBottom: 8,
        }}
      >
        5 missing lookup table entries
      </div>

      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.black,
          fontSize: 56,
          color: COLORS.danger,
        }}
      >
        ${displayCost}M
      </div>

      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 18,
          color: COLORS.text,
          marginTop: 8,
        }}
      >
        recall and replacement cost
      </div>
    </div>
  );
};

// Pattern visualization
const PatternVisualization: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  const patternSteps = [
    { label: 'Problem', icon: '⚠️', color: COLORS.danger, example: 'The moth / FDIV bug' },
    { label: 'Discovery', icon: '🔍', color: COLORS.warning, example: 'Found in testing' },
    { label: 'Solution', icon: '🔧', color: COLORS.primary, example: 'Debug / Patch' },
    { label: 'Architecture', icon: '🏗️', color: COLORS.accent, example: 'Standards emerge' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 32,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 50,
        }}
      >
        This is engineering.
      </div>

      {/* Pattern flow */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {patternSteps.map((step, i) => {
          const stepProgress = interpolate(adjustedFrame, [60 + i * 40, 90 + i * 40], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <React.Fragment key={step.label}>
              {/* Step box */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  opacity: stepProgress,
                  transform: `translateY(${interpolate(stepProgress, [0, 1], [20, 0])}px)`,
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: `${step.color}20`,
                    border: `2px solid ${step.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                  }}
                >
                  {step.icon}
                </div>

                {/* Label */}
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontWeight: TYPOGRAPHY.display.weights.bold,
                    fontSize: 18,
                    color: step.color,
                  }}
                >
                  {step.label}
                </div>

                {/* Example */}
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 12,
                    color: COLORS.textMuted,
                    textAlign: 'center',
                    maxWidth: 100,
                  }}
                >
                  {step.example}
                </div>
              </div>

              {/* Arrow */}
              {i < patternSteps.length - 1 && (
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 24,
                    color: COLORS.textDim,
                    opacity: interpolate(adjustedFrame, [80 + i * 40, 100 + i * 40], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Subtext */}
      <div
        style={{
          marginTop: 50,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 20,
          color: COLORS.textMuted,
          textAlign: 'center',
          opacity: interpolate(adjustedFrame, [200, 240], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        The same pattern, repeated at every layer.
      </div>
    </div>
  );
};

// Transition to cosmic section
const CosmicTransition: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const { fps } = useVideoConfig();
  const adjustedFrame = frame - startFrame;
  if (adjustedFrame < 0) return null;

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.slow,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontSize: 24,
          color: COLORS.textMuted,
          marginBottom: 20,
        }}
      >
        But what if the problem
      </div>
      <div
        style={{
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: TYPOGRAPHY.display.weights.bold,
          fontSize: 42,
          color: COLORS.cosmicPrimary,
        }}
      >
        isn't a bug at all?
      </div>
    </div>
  );
};

// Background gradient transition
const BackgroundTransition: React.FC<{ frame: number }> = ({ frame }) => {
  // Transition from warm tones to cooler, then to cosmic at end
  const warmFade = interpolate(frame, [0, 120], [0.15, 0], {
    extrapolateRight: 'clamp',
  });

  const cosmicFade = interpolate(frame, [TRANSITION_START, 1800], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Warm overlay from Loom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.warmAccent,
          opacity: warmFade,
          pointerEvents: 'none',
        }}
      />
      {/* Cosmic overlay for transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.cosmicPrimary,
          opacity: cosmicFade,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export const ErrorsTimeline: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which sections to show
  const showTimeline = frame < TRANSITION_START;
  const showMoth = frame >= MOTH_APPEAR && frame < PATTERN_EMERGE;
  const showLogbook = frame >= LOGBOOK_APPEAR && frame < PATTERN_EMERGE;
  const showPentium = frame >= PENTIUM_APPEAR && frame < PATTERN_EMERGE;
  const showCost = frame >= COST_APPEAR && frame < PATTERN_EMERGE;
  const showPattern = frame >= PATTERN_EMERGE && frame < TRANSITION_START;
  const showTransition = frame >= TRANSITION_START;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Background transitions */}
      <BackgroundTransition frame={frame} />

      {/* Scene title */}
      <SceneTitle frame={frame} fadeOutFrame={PATTERN_EMERGE} />

      {/* Timeline */}
      {showTimeline && <Timeline frame={frame} startFrame={TIMELINE_DRAW} />}

      {/* 1947: The Moth */}
      {showMoth && (
        <MothIllustration frame={frame} startFrame={MOTH_APPEAR} fadeOutFrame={PATTERN_EMERGE - 60} />
      )}

      {/* Logbook entry */}
      {showLogbook && (
        <LogbookEntry frame={frame} startFrame={LOGBOOK_APPEAR} fadeOutFrame={PATTERN_EMERGE - 60} />
      )}

      {/* 1994: Pentium */}
      {showPentium && (
        <PentiumChip frame={frame} startFrame={PENTIUM_APPEAR} fadeOutFrame={PATTERN_EMERGE - 60} />
      )}

      {/* Cost reveal */}
      {showCost && (
        <CostReveal frame={frame} startFrame={COST_APPEAR} fadeOutFrame={PATTERN_EMERGE - 60} />
      )}

      {/* Pattern visualization */}
      {showPattern && (
        <PatternVisualization frame={frame} startFrame={PATTERN_EMERGE} />
      )}

      {/* Cosmic transition */}
      {showTransition && (
        <CosmicTransition frame={frame} startFrame={TRANSITION_START} />
      )}
    </AbsoluteFill>
  );
};
