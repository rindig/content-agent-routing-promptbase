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
import { RestaurantTable, MenuCard, KitchenBox, RequestArrow, ResponsePlate } from '../components';

/**
 * Scene 2: Context — The Restaurant (local frames 0–210)
 * Global frames 90–300; subtract 90 from spec BEATS.
 */

const BEATS = {
  HOOK_TEXT_OUT: 0,          // global 90
  PARTICLE_COLOR_SHIFT: 0,  // global 90
  TABLE_IN: 20,              // global 110
  THOUGHT_BUBBLE: 35,        // global 125
  MENU_CARD_IN: 50,          // global 140
  THOUGHT_BUBBLE_OUT: 55,    // global 145
  MENU_ITEMS_STAGGER: 60,    // global 150
  STEAK_HIGHLIGHT: 90,       // global 180
  CHECKMARK_IN: 100,         // global 190
  OTHER_ITEMS_DIM: 105,      // global 195
  KITCHEN_IN: 120,           // global 210
  ORDER_ARROW_DRAW: 150,     // global 240
  KITCHEN_PROCESSING: 160,   // global 250
  RESPONSE_PLATE_IN: 178,    // global 268
  SERVED_ARROW_DRAW: 182,    // global 272
  MENU_DIM: 195,             // global 285
  LABEL_IN: 202,             // global 292
  SCENE_END: 210,            // global 300
};

const MENU_ITEMS = [
  { endpoint: 'Pasta', description: 'house special' },
  { endpoint: 'Steak', description: 'grilled' },
  { endpoint: 'Salad', description: 'fresh' },
];

export const Scene2_Context: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Menu card opacity (dims in later phase)
  const menuDimOpacity = frame >= BEATS.MENU_DIM
    ? interpolate(frame, [BEATS.MENU_DIM, BEATS.MENU_DIM + 10], [1, 0.3], { extrapolateRight: 'clamp' })
    : 1;

  // Thought bubble
  const thoughtVisible = frame >= BEATS.THOUGHT_BUBBLE && frame < BEATS.THOUGHT_BUBBLE_OUT + 10;
  const thoughtOpacity = thoughtVisible
    ? (frame < BEATS.THOUGHT_BUBBLE_OUT
      ? interpolate(
          spring({ frame: frame - BEATS.THOUGHT_BUBBLE, fps, config: SPRING_CONFIGS.snappy }),
          [0, 1], [0, 1]
        )
      : interpolate(frame, [BEATS.THOUGHT_BUBBLE_OUT, BEATS.THOUGHT_BUBBLE_OUT + 10], [1, 0], { extrapolateRight: 'clamp' })
    )
    : 0;

  // Kitchen processing state
  const kitchenProcessing = frame >= BEATS.KITCHEN_PROCESSING && frame < BEATS.RESPONSE_PLATE_IN;

  // Steak highlight
  const steakHighlighted = frame >= BEATS.STEAK_HIGHLIGHT;

  // Checkmark
  const checkEntrance = spring({
    frame: frame - BEATS.CHECKMARK_IN,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });
  const checkOpacity = frame >= BEATS.CHECKMARK_IN
    ? interpolate(checkEntrance, [0, 1], [0, 1]) * menuDimOpacity
    : 0;

  // Response plate travels down
  const plateVisible = frame >= BEATS.RESPONSE_PLATE_IN;
  const plateProgress = frame >= BEATS.SERVED_ARROW_DRAW
    ? interpolate(
        spring({ frame: frame - BEATS.SERVED_ARROW_DRAW, fps, config: SPRING_CONFIGS.gentle }),
        [0, 1], [0, 1]
      )
    : 0;
  const plateY = 680 + plateProgress * 620; // from 680 to 1300

  // "No kitchen knowledge required." label
  const labelEntrance = spring({
    frame: frame - BEATS.LABEL_IN,
    fps,
    config: SPRING_CONFIGS.gentle,
  });
  const labelOpacity = frame >= BEATS.LABEL_IN
    ? interpolate(labelEntrance, [0, 1], [0, 1])
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AmbientBackground
        color={COLORS.bg}
        particleCount={25}
        particleColor={COLORS.solutionGreen}
      />
      <Vignette intensity={0.5} />

      {/* Kitchen Box */}
      <KitchenBox
        label="Kitchen"
        sublabel="(you can't see inside)"
        color={COLORS.textDim}
        width={400}
        height={200}
        x={540}
        y={300}
        startFrame={BEATS.KITCHEN_IN}
        processing={kitchenProcessing}
      />

      {/* Order arrow (table → kitchen) */}
      <RequestArrow
        fromX={540}
        fromY={680}
        toX={540}
        toY={500}
        color={COLORS.solutionGreen}
        startFrame={BEATS.ORDER_ARROW_DRAW}
        drawDuration={20}
        label="order"
        labelColor={COLORS.solutionGreen}
      />

      {/* Served arrow (kitchen → table) */}
      <RequestArrow
        fromX={540}
        fromY={500}
        toX={540}
        toY={1350}
        color={COLORS.insightOrange}
        startFrame={BEATS.SERVED_ARROW_DRAW}
        drawDuration={18}
        label="served"
        labelColor={COLORS.insightOrange}
      />

      {/* Response Plate */}
      {plateVisible && (
        <ResponsePlate
          label="Steak"
          color={COLORS.solutionGreen}
          size={80}
          startFrame={BEATS.RESPONSE_PLATE_IN}
          x={540}
          y={plateY}
        />
      )}

      {/* Menu Card */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 700,
          transform: 'translate(-50%, -50%)',
          opacity: menuDimOpacity,
        }}
      >
        <MenuCard
          title="MENU"
          items={MENU_ITEMS}
          color={COLORS.solutionGreen}
          startFrame={BEATS.MENU_CARD_IN}
          itemsStartFrame={BEATS.MENU_ITEMS_STAGGER}
          highlightIndex={steakHighlighted ? 1 : undefined}
        />
      </div>

      {/* Checkmark next to Steak */}
      <div
        style={{
          position: 'absolute',
          left: 800,
          top: 755,
          fontSize: 16,
          color: COLORS.solutionGreen,
          opacity: checkOpacity,
        }}
      >
        ✓
      </div>

      {/* Restaurant Table (customer) */}
      <RestaurantTable
        label="You"
        color={COLORS.solutionGreen}
        x={540}
        y={1400}
        startFrame={BEATS.TABLE_IN}
        springPreset="bouncy"
      />

      {/* Thought bubble */}
      {thoughtOpacity > 0 && (
        <div style={{ opacity: thoughtOpacity }}>
          {[8, 12, 16].map((size, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 560 + i * 15,
                top: 1260 - i * 25,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: `${COLORS.solutionGreen}4D`,
              }}
            />
          ))}
        </div>
      )}

      {/* "No kitchen knowledge required." */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 1550,
          transform: 'translate(-50%, -50%)',
          opacity: labelOpacity,
          fontFamily: TYPOGRAPHY.label.fontFamily,
          fontWeight: 500,
          fontSize: 28,
          color: COLORS.textMuted,
        }}
      >
        No kitchen knowledge required.
      </div>
    </AbsoluteFill>
  );
};
