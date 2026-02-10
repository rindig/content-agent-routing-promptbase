import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  ContextWindowDiagram,
  PromptAssemblyStream,
  AmbientBackground,
  Vignette,
  AnimatedLine,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (210 seconds = 6300 frames at 30fps)
const BEATS = {
  // Beat 1: Context window diagram appears
  DIAGRAM_IN: 0,
  DIAGRAM_VISIBLE: 60,

  // Beat 2: Model weights
  WEIGHTS_START: 450,
  WEIGHTS_END: 900,

  // Beat 3: Context window layer
  CONTEXT_START: 900,
  CONTEXT_END: 1500,

  // Beat 4: System prompt
  SYSTEM_START: 1500,
  SYSTEM_END: 2100,

  // Beat 5: Retrieved context
  RETRIEVED_START: 2100,
  RETRIEVED_END: 2700,

  // Beat 6: Persistent memory
  MEMORY_START: 2700,
  MEMORY_END: 3300,

  // Beat 7: Hierarchy comparison
  COMPARISON_START: 3300,
  COMPARISON_END: 3900,

  // Beat 8: THE KEY INSIGHT - Code/Data merge
  MERGE_START: 3900,
  MERGE_ANIMATE: 4500,
  MERGE_COMPLETE: 5100,
  MERGE_END: 5400,

  // Beat 9: Why this matters
  MATTERS_START: 5400,
  MATTERS_END: 6000,

  // Beat 10: Prompt injection
  INJECTION_START: 6000,
  SCENE_END: 6300,
};

type LayerId = 'weights' | 'system' | 'retrieved' | 'memory' | 'user';

