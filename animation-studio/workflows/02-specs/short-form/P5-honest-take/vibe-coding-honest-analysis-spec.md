# Vibe Coding — The Honest Analysis

## Overview
- **ID**: T-49
- **Slug**: vibe-coding-honest-analysis
- **Pillar**: P5 (The Honest Take)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P5-honest-take/vibe-coding-honest-analysis-review.md
- **Accent colors**: insightOrange (#F59E0B), techBlue (#3B82F6), aiPurple (#8B5CF6), solutionGreen (#10B981), errorRed (#EF4444)
- **Core metaphor**: Every abstraction layer in computing trades understanding for accessibility — vibe coding is just the latest layer, and like every layer before it, knowing what's underneath is what separates users from builders.
- **Key visual**: A split-screen moment — left side shows a vibe coder frozen in front of unfamiliar broken code, right side shows a developer who can fluidly move between natural language AND the code layer beneath it. Two levels of capability, same tool.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | aiPurple #8B5CF6 | AI magic, wonder |
| Context | solutionGreen → errorRed | Promise then failure |
| Core | techBlue #3B82F6 → insightOrange #F59E0B | Technical depth, insight |
| Resolution | insightOrange #F59E0B | Understanding, earned clarity |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### ChatPromptPanel

A mock AI chat interface showing a natural language prompt being typed and code being generated.

- **Props:** `prompt: string, startFrame: number, typingSpeed: number, responseStartFrame: number, responseLines: Array<{text: string, color: string}>`
- **Panel chrome:** 880w, surface (#12121A) fill, 16px border-radius, 1px border #2A2A3A. Top row: three 12px circles (red #EF4444, amber #F59E0B, green #10B981) with 8px gap. Right of dots: label "AI Assistant" in Inter 500, 20px, #6B7280.
- **Prompt area:** Bottom section, 60px tall, dark bg (#0A0A0F), 12px radius. Prompt text types in character-by-character at `typingSpeed` chars/frame. Inter 400, 32px, #E5E7EB. Blinking cursor (1px wide, aiPurple #8B5CF6, toggling every 15 frames).
- **Response area:** Above prompt. Each response line types in at 2 chars/frame starting at `responseStartFrame`, staggered by 8 frames. JetBrains Mono 400, 28px, line color from props. Left margin 24px.
- **Panel entrance:** opacity 0 to 1 + scale 0.96 to 1.0 (spring: gentle) starting at startFrame.

### AppPreview

A simplified mobile app mockup showing a functional UI being generated.

- **Props:** `elements: Array<{type: "header" | "button" | "list" | "card", label: string, color: string, startFrame: number}>, width: number, height: number`
- **Frame:** `width` x `height`, surface (#12121A) fill, 24px border-radius, 2px border aiPurple at 30% opacity.
- **Top bar:** 50px tall, dark bg (#0A0A0F). Centered dot cluster (3 dots, 8px, #6B7280, 6px gap). Status bar text "9:41" left, battery icon right, both #6B7280, 18px.
- **Elements enter** staggered by startFrame. Each element slides up from Y +20 to Y 0, opacity 0 to 1 (spring: snappy, 15 frames).
  - `header`: 40px tall rounded rect, color fill at 80% opacity, label centered Inter 600 24px #FFFFFF.
  - `button`: 48px tall, color fill, 12px radius, label centered Inter 500 22px #FFFFFF.
  - `list`: Three 36px tall rows, 1px bottom border #2A2A3A, label left-aligned Inter 400 20px #E5E7EB.
  - `card`: 100px tall, surface fill, 12px radius, 1px border color at 40%, label top-left Inter 500 22px color.
- **Padding:** 16px all sides, 12px gap between elements.

### ErrorOverlay

A red-tinted error state that overlays on the AppPreview.

- **Props:** `startFrame: number, errorMessage: string, lineNumbers: Array<number>`
- **Overlay:** Full AppPreview dimensions, errorRed (#EF4444) at 8% opacity, fades in over 10 frames.
- **Error banner:** Bottom of app frame, 80px tall, #1A0A0A fill. `GlitchText intensity={0.6} speed={4} color="#EF4444" fontSize={24} startFrame={startFrame}` showing `errorMessage`. Red pulsing border — 2px solid errorRed, opacity oscillates via `Math.sin(frame * 0.15) * 0.3 + 0.7`.
- **Line highlights:** For each line number, a semi-transparent errorRed bar (height 28px, width 100%, opacity 0.15) appears at the corresponding Y position in the response area, fading in over 5 frames staggered by 3 frames.

### CapabilityColumn

A vertical column showing a person's capability level with labeled tiers.

- **Props:** `label: string, tiers: Array<{name: string, active: boolean, color: string}>, startFrame: number, width: number, headerColor: string`
- **Column:** `width` px wide, auto height. Header bar: 60px tall, `headerColor` fill at 80%, 12px top radius. Label centered Inter 600, 28px, #FFFFFF.
- **Tiers stack downward.** Each tier: 70px tall, surface (#12121A) fill, 1px border #2A2A3A. Left 4px accent bar in `color`.
  - `active: true` — tier fill brightens to #1A1A24, accent bar full opacity, name in Inter 500 26px color. Subtle glow: box-shadow equivalent using layered div, color at 8% opacity, 20px spread.
  - `active: false` — tier fill stays #12121A, accent bar 25% opacity, name in Inter 400 24px #6B7280. Dimmed state.
- **Entrance:** Each tier slides in from right (translateX +30 to 0), opacity 0 to 1, staggered by 6 frames (spring: snappy). Header enters first (scale 0.95 to 1.0, spring: bouncy).

### AbstractionLayerStrip

A horizontal strip referencing the abstraction layer metaphor from T-01 (P1 callback).

- **Props:** `layers: Array<{name: string, color: string}>, highlightIndex: number, startFrame: number`
- **Strip:** 880px wide, centered. Layers render as connected horizontal segments, each 880/layers.length px wide, 50px tall.
- **Each segment:** `color` fill at 40% opacity, 1px right border #0A0A0F. Label centered, Inter 500, 20px, #E5E7EB.
- **Highlight:** The segment at `highlightIndex` animates to 100% opacity fill, label brightens to #FFFFFF, 2px border in `color`, scale Y 1.0 to 1.15 (spring: bouncy, 20 frames). A downward arrow (8px, #E5E7EB) pulses below it.
- **Entrance:** Strip fades in (opacity 0 to 1, 20 frames), then segments fill left-to-right staggered by 4 frames.

---

## Scene Breakdown

### Scene 1: Hook — "What Vibe Coding Is" (0s-3s, frames 0-90)

**Narration:** > "Vibe coding is when you describe what you want to an AI and it generates the code. You don't deeply understand the code. You just know it works."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F) with `AmbientBackground` (particleCount: 25, color: #8B5CF6 at 12% opacity, speed: 0.4). `Vignette` overlay (opacity: 0.5). Center screen at Y: 750, the label "VIBE CODING" enters via `GradientText colors={["#8B5CF6", "#EC4899", "#8B5CF6"]} direction="horizontal" duration={90} yoyo={true} fontSize={64} startFrame={0}` with scale interpolating from 1.3 to 1.0 over 15 frames (spring: bouncy). Subtle radial glow behind text — aiPurple #8B5CF6 at 6% opacity, 350px radius.

- **Frames 15-40**: Below the title at Y: 850: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={18} springPreset="gentle"` reading "describe what you want". At frame 25, a small animated arrow (aiPurple, 2px stroke, 30px long) draws downward from Y: 880 to Y: 910 over 10 frames using SVG strokeDashoffset interpolation. At Y: 930: `AnimatedText variant="body" size={36} color="#8B5CF6" entrance="fade" startFrame={30} springPreset="gentle"` reading "AI generates the code".

- **Frames 40-65**: "VIBE CODING" title and subtitle text dim to 30% opacity over 15 frames (interpolate, clamp). `ChatPromptPanel prompt="Build me a task manager app with drag and drop" startFrame={42} typingSpeed={1.5} responseStartFrame={55} responseLines={[{text: "import React from 'react';", color: "#3B82F6"}, {text: "const TaskManager = () => {", color: "#E5E7EB"}, {text: "  const [tasks, setTasks] = useState([]);", color: "#E5E7EB"}, {text: "  // drag-and-drop logic...", color: "#6B7280"}]}` enters at Y: 400, centered. The code streams in — the visual of natural language becoming functional code.

- **Frames 65-90**: Prompt fully typed, code lines appearing. At frame 70, a small `AppPreview width={260} height={380}` fades in at X: 680, Y: 1200 — a tiny functional app preview materializing. Elements: `[{type: "header", label: "My Tasks", color: "#8B5CF6", startFrame: 72}, {type: "card", label: "Design mockups", color: "#3B82F6", startFrame: 78}, {type: "card", label: "Write tests", color: "#10B981", startFrame: 84}]`. The connection between prompt and working app is visual and immediate. A thin animated line (aiPurple, 1px, 40% opacity) draws from the ChatPromptPanel bottom-right corner to the AppPreview top-left corner over 15 frames starting at frame 72.

**BEATS:**
```typescript
const BEATS = {
  TITLE_IN: 0,
  SUBTITLE_DESCRIBE: 18,
  ARROW_DRAW: 25,
  SUBTITLE_GENERATES: 30,
  TITLE_DIM: 40,
  CHAT_PANEL_IN: 42,
  CODE_STREAM_START: 55,
  APP_PREVIEW_IN: 70,
  APP_ELEMENTS_START: 72,
  CONNECTION_LINE: 72,
  APP_CARD_2: 78,
  APP_CARD_3: 84,
  SCENE_END: 90,
};
```

**Components:** GradientText, AnimatedText, ChatPromptPanel, AppPreview, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context — "What's True, Both Sides" (3s-10s, frames 90-300)

**Narration:** > "Here's what's true about vibe coding. It dramatically lowers the barrier to building things. People who couldn't code before can now build functional prototypes. That's genuinely valuable."
>
> "Here's what's also true. The code works until it doesn't. And when it doesn't, the person who vibe-coded it can't fix it because they don't understand what was built."

**Visuals:**

- **Frames 90-120**: ChatPromptPanel and AppPreview from Scene 1 remain visible but shift upward — translateY interpolates by -100px over 20 frames (spring: gentle). At Y: 280, above the panel: `AnimatedText variant="title" size={48} color="#10B981" entrance="slideUp" startFrame={95} springPreset="bouncy"` reading "What's true:". The word "true" wrapped in `ShinyText startFrame={100} shineColor="#FFFFFF" duration={40} fontSize={48}`.

- **Frames 120-165**: Left side at X: 100, Y: 1100: A vertical stat column fades in. `AnimatedText variant="label" size={28} color="#6B7280" entrance="fade" startFrame={122} springPreset="gentle"` reading "BARRIER TO ENTRY". Below it, a vertical bar chart — single bar, solutionGreen #10B981, width 80px. Height interpolates from 300px down to 60px over 40 frames starting at frame 125 (spring: gentle) — the barrier is lowering. At frame 140, `AnimatedText variant="body" size={40} color="#10B981" entrance="scale" startFrame={140} springPreset="bouncy"` reading "80% lower" appears right of the bar at Y: 1200.

- **Frames 165-200**: The AppPreview from Scene 1 pulses with a solutionGreen border — border color transitions from aiPurple at 30% to solutionGreen at 60% over 15 frames. A small badge appears top-right of the AppPreview: rounded rect 120x32px, solutionGreen fill, `AnimatedText variant="label" size={20} color="#FFFFFF" entrance="scale" startFrame={170} springPreset="snappy"` reading "WORKING". Badge entrance: scale 0 to 1 (spring: bouncy). The AppPreview represents the genuine value.

- **Frames 200-230**: Color shift begins. The "What's true:" text changes — `color` interpolates from solutionGreen to errorRed over 20 frames. Text content crossfades (opacity out 10 frames, new text opacity in 10 frames) to "What's also true:" in errorRed #EF4444 at Y: 280. `ShinyText` on "also true" with shineColor="#EF4444". The solutionGreen stat column fades out (opacity to 0, 15 frames). The mood pivots.

- **Frames 230-270**: `ErrorOverlay startFrame={232} errorMessage="TypeError: Cannot read property 'map' of undefined" lineNumbers={[3]}` activates on the AppPreview. The "WORKING" badge glitches — `GlitchBurst startFrame={235} burstDuration={12} burstInterval={30} fontSize={20}` wraps the badge text, then badge background transitions from solutionGreen to errorRed over 10 frames, text changes to "BROKEN". Screen shake: the AppPreview translateX oscillates `Math.sin(frame * 0.8) * 4` for 20 frames starting at frame 235. The ChatPromptPanel code lines — line 3 (`useState`) highlights with errorRed left-border glow (3px, errorRed, opacity pulses 0.5-1.0).

- **Frames 270-300**: The ChatPromptPanel and AppPreview both dim to 20% opacity over 20 frames. A question mark materializes center-screen at Y: 900: `AnimatedText variant="hero" size={96} color="#EF4444" entrance="scale" startFrame={275} springPreset="bouncy"` reading "?". Scale overshoots from 1.4 to 1.0. Below it at Y: 1020: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={282} springPreset="gentle"` reading "can't fix what you don't understand". The question mark pulses — scale oscillates `1.0 + Math.sin(frame * 0.1) * 0.03` while on screen. All elements begin fading at frame 290 (opacity to 0, 20 frames through Scene 3 start).

**BEATS:**
```typescript
const BEATS = {
  ELEMENTS_SHIFT_UP: 90,
  WHATS_TRUE_IN: 95,
  SHINE_TRUE: 100,
  BARRIER_LABEL_IN: 122,
  BARRIER_BAR_LOWER: 125,
  BARRIER_STAT_IN: 140,
  APP_BORDER_GREEN: 165,
  WORKING_BADGE_IN: 170,
  COLOR_SHIFT_START: 200,
  ALSO_TRUE_IN: 200,
  STAT_FADE_OUT: 215,
  ERROR_OVERLAY_IN: 232,
  BADGE_GLITCH: 235,
  SCREEN_SHAKE: 235,
  CODE_LINE_HIGHLIGHT: 240,
  ELEMENTS_DIM: 270,
  QUESTION_MARK_IN: 275,
  CANT_FIX_TEXT: 282,
  FADE_TO_TRANSITION: 290,
  SCENE_END: 300,
};
```

**Components:** AnimatedText, ShinyText, ChatPromptPanel, AppPreview, ErrorOverlay, GlitchBurst
**Background:** dark (#0A0A0F)

---

### Scene 3: Core — "The Abstraction Tradeoff" (10s-22s, frames 300-660)

**Narration:** > "Every layer of abstraction in computing has this tradeoff. You gain accessibility and lose understanding."
>
> "The programmers who succeeded before AI understood both the abstraction AND the layer beneath it. That's what made them effective when things broke."

**Visuals:**

- **Frames 300-340**: Clean dark bg (#0A0A0F). `AmbientBackground` color shifts from aiPurple to techBlue (particleCount: 30, color: #3B82F6 at 15% opacity, speed: 0.3). At Y: 400, centered: `AbstractionLayerStrip layers={[{name: "Electrons", color: "#5B21B6"}, {name: "Transistors", color: "#6D28D9"}, {name: "Machine Code", color: "#7C3AED"}, {name: "Assembly", color: "#8B5CF6"}, {name: "C", color: "#818CF8"}, {name: "Python", color: "#6366F1"}, {name: "Frameworks", color: "#3B82F6"}, {name: "AI / Vibe Code", color: "#F59E0B"}]} highlightIndex={7} startFrame={305}`. The strip fades in left-to-right. The "AI / Vibe Code" segment on the far right highlights with bouncy scale — the newest layer in computing's history.

- **Frames 340-390**: Below the strip at Y: 520, a tradeoff diagram builds. Two horizontal bars, 400px wide each, stacked vertically with 20px gap, centered.

  Top bar at Y: 520: Label left "ACCESSIBILITY" in Inter 500, 28px, solutionGreen. The bar fill (solutionGreen #10B981 at 60% opacity, 40px tall, 12px radius) width interpolates from 0 to 400px over 30 frames starting at frame 345 (spring: gentle). Fill animates left-to-right.

  Bottom bar at Y: 580: Label left "UNDERSTANDING" in Inter 500, 28px, insightOrange. The bar fill (insightOrange #F59E0B at 60% opacity, 40px tall, 12px radius) width interpolates from 400px to 0 over 30 frames starting at frame 355 (spring: gentle). Fill shrinks right-to-left — inverse relationship. The bars cross at frame 370 — accessibility rising as understanding falls. At the crossover moment (frame 370), a brief flash: both bars border pulse to #FFFFFF at 40% opacity for 6 frames.

- **Frames 390-420**: Above the tradeoff bars at Y: 470: `AnimatedText variant="body" size={40} color="#F59E0B" entrance="fade" startFrame={395} springPreset="gentle"` reading "Every abstraction trades understanding for access." The word "every" wrapped in `ShinyText startFrame={400} shineColor="#FFFFFF" duration={30} fontSize={40}`. The AbstractionLayerStrip dims to 40% opacity over 15 frames — focus shifts to the tradeoff text and bars.

- **Frames 420-480**: Tradeoff bars and text fade out (opacity to 0, 20 frames starting at 420). The scene transitions to a split comparison. At Y: 300: `AnimatedText variant="title" size={44} color="#E5E7EB" entrance="slideUp" startFrame={430} springPreset="bouncy"` reading "Before AI". At frame 440, a `CapabilityColumn label="Traditional Dev" tiers={[{name: "Natural Language", active: false, color: "#6B7280"}, {name: "Framework", active: true, color: "#3B82F6"}, {name: "Language", active: true, color: "#6366F1"}, {name: "System", active: true, color: "#8B5CF6"}]} startFrame={445} width={400} headerColor="#3B82F6"` enters at X: 340 (centered), Y: 400.

- **Frames 480-540**: The "Before AI" title crossfades to "After AI — Two Types" in insightOrange at frame 480 (opacity out 10 frames, in 10 frames). The single CapabilityColumn slides left to X: 100 over 20 frames (spring: snappy) and dims to 30% opacity.

  Left column at X: 100: `CapabilityColumn label="Vibe Coder" tiers={[{name: "Natural Language", active: true, color: "#8B5CF6"}, {name: "Framework", active: false, color: "#6B7280"}, {name: "Language", active: false, color: "#6B7280"}, {name: "System", active: false, color: "#6B7280"}]} startFrame={495} width={380} headerColor="#8B5CF6"`. Only the top tier (Natural Language) is active — one layer of capability.

  Right column at X: 600: `CapabilityColumn label="AI-Augmented Dev" tiers={[{name: "Natural Language", active: true, color: "#8B5CF6"}, {name: "Framework", active: true, color: "#3B82F6"}, {name: "Language", active: true, color: "#6366F1"}, {name: "System", active: true, color: "#8B5CF6"}]} startFrame={505} width={380} headerColor="#10B981"`. All tiers active — full stack capability with AI on top. The traditional dev column has fully faded out by now (opacity 0 at frame 500).

- **Frames 540-580**: The contrast is now visible. The Vibe Coder column — only top tier lit. The AI-Augmented Dev column — all tiers lit. At Y: 820 between the columns: a `<` / `>` comparison icon. `AnimatedText variant="hero" size={72} color="#F59E0B" entrance="scale" startFrame={545} springPreset="bouncy"` reading "vs". Below at Y: 900: `AnimatedText variant="body" size={32} color="#9CA3AF" entrance="fade" startFrame={555} springPreset="gentle"` reading "one layer vs. all layers".

  At frame 560, the Vibe Coder column's inactive tiers pulse with a dim errorRed border (1px, #EF4444 at 20% opacity, 2-frame flash) — the hidden vulnerability. The AI-Augmented Dev column's active tiers get a subtle solutionGreen glow — box shadow equivalent, solutionGreen at 6% opacity, 15px spread, fading in over 10 frames.

- **Frames 580-620**: The "vs" and comparison text dim. At Y: 1050: `AnimatedText variant="body" size={40} color="#F59E0B" entrance="slideUp" startFrame={585} springPreset="gentle"` reading "Understanding the layer beneath". The word "beneath" uses `ShinyText startFrame={590} shineColor="#FFFFFF" duration={30} fontSize={40}`. A thin horizontal line (insightOrange, 2px, 400px wide, centered) draws beneath the text over 15 frames starting at frame 595 — an underline that echoes the layer metaphor.

- **Frames 620-660**: The `AbstractionLayerStrip` from frames 300-340 reappears at Y: 1200 (opacity 0 to 0.5 over 20 frames starting at frame 620) — the P1 callback. The "AI / Vibe Code" segment is still highlighted. But now a small downward arrow and the text "know this too" in insightOrange 24px appears below the "Frameworks" segment (one layer down from AI) at frame 635, fading in over 10 frames. This is the thesis: understanding the layer below. All elements begin fading at frame 650 (opacity to 0, 20 frames into Scene 4).

**BEATS:**
```typescript
const BEATS = {
  BG_COLOR_SHIFT: 300,
  LAYER_STRIP_IN: 305,
  AI_SEGMENT_HIGHLIGHT: 320,
  ACCESSIBILITY_BAR_IN: 345,
  UNDERSTANDING_BAR_IN: 355,
  CROSSOVER_FLASH: 370,
  TRADEOFF_TEXT_IN: 395,
  SHINE_EVERY: 400,
  STRIP_DIM: 410,
  TRADEOFF_FADE_OUT: 420,
  BEFORE_AI_TITLE: 430,
  TRADITIONAL_DEV_IN: 445,
  TITLE_CROSSFADE: 480,
  COLUMN_SLIDE_LEFT: 480,
  VIBE_CODER_IN: 495,
  TRADITIONAL_FADE: 500,
  AUGMENTED_DEV_IN: 505,
  VS_TEXT_IN: 545,
  COMPARISON_LABEL: 555,
  VIBE_VULNERABILITY_FLASH: 560,
  AUGMENTED_GLOW: 562,
  VS_DIM: 580,
  BENEATH_TEXT_IN: 585,
  SHINE_BENEATH: 590,
  UNDERLINE_DRAW: 595,
  STRIP_REAPPEAR: 620,
  KNOW_THIS_TOO: 635,
  FADE_TO_TRANSITION: 650,
  SCENE_END: 660,
};
```

**Components:** AbstractionLayerStrip, CapabilityColumn, AnimatedText, ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution — "Not Gatekeeping, Just Physics" (22s-30s, frames 660-900)

**Narration:** > "Vibe coding isn't bad. It's a new abstraction layer. Just like every abstraction before it, the people who understand what's underneath will always have an advantage over those who don't."
>
> "That's not gatekeeping. That's how every layer of computing has always worked."

**Visuals:**

- **Frames 660-700**: Clean dark bg (#0A0A0F). `AmbientBackground` (particleCount: 20, color: #F59E0B at 10% opacity, speed: 0.25). At Y: 500, centered: `AnimatedText variant="title" size={56} color="#F59E0B" entrance="scale" startFrame={665} springPreset="bouncy"` reading "Vibe coding isn't bad." Wrapped in `ShinyText startFrame={670} shineColor="#FFFFFF" duration={40} fontSize={56}`. Below at Y: 590: `AnimatedText variant="body" size={40} color="#9CA3AF" entrance="fade" startFrame={678} springPreset="gentle"` reading "It's a new abstraction layer." The word "abstraction" in techBlue #3B82F6.

- **Frames 700-750**: The `AbstractionLayerStrip` makes its final appearance at Y: 750, full width, centered. `layers={[{name: "Hardware", color: "#5B21B6"}, {name: "OS", color: "#6D28D9"}, {name: "Language", color: "#818CF8"}, {name: "Framework", color: "#3B82F6"}, {name: "AI", color: "#8B5CF6"}, {name: "Vibe Code", color: "#F59E0B"}]} highlightIndex={5} startFrame={705}`. Segments fill left-to-right, staggered by 4 frames. "Vibe Code" is the rightmost, highlighted, pulsing with insightOrange glow. At frame 720, each segment gets a small upward arrow icon (8px, segment color, 60% opacity) appearing above it — they all point upward, representing the chain of abstraction. Arrows stagger left-to-right, 3 frames apart.

- **Frames 750-800**: The strip and arrows hold. At Y: 880: `AnimatedText variant="body" size={44} color="#E5E7EB" entrance="slideUp" startFrame={755} springPreset="gentle"` reading "The advantage is always". At Y: 940: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="slideUp" startFrame={765} springPreset="bouncy"` reading "understanding what's underneath." The word "underneath" gets a subtle underline — insightOrange, 2px, drawing left-to-right over 20 frames starting at frame 775. `Vignette` intensity increases to 0.7 over 15 frames starting at 770 — draws the eye to center text.

- **Frames 800-840**: At Y: 1100: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={805} springPreset="gentle"` reading "That's not gatekeeping." At frame 815, that text crossfades to `AnimatedText variant="body" size={36} color="#E5E7EB" entrance="fade" startFrame={815} springPreset="gentle"` reading "That's how computing has always worked." — a quiet, confident close to the argument. The "always" in insightOrange #F59E0B. The AbstractionLayerStrip segments begin dimming one by one, right-to-left (each opacity to 0.2 over 10 frames, staggered 5 frames apart, starting at frame 820). "Vibe Code" dims last.

- **Frames 840-900**: All elements fade to black. Text elements opacity interpolate to 0 over 30 frames starting at frame 840. The AbstractionLayerStrip fades last (opacity to 0 starting at frame 855, 30 frames). `AmbientBackground` particle opacity fades to 0. Clean black by frame 885. Breathing room.

**BEATS:**
```typescript
const BEATS = {
  ISNT_BAD_IN: 665,
  SHINE_ISNT_BAD: 670,
  NEW_LAYER_TEXT: 678,
  FINAL_STRIP_IN: 705,
  ARROWS_START: 720,
  ADVANTAGE_TEXT: 755,
  UNDERNEATH_TEXT: 765,
  UNDERLINE_DRAW: 775,
  VIGNETTE_INTENSIFY: 770,
  NOT_GATEKEEPING: 805,
  ALWAYS_WORKED_IN: 815,
  STRIP_DIM_START: 820,
  TEXT_FADE_OUT: 840,
  STRIP_FADE_OUT: 855,
  BLACK_ACHIEVED: 885,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, ShinyText, AbstractionLayerStrip, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None — text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room — nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 800, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "Every abstraction layer trades"

- **Frames 1000-1050**: Second line enters at Y: 880, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "understanding for accessibility."
  Key line — accent color (insightOrange). Slightly larger font to carry visual weight.

- **Frames 1040-1075**: Third line enters at Y: 970, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "Know what's underneath."
  Understated — muted color, slightly smaller. The thesis in three words.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line — insightOrange #F59E0B at 5% opacity, 400px radius, centered at Y: 880. Opacity interpolates from 0% to 5% over 20 frames.

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
