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
  MadLibsPage,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (120 seconds = 3600 frames at 30fps)
const BEATS = {
  // Beat 1: Split screen - Simple vs Complex [0-450 frames]
  SPLIT_START: 0,
  SPLIT_VISIBLE: 60,

  // Beat 2: Surface level critique [450-900 frames]
  SURFACE_START: 450,
  SURFACE_FOCUS: 550,

  // Beat 3: Production reality [900-1800 frames]
  PRODUCTION_START: 900,
  PRODUCTION_EXPAND: 1050,

  // Beat 4: "This Is Programming" [1800-2400 frames]
  PROGRAMMING_START: 1800,
  PROGRAMMING_REVEAL: 1950,

  // Beat 5: Mad Libs callback [2400-3000 frames]
  MADLIBS_START: 2400,
  MADLIBS_TRANSFORM: 2600,

  // Beat 6: What we're optimizing for [3000-3600 frames]
  OPTIMIZE_START: 3000,
  OPTIMIZE_COMPARE: 3150,

  SCENE_END: 3600,
};

export const Section5Prompting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase visibility
  const showSplit = frame < BEATS.SURFACE_START + 200;
  const showSurface = frame >= BEATS.SURFACE_START && frame < BEATS.PRODUCTION_START;
  const showProduction = frame >= BEATS.PRODUCTION_START && frame < BEATS.PROGRAMMING_START;
  const showProgramming = frame >= BEATS.PROGRAMMING_START && frame < BEATS.MADLIBS_START;
  const showMadLibs = frame >= BEATS.MADLIBS_START && frame < BEATS.OPTIMIZE_START;
  const showOptimize = frame >= BEATS.OPTIMIZE_START;

  // Transition opacities
  const splitOpacity = interpolate(
    frame,
    [BEATS.SPLIT_START, BEATS.SPLIT_VISIBLE, BEATS.SURFACE_START - 30, BEATS.SURFACE_START + 150],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const surfaceOpacity = interpolate(
    frame,
    [BEATS.SURFACE_START, BEATS.SURFACE_FOCUS, BEATS.PRODUCTION_START - 60, BEATS.PRODUCTION_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const productionOpacity = interpolate(
    frame,
    [BEATS.PRODUCTION_START, BEATS.PRODUCTION_EXPAND, BEATS.PROGRAMMING_START - 60, BEATS.PROGRAMMING_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const programmingOpacity = interpolate(
    frame,
    [BEATS.PROGRAMMING_START, BEATS.PROGRAMMING_REVEAL, BEATS.MADLIBS_START - 60, BEATS.MADLIBS_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const madlibsOpacity = interpolate(
    frame,
    [BEATS.MADLIBS_START, BEATS.MADLIBS_START + 60, BEATS.OPTIMIZE_START - 60, BEATS.OPTIMIZE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const optimizeOpacity = interpolate(
    frame,
    [BEATS.OPTIMIZE_START, BEATS.OPTIMIZE_COMPARE, BEATS.SCENE_END - 30, BEATS.SCENE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* Cool blue/purple background for technical section */}
      <AmbientBackground
        color={COLORS.background}
        particleCount={25}
        particleColor={COLORS.accent}
        gradientDirection="radial"
        gradientColor="#0f0f2a"
      />
      <Vignette intensity={0.4} />

      {/* Beat 1: Split Screen - Simple vs Complex */}
      {showSplit && (
        <AbsoluteFill
          style={{
            display: 'flex',
            opacity: splitOpacity,
          }}
        >
          {/* Left side - Simple prompting */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5%',
              borderRight: `1px solid ${COLORS.textMuted}30`,
            }}
          >
            <SimpleSide startFrame={BEATS.SPLIT_START} />
          </div>

          {/* Right side - Complex system */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5%',
            }}
          >
            <ComplexSide startFrame={BEATS.SPLIT_START + 90} />
          </div>

          {/* "VS" divider */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 28,
              fontFamily: TYPOGRAPHY.display.fontFamily,
              fontWeight: 700,
              color: COLORS.textMuted,
              backgroundColor: COLORS.background,
              padding: '12px 20px',
              borderRadius: 30,
              border: `2px solid ${COLORS.textMuted}50`,
            }}
          >
            VS
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 2: Surface Level Critique */}
      {showSurface && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: surfaceOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.SURFACE_START}
            wordDelay={4}
            fontSize={48}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              tips: { color: COLORS.textMuted, weight: 400 },
              tricks: { color: COLORS.textMuted, weight: 400 },
              surface: { color: '#ef4444', weight: 700 },
            }}
          >
            Tips and tricks operate at the surface level
          </AnimatedLine>

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.SURFACE_START + 90}
              wordDelay={4}
              fontSize={36}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
            >
              Like telling someone programming is about knowing which words to type
            </AnimatedLine>
          </div>

          {/* Floating tips that are insufficient */}
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              gap: 30,
              opacity: interpolate(
                spring({
                  frame: frame - BEATS.SURFACE_START - 150,
                  fps,
                  config: SPRING_CONFIGS.gentle,
                }),
                [0, 1],
                [0, 0.5]
              ),
            }}
          >
            <TipBubble text="Be specific" />
            <TipBubble text="Give examples" />
            <TipBubble text="Use personas" />
            <TipBubble text="Chain of thought" />
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 3: Production Reality */}
      {showProduction && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
            opacity: productionOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.PRODUCTION_START}
            wordDelay={4}
            fontSize={44}
            color={COLORS.accent}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              Production: { weight: 700 },
              reality: { weight: 700 },
            }}
            style={{ marginBottom: 50 }}
          >
            Production reality looks different
          </AnimatedLine>

          <ProductionArchitecture startFrame={BEATS.PRODUCTION_EXPAND} />
        </AbsoluteFill>
      )}

      {/* Beat 4: This Is Programming */}
      {showProgramming && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: programmingOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.PROGRAMMING_START}
            wordDelay={5}
            fontSize={56}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              programming: { color: COLORS.accent, weight: 700, glow: true },
            }}
          >
            This is programming
          </AnimatedLine>

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.PROGRAMMING_START + 80}
              wordDelay={4}
              fontSize={40}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                highest: { color: COLORS.warning, weight: 600 },
                abstraction: { color: COLORS.warning, weight: 600 },
              }}
            >
              At the highest abstraction layer we have built so far
            </AnimatedLine>
          </div>

          <div style={{ marginTop: 60 }}>
            <AnimatedLine
              startFrame={BEATS.PROGRAMMING_START + 160}
              wordDelay={5}
              fontSize={44}
              color={COLORS.accentSecondary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Natural: { color: '#22c55e', weight: 700 },
                language: { color: '#22c55e', weight: 700 },
                interface: { color: '#22c55e', weight: 600 },
                meaning: { color: '#f59e0b', weight: 700 },
                mechanism: { color: '#f59e0b', weight: 600 },
              }}
            >
              Natural language is the interface and meaning is the mechanism
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 5: Mad Libs Callback */}
      {showMadLibs && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: madlibsOpacity,
          }}
        >
          <PromptAsTemplate startFrame={BEATS.MADLIBS_START} />
        </AbsoluteFill>
      )}

      {/* Beat 6: What We're Optimizing For */}
      {showOptimize && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
            opacity: optimizeOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.OPTIMIZE_START}
            wordDelay={4}
            fontSize={44}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            style={{ marginBottom: 50 }}
          >
            Same pattern different stakes
          </AnimatedLine>

          <ConsequenceComparison startFrame={BEATS.OPTIMIZE_COMPARE} />

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.OPTIMIZE_START + 300}
              wordDelay={5}
              fontSize={36}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                early: { color: COLORS.warning, weight: 600 },
                right: { color: COLORS.accent, weight: 600 },
                abstractions: { color: COLORS.accent, weight: 600 },
              }}
            >
              We are still early in figuring out the right abstractions
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Helper Components

