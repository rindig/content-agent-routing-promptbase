import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import {
  AmbientBackground,
  Vignette,
} from '../../../../../Memory/components/AmbientBackground';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';
import { PromptBlock, ModelLogo, OutputPanel } from '../components';

/**
 * Scene 3: Core — "The Four Layers" (local frames 0–360)
 * Global frames 300–660; subtract 300 from spec BEATS.
 */

const BEATS = {
  // Phase 1: Split-Screen Build
  DIVIDER_DRAW: 5,           // global 305
  LABEL_UNSTRUCTURED: 10,    // global 310
  LABEL_STRUCTURED: 15,      // global 315
  MESSY_PROMPT_IN: 30,       // global 330
  STRUCTURED_PROMPT_IN: 60,  // global 360
  HIGHLIGHT_CONTEXT: 90,     // global 390
  CONTEXT_LABEL: 95,         // global 395
  HIGHLIGHT_TASK: 120,       // global 420
  TASK_LABEL: 125,           // global 425
  HIGHLIGHT_FORMAT: 140,     // global 440
  FORMAT_LABEL: 143,         // global 443
  HIGHLIGHT_EXAMPLES: 155,   // global 455
  EXAMPLES_LABEL: 158,       // global 458
  ALL_SECTIONS_FULL: 175,    // global 475

  // Phase 2: Output Comparison
  ARROW_LEFT_DRAW: 180,      // global 480
  ARROW_RIGHT_DRAW: 185,     // global 485
  OUTPUT_POOR_IN: 200,       // global 500
  OUTPUT_EXCELLENT_IN: 208,  // global 508
  BORDER_PULSE: 230,         // global 530

  // Phase 3: Universality
  LEFT_SIDE_FADE: 240,       // global 540
  DIVIDER_FADE: 245,         // global 545
  RIGHT_SLIDE_CENTER: 240,   // global 540
  OUTPUT_FADE: 270,          // global 570
  PROMPT_SHIFT_UP: 270,      // global 570
  CLAUDE_LOGO_IN: 290,       // global 590
  CHATGPT_LOGO_IN: 296,      // global 596
  GEMINI_LOGO_IN: 302,       // global 602
  LOCAL_LOGO_IN: 308,        // global 608
  FEED_ARROW_DRAW: 315,      // global 615
  CLAUDE_ACTIVE: 325,        // global 625
  CHATGPT_ACTIVE: 340,       // global 640
  GEMINI_ACTIVE: 348,        // global 648
  LOCAL_ACTIVE: 354,         // global 654
  SAME_STRUCTURE_TEXT: 356,   // global 656
  SCENE_END: 360,            // global 660
};

const SECTION_LABELS = [
  { text: 'Who is the AI? Constraints.', color: COLORS.techBlue, beat: 'CONTEXT_LABEL' },
  { text: 'What needs to be done.', color: COLORS.insightOrange, beat: 'TASK_LABEL' },
  { text: 'What output looks like.', color: COLORS.solutionGreen, beat: 'FORMAT_LABEL' },
  { text: 'Good vs. bad.', color: COLORS.aiPurple, beat: 'EXAMPLES_LABEL' },
];

const LABEL_BEATS = [BEATS.CONTEXT_LABEL, BEATS.TASK_LABEL, BEATS.FORMAT_LABEL, BEATS.EXAMPLES_LABEL];
const LABEL_FADE_STARTS = [115, 135, 150, 170]; // approximate fade start per label

