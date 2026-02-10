import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
  AnimatedLine,
  HopperTribute,
  QuoteCard,
  AbstractionTimeline,
  AbstractionStack,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (150 seconds = 4500 frames at 30fps)
const BEATS = {
  // Beat 1: Grace Hopper tribute [0-300 frames]
  HOPPER_IN: 0,
  HOPPER_VISIBLE: 90,

  // Beat 2: Quote appears [300-900 frames]
  QUOTE_START: 300,
  QUOTE_VISIBLE: 450,

  // Beat 3: Skepticism explanation [900-1500 frames]
  SKEPTICISM_START: 900,
  SKEPTICISM_MAIN: 1050,

  // Beat 4: Abstraction timeline [1500-3000 frames]
  TIMELINE_START: 1500,
  TIMELINE_EXPAND: 1800,

  // Beat 5: Callback - Stack visual [3000-3600 frames]
  STACK_START: 3000,
  STACK_BUILD: 3150,

  // Beat 6: Reliability through engineering [3600-4200 frames]
  RELIABILITY_START: 3600,
  RELIABILITY_MAIN: 3750,

  // Beat 7: LLMs as next layer [4200-4500 frames]
  LLM_PIVOT: 4200,
  SCENE_END: 4500,
};

export const Section4GraceHopper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase visibility
  const showHopper = frame < BEATS.QUOTE_START + 200;
  const showQuote = frame >= BEATS.QUOTE_START && frame < BEATS.SKEPTICISM_START + 300;
  const showSkepticism = frame >= BEATS.SKEPTICISM_START && frame < BEATS.TIMELINE_START;
  const showTimeline = frame >= BEATS.TIMELINE_START && frame < BEATS.STACK_START;
  const showStack = frame >= BEATS.STACK_START && frame < BEATS.RELIABILITY_START;
  const showReliability = frame >= BEATS.RELIABILITY_START && frame < BEATS.LLM_PIVOT;
  const showLLMPivot = frame >= BEATS.LLM_PIVOT;

  // Transition opacities
  const hopperOpacity = interpolate(
    frame,
    [BEATS.HOPPER_IN, BEATS.HOPPER_VISIBLE, BEATS.QUOTE_START - 30, BEATS.QUOTE_START + 150],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const quoteOpacity = interpolate(
    frame,
    [BEATS.QUOTE_START, BEATS.QUOTE_VISIBLE, BEATS.SKEPTICISM_START - 60, BEATS.SKEPTICISM_START + 200],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const skepticismOpacity = interpolate(
    frame,
    [BEATS.SKEPTICISM_START, BEATS.SKEPTICISM_MAIN, BEATS.TIMELINE_START - 60, BEATS.TIMELINE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const timelineOpacity = interpolate(
    frame,
    [BEATS.TIMELINE_START, BEATS.TIMELINE_START + 60, BEATS.STACK_START - 60, BEATS.STACK_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const stackOpacity = interpolate(
    frame,
    [BEATS.STACK_START, BEATS.STACK_START + 60, BEATS.RELIABILITY_START - 60, BEATS.RELIABILITY_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const reliabilityOpacity = interpolate(
    frame,
    [BEATS.RELIABILITY_START, BEATS.RELIABILITY_START + 60, BEATS.LLM_PIVOT - 60, BEATS.LLM_PIVOT],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const llmOpacity = interpolate(
    frame,
    [BEATS.LLM_PIVOT, BEATS.LLM_PIVOT + 60, BEATS.SCENE_END - 30, BEATS.SCENE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* Warm, golden-tinted background for historical section */}
      <AmbientBackground
        color={COLORS.background}
        particleCount={20}
        particleColor="#c9a227"
        gradientDirection="radial"
        gradientColor="#1a180f"
      />
      <Vignette intensity={0.5} />

      {/* Beat 1: Grace Hopper Tribute */}
      {showHopper && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: hopperOpacity,
          }}
        >
          <HopperTribute startFrame={BEATS.HOPPER_IN} />
        </AbsoluteFill>
      )}

      {/* Beat 2: The Quote */}
      {showQuote && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: quoteOpacity,
          }}
        >
          <QuoteCard
            quote="I had a running compiler and nobody would touch it. They told me computers could only do arithmetic."
            attribution="Grace Hopper, 1952"
            startFrame={BEATS.QUOTE_START}
            wordDelay={5}
            accentColor="#c9a227"
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Skepticism Explanation */}
      {showSkepticism && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10%',
            opacity: skepticismOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.SKEPTICISM_START}
            wordDelay={5}
            fontSize={48}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              violate: { color: '#ef4444', weight: 700 },
              foundational: { color: '#ef4444', weight: 700 },
              truth: { color: '#ef4444', weight: 700 },
            }}
          >
            Her compiler seemed to violate a foundational truth
          </AnimatedLine>

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.SKEPTICISM_START + 90}
              wordDelay={4}
              fontSize={40}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                built: { color: COLORS.accent, weight: 600 },
                layer: { color: COLORS.accent, weight: 600 },
                top: { color: COLORS.accent, weight: 600 },
              }}
            >
              But she built a layer on top of what existed
            </AnimatedLine>
          </div>

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.SKEPTICISM_START + 180}
              wordDelay={4}
              fontSize={40}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                translated: { color: COLORS.warning, weight: 600 },
                human: { color: COLORS.warning, weight: 600 },
                machine: { color: COLORS.warning, weight: 600 },
              }}
            >
              That translated human intent into machine instructions
            </AnimatedLine>
          </div>

          {/* Visual: Simple abstraction arrow */}
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              opacity: interpolate(
                spring({
                  frame: frame - BEATS.SKEPTICISM_START - 270,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <LanguageBox label="Human Language" color="#c9a227" />
            <Arrow />
            <LanguageBox label="Compiler" color={COLORS.accent} />
            <Arrow />
            <LanguageBox label="Machine Code" color="#64748b" />
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 4: Abstraction Timeline */}
      {showTimeline && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: timelineOpacity,
          }}
        >
          <AbstractionTimeline
            startFrame={BEATS.TIMELINE_START}
            eraDelay={45}
            highlightLLM={true}
            showSkepticQuotes={true}
          />
        </AbsoluteFill>
      )}

      {/* Beat 5: Stack Visual - The Full Picture */}
      {showStack && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: stackOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.STACK_START}
            wordDelay={4}
            fontSize={44}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              entire: { color: COLORS.accent, weight: 700 },
              stack: { color: COLORS.accent, weight: 700 },
            }}
            style={{ marginBottom: 40 }}
          >
            The entire stack is built this way
          </AnimatedLine>

          <AbstractionStack
            startFrame={BEATS.STACK_BUILD}
            layerDelay={25}
            buildUp={true}
            showConstruction={true}
            scale={0.85}
          />
        </AbsoluteFill>
      )}

      {/* Beat 6: Reliability Through Engineering */}
      {showReliability && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: reliabilityOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.RELIABILITY_START}
            wordDelay={4}
            fontSize={52}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              reliable: { color: COLORS.success, weight: 700, glow: true },
            }}
          >
            We made it reliable
          </AnimatedLine>

          <div style={{ marginTop: 60, display: 'flex', gap: 40 }}>
            <EngineeringPrinciple
              icon="🏗️"
              label="Architecture"
              startFrame={BEATS.RELIABILITY_START + 60}
            />
            <EngineeringPrinciple
              icon="✅"
              label="Error Correction"
              startFrame={BEATS.RELIABILITY_START + 90}
            />
            <EngineeringPrinciple
              icon="🔄"
              label="Redundancy"
              startFrame={BEATS.RELIABILITY_START + 120}
            />
            <EngineeringPrinciple
              icon="🧪"
              label="Testing"
              startFrame={BEATS.RELIABILITY_START + 150}
            />
          </div>

          <div style={{ marginTop: 80 }}>
            <AnimatedLine
              startFrame={BEATS.RELIABILITY_START + 200}
              wordDelay={5}
              fontSize={38}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                unreliable: { color: '#ef4444', weight: 600 },
                trustworthy: { color: COLORS.success, weight: 600 },
              }}
            >
              Turned each unreliable layer into something trustworthy
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 7: LLMs as Next Layer */}
      {showLLMPivot && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: llmOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.LLM_PIVOT}
            wordDelay={5}
            fontSize={56}
            color={COLORS.warning}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              happening: { color: COLORS.success, weight: 700, glow: true },
              now: { color: COLORS.success, weight: 700, glow: true },
            }}
          >
            That work is happening now
          </AnimatedLine>

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.LLM_PIVOT + 60}
              wordDelay={4}
              fontSize={40}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
            >
              It just looks different than before
            </AnimatedLine>
          </div>

          {/* Visual comparison */}
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              gap: 80,
              alignItems: 'center',
              opacity: interpolate(
                spring({
                  frame: frame - BEATS.LLM_PIVOT - 120,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 1]
              ),
            }}
          >
            <ComparisonCard
              era="Then"
              items={['Error correction codes', 'Memory protection', 'Type systems']}
              color="#64748b"
            />

            <div
              style={{
                fontSize: 60,
                color: COLORS.textMuted,
              }}
            >
              →
            </div>

            <ComparisonCard
              era="Now"
              items={['Guardrails', 'Structured outputs', 'Prompt engineering']}
              color={COLORS.warning}
              highlighted
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Helper components

