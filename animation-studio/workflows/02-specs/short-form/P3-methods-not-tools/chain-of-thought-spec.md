# Chain of Thought

## Overview
- **ID**: T-29
- **Slug**: chain-of-thought
- **Pillar**: P3 (Methods, Not Tools)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P3-methods-not-tools/chain-of-thought-review.md
- **Accent colors**: techBlue (#3B82F6), insightOrange (#F59E0B), solutionGreen (#10B981), errorRed (#EF4444)
- **Core metaphor**: Asking a model to think step by step turns a single fragile leap into a chain of short, sturdy links -- each intermediate step becomes context that strengthens the next prediction.
- **Key visual**: A chain of glowing links forming one by one, each link feeding forward into the next, building from a wrong answer to a correct one -- the chain is stronger than the single leap.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | errorRed #EF4444 | Frustration, failure |
| Context | techBlue #3B82F6 | Analytical, mechanical |
| Core | insightOrange #F59E0B → solutionGreen #10B981 | Discovery building to success |
| Resolution | solutionGreen #10B981 | Understanding, payoff |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### PromptBlock

A styled prompt input panel showing user text being sent to a model.

- **Props:** `text: string, highlight?: string, startFrame: number, width?: number, y?: number`
- **Panel:** 880w, surface (#12121A) fill, 12px border-radius, 2px border panelBorder (#1A1A24), 32px padding
- **Top row:** three 10px circles (red #EF4444, amber #F59E0B, green #10B981) with 8px gap, 16px from top
- **Prompt label:** "PROMPT" in Inter 500, 20px, textDim (#6B7280), left-aligned, below dots row
- **Body text:** Inter 400, 36px, textBright (#FFFFFF), 16px below label
- **Highlight phrase:** if `highlight` prop provided, that substring renders in insightOrange (#F59E0B) with `ShinyText` shine sweep
- **Panel entrance:** opacity 0 to 1 + scale 0.96 to 1.0 (spring: gentle) starting at `startFrame`
- **Blinking cursor** after last character: 2px wide, textBright, toggles every 15 frames via `Math.sin(frame * 0.2) > 0`

### ModelOutputPanel

A panel showing a model's response -- either a direct answer or step-by-step reasoning.

- **Props:** `lines: Array<{text: string, status: 'step' | 'answer' | 'wrong', startFrame: number}>, width?: number, y?: number, panelStartFrame: number`
- **Panel:** 880w, surface (#12121A) fill, 12px border-radius, 2px border panelBorder (#1A1A24), 32px padding
- **Header row:** "MODEL OUTPUT" in Inter 500, 20px, textDim (#6B7280), left-aligned. Blinking dot indicator: 8px circle, solutionGreen (#10B981) pulsing via `Math.sin(frame * 0.1) * 0.3 + 0.7` opacity
- **Each line renders sequentially:**
  - `status: 'step'` -- left marker: 6px solutionGreen circle, text in Inter 400, 32px, textBright (#FFFFFF). Typewriter reveal at 1.5 chars/frame with block cursor
  - `status: 'answer'` -- left marker: 8px solutionGreen filled circle with glow (solutionGreen at 30% opacity, 12px radius), text in Inter 600, 36px, solutionGreen (#10B981)
  - `status: 'wrong'` -- left marker: 8px errorRed filled circle, text in Inter 600, 36px, errorRed (#EF4444). `GlitchBurst` wraps text (burstDuration: 12, burstInterval: 60)
- **Panel entrance:** opacity 0 to 1 + translateY from 30px to 0 (spring: snappy) starting at `panelStartFrame`

### ChainLink

A single link in the reasoning chain visualization.

- **Props:** `label: string, index: number, startFrame: number, color: string, x: number, y: number, width?: number, height?: number`
- **Shape:** Rounded rectangle, 220w x 70h, 16px border-radius, filled with `color` at 12% opacity, 2px border in `color`
- **Label:** Inter 500, 28px, `color`, centered
- **Entrance:** scale from 0.3 to 1.0 + opacity 0 to 1 (spring: bouncy), with a radial glow behind (color at 8% opacity, 80px radius) that peaks at 15% at `startFrame + 10` then settles to 8%
- **Connector line:** SVG line from right edge of this link to left edge of the next link, 2px stroke in `color` at 40% opacity, draws via strokeDashoffset over 12 frames starting at `startFrame + 8`
- **Arrow chevron:** 6px at the end of connector line, matching color
- **Idle pulse:** border opacity oscillates `Math.sin((frame - startFrame) * 0.06) * 0.15 + 0.85` after entrance completes

### SingleLeap

A single large arc connecting input to output, representing a direct (fragile) prediction.

- **Props:** `startFrame: number, fromX: number, fromY: number, toX: number, toY: number, color: string`
- **Shape:** SVG quadratic bezier arc, 3px dashed stroke (dash: 8, gap: 6), `color` at 50% opacity
- **Draw animation:** strokeDashoffset interpolates over 30 frames starting at `startFrame`
- **Break animation:** at `startFrame + 40`, the arc shatters -- opacity interpolates to 0 over 15 frames, dashes scatter with random translateY offsets (-10 to +10px) using noise per segment
- **Label:** "single leap" in Inter 400, 24px, `color` at 60% opacity, positioned at arc midpoint, fades in at `startFrame + 10` and fades out with the arc

---

## Scene Breakdown

### Scene 1: Hook -- "Wrong Answer" (0s-3s, frames 0-90)

**Narration:** > "When you ask an AI to solve a complex problem, it often gets it wrong. But if you add five words to your prompt, accuracy jumps dramatically."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F) with `AmbientBackground` (particleCount: 25, color: #EF4444 at 10% opacity, speed: 0.4). `Vignette` overlay (opacity: 0.6). At Y: 400, centered: `AnimatedText variant="title" size={56} color="#E5E7EB" entrance="fade" startFrame={0} springPreset="snappy"` reading "Complex Problem". At Y: 480: `AnimatedText variant="code" size={36} color="#3B82F6" entrance="fade" startFrame={5} springPreset="snappy"` reading "What is 47 x 83 + 192 / 4?".

- **Frames 15-35**: Below at Y: 600: a thin horizontal arrow draws left-to-right (2px, textDim #6B7280, 200px wide, centered) over 10 frames starting at frame 15 via strokeDashoffset. At frame 25, at Y: 680: `AnimatedText variant="title" size={52} color="#EF4444" entrance="scale" startFrame={25} springPreset="bouncy"` reading "3,872". Wrapped in `GlitchBurst startFrame={25} burstDuration={15} burstInterval={90} fontSize={52}`.

- **Frames 35-50**: Red X mark fades in beside the wrong answer at frame 35 -- 40px, errorRed (#EF4444), opacity 0 to 1 over 10 frames. `AnimatedText variant="label" size={28} color="#EF4444" entrance="fade" startFrame={38} springPreset="snappy"` reading "WRONG" positioned right of the X. Screen shakes: container translateX oscillates +/- 4px for 8 frames (2 cycles) starting frame 35.

- **Frames 50-70**: All elements dim -- opacity interpolates from 1.0 to 0.3 over 15 frames starting at frame 50. At Y: 1100, centered: `AnimatedText variant="body" size={44} color="#F59E0B" entrance="slideUp" startFrame={55} springPreset="gentle"` reading "But add five words...".

- **Frames 70-90**: "But add five words..." text pulses -- opacity oscillates `Math.sin((frame - 70) * 0.15) * 0.15 + 0.85` for emphasis. All dimmed elements above fade out fully (opacity 0.3 to 0 over 20 frames). Transition to Scene 2.

**BEATS:**
```typescript
const BEATS = {
  BG_IN: 0,
  PROBLEM_TEXT_IN: 0,
  MATH_EQUATION_IN: 5,
  ARROW_DRAW: 15,
  WRONG_ANSWER_IN: 25,
  GLITCH_BURST: 25,
  RED_X_IN: 35,
  WRONG_LABEL: 38,
  SCREEN_SHAKE: 35,
  ALL_DIM: 50,
  FIVE_WORDS_IN: 55,
  FIVE_WORDS_PULSE: 70,
  ELEMENTS_FADE_OUT: 70,
  SCENE_END: 90,
};
```

**Components:** AnimatedText, GlitchBurst, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context -- "The Five Words" (3s-10s, frames 90-300)

**Narration:** > "'Think through this step by step.' Here's why that works. Language models predict the next token based on what came before. When you ask for a direct answer, the model has to make one prediction."

**Visuals:**

- **Frames 90-130**: Clean dark bg (#0A0A0F). `AmbientBackground` particles shift color from errorRed to techBlue (color interpolates #EF4444 to #3B82F6 over 40 frames). Center screen at Y: 850: `BlurText startFrame={95} animateBy="words" direction="bottom" staggerDelay={5} blurAmount={10} distance={25} fontSize={48} color="#F59E0B"` reading "Think through this step by step." -- the key phrase, insightOrange. Radial glow behind text: insightOrange at 5% opacity, 350px radius, fades in over 15 frames starting frame 100.

- **Frames 130-165**: The phrase holds centered for 20 frames (beat). At frame 150, the phrase begins rising -- translateY interpolates from Y: 850 to Y: 250 over 15 frames (spring: gentle). Simultaneously scales from 1.0 to 0.75 and opacity from 1.0 to 0.6. It becomes a header reference at the top.

- **Frames 165-210**: At Y: 500, centered: `PromptBlock text="What is 47 x 83 + 192 / 4?" startFrame={165} width={880}`. Panel slides in (spring: gentle). At frame 185, below the PromptBlock at Y: 720: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="fade" startFrame={185} springPreset="gentle"` reading "Direct answer =". At frame 195: `AnimatedText variant="body" size={40} color="#9CA3AF" entrance="fade" startFrame={195} springPreset="gentle"` reading "one prediction" positioned right of the equals sign.

- **Frames 210-250**: At Y: 860, centered: `SingleLeap startFrame={210} fromX={240} fromY={860} toX={840} toY={860} color="#EF4444"`. The dashed arc draws across the screen -- a single fragile jump from input to output. Label "single leap" fades in at arc midpoint. At frame 240: the text "one prediction" at Y: 720 highlights -- color shifts from #9CA3AF to #EF4444 over 10 frames (interpolate on RGB channels).

- **Frames 250-280**: `SingleLeap` break animation triggers at frame 250 -- arc shatters, dashes scatter, opacity to 0 over 15 frames. "one prediction" wrapped in `GlitchBurst startFrame={250} burstDuration={12} burstInterval={120} fontSize={40}` -- brief glitch to sell the fragility. PromptBlock border flashes errorRed (2px solid #EF4444) for 4 frames at frame 252, then returns to panelBorder.

- **Frames 280-300**: All elements below the header phrase fade out (opacity to 0 over 20 frames, spring: gentle). Clean transition space for Scene 3. The header phrase "Think through this step by step." remains at Y: 250, 75% scale, 60% opacity.

**BEATS:**
```typescript
const BEATS = {
  PARTICLES_COLOR_SHIFT: 90,
  FIVE_WORDS_REVEAL: 95,
  GLOW_IN: 100,
  PHRASE_HOLD: 130,
  PHRASE_RISE: 150,
  PROMPT_BLOCK_IN: 165,
  DIRECT_ANSWER_LABEL: 185,
  ONE_PREDICTION_LABEL: 195,
  SINGLE_LEAP_DRAW: 210,
  ONE_PREDICTION_HIGHLIGHT: 240,
  LEAP_SHATTER: 250,
  GLITCH_BURST: 250,
  BORDER_FLASH: 252,
  ELEMENTS_FADE_OUT: 280,
  SCENE_END: 300,
};
```

**Components:** BlurText, PromptBlock, SingleLeap, AnimatedText, GlitchBurst, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 3: Core -- "The Chain Builds" (10s-22s, frames 300-660)

**Narration:** > "When you ask it to think step by step, each intermediate step becomes context for the next prediction. The model is essentially showing its work, and each piece of work improves the next piece. It's the same reason teachers ask students to show their work. Not to verify the process. Because the process improves the answer."

**Visuals:**

The header phrase "Think through this step by step." persists at Y: 250 (75% scale, 60% opacity) from Scene 2.

- **Frames 300-340**: At Y: 420: `PromptBlock text="What is 47 x 83 + 192 / 4?" highlight="Think step by step" startFrame={300} width={880}`. The prompt now includes the magic phrase, highlighted in insightOrange with `ShinyText` shine sweep starting at frame 310 (shineColor: #FFFFFF, duration: 30). Panel entrance: spring gentle, 20 frames.

- **Frames 340-390**: Below at Y: 640: `ModelOutputPanel panelStartFrame={340}` with step-by-step lines entering sequentially:
  - `{text: "Step 1: 47 x 83 = 3,901", status: "step", startFrame: 350}` -- typewriter reveals at 1.5 chars/frame, solutionGreen dot marker
  - At frame 355: First `ChainLink label="47 x 83" index={0} startFrame={355} color="#10B981" x={100} y={1250}` appears at Y: 1250 (the chain visualization row below the panels). Bouncy entrance, glow peaks.

- **Frames 390-440**: Second step types in:
  - `{text: "Step 2: 192 / 4 = 48", status: "step", startFrame: 395}` -- typewriter continues
  - At frame 400: `ChainLink label="192 / 4" index={1} startFrame={400} color="#10B981" x={340} y={1250}`. Connector line draws from first link's right edge to this link's left edge over 12 frames. Each completed link's border starts idle pulse.

- **Frames 440-490**: Third step types in:
  - `{text: "Step 3: 3,901 + 48 = 3,949", status: "step", startFrame: 445}` -- typewriter continues
  - At frame 450: `ChainLink label="3,901 + 48" index={2} startFrame={450} color="#10B981" x={580} y={1250}`. Connector draws from second link. Three links now form a visible chain. Previous links' glow settles to 8% idle state.

- **Frames 490-530**: Final answer line:
  - `{text: "Answer: 3,949", status: "answer", startFrame: 495}` -- solutionGreen, bold, with glow on left dot
  - At frame 500: `ChainLink label="= 3,949" index={3} startFrame={500} color="#10B981" x={820} y={1250}`. This final link has a thicker border (3px) and brighter glow (15% resting opacity). Connector draws from third link. Full chain complete.

- **Frames 530-560**: Checkmark appears beside the final answer in ModelOutputPanel -- solutionGreen, 36px, scale from 0.5 to 1.0 (spring: bouncy) at frame 530. The entire chain row (Y: 1250) pulses once: all four links' border opacity spikes to 100% simultaneously at frame 535 then relaxes back to idle over 15 frames. `AnimatedText variant="label" size={24} color="#10B981" entrance="fade" startFrame={535} springPreset="snappy"` reading "CORRECT" beside the checkmark.

- **Frames 560-600**: PromptBlock and ModelOutputPanel begin dimming -- opacity interpolates from 1.0 to 0.2 over 30 frames starting at frame 560. The chain links at Y: 1250 rise -- translateY interpolates from Y: 1250 to Y: 800 over 30 frames (spring: gentle). They become the central focus. Scale interpolates from 1.0 to 1.3 over same range. The chain is now the hero element.

- **Frames 600-640**: Header phrase fades out (opacity 0.6 to 0 over 15 frames). Above the chain at Y: 680: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="fade" startFrame={605} springPreset="gentle"` reading "Each step feeds the next". At Y: 950 below the chain: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={615} springPreset="gentle"` reading "The process improves the answer."

- **Frames 640-660**: Dimmed panels (PromptBlock and ModelOutputPanel) fade out fully (opacity 0.2 to 0 over 20 frames). Chain links and text labels hold visible. Transition to Scene 4.

**BEATS:**
```typescript
const BEATS = {
  PROMPT_WITH_COT_IN: 300,
  SHINE_SWEEP: 310,
  OUTPUT_PANEL_IN: 340,
  STEP_1_TYPE: 350,
  CHAIN_LINK_1: 355,
  STEP_2_TYPE: 395,
  CHAIN_LINK_2: 400,
  STEP_3_TYPE: 445,
  CHAIN_LINK_3: 450,
  FINAL_ANSWER_TYPE: 495,
  CHAIN_LINK_4: 500,
  CHECKMARK_IN: 530,
  CHAIN_PULSE: 535,
  CORRECT_LABEL: 535,
  PANELS_DIM: 560,
  CHAIN_RISE: 560,
  HEADER_FADE: 600,
  EACH_STEP_LABEL: 605,
  PROCESS_LABEL: 615,
  PANELS_FADE_OUT: 640,
  SCENE_END: 660,
};
```

**Components:** PromptBlock, ModelOutputPanel, ChainLink (x4), ShinyText, AnimatedText, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution -- "Chain vs Leap" (22s-30s, frames 660-900)

**Narration:** > "Five words. Measurably better results. The simplest upgrade you'll make to any prompt."

**Visuals:**

- **Frames 660-700**: Chain links (4 links) still centered at Y: 800, scale 1.3. The labels "Each step feeds the next" and "The process improves the answer" fade out (opacity to 0 over 15 frames starting frame 660). At Y: 500: `SingleLeap startFrame={665} fromX={200} fromY={500} toX={880} toY={500} color="#EF4444"`. Dashed arc draws across -- the fragile single leap from Scene 2, reprised above the chain for visual comparison.

- **Frames 700-730**: At Y: 430, centered above the leap: `AnimatedText variant="label" size={28} color="#EF4444" entrance="fade" startFrame={700} springPreset="snappy"` reading "WITHOUT step-by-step". At Y: 750, centered above the chain: `AnimatedText variant="label" size={28} color="#10B981" entrance="fade" startFrame={705} springPreset="snappy"` reading "WITH step-by-step". Visual split: fragile leap on top (red), sturdy chain below (green). Both visible simultaneously for direct comparison.

- **Frames 730-760**: The `SingleLeap` break animation triggers at frame 730 -- arc shatters, dashes scatter to opacity 0 over 15 frames. "WITHOUT step-by-step" label dims to 30% opacity over 10 frames. Meanwhile the chain links scale up slightly from 1.3 to 1.4 (spring: gentle, 15 frames) and each link's glow brightens from 8% to 15% opacity. The chain wins the comparison visually.

- **Frames 760-810**: All comparison elements (broken leap remnants, labels) fade out -- opacity to 0 over 20 frames starting frame 760. Chain links remain centered, scale settles back to 1.2 (spring: gentle). At Y: 1100: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" startFrame={775} springPreset="bouncy"` reading "Five words." Wrapped in `ShinyText startFrame={780} shineColor="#FFFFFF" duration={30} fontSize={52}`.

- **Frames 810-850**: Below "Five words." at Y: 1200: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="slideUp" startFrame={815} springPreset="gentle"` reading "Measurably better results." At frame 825, chain links begin final dim -- opacity interpolates from 1.0 to 0.3 over 20 frames. Scale interpolates from 1.2 to 0.9 (spring: gentle). They recede, letting the text message dominate.

- **Frames 850-900**: All remaining elements fade out -- chain links and text opacity interpolate from current values to 0 over 50 frames (spring: slow). Scene breathes out to clean black.

**BEATS:**
```typescript
const BEATS = {
  LABELS_FADE_OUT: 660,
  SINGLE_LEAP_REPRISE: 665,
  WITHOUT_LABEL: 700,
  WITH_LABEL: 705,
  LEAP_SHATTER: 730,
  WITHOUT_DIM: 730,
  CHAIN_BRIGHTEN: 730,
  COMPARISON_FADE: 760,
  FIVE_WORDS_IN: 775,
  SHINE_SWEEP: 780,
  BETTER_RESULTS_IN: 815,
  CHAIN_DIM: 825,
  FADE_TO_BLACK: 850,
  SCENE_END: 900,
};
```

**Components:** ChainLink (x4), SingleLeap, AnimatedText, ShinyText
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 800, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "Think through this step by step."

- **Frames 1000-1050**: Second line enters at Y: 890, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "The simplest upgrade to any prompt."
  Key line -- accent color (insightOrange). Larger font to assert hierarchy.

- **Frames 1040-1070**: Third line enters at Y: 980, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={38} color="#9CA3AF"`:
  "Five words. Better results."
  Understated -- muted color, slightly smaller.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 890. Opacity interpolates from 0% to 4% over 20 frames.

- **Frames 1080-1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. The message lands.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 900,
  VIGNETTE_IN: 920,
  LINE_1_START: 940,
  LINE_2_START: 1000,
  LINE_3_START: 1040,
  GLOW_IN: 1060,
  HOLD_START: 1080,
  SCENE_END: 1140,
};
```

**Components:** BlurText (x3), Vignette
**Background:** dark (#0A0A0F)