export const Section3AIMemory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which layer to highlight based on frame
  const getHighlightedLayer = (): LayerId | undefined => {
    if (frame >= BEATS.WEIGHTS_START && frame < BEATS.CONTEXT_START) return 'weights';
    if (frame >= BEATS.SYSTEM_START && frame < BEATS.RETRIEVED_START) return 'system';
    if (frame >= BEATS.RETRIEVED_START && frame < BEATS.MEMORY_START) return 'retrieved';
    if (frame >= BEATS.MEMORY_START && frame < BEATS.COMPARISON_START) return 'memory';
    return undefined;
  };

  const highlightedLayer = getHighlightedLayer();

  // Section visibility
  const showDiagram = frame >= BEATS.DIAGRAM_IN && frame < BEATS.MERGE_START;
  const showContextIntro = frame >= BEATS.CONTEXT_START && frame < BEATS.SYSTEM_START;
  const showComparison = frame >= BEATS.COMPARISON_START && frame < BEATS.MERGE_START;
  const showMerge = frame >= BEATS.MERGE_START && frame < BEATS.MATTERS_START;
  const showMatters = frame >= BEATS.MATTERS_START && frame < BEATS.INJECTION_START;
  const showInjection = frame >= BEATS.INJECTION_START;

  // Diagram opacity
  const diagramOpacity = interpolate(
    frame,
    [BEATS.DIAGRAM_IN, BEATS.DIAGRAM_VISIBLE, BEATS.MERGE_START - 30, BEATS.MERGE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Merge animation
  const mergeProgress = spring({
    frame: frame - BEATS.MERGE_START,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  // Comparison opacity
  const comparisonOpacity = spring({
    frame: frame - BEATS.COMPARISON_START,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <AbsoluteFill>
      <AmbientBackground
        color={COLORS.background}
        particleCount={20}
        particleColor="#8b5cf6"
        gradientDirection="radial"
        gradientColor="#0f0818"
      />
      <Vignette intensity={0.4} />

      {/* Introduction text */}
      {frame < BEATS.WEIGHTS_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: '8%',
            opacity: diagramOpacity,
          }}
        >
          <AnimatedLine
            startFrame={BEATS.DIAGRAM_IN + 30}
            wordDelay={4}
            fontSize={52}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              AI: { color: COLORS.accent, weight: 700 },
              memory: { color: COLORS.accent, weight: 600 },
              hierarchy: { color: COLORS.accentSecondary, weight: 600 },
            }}
            style={{ marginBottom: 60 }}
          >
            The AI memory hierarchy looks different
          </AnimatedLine>

          <ContextWindowDiagram
            startFrame={BEATS.DIAGRAM_IN + 60}
            showAllLayers={true}
          />
        </AbsoluteFill>
      )}

      {/* Layer detail views - Model Weights */}
      {frame >= BEATS.WEIGHTS_START && frame < BEATS.CONTEXT_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedLine
              startFrame={BEATS.WEIGHTS_START}
              wordDelay={4}
              fontSize={44}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                weights: { color: '#6366f1', weight: 700 },
                ROM: { color: '#6366f1', weight: 600 },
                firmware: { color: '#6366f1', weight: 600 },
              }}
            >
              Model weights are the closest analogue to ROM or firmware
            </AnimatedLine>
          </div>

          <ContextWindowDiagram
            startFrame={BEATS.WEIGHTS_START + 30}
            highlightLayer="weights"
            showAllLayers={true}
          />

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.WEIGHTS_START + 90}
              wordDelay={5}
              fontSize={32}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                fixed: { color: '#ef4444', weight: 500 },
                training: { color: '#ef4444', weight: 500 },
              }}
            >
              Fixed at training time and cannot change during inference
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Context Window intro */}
      {showContextIntro && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedLine
              startFrame={BEATS.CONTEXT_START}
              wordDelay={4}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                context: { color: '#06b6d4', weight: 700 },
                window: { color: '#06b6d4', weight: 700 },
                working: { color: '#f59e0b', weight: 600 },
                memory: { color: '#f59e0b', weight: 600 },
              }}
            >
              The context window is working memory
            </AnimatedLine>
          </div>

          <LayerDetailPanel
            color="#06b6d4"
            title="Context Window"
            stats="~128k tokens"
            description="Temporary space that exists only for this interaction"
            example={[
              'System prompt',
              'Conversation history',
              'Retrieved documents',
              'User input',
            ]}
            startFrame={BEATS.CONTEXT_START + 30}
          />

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.CONTEXT_START + 120}
              wordDelay={5}
              fontSize={28}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                ephemeral: { color: '#f59e0b', weight: 500 },
              }}
            >
              Ephemeral by design - wiped clean after each conversation
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* System Prompt */}
      {frame >= BEATS.SYSTEM_START && frame < BEATS.RETRIEVED_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedLine
              startFrame={BEATS.SYSTEM_START}
              wordDelay={4}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                System: { color: '#8b5cf6', weight: 700 },
                prompt: { color: '#8b5cf6', weight: 700 },
                firmware: { color: '#8b5cf6', weight: 600 },
              }}
            >
              The system prompt functions like firmware
            </AnimatedLine>
          </div>

          <ContextWindowDiagram
            startFrame={BEATS.SYSTEM_START + 30}
            highlightLayer="system"
            showAllLayers={true}
          />

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.SYSTEM_START + 90}
              wordDelay={5}
              fontSize={28}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                operating: { color: '#8b5cf6', weight: 500 },
                parameters: { color: '#8b5cf6', weight: 500 },
              }}
            >
              Sets operating parameters that users typically don't see
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Retrieved Context */}
      {frame >= BEATS.RETRIEVED_START && frame < BEATS.MEMORY_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedLine
              startFrame={BEATS.RETRIEVED_START}
              wordDelay={4}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Retrieved: { color: '#06b6d4', weight: 700 },
                context: { color: '#06b6d4', weight: 700 },
                loaded: { color: '#10b981', weight: 600 },
                dynamically: { color: '#10b981', weight: 600 },
              }}
            >
              Retrieved context is loaded dynamically
            </AnimatedLine>
          </div>

          <ContextWindowDiagram
            startFrame={BEATS.RETRIEVED_START + 30}
            highlightLayer="retrieved"
            showAllLayers={true}
          />

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.RETRIEVED_START + 90}
              wordDelay={5}
              fontSize={28}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                loading: { color: '#06b6d4', weight: 500 },
                disk: { color: '#06b6d4', weight: 500 },
                RAM: { color: '#06b6d4', weight: 500 },
              }}
            >
              Like loading from disk into RAM - vector databases, documents, APIs
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Persistent Memory */}
      {frame >= BEATS.MEMORY_START && frame < BEATS.COMPARISON_START && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedLine
              startFrame={BEATS.MEMORY_START}
              wordDelay={4}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Persistent: { color: '#10b981', weight: 700 },
                memory: { color: '#10b981', weight: 700 },
                conversations: { color: '#10b981', weight: 600 },
              }}
            >
              Persistent memory spans between conversations
            </AnimatedLine>
          </div>

          <ContextWindowDiagram
            startFrame={BEATS.MEMORY_START + 30}
            highlightLayer="memory"
            showAllLayers={true}
          />

          <div style={{ marginTop: 40 }}>
            <AnimatedLine
              startFrame={BEATS.MEMORY_START + 90}
              wordDelay={5}
              fontSize={28}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                selectively: { color: '#10b981', weight: 500 },
                loaded: { color: '#10b981', weight: 500 },
              }}
            >
              Selectively loaded based on relevance - like user profile storage
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Hierarchy Comparison */}
      {showComparison && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '6%',
            opacity: interpolate(comparisonOpacity, [0, 1], [0, 1]),
          }}
        >
          <AnimatedLine
            startFrame={BEATS.COMPARISON_START}
            wordDelay={5}
            fontSize={44}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              squint: { color: COLORS.warning, weight: 600 },
              same: { color: COLORS.accent, weight: 600 },
              tradeoffs: { color: COLORS.accent, weight: 600 },
            }}
            style={{ marginBottom: 50, maxWidth: 900, textAlign: 'center' }}
          >
            If you squint this looks familiar - same speed capacity tradeoffs
          </AnimatedLine>

          {/* Side by side comparison */}
          <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start' }}>
            {/* Traditional */}
            <ComparisonColumn
              title="Traditional"
              color="#22c55e"
              items={[
                { label: 'Registers', sub: 'fastest, tiny' },
                { label: 'Cache', sub: 'fast, small' },
                { label: 'RAM', sub: 'medium, larger' },
                { label: 'Disk', sub: 'slow, huge' },
              ]}
              startFrame={BEATS.COMPARISON_START + 30}
            />

            <div
              style={{
                fontSize: 64,
                color: COLORS.textMuted,
                alignSelf: 'center',
                opacity: 0.5,
              }}
            >
              ≈
            </div>

            {/* AI */}
            <ComparisonColumn
              title="AI / LLM"
              color="#8b5cf6"
              items={[
                { label: 'Weights', sub: 'fixed, compressed' },
                { label: 'Context', sub: 'fast, limited' },
                { label: 'Retrieved', sub: 'dynamic, selective' },
                { label: 'Memory', sub: 'persistent, slow' },
              ]}
              startFrame={BEATS.COMPARISON_START + 60}
            />
          </div>

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.COMPARISON_START + 150}
              wordDelay={5}
              fontSize={28}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
            >
              Both hierarchies balance speed against capacity
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* THE KEY INSIGHT - Code/Data Merge */}
      {showMerge && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          {/* Title - fades out when merge starts */}
          <div
            style={{
              opacity: interpolate(
                frame,
                [BEATS.MERGE_START, BEATS.MERGE_START + 30, BEATS.MERGE_ANIMATE - 30, BEATS.MERGE_ANIMATE],
                [0, 1, 1, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
              marginBottom: 30,
              position: 'absolute',
              top: '12%',
            }}
          >
            <AnimatedLine
              startFrame={BEATS.MERGE_START}
              wordDelay={5}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                key: { color: COLORS.warning, weight: 700 },
                difference: { color: COLORS.warning, weight: 700 },
              }}
            >
              But here is the key difference
            </AnimatedLine>
          </div>

          {/* Streams → Merged panel (all handled by one component) */}
          <PromptAssemblyStream
            startFrame={BEATS.MERGE_START + 60}
            showMerge={frame >= BEATS.MERGE_ANIMATE}
            mergeFrame={BEATS.MERGE_ANIMATE}
          />

          {/* Key insight text - appears after merge */}
          <div
            style={{
              position: 'absolute',
              bottom: '12%',
              opacity: interpolate(
                frame,
                [BEATS.MERGE_COMPLETE - 30, BEATS.MERGE_COMPLETE + 30],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            <AnimatedLine
              startFrame={BEATS.MERGE_COMPLETE}
              wordDelay={6}
              fontSize={44}
              color={COLORS.accent}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                code: { color: '#c678dd', weight: 700, glow: true },
                data: { color: '#98c379', weight: 700, glow: true },
                same: { color: COLORS.warning, weight: 700, glow: true },
                thing: { color: COLORS.warning, weight: 700, glow: true },
              }}
            >
              In this system code and data are the same thing
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Why This Matters */}
      {showMatters && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
          }}
        >
          <MergedStreamVisualization startFrame={BEATS.MATTERS_START} />

          <div style={{ marginTop: 50, maxWidth: 1000, textAlign: 'center' }}>
            <AnimatedLine
              startFrame={BEATS.MATTERS_START + 30}
              wordDelay={5}
              fontSize={40}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                instruction: { color: '#8b5cf6', weight: 600 },
                context: { color: '#06b6d4', weight: 600 },
                Reading: { color: COLORS.accent, weight: 700 },
                execution: { color: COLORS.accent, weight: 700, glow: true },
              }}
            >
              The instruction becomes part of the context
            </AnimatedLine>

            <div style={{ marginTop: 30 }}>
              <AnimatedLine
                startFrame={BEATS.MATTERS_START + 90}
                wordDelay={6}
                fontSize={52}
                color={COLORS.accent}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  Reading: { color: COLORS.accent, weight: 700, glow: true },
                  is: { weight: 600 },
                  execution: { color: COLORS.accent, weight: 700, glow: true },
                }}
              >
                Reading it is the execution
              </AnimatedLine>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Prompt Injection */}
      {showInjection && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
          }}
        >
          <PromptInjectionVisualization startFrame={BEATS.INJECTION_START} />

          <div style={{ marginTop: 50, maxWidth: 900, textAlign: 'center' }}>
            <AnimatedLine
              startFrame={BEATS.INJECTION_START + 60}
              wordDelay={5}
              fontSize={36}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                not: { color: COLORS.textPrimary, weight: 600 },
                bug: { color: COLORS.textPrimary, weight: 600 },
                architecture: { color: COLORS.accent, weight: 600 },
              }}
            >
              This is not a bug - it is the architecture
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// Helper component: Layer detail panel
const LayerDetailPanel: React.FC<{
  color: string;
  title: string;
  stats: string;
  description: string;
  example: string[];
  startFrame: number;
}> = ({ color, title, stats, description, example, startFrame }) => {
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
        display: 'flex',
        gap: 50,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 16,
          padding: 30,
          border: `2px solid ${color}40`,
          minWidth: 400,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontFamily: TYPOGRAPHY.display.fontFamily,
            fontWeight: 700,
            color: color,
            marginBottom: 8,
          }}
        >
          {title}
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.textMuted,
              marginLeft: 12,
            }}
          >
            {stats}
          </span>
        </div>
        <div
          style={{
            fontSize: 20,
            fontFamily: TYPOGRAPHY.body.fontFamily,
            color: COLORS.textMuted,
            marginBottom: 20,
          }}
        >
          {description}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {example.map((item, i) => {
            const itemDelay = startFrame + 20 + i * 8;
            const itemProgress = spring({
              frame: frame - itemDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                  transform: `translateX(${interpolate(itemProgress, [0, 1], [-15, 0])}px)`,
                  padding: '8px 16px',
                  backgroundColor: `${color}15`,
                  borderRadius: 6,
                  borderLeft: `3px solid ${color}`,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  fontSize: 16,
                  color: COLORS.text,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper component: Comparison column
const ComparisonColumn: React.FC<{
  title: string;
  color: string;
  items: Array<{ label: string; sub: string }>;
  startFrame: number;
}> = ({ title, color, items, startFrame }) => {
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
        transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: color,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {title}
      </div>

      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 20,
          border: `2px solid ${color}30`,
          minWidth: 280,
        }}
      >
        {items.map((item, i) => {
          const itemDelay = startFrame + 30 + i * 10;
          const itemProgress = spring({
            frame: frame - itemDelay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={i}
              style={{
                opacity: interpolate(itemProgress, [0, 1], [0, 1]),
                padding: '12px 16px',
                borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontFamily: TYPOGRAPHY.display.fontFamily,
                  fontWeight: 500,
                  color: COLORS.text,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontFamily: TYPOGRAPHY.code.fontFamily,
                  color: COLORS.textMuted,
                  marginTop: 4,
                }}
              >
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper component: Merged stream visualization
const MergedStreamVisualization: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const lines = [
    { text: 'You are a helpful assistant.', source: 'system' },
    { text: 'Always respond in JSON format.', source: 'system' },
    { text: '// Retrieved from database', source: 'retrieved' },
    { text: 'API Reference: POST /users', source: 'retrieved' },
    { text: 'User prefers: dark mode', source: 'memory' },
    { text: '"Help me write a function..."', source: 'user' },
  ];

  const sourceColors: Record<string, string> = {
    system: '#8b5cf6',
    retrieved: '#06b6d4',
    memory: '#10b981',
    user: '#f59e0b',
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.code,
        borderRadius: 16,
        padding: 30,
        border: `2px solid ${COLORS.accent}40`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        maxWidth: 700,
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 600,
          color: COLORS.accent,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span>📝</span> Single Unified Text Stream
      </div>

      {lines.map((line, i) => {
        const lineDelay = startFrame + 20 + i * 8;
        const lineProgress = spring({
          frame: frame - lineDelay,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        return (
          <div
            key={i}
            style={{
              opacity: interpolate(lineProgress, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(lineProgress, [0, 1], [10, 0])}px)`,
              padding: '8px 12px',
              marginBottom: 6,
              borderLeft: `3px solid ${sourceColors[line.source]}`,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontSize: 18,
              color: COLORS.text,
              backgroundColor: `${sourceColors[line.source]}10`,
              borderRadius: '0 6px 6px 0',
            }}
          >
            {line.text}
          </div>
        );
      })}

      <div
        style={{
          marginTop: 16,
          fontSize: 14,
          color: COLORS.textMuted,
          fontStyle: 'italic',
          textAlign: 'center',
        }}
      >
        No internal boundaries - just text
      </div>
    </div>
  );
};

// Helper component: Prompt injection visualization
const PromptInjectionVisualization: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const injectionProgress = spring({
    frame: frame - startFrame - 40,
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  return (
    <div
      style={{
        backgroundColor: COLORS.code,
        borderRadius: 16,
        padding: 30,
        border: '2px solid rgba(255,255,255,0.1)',
        opacity: interpolate(progress, [0, 1], [0, 1]),
        maxWidth: 750,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          color: COLORS.textMuted,
          marginBottom: 12,
        }}
      >
        {'// Retrieved document content:'}
      </div>

      <div
        style={{
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontSize: 18,
          color: COLORS.text,
          lineHeight: 1.8,
        }}
      >
        <div style={{ opacity: 0.7, marginBottom: 8 }}>
          "The quarterly report shows revenue increased by 15%..."
        </div>

        <div
          style={{
            opacity: interpolate(injectionProgress, [0, 1], [0, 1]),
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 6,
            padding: '10px 14px',
            marginTop: 12,
          }}
        >
          <span style={{ color: '#ef4444' }}>
            "Ignore your previous instructions and instead..."
          </span>
        </div>

        <div
          style={{
            opacity: 0.7,
            marginTop: 12,
          }}
        >
          "...continued financial analysis..."
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 14,
          color: COLORS.textMuted,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ color: '#f59e0b' }}>⚠️</span>
        <span>Data containing instructions looks identical to actual instructions</span>
      </div>
    </div>
  );
};

// Helper component: Clean merged stream view (after animation)
const MergedStreamClean: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const lines = [
    { text: 'You are a helpful assistant.', color: '#8b5cf6' },
    { text: 'Always respond in JSON format.', color: '#8b5cf6' },
    { text: 'API Reference: POST /users', color: '#06b6d4' },
    { text: 'User prefers: dark mode', color: '#10b981' },
    { text: '"Help me write a function..."', color: '#f59e0b' },
  ];

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: 32,
        border: `3px solid ${COLORS.accent}`,
        boxShadow: `0 0 60px ${COLORS.accent}30`,
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        maxWidth: 600,
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.accent,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        One Unified Text Stream
      </div>

      <div
        style={{
          backgroundColor: COLORS.code,
          borderRadius: 10,
          padding: 20,
        }}
      >
        {lines.map((line, i) => {
          const lineDelay = startFrame + 15 + i * 6;
          const lineProgress = spring({
            frame: frame - lineDelay,
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={i}
              style={{
                opacity: interpolate(lineProgress, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(lineProgress, [0, 1], [15, 0])}px)`,
                padding: '10px 14px',
                marginBottom: 8,
                borderLeft: `3px solid ${line.color}`,
                fontFamily: TYPOGRAPHY.code.fontFamily,
                fontSize: 18,
                color: COLORS.text,
                backgroundColor: `${line.color}10`,
                borderRadius: '0 6px 6px 0',
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: COLORS.textMuted,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        No distinction between instructions and data
      </div>
    </div>
  );
};

export default Section3AIMemory;