const SimpleSide: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.textMuted,
          marginBottom: 10,
        }}
      >
        What People Think
      </div>

      {/* Chat bubble */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.accent}50`,
          borderRadius: 20,
          padding: '24px 32px',
          maxWidth: 400,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textPrimary,
            lineHeight: 1.5,
          }}
        >
          "Write me a poem about dogs"
        </div>
      </div>

      {/* Floating tips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 350 }}>
        {['be specific', 'add examples', 'use personas'].map((tip, i) => (
          <span
            key={tip}
            style={{
              fontSize: 14,
              fontFamily: TYPOGRAPHY.body.fontFamily,
              color: COLORS.textMuted,
              backgroundColor: `${COLORS.accent}20`,
              padding: '6px 14px',
              borderRadius: 20,
              opacity: interpolate(
                spring({ frame: frame - startFrame - 60 - i * 15, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1],
                [0, 0.7]
              ),
            }}
          >
            {tip}
          </span>
        ))}
      </div>
    </div>
  );
};

const ComplexSide: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const components = [
    { label: 'System Prompt', color: '#8b5cf6' },
    { label: 'Memory Retrieval', color: '#06b6d4' },
    { label: 'Skill Loading', color: '#10b981' },
    { label: 'Context Assembly', color: '#f59e0b' },
    { label: 'Output Parsing', color: '#ef4444' },
  ];

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.textMuted,
          marginBottom: 10,
        }}
      >
        What Actually Happens
      </div>

      {/* Architecture diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {components.map((comp, i) => {
          const itemProgress = spring({
            frame: frame - startFrame - 30 - i * 20,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={comp.label}
              style={{
                opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(itemProgress, [0, 1], [-20, 0])}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 20px',
                backgroundColor: `${comp.color}15`,
                borderLeft: `4px solid ${comp.color}`,
                borderRadius: '0 10px 10px 0',
                minWidth: 250,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: comp.color,
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 500,
                  color: comp.color,
                }}
              >
                {comp.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Arrow pointing down */}
      <div
        style={{
          fontSize: 32,
          color: COLORS.accent,
          opacity: interpolate(
            spring({ frame: frame - startFrame - 150, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 1]
          ),
        }}
      >
        ↓
      </div>

      {/* Single text stream result */}
      <div
        style={{
          fontSize: 16,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textMuted,
          opacity: interpolate(
            spring({ frame: frame - startFrame - 180, fps, config: SPRING_CONFIGS.gentle }),
            [0, 1],
            [0, 0.8]
          ),
        }}
      >
        → single text stream
      </div>
    </div>
  );
};

const TipBubble: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      padding: '12px 24px',
      backgroundColor: `${COLORS.textMuted}15`,
      border: `1px dashed ${COLORS.textMuted}50`,
      borderRadius: 20,
      fontSize: 18,
      fontFamily: TYPOGRAPHY.body.fontFamily,
      color: COLORS.textMuted,
    }}
  >
    "{text}"
  </div>
);

const ProductionArchitecture: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const decisions = [
    { question: 'What context goes where?', icon: '📍' },
    { question: 'When to retrieve vs inject preemptively?', icon: '🔄' },
    { question: 'How to structure memory files?', icon: '📁' },
    { question: 'System-level vs user input interaction?', icon: '⚙️' },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 24,
        maxWidth: 900,
      }}
    >
      {decisions.map((decision, i) => {
        const itemProgress = spring({
          frame: frame - startFrame - i * 40,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        return (
          <div
            key={decision.question}
            style={{
              opacity: interpolate(itemProgress, [0, 1], [0, 1]),
              transform: `scale(${interpolate(itemProgress, [0, 1], [0.9, 1])})`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '20px 28px',
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.accent}40`,
              borderRadius: 16,
            }}
          >
            <span style={{ fontSize: 32 }}>{decision.icon}</span>
            <span
              style={{
                fontSize: 20,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.textPrimary,
              }}
            >
              {decision.question}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const PromptAsTemplate: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Show transformation from Mad Libs to prompt template
  const transformProgress = interpolate(
    frame,
    [startFrame + 150, startFrame + 300],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        opacity: interpolate(progress, [0, 1], [0, 1]),
      }}
    >
      <AnimatedLine
        startFrame={startFrame}
        wordDelay={5}
        fontSize={40}
        color={COLORS.textPrimary}
        fontFamily={TYPOGRAPHY.display.fontFamily}
        emphasis={{
          still: { color: COLORS.warning, weight: 700 },
          templates: { color: COLORS.warning, weight: 700 },
        }}
      >
        You are still filling in templates
      </AnimatedLine>

      {/* Template visualization */}
      <div
        style={{
          backgroundColor: transformProgress > 0.5 ? COLORS.surface : COLORS.madLibsPaper,
          padding: 40,
          borderRadius: 16,
          border: `3px solid ${transformProgress > 0.5 ? COLORS.accent : COLORS.madLibsLine}`,
          maxWidth: 700,
          transition: 'background-color 0.5s, border-color 0.5s',
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontFamily: transformProgress > 0.5 ? TYPOGRAPHY.code.fontFamily : TYPOGRAPHY.handwritten.fontFamily,
            color: transformProgress > 0.5 ? COLORS.textPrimary : COLORS.madLibsText,
            lineHeight: 2.2,
          }}
        >
          {transformProgress < 0.5 ? (
            <>
              You are a <Blank label="role" /> assistant.{' '}
              The user prefers <Blank label="preference" />.{' '}
              Here is relevant context: <Blank label="retrieved docs" />.{' '}
              Now help with: <Blank label="user input" />
            </>
          ) : (
            <>
              <SlotLabel color="#8b5cf6">[system prompt]</SlotLabel>{' '}
              <SlotLabel color="#10b981">[memory]</SlotLabel>{' '}
              <SlotLabel color="#06b6d4">[retrieved context]</SlotLabel>{' '}
              <SlotLabel color="#f59e0b">[user input]</SlotLabel>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <AnimatedLine
          startFrame={startFrame + 350}
          wordDelay={5}
          fontSize={32}
          color={COLORS.textMuted}
          fontFamily={TYPOGRAPHY.body.fontFamily}
          emphasis={{
            typed: { color: COLORS.accent, weight: 600 },
            slots: { color: COLORS.accent, weight: 600 },
            structure: { color: COLORS.accentSecondary, weight: 600 },
          }}
        >
          Typed slots in a structure you cannot fully see
        </AnimatedLine>
      </div>
    </div>
  );
};

