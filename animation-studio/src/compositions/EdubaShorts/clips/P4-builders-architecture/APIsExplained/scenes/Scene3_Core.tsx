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
import { ShinyText, GradientText } from '../../../../../../components/core/effects';
import { COLORS, SPRING_CONFIGS, TYPOGRAPHY } from '../../../../constants';
import { RestaurantTable, MenuCard, KitchenBox, RequestArrow, ResponsePlate } from '../components';

/**
 * Scene 3: Core — The API Translation (local frames 0–360)
 * Global frames 300–660; subtract 300 from spec BEATS.
 */

const BEATS = {
  PREV_ELEMENTS_OUT: 0,      // global 300
  PARTICLE_SHIFT_BLUE: 10,   // global 310
  TITLE_IN: 10,              // global 310
  TITLE_SHINE: 15,           // global 315
  APP_A_IN: 30,              // global 330
  APP_B_IN: 40,              // global 340
  API_DOCS_CARD_IN: 60,      // global 360
  MENU_ITEMS_STAGGER: 70,    // global 370
  WEATHER_HIGHLIGHT: 110,    // global 410
  CURSOR_BLINK_START: 110,   // global 410
  READ_ARROW_DRAW: 130,      // global 430
  ITEM_PULSE: 140,           // global 440
  REQUEST_ARROW_DRAW: 145,   // global 445
  KITCHEN_PROCESSING: 165,   // global 465
  MENU_DIM: 165,             // global 465
  PROCESSING_TEXT_IN: 175,   // global 475
  PROCESSING_TEXT_OUT: 200,  // global 500
  RESPONSE_PLATE_IN: 205,    // global 505
  RESPONSE_ARROW_DRAW: 210,  // global 510
  APP_A_ACK_FLASH: 225,      // global 525
  EXAMPLE_WEATHER: 240,      // global 540
  EXAMPLE_PAYMENT: 248,      // global 548
  EXAMPLE_NOTIFY: 256,       // global 556
  HIGHLIGHT_WEATHER: 280,    // global 580
  HIGHLIGHT_PAYMENT: 295,    // global 595
  HIGHLIGHT_NOTIFY: 310,     // global 610
  EXAMPLES_DIM: 320,         // global 620
  DIAGRAM_SCALE_DOWN: 320,   // global 620
  FADE_OUT_START: 350,       // global 650
  SCENE_END: 360,            // global 660
};

const API_ITEMS = [
  { endpoint: 'GET /weather', description: 'current conditions' },
  { endpoint: 'POST /payment', description: 'process charge' },
  { endpoint: 'POST /notify', description: 'send alert' },
];

const EXAMPLES = [
  { text: 'checks the weather', color: COLORS.techBlue, beat: BEATS.EXAMPLE_WEATHER },
  { text: 'processes a payment', color: COLORS.insightOrange, beat: BEATS.EXAMPLE_PAYMENT },
  { text: 'sends a notification', color: COLORS.aiPurple, beat: BEATS.EXAMPLE_NOTIFY },
];

const HIGHLIGHTS = [
  { beat: BEATS.HIGHLIGHT_WEATHER, endBeat: BEATS.HIGHLIGHT_PAYMENT },
  { beat: BEATS.HIGHLIGHT_PAYMENT, endBeat: BEATS.HIGHLIGHT_NOTIFY },
  { beat: BEATS.HIGHLIGHT_NOTIFY, endBeat: BEATS.EXAMPLES_DIM },
];

