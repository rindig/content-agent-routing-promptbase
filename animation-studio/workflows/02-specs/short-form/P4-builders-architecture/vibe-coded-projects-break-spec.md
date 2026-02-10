# Vibe-Coded Projects Break

## Overview
- **ID**: T-40
- **Slug**: vibe-coded-projects-break
- **Pillar**: P4 (Builder's Architecture)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P4-builders-architecture/vibe-coded-projects-break-review.md
- **Accent colors**: techBlue (#3B82F6), errorRed (#EF4444), insightOrange (#F59E0B), solutionGreen (#10B981)
- **Core metaphor**: Vibe-coded projects are buildings assembled by separate crews who never talked to each other -- they look finished until you test the seams.
- **Key visual**: A sleek code project built from AI-generated blocks that visually fractures at the boundaries between components, revealing gaps, mismatched edges, and missing paths glowing red.
- **Frame number convention**: Global (frame numbers match visual descriptions)

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | techBlue #3B82F6 | Speed, impressiveness |
| Context | errorRed #EF4444 | Anxiety, warning |
| Core | errorRed → insightOrange gradient | Breakdown, discovery |
| Resolution | solutionGreen #10B981 | Fix, comprehension |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### CodeBlockUnit

A rectangular panel representing an AI-generated code module. Multiple units snap together to form a "project."

- **Props:** `label: string, code: string[], width: number, height: number, x: number, y: number, borderColor: string, startFrame: number, springPreset: "snappy" | "bouncy", status: "ok" | "error" | "dim"`
- Panel: `width` x `height`, surface (#12121A) fill, 2px border in `borderColor`, 12px border-radius
- Top row: three 10px circles (errorRed #EF4444, insightOrange #F59E0B, solutionGreen #10B981) with 6px gap, 12px from top-left
- Label: Inter 600, 28px, `#E5E7EB`, centered below terminal dots
- Code lines: JetBrains Mono 400, 24px, `#9CA3AF`, left-aligned with 20px padding, typewriter reveal at 2 chars/frame
- `status="ok"`: border at full opacity, content visible
- `status="error"`: border pulses errorRed (opacity oscillates `Math.sin(frame * 0.15) * 0.3 + 0.7`), 2px → 3px border throb
- `status="dim"`: opacity 0.3, desaturated
- Entrance: scale 0.9 → 1.0 + opacity 0 → 1 (spring: named preset), duration 15 frames

### BoundaryGap

A visual crack or gap between two adjacent CodeBlockUnits, showing misalignment.

- **Props:** `x: number, y: number, width: number, height: number, startFrame: number, glowColor: string`
- Renders a jagged vertical or horizontal line (SVG path with random offsets +-3px every 8px) in `glowColor` at 60% opacity
- Behind the line: a blurred glow (glowColor at 12% opacity, 40px radius gaussian blur)
- Entrance: opacity 0 → 1 + glow radius 0 → 40px over 20 frames (spring: snappy)
- Small floating particles (4-6 dots, 3px, glowColor at 30% opacity) drift outward from gap at 0.5px/frame

### EdgeCaseIndicator

A small warning badge that appears where code paths are missing.

- **Props:** `label: string, x: number, y: number, startFrame: number, color: string`
- Pill shape: 120w x 36h, color fill at 15% opacity, 1px solid color border, 18px border-radius
- Label: Inter 500, 20px, `color`, centered
- Entrance: scale 0 → 1.0 (spring: bouncy), slight rotateZ from -5deg to 0
- After entrance: subtle pulse (scale oscillates 1.0 → 1.04 → 1.0 via `Math.sin(frame * 0.1) * 0.04 + 1.0`)

### TimeSkipOverlay

Full-screen overlay simulating a time-lapse fast-forward effect.

- **Props:** `startFrame: number, duration: number, label: string`
- Semi-transparent dark (#0A0A0F at 70% opacity) overlay
- Label: Inter 600, 48px, `#9CA3AF`, centered, with `GlitchBurst` wrapper
- Horizontal scan line (2px, #3B82F6 at 30% opacity) sweeps top to bottom over `duration` frames
- Clock-like counter in top-right corner: `CountUp` showing months elapsed

---

## Scene Breakdown

### Scene 1: Hook -- "Vibe Coding" (0s-3s, frames 0-90)

**Narration:** > "'Vibe coding' is when you describe what you want to AI and it generates the code. You don't really understand the code. You just know it works. Until it doesn't."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #3B82F6 at 10% opacity, speed: 0.4). `Vignette` (opacity: 0.5). Center screen at Y: 750, a chat-style prompt box fades in: rounded rect 860w x 100h, surface (#12121A) fill, 1px border #3B82F6 at 30% opacity, 12px radius. Inside, a blinking cursor (2px wide, #3B82F6, toggle every 15 frames). Opacity 0 → 1 (spring: gentle, 15 frames).

- **Frames 15-40**: Typewriter text inside the prompt box: "Build me a dashboard app" in JetBrains Mono 28px, #E5E7EB, revealing at 1.5 chars/frame. Cursor advances with text. Above the prompt at Y: 670: `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" startFrame={15} springPreset="gentle"` reading "PROMPT".

- **Frames 40-65**: Three `CodeBlockUnit` panels rapidly assemble below the prompt, staggered by 8 frames. They slam into position (spring: snappy). Panel 1: `label="auth.js" x={90} y={880} width={280} height={200} borderColor="#3B82F6" startFrame={40}`. Panel 2: `label="dashboard.js" x={400} y={880} width={280} height={200} borderColor="#3B82F6" startFrame={48}`. Panel 3: `label="api.js" x={710} y={880} width={280} height={200} borderColor="#3B82F6" startFrame={56}`. Code lines type in simultaneously at 3 chars/frame (fast, impressive). All status="ok".

- **Frames 65-78**: All three panels fully assembled. A green checkmark (solutionGreen #10B981, 36px) scales in at Y: 1120 center (spring: bouncy, startFrame: 65). `AnimatedText variant="body" size={40} color="#10B981" entrance="scale" startFrame={68} springPreset="bouncy"` reading "It works!" at Y: 1170.

- **Frames 78-90**: The checkmark and "It works!" text hold for 5 frames, then at frame 83: `GlitchBurst startFrame={83} burstDuration={7} fontSize={40} color="#EF4444"` wraps "It works!" -- brief red glitch. Checkmark rotates 5deg and fades to 40% opacity over 7 frames. The three code panels' borders flicker errorRed for 2 frames at frame 85 then revert. Transition beat: confidence cracks.

**BEATS:**
```typescript
const BEATS = {
  BG_IN: 0,
  PROMPT_BOX_IN: 0,
  TYPEWRITER_START: 15,
  PROMPT_LABEL_IN: 15,
  PANEL_1_IN: 40,
  PANEL_2_IN: 48,
  PANEL_3_IN: 56,
  CHECKMARK_IN: 65,
  IT_WORKS_IN: 68,
  GLITCH_CRACK: 83,
  BORDER_FLICKER: 85,
  SCENE_END: 90,
};
```

**Components:** AnimatedText, CodeBlockUnit (x3), GlitchBurst, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context -- "Where They Break" (3s-10s, frames 90-300)

**Narration:** > "Here's where vibe-coded projects consistently break. First, at the boundaries. Where one piece of AI-generated code meets another. The AI didn't coordinate between them because each prompt was separate. So they make different assumptions about data formats, error handling, and naming."

**Visuals:**

- **Frames 90-110**: The three CodeBlockUnits from Scene 1 remain on screen at Y: 880. Prompt box and checkmark fade out (opacity → 0, 15 frames). At Y: 350, center: `AnimatedText variant="title" size={52} color="#EF4444" entrance="slideUp" startFrame={95} springPreset="snappy"` reading "Where they break". Text-shadow glow: errorRed at 8% opacity, 20px blur.

- **Frames 110-145**: "Where they break" title dims to 40% opacity at frame 130 (interpolate, 15 frames). The three code panels begin spreading apart horizontally: Panel 1 translateX from x:90 to x:50, Panel 2 stays at x:400, Panel 3 translateX from x:710 to x:750 (spring: gentle, 20 frames starting frame 110). Gaps widen between them.

- **Frames 145-185**: `BoundaryGap x={340} y={880} width={50} height={200} startFrame={145} glowColor="#EF4444"` appears between Panel 1 and Panel 2. Jagged crack with red glow. Particles begin drifting. Simultaneously, `BoundaryGap x={690} y={880} width={50} height={200} startFrame={155} glowColor="#EF4444"` appears between Panel 2 and Panel 3. Both panels adjacent to gaps shift border from techBlue to errorRed over 15 frames (color interpolation).

- **Frames 185-220**: Inside Panel 1, a code line highlights: `"data: { user_id: 123 }"` in techBlue 24px. Inside Panel 2, a contrasting code line highlights: `"data: { userId: '123' }"` in errorRed 24px. The mismatch is visible -- different naming, different types. A thin dashed line (errorRed, 1px, dash pattern 4px/4px) connects the two highlighted lines, wobbling +-2px vertically (sinusoidal, period 30 frames). At Y: 780: `AnimatedText variant="label" size={24} color="#EF4444" entrance="fade" startFrame={195} springPreset="gentle"` reading "Different assumptions".

- **Frames 220-255**: Three `EdgeCaseIndicator` badges appear around the panels, staggered 10 frames: `label="FORMAT?" x={180} y={860} startFrame={220} color="#EF4444"`, `label="NAMING?" x={490} y={860} startFrame={230} color="#EF4444"`, `label="ERRORS?" x={780} y={860} startFrame={240} color="#EF4444"`. Each bounces in (spring: bouncy). The boundary gaps intensify: glow radius interpolates from 40px to 60px over 20 frames.

- **Frames 255-300**: All three code panels shift to status="error" -- borders pulsing errorRed. The "Different assumptions" label and connecting dashed line fade out (opacity → 0, 15 frames starting frame 270). Panels and gaps hold, pulsing. Scene breathes before transition. At frame 285, panels begin slight downward drift (translateY +20px over 15 frames, spring: gentle) -- visual gravity pulling them toward Core.

**BEATS:**
```typescript
const BEATS = {
  PROMPT_FADEOUT: 90,
  TITLE_IN: 95,
  TITLE_DIM: 130,
  PANELS_SPREAD: 110,
  GAP_1_IN: 145,
  GAP_2_IN: 155,
  BORDERS_TO_RED: 155,
  CODE_HIGHLIGHT_1: 185,
  CODE_HIGHLIGHT_2: 185,
  MISMATCH_LINE: 185,
  ASSUMPTIONS_LABEL: 195,
  BADGE_FORMAT: 220,
  BADGE_NAMING: 230,
  BADGE_ERRORS: 240,
  GAP_INTENSIFY: 240,
  PANELS_ERROR_STATE: 255,
  LABEL_FADEOUT: 270,
  PANELS_DRIFT_DOWN: 285,
  SCENE_END: 300,
};
```

**Components:** AnimatedText, CodeBlockUnit (x3), BoundaryGap (x2), EdgeCaseIndicator (x3), AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 3: Core -- "Edge Cases and Maintenance" (10s-22s, frames 300-660)

**Narration:** > "Second, at edge cases. The AI generated code for the expected path. The unexpected path wasn't in the prompt, so it wasn't in the code. Third, at maintenance. Six months later, something breaks. Nobody understands the code because nobody wrote it intentionally. Fixing one thing breaks three others."

**Visuals:**

- **Frames 300-330**: Clean transition. Previous panels fade out (opacity → 0, 20 frames). Dark bg holds. At Y: 350, center: `AnimatedText variant="title" size={48} color="#F59E0B" entrance="scale" startFrame={305} springPreset="bouncy"` reading "Edge Cases". New single large CodeBlockUnit appears center: `label="checkout.js" x={90} y={480} width={900} height={400} borderColor="#3B82F6" startFrame={310} springPreset="snappy" status="ok"`. Bigger panel, more code visible. 8 code lines type in sequentially (stagger 3 frames each, 2 chars/frame).

- **Frames 330-380**: Inside the checkout panel, a visual code flow diagram: a thick line (techBlue #3B82F6, 3px) traces the "happy path" vertically through the code from top to bottom. The path is labeled at Y: 500: `AnimatedText variant="label" size={24} color="#3B82F6" entrance="fade" startFrame={335} springPreset="gentle"` reading "Expected path". The path line draws via strokeDashoffset animation over 30 frames starting frame 335. At the end of the path (Y: 830): a small solutionGreen circle (12px, glow 8px blur, opacity 0 → 1 spring: bouncy at frame 365) -- "success."

- **Frames 380-430**: Three branching dotted lines fork off the main path at different Y positions (Y: 560, Y: 650, Y: 740), angling right. Each dotted line (errorRed #EF4444, 2px, dash 6/4) draws out 60px rightward over 15 frames, staggered by 8 frames (startFrame: 380, 388, 396). At the end of each branch: an `EdgeCaseIndicator` appears: `label="null?" startFrame={395} color="#EF4444"`, `label="timeout?" startFrame={403} color="#EF4444"`, `label="empty?" startFrame={411} color="#EF4444"`. Each branch path fades to 0% at its end -- code that was never written. The indicators pulse.

- **Frames 430-465**: "Edge Cases" title and the "Expected path" label dim to 30% opacity (15 frames). The checkout panel shifts to status="error". All EdgeCaseIndicators scale up 1.0 → 1.15 (spring: bouncy, 10 frames) then settle back to 1.04 pulse. At Y: 360: `AnimatedText variant="body" size={36} color="#EF4444" entrance="fade" startFrame={440} springPreset="gentle"` reading "Not in the prompt. Not in the code." with `GlitchBurst startFrame={445} burstInterval={60} burstDuration={8} fontSize={36}` wrapping "Not in the code."

- **Frames 465-510**: Full scene crossfade (20 frames). All elements fade out (opacity → 0). `TimeSkipOverlay startFrame={475} duration={35} label="6 MONTHS LATER"`. The overlay's scan line sweeps. `CountUp from={0} to={6} startFrame={478} duration={25} suffix=" months" fontSize={44} color="#9CA3AF"` in the top-right corner. A horizontal line of small calendar icons (6 icons, 20px, #9CA3AF at 40% opacity) appears center at Y: 900, each fading in staggered by 4 frames starting frame 480.

- **Frames 510-560**: TimeSkipOverlay fades out (15 frames). New scene: the same three original CodeBlockUnits from Hook reappear (auth.js, dashboard.js, api.js) but now visually aged -- borders are #6B7280 (dim gray), code text is #4B5563 (barely readable). Positioned at their original Y: 880 layout. They fade in over 20 frames (spring: gentle, startFrame: 515). A small bug icon (errorRed, 24px, stylized beetle/circle) appears on Panel 2 at its top-right corner (spring: bouncy, startFrame: 530). The icon has a pulsing glow (errorRed at 15% opacity, 20px blur, oscillating).

- **Frames 560-610**: A cursor icon (arrow pointer, #E5E7EB, 28px) appears at x:400 y:920 (spring: snappy, startFrame: 560) and moves toward the bug icon (interpolate x: 400 → 520, y: 920 → 890 over 20 frames). At frame 580, cursor "clicks": Panel 2 border flashes bright #E5E7EB for 3 frames. Then at frame 583: Panel 2's bug disappears BUT three new bug icons (errorRed, 18px each) spawn on Panel 1 (x:200 y:920), Panel 3 (x:820 y:920), and Panel 2 bottom (x:520 y:1060) -- scale 0 → 1.0 (spring: bouncy, staggered 4 frames). `AnimatedText variant="body" size={36} color="#EF4444" entrance="slideUp" startFrame={590} springPreset="snappy"` at Y: 1150 reading "Fix one. Break three."

- **Frames 610-660**: "Fix one. Break three." text holds. All three panels throb: scale oscillates 1.0 → 0.98 → 1.0 (period: 30 frames, `Math.sin(frame * 0.2) * 0.02 + 1.0`). Bug icons pulse in sync. At frame 640, all elements begin fading out (opacity → 0 over 20 frames, spring: gentle). Scene exhales to black.

**BEATS:**
```typescript
const BEATS = {
  PREV_FADEOUT: 300,
  EDGE_CASES_TITLE: 305,
  CHECKOUT_PANEL_IN: 310,
  CODE_LINES_TYPE: 313,
  HAPPY_PATH_LABEL: 335,
  PATH_LINE_DRAW: 335,
  SUCCESS_CIRCLE: 365,
  BRANCH_1_DRAW: 380,
  BRANCH_2_DRAW: 388,
  BRANCH_3_DRAW: 396,
  BADGE_NULL: 395,
  BADGE_TIMEOUT: 403,
  BADGE_EMPTY: 411,
  TITLE_DIM: 430,
  PANEL_TO_ERROR: 430,
  NOT_IN_CODE_TEXT: 440,
  GLITCH_BURST: 445,
  CROSSFADE_OUT: 465,
  TIME_SKIP_IN: 475,
  MONTH_COUNT: 478,
  CALENDAR_ICONS: 480,
  TIME_SKIP_OUT: 510,
  AGED_PANELS_IN: 515,
  BUG_ICON_IN: 530,
  CURSOR_IN: 560,
  CURSOR_CLICK: 580,
  BUGS_SPAWN: 583,
  FIX_BREAK_TEXT: 590,
  PANELS_THROB: 610,
  FADE_TO_BLACK: 640,
  SCENE_END: 660,
};
```

**Components:** AnimatedText, CodeBlockUnit (x4), EdgeCaseIndicator (x3), BoundaryGap, TimeSkipOverlay, CountUp, GlitchBurst, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution -- "The Fix" (22s-30s, frames 660-900)

**Narration:** > "The fix isn't 'stop using AI for code.' The fix is one additional step: understand what the AI built before you ship it. Read the code. Trace the logic. Ask the AI to explain its choices. That's the gap between a prototype and a product."

**Visuals:**

- **Frames 660-695**: Clean dark bg. At Y: 350, center: `AnimatedText variant="title" size={48} color="#10B981" entrance="scale" startFrame={665} springPreset="bouncy"` reading "The Fix". Wrapped in `ShinyText startFrame={670} shineColor="#FFFFFF" duration={40} fontSize={48}`. Below at Y: 430: a thin horizontal rule (solutionGreen #10B981, 2px height, width interpolates 0 → 600px over 20 frames starting frame 675, centered, spring: snappy).

- **Frames 695-740**: The same three CodeBlockUnits from Hook reappear again, this time at Y: 520 (higher, more room below): `label="auth.js" x={90} y={520} width={280} height={180} borderColor="#10B981" startFrame={695} springPreset="snappy" status="ok"`, `label="dashboard.js" x={400} y={520} width={280} height={180} borderColor="#10B981" startFrame={700} springPreset="snappy" status="ok"`, `label="api.js" x={710} y={520} width={280} height={180} borderColor="#10B981" startFrame={705} springPreset="snappy" status="ok"`. All borders solutionGreen now. Staggered entrance 5 frames each.

- **Frames 740-780**: A magnifying glass icon (solutionGreen, 32px, SVG circle + handle) appears above Panel 1 at x:230 y:490 (spring: bouncy, startFrame: 740). It moves horizontally across all three panels: translateX interpolates from x:230 to x:850 over 40 frames (smooth interpolation, clamp). As it passes each panel, that panel's code lines brighten from #9CA3AF to #E5E7EB (stagger: Panel 1 at frame 745, Panel 2 at frame 755, Panel 3 at frame 765, 10 frames each). A subtle solutionGreen scan line (1px, 60% opacity) follows the magnifying glass vertically inside each panel.

- **Frames 780-830**: The boundary areas between panels (previously gaps in Scene 2) now fill with connector lines: solid solutionGreen lines (2px, 80% opacity) draw horizontally between Panel 1→2 and Panel 2→3 (strokeDashoffset animation, 20 frames, starting frame 780 and 790 respectively). At each connection point, a small circle node (8px, solutionGreen fill, scale 0 → 1 spring: bouncy) appears. Below the panels at Y: 730: three labels fade in staggered by 8 frames: `AnimatedText variant="label" size={24} color="#10B981" entrance="fade" startFrame={800} springPreset="gentle"` reading "Read.", then "Trace.", then "Understand." at x:180, x:490, x:790 respectively (startFrames: 800, 808, 816).

- **Frames 830-865**: All three panels glow: a shared solutionGreen radial glow (6% opacity, 500px radius, centered at x:540 y:600) fades in over 15 frames starting frame 830. The magnifying glass icon settles at center (x:540 y:490) and scales 1.0 → 0.8 → 0 (fade out, 15 frames, spring: gentle, starting frame 845). At Y: 760: `AnimatedText variant="body" size={40} color="#F59E0B" entrance="slideUp" startFrame={835} springPreset="gentle"` reading "Prototype to product." with `ShinyText startFrame={840} shineColor="#FFFFFF" duration={30} fontSize={40}`.

- **Frames 865-900**: All elements fade out -- opacity interpolates to 0 over 35 frames (spring: slow). Panels, connectors, labels, glow all exit together. Scene breathes out to clean black for closing transition.

**BEATS:**
```typescript
const BEATS = {
  THE_FIX_TITLE: 665,
  TITLE_SHINE: 670,
  RULE_LINE_DRAW: 675,
  PANEL_1_IN: 695,
  PANEL_2_IN: 700,
  PANEL_3_IN: 705,
  MAGNIFIER_IN: 740,
  MAGNIFIER_SWEEP: 740,
  PANEL_1_BRIGHTEN: 745,
  PANEL_2_BRIGHTEN: 755,
  PANEL_3_BRIGHTEN: 765,
  CONNECTOR_1_DRAW: 780,
  CONNECTOR_2_DRAW: 790,
  NODE_1_IN: 800,
  NODE_2_IN: 800,
  READ_LABEL: 800,
  TRACE_LABEL: 808,
  UNDERSTAND_LABEL: 816,
  SHARED_GLOW_IN: 830,
  PROTOTYPE_TEXT: 835,
  PROTOTYPE_SHINE: 840,
  MAGNIFIER_OUT: 845,
  FADE_TO_BLACK: 865,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, CodeBlockUnit (x3), ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 800, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "AI can write the code."

- **Frames 1000-1050**: Second line enters at Y: 880, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "You still need to understand it."
  Key line -- accent color (insightOrange). Slightly larger (48px) for emphasis.

- **Frames 1040-1070**: Third line enters at Y: 970, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={36} color="#9CA3AF"`:
  "That's the gap between prototype and product."
  Understated -- muted color, smaller size.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 5% opacity, 400px radius, centered at Y: 880. Opacity interpolates from 0% to 5% over 20 frames.

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
