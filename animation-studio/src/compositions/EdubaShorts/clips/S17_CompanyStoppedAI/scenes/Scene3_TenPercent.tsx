import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer } from '../../../../../components/core';
import { CountUpWithLabel } from '../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../constants';

// ── Frame markers (all relative to scene start) ──
const BEATS = {
  SCENE_IN: 0,
  STAT_COUNT_UP: 8,
  CONTEXT_LABEL: 28,
  STICK_FIGURES_IN: 45,
  WALK_AWAY: 75,
  HOLD_STARK: 90,
  FIGURES_FADE: 120,
  OLD_WAY_TEXT: 125,
  TRANSITION_FADE: 150,
  ALTERNATIVE_TITLE: 160,
  WORKFLOW_IN: 185,
  WORKFLOW_STEP_1: 185,
  WORKFLOW_STEP_2: 203,
  WORKFLOW_STEP_3: 221,
  WORKFLOW_STEP_4: 239,
  ALL_STEPS_VISIBLE: 260,
  REACTION_TEXT: 265,
  HOLD: 285,
  FADE_OUT: 290,
};

// ── Stick Figure SVG Component ──
const StickFigure: React.FC<{
  active: boolean;
  frame: number;
  fps: number;
  walkAwayFrame: number;
  index: number;
}> = ({ active, frame, fps, walkAwayFrame, index }) => {
  const color = active ? COLORS.solutionGreen : COLORS.textDim;

  // Walk away animation for inactive figures
  let rotate = 0;
  let translateY = 0;
  let opacity = 1;

  if (!active && frame >= walkAwayFrame) {
    const walkProgress = spring({
      frame: frame - walkAwayFrame,
      fps,
      config: SPRING_CONFIGS.gentle,
    });
    rotate = interpolate(walkProgress, [0, 1], [0, 15]);
    translateY = interpolate(walkProgress, [0, 1], [0, 20]);
    opacity = interpolate(walkProgress, [0, 1], [1, 0.15]);
  }

  // Active figure glow
  const glowOpacity = active ? 0.3 : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
      }}
    >
      <svg width={50} height={80} viewBox="0 0 50 80">
        {/* Glow behind active figure */}
        {active && (
          <circle
            cx={25}
            cy={40}
            r={30}
            fill={COLORS.solutionGreen}
            opacity={glowOpacity}
          />
        )}
        {/* Head */}
        <circle cx={25} cy={14} r={10} fill="none" stroke={color} strokeWidth={3} />
        {/* Body */}
        <line x1={25} y1={24} x2={25} y2={52} stroke={color} strokeWidth={3} strokeLinecap="round" />
        {/* Arms */}
        <line x1={25} y1={32} x2={10} y2={44} stroke={color} strokeWidth={3} strokeLinecap="round" />
        <line x1={25} y1={32} x2={40} y2={44} stroke={color} strokeWidth={3} strokeLinecap="round" />
        {/* Left leg */}
        <line x1={25} y1={52} x2={12} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" />
        {/* Right leg */}
        <line x1={25} y1={52} x2={38} y2={72} stroke={color} strokeWidth={3} strokeLinecap="round" />
      </svg>
    </div>
  );
};

// ── Stick Figure Row ──
const StickFigureRow: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const relFrame = frame - BEATS.STICK_FIGURES_IN;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const scale = interpolate(enterProgress, [0, 1], [0, 1]);
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);

  // Fade out the inactive figures + stat after the hold
  const fadeProgress = interpolate(
    frame,
    [BEATS.FIGURES_FADE, BEATS.FIGURES_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        opacity: opacity * fadeProgress,
        transform: `scale(${scale})`,
        flexWrap: 'wrap',
        maxWidth: 700,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <StickFigure
          key={i}
          active={i === 0}
          frame={frame}
          fps={fps}
          walkAwayFrame={BEATS.WALK_AWAY}
          index={i}
        />
      ))}
    </div>
  );
};