export const Scene3_Core: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleEntrance = spring({
    frame: frame - BEATS.TITLE_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const titleScale = frame >= BEATS.TITLE_IN
    ? interpolate(titleEntrance, [0, 1], [0.5, 1]) : 0;
  const titleOpacity = frame >= BEATS.TITLE_IN
    ? interpolate(titleEntrance, [0, 1], [0, 1]) : 0;

  // Menu card opacity (dims during processing)
  const menuDimOpacity = frame >= BEATS.MENU_DIM
    ? interpolate(frame, [BEATS.MENU_DIM, BEATS.MENU_DIM + 15], [1, 0.4], { extrapolateRight: 'clamp' })
    : 1;

  // Kitchen processing state
  const kitchenProcessing = frame >= BEATS.KITCHEN_PROCESSING && frame < BEATS.PROCESSING_TEXT_OUT;

  // Processing text
  const procTextOpacity = frame >= BEATS.PROCESSING_TEXT_IN && frame < BEATS.PROCESSING_TEXT_OUT
    ? interpolate(
        spring({ frame: frame - BEATS.PROCESSING_TEXT_IN, fps, config: SPRING_CONFIGS.gentle }),
        [0, 1], [0, 1]
      )
    : 0;
  const cursorVisible = frame >= BEATS.PROCESSING_TEXT_IN && Math.floor(frame / 10) % 2 === 0;

  // Weather highlight on menu
  const weatherHighlighted = frame >= BEATS.WEATHER_HIGHLIGHT;

  // Response plate travels from App B to App A
  const plateVisible = frame >= BEATS.RESPONSE_PLATE_IN;

  // Diagram scale down
  const diagramScaleProgress = spring({
    frame: frame - BEATS.DIAGRAM_SCALE_DOWN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const diagramScale = frame >= BEATS.DIAGRAM_SCALE_DOWN
    ? interpolate(diagramScaleProgress, [0, 1], [1, 0.85])
    : 1;
  const diagramShiftY = frame >= BEATS.DIAGRAM_SCALE_DOWN
    ? interpolate(diagramScaleProgress, [0, 1], [0, -100])
    : 0;

  // Examples dim
  const examplesDimOpacity = frame >= BEATS.EXAMPLES_DIM
    ? interpolate(frame, [BEATS.EXAMPLES_DIM, BEATS.EXAMPLES_DIM + 15], [1, 0.3], { extrapolateRight: 'clamp' })
    : 1;

  // Fade out
  const fadeOutOpacity = frame >= BEATS.FADE_OUT_START
    ? interpolate(frame, [BEATS.FADE_OUT_START, BEATS.SCENE_END], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.techBlue}
      />
      <Vignette intensity={0.5} />

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 200,
          transform: `translate(-50%, -50%) scale(${titleScale})`,
          opacity: titleOpacity * fadeOutOpacity,
        }}
      >
        <ShinyText
          startFrame={BEATS.TITLE_SHINE}
          shineColor="#FFFFFF"
          duration={30}
          fontSize={48}
        >
          How an API Actually Works
        </ShinyText>
      </div>

      {/* Main diagram group */}
      <div
        style={{
          transform: `scale(${diagramScale}) translateY(${diagramShiftY}px)`,
          transformOrigin: '540px 700px',
          opacity: fadeOutOpacity,
        }}
      >
        {/* App A (left) */}
        <RestaurantTable
          label="App A"
          color={COLORS.techBlue}
          x={270}
          y={900}
          startFrame={BEATS.APP_A_IN}
          springPreset="snappy"
        />

        {/* App B (right) */}
        <KitchenBox
          label="App B"
          sublabel="(the server)"
          color={COLORS.aiPurple}
          width={360}
          height={180}
          x={810}
          y={900}
          startFrame={BEATS.APP_B_IN}
          processing={kitchenProcessing}
        />

        {/* Processing text inside KitchenBox */}
        {procTextOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              left: 810,
              top: 940,
              transform: 'translate(-50%, -50%)',
              opacity: procTextOpacity,
              fontFamily: TYPOGRAPHY.code.fontFamily,
              fontWeight: 400,
              fontSize: 32,
              color: COLORS.aiPurple,
            }}
          >
            processing...{cursorVisible ? '|' : ''}
          </div>
        )}

        {/* API Docs Menu Card */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 600,
            transform: 'translate(-50%, -50%)',
            opacity: menuDimOpacity,
          }}
        >
          <MenuCard
            title="API Documentation"
            items={API_ITEMS}
            color={COLORS.techBlue}
            startFrame={BEATS.API_DOCS_CARD_IN}
            itemsStartFrame={BEATS.MENU_ITEMS_STAGGER}
            highlightIndex={weatherHighlighted ? 0 : undefined}
          />
        </div>

        {/* Read menu arrow (App A → Menu) */}
        <RequestArrow
          fromX={270}
          fromY={850}
          toX={540}
          toY={620}
          color={COLORS.techBlue}
          startFrame={BEATS.READ_ARROW_DRAW}
          drawDuration={15}
          label="reads menu"
          labelColor={COLORS.techBlue}
        />

        {/* Request arrow (Menu → App B) */}
        <RequestArrow
          fromX={540}
          fromY={620}
          toX={810}
          toY={850}
          color={COLORS.insightOrange}
          startFrame={BEATS.REQUEST_ARROW_DRAW}
          drawDuration={15}
          label="request"
          labelColor={COLORS.insightOrange}
        />

        {/* Response arrow (App B → App A) */}
        <RequestArrow
          fromX={810}
          fromY={750}
          toX={270}
          toY={850}
          color={COLORS.solutionGreen}
          startFrame={BEATS.RESPONSE_ARROW_DRAW}
          drawDuration={20}
          label="response"
          labelColor={COLORS.solutionGreen}
        />

        {/* Response Plate */}
        {plateVisible && (
          <ResponsePlate
            label="72F / Sunny"
            color={COLORS.solutionGreen}
            size={90}
            startFrame={BEATS.RESPONSE_PLATE_IN}
            x={540}
            y={750}
          />
        )}
      </div>

      {/* Example labels */}
      {EXAMPLES.map((ex, i) => {
        const exEntrance = spring({
          frame: frame - ex.beat,
          fps,
          config: SPRING_CONFIGS.snappy,
        });
        const exOpacity = frame >= ex.beat
          ? interpolate(exEntrance, [0, 1], [0, 1]) * examplesDimOpacity * fadeOutOpacity
          : 0;
        const exY = frame >= ex.beat
          ? interpolate(exEntrance, [0, 1], [15, 0])
          : 15;

        // Highlight glow
        const hl = HIGHLIGHTS[i];
        const isHighlighted = frame >= hl.beat && frame < hl.endBeat;
        const glowStyle = isHighlighted
          ? { textShadow: `0 0 12px ${ex.color}66` }
          : {};
        const highlightDim = frame >= hl.endBeat
          ? 0.5
          : 1;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 200,
              top: 1400 + i * 70,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: exOpacity * highlightDim,
              transform: `translateY(${exY}px)`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: ex.color,
              }}
            />
            <div
              style={{
                fontFamily: TYPOGRAPHY.label.fontFamily,
                fontWeight: 500,
                fontSize: 28,
                color: ex.color,
                ...glowStyle,
              }}
            >
              {ex.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
