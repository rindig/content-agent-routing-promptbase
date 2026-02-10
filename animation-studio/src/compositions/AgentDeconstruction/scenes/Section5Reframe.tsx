import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY, seconds } from '../constants';
import { FullStack } from '../components/FullStack';
import { AgentLoop } from '../components/AgentLoop';
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';

/**
 * SECTION 5: The Reframe [12:00 - 15:00]
 * Duration: 5400 frames (180 seconds)
 *
 * Visual journey:
 * 1. [0-600] Two Narratives - "AI changes everything" vs "AI is just hype" resolving
 * 2. [600-1800] Stack Returns - Complete abstraction stack building bottom to top
 * 3. [1800-2400] Trilogy Callbacks - Brief visual references to Video 1 and 2
 * 4. [2400-3000] Agent Layers Mapped - 60/30/10 colors overlay on the stack
 * 5. [3000-3600] The Novel Part - AI/Semantic layer pulses, genuinely new + dependency visual
 * 6. [3600-4200] Interface Concept - "Natural language as interface, context as program"
 * 7. [4200-4800] Autonomous Future - Enhanced loop showing AI making autonomous decisions
 * 8. [4800-5400] The Work Ahead - Infrastructure, Reliability, Protocols + Grace Hopper callback
 *
 * Key message: "AI extends something. It adds a layer. But it sits on the same engineering tradition."
 */
