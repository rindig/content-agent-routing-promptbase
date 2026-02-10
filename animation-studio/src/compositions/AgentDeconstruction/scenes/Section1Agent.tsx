import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { ExplodedLayers } from '../components/ExplodedLayers';
import { AgentLoop, FunctionVsProcess } from '../components/AgentLoop';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * SECTION 1: What We See vs What Is Happening [1:15 - 3:30]
 * Duration: 4050 frames (135 seconds)
 *
 * RESTRUCTURED Visual journey:
 * 1. [0-600] ExplodedLayers continue - NO "Inside an AI Agent" title yet
 * 2. [600-1350] THE WORD "AGENT" - What it implies (autonomy, decision-making)
 * 3. [1350-2250] THE REALITY - Function call vs process analogy
 * 4. [2250-3300] THE AGENT LOOP - Now properly contextualized
 * 5. [3300-4050] Hold with annotation and legend
 *
 * Key message: "Language is running ahead of engineering"
 * The "agentic" behavior emerges from the orchestration code, not the AI.
 */
export const Section1Agent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers
  const LAYERS_IN = 0;
  const LAYERS_SEPARATING = seconds(5);
  const LAYERS_FADE = seconds(18);

  const AGENT_WORD_IN = seconds(20);
  const IMPLICATIONS_IN = seconds(25);
  const REALITY_TEXT = seconds(35);
  const AGENT_WORD_OUT = seconds(43);

  const FUNCTION_IN = seconds(45);
  const FUNCTION_OUT = seconds(73);

  const LOOP_IN = seconds(75);
  const LOOP_ANIMATE = seconds(80);
  const ANNOTATION_IN = seconds(105);
  const LEGEND_IN = seconds(115);

  // Phase calculations
  const isLayersPhase = frame < AGENT_WORD_IN;
  const isAgentWordPhase = frame >= AGENT_WORD_IN && frame < FUNCTION_IN;
  const isFunctionPhase = frame >= FUNCTION_IN && frame < LOOP_IN;
  const isLoopPhase = frame >= LOOP_IN;

  // ExplodedLayers animation
  const explodeAmount = interpolate(
    frame,
    [LAYERS_IN, LAYERS_SEPARATING, LAYERS_SEPARATING + seconds(10)],
    [0, 0, 0.9],
    { extrapolateRight: 'clamp' }
  );

  const showPercentages = frame >= seconds(8);

  // Layers fade out
  const layersOpacity = interpolate(
    frame,
    [LAYERS_FADE, AGENT_WORD_IN],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Agent word phase animations
  const agentWordProgress = spring({
    frame: frame - AGENT_WORD_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const agentWordOpacity = interpolate(
    frame,
    [AGENT_WORD_IN, AGENT_WORD_IN + 30, AGENT_WORD_OUT, FUNCTION_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Function phase
  const functionOpacity = interpolate(
    frame,
    [FUNCTION_IN, FUNCTION_IN + 30, FUNCTION_OUT, LOOP_IN],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Loop phase
  const loopOpacity = interpolate(
    frame,
    [LOOP_IN, LOOP_IN + seconds(2)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const loopScale = spring({
    frame: frame - LOOP_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Calculate which step to highlight
  const activeStep = (() => {
    if (frame < LOOP_ANIMATE) return -1;
    const stepFrame = frame - LOOP_ANIMATE;
    const framesPerStep = seconds(3);
    const step = Math.floor(stepFrame / framesPerStep);
    if (step > 4) return -1;
    return step;
  })();

  const showAnnotation = frame >= ANNOTATION_IN;

  // Agent implications data
  const IMPLICATIONS = [
    { label: 'Autonomy', angle: -60, delay: 0 },
    { label: 'Decision-Making', angle: 0, delay: 8 },
    { label: 'Acts Independently', angle: 60, delay: 16 },
  ];

  // Animated icon for agent concept
  const AgentSilhouette: React.FC<{ opacity: number }> = ({ opacity }) => {
    const pulse = Math.sin(frame * 0.08) * 0.1 + 0.9;
    const glowPulse = Math.sin(frame * 0.05) * 0.3 + 0.7;
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity }}>
        {/* Outer glow ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth="2"
          opacity={glowPulse * 0.3}
          strokeDasharray="8,4"
          strokeDashoffset={frame * 0.5}
        />
        {/* Head */}
        <circle cx="60" cy="35" r="20" fill={COLORS.accent} opacity={pulse * 0.8} />
        {/* Body */}
        <path
          d="M35 65 Q35 55 60 55 Q85 55 85 65 L85 95 Q85 105 60 105 Q35 105 35 95 Z"
          fill={COLORS.accent}
          opacity={pulse * 0.6}
        />
        {/* "AI" brain indicator */}
        <circle cx="60" cy="35" r="8" fill={COLORS.ai} opacity={Math.sin(frame * 0.1) * 0.3 + 0.7} />
        {/* Connection dots orbiting */}
        {[0, 120, 240].map((baseAngle) => {
          const angle = ((baseAngle + frame * 0.5) * Math.PI) / 180;
          return (
            <circle
              key={baseAngle}
              cx={60 + Math.cos(angle) * 50}
              cy={60 + Math.sin(angle) * 50}
              r="4"
              fill={COLORS.accent}
              opacity={0.5}
            />
          );
        })}
      </svg>
    );
  };

  // Background particle color based on phase
  const particleColor = isLoopPhase
    ? COLORS.orchestration
    : isAgentWordPhase
    ? COLORS.accent
    : COLORS.dataProcessing;

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={particleColor}
        particleCount={25}
        gradientDirection="radial"
        gradientColor="#0A0A14"
      />

      {/* Phase 1: ExplodedLayers - NO TITLE */}
      {isLayersPhase && layersOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: layersOpacity,
          }}
        >
          <ExplodedLayers
            startFrame={0}
            explodeAmount={explodeAmount}
            showPercentages={showPercentages}
            scale={0.9}
          />
        </AbsoluteFill>
      )}

      {/* Phase 2: THE WORD "AGENT" */}
      {isAgentWordPhase && agentWordOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: agentWordOpacity,
          }}
        >
          {/* Center content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
            }}
          >
            {/* Agent silhouette */}
            <div
              style={{
                opacity: interpolate(agentWordProgress, [0, 1], [0, 1]),
                transform: `scale(${interpolate(agentWordProgress, [0, 1], [0.8, 1])})`,
              }}
            >
              <AgentSilhouette opacity={1} />
            </div>

            {/* The word AGENT */}
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.accent,
                letterSpacing: 12,
                textShadow: `0 0 60px ${COLORS.accent}50, 0 0 120px ${COLORS.accent}30`,
                transform: `scale(${interpolate(agentWordProgress, [0, 1], [0.9, 1])})`,
              }}
            >
              AGENT
            </div>

            {/* Implications floating around */}
            <div
              style={{
                position: 'relative',
                width: 700,
                height: 80,
                marginTop: 20,
              }}
            >
              {IMPLICATIONS.map((impl, i) => {
                const implProgress = spring({
                  frame: frame - IMPLICATIONS_IN - impl.delay,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });

                const hoverOffset = Math.sin(frame * 0.03 + i) * 5;

                return (
                  <div
                    key={impl.label}
                    style={{
                      position: 'absolute',
                      left: `${30 + i * 25}%`,
                      transform: `translateX(-50%) translateY(${hoverOffset}px)`,
                      padding: '12px 24px',
                      backgroundColor: `${COLORS.accent}15`,
                      border: `2px solid ${COLORS.accent}60`,
                      borderRadius: 12,
                      opacity: interpolate(implProgress, [0, 1], [0, 1]),
                      boxShadow: `0 0 20px ${COLORS.accent}20`,
                    }}
                  >
                    {/* Corner brackets */}
                    <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.accent}`, borderLeft: `2px solid ${COLORS.accent}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderTop: `2px solid ${COLORS.accent}`, borderRight: `2px solid ${COLORS.accent}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.accent}`, borderLeft: `2px solid ${COLORS.accent}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `2px solid ${COLORS.accent}`, borderRight: `2px solid ${COLORS.accent}`, opacity: 0.5 }} />
                    <span
                      style={{
                        fontFamily: TYPOGRAPHY.display.fontFamily,
                        fontSize: 20,
                        fontWeight: 600,
                        color: COLORS.accent,
                      }}
                    >
                      {impl.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Language running ahead" text */}
          {frame >= REALITY_TEXT && (
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: interpolate(
                  spring({
                    frame: frame - REALITY_TEXT,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 26,
                  color: COLORS.textMuted,
                }}
              >
                But is this what's actually happening?
              </span>
              <div
                style={{
                  marginTop: 16,
                  opacity: interpolate(
                    spring({
                      frame: frame - REALITY_TEXT - 20,
                      fps,
                      config: SPRING_CONFIGS.gentle,
                    }),
                    [0, 1],
                    [0, 1]
                  ),
                }}
              >
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 18,
                    color: COLORS.textDim,
                    fontStyle: 'italic',
                  }}
                >
                  "Language is running ahead of the engineering."
                </span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Phase 3: Function vs Process */}
      {isFunctionPhase && functionOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: functionOpacity,
          }}
        >
          {/* Header text */}
          <div
            style={{
              position: 'absolute',
              top: 80,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 24,
                color: COLORS.textMuted,
                marginBottom: 12,
                opacity: interpolate(
                  spring({
                    frame: frame - FUNCTION_IN - 10,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              Each call to a language model is a{' '}
              <span style={{ color: COLORS.ai, fontWeight: 600 }}>function call</span>
            </div>
            <div
              style={{
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 20,
                color: COLORS.textDim,
                opacity: interpolate(
                  spring({
                    frame: frame - FUNCTION_IN - 30,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              Prompt in → Text out
            </div>
          </div>

          <FunctionVsProcess startFrame={FUNCTION_IN + 20} showComparison="both" />

          {/* Bottom insight */}
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - FUNCTION_IN - seconds(15),
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 22,
                color: COLORS.textMuted,
              }}
            >
              The "agentic" behavior emerges from the{' '}
            </span>
            <span
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 22,
                color: COLORS.orchestration,
                fontWeight: 600,
              }}
            >
              orchestration code
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 4: AgentLoop - NOW with proper context */}
      {isLoopPhase && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: loopOpacity,
            transform: `scale(${interpolate(loopScale, [0, 1], [0.9, 1])})`,
          }}
        >
          <AgentLoop
            startFrame={LOOP_IN}
            activeStep={activeStep}
            showAnnotation={showAnnotation}
            scale={1.1}
          />

          {/* Section title - NOW we can say "Agent Loop" */}
          <div
            style={{
              position: 'absolute',
              top: 60,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - LOOP_IN - 30,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <span
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 28,
                fontWeight: 500,
                color: COLORS.textMuted,
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              So what <span style={{ color: COLORS.accent }}>is</span> an "Agent"?
            </span>
          </div>

          {/* Legend */}
          {frame >= LEGEND_IN && (
            <div
              style={{
                position: 'absolute',
                bottom: 100,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 60,
                opacity: interpolate(
                  spring({
                    frame: frame - LEGEND_IN,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: COLORS.ai,
                    boxShadow: `0 0 10px ${COLORS.ai}60`,
                  }}
                />
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 20,
                    color: COLORS.ai,
                  }}
                >
                  AI (2 of 5)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    backgroundColor: COLORS.orchestration,
                    boxShadow: `0 0 10px ${COLORS.orchestration}60`,
                  }}
                />
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 20,
                    color: COLORS.orchestration,
                  }}
                >
                  Traditional Code (3 of 5)
                </span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default Section1Agent;