export const Scene3_Core: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine current highlight section (1-4) or undefined
  let highlightSection: number | undefined;
  if (frame >= BEATS.ALL_SECTIONS_FULL) highlightSection = undefined;
  else if (frame >= BEATS.HIGHLIGHT_EXAMPLES) highlightSection = 4;
  else if (frame >= BEATS.HIGHLIGHT_FORMAT) highlightSection = 3;
  else if (frame >= BEATS.HIGHLIGHT_TASK) highlightSection = 2;
  else if (frame >= BEATS.HIGHLIGHT_CONTEXT) highlightSection = 1;

  // Phase 3: left side fade
  const leftFadeOpacity = frame >= BEATS.LEFT_SIDE_FADE
    ? interpolate(frame, [BEATS.LEFT_SIDE_FADE, BEATS.LEFT_SIDE_FADE + 20], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Divider fade
  const dividerDraw = spring({
    frame: frame - BEATS.DIVIDER_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const dividerHeight = frame >= BEATS.DIVIDER_DRAW
    ? interpolate(dividerDraw, [0, 1], [0, 1400])
    : 0;
  const dividerOpacity = frame >= BEATS.DIVIDER_FADE
    ? interpolate(frame, [BEATS.DIVIDER_FADE, BEATS.DIVIDER_FADE + 10], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Right slide to center in phase 3
  const slideCenterProgress = spring({
    frame: frame - BEATS.RIGHT_SLIDE_CENTER,
    fps,
    config: SPRING_CONFIGS.snappy,
  });
  const rightSlideX = frame >= BEATS.RIGHT_SLIDE_CENTER
    ? interpolate(slideCenterProgress, [0, 1], [0, -270])
    : 0;

  // Output panels fade
  const outputFadeOpacity = frame >= BEATS.OUTPUT_FADE
    ? interpolate(frame, [BEATS.OUTPUT_FADE, BEATS.OUTPUT_FADE + 15], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  // Prompt shift up in phase 3
  const promptShiftProgress = spring({
    frame: frame - BEATS.PROMPT_SHIFT_UP,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const promptShiftY = frame >= BEATS.PROMPT_SHIFT_UP
    ? interpolate(promptShiftProgress, [0, 1], [0, -150])
    : 0;

  // Feed arrow
  const feedArrowProgress = spring({
    frame: frame - BEATS.FEED_ARROW_DRAW,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const feedArrowHeight = frame >= BEATS.FEED_ARROW_DRAW
    ? interpolate(feedArrowProgress, [0, 1], [0, 210])
    : 0;

  // "Same structure. Every model." text
  const sameTextEntrance = spring({
    frame: frame - BEATS.SAME_STRUCTURE_TEXT,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const sameTextOpacity = frame >= BEATS.SAME_STRUCTURE_TEXT
    ? interpolate(sameTextEntrance, [0, 1], [0, 1])
    : 0;

  // Model logos active states
  const isClaudeActive = frame >= BEATS.CLAUDE_ACTIVE;
  const isChatGPTActive = frame >= BEATS.CHATGPT_ACTIVE;
  const isGeminiActive = frame >= BEATS.GEMINI_ACTIVE;
  const isLocalActive = frame >= BEATS.LOCAL_ACTIVE;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.techBlue}
      />
      <Vignette intensity={0.5} />

      {/* Divider line */}
      <div
        style={{
          position: 'absolute',
          left: 539,
          top: 250,
          width: 2,
          height: dividerHeight,
          backgroundColor: COLORS.bgSurfaceAlt,
          opacity: dividerOpacity,
        }}
      />

      {/* LEFT SIDE — Unstructured */}
      <div style={{ opacity: leftFadeOpacity }}>
        {/* "UNSTRUCTURED" label */}
        {frame >= BEATS.LABEL_UNSTRUCTURED && (
          <div
            style={{
              position: 'absolute',
              left: 170,
              top: 280,
              fontFamily: TYPOGRAPHY.label.fontFamily,
              fontWeight: 500,
              fontSize: 28,
              color: COLORS.errorRed,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: interpolate(
                spring({ frame: frame - BEATS.LABEL_UNSTRUCTURED, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1], [0, 1]
              ),
            }}
          >
            UNSTRUCTURED
          </div>
        )}

        {/* Messy prompt */}
        <PromptBlock
          mode="messy"
          width={440}
          height={600}
          x={50}
          y={340}
          startFrame={BEATS.MESSY_PROMPT_IN}
          springPreset="snappy"
        />

        {/* Down arrow (left) */}
        {frame >= BEATS.ARROW_LEFT_DRAW && (
          <svg
            style={{ position: 'absolute', left: 250, top: 960 }}
            width={40}
            height={30}
          >
            <line
              x1={20} y1={0} x2={20} y2={25}
              stroke={COLORS.errorRed}
              strokeWidth={2}
              strokeDasharray={30}
              strokeDashoffset={interpolate(
                spring({ frame: frame - BEATS.ARROW_LEFT_DRAW, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1], [30, 0]
              )}
            />
            <polygon points="14,20 26,20 20,28" fill={COLORS.errorRed} />
          </svg>
        )}

        {/* Poor output */}
        <div style={{ opacity: outputFadeOpacity }}>
          <OutputPanel
            quality="poor"
            width={440}
            height={240}
            x={50}
            y={1010}
            startFrame={BEATS.OUTPUT_POOR_IN}
          />
        </div>
      </div>

      {/* RIGHT SIDE — Structured (slides center in phase 3) */}
      <div style={{ transform: `translateX(${rightSlideX}px) translateY(${promptShiftY}px)` }}>
        {/* "STRUCTURED" label */}
        {frame >= BEATS.LABEL_STRUCTURED && frame < BEATS.DIVIDER_FADE + 10 && (
          <div
            style={{
              position: 'absolute',
              left: 650,
              top: 280,
              fontFamily: TYPOGRAPHY.label.fontFamily,
              fontWeight: 500,
              fontSize: 28,
              color: COLORS.solutionGreen,
              letterSpacing: 2,
              textTransform: 'uppercase',
              opacity: interpolate(
                spring({ frame: frame - BEATS.LABEL_STRUCTURED, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1], [0, 1]
              ) * dividerOpacity,
            }}
          >
            STRUCTURED
          </div>
        )}

        {/* Structured prompt */}
        <PromptBlock
          mode="structured"
          width={440}
          height={600}
          x={590}
          y={340}
          startFrame={BEATS.STRUCTURED_PROMPT_IN}
          springPreset="snappy"
          highlightSection={highlightSection}
        />

        {/* Section labels (appear and fade per highlight) */}
        {SECTION_LABELS.map((sl, i) => {
          const labelStart = LABEL_BEATS[i];
          const labelFadeStart = LABEL_FADE_STARTS[i];
          const labelEntrance = spring({
            frame: frame - labelStart,
            fps,
            config: SPRING_CONFIGS.gentle,
          });
          let labelOpacity = frame >= labelStart
            ? interpolate(labelEntrance, [0, 1], [0, 1])
            : 0;
          if (frame >= labelFadeStart) {
            labelOpacity *= interpolate(frame, [labelFadeStart, labelFadeStart + 5], [1, 0], { extrapolateRight: 'clamp' });
          }
          const labelShiftY = frame >= labelStart
            ? interpolate(labelEntrance, [0, 1], [15, 0])
            : 15;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 590,
                top: 960,
                transform: `translateY(${labelShiftY}px)`,
                opacity: labelOpacity,
                fontFamily: TYPOGRAPHY.body.fontFamily,
                fontWeight: 400,
                fontSize: 32,
                color: sl.color,
              }}
            >
              {sl.text}
            </div>
          );
        })}

        {/* Down arrow (right) */}
        {frame >= BEATS.ARROW_RIGHT_DRAW && (
          <svg
            style={{ position: 'absolute', left: 790, top: 960 }}
            width={40}
            height={30}
          >
            <line
              x1={20} y1={0} x2={20} y2={25}
              stroke={COLORS.solutionGreen}
              strokeWidth={2}
              strokeDasharray={30}
              strokeDashoffset={interpolate(
                spring({ frame: frame - BEATS.ARROW_RIGHT_DRAW, fps, config: SPRING_CONFIGS.snappy }),
                [0, 1], [30, 0]
              )}
            />
            <polygon points="14,20 26,20 20,28" fill={COLORS.solutionGreen} />
          </svg>
        )}

        {/* Excellent output */}
        <div style={{ opacity: outputFadeOpacity }}>
          <OutputPanel
            quality="excellent"
            width={440}
            height={240}
            x={590}
            y={1010}
            startFrame={BEATS.OUTPUT_EXCELLENT_IN}
          />
        </div>
      </div>

      {/* Phase 3: Feed arrow from prompt to logos */}
      {frame >= BEATS.FEED_ARROW_DRAW && (
        <svg
          style={{ position: 'absolute', left: 538, top: 820 + promptShiftY }}
          width={4}
          height={feedArrowHeight}
        >
          <line
            x1={2} y1={0} x2={2} y2={feedArrowHeight}
            stroke={COLORS.solutionGreen}
            strokeWidth={2}
            opacity={0.5}
          />
        </svg>
      )}

      {/* Model logos */}
      <ModelLogo model="Claude" size={80} x={180} y={1050 + promptShiftY} startFrame={BEATS.CLAUDE_LOGO_IN} springPreset="bouncy" active={isClaudeActive} />
      <ModelLogo model="ChatGPT" size={80} x={360} y={1050 + promptShiftY} startFrame={BEATS.CHATGPT_LOGO_IN} springPreset="bouncy" active={isChatGPTActive} />
      <ModelLogo model="Gemini" size={80} x={540} y={1050 + promptShiftY} startFrame={BEATS.GEMINI_LOGO_IN} springPreset="bouncy" active={isGeminiActive} />
      <ModelLogo model="Local" size={80} x={720} y={1050 + promptShiftY} startFrame={BEATS.LOCAL_LOGO_IN} springPreset="bouncy" active={isLocalActive} />

      {/* Checkmarks above active logos */}
      {[
        { active: isClaudeActive, x: 180, start: BEATS.CLAUDE_ACTIVE + 2 },
        { active: isChatGPTActive, x: 360, start: BEATS.CHATGPT_ACTIVE + 2 },
        { active: isGeminiActive, x: 540, start: BEATS.GEMINI_ACTIVE + 2 },
        { active: isLocalActive, x: 720, start: BEATS.LOCAL_ACTIVE + 2 },
      ].map((item, i) => {
        const checkOpacity = frame >= item.start
          ? interpolate(
              spring({ frame: frame - item.start, fps, config: SPRING_CONFIGS.snappy }),
              [0, 1], [0, 1]
            )
          : 0;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: item.x - 12,
              top: 1000 + promptShiftY,
              fontSize: 24,
              color: COLORS.solutionGreen,
              opacity: checkOpacity,
            }}
          >
            ✓
          </div>
        );
      })}

      {/* "Same structure. Every model." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1180 + promptShiftY,
          transform: 'translate(-50%, -50%)',
          opacity: sameTextOpacity,
          fontFamily: TYPOGRAPHY.body.fontFamily,
          fontWeight: 400,
          fontSize: 36,
          color: COLORS.textBody,
          textAlign: 'center',
        }}
      >
        Same structure. Every model.
      </div>
    </AbsoluteFill>
  );
};
