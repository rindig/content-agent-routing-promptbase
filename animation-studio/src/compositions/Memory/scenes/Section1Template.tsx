import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {
  CodeBlock,
  AbstractSyntaxTree,
  AmbientBackground,
  Vignette,
  AnimatedLine,
  CodeLayerStack,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (160 seconds = 4800 frames at 30fps)
const BEATS = {
  TEMPLATE_IN: 0,
  TEMPLATE_VISIBLE: 60,
  COMEDY_TEXT_IN: 300,
  TEMPLATE_OUT: 600,
  PIVOT_IN: 660,
  PIVOT_OUT: 750,
  CODE_IN: 750,
  CODE_TYPED: 1050,
  AST_IN: 1050,
  AST_COMPLETE: 1800,
  CODE_SHRINK: 1200,
  LAYERS_IN: 2100,
  LAYERS_EXPAND: 2700,
  COMPARISON_IN: 3300,
  FINAL_TEXT: 4200,
  SCENE_END: 4800,
};

// Animated blank slot with pulsing border
const BlankSlot: React.FC<{
  label: string;
  color: string;
  delay: number;
}> = ({ label, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.1, 1]);

  // Subtle pulse
  const pulse = Math.sin((frame - delay) / 20) * 0.15 + 1;

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 8,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          borderBottom: `3px solid ${color}`,
          minWidth: 120,
          height: 48,
          display: 'inline-block',
          boxShadow: `0 2px 20px ${color}40`,
          transform: `scaleX(${pulse})`,
        }}
      />
      <span
        style={{
          fontSize: 22,
          color: color,
          marginTop: 10,
          fontFamily: TYPOGRAPHY.code.fontFamily,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </span>
  );
};