// ── Workflow Step ──
const WorkflowStep: React.FC<{
  label: string;
  highlight: boolean;
  frame: number;
  fps: number;
  startFrame: number;
  isLast: boolean;
}> = ({ label, highlight, frame, fps, startFrame, isLast }) => {
  const relFrame = frame - startFrame;
  if (relFrame < 0) return null;

  const enterProgress = spring({
    frame: relFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const opacity = interpolate(enterProgress, [0, 1], [0, 1]);
  const y = interpolate(enterProgress, [0, 1], [20, 0]);

  // Arrow between steps
  const arrowStartFrame = startFrame + 10;
  const arrowProgress = frame >= arrowStartFrame
    ? spring({
        frame: frame - arrowStartFrame,
        fps,
        config: SPRING_CONFIGS.gentle,
      })
    : 0;

  return (
    <>
      <div
        style={{
          width: 700,
          height: 70,
          backgroundColor: COLORS.bgSurface,
          border: highlight
            ? `1.5px solid ${COLORS.solutionGreen}`
            : `1px solid ${COLORS.panelBorder}`,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: `translateY(${y}px)`,
          position: 'relative',
        }}
      >
        {/* Accent bar for highlighted steps */}
        {highlight && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 4,
              backgroundColor: COLORS.solutionGreen,
              borderRadius: 2,
            }}
          />
        )}
        <span
          style={{
            ...TYPOGRAPHY.body,
            fontSize: 34,
            color: highlight ? COLORS.solutionGreen : COLORS.textBody,
          }}
        >
          {label}
        </span>
      </div>

      {/* Down arrow connector */}
      {!isLast && (
        <div
          style={{
            opacity: arrowProgress,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <svg width={20} height={24} viewBox="0 0 20 24">
            <line
              x1={10}
              y1={0}
              x2={10}
              y2={18}
              stroke={COLORS.textDim}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <polyline
              points="5,14 10,20 15,14"
              fill="none"
              stroke={COLORS.textDim}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </>
  );
};

// ── Main Scene ──
export const Scene3_TenPercent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stat pulse
  const statPulse =
    frame >= BEATS.HOLD_STARK
      ? 0.85 + 0.15 * Math.sin((frame - BEATS.HOLD_STARK) * 0.157)
      : 1;

  // Fade out the stat + context label
  const statFadeOut = interpolate(
    frame,
    [BEATS.FIGURES_FADE, BEATS.FIGURES_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Old way text
  const oldWayProgress = spring({
    frame: Math.max(0, frame - BEATS.OLD_WAY_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const oldWayOpacity = interpolate(oldWayProgress, [0, 1], [0, 1]);
  const oldWayFade = interpolate(
    frame,
    [BEATS.TRANSITION_FADE, BEATS.TRANSITION_FADE + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Context label
  const contextProgress = spring({
    frame: Math.max(0, frame - BEATS.CONTEXT_LABEL),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const contextOpacity = interpolate(contextProgress, [0, 1], [0, 1]);

  // Alternative title
  const altTitleProgress = spring({
    frame: Math.max(0, frame - BEATS.ALTERNATIVE_TITLE),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const altTitleOpacity = interpolate(altTitleProgress, [0, 1], [0, 1]);
  const altTitleY = interpolate(altTitleProgress, [0, 1], [20, 0]);

  // Reaction text
  const reactionProgress = spring({
    frame: Math.max(0, frame - BEATS.REACTION_TEXT),
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const reactionOpacity = interpolate(reactionProgress, [0, 1], [0, 1]);

  // Phases
  const showStatPhase = frame < BEATS.TRANSITION_FADE + 20;
  const showWorkflowPhase = frame >= BEATS.ALTERNATIVE_TITLE;

  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={290}
      fadeOutDuration={10}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          width: '100%',
        }}
      >
        {/* Stat Phase */}
        {showStatPhase && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              opacity: statFadeOut,
            }}
          >
            {/* Big stat */}
            <div style={{ opacity: statPulse }}>
              <CountUpWithLabel
                to={10}
                suffix="%"
                label="ADOPTION RATE"
                labelPosition="bottom"
                startFrame={BEATS.STAT_COUNT_UP}
                fontSize={84}
                color={COLORS.errorRed}
                labelColor={COLORS.textMuted}
                duration={30}
              />
            </div>

            {/* Context label */}
            <div style={{ opacity: contextOpacity }}>
              <span
                style={{
                  ...TYPOGRAPHY.body,
                  fontSize: 40,
                  color: COLORS.textMuted,
                }}
              >
                for tool-first AI deployments
              </span>
            </div>

            {/* Stick figures */}
            <div style={{ marginTop: 16 }}>
              <StickFigureRow frame={frame} fps={fps} />
            </div>
          </div>
        )}

        {/* Old way text (between phases) */}
        {frame >= BEATS.OLD_WAY_TEXT && frame < BEATS.TRANSITION_FADE + 20 && (
          <div style={{ opacity: oldWayOpacity * oldWayFade, marginTop: 8 }}>
            <span
              style={{
                ...TYPOGRAPHY.body,
                fontSize: 40,
                color: COLORS.textMuted,
              }}
            >
              The old way was predictable.
            </span>
          </div>
        )}

        {/* Workflow Phase */}
        {showWorkflowPhase && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              width: '100%',
            }}
          >
            {/* Alternative title */}
            <div
              style={{
                opacity: altTitleOpacity,
                transform: `translateY(${altTitleY}px)`,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  ...TYPOGRAPHY.title,
                  fontSize: 52,
                  color: COLORS.solutionGreen,
                }}
              >
                The Alternative
              </span>
            </div>

            {/* Workflow steps */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <WorkflowStep
                label="1. Identify the problem"
                highlight={false}
                frame={frame}
                fps={fps}
                startFrame={BEATS.WORKFLOW_STEP_1}
                isLast={false}
              />
              <WorkflowStep
                label="2. Map where ambiguity lives"
                highlight={true}
                frame={frame}
                fps={fps}
                startFrame={BEATS.WORKFLOW_STEP_2}
                isLast={false}
              />
              <WorkflowStep
                label="3. Introduce AI for that part"
                highlight={true}
                frame={frame}
                fps={fps}
                startFrame={BEATS.WORKFLOW_STEP_3}
                isLast={false}
              />
              <WorkflowStep
                label="4. Integrate into existing workflow"
                highlight={true}
                frame={frame}
                fps={fps}
                startFrame={BEATS.WORKFLOW_STEP_4}
                isLast={true}
              />
            </div>

            {/* Reaction text */}
            {frame >= BEATS.REACTION_TEXT && (
              <div style={{ opacity: reactionOpacity, marginTop: 12 }}>
                <span
                  style={{
                    ...TYPOGRAPHY.body,
                    fontSize: 40,
                    color: COLORS.solutionGreen,
                  }}
                >
                  It clicks. It integrates.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
