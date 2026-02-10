# The AI Tax

## Overview
- **ID**: T-16
- **Slug**: ai-tax
- **Pillar**: P2 (Right Tool for the Job)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P2-right-tool/ai-tax-review.md
- **Accent colors**: insightOrange (#F59E0B), errorRed (#EF4444), aiPurple (#8B5CF6), solutionGreen (#10B981), techBlue (#3B82F6)
- **Core metaphor**: Automation doesn't eliminate humans — it relocates them to the harder part of the problem, and sometimes that relocation costs more than the original.
- **Key visual**: A clean straight workflow line splits into two paths after "AI" is added — the main automated path and a tangled, branching exception path where the human now sits doing harder work, with a cost bar chart showing the second number higher than the first.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | insightOrange #F59E0B | Warning, hidden cost |
| Context | techBlue #3B82F6 | Analytical, process |
| Core | errorRed #EF4444 → insightOrange #F59E0B | Tension, growing complexity |
| Resolution | insightOrange #F59E0B | Insight, reframe |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### WorkflowLine

A horizontal animated line representing a simple process flow with a human figure icon at the start and a checkmark at the end.

- **Props:** `startFrame: number, y: number, width: number, color: string, label?: string, springPreset: "gentle" | "snappy"`
- Line: 4px stroke, `color`, draws left-to-right using `strokeDashoffset` interpolation over 30 frames
- Human icon: 40px simple stick figure silhouette at left end, `#E5E7EB`, opacity 0→1 (spring: snappy) at `startFrame`
- Checkmark icon: 28px, solutionGreen #10B981, scale 0→1 (spring: bouncy) at end of line draw
- Label (optional): Inter 500, 28px, `#9CA3AF`, centered beneath line, fade in 10 frames after line completes
- Width: 800px, centered horizontally in 1080px frame

### AutomatedWorkflow

A branching workflow diagram showing an AI node splitting the flow into a main automated path (90%) and an exception path (10%).

- **Props:** `startFrame: number, y: number, showExceptionDetail: boolean, springPreset: "snappy" | "gentle"`
- **AI node:** 120px diameter circle, aiPurple #8B5CF6 fill at 20% opacity, 3px aiPurple border, label "AI" in Inter 700 36px #8B5CF6, pulsing glow (`Math.sin(frame * 0.08) * 0.15 + 0.85` opacity)
- **Main path (top):** 4px stroke, solutionGreen #10B981, 60% opacity, straight horizontal line from AI node right. Label "90% automated" in Inter 400 24px solutionGreen, above line. Dashed style (dashArray: "8 6").
- **Exception path (bottom):** 4px stroke, errorRed #EF4444, exits AI node downward-right. Path is jagged/angular with 3 sharp bends (SVG polyline), not smooth — visually messier than the main path. Label "10% exceptions" in Inter 400 24px errorRed, below path.
- **Human on exception path:** 48px stick figure at the end of the exception path, errorRed tint, slightly larger than original human to emphasize they're doing "harder" work. Pulsing stress glow: errorRed at 8% opacity, 60px radius, `Math.sin(frame * 0.12) * 0.3 + 0.7` opacity.
- **Exception detail (when `showExceptionDetail=true`):** Three small label badges stagger in below the exception path human, each 24px Inter 500:
  - "review" (#EF4444), startFrame + 40
  - "correct" (#EF4444), startFrame + 50
  - "override" (#EF4444), startFrame + 60
  Each badge: surface (#12121A) bg, 1px errorRed border, 8px radius, 12px horizontal padding, 6px vertical padding, entrance opacity 0→1 + translateY 10→0 (spring: snappy)

### CostBar

A horizontal proportional bar with a label and animated fill.

- **Props:** `label: string, value: number, maxValue: number, color: string, y: number, startFrame: number, width: number, showValue: boolean, prefix?: string`
- Container: 800px wide, 64px tall, surface (#12121A) fill, 12px radius, 1px panelBorder (#1A1A24)
- Fill: height 100%, width interpolates from 0 to `(value / maxValue) * containerWidth` over 40 frames (spring: snappy) starting at `startFrame`. Color: `color` at 80% opacity, 12px radius on left corners.
- Label: Inter 600, 32px, `#E5E7EB`, positioned 20px from left edge, vertically centered
- Value (when `showValue=true`): Inter 700, 36px, `color`, positioned at right end of filled area + 16px gap. `CountUp from={0} to={value} startFrame={startFrame} duration={40} prefix={prefix}`
- Corner brackets: 14x14px L-shaped borders at top-left and bottom-right corners of container, `color` at 30% opacity

### ExceptionBranch

A single branching path element showing one type of exception work.

- **Props:** `label: string, icon: string, color: string, startFrame: number, y: number`
- 280px wide, 70px tall, surface (#12121A) fill, 1px `color` border at 40% opacity, 12px radius
- Icon: 28px, `color`, left-aligned with 16px padding
- Label: Inter 500, 28px, `#E5E7EB`, right of icon with 12px gap
- Entrance: opacity 0→1 + translateX -20→0 (spring: snappy)

---

## Scene Breakdown

### Scene 1: Hook — "The AI Tax" (0s–3s, frames 0–90)

**Narration:** > "There's a hidden cost in AI adoption that nobody talks about. I call it the AI tax."

**Visuals:**

- **Frames 0–15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #F59E0B at 10% opacity, speed: 0.2). `Vignette` (opacity: 0.5). At center Y: 850, `AnimatedText variant="body" size={44} color="#9CA3AF" entrance="fade" startFrame={0} springPreset="gentle"` reading "There's a hidden cost". Text fades in over 15 frames. Subtle — understated opening.

- **Frames 15–40**: At Y: 850, the "hidden cost" text is fully visible. At Y: 950, `AnimatedText variant="label" size={28} color="#6B7280" entrance="fade" startFrame={20} springPreset="gentle"` reading "in AI adoption that nobody talks about." appears. Both lines sitting quiet — building tension.

- **Frames 40–55**: Both lines begin fading out — opacity interpolates from 1.0 to 0 over 15 frames starting at frame 40. Clean transition.

- **Frames 55–90**: Center screen Y: 880: `GlitchText startFrame={55} intensity={0.8} speed={4} fontSize={72} color="#F59E0B" enableShadows={true}` reading "THE AI TAX". Glitch resolves after 15 frames into solid text. At frame 70, text settles — wrapped in `ShinyText startFrame={70} shineColor="#FFFFFF" duration={30} fontSize={72}`, single shine sweep. Radial glow behind text: insightOrange #F59E0B at 6% opacity, 350px radius, fades in over 10 frames starting at frame 55.

- **Frames 80–90**: "THE AI TAX" dims slightly — opacity 1.0→0.7 over 10 frames. Scale interpolates 1.0→0.85 (spring: gentle). Text begins moving upward — translateY from Y:880 toward Y:250 (continues into Scene 2).

**BEATS:**
```typescript
const BEATS = {
  HIDDEN_COST_IN: 0,
  SUBTITLE_IN: 20,
  TEXT_FADE_OUT: 40,
  GLITCH_START: 55,
  GLITCH_RESOLVE: 70,
  SHINE_SWEEP: 70,
  GLOW_IN: 55,
  TITLE_DIM: 80,
  TITLE_MOVE_UP: 80,
  SCENE_END: 90,
};
```

**Components:** AnimatedText, GlitchText, ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context — "The Simple Workflow" (3s–10s, frames 90–300)

**Narration:** > "It works like this. You automate a process with AI. The AI handles it 90% of the time. Great."

**Visuals:**

- **Frames 90–120**: Dark bg (#0A0A0F). "THE AI TAX" title arrives at Y: 250, opacity 0.7, scale 0.85 — sits as a persistent header. `AmbientBackground` continues (particleCount: 25, color: #3B82F6 at 10% opacity, speed: 0.2). Below the title at Y: 360, a thin horizontal divider line (techBlue #3B82F6, 2px, 400px wide, centered) draws in from center outward over 20 frames starting at frame 95 using `strokeDashoffset` interpolation.

- **Frames 120–160**: "BEFORE AI" label fades in at Y: 440: `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" startFrame={120} springPreset="gentle"`. At Y: 520, `WorkflowLine startFrame={130} y={520} width={800} color="#3B82F6" label="Simple process" springPreset="snappy"`. Human icon appears at left, line draws across, checkmark pops at right. Clean and simple — one person, one line, done.

- **Frames 160–190**: The simple workflow idles. A subtle pulse on the checkmark — scale oscillates `1.0 + Math.sin((frame - 160) * 0.1) * 0.05`. "BEFORE AI" label and workflow sit clean. At frame 170, a small "cost: $X" label fades in below the workflow at Y: 600: `AnimatedText variant="label" size={24} color="#9CA3AF" entrance="fade" startFrame={170} springPreset="gentle"` reading "Straightforward".

- **Frames 190–230**: "AFTER AI" label fades in at Y: 720: `AnimatedText variant="label" size={28} color="#8B5CF6" entrance="fade" startFrame={190} springPreset="gentle"`. The simple workflow above dims — opacity interpolates 1.0→0.4 over 20 frames starting at frame 195. Attention shifts downward.

- **Frames 230–270**: At Y: 800, `AutomatedWorkflow startFrame={230} y={800} showExceptionDetail={false} springPreset="snappy"`. AI node appears first (scale 0→1, spring: bouncy, 15 frames). Then main path draws right (solutionGreen dashed line, 20 frames starting frame 245). "90% automated" label fades in at frame 255.

- **Frames 270–300**: At frame 270, a brief celebration moment — `AnimatedText variant="title" size={48} color="#10B981" entrance="scale" startFrame={270} springPreset="bouncy"` reading "Great." appears at Y: 1050. Scale overshoots to 1.1 then settles to 1.0. Solutiongreen glow pulse behind it (8% opacity, 200px radius) for 15 frames. At frame 290, "Great." begins dimming — opacity 1.0→0.5 over 10 frames. The exception path has NOT appeared yet — false sense of completion.

**BEATS:**
```typescript
const BEATS = {
  TITLE_ARRIVE: 90,
  DIVIDER_DRAW: 95,
  BEFORE_LABEL: 120,
  SIMPLE_WORKFLOW_START: 130,
  WORKFLOW_IDLE: 160,
  STRAIGHTFORWARD_LABEL: 170,
  AFTER_LABEL: 190,
  SIMPLE_DIM: 195,
  AI_NODE_IN: 230,
  MAIN_PATH_DRAW: 245,
  NINETY_LABEL: 255,
  GREAT_IN: 270,
  GREAT_DIM: 290,
  SCENE_END: 300,
};
```

**Components:** AnimatedText, WorkflowLine, AutomatedWorkflow, AmbientBackground
**Background:** dark (#0A0A0F)

---

### Scene 3: Core — "The Exception Path" (10s–22s, frames 300–660)

**Narration:** > "But the 10% it gets wrong now requires a human to review, correct, and override. That human needs to understand both the original process AND how the AI works."
>
> "You haven't eliminated the human. You've made their job harder. Now they're doing exception handling for a system they didn't build, catching errors they can't always predict, in a process that used to be straightforward."
>
> "Sometimes automation makes the whole system more expensive, not less. Not because the AI is bad. But because the problem wasn't shaped right for automation in the first place."

**Visuals:**

- **Frames 300–340**: The AutomatedWorkflow from Scene 2 remains on screen at Y: 800 (main path visible, "Great." dimmed). Now the exception path draws in — errorRed 4px jagged polyline exits the AI node downward-right with 3 sharp angular bends over 30 frames (strokeDashoffset interpolation, starting frame 305). Each bend snaps into place with a micro screen-shake (translateX ±2px for 3 frames at frames 315, 325, 335). "10% exceptions" label fades in at frame 330: Inter 400 24px errorRed.

- **Frames 340–390**: Human figure appears at the end of the exception path (frame 340, scale 0→1, spring: bouncy, 15 frames). Stress glow activates — errorRed at 8% opacity, 60px radius, pulsing. At frame 355, the three exception badges stagger in below the human:
  - `ExceptionBranch label="review" icon="🔍" color="#EF4444" startFrame={355} y={1020}`
  - `ExceptionBranch label="correct" icon="✏️" color="#EF4444" startFrame={365} y={1095}`
  - `ExceptionBranch label="override" icon="⚠️" color="#EF4444" startFrame={375} y={1170}`
  Each enters with opacity 0→1 + translateX -20→0 (spring: snappy).

- **Frames 390–430**: The "BEFORE AI" simple workflow (dimmed to 0.4 opacity) gets a red X overlaid — `GlitchBurst startFrame={390} burstDuration={10} fontSize={48} color="#EF4444"` wrapping "✕" at the checkmark position. Message: the old simplicity is gone. Simultaneously, the exception path's human figure scales up from 1.0→1.15 over 20 frames (spring: gentle) — they're growing more burdened. A connecting dotted line (errorRed, 2px, dashArray "4 4") draws from the AI node upward to the original workflow at frame 400, showing the human must understand BOTH systems (20 frame draw).

- **Frames 430–480**: The three exception badges pulse in sequence — each border brightens from 40% to 80% opacity for 8 frames then returns, staggered by 10 frames (review at 430, correct at 440, override at 450). At frame 460, text appears at Y: 450: `AnimatedText variant="body" size={40} color="#EF4444" entrance="slideUp" startFrame={460} springPreset="snappy"` reading "Their job is harder now." Text has a subtle GlitchBurst overlay (burstInterval: 120, burstDuration: 8, intensity: 0.3).

- **Frames 480–530**: All workflow elements above begin scaling down — scale interpolates 1.0→0.65 over 30 frames (spring: gentle), translateY shifts everything upward by 200px. Making room for the cost comparison below. The "Their job is harder now." text fades out at frame 480 (opacity 1→0, 15 frames).

- **Frames 530–580**: Cost comparison panel enters. At Y: 1000: `CostBar label="Original" value={100} maxValue={180} color="#3B82F6" y={1000} startFrame={530} width={800} showValue={true} prefix="$" `. Blue bar fills to ~56% of container width. The value counts up from 0 to 100. Corner brackets frame the container.

- **Frames 580–640**: At Y: 1090: `CostBar label="AI + Exceptions" value={140} maxValue={180} color="#EF4444" y={1090} startFrame={580} width={800} showValue={true} prefix="$"`. Red bar fills PAST the blue bar — wider, more expensive. The value counts up from 0 to 140. At frame 620, the red bar's value text flashes — scale pulse 1.0→1.15→1.0 over 10 frames (spring: bouncy). A ">" symbol appears between the two values at frame 625: `AnimatedText variant="title" size={48} color="#EF4444" entrance="scale" startFrame={625} springPreset="bouncy"` — the red number is BIGGER.

- **Frames 640–660**: Hold on the cost comparison. The red bar has a persistent pulsing glow — errorRed at 6% opacity, oscillating with `Math.sin((frame - 640) * 0.1) * 0.02 + 0.06`. The scaled-down workflow above sits at 0.65 scale showing the full picture: simple → AI → exception mess → higher cost.

**BEATS:**
```typescript
const BEATS = {
  EXCEPTION_PATH_DRAW: 305,
  BEND_SHAKE_1: 315,
  BEND_SHAKE_2: 325,
  EXCEPTION_LABEL: 330,
  BEND_SHAKE_3: 335,
  EXCEPTION_HUMAN_IN: 340,
  BADGE_REVIEW: 355,
  BADGE_CORRECT: 365,
  BADGE_OVERRIDE: 375,
  OLD_WORKFLOW_X: 390,
  HUMAN_SCALE_UP: 390,
  DUAL_CONNECT_LINE: 400,
  BADGE_PULSE_REVIEW: 430,
  BADGE_PULSE_CORRECT: 440,
  BADGE_PULSE_OVERRIDE: 450,
  HARDER_TEXT_IN: 460,
  HARDER_TEXT_OUT: 480,
  WORKFLOW_SHRINK: 480,
  ORIGINAL_COST_IN: 530,
  AI_COST_IN: 580,
  AI_COST_FLASH: 620,
  GREATER_THAN_IN: 625,
  COST_HOLD: 640,
  SCENE_END: 660,
};
```

**Components:** AutomatedWorkflow, ExceptionBranch (x3), CostBar (x2), AnimatedText, GlitchBurst, CountUp
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution — "Shape the Problem First" (22s–30s, frames 660–900)

**Narration:** > "Before you automate, ask: what happens when it's wrong?"

**Visuals:**

- **Frames 660–700**: The cost comparison and scaled-down workflow from Scene 3 remain visible. All elements begin fading — opacity interpolates from current values to 0.15 over 40 frames starting at frame 660. The scene de-emphasizes the specific example and shifts to the general principle. `AmbientBackground` particle color transitions from techBlue to insightOrange (color interpolation over 30 frames).

- **Frames 700–740**: All previous elements at 0.15 opacity, nearly invisible. Center screen at Y: 750, a clean panel appears — surface (#12121A) fill, 880px wide, 200px tall, 16px radius, 2px insightOrange border at 40% opacity. Entrance: opacity 0→1 + scale 0.95→1.0 (spring: gentle, 20 frames starting frame 700). Corner brackets: 14x14px L-shaped insightOrange borders at all four corners, fade in at frame 710. Terminal dots at top-left interior (three 10px circles: #EF4444, #F59E0B, #10B981, 6px gap, fade in at frame 715).

- **Frames 740–780**: Inside the panel, text types in character-by-character (string slicing at 1.5 chars/frame starting frame 740): `AnimatedText variant="body" size={44} color="#F59E0B" entrance="none"` reading "Before you automate, ask:". Blinking block cursor (insightOrange, 3px wide, 44px tall, opacity toggles via `Math.sin(frame * 0.3) > 0`) trails the text until complete. All background elements (faded workflow, cost bars) finish fading to 0 by frame 750.

- **Frames 780–830**: Second line types in below the first (Y offset +60px): `AnimatedText variant="title" size={52} color="#FFFFFF" entrance="none"` reading "What happens when it's wrong?". Typewriter at 1.5 chars/frame starting frame 780. The "wrong?" portion uses `GlitchBurst startFrame={815} burstDuration={12} fontSize={52} color="#EF4444"` — a flash of error-red chromatic aberration on the key word. Panel border brightens from 40% to 70% opacity at frame 815 for 10 frames, then returns.

- **Frames 830–860**: Typewriter complete. Cursor blinks 3 more times then disappears (opacity → 0 at frame 850). The panel sits clean with both lines visible. A subtle radial glow forms behind the panel — insightOrange at 4% opacity, 500px radius, fades in over 15 frames starting frame 835.

- **Frames 860–900**: Panel and all contents fade out — opacity interpolates 1.0→0 over 40 frames (spring: slow). Clean exit to black.

**BEATS:**
```typescript
const BEATS = {
  ELEMENTS_FADE: 660,
  PARTICLE_COLOR_SHIFT: 660,
  PANEL_IN: 700,
  CORNER_BRACKETS: 710,
  TERMINAL_DOTS: 715,
  LINE_1_TYPE: 740,
  BG_ELEMENTS_GONE: 750,
  LINE_2_TYPE: 780,
  WRONG_GLITCH: 815,
  BORDER_FLASH: 815,
  CURSOR_OFF: 850,
  GLOW_IN: 835,
  PANEL_FADE_OUT: 860,
  SCENE_END: 900,
};
```

**Components:** AnimatedText, GlitchBurst, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s–38s, frames 900–1140)

**Narration:** None — text only.

**Visuals:**

- **Frames 900–940**: Clean dark bg (#0A0A0F). Breathing room — nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920. `AmbientBackground` (particleCount: 15, color: #F59E0B at 8% opacity, speed: 0.15) — barely visible, warm ambient glow.

- **Frames 940–1000**: First line enters at Y: 810, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "Not every problem"

- **Frames 1000–1050**: Second line enters at Y: 890, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "is shaped for automation."
  Key line — accent color (insightOrange), slightly larger than line 1.

- **Frames 1040–1070**: Third line enters at Y: 980, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "Ask what happens when it's wrong."
  Understated — muted color, smaller.

- **Frames 1060–1080**: Subtle radial glow fades in behind the accent-colored second line — insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 890. Opacity interpolates from 0% to 4% over 20 frames.

- **Frames 1080–1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. The message lands.

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

**Components:** BlurText (x3), Vignette, AmbientBackground
**Background:** dark (#0A0A0F)
