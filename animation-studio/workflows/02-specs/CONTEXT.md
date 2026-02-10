# Stage 2: Specs — Animation Blueprints

## What This Folder Is

This is the **blueprint stage** of the animation pipeline. Specs here are implementation-ready documents — not prose descriptions, but **code blueprints** detailed enough that a build agent can translate them directly into Remotion compositions without re-interpreting the script.

A spec answers every question the builder will have *before* they have to ask it.

---

## Philosophy: Specs Are Code Blueprints

The difference between a mediocre spec and a great one:

| Mediocre Spec | Great Spec |
|---|---|
| "Text fades in with spring animation" | `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" springPreset="bouncy" startFrame={50}` |
| "Badge slides in from corner" | `rotateZ -30 to 0 degrees (spring: bouncy), then translateX oscillation +/- 3px, 3 cycles, 12 frames` |
| Timing embedded in prose paragraphs | Every scene ends with a `const BEATS = {}` TypeScript object |
| Components listed separately from visuals | Component props written inline with the visual description |
| Colors chosen per-scene from scratch | Theme-level color assignment declared once at the top |
| One animation event per element (enter, done) | **Multi-phase lifecycles** — enter → idle → highlight → dim → exit. Each phase has its own BEATS entry |
| 3-5 BEATS per scene | **12-20+ BEATS per scene** — at least 3-4 animation events per second of screen time |
| Flat layout (text + background) | **Layered composition** — background particles/glow + mid-ground panels/chrome + foreground text/indicators |
| Generic containers ("a panel appears") | **Typed sub-components** with UI chrome — terminal dots, status badges, progress bars, blinking cursors |

**The builder should translate, not interpret.**

---

## How Specs Get Here

Spec generation agents:
1. Read a script from `../01-scripts/[format]/[pillar]/[script-name].md`
2. Reference the component registry (`../../docs/component-registry.md`)
3. Reference the design system (`../../docs/design-system.md`)
4. Write a spec in `02-specs/[format]/[pillar]/[script-name]-spec.md`

---

## File Naming & Folder Structure

**Naming:** `[descriptive-slug]-spec.md` — slug matches the source script with `-spec` appended.

```
02-specs/
├── CONTEXT.md (you are here)
├── short-form/
│   ├── P1-layers-beneath/
│   ├── P2-right-tool/
│   ├── P3-methods-not-tools/
│   ├── P4-builders-architecture/
│   └── P5-honest-take/
└── long-form/
    └── [same pillar structure]
```

---

## Spec File Format

Every spec follows this exact structure. No sections are optional.

### 1. Header — Shared Declarations

Declare everything that applies to the whole spec once at the top. This eliminates per-scene decision-making.

```markdown
# [Title]

## Overview
- **ID**: [Topic ID, e.g. T-01]
- **Slug**: [kebab-case slug]
- **Pillar**: [P1-P5]
- **Format**: [short-form | long-form]
- **Duration**: [Xs / Y frames]
- **Resolution**: [1080x1920 (9:16) | 1920x1080 (16:9)] @ 30fps
- **Source script**: ../01-scripts/[format]/[pillar]/[slug].md
- **Accent colors**: [primary color] (#hex), [secondary] (#hex) [+ others as needed]
- **Core metaphor**: [The central analogy or conceptual anchor — one sentence]
- **Key visual**: [The single most memorable visual moment — one sentence]
```

**Core metaphor** and **Key visual** are critical. They anchor every design decision in the spec. If a visual element doesn't serve the metaphor or build toward the key visual, cut it.

### 2. Color Flow (Short Table)

Map the emotional arc to color dominance across scenes. This gives the spec visual coherence.

```markdown
## Color Flow
| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | errorRed | Anxiety/frustration |
| Context | techBlue | Analytical |
| Core | insightOrange | Discovery |
| Resolution | solutionGreen | Understanding |
| Closing | insightOrange | Takeaway warmth |
```

### 3. Scene Breakdown — Frame-Range Micro-Blocks

This is the heart of the spec. Each scene follows this structure:

