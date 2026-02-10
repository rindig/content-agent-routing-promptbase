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
- **Frames A-A+20**: [Exact description with pixel positions, colors as hex,
  spring presets by name, component props inline]. Example:
  "Dark bg (#0A0A0F). Three comparison panels slide in from top, staggered
  by 4 frames (spring: snappy). Each panel is a bar chart with model names
  in label text (28px, Inter 500, #9CA3AF)."
- **Frames A+20-A+50**: [Next animation block with same precision]
- **Frames A+50-B**: [Continue through scene end]

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

### SystemDiagram
Three vertically stacked rounded rectangles with proportional heights.
- Props: `segments: Array<{label: string, height: number, color: string, icon?: ReactNode}>`
- Each segment: bgSurface fill, 2px border in segment color, 16px border-radius
- Labels: label variant text (28px) in segment color
- Interior: simplified iconography (table rows for database, pseudo-code for rules, etc.)
```

---

## Standard Clip Arc (Short-Form)

Every short-form clip (35-38 seconds) follows this beat structure. Use these frame budgets as defaults — deviate only with reason.

| Beat | Time | Frames | Purpose | Visual Density |
|------|------|--------|---------|----------------|
| **Hook** | 0-3s | 0-90 | Relatable moment or tension | Sparse → medium |
| **Context** | 3-10s | 90-300 | Setup the framework or parallel | Medium |
| **Core** | 10-22s | 300-660 | Main visual sequence — the insight unfolds | Medium → dense |
| **Resolution** | 22-30s | 660-900 | The reframe or payoff | Dense → sparse |
| **Closing** | 30-38s | 900-1140 | Key takeaway text — hold for 2+ seconds | Sparse (text only) |

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

When generating specs, load only:
- **This file** (spec format rules)
- **The source script** (narrative content)
- **Component registry** (`../../docs/component-registry.md`)
- **Design system** (`../../docs/design-system.md`)

You do NOT need: other specs, composition code, rendered videos, or the Remotion skills (specs are format descriptions, not code).

---

## Spec Quality Checklist

A spec is ready for build when:

- [ ] **Header complete** — all metadata fields filled, including core metaphor and key visual
- [ ] **Color flow table** present — emotional arc mapped to colors
- [ ] **Every scene has BEATS** — TypeScript constant with all animation events mapped to frame numbers
- [ ] **Frame-range micro-blocks** — visuals broken into 10-40 frame chunks, not paragraph prose
- [ ] **Inline component props** — exact variant, size, color, entrance, springPreset, startFrame in the visual description
- [ ] **Exact values throughout** — hex colors, pixel sizes, frame counts, spring preset names. No "large," "blue," or "slow"
- [ ] **Custom components described before scenes** — builders know what they're working with upfront
- [ ] **Closing scene follows the pattern** — BlurText, accent color on key line, radial glow, 2+ second hold
- [ ] **Standard clip arc respected** — Hook/Context/Core/Resolution/Closing with frame budgets close to defaults
- [ ] **Buildable without interpretation** — a builder can translate each frame-range block to code without guessing

---

## What NOT to Do

- **Don't write prose descriptions** — use frame-range micro-blocks with exact values
- **Don't list components separately from visuals** — inline the props where they're used
- **Don't leave timing vague** — every animation event needs a frame number in BEATS
- **Don't choose colors per-scene** — declare accent colors in the header, use them consistently
- **Don't edit specs after builds start** — regenerate from script and rebuild if changes are needed
- **Don't store code here** — code goes in `../../src/compositions/`. This folder is for blueprints only
