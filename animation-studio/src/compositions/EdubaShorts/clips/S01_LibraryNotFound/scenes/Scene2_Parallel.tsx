import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SceneContainer, AnimatedText } from '../../../../../components/core';
import { GlitchText, GradientText, ShinyText } from '../../../../../components/core/effects';
import { SplitScreen } from '../../../components';
import { COLORS, SPRING_CONFIGS } from '../../../constants';

const BEATS = {
  SCENE_FADE_IN: 0,
  TITLE_IN: 5,
  TITLE_DIM: 25,
  SPLIT_SCREEN_IN: 25,
  TOP_CODE_IN: 30,
  TOP_ARROW_1: 40,
  TOP_COMPILER_LABEL: 42,
  TOP_ARROW_2: 50,
  TOP_OUTPUT_IN: 55,
  TOP_GLITCH_START: 58,
  BOTTOM_CODE_IN: 45,
  BOTTOM_ARROW_1: 55,
  BOTTOM_AI_LABEL: 57,
  BOTTOM_ARROW_2: 65,
  BOTTOM_OUTPUT_IN: 70,
  BOTTOM_GLITCH_START: 75,
  BOTH_VISIBLE: 90,
  CONNECTOR_LINE: 90,
  HOLD_START: 130,
  BRIDGE_TEXT_IN: 170,
  FADE_OUT_START: 195,
};

/** SVG arrow that draws in via stroke-dashoffset */
const AnimatedArrow: React.FC<{
  startFrame: number;
  color: string;
  width?: number;
}> = ({ startFrame, color, width = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: SPRING_CONFIGS.gentle,
  });

  const dashOffset = interpolate(progress, [0, 1], [width + 20, 0]);
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <svg
      width={width}
      height={24}
      style={{ opacity, flexShrink: 0 }}
    >
      <line
        x1={0}
        y1={12}
        x2={width - 10}
        y2={12}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={width + 20}
        strokeDashoffset={dashOffset}
      />
      <polygon
        points={`${width - 10},6 ${width},12 ${width - 10},18`}
        fill={color}
        opacity={interpolate(progress, [0.7, 1], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />
    </svg>
  );
};

/** Flow row: code -> arrow -> label -> arrow -> output */
const FlowRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      flexWrap: 'wrap',
      width: '100%',
    }}
  >
    {children}
  </div>
);

/** Top panel: 1952 compiler flow */
const CompilerFlow: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <FlowRow>
        <AnimatedText
          variant="code"
          size={28}
          color={COLORS.historyGold}
          entrance="fade"
          startFrame={BEATS.TOP_CODE_IN}
        >
          {'"COMPUTE X + Y"'}
        </AnimatedText>
      </FlowRow>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <AnimatedArrow startFrame={BEATS.TOP_ARROW_1} color={COLORS.historyGold} width={50} />
        <AnimatedText
          variant="label"
          size={24}
          color="muted"
          entrance="fade"
          startFrame={BEATS.TOP_COMPILER_LABEL}
        >
          COMPILER
        </AnimatedText>
        <AnimatedArrow startFrame={BEATS.TOP_ARROW_2} color={COLORS.historyGold} width={50} />
      </div>

      <FlowRow>
        <AnimatedText
          variant="code"
          size={28}
          color={COLORS.textBody}
          entrance="fade"
          startFrame={BEATS.TOP_OUTPUT_IN}
        >
          {'01001 '}
        </AnimatedText>
        {frame >= BEATS.TOP_GLITCH_START && (
          <GlitchText
            startFrame={BEATS.TOP_GLITCH_START}
            intensity={0.6}
            speed={4}
            color={COLORS.errorRed}
            fontSize={28}
            fontFamily="JetBrains Mono, Fira Code, Consolas, monospace"
            fontWeight={400}
          >
            ???
          </GlitchText>
        )}
      </FlowRow>
    </div>
  );
};