```markdown
### Scene N: [Scene Name] (Xs-Ys, frames A-B)

**Narration:** > "Exact voiceover text for this scene."

**Visuals:**
- **Frames A-A+10**: [Enter phase — how elements arrive. Include spring preset,
  stagger timing, initial/final transform values, pixel positions.]
  Example: "Dark bg (#0A0A0F). NotificationCard sub-component slides down from
  Y:-60 to Y:0 (spring: snappy). Card: 900w, codeBg fill, 12px radius, 1px
  panelBorder. Interior: 40px aiPurple circle icon left, BREAKING label (24px,
  errorRed) + body text (36px, textBody) right, 28px errorRed badge circle far right."
- **Frames A+10-A+25**: [Next element enters — staggered by 7-15 frames, never all at once]
- **Frames A+25-A+40**: [Idle/reaction phase — how existing elements respond.
  Example: "NotificationCards dim to opacity 0.2 over 10 frames (interpolate, clamp).
  Border flashes `2px solid rgba(239,68,68,0.4)` for 2 frames at frame A+30."]
- **Frames A+40-B**: [Continue through scene end — every 10-20 frame chunk described]

**BEATS:**
```typescript
const BEATS = {
  ELEMENT_NAME_IN: 0,
  NEXT_ELEMENT: 30,
  TRANSITION_START: 75,
  SCENE_END: 90,
};
```

**Components:** [List components used — from registry or custom (project-specific)]
**Background:** [bg color or variant]
```

#### Rules for Visual Descriptions

1. **Every frame-range block is self-contained** — a builder can read one block and implement it without context from other blocks
2. **Inline component props** — don't say "use AnimatedText," say `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" springPreset="bouncy" startFrame={50}`
3. **Exact values, not ranges** — don't say "large text," say "52px" ; don't say "blue," say "#3B82F6"
4. **Spring presets by name** — `(spring: gentle)`, `(spring: bouncy)`, `(spring: snappy)`, `(spring: slow)`
5. **Pixel positions when layout matters** — "positioned at Y: 384" not "near the top"
6. **Interpolation ranges when transforms matter** — "scale interpolates from 1.3 to 1.0 over 30 frames" not "zooms in"
7. **Stagger timing explicit** — "staggered by 4 frames each" not "staggered"

#### Element Lifecycles

Every significant visual element should have a **multi-phase lifecycle**, not just an entrance. Describe each phase with its own frame range and BEATS entry:

1. **Enter** — how it appears (spring, slide, typewriter, etc.)
2. **Idle/active** — what it does while on screen (pulse, glow, subtle motion)
3. **React** — how it responds to narrative beats (highlight, scale up, color shift)
4. **Exit** — how it leaves or transforms (dim, shrink, shatter, blur out)

A notification card that slides in at frame 0, sits static until frame 80, then fades out is **one animation event**. A notification card that slides in (0-10), flashes its border red (60-61), dims to 20% opacity when "STOP" hits (50-60), and further dims to 10% with scale 0.95 when the next beat enters (75-85) is **four animation events** — this is the target density.

#### Visual Density Targets

Aim for **3-4 named animation events per second** of screen time (90-120 BEATS entries per 30-second scene total across all elements). Each scene should have:

- **12-20+ BEATS entries** depending on scene duration
- **3+ simultaneous visual layers** — background effects (particles, glow, gradients), mid-ground structure (panels, cards, diagrams), foreground content (text, indicators, badges)
- **UI chrome** on panels and containers — terminal dots, status indicators, animated borders, progress markers, blinking cursors. These details sell the visual as "real" rather than a slide deck.
- **At least one data-driven sub-component** per scene — a typed component that renders from an array (list items, diagnostic lines, benchmark bars, notification cards), not hand-coded repetitive JSX

#### The BEATS Constant

Every scene MUST end with a BEATS object. This is the timing skeleton the builder copies directly into code.

Rules:
- Every named animation event gets a frame number
- Names are `SCREAMING_SNAKE_CASE`
- Always include `SCENE_END` as the last entry
- Frame numbers are **local to the scene** (scene starts at 0) or **global to the clip** — pick one convention per spec and declare it in the overview. Global (matching the frame numbers in the visual descriptions) is preferred.

### 4. Custom Components

