# Spreadsheet Better Than AI

## Overview
- **ID**: T-58
- **Slug**: spreadsheet-better-than-ai
- **Pillar**: P2 (Right Tool for the Job)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P2-right-tool/spreadsheet-better-than-ai-review.md
- **Accent colors**: errorRed (#EF4444), solutionGreen (#10B981), insightOrange (#F59E0B)
- **Core metaphor**: The right tool is the one that solves the problem without creating new ones -- a 50-year-old spreadsheet can outperform a $50K AI pipeline when the problem is simple.
- **Key visual**: Split-screen comparison -- left side: tangled AI pipeline with a cost counter climbing past $50K; right side: a clean three-column spreadsheet with an instant sort. Same result. Vastly different complexity.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | errorRed #EF4444 | Waste, frustration |
| Context | aiPurple #8B5CF6 → errorRed #EF4444 | Complexity building, cost anxiety |
| Core | solutionGreen #10B981 | Clarity, simplicity, relief |
| Resolution | insightOrange #F59E0B | Insight, reframe |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### SplitComparisonPanel

A vertical split-screen container dividing the frame into left (AI) and right (Spreadsheet) halves.

- **Props:** `leftLabel: string, rightLabel: string, dividerFrame: number, startFrame: number`
- **Layout:** Two panels stacked vertically (top = AI, bottom = Spreadsheet) in 9:16 format. Each panel: 940w centered, top panel Y: 280-880, bottom panel Y: 920-1520. Separated by a 2px horizontal divider line (#6B7280 at 40% opacity).
- **Panel chrome:** Each panel has a rounded-rect container — surface (#12121A) fill, 12px radius, 1px border (#6B7280 at 20% opacity). Top-left: label badge (16px, Inter 500, uppercase).
- **Left/top label badge:** aiPurple (#8B5CF6) bg at 15% opacity, aiPurple text
- **Right/bottom label badge:** solutionGreen (#10B981) bg at 15% opacity, solutionGreen text
- **Entrance:** Each panel slides in from its respective edge (top from Y:-60, bottom from Y:+60) to final position, opacity 0 to 1 (spring: snappy), staggered by 8 frames

### AIPipelineNode

A single node in the AI pipeline flow diagram.

- **Props:** `label: string, icon: "server" | "data" | "model" | "dashboard", color: string, startFrame: number, y: number, x: number`
- **Node:** 160w x 70h rounded rect, surface (#12121A) fill, 2px border in `color` at 50% opacity, 10px radius
- **Icon area:** 24px circle left-side, filled with `color` at 20% opacity, icon glyph in `color`
- **Label:** Inter 500, 22px, #E5E7EB, right of icon
- **Entrance:** scale 0.8 to 1.0 + opacity 0 to 1 (spring: snappy) starting at `startFrame`
- **Idle:** Border pulses — opacity oscillates via `Math.sin(frame * 0.06) * 0.15 + 0.5`
- **Connectors:** 1.5px dashed lines (#6B7280 at 30%) drawn between nodes using strokeDashoffset animation over 15 frames

### SpreadsheetGrid

A simplified Excel-like grid with columns, rows, and a sort animation.

- **Props:** `columns: Array<{header: string, width: number}>, rows: Array<Array<string>>, startFrame: number, sortFrame: number, sortColumn: number`
- **Grid chrome:** 860w, surface (#12121A) fill, 12px radius, 1px border (#10B981 at 30% opacity). Top row: green header bar (#10B981 at 12% fill), column headers in Inter 600, 24px, #10B981
- **Cells:** Inter 400, 22px, #E5E7EB. Cell borders: 1px #6B7280 at 15%. Row height: 48px
- **Row entrance:** Each row fades in top-to-bottom, staggered by 4 frames, opacity 0 to 1, translateY +10px to 0 (spring: gentle)
- **Sort animation at sortFrame:** Rows shuffle to sorted order over 20 frames — each row translateY interpolates to its new position (spring: bouncy). The sorted column cells flash solutionGreen (#10B981) text for 15 frames, then settle back to #E5E7EB
- **Sort indicator:** Small downward chevron (8px) appears next to the sorted column header at sortFrame (opacity 0 to 1, spring: snappy)

### CostCounter

An animated cost display that climbs with accelerating anxiety.

- **Props:** `from: number, to: number, startFrame: number, duration: number, prefix: string, color: string, warningThreshold: number`
- **Display:** `CountUp` internally. Font: JetBrains Mono 600, 48px
- **Behavior:** Color shifts from `color` to errorRed (#EF4444) when value crosses `warningThreshold` (interpolated over 10 frames). At threshold crossing, a subtle screen-shake occurs: parent translateX oscillates `Math.sin(frame * 1.2) * 3` for 12 frames
- **Label:** "TOTAL COST" in Inter 500, 20px, #9CA3AF, positioned 8px above the number

### DeployTimeBadge

A rounded badge showing deployment time with an icon.

- **Props:** `time: string, color: string, startFrame: number, y: number`
- **Badge:** Auto-width (padding 20px horizontal, 12px vertical), `color` fill at 12%, 24px radius, 1px border in `color` at 40%
- **Icon:** Clock glyph (16px) left-side in `color`
- **Text:** Inter 600, 28px, `color`
- **Entrance:** scale 0.7 to 1.0 + opacity 0 to 1 (spring: bouncy) at `startFrame`

---

## Scene Breakdown

### Scene 1: Hook — "Tens of Thousands Wasted" (0s-3s, frames 0-90)

**Narration:** > "I've seen companies spend tens of thousands building AI solutions that a spreadsheet would have solved in an afternoon."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #EF4444 at 10% opacity, speed: 0.4). `Vignette` (opacity: 0.6). Center screen at Y: 750: `AnimatedText variant="title" size={56} color="#EF4444" entrance="scale" startFrame={0} springPreset="snappy"` reading "Tens of Thousands". Scale overshoots from 1.15 to 1.0. Text has a subtle red text-shadow glow: `0 0 40px rgba(239, 68, 68, 0.15)`.

- **Frames 15-35**: Below at Y: 840: `AnimatedText variant="body" size={44} color="#E5E7EB" entrance="slideUp" startFrame={15} springPreset="gentle"` reading "on AI solutions". Staggered entrance gives weight to the hook.

- **Frames 35-55**: Below at Y: 930: `AnimatedText variant="body" size={40} color="#9CA3AF" entrance="fade" startFrame={35} springPreset="gentle"` reading "a spreadsheet would have solved". The word "spreadsheet" uses `ShinyText startFrame={40} shineColor="#10B981" duration={30} color="#10B981" fontSize={40}` -- a green glint foreshadows the answer.

- **Frames 55-70**: All text dims to 40% opacity over 15 frames (interpolate, clamp). A horizontal line sweeps across center screen (Y: 960) -- 2px, errorRed #EF4444 at 50% opacity, width interpolates from 0 to 940px over 15 frames, centered. Visual divider: the hook is landing.

- **Frames 70-90**: All hook text fades out (opacity 0.4 to 0 over 20 frames). The red sweep line fades out simultaneously. Screen breathes to black for transition.

**BEATS:**
```typescript
const BEATS = {
  TITLE_IN: 0,
  SUBTITLE_IN: 15,
  SPREADSHEET_LINE_IN: 35,
  SHINE_SWEEP: 40,
  TEXT_DIM: 55,
  DIVIDER_SWEEP: 55,
  ALL_FADE_OUT: 70,
  SCENE_END: 90,
};
```

**Components:** AnimatedText, ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context — "The AI Pipeline" (3s-10s, frames 90-300)

**Narration:** > "Here's a real example. A company wanted to 'use AI to optimize pricing.' They hired a vendor. Built a machine learning model. Trained it on historical sales data."

**Visuals:**

- **Frames 90-120**: Dark bg (#0A0A0F). `AmbientBackground` shifts color to aiPurple (#8B5CF6 at 10% opacity). At Y: 200: `AnimatedText variant="label" size={28} color="#8B5CF6" entrance="fade" startFrame={92} springPreset="gentle"` reading "REAL EXAMPLE" -- small label sets context. Below at Y: 280: `AnimatedText variant="title" size={48} color="#E5E7EB" entrance="slideUp" startFrame={97} springPreset="snappy"` reading "\"Optimize Pricing with AI\"". The quoted text uses `GradientText colors={["#8B5CF6", "#EC4899", "#8B5CF6"]} direction="horizontal" duration={120} fontSize={48}`.

- **Frames 120-155**: The title text rises to Y: 180 (translateY interpolate over 20 frames, spring: gentle) and dims to 60% opacity -- becomes a header. Below, the AI pipeline builds. First node: `AIPipelineNode label="Vendor" icon="server" color="#8B5CF6" startFrame={125} y={380} x={200}`. A dashed connector line draws downward from it over 15 frames.

- **Frames 155-195**: Second node: `AIPipelineNode label="ML Model" icon="model" color="#8B5CF6" startFrame={158} y={480} x={350}`. Connector from Vendor to ML Model draws over 15 frames starting at frame 163. Third node: `AIPipelineNode label="Training Data" icon="data" color="#8B5CF6" startFrame={175} y={580} x={180}`. Connector from ML Model to Training Data draws starting at frame 180. The pipeline is getting tangled -- connectors crisscross.

- **Frames 195-235**: Fourth node: `AIPipelineNode label="Dashboard" icon="dashboard" color="#8B5CF6" startFrame={198} y={480} x={550}`. More connectors draw in (frames 203-218), creating a web of dashed lines. A fifth node: `AIPipelineNode label="Deploy" icon="server" color="#8B5CF6" startFrame={218} y={680} x={400}`. By now, the pipeline looks like a tangled mess of boxes and lines. At frame 220: all node borders shift from aiPurple to a blend toward errorRed -- color interpolates #8B5CF6 to #EF4444 over 30 frames. The pipeline is turning red. Anxiety building.

- **Frames 235-270**: `CostCounter from={0} to={52000} startFrame={235} duration={35} prefix="$" color="#F59E0B" warningThreshold={30000}` appears at Y: 820, centered. The counter climbs. When it passes $30K (around frame 255), color shifts to errorRed, and the 3px screen-shake activates for 12 frames. Below the counter at Y: 890: "TOTAL COST" label fades in (already part of CostCounter component).

- **Frames 270-300**: Cost counter holds at $52,000 in errorRed. `DeployTimeBadge time="6 months" color="#EF4444" startFrame={275} y={940}` enters below the counter (spring: bouncy). All pipeline nodes pulse their borders in sync -- a coordinated anxiety beat. At frame 290: everything begins a slow dim (opacity interpolates toward 0.3 over 25 frames, completing into Scene 3). The pipeline is established as wasteful.

**BEATS:**
```typescript
const BEATS = {
  LABEL_IN: 92,
  TITLE_IN: 97,
  TITLE_RISE: 120,
  NODE_VENDOR: 125,
  NODE_ML_MODEL: 158,
  CONNECTOR_1: 163,
  NODE_TRAINING: 175,
  CONNECTOR_2: 180,
  NODE_DASHBOARD: 198,
  CONNECTOR_3: 203,
  NODE_DEPLOY: 218,
  NODES_TURN_RED: 220,
  COST_COUNTER_START: 235,
  COST_WARNING: 255,
  DEPLOY_BADGE_IN: 275,
  DIM_ALL: 290,
  SCENE_END: 300,
};
```

**Components:** AnimatedText, GradientText, AIPipelineNode (x5), CostCounter, DeployTimeBadge, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 3: Core — "The Spreadsheet Alternative" (10s-22s, frames 300-660)

**Narration:** > "Or they could have put their products in one column, their costs in another, their margins in a third, and sorted by profit. That's a spreadsheet. Took ten minutes."
>
> "If your data is structured, your rules are clear, and you need the same calculation every time, a spreadsheet is almost always the right answer. It's fast, transparent, and everyone knows how to use it."

**Visuals:**

- **Frames 300-330**: The dimmed AI pipeline (from Scene 2, at 30% opacity) sits in the upper portion of the frame. It contracts -- scale interpolates from 1.0 to 0.55 over 20 frames (spring: gentle), rising to Y-center around 350. This shrinks it into a compact thumbnail of complexity. A thin horizontal divider line (2px, #6B7280 at 30%) draws across at Y: 620, width 0 to 940px over 15 frames starting at frame 315. Label above divider, right-aligned: `AnimatedText variant="label" size={22} color="#EF4444" entrance="fade" startFrame={318}` reading "AI APPROACH" in errorRed.

- **Frames 330-365**: Below the divider: label at Y: 650, left-aligned: `AnimatedText variant="label" size={22} color="#10B981" entrance="fade" startFrame={332}` reading "SPREADSHEET APPROACH" in solutionGreen. The SpreadsheetGrid component builds below at Y: 700. `SpreadsheetGrid columns={[{header: "Product", width: 280}, {header: "Cost", width: 190}, {header: "Margin", width: 190}]} rows={[["Widget A", "$12.00", "$8.40"], ["Widget B", "$45.00", "$31.50"], ["Widget C", "$8.00", "$2.40"], ["Widget D", "$28.00", "$19.60"]]} startFrame={338} sortFrame={420} sortColumn={2}`. Header row appears first (frame 338), then data rows stagger in (4-frame delay each, frames 342-358).

- **Frames 365-400**: All four data rows are visible. The grid idles. A blinking cursor appears in the top-right area of the grid -- a thin 2px vertical bar, solutionGreen, toggling opacity every 18 frames via `Math.sin(frame * 0.17) > 0`. Below the grid at Y: 1020: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={370} springPreset="gentle"` reading "Three columns. One sort." -- the simplicity callout.

- **Frames 400-440**: The sort animation triggers at frame 420. Rows shuffle to sorted order by Margin (descending): Widget B ($31.50), Widget D ($19.60), Widget A ($8.40), Widget C ($2.40). Each row translateY interpolates to its new position over 20 frames (spring: bouncy). The Margin column values flash solutionGreen for 15 frames. A small downward chevron appears next to "Margin" header. At frame 425: `ShinyText` sweep across the Margin header (shineColor: "#FFFFFF", duration: 20).

- **Frames 440-490**: Sort complete. Grid settles. At Y: 1100: `DeployTimeBadge time="10 minutes" color="#10B981" startFrame={445} y={1100}` enters (spring: bouncy). Above the shrunken AI pipeline, the "$52,000" cost text is still faintly visible in errorRed at 30% opacity. The contrast is stark: $52K/6mo versus 10min/free.

- **Frames 490-540**: The visual comparison crystallizes. The AI pipeline thumbnail pulses once with a red border flash (2px solid #EF4444 at 60% opacity for 8 frames at frame 495, then back to 20%). The spreadsheet grid border pulses once with a green glow (2px solid #10B981 at 80% opacity for 8 frames at frame 505, then settles to 30%). `AnimatedText variant="title" size={44} color="#E5E7EB" entrance="scale" startFrame={515} springPreset="bouncy"` at Y: 1200 reading "Same result." -- this line appears with a slight scale overshoot (1.08 to 1.0).

- **Frames 540-590**: Three qualifier badges appear in a horizontal row at Y: 1320, staggered by 10 frames each:
  1. Frame 545: Badge "Structured Data" -- 20px Inter 500, solutionGreen text, solutionGreen bg at 10%, 20px radius pill, opacity 0 to 1 (spring: snappy)
  2. Frame 555: Badge "Clear Rules" -- same styling
  3. Frame 565: Badge "Repeatable" -- same styling

  These are the three conditions from the narration. Each badge entrance: scale 0.8 to 1.0 + opacity 0 to 1.

- **Frames 590-630**: `AnimatedText variant="body" size={38} color="#10B981" entrance="slideUp" startFrame={595} springPreset="gentle"` at Y: 1420 reading "Fast. Transparent. Universal." Each word could be a separate AnimatedText with 8-frame stagger for rhythmic entrance. At frame 610: the three qualifier badges glow briefly -- each badge bg opacity pulses from 10% to 25% and back over 20 frames, staggered by 6 frames.

- **Frames 630-660**: Everything fades. The spreadsheet grid, badges, labels, and the shrunken AI pipeline all fade out -- opacity interpolates to 0 over 30 frames (spring: slow). Clean transition to resolution.

**BEATS:**
```typescript
const BEATS = {
  AI_SHRINK: 300,
  DIVIDER_DRAW: 315,
  AI_LABEL_IN: 318,
  SPREADSHEET_LABEL_IN: 332,
  GRID_HEADER_IN: 338,
  GRID_ROWS_IN: 342,
  SIMPLICITY_CALLOUT: 370,
  CURSOR_BLINK_START: 365,
  SORT_TRIGGER: 420,
  SORT_SHINE: 425,
  DEPLOY_BADGE_IN: 445,
  AI_PULSE_RED: 495,
  GRID_PULSE_GREEN: 505,
  SAME_RESULT_IN: 515,
  BADGE_STRUCTURED: 545,
  BADGE_RULES: 555,
  BADGE_REPEATABLE: 565,
  FAST_TRANSPARENT_IN: 595,
  BADGE_GLOW: 610,
  ALL_FADE_OUT: 630,
  SCENE_END: 660,
};
```

**Components:** AnimatedText, SpreadsheetGrid, ShinyText, DeployTimeBadge, AIPipelineNode (dimmed), AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution — "The Right Tool" (22s-30s, frames 660-900)

**Narration:** > "AI is powerful. But the most powerful tool is the one that solves the problem without creating new ones. Sometimes that's a 50-year-old spreadsheet."

**Visuals:**

- **Frames 660-695**: Clean dark bg (#0A0A0F). `AmbientBackground` shifts to insightOrange (#F59E0B at 8% opacity, speed: 0.2) -- warmer, calmer. `Vignette` (opacity: 0.5). Center screen at Y: 700: `AnimatedText variant="title" size={56} color="#F59E0B" entrance="scale" startFrame={665} springPreset="bouncy"` reading "AI is powerful." -- clean, bold, centered. Wrapped in `ShinyText startFrame={670} shineColor="#FFFFFF" duration={35} fontSize={56}`. A subtle radial glow renders behind the text -- insightOrange at 5% opacity, 350px radius.

- **Frames 695-740**: The "AI is powerful." text rises to Y: 500 (translateY interpolate over 20 frames, spring: gentle) and dims to 50% opacity -- it's acknowledged but now secondary. Below at Y: 750: `AnimatedText variant="title" size={48} color="#E5E7EB" entrance="slideUp" startFrame={700} springPreset="gentle"` reading "But the most powerful tool". At Y: 830: `AnimatedText variant="title" size={48} color="#F59E0B" entrance="slideUp" startFrame={712} springPreset="gentle"` reading "solves the problem" -- the key phrase in accent color. At Y: 910: `AnimatedText variant="body" size={40} color="#9CA3AF" entrance="slideUp" startFrame={724} springPreset="gentle"` reading "without creating new ones."

- **Frames 740-800**: The three lines idle. A thin horizontal accent line (2px, insightOrange #F59E0B at 40%) draws beneath "solves the problem" -- width 0 to 460px over 15 frames starting at frame 745, centered under the text. This underscores the key insight. At frame 760: the "without creating new ones" text shifts color from #9CA3AF to #E5E7EB over 15 frames (interpolate on RGB) -- it gains emphasis as the narration lands on it.

- **Frames 800-850**: All lines above Y: 750 fade out (opacity to 0 over 25 frames). "solves the problem" and "without creating new ones" remain, rising to Y: 650 and Y: 740 (translateY interpolate, spring: gentle). Below at Y: 880: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" startFrame={815} springPreset="bouncy"` reading "A 50-year-old spreadsheet." -- the punchline. Wrapped in `GlitchBurst startFrame={820} burstInterval={120} burstDuration={8} fontSize={52}` for a brief glitch of emphasis (controlled, not chaotic -- just a flicker of chromatic aberration).

- **Frames 850-900**: All text fades out together. Opacity interpolates from current to 0 over 50 frames (spring: slow). The ambient particles fade. The radial glow fades. Clean black by frame 900.

**BEATS:**
```typescript
const BEATS = {
  AI_POWERFUL_IN: 665,
  SHINE_SWEEP: 670,
  TITLE_RISE: 695,
  LINE_2_IN: 700,
  LINE_3_KEY_IN: 712,
  LINE_4_IN: 724,
  UNDERLINE_DRAW: 745,
  LINE_4_BRIGHTEN: 760,
  UPPER_FADE: 800,
  PUNCHLINE_IN: 815,
  GLITCH_FLICKER: 820,
  ALL_FADE_OUT: 850,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, ShinyText, GlitchBurst, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 780, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "The right tool isn't the newest."

- **Frames 1000-1050**: Second line enters at Y: 870, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={46} color="#F59E0B"`:
  "It's the one that solves the problem."
  Key line -- accent color (insightOrange). Slightly larger font for emphasis.

- **Frames 1040-1070**: Third line enters at Y: 960, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={38} color="#9CA3AF"`:
  "Without creating new ones."
  Understated -- muted color, smaller size.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 870. Opacity interpolates from 0% to 4% over 20 frames.

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