const Blank: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      borderBottom: `3px solid ${COLORS.madLibsLine}`,
      padding: '0 20px',
      marginLeft: 4,
      marginRight: 4,
    }}
  >
    <span
      style={{
        fontSize: 14,
        color: COLORS.madLibsLine,
        fontStyle: 'italic',
      }}
    >
      ({label})
    </span>
  </span>
);

const SlotLabel: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span
    style={{
      backgroundColor: `${color}20`,
      color,
      padding: '4px 12px',
      borderRadius: 6,
      fontWeight: 500,
    }}
  >
    {children}
  </span>
);

const ConsequenceComparison: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    {
      context: 'Mad Libs',
      wrong: 'Wrong word',
      result: 'Funny',
      icon: '😂',
      color: COLORS.success,
    },
    {
      context: 'Programming',
      wrong: 'Wrong word',
      result: 'Bug / Crash',
      icon: '💥',
      color: COLORS.warning,
    },
    {
      context: 'Prompting',
      wrong: 'Wrong context',
      result: 'Hallucination / Jailbreak',
      icon: '⚠️',
      color: '#ef4444',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 40,
        justifyContent: 'center',
      }}
    >
      {items.map((item, i) => {
        const itemProgress = spring({
          frame: frame - startFrame - i * 50,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        return (
          <div
            key={item.context}
            style={{
              opacity: interpolate(itemProgress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(itemProgress, [0, 1], [30, 0])}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 28,
              backgroundColor: `${item.color}10`,
              border: `2px solid ${item.color}`,
              borderRadius: 20,
              minWidth: 240,
              gap: 12,
            }}
          >
            <span style={{ fontSize: 40 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 24,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 700,
                color: item.color,
              }}
            >
              {item.context}
            </span>
            <span
              style={{
                fontSize: 16,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                color: COLORS.textMuted,
              }}
            >
              {item.wrong}
            </span>
            <div
              style={{
                width: '100%',
                height: 1,
                backgroundColor: `${item.color}30`,
                margin: '8px 0',
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontFamily: TYPOGRAPHY.display.fontFamily,
                fontWeight: 600,
                color: COLORS.textPrimary,
              }}
            >
              = {item.result}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Section5Prompting;
