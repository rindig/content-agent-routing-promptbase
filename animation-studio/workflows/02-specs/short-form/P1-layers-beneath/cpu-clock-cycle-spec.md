# CPU Clock Cycle

## Overview
- **ID**: T-08
- **Slug**: cpu-clock-cycle
- **Pillar**: P1 (Layers Beneath)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P1-layers-beneath/cpu-clock-cycle-review.md
- **Accent colors**: techBlue (#3B82F6), insightOrange (#F59E0B), solutionGreen (#10B981)
- **Core metaphor**: Everything your computer does is an endless loop of four stages — fetch, decode, execute, write — repeated billions of times per second, each cycle invisible yet foundational.
- **Key visual**: A horizontal four-stage pipeline with glowing instruction packets flowing through it like cars on a highway, accelerating into a blur with a cycle counter climbing to 4 billion.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | insightOrange #F59E0B | Scale, awe |
| Context | techBlue #3B82F6 | Technical, analytical |
| Core | techBlue → solutionGreen | Mechanical flow, overlapping motion |
| Resolution | insightOrange #F59E0B | Insight, reframe |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### PipelineStage

A rounded rectangular box representing one stage of the CPU pipeline (Fetch, Decode, Execute, Write).

- **Props:** `label: string, icon: string, color: string, width: number, height: number, x: number, y: number, startFrame: number, springPreset: "snappy" | "bouncy" | "gentle", lit: boolean, litFrame?: number`
- Each stage: surface (#12121A) fill, 3px border in `color` at 30% opacity, 16px border-radius, centered content
- Label: Inter 600, 32px, `#E5E7EB`, centered
- Icon above label: 28px, `color`, Inter 500 (single character glyph: F/D/E/W)
- When `lit=true` at `litFrame`: border opacity interpolates from 30% to 100% over 10 frames. Fill transitions to `color` at 12% opacity. Subtle box-shadow glow in `color` at 20% opacity, 30px blur radius
- When lit turns off: border and fill revert over 10 frames (interpolate, clamp)
- Entrance: scale from 0.85 to 1.0 + opacity 0 to 1 (spring: named preset) starting at `startFrame`
- Dimensions: 200w x 140h each

### PipelineConnector

Horizontal arrow connecting two adjacent PipelineStage boxes.

- **Props:** `fromX: number, toX: number, y: number, color: string, startFrame: number, drawDuration: number`
- 3px stroke, `color` at 50% opacity
- Draws left-to-right over `drawDuration` frames using `interpolate` on SVG path `strokeDashoffset`
- 8px chevron arrowhead at right end
- Dashed pattern: 8px dash, 6px gap

### InstructionPacket

A small rounded rectangle that travels through the pipeline stages left-to-right.

- **Props:** `id: number, color: string, startFrame: number, speed: number, y: number, stagePositions: number[], opacity?: number`
- Dimensions: 36w x 24h, 8px border-radius
- Fill: `color` at 80% opacity, 1px border in `color`
- Subtle inner glow: `color` at 30% opacity, 8px blur
- Motion: translateX interpolates through `stagePositions` array (4 stops, one per stage center), spending `speed` frames at each stage
- When packet center aligns with a stage center (within 10px), that stage lights up
- Opacity defaults to 1.0, can be overridden for layered/blurred packets

### CycleCounter

Fixed-position counter displaying cycle rate with animated counting.

- **Props:** `startFrame: number, targetValue: string, x: number, y: number, labelText: string`
- Container: surface (#12121A) fill, 1px border #3B82F6 at 20% opacity, 12px border-radius, 24px horizontal padding, 16px vertical padding
- Value: JetBrains Mono 700, 28px, insightOrange (#F59E0B)
- Label: Inter 400, 20px, #9CA3AF, below value
- Corner brackets: 10x10px L-shaped borders in techBlue (#3B82F6) at 40% opacity, all four corners
- Subtle pulse: opacity oscillates via `Math.sin(frame * 0.06) * 0.1 + 0.9`

---

## Scene Breakdown

### Scene 1: Hook — "4 Billion Cycles" (0s-3s, frames 0-90)

**Narration:** > "A modern CPU runs at roughly 4 billion cycles per second. Here's what happens in just one of those cycles."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #F59E0B at 10% opacity, speed: 0.2). `Vignette` (opacity: 0.5) fades in over 15 frames. Clean stillness.

- **Frames 15-45**: Center screen at Y: 750: `CountUp from={0} to={4000000000} startFrame={15} duration={30} separator="," fontSize={84} color="#F59E0B" useSpring={true}`. The number accelerates dramatically. Below at Y: 860: `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" startFrame={25} springPreset="gentle"` reading "cycles per second". A radial glow behind the counter — insightOrange #F59E0B at 5% opacity, 350px radius, centered at Y: 750, opacity interpolates from 0% to 5% over 20 frames starting frame 15.

- **Frames 45-60**: Counter holds at "4,000,000,000". At frame 48: thin horizontal line (techBlue #3B82F6, 2px height, 40% opacity) draws outward from center at Y: 820, width interpolates from 0 to 600px over 12 frames. Visual separator.

- **Frames 60-75**: Counter and label begin scaling down — scale interpolates from 1.0 to 0.6 over 15 frames (spring: snappy). Opacity interpolates from 1.0 to 0.4. translateY interpolates from Y: 750 to Y: 280. Moving to top-right corner to become the persistent CycleCounter.

- **Frames 75-90**: Counter settles at top-right corner position (X: 820, Y: 180) as `CycleCounter startFrame={75} targetValue="4,000,000,000" x={820} y={180} labelText="cycles/sec"`. Horizontal line fades out (opacity 0.4 to 0, 15 frames). Radial glow fades out. Scene clears for pipeline reveal.

**BEATS:**
```typescript
const BEATS = {
  AMBIENT_IN: 0,
  VIGNETTE_IN: 0,
  COUNT_START: 15,
  LABEL_IN: 25,
  GLOW_IN: 15,
  COUNT_HOLD: 45,
  SEPARATOR_LINE_DRAW: 48,
  SHRINK_START: 60,
  COUNTER_SETTLE: 75,
  LINE_FADE: 75,
  SCENE_END: 90,
};
```

**Components:** CountUp, AnimatedText, AmbientBackground, Vignette, CycleCounter
**Background:** dark (#0A0A0F)

---

### Scene 2: Context — "Four Stages" (3s-10s, frames 90-300)

**Narration:** > "The processor fetches an instruction from memory. It decodes that instruction to figure out what operation to perform. It executes the operation, maybe adding two numbers or comparing two values. And it writes the result back to a register."
>
> "Fetch, decode, execute, write. Four stages in one cycle. Four billion times per second."

**Visuals:**

The four pipeline stages appear one at a time, building the horizontal pipeline at Y: 850. CycleCounter persists at top-right (X: 820, Y: 180). Stages are evenly spaced across 880px (centered in 1080px frame, 100px margin each side). Stage center X positions: 190, 390, 590, 790.

- **Frames 90-115**: `AmbientBackground` particles shift to techBlue (#3B82F6 at 12% opacity). `PipelineStage label="FETCH" icon="F" color="#3B82F6" width={200} height={140} x={190} y={850} startFrame={95} springPreset="bouncy" lit={false}`. Stage scales in from 0.85 with bounce. Above the stage at Y: 770: `AnimatedText variant="label" size={24} color="#3B82F6" entrance="fade" startFrame={100} springPreset="gentle"` reading "from memory". Description text, small and contextual.

- **Frames 115-125**: `PipelineConnector fromX={290} toX={290} y={850} color="#3B82F6" startFrame={115} drawDuration={10}`. First arrow draws rightward from FETCH box edge toward DECODE position.

- **Frames 125-155**: `PipelineStage label="DECODE" icon="D" color="#6366F1" width={200} height={140} x={390} y={850} startFrame={130} springPreset="bouncy" lit={false}`. Above at Y: 770: `AnimatedText variant="label" size={24} color="#6366F1" entrance="fade" startFrame={138} springPreset="gentle"` reading "what operation?". FETCH description text ("from memory") dims to 30% opacity over 10 frames starting at frame 130.

- **Frames 155-165**: `PipelineConnector fromX={490} toX={490} y={850} color="#6366F1" startFrame={155} drawDuration={10}`. Second arrow draws.

- **Frames 165-195**: `PipelineStage label="EXECUTE" icon="E" color="#10B981" width={200} height={140} x={590} y={850} startFrame={170} springPreset="bouncy" lit={false}`. Above at Y: 770: `AnimatedText variant="label" size={24} color="#10B981" entrance="fade" startFrame={178} springPreset="gentle"` reading "add, compare...". Previous description texts dim to 30% opacity.

- **Frames 195-205**: `PipelineConnector fromX={690} toX={690} y={850} color="#10B981" startFrame={195} drawDuration={10}`. Third arrow draws.

- **Frames 205-240**: `PipelineStage label="WRITE" icon="W" color="#8B5CF6" width={200} height={140} x={790} y={850} startFrame={210} springPreset="bouncy" lit={false}`. Above at Y: 770: `AnimatedText variant="label" size={24} color="#8B5CF6" entrance="fade" startFrame={218} springPreset="gentle"` reading "to register". Previous description texts dim. Full pipeline now visible.

- **Frames 240-260**: All four description labels fade out (opacity to 0, 15 frames). A single `InstructionPacket id={0} color="#F59E0B" startFrame={242} speed={12} y={850} stagePositions={[190, 390, 590, 790]}` enters from left (X: 50 to first stage). Each stage lights up as the packet passes through it. Packet glows insightOrange.

- **Frames 260-275**: Instruction packet completes its journey through all four stages and exits right (X: 790 to X: 1030, opacity fades to 0 over last 10 frames). Each stage dims back after the packet passes (10-frame revert, staggered).

- **Frames 275-300**: Below the pipeline at Y: 1050, centered: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" startFrame={278} springPreset="bouncy"` reading "4 stages. 1 cycle." The text "4" and "1" wrapped in `ShinyText startFrame={283} shineColor="#FFFFFF" duration={30} fontSize={52}`. At Y: 1130: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={288} springPreset="gentle"` reading "Four billion times per second." CycleCounter pulses brighter once (opacity spikes to 1.0 for 10 frames at frame 285, then back to oscillation).

**BEATS:**
```typescript
const BEATS = {
  PARTICLES_SHIFT: 90,
  FETCH_IN: 95,
  FETCH_LABEL: 100,
  CONNECTOR_1_DRAW: 115,
  DECODE_IN: 130,
  DECODE_LABEL: 138,
  FETCH_LABEL_DIM: 130,
  CONNECTOR_2_DRAW: 155,
  EXECUTE_IN: 170,
  EXECUTE_LABEL: 178,
  CONNECTOR_3_DRAW: 195,
  WRITE_IN: 210,
  WRITE_LABEL: 218,
  LABELS_FADE: 240,
  PACKET_ENTER: 242,
  PACKET_EXIT: 260,
  STAGES_DIM_BACK: 265,
  SUMMARY_TEXT_IN: 278,
  SHINE_SWEEP: 283,
  COUNTER_PULSE: 285,
  SUBTITLE_IN: 288,
  SCENE_END: 300,
};
```

**Components:** PipelineStage (x4), PipelineConnector (x3), InstructionPacket, AnimatedText, ShinyText, CycleCounter, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 3: Core — "Pipelining" (10s-22s, frames 300-660)

**Narration:** > "And modern processors don't wait for one instruction to finish before starting the next. They pipeline them, overlapping stages so multiple instructions are in flight at the same time."

**Visuals:**

The four-stage pipeline from Scene 2 persists at Y: 850. CycleCounter persists top-right. Summary text and subtitle from Scene 2 fade out (opacity to 0 over 15 frames starting at frame 300).

- **Frames 300-315**: Summary text fades. Pipeline stages idle — all borders at 30% opacity, resting state. Brief pause to let the pipeline sit empty and still.

- **Frames 315-340**: First instruction packet enters: `InstructionPacket id={1} color="#3B82F6" startFrame={315} speed={18} y={840} stagePositions={[190, 390, 590, 790]}`. This packet moves slower than the demo in Scene 2 — deliberate, so the viewer can track it. Stage FETCH lights up as packet arrives at X: 190. Label "Instruction 1" appears above the packet: `AnimatedText variant="label" size={20} color="#3B82F6" entrance="fade" startFrame={318} springPreset="gentle"`, follows the packet's X position.

- **Frames 340-358**: Packet 1 moves to DECODE (X: 390). FETCH dims. DECODE lights up. Crucially, at frame 345: `InstructionPacket id={2} color="#10B981" startFrame={345} speed={18} y={860} stagePositions={[190, 390, 590, 790]}` enters FETCH. Now two instructions are in the pipeline simultaneously. FETCH re-lights for packet 2. Label "Instruction 2" appears: `AnimatedText variant="label" size={20} color="#10B981" entrance="fade" startFrame={348} springPreset="gentle"`.

- **Frames 358-376**: Packet 1 at EXECUTE, Packet 2 at DECODE. At frame 363: `InstructionPacket id={3} color="#8B5CF6" startFrame={363} speed={18} y={840} stagePositions={[190, 390, 590, 790]}` enters FETCH. Three instructions in flight. All three stages glow simultaneously — FETCH (#3B82F6 for packet 3), DECODE (#6366F1 for packet 2), EXECUTE (#10B981 for packet 1). The pipeline is alive.

- **Frames 376-394**: Packet 1 at WRITE, Packet 2 at EXECUTE, Packet 3 at DECODE. At frame 381: `InstructionPacket id={4} color="#F59E0B" startFrame={381} speed={18} y={860} stagePositions={[190, 390, 590, 790]}` enters FETCH. Four instructions in flight — pipeline fully saturated. All four stages lit simultaneously. A thin horizontal glow bar (techBlue #3B82F6 at 8% opacity, 4px height) pulses beneath the entire pipeline at Y: 935, width 880px, pulsing via `Math.sin(frame * 0.1) * 0.04 + 0.08` opacity.

- **Frames 394-420**: Packet 1 exits right (opacity fade over 10 frames). Packet 5 enters. The pattern is now established — continuous flow. Individual packet labels fade out (no longer needed, the pattern speaks for itself). Packets now flow in a steady stream: one enters FETCH every 18 frames as the previous advances. Colors cycle through: #3B82F6, #10B981, #8B5CF6, #F59E0B, repeat.

- **Frames 420-470**: Pipeline running at steady state. Speed increases — `speed` parameter per packet shortens from 18 to 12 frames per stage. Packets move faster. The glow bar beneath brightens from 8% to 12% opacity. A subtle motion blur effect on the packets: each packet's trailing edge gets a 20px gradient fade (same color at 40% to 0% opacity) simulating speed. Above the pipeline at Y: 750, centered: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="slideUp" startFrame={425} springPreset="gentle"` reading "Multiple instructions in flight". Text uses `ShinyText startFrame={430} shineColor="#FFFFFF" duration={40} fontSize={40}` on the word "flight".

- **Frames 470-530**: Speed increases again — `speed` drops to 8 frames per stage. Packets are now flowing rapidly. Individual packets become harder to distinguish. The pipeline stages begin showing persistent glow — all four borders remain at 80%+ opacity because packets are always present. The glow bar beneath pulses faster (`Math.sin(frame * 0.15)`). AmbientBackground particle speed increases from 0.2 to 0.6. "Multiple instructions in flight" text dims to 40% opacity over 20 frames starting at frame 500.

- **Frames 530-580**: Speed maxes out — `speed` drops to 3 frames per stage. Packets are now a continuous blur-stream. Replace individual InstructionPackets with a gradient ribbon: a 880px-wide horizontal bar at Y: 850, 24px height, with animated gradient cycling through #3B82F6, #10B981, #8B5CF6, #F59E0B at high speed (gradient offset shifts 200px per frame). The four pipeline stages now have permanent full glow. The visual reads as "one continuous flow."

- **Frames 580-620**: `CycleCounter` value text changes to show rapid counting — use `CountUp from={0} to={4000000000} startFrame={580} duration={40} separator="," fontSize={28} color="#F59E0B"` cycling rapidly inside the counter. The gradient ribbon pulses in brightness (opacity oscillates 0.7-1.0 at high frequency). A subtle screen shake: translateX oscillates +/- 2px via `Math.sin(frame * 0.8) * 2` and translateY oscillates +/- 1px via `Math.cos(frame * 0.6) * 1`. Conveys immense speed.

- **Frames 620-660**: Everything begins decelerating. Gradient ribbon slows — gradient offset shift decreases from 200px/frame to 20px/frame over 40 frames. Screen shake reduces to 0. Pipeline stage glows soften from 100% to 50% border opacity. AmbientBackground particles slow back to 0.3 speed. The frenzy calms. At frame 650: remaining pipeline text elements begin fading (opacity to 0 over 20 frames, extending into Scene 4).

**BEATS:**
```typescript
const BEATS = {
  SUMMARY_FADE: 300,
  PIPELINE_IDLE: 310,
  PACKET_1_ENTER: 315,
  LABEL_1_IN: 318,
  PACKET_1_DECODE: 340,
  PACKET_2_ENTER: 345,
  LABEL_2_IN: 348,
  PACKET_1_EXECUTE: 358,
  PACKET_3_ENTER: 363,
  PACKET_1_WRITE: 376,
  PACKET_4_ENTER: 381,
  PIPELINE_SATURATED: 381,
  GLOW_BAR_IN: 381,
  PACKET_1_EXIT: 394,
  STREAM_ESTABLISHED: 394,
  LABELS_FADE: 400,
  SPEED_INCREASE_1: 420,
  FLIGHT_TEXT_IN: 425,
  FLIGHT_SHINE: 430,
  SPEED_INCREASE_2: 470,
  PARTICLES_ACCELERATE: 470,
  FLIGHT_TEXT_DIM: 500,
  SPEED_MAX: 530,
  RIBBON_REPLACE: 530,
  COUNTER_RAPID: 580,
  SCREEN_SHAKE_START: 580,
  DECELERATE_START: 620,
  SHAKE_REDUCE: 620,
  ELEMENTS_FADE_BEGIN: 650,
  SCENE_END: 660,
};
```

**Components:** PipelineStage (x4), InstructionPacket (x8+), PipelineConnector (x3), AnimatedText, ShinyText, CountUp, CycleCounter, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution — "The Foundation" (22s-30s, frames 660-900)

**Narration:** > "Every single thing your computer does, from rendering video to running AI models, is built on top of this loop. Fetch, decode, execute, write. Billions of times a second. That's all there is underneath everything."

**Visuals:**

- **Frames 660-690**: Pipeline elements from Scene 3 complete their fade-out. Gradient ribbon fades (opacity to 0 over 15 frames). Stage glows dim to 0. Clean dark bg. CycleCounter persists but dims to 40% opacity. Brief breathing room — 10 frames of near-empty screen (680-690).

- **Frames 690-720**: The four PipelineStage boxes re-emerge, but smaller and simplified — scale 0.5, positioned in a tight horizontal row at Y: 500, centered. `PipelineStage` (each at 100w x 70h). Stage center X positions at 0.5 scale: 340, 440, 540, 640. All four enter simultaneously with `entrance="fade" startFrame={692} springPreset="gentle"`. No labels, no connectors — just the four colored shapes in sequence. A thin looping arrow draws beneath them (SVG path from X: 640 curving down to Y: 560 then back left to X: 340, indicating the cycle repeats): `PipelineConnector` variant as a curved return path, 2px stroke in #9CA3AF at 30% opacity, `drawDuration={20} startFrame={700}`.

- **Frames 720-750**: Above the mini pipeline at Y: 370: `AnimatedText variant="title" size={48} color="#E5E7EB" entrance="slideUp" startFrame={722} springPreset="gentle"` reading "The loop beneath everything". The word "everything" wrapped in `GradientText colors={["#F59E0B", "#3B82F6"]} direction="horizontal" duration={90} fontSize={48}`.

- **Frames 750-800**: Below the mini pipeline, application labels appear in a vertical list, each representing something built on this loop. Staggered entry, 12 frames apart. Each label is: `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" springPreset="gentle"`:
  - Y: 620, startFrame 752: "Rendering video" — with a thin 2px left border accent in techBlue #3B82F6, 16px left padding
  - Y: 665, startFrame 764: "Running AI models" — accent border in aiPurple #8B5CF6
  - Y: 710, startFrame 776: "Loading web pages" — accent border in solutionGreen #10B981
  - Y: 755, startFrame 788: "Playing games" — accent border in insightOrange #F59E0B

  As each label enters, the mini pipeline above flashes once — all four stages light up simultaneously for 6 frames (border opacity spike to 100%, then back to 40%). Reinforces that every application triggers this pipeline.

- **Frames 800-840**: Application labels hold. Below them at Y: 830, centered: `BlurText startFrame={805} animateBy="words" direction="bottom" staggerDelay={5} blurAmount={6} distance={20} fontSize={44} color="#F59E0B"` reading "Fetch. Decode. Execute. Write." Each word lands with weight. The mini pipeline lights up each stage in sequence as the corresponding word appears: FETCH lights at word 1, DECODE at word 2, EXECUTE at word 3, WRITE at word 4 (approximately 20 frames apart based on stagger).

- **Frames 840-870**: CycleCounter fades back to full opacity. Below the "Fetch. Decode. Execute. Write." text at Y: 910: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={845} springPreset="gentle"` reading "Billions of times a second."

- **Frames 870-900**: All elements begin fading out. Application labels fade first (opacity to 0 over 15 frames, staggered bottom-to-top, 3 frames apart). Title text fades. Mini pipeline fades. CycleCounter fades. BlurText line dims. By frame 895, screen is nearly black. Clean exit to closing.

**BEATS:**
```typescript
const BEATS = {
  PIPELINE_FADE_OUT: 660,
  RIBBON_GONE: 675,
  BREATHING_ROOM: 680,
  MINI_PIPELINE_IN: 692,
  LOOP_ARROW_DRAW: 700,
  TITLE_IN: 722,
  GRADIENT_TEXT: 722,
  APP_LABEL_1: 752,
  PIPELINE_FLASH_1: 752,
  APP_LABEL_2: 764,
  PIPELINE_FLASH_2: 764,
  APP_LABEL_3: 776,
  PIPELINE_FLASH_3: 776,
  APP_LABEL_4: 788,
  PIPELINE_FLASH_4: 788,
  FDEW_TEXT_IN: 805,
  STAGE_LIGHT_FETCH: 805,
  STAGE_LIGHT_DECODE: 825,
  STAGE_LIGHT_EXECUTE: 845,
  STAGE_LIGHT_WRITE: 865,
  COUNTER_RESTORE: 840,
  BILLIONS_TEXT_IN: 845,
  FADE_OUT_START: 870,
  LABELS_EXIT: 870,
  SCENE_END: 900,
};
```

**Components:** PipelineStage (x4, mini), PipelineConnector (loop arrow), AnimatedText, GradientText, BlurText, CycleCounter, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None — text only.

**Visuals:**

- **Frames 900-930**: Clean dark bg (#0A0A0F). Breathing room — nothing on screen. `Vignette` (opacity: 0.4) fades in over 15 frames starting at frame 910. 30 frames of stillness. AmbientBackground continues with minimal particles (particleCount: 15, color: #F59E0B at 6% opacity, speed: 0.15).

- **Frames 930-970**: First line enters at Y: 780, centered:
  `BlurText startFrame={935} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "Fetch, decode, execute, write."

- **Frames 970-1010**: Second line enters at Y: 860, centered:
  `BlurText startFrame={975} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "Billions of times a second."
  Key line — accent color (insightOrange). Slightly larger than line 1 for emphasis.

- **Frames 1010-1050**: Third line enters at Y: 950, centered:
  `BlurText startFrame={1015} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "That's all there is underneath."
  Understated — muted color, slightly smaller.

- **Frames 1050-1080**: Subtle radial glow fades in behind the accent-colored second line — insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 860. Opacity interpolates from 0% to 4% over 20 frames starting at frame 1055. A second, wider glow (techBlue #3B82F6 at 2% opacity, 600px radius, Y: 860) fades in at frame 1060 over 20 frames — creates a warm halo with blue edge.

- **Frames 1080-1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. Glows hold steady. Vignette holds. The message lands.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 900,
  VIGNETTE_IN: 910,
  LINE_1_START: 935,
  LINE_2_START: 975,
  LINE_3_START: 1015,
  GLOW_ORANGE_IN: 1055,
  GLOW_BLUE_IN: 1060,
  HOLD_START: 1080,
  SCENE_END: 1140,
};
```

**Components:** BlurText (x3), Vignette, AmbientBackground
**Background:** dark (#0A0A0F)
