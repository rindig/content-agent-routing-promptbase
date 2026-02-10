# AI Demos Are Misleading

## Overview
- **ID**: T-42
- **Slug**: ai-demos-misleading
- **Pillar**: P5 (The Honest Take)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P5-honest-take/ai-demos-misleading-review.md
- **Accent colors**: insightOrange (#F59E0B), aiPurple (#8B5CF6), solutionGreen (#10B981), errorRed (#EF4444), techBlue (#3B82F6)
- **Core metaphor**: AI demos are highlight reels, not daily footage -- the gap between best-case and typical output is the gap you need to measure before adopting.
- **Key visual**: Ten output cards generated, nine dimmed as rejects, one cherry-picked and spotlit as "The Demo" -- then the curtain pulls back to reveal the messy reality behind it.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | aiPurple #8B5CF6 | Awe, polished impression |
| Context | insightOrange #F59E0B | Caution, the catch |
| Core | techBlue #3B82F6 vs errorRed #EF4444 | Analytical contrast, deterministic vs probabilistic |
| Resolution | solutionGreen #10B981 | Pragmatic solution, testing mindset |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### DemoOutputCard
A card representing one AI-generated output sample. Used in the cherry-picking sequence.

- **Props:** `index: number, quality: "great" | "okay" | "poor", selected: boolean, startFrame: number, dimFrame?: number, label?: string`
- Card: 200w x 260h, surface (#12121A) fill, 12px border-radius, 2px border panelBorder (#1A1A24)
- Interior: abstract wavy lines (3 horizontal lines, varying widths 60-160px, heights 4px, staggered at Y: 60, 110, 160 inside card) colored by quality:
  - `"great"`: lines in solutionGreen #10B981
  - `"okay"`: lines in textMuted #9CA3AF
  - `"poor"`: lines in errorRed #EF4444 with one line jagged/broken (2px gap mid-line)
- Label badge (optional): 20px text, positioned top-right inside card with 8px padding, bg matching quality color at 20% opacity
- **Entrance:** opacity 0 to 1 + scale 0.9 to 1.0 (spring: snappy) starting at `startFrame`
- **Dim phase:** at `dimFrame`, opacity interpolates from 1.0 to 0.15 over 15 frames, scale to 0.92 (spring: gentle)
- **Selected state:** `selected=true` adds 3px border in insightOrange #F59E0B, radial glow behind card (insightOrange at 8% opacity, 180px radius), and a `ShinyText` label "THE DEMO" (16px, insightOrange) beneath the card

### ComparisonPanel
Split-panel showing deterministic vs probabilistic behavior side by side (vertical stack for 9:16).

- **Props:** `topLabel: string, bottomLabel: string, topColor: string, bottomColor: string, startFrame: number, dividerFrame: number`
- Top panel: 900w x 560h, surface (#12121A) fill, 12px radius, 2px left border in `topColor`, positioned at Y: 340
- Bottom panel: same dimensions, 2px left border in `bottomColor`, positioned at Y: 940
- Labels: Inter 600, 36px, `topColor`/`bottomColor` respectively, top-left inside each panel with 32px padding
- Corner brackets on each panel: 14x14px L-shaped borders in respective color at 40% opacity
- **Divider:** At `dividerFrame`, a 2px horizontal line (textDim #6B7280 at 30% opacity, 900w) draws left-to-right at Y: 920 over 20 frames (interpolate on width)
- Top panel entrance: opacity 0 to 1, translateY from -30 to 0 (spring: snappy)
- Bottom panel entrance: same, staggered +15 frames, translateY from +30 to 0

### InputBlock
A small pill-shaped tag representing an input data sample.

- **Props:** `text: string, variant: "clean" | "messy", color: string, startFrame: number, x: number, y: number`
- Pill: auto-width (text length * 14 + 32px padding), 36px height, 18px border-radius
- `"clean"`: solid `color` fill at 15% opacity, 1px border in `color`, text in `color` at 80% opacity, Inter 400 22px
- `"messy"`: dashed 1px border in `color`, text in `color`, fill at 8% opacity, text slightly rotated (rotateZ: -2 to 2 degrees, random per instance)
- Entrance: scale 0 to 1 (spring: bouncy), staggered per instance

---

## Scene Breakdown

### Scene 1: Hook -- The Perfect Demo (0s-3s, frames 0-90)

**Narration:** > "Every AI demo you've ever seen was designed to show you the best possible outcome."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #8B5CF6 at 12% opacity, speed: 0.4). `Vignette` (opacity: 0.5). Center screen at Y: 700: a single `DemoOutputCard index={0} quality="great" selected={false} startFrame={0}` scales in from 0.8 to 1.0 (spring: bouncy). Card is large -- scaled up 1.6x for hero presentation (320w x 416h effective). Lines inside shimmer with `ShinyText` sweep (shineColor: #FFFFFF, duration: 40, startFrame: 5).

- **Frames 15-40**: Above the card at Y: 380: `AnimatedText variant="label" size={28} color="#8B5CF6" entrance="fade" startFrame={15} springPreset="gentle"` reading "AI DEMO". Below the card label, a thin horizontal line (aiPurple #8B5CF6 at 30% opacity, width interpolates from 0 to 200px over 20 frames starting frame 18, centered). At frame 25, a subtle pulse ring expands outward from card center -- 2px aiPurple border circle, radius interpolates from 160px to 300px, opacity from 0.3 to 0 over 15 frames.

- **Frames 40-65**: The card gains a glow -- radial gradient behind it (aiPurple #8B5CF6 at 6% opacity, 400px radius, fades in over 15 frames). Card border transitions from panelBorder to aiPurple #8B5CF6 at 60% opacity over 10 frames. A small badge `AnimatedText variant="label" size={20} color="#10B981" entrance="scale" startFrame={45} springPreset="snappy"` reading "IMPRESSIVE" appears top-right of card with solutionGreen bg at 15% opacity, 8px padding, 6px border-radius.

- **Frames 65-90**: Everything begins to dim. Card glow fades -- opacity interpolates from 6% to 2% over 25 frames. "IMPRESSIVE" badge opacity to 0.4. "AI DEMO" label opacity to 0.5. The mood shifts -- the demo is being questioned. The card itself stays at full opacity but the supporting elements retreat.

**BEATS:**
```typescript
const BEATS = {
  CARD_IN: 0,
  SHIMMER_START: 5,
  DEMO_LABEL_IN: 15,
  UNDERLINE_DRAW: 18,
  PULSE_RING: 25,
  GLOW_IN: 40,
  BORDER_HIGHLIGHT: 40,
  IMPRESSIVE_BADGE: 45,
  ELEMENTS_DIM_START: 65,
  GLOW_FADE: 65,
  BADGE_DIM: 70,
  LABEL_DIM: 75,
  SCENE_END: 90,
};
```

**Components:** DemoOutputCard, AnimatedText, ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context -- Cherry-Picking Revealed (3s-10s, frames 90-300)

**Narration:** > "That's not deception. It's just how demos work. But it creates a specific problem with AI. Because the gap between 'best possible outcome' and 'typical outcome' is much wider with AI than with traditional software."

**Visuals:**

- **Frames 90-130**: The hero DemoOutputCard from Scene 1 shrinks -- scale interpolates from 1.6 to 1.0 over 20 frames (spring: snappy) and translates to position at grid slot top-right (X: 720, Y: 340). Simultaneously, 9 additional `DemoOutputCard` instances enter in a 5x2 grid (5 columns, 2 rows), arranged at Y: 340 and Y: 640, X positions at 100, 255, 410, 565, 720. Cards staggered by 4 frames each, starting at frame 95. Quality distribution: indices 1-3 `"okay"`, indices 4-6 `"poor"`, indices 7-8 `"okay"`, index 9 `"poor"`. The original card takes position (720, 340) as index 0 `"great"`.

- **Frames 130-170**: All cards visible. At frame 135, cards begin dimming in sequence -- indices 9, 8, 7, 6, 5, 4, 3, 2, 1 dim one by one (dimFrame staggered by 4 frames: 135, 139, 143, 147, 151, 155, 159, 163, 167). Each dims to opacity 0.15, scale 0.92. A red "X" mark (errorRed #EF4444, 20px, Inter 700) fades in on each dimmed card 5 frames after its dim starts. Only card 0 remains bright.

- **Frames 170-210**: Card 0 (the "great" one) gets the selected treatment: 3px insightOrange #F59E0B border fades in over 10 frames, radial glow behind it (insightOrange at 8% opacity, 180px radius). Below it: `ShinyText startFrame={180} shineColor="#FFFFFF" duration={30} fontSize={20} color="#F59E0B"` reading "THE DEMO". Above all cards at Y: 220: `AnimatedText variant="title" size={48} color="#F59E0B" entrance="slideUp" startFrame={175} springPreset="gentle"` reading "Best of 10". A `CountUp from={1} to={10} startFrame={175} duration={20} fontSize={48} color="#F59E0B"` renders inline for the "10".

- **Frames 210-250**: Transition beat. The 9 dimmed cards fade out entirely (opacity to 0 over 20 frames starting frame 210). "Best of 10" title fades out. The selected card 0 translates to center screen (X: 440, Y: 500, spring: gentle, 25 frames). Below it at Y: 780: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="fade" startFrame={225} springPreset="gentle"` reading "The gap is wider with AI". The word "wider" wrapped in `GradientText colors={["#F59E0B", "#EF4444"]} direction="horizontal" duration={90} fontSize={40}`.

- **Frames 250-300**: The selected card shrinks to 0.6 scale and translates up to Y: 300 (spring: gentle, 30 frames). Below it, a simple gap visualization appears: two horizontal lines at Y: 600 and Y: 900. Top line labeled "Demo quality" (insightOrange #F59E0B, 24px) at Y: 580, bottom line labeled "Typical quality" (textMuted #9CA3AF, 24px) at Y: 920. Lines draw left-to-right (width 0 to 700px, 20 frames, starting frame 260). A vertical double-headed arrow draws between them at X: 540 (errorRed #EF4444, 2px, starting frame 275, draw duration 15 frames). Arrow label: `AnimatedText variant="label" size={28} color="#EF4444" entrance="scale" startFrame={280} springPreset="bouncy"` reading "THE GAP" at X: 580, Y: 750.

**BEATS:**
```typescript
const BEATS = {
  HERO_SHRINK: 90,
  GRID_CARDS_START: 95,
  GRID_COMPLETE: 130,
  DIM_SEQUENCE_START: 135,
  DIM_SEQUENCE_END: 167,
  SELECTED_BORDER: 170,
  THE_DEMO_LABEL: 180,
  BEST_OF_10_IN: 175,
  REJECTS_FADE_OUT: 210,
  CARD_CENTER: 210,
  GAP_TEXT_IN: 225,
  CARD_SHRINK_UP: 250,
  GAP_TOP_LINE: 260,
  GAP_BOTTOM_LINE: 260,
  GAP_ARROW_DRAW: 275,
  THE_GAP_LABEL: 280,
  SCENE_END: 300,
};
```

**Components:** DemoOutputCard (x10), ShinyText, AnimatedText, CountUp, GradientText
**Background:** dark (#0A0A0F)

---

### Scene 3: Core -- Deterministic vs Probabilistic (10s-22s, frames 300-660)

**Narration:** > "Traditional software is deterministic. If it works in the demo, it works in production. The same input gives the same output. AI is probabilistic. The demo shows you the output from the best seed, the cleanest input, the most favorable conditions. Real-world inputs are messier, noisier, weirder."

**Visuals:**

- **Frames 300-330**: Previous elements fade out (opacity to 0 over 20 frames). Clean dark bg. At frame 315: `ComparisonPanel topLabel="TRADITIONAL SOFTWARE" bottomLabel="AI MODEL" topColor="#3B82F6" bottomColor="#8B5CF6" startFrame={315} dividerFrame={325}`. Top panel slides in from Y: -30 (spring: snappy). Divider line draws at frame 325.

- **Frames 330-345**: Bottom panel enters, translateY from +30 to 0 (spring: snappy), staggered 15 frames after top.

- **Frames 345-405**: Inside top panel ("TRADITIONAL SOFTWARE"): Three `InputBlock` pills enter left side at X: 60, staggered by 8 frames (startFrame: 345, 353, 361). All `variant="clean"` in techBlue #3B82F6:
  - `text="input_A" x={60} y={420}`
  - `text="input_B" x={60} y={470}`
  - `text="input_C" x={60} y={520}`

  At frame 370, a right-pointing arrow draws from X: 280 to X: 500 at Y: 470 (techBlue, 2px, 15 frames). At frame 385, three output pills enter right side, all identical, `variant="clean"` in solutionGreen #10B981:
  - `text="output_1" x={520} y={420}`
  - `text="output_1" x={520} y={470}`
  - `text="output_1" x={520} y={520}`

  All outputs are the same -- "output_1" -- visually demonstrating determinism. At frame 395, a small check mark (solutionGreen, 24px) fades in at X: 780, Y: 470. Below the panel internals at Y: 580 inside the panel: `AnimatedText variant="label" size={24} color="#3B82F6" entrance="fade" startFrame={400} springPreset="gentle"` reading "Same input = Same output".

- **Frames 405-500**: Inside bottom panel ("AI MODEL"): Three `InputBlock` pills enter left side, staggered by 8 frames (startFrame: 405, 413, 421). All `variant="clean"` in aiPurple #8B5CF6:
  - `text="prompt_A" x={60} y={1020}`
  - `text="prompt_A" x={60} y={1070}`
  - `text="prompt_A" x={60} y={1120}`

  Note: same input repeated three times. At frame 430, a right-pointing arrow draws (aiPurple, 2px, X: 280 to 500, Y: 1070, 15 frames). At frame 445, three output pills enter right side, each DIFFERENT, `variant="messy"`:
  - `text="result_v1" x={520} y={1020} color="#10B981"` (good -- solutionGreen)
  - `text="result_v2" x={520} y={1070} color="#9CA3AF"` (mediocre -- textMuted)
  - `text="result_v3" x={520} y={1120} color="#EF4444"` (poor -- errorRed)

  Staggered by 6 frames. At frame 470, a warning triangle icon (insightOrange #F59E0B, 24px) fades in at X: 780, Y: 1070. At Y: 1180 inside panel: `AnimatedText variant="label" size={24} color="#8B5CF6" entrance="fade" startFrame={475} springPreset="gentle"` reading "Same input = Different outputs".

- **Frames 500-560**: Emphasis phase. Top panel border brightens -- left border opacity pulses from 0.6 to 1.0 and back using `Math.sin((frame - 500) * 0.1) * 0.2 + 0.8` over 60 frames. The deterministic label "Same input = Same output" gets a subtle solutionGreen glow (text-shadow: 0 0 12px #10B981 at 30% opacity, fading in over 15 frames at frame 505).

  Bottom panel: the three different outputs each get a brief `GlitchBurst` wrap (burstInterval: 60, burstDuration: 8, starting at frame 510). The outputs flicker slightly -- suggesting instability. The warning triangle pulses (scale oscillation 1.0 to 1.1, `Math.sin((frame - 510) * 0.15) * 0.05 + 1.0`).

- **Frames 560-600**: New text overlays the comparison. Between the two panels at Y: 910 (over the divider line): `AnimatedText variant="title" size={44} color="#F59E0B" entrance="scale" startFrame={565} springPreset="bouncy"` reading "Best seed. Cleanest input." Then at frame 580: `AnimatedText variant="body" size={36} color="#F59E0B" entrance="fade" startFrame={580} springPreset="gentle"` reading "Most favorable conditions." at Y: 960. Both use insightOrange to call out the cherry-picking.

- **Frames 600-660**: Transition out. Both panels begin dimming -- opacity interpolates from 1.0 to 0.2 over 30 frames starting at frame 600. The overlay text ("Best seed...") stays at full opacity for 20 more frames, then fades (opacity to 0, frames 620-650). At frame 630, the entire layout scales down from 1.0 to 0.9 (spring: gentle, 30 frames) and shifts up slightly (translateY: -40px). Prepares clean exit.

**BEATS:**
```typescript
const BEATS = {
  PREV_FADE_OUT: 300,
  TOP_PANEL_IN: 315,
  DIVIDER_DRAW: 325,
  BOTTOM_PANEL_IN: 330,
  TRAD_INPUT_1: 345,
  TRAD_INPUT_2: 353,
  TRAD_INPUT_3: 361,
  TRAD_ARROW_DRAW: 370,
  TRAD_OUTPUT_1: 385,
  TRAD_OUTPUT_2: 389,
  TRAD_OUTPUT_3: 393,
  TRAD_CHECK: 395,
  TRAD_LABEL_IN: 400,
  AI_INPUT_1: 405,
  AI_INPUT_2: 413,
  AI_INPUT_3: 421,
  AI_ARROW_DRAW: 430,
  AI_OUTPUT_1: 445,
  AI_OUTPUT_2: 451,
  AI_OUTPUT_3: 457,
  AI_WARNING: 470,
  AI_LABEL_IN: 475,
  TOP_PANEL_PULSE: 500,
  TRAD_LABEL_GLOW: 505,
  AI_GLITCH_START: 510,
  BEST_SEED_TEXT: 565,
  FAVORABLE_TEXT: 580,
  PANELS_DIM: 600,
  OVERLAY_FADE: 620,
  SCALE_DOWN: 630,
  SCENE_END: 660,
};
```

**Components:** ComparisonPanel, InputBlock (x9), AnimatedText, GlitchBurst
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution -- Test It Differently (22s-30s, frames 660-900)

**Narration:** > "This isn't a reason to distrust AI. It's a reason to test it differently. Don't evaluate AI on what it does with perfect inputs. Evaluate it on what it does with your actual data, in your actual conditions, at your actual scale."

**Visuals:**

- **Frames 660-690**: Previous elements complete their fade to 0 (carried from Scene 3). Clean dark bg. At frame 670: `AnimatedText variant="title" size={52} color="#10B981" entrance="scale" startFrame={670} springPreset="bouncy"` reading "Test it differently." centered at Y: 500. The word "differently" wrapped in `ShinyText startFrame={675} shineColor="#FFFFFF" duration={40} fontSize={52}`.

- **Frames 690-720**: Title translates up to Y: 280 (spring: gentle, 20 frames) and scales to 0.85. Below it, a testing framework panel appears: surface bg (#12121A), 900w x 900h, 12px radius, 2px border solutionGreen #10B981 at 40% opacity, positioned at Y: 400. Top row inside panel: three 12px circles (red #EF4444, amber #F59E0B, green #10B981) with 8px gap -- terminal chrome. Panel entrance: opacity 0 to 1, scale 0.97 to 1.0 (spring: gentle, startFrame: 695).

- **Frames 720-760**: Inside the panel, three test rows enter sequentially, staggered by 12 frames. Each row is a horizontal bar spanning the panel width (840w, 32px padding each side):

  Row 1 (startFrame: 720, Y: 520): Left side -- `InputBlock text="Perfect inputs" variant="clean" color="#8B5CF6"`. Right side -- result bar fills to 95% width in solutionGreen #10B981, label "95%" (Inter 600, 28px, solutionGreen) right-aligned. Bar fills left-to-right over 20 frames (interpolate on width). A check icon (solutionGreen, 20px) appears at frame 745.

  Row 2 (startFrame: 732, Y: 620): Left side -- `InputBlock text="Your actual data" variant="messy" color="#F59E0B"`. Right side -- result bar fills to 62% width in insightOrange #F59E0B. Label "62%" (Inter 600, 28px, insightOrange). Bar fill over 20 frames. A warning triangle (insightOrange, 20px) appears at frame 757.

  Row 3 (startFrame: 744, Y: 720): Left side -- `InputBlock text="Edge cases" variant="messy" color="#EF4444"`. Right side -- result bar fills to 34% width in errorRed #EF4444. Label "34%" (Inter 600, 28px, errorRed). Bar fill over 20 frames. An X icon (errorRed, 20px) appears at frame 769.

- **Frames 760-810**: Reaction phase. Row 1 (perfect inputs) dims -- opacity to 0.3 over 15 frames starting frame 760. Visually de-emphasizing the demo conditions. Rows 2 and 3 brighten -- border glows appear around their InputBlock pills (respective colors at 20% opacity, 8px blur radius, fading in over 10 frames starting frame 770).

  At Y: 840 inside panel: `AnimatedText variant="body" size={32} color="#E5E7EB" entrance="slideUp" startFrame={780} springPreset="gentle"` reading "Your actual conditions matter." The word "actual" in solutionGreen #10B981.

  At frame 790: A thin horizontal scan line (solutionGreen at 15% opacity, full panel width) sweeps top to bottom of the panel over 20 frames (translateY interpolates from Y: 400 to Y: 1300).

- **Frames 810-860**: The three percentage labels (`CountUp` style animation): 95% stays dim. 62% pulses once -- scale 1.0 to 1.15 to 1.0 over 20 frames (spring: bouncy, startFrame: 815). 34% gets a `GlitchBurst startFrame={825} burstDuration={10}` wrap -- the low score flickers to draw attention. Below the panel at Y: 1350: `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" startFrame={835} springPreset="gentle"` reading "actual data / actual conditions / actual scale".

- **Frames 860-900**: All elements fade out. Panel opacity interpolates from 1.0 to 0 over 30 frames (starting frame 860). Title fades. Scan line completes. Clean transition to black by frame 890. 10 frames of stillness before Scene 5.

**BEATS:**
```typescript
const BEATS = {
  PREV_CLEAR: 660,
  TITLE_IN: 670,
  TITLE_SHINE: 675,
  TITLE_SHIFT_UP: 690,
  PANEL_IN: 695,
  ROW_1_IN: 720,
  ROW_1_BAR_FILL: 720,
  ROW_1_CHECK: 745,
  ROW_2_IN: 732,
  ROW_2_BAR_FILL: 732,
  ROW_2_WARNING: 757,
  ROW_3_IN: 744,
  ROW_3_BAR_FILL: 744,
  ROW_3_X_ICON: 769,
  ROW_1_DIM: 760,
  ROWS_2_3_GLOW: 770,
  CONDITIONS_TEXT: 780,
  SCAN_LINE: 790,
  PERCENT_62_PULSE: 815,
  PERCENT_34_GLITCH: 825,
  ACTUAL_LABEL: 835,
  FADE_OUT_START: 860,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, ShinyText, InputBlock (x3), GlitchBurst, CountUp
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920. `AmbientBackground` (particleCount: 15, color: #F59E0B at 8% opacity, speed: 0.2) -- extremely subtle warm particles drift in.

- **Frames 940-1000**: First line enters at Y: 780, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "The demo is the ceiling."

- **Frames 1000-1050**: Second line enters at Y: 870, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "You need to know the floor."
  Key line -- accent color (insightOrange), slightly larger for emphasis.

- **Frames 1040-1070**: Third line enters at Y: 970, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={36} color="#9CA3AF"`:
  "Test with your actual data."
  Understated -- muted color, smaller size.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 870. Opacity interpolates from 0% to 4% over 20 frames. A very faint horizontal line (insightOrange at 10% opacity, 2px height, width: 500px, centered) draws beneath the second line at Y: 920 over 15 frames starting at frame 1065.

- **Frames 1080-1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. The message lands. Particles continue their ambient drift but nothing else moves.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 900,
  VIGNETTE_IN: 920,
  PARTICLES_ACTIVE: 920,
  LINE_1_START: 940,
  LINE_2_START: 1000,
  LINE_3_START: 1040,
  GLOW_IN: 1060,
  UNDERLINE_DRAW: 1065,
  HOLD_START: 1080,
  SCENE_END: 1140,
};
```

**Components:** BlurText (x3), Vignette, AmbientBackground
**Background:** dark (#0A0A0F)