// Diagrammatic template with staggered word animation
const DiagramTemplate: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = [
    { text: 'The', delay: 0 },
    { blank: true, label: 'adjective', color: COLORS.accent, delay: 8 },
    { text: 'dog', delay: 16 },
    { blank: true, label: 'verb', color: COLORS.success, delay: 24 },
    { text: 'over the', delay: 32 },
    { blank: true, label: 'adjective', color: COLORS.accent, delay: 40 },
    { text: 'fence.', delay: 48 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontSize: 52,
        fontFamily: TYPOGRAPHY.display.fontFamily,
        color: COLORS.text,
      }}
    >
      {words.map((item, i) => {
        if ('blank' in item && item.blank) {
          return (
            <BlankSlot
              key={i}
              label={item.label!}
              color={item.color!}
              delay={startFrame + item.delay}
            />
          );
        }

        const progress = spring({
          frame: frame - startFrame - item.delay,
          fps,
          config: { damping: 20, stiffness: 180, mass: 0.7 },
        });

        return (
          <span
            key={i}
            style={{
              opacity: interpolate(progress, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(progress, [0, 1], [15, 0])}px)`,
            }}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
};

// AST data for print("hello world")
const printASTData = {
  id: 'module',
  label: 'Module',
  type: 'root' as const,
  children: [
    {
      id: 'expr',
      label: 'Expr',
      type: 'node' as const,
      children: [
        {
          id: 'call',
          label: 'Call',
          type: 'node' as const,
          children: [
            { id: 'name', label: 'Name: print', type: 'leaf' as const },
            {
              id: 'args',
              label: 'Args',
              type: 'node' as const,
              children: [
                { id: 'const', label: '"hello world"', type: 'leaf' as const },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const Section1Template: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Template visibility
  const templateOpacity = interpolate(
    frame,
    [BEATS.TEMPLATE_IN, BEATS.TEMPLATE_VISIBLE, BEATS.TEMPLATE_OUT, BEATS.TEMPLATE_OUT + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Comedy text
  const comedyOpacity = interpolate(
    frame,
    [BEATS.COMEDY_TEXT_IN, BEATS.COMEDY_TEXT_IN + 30, BEATS.TEMPLATE_OUT, BEATS.TEMPLATE_OUT + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pivot
  const pivotOpacity = interpolate(
    frame,
    [BEATS.PIVOT_IN, BEATS.PIVOT_IN + 30, BEATS.PIVOT_OUT + 60, BEATS.PIVOT_OUT + 90],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Code positioning
  const showCode = frame >= BEATS.CODE_IN && frame < BEATS.LAYERS_IN;
  const codeScale = interpolate(
    frame,
    [BEATS.CODE_SHRINK, BEATS.CODE_SHRINK + 60],
    [1, 0.7],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const codeY = interpolate(
    frame,
    [BEATS.CODE_SHRINK, BEATS.CODE_SHRINK + 60],
    [0, -180],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const showAST = frame >= BEATS.AST_IN && frame < BEATS.LAYERS_IN;

  // Layers
  const layersProgress = spring({
    frame: frame - BEATS.LAYERS_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const showLayers = frame >= BEATS.LAYERS_IN && frame < BEATS.COMPARISON_IN;

  // Comparison
  const showComparison = frame >= BEATS.COMPARISON_IN;
  const comparisonProgress = spring({
    frame: frame - BEATS.COMPARISON_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const showFinalText = frame >= BEATS.FINAL_TEXT;

  return (
    <AbsoluteFill>
      <AmbientBackground
        color={COLORS.background}
        particleCount={20}
        particleColor={COLORS.accentSecondary}
        gradientDirection="radial"
        gradientColor="#0f0a18"
      />
      <Vignette intensity={0.35} />

      {/* Beat 1-2: Template + comedy */}
      {frame < BEATS.PIVOT_OUT && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: templateOpacity,
          }}
        >
          <DiagramTemplate startFrame={BEATS.TEMPLATE_IN + 30} />

          {/* Comedy explanation with AnimatedLine */}
          <div style={{ marginTop: 80, opacity: comedyOpacity, maxWidth: 1000 }}>
            <AnimatedLine
              startFrame={BEATS.COMEDY_TEXT_IN}
              wordDelay={3}
              fontSize={42}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                syntactically: { color: COLORS.accent, weight: 600 },
                correct: { color: COLORS.accent, weight: 600 },
                semantic: { color: COLORS.warning, weight: 600 },
                sense: { color: COLORS.warning, weight: 600 },
              }}
            >
              The comedy works because any syntactically correct input fills the slot regardless of whether it makes semantic sense
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 3: Pivot */}
      {frame >= BEATS.PIVOT_IN && frame < BEATS.CODE_IN + 30 && (
        <AbsoluteFill
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: pivotOpacity,
            padding: '8%',
          }}
        >
          <AnimatedLine
            startFrame={BEATS.PIVOT_IN}
            wordDelay={4}
            fontSize={56}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              reframe: { color: COLORS.accent, weight: 700, glow: true },
              software: { color: COLORS.accentSecondary, weight: 600 },
            }}
          >
            Now here is something that might reframe how you think about software
          </AnimatedLine>
        </AbsoluteFill>
      )}

      {/* Beat 4-5: Code + AST */}
      {showCode && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '5%',
          }}
        >
          <div
            style={{
              transform: `scale(${codeScale}) translateY(${codeY}px)`,
              marginTop: 80,
            }}
          >
            <CodeBlock
              code='print("hello world")'
              language="python"
              typewriter={true}
              typewriterDelay={3}
              startFrame={BEATS.CODE_IN}
              fontSize={44}
            />
          </div>

          {showAST && (
            <div style={{ marginTop: 60, width: '85%', maxWidth: 850 }}>
              <AbstractSyntaxTree
                data={printASTData}
                startFrame={BEATS.AST_IN}
                staggerDelay={10}
              />
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Beat 6: Layers - Code visualization */}
      {showLayers && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '5%',
            opacity: interpolate(layersProgress, [0, 1], [0, 1]),
          }}
        >
          <AnimatedLine
            startFrame={BEATS.LAYERS_IN}
            wordDelay={4}
            fontSize={44}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              another: { color: COLORS.accentSecondary, weight: 600 },
              template: { color: COLORS.accentSecondary, weight: 600 },
            }}
            style={{ marginBottom: 50 }}
          >
            This tree gets filled into another template at the next layer down
          </AnimatedLine>

          {/* Code layer stack with actual code snippets */}
          <CodeLayerStack startFrame={BEATS.LAYERS_IN + 50} />

          <div style={{ marginTop: 50 }}>
            <AnimatedLine
              startFrame={BEATS.LAYERS_IN + 150}
              wordDelay={5}
              fontSize={36}
              color={COLORS.textMuted}
              fontFamily={TYPOGRAPHY.body.fontFamily}
              emphasis={{
                Typed: { color: COLORS.accent, weight: 500 },
                slots: { color: COLORS.accent, weight: 500 },
              }}
            >
              Typed slots all the way down
            </AnimatedLine>
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 7: Comparison + Final */}
      {showComparison && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '8%',
            opacity: interpolate(comparisonProgress, [0, 1], [0, 1]),
          }}
        >
          {!showFinalText ? (
            <>
              <div style={{ display: 'flex', gap: 100, alignItems: 'center' }}>
                {/* Mad Libs side */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 30,
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      color: COLORS.accent,
                      marginBottom: 24,
                      fontWeight: 600,
                    }}
                  >
                    Mad Libs
                  </div>
                  <div
                    style={{
                      backgroundColor: COLORS.madLibsPaper,
                      padding: '28px 40px',
                      borderRadius: 10,
                      fontSize: 28,
                      fontFamily: TYPOGRAPHY.handwritten.fontFamily,
                      color: COLORS.madLibsText,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    }}
                  >
                    The <span style={{ borderBottom: '3px solid #d97706', paddingBottom: 2 }}>______</span> dog
                  </div>
                </div>

                <div style={{ fontSize: 72, color: COLORS.textMuted }}>≈</div>

                {/* AST side */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 30,
                      fontFamily: TYPOGRAPHY.body.fontFamily,
                      color: COLORS.accentSecondary,
                      marginBottom: 24,
                      fontWeight: 600,
                    }}
                  >
                    Abstract Syntax Tree
                  </div>
                  <div
                    style={{
                      backgroundColor: COLORS.code,
                      padding: '28px 40px',
                      borderRadius: 10,
                      fontSize: 28,
                      fontFamily: TYPOGRAPHY.code.fontFamily,
                      color: COLORS.text,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    Call( <span style={{ color: '#61afef', borderBottom: '2px dashed #61afef' }}>______</span> )
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 70 }}>
                <AnimatedLine
                  startFrame={BEATS.COMPARISON_IN + 30}
                  wordDelay={4}
                  fontSize={36}
                  color={COLORS.textMuted}
                  emphasis={{
                    typed: { color: COLORS.accent, weight: 500 },
                    slots: { color: COLORS.accent, weight: 500 },
                    compose: { color: COLORS.accentSecondary, weight: 500 },
                  }}
                >
                  Both have typed slots Both compose into larger structures
                </AnimatedLine>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', maxWidth: 1100 }}>
              <AnimatedLine
                startFrame={BEATS.FINAL_TEXT}
                wordDelay={5}
                fontSize={52}
                color={COLORS.textPrimary}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  metaphor: { color: COLORS.textMuted, weight: 400 },
                }}
              >
                Mad Libs is not a metaphor for programming
              </AnimatedLine>

              <div style={{ marginTop: 40 }}>
                <AnimatedLine
                  startFrame={BEATS.FINAL_TEXT + 60}
                  wordDelay={5}
                  fontSize={60}
                  color={COLORS.accent}
                  fontFamily={TYPOGRAPHY.display.fontFamily}
                  emphasis={{
                    structural: { color: COLORS.accent, weight: 700, glow: true },
                    level: { color: COLORS.accent, weight: 700, glow: true },
                    programming: { color: COLORS.accentSecondary, weight: 700, glow: true },
                    is: { weight: 700 },
                  }}
                  style={{ fontWeight: 600 }}
                >
                  It is at a structural level what programming is
                </AnimatedLine>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Section1Template;