/** Bottom panel: 2026 AI flow */
const AIFlow: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
      <FlowRow>
        <AnimatedText
          variant="code"
          size={28}
          color={COLORS.techBlue}
          entrance="fade"
          startFrame={BEATS.BOTTOM_CODE_IN}
        >
          {'"parse this CSV"'}
        </AnimatedText>
      </FlowRow>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <AnimatedArrow startFrame={BEATS.BOTTOM_ARROW_1} color={COLORS.techBlue} width={50} />
        <GradientText
          colors={['#8B5CF6', '#3B82F6']}
          startFrame={BEATS.BOTTOM_AI_LABEL}
          fontSize={24}
          fontWeight={500}
          fontFamily="Inter, -apple-system, system-ui, sans-serif"
        >
          AI MODEL
        </GradientText>
        <AnimatedArrow startFrame={BEATS.BOTTOM_ARROW_2} color={COLORS.techBlue} width={50} />
      </div>

      <FlowRow>
        <AnimatedText
          variant="code"
          size={28}
          color={COLORS.textBody}
          entrance="fade"
          startFrame={BEATS.BOTTOM_OUTPUT_IN}
        >
          {"import { x } from "}
        </AnimatedText>
        {frame >= BEATS.BOTTOM_GLITCH_START && (
          <GlitchText
            startFrame={BEATS.BOTTOM_GLITCH_START}
            intensity={0.7}
            speed={3}
            color={COLORS.errorRed}
            fontSize={28}
            fontFamily="JetBrains Mono, Fira Code, Consolas, monospace"
            fontWeight={400}
          >
            {"'fake-lib'"}
          </GlitchText>
        )}
      </FlowRow>
    </div>
  );
};

export const Scene2_Parallel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title dims after split screen enters
  const titleOpacity = interpolate(
    frame,
    [BEATS.TITLE_DIM, BEATS.TITLE_DIM + 20],
    [1, 0.4],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Dashed connector line between the two garbled outputs
  const connectorOpacity =
    frame >= BEATS.CONNECTOR_LINE
      ? 0.2 + 0.15 * Math.sin((frame - BEATS.CONNECTOR_LINE) * (2 * Math.PI) / 45)
      : 0;


  return (
    <SceneContainer
      background="dark"
      fadeIn
      fadeInDuration={20}
      fadeOut
      fadeOutStart={BEATS.FADE_OUT_START}
      fadeOutDuration={15}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          gap: 20,
        }}
      >
        {/* Title */}
        <div style={{ opacity: titleOpacity, marginBottom: 8 }}>
          <AnimatedText
            variant="title"
            size={52}
            color={COLORS.textBody}
            entrance="slideUp"
            startFrame={BEATS.TITLE_IN}
            springPreset="gentle"
            align="center"
          >
            Same Pattern, Different Era
          </AnimatedText>
        </div>

        {/* SplitScreen comparison */}
        <div style={{ flex: 1, width: '100%', position: 'relative' }}>
          <SplitScreen
            topLabel="1952"
            bottomLabel="2026"
            startFrame={BEATS.SPLIT_SCREEN_IN}
            topBg={COLORS.bgWarm}
            bottomBg={COLORS.bgSurface}
            dividerColor={COLORS.panelBorder}
            labelColors={[COLORS.historyGold, COLORS.techBlue]}
            topContent={<CompilerFlow />}
            bottomContent={<AIFlow />}
          />

          {/* Dashed connector line between garbled outputs */}
          {frame >= BEATS.CONNECTOR_LINE && (
            <svg
              style={{
                position: 'absolute',
                left: '50%',
                top: '42%',
                height: '16%',
                width: 4,
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            >
              <line
                x1={2}
                y1={0}
                x2={2}
                y2="100%"
                stroke={COLORS.errorRed}
                strokeWidth={2}
                strokeDasharray="6 4"
                opacity={connectorOpacity}
              />
            </svg>
          )}
        </div>

        {/* Bridge text */}
        {frame >= BEATS.BRIDGE_TEXT_IN && (
          <div style={{ textAlign: 'center', paddingBottom: 40 }}>
            <ShinyText
              startFrame={BEATS.BRIDGE_TEXT_IN}
              color={COLORS.textMuted}
              shineColor="#FFFFFF"
              fontSize={44}
              fontWeight={600}
              duration={50}
            >
              Same problem. Same phase.
            </ShinyText>
          </div>
        )}
      </div>
    </SceneContainer>
  );
};