const LanguageBox: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      padding: '16px 28px',
      backgroundColor: `${color}20`,
      border: `2px solid ${color}`,
      borderRadius: 12,
      fontSize: 22,
      fontFamily: TYPOGRAPHY.display.fontFamily,
      fontWeight: 600,
      color,
    }}
  >
    {label}
  </div>
);

const Arrow: React.FC = () => (
  <svg width="50" height="24" viewBox="0 0 50 24">
    <defs>
      <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={COLORS.textMuted} stopOpacity="0.3" />
        <stop offset="100%" stopColor={COLORS.textMuted} stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <line x1="0" y1="12" x2="35" y2="12" stroke="url(#arrow-grad)" strokeWidth="2" />
    <path d="M30 6 L42 12 L30 18" stroke={COLORS.textMuted} strokeWidth="2" fill="none" />
  </svg>
);

const EngineeringPrinciple: React.FC<{
  icon: string;
  label: string;
  startFrame: number;
}> = ({ icon, label, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px) scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '24px 32px',
        backgroundColor: `${COLORS.success}15`,
        border: `2px solid ${COLORS.success}50`,
        borderRadius: 16,
      }}
    >
      <span style={{ fontSize: 40 }}>{icon}</span>
      <span
        style={{
          fontSize: 18,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.success,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const ComparisonCard: React.FC<{
  era: string;
  items: string[];
  color: string;
  highlighted?: boolean;
}> = ({ era, items, color, highlighted }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        padding: 32,
        backgroundColor: highlighted ? `${color}15` : COLORS.surface,
        border: `2px solid ${color}`,
        borderRadius: 16,
        minWidth: 280,
        boxShadow: highlighted ? `0 0 30px ${color}30` : 'none',
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {era}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            fontSize: 18,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textPrimary,
            padding: '10px 0',
            borderBottom: i < items.length - 1 ? `1px solid ${COLORS.backgroundLight}` : 'none',
          }}
        >
          • {item}
        </div>
      ))}
    </div>
  );
};

export default Section4GraceHopper;
