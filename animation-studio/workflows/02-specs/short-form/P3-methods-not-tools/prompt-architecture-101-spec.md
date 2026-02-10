# Prompt Architecture 101

## Overview
- **ID**: T-21
- **Slug**: prompt-architecture-101
- **Pillar**: P3 (Methods, Not Tools)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P3-methods-not-tools/prompt-architecture-101-review.md
- **Accent colors**: insightOrange (#F59E0B), techBlue (#3B82F6), solutionGreen (#10B981), aiPurple (#8B5CF6)
- **Core metaphor**: Prompt engineering is architecture, not interior decorating -- the load-bearing structure (context, task, format, examples) matters more than the surface wording, and structure transfers across every model.
- **Key visual**: Two prompts side by side -- a messy paragraph on the left versus four clean labeled layers on the right -- fed into a model, producing dramatically different outputs. Then the structured prompt replicates identically across four model logos.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | techBlue #3B82F6 | Familiar/analytical -- "prompt advice" territory |
| Context | insightOrange #F59E0B | Reframe -- architecture vs. wording |
| Core | techBlue → solutionGreen | Technical build-up, structured clarity |
| Resolution | solutionGreen #10B981 + aiPurple #8B5CF6 | Universality, cross-model proof |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### PromptBlock
A rectangular panel representing a prompt. Supports two modes: "messy" (unstructured paragraph) and "structured" (four labeled sections).

- **Props:** `mode: "messy" | "structured", width: number, height: number, x: number, y: number, startFrame: number, springPreset: "snappy" | "gentle" | "bouncy", highlightSection?: number`
- **Panel chrome:** bgSurface (#12121A) fill, 12px border-radius, 2px border panelBorder (#1A1A24). Top row: three 10px circles (red #EF4444, amber #F59E0B, green #10B981) with 6px gap, 16px from top-left. Title bar: "prompt.txt" in Inter 500, 20px, textDim (#6B7280), centered in top row.
- **Messy mode:** Interior is a single block of text, Inter 400, 24px, textMuted (#9CA3AF), line-height 1.5, 24px padding. Text wraps chaotically -- no whitespace breaks, no labels. Simulates a wall-of-text prompt. Faint red tint overlay at 3% opacity (#EF4444).
- **Structured mode:** Interior divided into four horizontal sections, each with a colored left-border (4px), a section label (Inter 600, 22px, section color), and body text (Inter 400, 22px, #E5E7EB). Section gap: 12px. Sections:
  1. **CONTEXT** -- left border techBlue #3B82F6, label color #3B82F6
  2. **TASK** -- left border insightOrange #F59E0B, label color #F59E0B
  3. **FORMAT** -- left border solutionGreen #10B981, label color #10B981
  4. **EXAMPLES** -- left border aiPurple #8B5CF6, label color #8B5CF6
- **highlightSection** (1-4): when set, the targeted section's left-border glows (box-shadow: `0 0 12px sectionColor` at 40% opacity) and all other sections dim to 40% opacity. Use for sequential reveal.
- **Panel entrance:** opacity 0 to 1 + scale 0.95 to 1.0 (named spring preset) starting at startFrame.

### HouseMetaphor
A simple architectural cross-section of a house showing load-bearing walls, plumbing, electrical, and paint.

- **Props:** `startFrame: number, phase: "paint" | "structure" | "full", width: number, height: number, x: number, y: number`
- **Phase "paint":** Only the outer wall outline (2px, #9CA3AF) and colored paint swatches (#EF4444, #3B82F6, #10B981) on walls. Looks decorative but hollow.
- **Phase "structure":** Load-bearing walls (thick 4px lines, insightOrange #F59E0B), plumbing (dashed 2px lines, techBlue #3B82F6), electrical (dotted 2px lines, #F59E0B at 60% opacity) appear inside. Structural. Functional.
- **Phase "full":** Both paint and structure visible. Structure glows faintly (insightOrange at 8% shadow), paint dims to 30% opacity.
- Labels below diagram: Inter 500, 28px. "paint" → "Paint = Words" (#9CA3AF); "structure" → "Structure = Architecture" (#F59E0B).
- Each phase transition uses spring: gentle over 20 frames. Elements enter with opacity 0 to 1 and translateY +20px to 0.

### ModelLogo
A rounded square icon representing an AI model.

- **Props:** `model: "Claude" | "ChatGPT" | "Gemini" | "Local", size: number, x: number, y: number, startFrame: number, springPreset: "snappy" | "bouncy", active: boolean`
- **Claude:** aiPurple (#8B5CF6) fill, white "C" glyph, Inter 700, 40px
- **ChatGPT:** solutionGreen (#10B981) fill, white "G" glyph, Inter 700, 40px
- **Gemini:** techBlue (#3B82F6) fill, white "Ge" glyph, Inter 700, 32px
- **Local:** textDim (#6B7280) fill, white terminal icon ">" glyph, JetBrains Mono 700, 40px
- Size: `size x size` px, 16px border-radius
- `active=true`: 2px border in fill color at 80% opacity, subtle pulsing glow (`Math.sin(frame * 0.1) * 0.15 + 0.85` opacity on box-shadow)
- `active=false`: opacity 0.3, no glow
- Entrance: scale 0 to 1 (named spring preset)

### OutputPanel
A result panel below a prompt showing quality of output.

- **Props:** `quality: "poor" | "excellent", width: number, height: number, x: number, y: number, startFrame: number`
- **Panel:** bgSurface (#12121A) fill, 12px border-radius, 2px border
- **"poor":** Border color errorRed #EF4444 at 30% opacity. Interior: 3 lines of garbled placeholder text (Inter 400, 20px, #6B7280), red "LOW QUALITY" badge (errorRed bg, 16px white text, top-right corner, 8px border-radius). A faint diagonal strikethrough line across the panel (errorRed at 15% opacity, 2px).
- **"excellent":** Border color solutionGreen #10B981 at 30% opacity. Interior: 3 lines of clean structured placeholder text (Inter 400, 20px, #E5E7EB), green "HIGH QUALITY" badge (solutionGreen bg, 16px white text, top-right corner, 8px border-radius). Subtle checkmark icon (solutionGreen, 24px) left of first line.
- Entrance: opacity 0 to 1 + translateY +30px to 0 (spring: snappy) over 20 frames.

---

## Scene Breakdown

### Scene 1: Hook -- "Words Aren't the Point" (0s-3s, frames 0-90)

**Narration:** > "Most prompt advice focuses on the words you use. 'Be specific.' 'Give examples.' 'Say please.' That stuff helps. But it misses the bigger picture."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F) with `AmbientBackground` (particleCount: 25, color: #3B82F6 at 12% opacity, speed: 0.2). `Vignette` overlay (opacity: 0.5). Center screen at Y: 750: `AnimatedText variant="title" size={56} color="#3B82F6" entrance="fade" startFrame={0} springPreset="gentle"` reading "Prompt Advice". Clean, familiar territory.

- **Frames 15-35**: Three tip badges appear staggered below at Y: 860, 930, 1000 respectively. Each badge: 500px wide, 52px tall, bgSurface (#12121A) fill, 8px border-radius, 1px border #1A1A24, centered horizontally. Text inside each badge is Inter 500, 28px, #9CA3AF.
  - Badge 1 `"Be specific."` enters at frame 15 (spring: snappy, opacity 0 to 1, translateX -40px to 0).
  - Badge 2 `"Give examples."` enters at frame 22 (spring: snappy, same animation).
  - Badge 3 `"Say please."` enters at frame 29 (spring: snappy, same animation). Badge 3 text uses a slightly italic style and #6B7280 color to signal triviality.

- **Frames 35-55**: A thin horizontal line (2px, techBlue #3B82F6 at 30% opacity) draws across at Y: 1080, width interpolates from 0 to 700px centered over 15 frames starting at frame 35. Below line at Y: 1110: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={40} springPreset="gentle"` reading "That stuff helps.". Understated.

- **Frames 55-75**: "Prompt Advice" title and all three badges dim -- opacity interpolates from 1.0 to 0.25 over 15 frames starting at frame 55. The horizontal line color shifts from techBlue to insightOrange (interpolate hex #3B82F6 to #F59E0B over 20 frames). At Y: 1110 the "That stuff helps." text fades out (opacity to 0 over 10 frames starting at frame 55).

- **Frames 75-90**: At Y: 1110: `AnimatedText variant="title" size={48} color="#F59E0B" entrance="scale" startFrame={75} springPreset="bouncy"` reading "But it misses the bigger picture." Key reframe beat. "bigger picture" wrapped in `ShinyText startFrame={80} shineColor="#FFFFFF" duration={40} fontSize={48}`. Dimmed elements hold at 0.25 opacity, begin fading to 0 at frame 85 (15-frame fade out into Scene 2).

**BEATS:**
```typescript
const BEATS = {
  TITLE_IN: 0,
  BADGE_1_IN: 15,
  BADGE_2_IN: 22,
  BADGE_3_IN: 29,
  UNDERLINE_DRAW: 35,
  HELPS_LABEL: 40,
  TITLE_BADGES_DIM: 55,
  LINE_COLOR_SHIFT: 55,
  HELPS_FADE: 55,
  REFRAME_IN: 75,
  SHINE_SWEEP: 80,
  ELEMENTS_EXIT: 85,
  SCENE_END: 90,
};
```

**Components:** AnimatedText, ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context -- "Architecture, Not Wording" (3s-10s, frames 90-300)

**Narration:** > "Prompt architecture is about structure, not wording. Think about it like building a house. The words are the paint color. The architecture is the load-bearing walls, the plumbing, the electrical. If the structure is wrong, no amount of better paint fixes it."

**Visuals:**

- **Frames 90-120**: Clean dark bg. At Y: 400, centered: `AnimatedText variant="hero" size={64} color="#F59E0B" entrance="scale" startFrame={95} springPreset="bouncy"` reading "Structure". Below at Y: 490: `AnimatedText variant="title" size={44} color="#9CA3AF" entrance="fade" startFrame={105} springPreset="gentle"` reading "not wording." The word "Structure" wrapped in `GradientText colors={["#F59E0B", "#FBBF24", "#F59E0B"]} direction="horizontal" duration={90} fontSize={64}`.

- **Frames 120-135**: "Structure" and "not wording." shift upward -- translateY interpolates by -200px over 15 frames (spring: gentle). Makes room for the house metaphor below.

- **Frames 135-185**: `HouseMetaphor startFrame={135} phase="paint" width={800} height={500} x={140} y={650}` enters. The paint-only house appears -- decorative colors on walls, no internal structure. Below the house at Y: 1180: label "Paint = Words" (Inter 500, 32px, #9CA3AF, entrance: fade, startFrame: 145). The house looks superficially nice but visually hollow.

- **Frames 185-215**: House transitions to phase "structure" -- paint fades to 15% opacity over 15 frames, load-bearing walls draw in (strokeDashoffset animation, 20 frames), plumbing draws in (dashed lines, staggered 5 frames later), electrical draws in (dotted lines, staggered 5 more frames). Each structural element: opacity 0 to 1, spring: gentle. Label updates: "Paint = Words" fades out (10 frames), replaced by "Structure = Architecture" (Inter 500, 32px, insightOrange #F59E0B, entrance: fade, startFrame: 200).

- **Frames 215-250**: House transitions to phase "full". Structure elements glow faintly (insightOrange box-shadow at 8% opacity, 20px spread). Paint returns but at 30% opacity -- visually subordinate to structure. At Y: 380 (above the house): `AnimatedText variant="body" size={36} color="#E5E7EB" entrance="slideUp" startFrame={220} springPreset="gentle"` reading "Wrong structure = no amount of better paint fixes it."

- **Frames 250-280**: House and labels begin fading out -- opacity to 0 over 30 frames (spring: slow). "Structure / not wording" text at top also fades (opacity to 0 over 20 frames starting at frame 255).

- **Frames 280-300**: Transition to black. All elements at 0 opacity by frame 295. 5 frames of clean black breathing room before Scene 3.

**BEATS:**
```typescript
const BEATS = {
  STRUCTURE_TITLE_IN: 95,
  NOT_WORDING_IN: 105,
  TITLE_SHIFT_UP: 120,
  HOUSE_PAINT_IN: 135,
  PAINT_LABEL_IN: 145,
  STRUCTURE_REVEAL_START: 185,
  WALLS_DRAW: 185,
  PLUMBING_DRAW: 190,
  ELECTRICAL_DRAW: 195,
  STRUCTURE_LABEL_IN: 200,
  FULL_HOUSE_PHASE: 215,
  STRUCTURE_GLOW: 215,
  WRONG_STRUCTURE_TEXT: 220,
  HOUSE_FADE_OUT: 250,
  TITLE_FADE_OUT: 255,
  TRANSITION_BLACK: 280,
  SCENE_END: 300,
};
```

**Components:** AnimatedText, GradientText, HouseMetaphor (custom)
**Background:** dark (#0A0A0F)

---

### Scene 3: Core -- "The Four Layers" (10s-22s, frames 300-660)

**Narration:** > "A well-architected prompt has layers. Context at the top: who is the AI in this conversation and what are the constraints. Then the task: what specifically needs to be done. Then the format: what should the output look like. Then examples: here's what good looks like and what bad looks like. Context, task, format, examples. That structure works in Claude. In ChatGPT. In Gemini. In local models. The words change. The architecture doesn't."

**Visuals:**

This is the key visual sequence. A split-screen comparison builds, then the structured prompt proves its universality.

**Phase 1: Split-Screen Build (frames 300-480)**

- **Frames 300-330**: Screen divides vertically. A thin 2px divider line (#1A1A24) draws from Y: 250 to Y: 1650 at X: 540, over 20 frames (strokeDashoffset animation, starting frame 305). Left half label at Y: 280, X: 170: `AnimatedText variant="label" size={28} color="#EF4444" entrance="fade" startFrame={310} springPreset="snappy"` reading "UNSTRUCTURED". Right half label at Y: 280, X: 650: `AnimatedText variant="label" size={28} color="#10B981" entrance="fade" startFrame={315} springPreset="snappy"` reading "STRUCTURED".

- **Frames 330-360**: Left side: `PromptBlock mode="messy" width={440} height={600} x={50} y={340} startFrame={330} springPreset="snappy"`. The messy prompt panel slides in -- a dense paragraph of text with no structure. Wall-of-text feel. Faint red tint overlay.

- **Frames 360-390**: Right side: `PromptBlock mode="structured" width={440} height={600} x={590} y={340} startFrame={360} springPreset="snappy"`. The structured prompt panel slides in -- same information but organized into four labeled sections with colored left-borders.

- **Frames 390-420**: Right-side PromptBlock highlights section 1 (CONTEXT): `highlightSection={1}` activates at frame 390. CONTEXT section's left-border glows techBlue, other sections dim to 40% opacity. At Y: 960, right half: `AnimatedText variant="body" size={32} color="#3B82F6" entrance="slideUp" startFrame={395} springPreset="gentle"` reading "Who is the AI? Constraints." This label fades after 20 frames (opacity to 0, frames 415-420).

- **Frames 420-440**: Highlight shifts to section 2 (TASK): `highlightSection={2}` at frame 420. TASK section glows insightOrange. At Y: 960: `AnimatedText variant="body" size={32} color="#F59E0B" entrance="slideUp" startFrame={425} springPreset="gentle"` reading "What needs to be done." Fades frames 435-440.

- **Frames 440-455**: Highlight shifts to section 3 (FORMAT): `highlightSection={3}` at frame 440. FORMAT section glows solutionGreen. At Y: 960: `AnimatedText variant="body" size={32} color="#10B981" entrance="slideUp" startFrame={443} springPreset="gentle"` reading "What output looks like." Fades frames 450-455.

- **Frames 455-480**: Highlight shifts to section 4 (EXAMPLES): `highlightSection={4}` at frame 455. EXAMPLES section glows aiPurple. At Y: 960: `AnimatedText variant="body" size={32} color="#8B5CF6" entrance="slideUp" startFrame={458} springPreset="gentle"` reading "Good vs. bad." Fades frames 470-475. At frame 475, all sections return to full opacity (highlight removed), showing the complete structured prompt in its full form.

**Phase 2: Output Comparison (frames 480-540)**

- **Frames 480-500**: Below each PromptBlock, a downward arrow draws (2px, respective color, 30px tall, strokeDashoffset over 10 frames). Left arrow at X: 270, Y: 960, color #EF4444, startFrame 480. Right arrow at X: 810, Y: 960, color #10B981, startFrame 485.

- **Frames 500-530**: Left side: `OutputPanel quality="poor" width={440} height={240} x={50} y={1010} startFrame={500}`. Red-bordered panel with garbled output and "LOW QUALITY" badge. Right side: `OutputPanel quality="excellent" width={440} height={240} x={590} y={1010} startFrame={508}`. Green-bordered panel with clean output and "HIGH QUALITY" badge.

- **Frames 530-540**: Left-side OutputPanel and PromptBlock pulse errorRed border (opacity oscillates 0.3 to 0.6 for 2 cycles, 5 frames each). Right-side OutputPanel and PromptBlock pulse solutionGreen border similarly. Visual emphasis: structure determines output quality.

**Phase 3: Universality Proof (frames 540-660)**

- **Frames 540-570**: All left-side elements (messy prompt, poor output, label, arrow) fade out -- opacity to 0 over 20 frames starting at frame 540. Divider line fades out (10 frames, frame 545). "UNSTRUCTURED" label fades. Right-side elements (structured prompt, excellent output) slide to center -- translateX interpolates from current X to centered position (X: 320 for prompt, X: 320 for output) over 25 frames (spring: snappy). "STRUCTURED" label fades out (frame 545, 10 frames). The structured prompt now owns the screen.

- **Frames 570-590**: OutputPanel fades out (opacity to 0, 15 frames starting at 570). PromptBlock shifts up -- translateY interpolates by -150px (spring: gentle, 20 frames). Makes room below for model logos.

- **Frames 590-615**: Four `ModelLogo` components appear in a horizontal row at Y: 1050, spaced 180px apart (X: 180, 360, 540, 720). Each 80x80px.
  - `ModelLogo model="Claude" startFrame={590} springPreset="bouncy" active={false}`
  - `ModelLogo model="ChatGPT" startFrame={596} springPreset="bouncy" active={false}`
  - `ModelLogo model="Gemini" startFrame={602} springPreset="bouncy" active={false}`
  - `ModelLogo model="Local" startFrame={608} springPreset="bouncy" active={false}`
  Staggered 6 frames apart. All enter at `active=false` (dimmed, 30% opacity).

- **Frames 615-625**: A thin arrow draws from bottom of PromptBlock (Y: ~820) down to the logo row (Y: 1030). 2px, solutionGreen #10B981 at 50% opacity, strokeDashoffset over 10 frames starting at frame 615. Visual: same prompt feeds all models.

- **Frames 625-640**: Claude logo activates -- `active=true` at frame 625. Pulsing glow begins. A 2px connection line from arrow to Claude logo highlights (solutionGreen, opacity 0 to 0.6 over 5 frames). Above Claude logo at Y: 1000: tiny checkmark (solutionGreen, 24px, opacity fade in 8 frames, startFrame 627).

- **Frames 640-648**: ChatGPT logo activates (`active=true`). Same connection highlight and checkmark pattern, startFrame 640.

- **Frames 648-654**: Gemini logo activates (`active=true`). Same pattern, startFrame 648.

- **Frames 654-660**: Local logo activates (`active=true`). Same pattern, startFrame 654. All four logos now glowing. At Y: 1180: `AnimatedText variant="body" size={36} color="#E5E7EB" entrance="fade" startFrame={656} springPreset="gentle"` reading "Same structure. Every model." -- appears just before scene end.

**BEATS:**
```typescript
const BEATS = {
  // Phase 1: Split-Screen Build
  DIVIDER_DRAW: 305,
  LABEL_UNSTRUCTURED: 310,
  LABEL_STRUCTURED: 315,
  MESSY_PROMPT_IN: 330,
  STRUCTURED_PROMPT_IN: 360,
  HIGHLIGHT_CONTEXT: 390,
  CONTEXT_LABEL: 395,
  HIGHLIGHT_TASK: 420,
  TASK_LABEL: 425,
  HIGHLIGHT_FORMAT: 440,
  FORMAT_LABEL: 443,
  HIGHLIGHT_EXAMPLES: 455,
  EXAMPLES_LABEL: 458,
  ALL_SECTIONS_FULL: 475,

  // Phase 2: Output Comparison
  ARROW_LEFT_DRAW: 480,
  ARROW_RIGHT_DRAW: 485,
  OUTPUT_POOR_IN: 500,
  OUTPUT_EXCELLENT_IN: 508,
  BORDER_PULSE: 530,

  // Phase 3: Universality
  LEFT_SIDE_FADE: 540,
  DIVIDER_FADE: 545,
  RIGHT_SLIDE_CENTER: 540,
  OUTPUT_FADE: 570,
  PROMPT_SHIFT_UP: 570,
  CLAUDE_LOGO_IN: 590,
  CHATGPT_LOGO_IN: 596,
  GEMINI_LOGO_IN: 602,
  LOCAL_LOGO_IN: 608,
  FEED_ARROW_DRAW: 615,
  CLAUDE_ACTIVE: 625,
  CHATGPT_ACTIVE: 640,
  GEMINI_ACTIVE: 648,
  LOCAL_ACTIVE: 654,
  SAME_STRUCTURE_TEXT: 656,
  SCENE_END: 660,
};
```

**Components:** PromptBlock (custom), OutputPanel (custom), ModelLogo (custom), AnimatedText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution -- "Methods Transfer" (22s-30s, frames 660-900)

**Narration:** > "Methods transfer. Tool-specific tricks don't."

**Visuals:**

- **Frames 660-690**: Previous scene elements (PromptBlock, ModelLogos, text) hold from Scene 3 end. The four active ModelLogos pulse in unison -- glow intensity oscillates using `Math.sin((frame - 660) * 0.15) * 0.2 + 0.8` for 30 frames. The structured prompt above them has a subtle breathing scale: interpolates between 1.0 and 1.02 over 30 frames (sinusoidal). The "same structure, every model" message is reinforced visually.

- **Frames 690-720**: All Scene 3 remaining elements begin fading out -- opacity to 0 over 25 frames (spring: slow). PromptBlock, logos, arrows, checkmarks, text all exit together. Clean transition.

- **Frames 720-740**: 20 frames of breathing room. Dark bg only. `Vignette` (opacity: 0.4) remains.

- **Frames 740-790**: Center screen at Y: 700: `AnimatedText variant="hero" size={72} color="#F59E0B" entrance="scale" startFrame={740} springPreset="bouncy"` reading "Methods". Wrapped in `ShinyText startFrame={748} shineColor="#FFFFFF" duration={50} fontSize={72}`. Below at Y: 800: `AnimatedText variant="title" size={52} color="#10B981" entrance="slideUp" startFrame={755} springPreset="gentle"` reading "transfer." A radial glow fades in behind "Methods" -- insightOrange #F59E0B at 6% opacity, 350px radius, centered at Y: 700, opacity interpolates from 0 to 0.06 over 20 frames starting at frame 745.

- **Frames 790-830**: Below at Y: 920: A thin horizontal divider (2px, #1A1A24) draws from center outward, width 0 to 600px over 15 frames starting at frame 790. Below divider at Y: 960: `AnimatedText variant="title" size={48} color="#6B7280" entrance="fade" startFrame={800} springPreset="gentle"` reading "Tool-specific tricks". At frame 810: `GlitchBurst startFrame={810} burstDuration={12} burstInterval={60} fontSize={48} color="#6B7280"` wraps "Tool-specific tricks". The glitch communicates fragility/unreliability. Below at Y: 1040: `AnimatedText variant="body" size={44} color="#EF4444" entrance="fade" startFrame={815} springPreset="snappy"` reading "don't." in errorRed. Blunt, final.

- **Frames 830-860**: "Methods" and "transfer." hold strong at full brightness. "Tool-specific tricks" and "don't." dim -- opacity interpolates from 1.0 to 0.2 over 20 frames starting at frame 835. A strikethrough line draws across "Tool-specific tricks" -- 2px, errorRed #EF4444 at 50% opacity, width interpolates from 0 to text width over 15 frames starting at frame 830. The visual hierarchy: methods win, tricks lose.

- **Frames 860-900**: All elements fade out -- opacity to 0 over 30 frames (spring: slow). Radial glow behind "Methods" fades last (starts fading at frame 870). Clean exit to black by frame 895. 5 frames of clean dark before Scene 5.

**BEATS:**
```typescript
const BEATS = {
  LOGOS_PULSE: 660,
  ELEMENTS_FADE_OUT: 690,
  BREATHING_ROOM: 720,
  METHODS_IN: 740,
  METHODS_GLOW: 745,
  METHODS_SHINE: 748,
  TRANSFER_IN: 755,
  DIVIDER_DRAW: 790,
  TRICKS_TEXT_IN: 800,
  GLITCH_BURST: 810,
  DONT_IN: 815,
  TRICKS_DIM: 835,
  STRIKETHROUGH_DRAW: 830,
  ALL_FADE_OUT: 860,
  GLOW_FADE: 870,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, ShinyText, GlitchBurst, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 780, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#E5E7EB"`:
  "Structure is the skill."

- **Frames 1000-1050**: Second line enters at Y: 870, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "It works everywhere."
  Key line -- accent color (insightOrange).

- **Frames 1040-1070**: Third line enters at Y: 960, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "The words change. The architecture doesn't."
  Understated -- muted color, slightly smaller.

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
