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
  AbstractionStack,
  QuoteCard,
} from '../components';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../constants';

// Timeline markers (45 seconds = 1350 frames at 30fps)
const BEATS = {
  // Beat 1: Abstraction Stack builds [0-450 frames]
  STACK_START: 0,
  STACK_BUILD: 60,

  // Beat 2: Grace Hopper Quote [450-900 frames]
  QUOTE_START: 450,
  QUOTE_VISIBLE: 550,

  // Beat 3: Final Thesis [900-1200 frames]
  THESIS_START: 900,
  THESIS_REVEAL: 1000,

  // Beat 4: Closing Statement [1200-1350 frames]
  CLOSE_START: 1200,
  FADE_OUT: 1300,

  SCENE_END: 1350,
};

export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase visibility
  const showStack = frame < BEATS.QUOTE_START + 150;
  const showQuote = frame >= BEATS.QUOTE_START && frame < BEATS.THESIS_START;
  const showThesis = frame >= BEATS.THESIS_START && frame < BEATS.CLOSE_START;
  const showClose = frame >= BEATS.CLOSE_START;

  // Transition opacities
  const stackOpacity = interpolate(
    frame,
    [BEATS.STACK_START, BEATS.STACK_BUILD, BEATS.QUOTE_START - 60, BEATS.QUOTE_START + 100],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const quoteOpacity = interpolate(
    frame,
    [BEATS.QUOTE_START, BEATS.QUOTE_VISIBLE, BEATS.THESIS_START - 60, BEATS.THESIS_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const thesisOpacity = interpolate(
    frame,
    [BEATS.THESIS_START, BEATS.THESIS_REVEAL, BEATS.CLOSE_START - 30, BEATS.CLOSE_START],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const closeOpacity = interpolate(
    frame,
    [BEATS.CLOSE_START, BEATS.CLOSE_START + 60, BEATS.FADE_OUT, BEATS.SCENE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Background pulse for finale
  const bgPulse = frame >= BEATS.CLOSE_START
    ? 1 + Math.sin((frame - BEATS.CLOSE_START) * 0.05) * 0.02
    : 1;

  return (
    <AbsoluteFill>
      {/* Subtle gradient background shifting through accents */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse at 30% 70%, ${COLORS.accentSecondary}15 0%, transparent 50%),
            radial-gradient(ellipse at 70% 30%, ${COLORS.accent}15 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, #1a1a2a 0%, ${COLORS.background} 70%)
          `,
          transform: `scale(${bgPulse})`,
        }}
      />
      <AmbientBackground
        color="transparent"
        particleCount={30}
        particleColor={COLORS.accentSecondary}
        gradientDirection="none"
      />
      <Vignette intensity={0.5} />

      {/* Beat 1: Abstraction Stack */}
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
            fontSize={40}
            color={COLORS.textPrimary}
            fontFamily={TYPOGRAPHY.display.fontFamily}
            emphasis={{
              complete: { color: COLORS.accent, weight: 700 },
              stack: { color: COLORS.accent, weight: 700 },
            }}
            style={{ marginBottom: 30 }}
          >
            The complete stack
          </AnimatedLine>

          <AbstractionStack
            startFrame={BEATS.STACK_BUILD}
            layerDelay={15}
            buildUp={true}
            showConstruction={true}
            scale={0.75}
          />
        </AbsoluteFill>
      )}

      {/* Beat 2: Grace Hopper Quote */}
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
            quote="The most dangerous phrase in the language is 'we've always done it this way.'"
            attribution="Grace Hopper"
            startFrame={BEATS.QUOTE_START}
            wordDelay={5}
            accentColor={COLORS.warning}
          />
        </AbsoluteFill>
      )}

      {/* Beat 3: Final Thesis */}
      {showThesis && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10%',
            opacity: thesisOpacity,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 1000 }}>
            <AnimatedLine
              startFrame={BEATS.THESIS_START}
              wordDelay={5}
              fontSize={48}
              color={COLORS.textPrimary}
              fontFamily={TYPOGRAPHY.display.fontFamily}
              emphasis={{
                Build: { color: COLORS.accent, weight: 700 },
                infrastructure: { color: COLORS.accent, weight: 700 },
              }}
            >
              Build the infrastructure
            </AnimatedLine>

            <div style={{ marginTop: 30 }}>
              <AnimatedLine
                startFrame={BEATS.THESIS_START + 60}
                wordDelay={5}
                fontSize={48}
                color={COLORS.textPrimary}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  Do: { color: COLORS.success, weight: 700 },
                  engineering: { color: COLORS.success, weight: 700 },
                }}
              >
                Do the engineering
              </AnimatedLine>
            </div>

            <div style={{ marginTop: 30 }}>
              <AnimatedLine
                startFrame={BEATS.THESIS_START + 120}
                wordDelay={5}
                fontSize={48}
                color={COLORS.textPrimary}
                fontFamily={TYPOGRAPHY.display.fontFamily}
                emphasis={{
                  Make: { color: COLORS.warning, weight: 700 },
                  unreliable: { color: '#ef4444', weight: 600 },
                  reliable: { color: COLORS.success, weight: 700 },
                  trust: { color: COLORS.success, weight: 600 },
                }}
              >
                Make the unreliable thing reliable enough to trust
              </AnimatedLine>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Beat 4: Closing Statement */}
      {showClose && (
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: closeOpacity,
          }}
        >
          <FinalStatement startFrame={BEATS.CLOSE_START} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const FinalStatement: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 30, stiffness: 80, mass: 1.5 },
  });

  // Glow pulse effect
  const glowIntensity = 20 + Math.sin((frame - startFrame) * 0.1) * 10;

  return (
    <div
      style={{
        textAlign: 'center',
        opacity: interpolate(textProgress, [0, 1], [0, 1]),
        transform: `scale(${interpolate(textProgress, [0, 1], [0.9, 1])})`,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.accent,
          textShadow: `
            0 0 ${glowIntensity}px ${COLORS.accent}60,
            0 0 ${glowIntensity * 2}px ${COLORS.accent}30
          `,
          letterSpacing: '-0.02em',
        }}
      >
        It's the next layer
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 72,
          fontFamily: TYPOGRAPHY.display.fontFamily,
          fontWeight: 700,
          color: COLORS.textPrimary,
        }}
      >
        of the stack.
      </div>

      {/* Subtle stack indicator */}
      <div
        style={{
          marginTop: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: interpolate(
            spring({
              frame: frame - startFrame - 30,
              fps,
              config: SPRING_CONFIGS.gentle,
            }),
            [0, 1],
            [0, 0.5]
          ),
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 80 + i * 20,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === 4 ? COLORS.accent : `${COLORS.textMuted}30`,
              boxShadow: i === 4 ? `0 0 15px ${COLORS.accent}50` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Close;