If the spec requires project-specific components not in the registry, describe them **before the scene breakdown** (so the builder knows what they're working with before they encounter them in scenes).

```markdown
## Project-Specific Components

### DiagnosticPanel
Terminal-style panel that types out status lines with pass/fail indicators.
- Props: `lines: Array<{status: 'PASS'|'FAIL', text: string, startFrame: number, color: string}>`
- **Panel chrome:** 900w, codeBg (#12121A) fill, 12px radius, 1px panelBorder.
  Top row: three 12px circles (red #EF4444, amber #F59E0B, green #10B981) with 8px gap.
- **Each line renders two sub-elements:**
  - StatusIndicator: `[PASS]` or `[FAIL]` in solutionGreen/errorRed with text-shadow
    glow (spring: bouncy, glow peaks at 0.8 then settles to 0.4 opacity)
  - TypewriterLine: characters reveal at 1.5 chars/frame, blinking block cursor
    (opacity toggles via `Math.sin(frame * 0.3) > 0`) until text completes
- **Panel entrance:** opacity 0→1 + scale 0.97→1.0 (spring: gentle) starting at its startFrame
- **Section divider:** horizontal Unicode line (\u2500 × 30) in textDim between groups
```

---

## Standard Clip Arc (Short-Form)

Every short-form clip (35-38 seconds) follows this beat structure. Use these frame budgets as defaults — deviate only with reason.

| Beat | Time | Frames | Purpose | Visual Density |
|------|------|--------|---------|----------------|
| **Hook** | 0-3s | 0-90 | Relatable moment or tension | Medium — fast entrance, screen shake, layered elements |
| **Context** | 3-10s | 90-300 | Setup the framework or parallel | Medium-dense — data-driven lists, animated bars, section transitions |
| **Core** | 10-22s | 300-660 | Main visual sequence — the insight unfolds | Dense — multi-phase lifecycles, layered diagrams, simultaneous animations |
| **Resolution** | 22-30s | 660-900 | The reframe or payoff | Dense → focused — elements exit in stages, conclusion builds |
| **Closing** | 30-38s | 900-1140 | Key takeaway text — hold for 2+ seconds | Focused — BlurText + glow + hold (signature pattern, still polished) |

### Closing Scene Pattern

Every clip ends the same way. This is a signature:
- All elements fade out → clean dark bg → breathing room pause (~20 frames of nothing)
- 1-3 lines of closing text enter via `BlurText` (animateBy="words", direction="bottom", staggerDelay=4, blurAmount=8)
- Key reframe line uses accent color (usually insightOrange #F59E0B)
- Subtle radial glow behind accent text (accent color at 4-5% opacity, ~400px radius)
- Clean hold for 2+ seconds (60+ frames) — no animation, just the text

---

## Reusable Visual Patterns

These are intermediate-complexity patterns that appear across many clips. Reference them by name in specs — the builder should implement them as reusable components.

| Pattern | Description | Use When |
|---------|-------------|----------|
| **SplitScreen** | Vertical top/bottom comparison panels | Before/after, A vs B, demo vs reality |
| **Timeline** | Horizontal flow with era nodes and labels | Historical progression, evolution |
| **CodePanel** | Syntax-highlighted code with line-by-line reveal | Showing code, errors, technical concepts |
| **ZoomSequence** | Camera-style scale through layers | Macro→micro or surface→deep exploration |
| **LayerStack** | Abstraction layers building upward | Architecture, hierarchy, abstraction |
| **ChatWindow** | AI chat interface mockup | AI interaction, chatbot demos |
| **StackedBar** | Horizontal proportional bar chart | Percentage breakdowns, comparisons |
| **AgentPipeline** | Step-by-step flow with status indicators | Process flows, agent workflows |
| **ProductCard** | Card with badge/label (peelable) | Product comparisons, reveals |
| **NotificationStack** | Mobile push notification cards | FOMO, urgency, news anxiety |
| **ClosingStatement** | Final takeaway text card (BlurText + glow) | Every closing scene |
| **WaveformDisplay** | Horizontal bar waveform with playhead | Audio visualization |

When using these in a spec, still provide exact props and frame timing — the pattern name tells the builder *what* to build, the inline description tells them *exactly how*.

---

## Color Reference

Use semantic color names in specs. These map to the design system.

| Name | Hex | Use For |
|------|-----|---------|
| techBlue | #3B82F6 | Code, technical concepts, data |
| aiPurple | #8B5CF6 | AI, models, abstract concepts |
| insightOrange | #F59E0B | Key insights, warnings, "aha" moments |
| solutionGreen | #10B981 | Solutions, fixes, positive outcomes |
| errorRed | #EF4444 | Bugs, errors, failures |
| historyGold | #C9A227 | Historical references, quotes |

| Background | Hex | Use For |
|------------|-----|---------|
| dark (default) | #0A0A0F | Most scenes |
| surface | #12121A | Elevated panels, cards |
| warm | #140E08 | Historical/emotional scenes |
| navy | #0B1120 | Cosmic/deep-tech scenes |

---

## Token Management

When generating specs, load:

| Priority | File | Why |
|----------|------|-----|
| 1 — Always | This file | Spec format rules |
| 2 — Always | The source script | Narrative content |
| 3 — Always | Component registry (`../../docs/component-registry.md`) | Available components and their props |
| 4 — Always | Design system (`../../docs/design-system.md`) | Colors, typography, spring configs, layout constants |
| 5 — First spec only | One reference composition (e.g. `../../src/compositions/EdubaShorts/clips/P3-methods-not-tools/PromptArchitecture/`) | Read 2-3 scenes to calibrate density and sub-component patterns. Skip this on subsequent specs once you've internalized the density target. |

You do NOT need: rendered videos or the Remotion skills (specs are format descriptions, not code).

---

## Spec Quality Checklist

A spec is ready for build when:

- [ ] **Header complete** — all metadata fields filled, including core metaphor and key visual
- [ ] **Color flow table** present — emotional arc mapped to colors
- [ ] **Every scene has BEATS** — TypeScript constant with all animation events mapped to frame numbers
- [ ] **BEATS density** — 12-20+ entries per scene, covering enter/idle/react/exit phases per element. If a scene has fewer than 12 BEATS, it's probably under-specified
- [ ] **Frame-range micro-blocks** — visuals broken into 10-20 frame chunks (not 40+), not paragraph prose
- [ ] **Element lifecycles** — every significant element has at least enter + one reaction phase described, not just an entrance
- [ ] **Inline component props** — exact variant, size, color, entrance, springPreset, startFrame in the visual description
- [ ] **Exact values throughout** — hex colors, pixel sizes, frame counts, spring preset names. No "large," "blue," or "slow"
- [ ] **Sub-components with UI chrome** — panels have terminal dots/borders, lists are data-driven arrays, indicators have glow/pulse
- [ ] **3+ visual layers per scene** — background effects + mid-ground structure + foreground content, not flat layouts
- [ ] **Custom components described before scenes** — builders know what they're working with upfront, including internal animation behavior
- [ ] **Closing scene follows the pattern** — BlurText, accent color on key line, radial glow, 2+ second hold
- [ ] **Standard clip arc respected** — Hook/Context/Core/Resolution/Closing with frame budgets close to defaults
- [ ] **Buildable without interpretation** — a builder can translate each frame-range block to code without guessing

---

## What NOT to Do

- **Don't write prose descriptions** — use frame-range micro-blocks with exact values
- **Don't list components separately from visuals** — inline the props where they're used
- **Don't leave timing vague** — every animation event needs a frame number in BEATS
- **Don't choose colors per-scene** — declare accent colors in the header, use them consistently
- **Don't describe flat layouts** — every scene needs depth (background layer + structure layer + content layer). A single text element on a dark background is a slide, not an animation
- **Don't give elements one-shot lifecycles** — if an element enters and then does nothing until the scene ends, add reaction phases (dim, highlight, scale, exit). Static elements waste screen time
- **Don't use 40+ frame blocks** — keep micro-blocks to 10-20 frames. Coarser blocks hide the detail builders need
- **Don't edit specs after builds start** — regenerate from script and rebuild if changes are needed
- **Don't store code here** — code goes in `../../src/compositions/`. This folder is for blueprints only