export const Section5Reframe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline markers - restructured for new flow
  const TWO_NARRATIVES = 0;
  const STACK_BUILD = seconds(20);
  const TRILOGY_CALLBACKS = seconds(60);
  const AGENT_COLORS = seconds(80);
  const NOVEL_PART = seconds(100);
  const INTERFACE_CONCEPT = seconds(120);
  const LOOKING_FORWARD = seconds(140);
  const WORK_AHEAD = seconds(160);

  // Phase calculations
  const isTwoNarrativesPhase = frame < STACK_BUILD;
  const isStackPhase = frame >= STACK_BUILD && frame < INTERFACE_CONCEPT;
  const isInterfacePhase = frame >= INTERFACE_CONCEPT && frame < LOOKING_FORWARD;
  const isLookingForwardPhase = frame >= LOOKING_FORWARD && frame < WORK_AHEAD;
  const isWorkAheadPhase = frame >= WORK_AHEAD;

  // Two narratives opacity
  const twoNarrativesOpacity = interpolate(
    frame,
    [TWO_NARRATIVES, TWO_NARRATIVES + 20, STACK_BUILD - 30, STACK_BUILD],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Opacity for stack
  const stackOpacity = interpolate(
    frame,
    [STACK_BUILD, STACK_BUILD + 30, INTERFACE_CONCEPT - 30, INTERFACE_CONCEPT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Show agent colors overlay
  const showAgentColors = frame >= AGENT_COLORS;

  // Highlight AI layer
  const highlightAI = frame >= NOVEL_PART && frame < INTERFACE_CONCEPT;

  // Show dependency visual
  const showDependency = frame >= NOVEL_PART + seconds(10);

  // Interface phase opacity
  const interfaceOpacity = interpolate(
    frame,
    [INTERFACE_CONCEPT, INTERFACE_CONCEPT + 30, LOOKING_FORWARD - 30, LOOKING_FORWARD],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Looking forward opacity
  const lookingForwardOpacity = interpolate(
    frame,
    [LOOKING_FORWARD, LOOKING_FORWARD + 30, WORK_AHEAD - 30, WORK_AHEAD],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Work ahead opacity
  const workAheadOpacity = interpolate(
    frame,
    [WORK_AHEAD, WORK_AHEAD + 30],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Grace Hopper callback timing (appears near end)
  const showGraceHopper = frame >= WORK_AHEAD + seconds(8);

  return (
    <AbsoluteFill>
      {/* Background */}
      <AmbientBackground
        color={COLORS.background}
        particleColor={
          highlightAI
            ? COLORS.ai
            : isWorkAheadPhase
            ? COLORS.orchestration
            : COLORS.accent
        }
        particleCount={25}
        gradientDirection="radial"
        gradientColor="#0A0812"
      />

      {/* Section title */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            spring({
              frame: frame - 20,
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
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.accent,
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          The Reframe
        </span>
      </div>

      {/* TWO NARRATIVES PHASE - "AI changes everything" vs "AI is just hype" */}
      {isTwoNarrativesPhase && twoNarrativesOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: twoNarrativesOpacity,
          }}
        >
          {/* Left narrative - "AI changes everything" */}
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: interpolate(
                spring({ frame: frame - 15, fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '30px 40px',
                backgroundColor: `${COLORS.ai}10`,
                border: `2px solid ${COLORS.ai}60`,
                borderRadius: 16,
                maxWidth: 320,
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 50) / 50) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.ai}40, transparent)` }} />

              <div
                style={{
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontSize: 28,
                  fontWeight: 600,
                  color: COLORS.ai,
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                "AI changes everything"
              </div>

              {/* Strike-through that appears later */}
              {frame > seconds(12) && (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    top: '50%',
                    height: 3,
                    backgroundColor: COLORS.error,
                    transform: `scaleX(${interpolate(
                      spring({ frame: frame - seconds(12), fps, config: SPRING_CONFIGS.snappy }),
                      [0, 1],
                      [0, 1]
                    )})`,
                    transformOrigin: 'left',
                    opacity: 0.8,
                  }}
                />
              )}
            </div>
          </div>

          {/* Right narrative - "AI is just hype" */}
          <div
            style={{
              position: 'absolute',
              right: 120,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: interpolate(
                spring({ frame: frame - 25, fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '30px 40px',
                backgroundColor: `${COLORS.textMuted}10`,
                border: `2px solid ${COLORS.textMuted}60`,
                borderRadius: 16,
                maxWidth: 320,
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 8, left: 8, width: 12, height: 12, borderTop: `2px solid ${COLORS.textMuted}`, borderLeft: `2px solid ${COLORS.textMuted}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderBottom: `2px solid ${COLORS.textMuted}`, borderRight: `2px solid ${COLORS.textMuted}`, opacity: 0.6 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 50 + 25) / 50) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.textMuted}40, transparent)` }} />

              <div
                style={{
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontSize: 28,
                  fontWeight: 600,
                  color: COLORS.textMuted,
                  lineHeight: 1.3,
                  textAlign: 'center',
                }}
              >
                "AI is just hype"
              </div>

              {/* Strike-through that appears later */}
              {frame > seconds(13) && (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    top: '50%',
                    height: 3,
                    backgroundColor: COLORS.error,
                    transform: `scaleX(${interpolate(
                      spring({ frame: frame - seconds(13), fps, config: SPRING_CONFIGS.snappy }),
                      [0, 1],
                      [0, 1]
                    )})`,
                    transformOrigin: 'right',
                    opacity: 0.8,
                  }}
                />
              )}
            </div>
          </div>

          {/* Center - "What's actually interesting" appears after both are struck */}
          {frame > seconds(14) && (
            <div
              style={{
                position: 'absolute',
                bottom: 180,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: interpolate(
                  spring({ frame: frame - seconds(14), fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
                transform: `translateY(${interpolate(
                  spring({ frame: frame - seconds(14), fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [20, 0]
                )}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.textMuted,
                }}
              >
                Both miss{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.accent,
                  fontWeight: 600,
                }}
              >
                what's actually interesting
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Stack Phase */}
      {isStackPhase && stackOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: stackOpacity,
          }}
        >
          <FullStack
            startFrame={STACK_BUILD}
            buildSequence={true}
            showAgentColors={showAgentColors}
            highlightAI={highlightAI}
            scale={0.85}
          />

          {/* Trilogy callback labels */}
          {frame >= TRILOGY_CALLBACKS && frame < AGENT_COLORS && (
            <div
              style={{
                position: 'absolute',
                left: 100,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                opacity: interpolate(
                  spring({
                    frame: frame - TRILOGY_CALLBACKS,
                    fps,
                    config: SPRING_CONFIGS.gentle,
                  }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: `${COLORS.accent}15`,
                  border: `1px solid ${COLORS.accent}40`,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.accent,
                    fontWeight: 500,
                  }}
                >
                  Video 1
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 11,
                    color: COLORS.textMuted,
                  }}
                >
                  Python → Electrons
                </div>
              </div>
              <div
                style={{
                  padding: '12px 20px',
                  backgroundColor: `${COLORS.accent}15`,
                  border: `1px solid ${COLORS.accent}40`,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.accent,
                    fontWeight: 500,
                  }}
                >
                  Video 2
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 11,
                    color: COLORS.textMuted,
                  }}
                >
                  Memory → Context
                </div>
              </div>
            </div>
          )}

          {/* Agent colors legend */}
          {showAgentColors && (
            <div
              style={{
                position: 'absolute',
                right: 80,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                opacity: interpolate(
                  spring({
                    frame: frame - AGENT_COLORS,
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
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: COLORS.ai,
                  }}
                />
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.ai,
                  }}
                >
                  AI (10%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: COLORS.orchestration,
                  }}
                />
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.orchestration,
                  }}
                >
                  Orchestration (30%)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: COLORS.dataProcessing,
                  }}
                />
                <span
                  style={{
                    fontFamily: TYPOGRAPHY.body.fontFamily,
                    fontSize: 14,
                    color: COLORS.dataProcessing,
                  }}
                >
                  Data Processing (60%)
                </span>
              </div>
            </div>
          )}

          {/* Novel part caption */}
          {highlightAI && (
            <div
              style={{
                position: 'absolute',
                bottom: 100,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: interpolate(
                  spring({
                    frame: frame - NOVEL_PART,
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
                The semantic layer is{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 22,
                  color: COLORS.ai,
                  fontWeight: 600,
                }}
              >
                genuinely new
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 22,
                  color: COLORS.textMuted,
                }}
              >
                — operating on meaning, not syntax
              </span>
            </div>
          )}

          {/* Dependency caption - "But it depends on them" */}
          {showDependency && highlightAI && (
            <div
              style={{
                position: 'absolute',
                bottom: 55,
                left: 0,
                right: 0,
                textAlign: 'center',
                opacity: interpolate(
                  spring({
                    frame: frame - NOVEL_PART - seconds(10),
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
                  fontSize: 20,
                  color: COLORS.textMuted,
                  fontStyle: 'italic',
                }}
              >
                But it{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.orchestration,
                  fontWeight: 600,
                  fontStyle: 'italic',
                }}
              >
                depends
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.textMuted,
                  fontStyle: 'italic',
                }}
              >
                {' '}on the layers beneath it
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* INTERFACE CONCEPT PHASE - "Natural language as interface, context as program" */}
      {isInterfacePhase && interfaceOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: interfaceOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 60,
            }}
          >
            {/* Main concept visualization */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
              }}
            >
              {/* Natural Language Input */}
              <div
                style={{
                  position: 'relative',
                  padding: '24px 36px',
                  backgroundColor: `${COLORS.ai}12`,
                  border: `2px solid ${COLORS.ai}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  opacity: interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [0, 1]
                  ),
                  transform: `translateX(${interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [-30, 0]
                  )}px)`,
                }}
              >
                {/* Corner brackets */}
                <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.5 }} />
                {/* Scan line */}
                <div style={{ position: 'absolute', top: `${((frame % 40) / 40) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.ai}40, transparent)` }} />
                {/* Type badge */}
                <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 6px', backgroundColor: COLORS.ai, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>LANGUAGE</div>

                <div
                  style={{
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontSize: 22,
                    fontWeight: 600,
                    color: COLORS.ai,
                  }}
                >
                  Natural Language
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 13,
                    color: COLORS.textMuted,
                    marginTop: 6,
                  }}
                >
                  "Analyze this data..."
                </div>
              </div>

              {/* Arrow 1 */}
              <svg
                width="60"
                height="40"
                style={{
                  opacity: interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 15, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [0, 1]
                  ),
                }}
              >
                <defs>
                  <linearGradient id="arrowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={COLORS.ai} />
                    <stop offset="100%" stopColor={COLORS.orchestration} />
                  </linearGradient>
                </defs>
                <path
                  d="M5 20 L45 20 M35 10 L48 20 L35 30"
                  stroke="url(#arrowGrad1)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Animated dot */}
                <circle
                  cx={5 + ((frame * 2) % 45)}
                  cy="20"
                  r="4"
                  fill={COLORS.ai}
                  opacity={0.8}
                />
              </svg>

              {/* Interface Box */}
              <div
                style={{
                  position: 'relative',
                  padding: '24px 36px',
                  backgroundColor: `${COLORS.orchestration}12`,
                  border: `2px solid ${COLORS.orchestration}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  opacity: interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 20, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [0, 1]
                  ),
                  transform: `scale(${interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 20, fps, config: SPRING_CONFIGS.bouncy }),
                    [0, 1],
                    [0.8, 1]
                  )})`,
                }}
              >
                {/* Corner brackets */}
                <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                {/* Scan line */}
                <div style={{ position: 'absolute', left: `${((frame % 35) / 35) * 100}%`, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, transparent, ${COLORS.orchestration}40, transparent)` }} />
                {/* Type badge */}
                <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 6px', backgroundColor: COLORS.orchestration, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>INTERFACE</div>

                <div
                  style={{
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontSize: 22,
                    fontWeight: 600,
                    color: COLORS.orchestration,
                    textAlign: 'center',
                  }}
                >
                  Semantic Layer
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 12,
                    color: COLORS.textMuted,
                    marginTop: 6,
                    textAlign: 'center',
                  }}
                >
                  meaning → intent → action
                </div>
              </div>

              {/* Arrow 2 */}
              <svg
                width="60"
                height="40"
                style={{
                  opacity: interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 35, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [0, 1]
                  ),
                }}
              >
                <defs>
                  <linearGradient id="arrowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={COLORS.orchestration} />
                    <stop offset="100%" stopColor={COLORS.dataProcessing} />
                  </linearGradient>
                </defs>
                <path
                  d="M5 20 L45 20 M35 10 L48 20 L35 30"
                  stroke="url(#arrowGrad2)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Animated dot */}
                <circle
                  cx={5 + ((frame * 2 + 20) % 45)}
                  cy="20"
                  r="4"
                  fill={COLORS.orchestration}
                  opacity={0.8}
                />
              </svg>

              {/* Context/Program Output */}
              <div
                style={{
                  position: 'relative',
                  padding: '24px 36px',
                  backgroundColor: `${COLORS.dataProcessing}12`,
                  border: `2px solid ${COLORS.dataProcessing}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  opacity: interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 40, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [0, 1]
                  ),
                  transform: `translateX(${interpolate(
                    spring({ frame: frame - INTERFACE_CONCEPT - 40, fps, config: SPRING_CONFIGS.snappy }),
                    [0, 1],
                    [30, 0]
                  )}px)`,
                }}
              >
                {/* Corner brackets */}
                <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.dataProcessing}`, borderLeft: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
                <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.dataProcessing}`, borderRight: `2px solid ${COLORS.dataProcessing}`, opacity: 0.5 }} />
                {/* Scan line */}
                <div style={{ position: 'absolute', top: `${((frame % 40 + 20) / 40) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.dataProcessing}40, transparent)` }} />
                {/* Type badge */}
                <div style={{ position: 'absolute', top: 6, right: 6, padding: '2px 6px', backgroundColor: COLORS.dataProcessing, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>PROGRAM</div>

                <div
                  style={{
                    fontFamily: TYPOGRAPHY.display.fontFamily,
                    fontSize: 22,
                    fontWeight: 600,
                    color: COLORS.dataProcessing,
                  }}
                >
                  Context = Program
                </div>
                <div
                  style={{
                    fontFamily: TYPOGRAPHY.code.fontFamily,
                    fontSize: 13,
                    color: COLORS.textMuted,
                    marginTop: 6,
                  }}
                >
                  structured execution
                </div>
              </div>
            </div>

            {/* Caption below */}
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(
                  spring({ frame: frame - INTERFACE_CONCEPT - 60, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.ai,
                  fontWeight: 600,
                }}
              >
                Natural language
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.textMuted,
                }}
              >
                {' '}becomes the interface,{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.dataProcessing,
                  fontWeight: 600,
                }}
              >
                context
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 24,
                  color: COLORS.textMuted,
                }}
              >
                {' '}becomes the program
              </span>
            </div>

            {/* Sub-caption - "Same engineering tradition" */}
            <div
              style={{
                textAlign: 'center',
                opacity: interpolate(
                  spring({ frame: frame - INTERFACE_CONCEPT - 90, fps, config: SPRING_CONFIGS.gentle }),
                  [0, 1],
                  [0, 1]
                ),
              }}
            >
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 18,
                  color: COLORS.textMuted,
                  fontStyle: 'italic',
                }}
              >
                Built on the same engineering tradition since we first routed electricity through logic gates
              </span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Looking Forward Phase - Autonomous Loops */}
      {isLookingForwardPhase && lookingForwardOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: lookingForwardOpacity,
          }}
        >
          <AgentLoop
            startFrame={LOOKING_FORWARD}
            showAnnotation={false}
            scale={0.9}
          />

          {/* Autonomous decision visual - branching paths from AI */}
          <div
            style={{
              position: 'absolute',
              right: 180,
              top: '35%',
              opacity: interpolate(
                spring({ frame: frame - LOOKING_FORWARD - 45, fps, config: SPRING_CONFIGS.gentle }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <div
              style={{
                position: 'relative',
                padding: '20px 28px',
                backgroundColor: `${COLORS.ai}12`,
                border: `2px solid ${COLORS.ai}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Corner brackets */}
              <div style={{ position: 'absolute', top: 5, left: 5, width: 8, height: 8, borderTop: `2px solid ${COLORS.ai}`, borderLeft: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              <div style={{ position: 'absolute', bottom: 5, right: 5, width: 8, height: 8, borderBottom: `2px solid ${COLORS.ai}`, borderRight: `2px solid ${COLORS.ai}`, opacity: 0.6 }} />
              {/* Scan line */}
              <div style={{ position: 'absolute', top: `${((frame % 30) / 30) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.ai}50, transparent)` }} />
              {/* Type badge */}
              <div style={{ position: 'absolute', top: 5, right: 5, padding: '2px 6px', backgroundColor: COLORS.ai, borderRadius: 4, fontFamily: TYPOGRAPHY.code.fontFamily, fontSize: 8, fontWeight: 700, color: COLORS.background }}>AUTONOMOUS</div>

              <div
                style={{
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.ai,
                }}
              >
                Genuine agency
              </div>
              <div
                style={{
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 11,
                  color: COLORS.textMuted,
                  marginTop: 4,
                }}
              >
                decisions not predetermined
              </div>

              {/* Branching decision paths */}
              <svg
                width="100"
                height="60"
                style={{
                  position: 'absolute',
                  left: -90,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {/* Main path */}
                <path
                  d="M90 30 L60 30"
                  stroke={COLORS.ai}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4,3"
                />
                {/* Branch up */}
                <path
                  d="M60 30 L30 15 L10 15"
                  stroke={COLORS.ai}
                  strokeWidth="2"
                  fill="none"
                  opacity={Math.sin(frame * 0.1) * 0.3 + 0.7}
                />
                {/* Branch down */}
                <path
                  d="M60 30 L30 45 L10 45"
                  stroke={COLORS.ai}
                  strokeWidth="2"
                  fill="none"
                  opacity={Math.cos(frame * 0.1) * 0.3 + 0.7}
                />
                {/* Decision node */}
                <circle cx="60" cy="30" r="5" fill={COLORS.ai} opacity={Math.sin(frame * 0.15) * 0.3 + 0.7} />
                {/* End nodes */}
                <circle cx="10" cy="15" r="4" fill={COLORS.orchestration} opacity={0.6} />
                <circle cx="10" cy="45" r="4" fill={COLORS.orchestration} opacity={0.6} />
              </svg>
            </div>
          </div>

          {/* Caption - autonomous loops */}
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - LOOKING_FORWARD - 30,
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
              Models operating in{' '}
            </span>
            <span
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 22,
                color: COLORS.ai,
                fontWeight: 600,
              }}
            >
              autonomous loops
            </span>
            <span
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 22,
                color: COLORS.textMuted,
              }}
            >
              , making decisions
            </span>
          </div>

          {/* Sub-caption - engineering challenge */}
          <div
            style={{
              position: 'absolute',
              bottom: 60,
              left: 0,
              right: 0,
              textAlign: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - LOOKING_FORWARD - 60,
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
                fontSize: 18,
                color: COLORS.textMuted,
                fontStyle: 'italic',
              }}
            >
              The challenge won't be making AI smarter—it will be building{' '}
            </span>
            <span
              style={{
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontSize: 18,
                color: COLORS.orchestration,
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              the infrastructure around it
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Work Ahead Phase */}
      {isWorkAheadPhase && workAheadOpacity > 0 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: workAheadOpacity,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 40,
            }}
          >
            <div
              style={{
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontSize: 36,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              The Work Ahead
            </div>

            <div
              style={{
                display: 'flex',
                gap: 40,
              }}
            >
              {['Infrastructure', 'Reliability', 'Protocols'].map((label, i) => {
                const labelProgress = spring({
                  frame: frame - WORK_AHEAD - i * 12,
                  fps,
                  config: SPRING_CONFIGS.snappy,
                });

                // Icons for each concept
                const renderIcon = () => {
                  if (label === 'Infrastructure') {
                    return (
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <rect x="8" y="4" width="20" height="8" rx="2" fill="none" stroke={COLORS.orchestration} strokeWidth="2" />
                        <rect x="8" y="14" width="20" height="8" rx="2" fill="none" stroke={COLORS.orchestration} strokeWidth="2" />
                        <rect x="8" y="24" width="20" height="8" rx="2" fill="none" stroke={COLORS.orchestration} strokeWidth="2" />
                        <circle cx="12" cy="8" r="2" fill={COLORS.orchestration} opacity={Math.floor(frame / 15) % 3 === 0 ? 1 : 0.3} />
                        <circle cx="12" cy="18" r="2" fill={COLORS.orchestration} opacity={Math.floor(frame / 15) % 3 === 1 ? 1 : 0.3} />
                        <circle cx="12" cy="28" r="2" fill={COLORS.orchestration} opacity={Math.floor(frame / 15) % 3 === 2 ? 1 : 0.3} />
                      </svg>
                    );
                  }
                  if (label === 'Reliability') {
                    const checkScale = Math.sin(frame * 0.08) * 0.1 + 1;
                    return (
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke={COLORS.orchestration} strokeWidth="2" />
                        <path d="M12 18 L16 22 L24 14" fill="none" stroke={COLORS.orchestration} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `scale(${checkScale})`, transformOrigin: 'center' }} />
                      </svg>
                    );
                  }
                  // Protocols
                  const rotation = frame * 0.3;
                  return (
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="10" fill="none" stroke={COLORS.orchestration} strokeWidth="2" strokeDasharray="4,3" style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }} />
                      <circle cx="18" cy="18" r="4" fill={COLORS.orchestration} opacity={0.8} />
                      {[0, 90, 180, 270].map((angle) => {
                        const rad = (angle * Math.PI) / 180;
                        return <circle key={angle} cx={18 + Math.cos(rad) * 10} cy={18 + Math.sin(rad) * 10} r="3" fill={COLORS.orchestration} opacity={0.6} />;
                      })}
                    </svg>
                  );
                };

                return (
                  <div
                    key={label}
                    style={{
                      position: 'relative',
                      padding: '28px 40px',
                      backgroundColor: `${COLORS.orchestration}10`,
                      border: `2px solid ${COLORS.orchestration}`,
                      borderRadius: 14,
                      opacity: interpolate(labelProgress, [0, 1], [0, 1]),
                      transform: `
                        translateY(${interpolate(labelProgress, [0, 1], [30, 0])}px)
                        scale(${interpolate(labelProgress, [0, 1], [0.9, 1])})
                      `,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Corner brackets */}
                    <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderTop: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderLeft: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderBottom: `2px solid ${COLORS.orchestration}`, borderRight: `2px solid ${COLORS.orchestration}`, opacity: 0.5 }} />
                    {/* Scan line */}
                    <div style={{ position: 'absolute', top: `${((frame % 45) / 45) * 100}%`, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.orchestration}30, transparent)`, pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      {renderIcon()}
                      <span
                        style={{
                          fontFamily: TYPOGRAPHY.display.fontFamily,
                          fontSize: 22,
                          fontWeight: 600,
                          color: COLORS.orchestration,
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    {/* Type badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        padding: '3px 8px',
                        backgroundColor: COLORS.orchestration,
                        borderRadius: 4,
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 9,
                        fontWeight: 700,
                        color: COLORS.background,
                      }}
                    >
                      CODE
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Caption */}
            <div
              style={{
                marginTop: 30,
                opacity: interpolate(
                  spring({
                    frame: frame - WORK_AHEAD - 50,
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
                  fontSize: 20,
                  color: COLORS.textMuted,
                }}
              >
                The same work that has accompanied{' '}
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.orchestration,
                  fontWeight: 600,
                }}
              >
                every new layer
              </span>
              <span
                style={{
                  fontFamily: TYPOGRAPHY.body.fontFamily,
                  fontSize: 20,
                  color: COLORS.textMuted,
                }}
              >
                {' '}of the stack
              </span>
            </div>

            {/* Grace Hopper callback - subtle historical reference */}
            {showGraceHopper && (
              <div
                style={{
                  marginTop: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: interpolate(
                    spring({
                      frame: frame - WORK_AHEAD - seconds(8),
                      fps,
                      config: SPRING_CONFIGS.gentle,
                    }),
                    [0, 1],
                    [0, 1]
                  ),
                  transform: `translateY(${interpolate(
                    spring({
                      frame: frame - WORK_AHEAD - seconds(8),
                      fps,
                      config: SPRING_CONFIGS.gentle,
                    }),
                    [0, 1],
                    [15, 0]
                  )}px)`,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    padding: '16px 32px',
                    backgroundColor: `${COLORS.accent}08`,
                    border: `1px solid ${COLORS.accent}40`,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner brackets */}
                  <div style={{ position: 'absolute', top: 4, left: 4, width: 8, height: 8, borderTop: `1px solid ${COLORS.accent}`, borderLeft: `1px solid ${COLORS.accent}`, opacity: 0.5 }} />
                  <div style={{ position: 'absolute', bottom: 4, right: 4, width: 8, height: 8, borderBottom: `1px solid ${COLORS.accent}`, borderRight: `1px solid ${COLORS.accent}`, opacity: 0.5 }} />
                  {/* Subtle scan */}
                  <div style={{ position: 'absolute', left: `${((frame % 80) / 80) * 100}%`, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, transparent, ${COLORS.accent}20, transparent)` }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Year badge */}
                    <div
                      style={{
                        fontFamily: TYPOGRAPHY.code.fontFamily,
                        fontSize: 28,
                        fontWeight: 700,
                        color: COLORS.accent,
                        opacity: 0.9,
                        textShadow: `0 0 20px ${COLORS.accent}40`,
                      }}
                    >
                      1952
                    </div>
                    <div
                      style={{
                        width: 1,
                        height: 30,
                        backgroundColor: COLORS.accent,
                        opacity: 0.3,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: TYPOGRAPHY.body.fontFamily,
                          fontSize: 16,
                          color: COLORS.textSecondary,
                          fontStyle: 'italic',
                        }}
                      >
                        "A compiler that nobody believed could work"
                      </div>
                      <div
                        style={{
                          fontFamily: TYPOGRAPHY.body.fontFamily,
                          fontSize: 12,
                          color: COLORS.textMuted,
                          marginTop: 4,
                        }}
                      >
                        — Grace Hopper
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      <Vignette intensity={0.5} />
    </AbsoluteFill>
  );
};

export default Section5Reframe;
