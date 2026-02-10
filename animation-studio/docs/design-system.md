# Design System

> **Core Principle**: Every animation should be both **entertaining** AND help the viewer **understand the concept**.

---

## Formats

| Format | Resolution | Aspect | Use |
|--------|-----------|--------|-----|
| **Short-form** | 1080x1920 | 9:16 | TikTok, Reels, Shorts |
| **Long-form** | 1920x1080 | 16:9 | YouTube |

Both run at **30fps**. All specs and compositions must declare which format they target.

---

## Typography

### Size Minimums by Format

| Element | Long (1920x1080) | Short (1080x1920) | Notes |
|---------|-------------------|---------------------|-------|
| **Hero/Title** | 72–108px | 64–96px | Main scene titles |
| **Section Header** | 56–72px | 48–64px | Scene sections |
| **Body Text** | 48–56px | 40–52px | Must read at playback speed |
| **Subtext/Captions** | 36–44px | 32–40px | Supporting text |
| **Code Text** | 32–40px | 28–36px | Monospace only |
| **Labels** | 28–32px | 24–28px | Annotations |
| **Badges/Tags** | 18–24px | 16–20px | Type badges, timestamps |

- **Fill the frame** — if there's empty space, increase element sizes
- **Mobile-first for shorts** — assume 100% watch on phones
- **Long-form mobile** — assume 50% watch on phones, text must read at 480p

### Font Stack

```typescript
const TYPOGRAPHY = {
  code: { fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace' },
  display: { fontFamily: 'Inter, -apple-system, system-ui, sans-serif' },
  body: { fontFamily: 'Inter, -apple-system, system-ui, sans-serif' },
  quote: { fontFamily: 'Playfair Display, Georgia, serif' },
};
```

Use `@remotion/google-fonts` for loading. Call `loadFont()` at module level, specify only needed weights/subsets.

---

## Colors & Contrast

### Base Palette

```typescript
const COLORS = {
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceAlt: '#1A1A24',

  text: '#E5E7EB',          // Primary — high contrast
  textBright: '#FFFFFF',     // Maximum contrast
  textMuted: '#9CA3AF',      // Secondary info only
  textDim: '#6B7280',        // Badges/timestamps only

  primary: '#3B82F6',        // Blue — links, emphasis
  accent: '#10B981',         // Green — success, code
  warning: '#F59E0B',        // Amber — caution
  danger: '#EF4444',         // Red — errors
};
```

### Contrast Rules

- Dark backgrounds (#0A–#1A) → text minimum `#D1D5DB`, recommended `#E5E7EB+`
- **Never** use gray (#6B7280 or darker) as primary text on dark backgrounds
- **Never** use low-opacity text for important information

### Color Psychology

| Color | Use For |
|-------|---------|
| `#3B82F6` (blue) | Code, technical concepts |
| `#8B5CF6` (purple) | AI, abstract concepts |
| `#F59E0B` (orange) | Key insights, warnings |
| `#10B981` (green) | Solutions, positive outcomes |
| `#EF4444` (red) | Bugs, security, errors |
| `#C9A227` (gold) | Historical references, quotes |

### Project-Specific Palettes

Projects can override but must maintain high contrast and clear hierarchy.

```typescript
const WARM_PALETTE = { background: '#1A1814', accent: '#D97706', text: '#FEF3C7' };
const COSMIC_PALETTE = { background: '#0F0A1A', primary: '#8B5CF6', accent: '#EC4899' };
```

---

## Layout & Spacing

### Safe Margins by Format

| | Long (1920x1080) | Short (1080x1920) |
|---|---|---|
| **Minimum margin** | 5% (96px horiz, 54px vert) | 5% (54px horiz, 96px vert) |
| **Recommended margin** | 8% (154px horiz, 86px vert) | 8% (86px horiz, 154px vert) |
| **Platform safe zone** | N/A | Top 15% and bottom 20% — avoid text/CTAs (UI overlays) |

**Shorts-specific:** TikTok/Reels/Shorts overlay usernames, like buttons, captions, and descriptions on the bottom ~20% and top ~15% of the screen. Keep critical content in the center 65%.

### Visual Hierarchy

- **One focal point** per scene at any given moment
- Dim/blur non-active elements
- Use glow/highlight to draw attention
- Avoid distracting motion in periphery
- Don't leave large empty areas — fill the space or increase element sizes

---

## Animation — Remotion Rules

### Fundamentals

1. **All animations MUST use `useCurrentFrame()` + `interpolate()` or `spring()`** — CSS transitions and Tailwind animation classes are FORBIDDEN (they don't render correctly)
2. Write timing in seconds, multiply by `fps` from `useVideoConfig()`
3. Always clamp interpolations: `{ extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }`

### Spring Configurations

```typescript
const SPRING_CONFIGS = {
  smooth: { damping: 200 },                          // No bounce — subtle reveals
  snappy: { damping: 20, stiffness: 200 },            // Quick, minimal bounce — UI elements
  bouncy: { damping: 8 },                             // Playful entrances
  heavy: { damping: 15, stiffness: 80, mass: 2 },     // Dramatic, slow
};
```

Usage: `spring({ frame, fps, config: SPRING_CONFIGS.smooth })`

Use `delay` param to offset: `spring({ frame, fps, delay: 20 })`

Use `durationInFrames` to force specific duration: `spring({ frame, fps, durationInFrames: 40 })`

Combine with interpolate to map 0→1 to custom ranges:
```typescript
const s = spring({ frame, fps });
const rotation = interpolate(s, [0, 1], [0, 360]);
```

### Sequencing

- Use `<Sequence from={...} durationInFrames={...}>` to delay elements
- **Always set `premountFor={1 * fps}`** on every Sequence
- Use `layout="none"` when items shouldn't be wrapped in absolute fill
- Use `<Series>` for back-to-back scenes without overlap
- Inside a Sequence, `useCurrentFrame()` returns local frame (starts at 0)

### Transitions (between scenes)

Use `<TransitionSeries>` from `@remotion/transitions`:

```typescript
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><SceneA /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
  <TransitionSeries.Sequence durationInFrames={60}><SceneB /></TransitionSeries.Sequence>
</TransitionSeries>
```

Available: `fade`, `slide` (with direction), `wipe`, `flip`, `clockWipe`. Transitions **shorten** total duration (scenes overlap).

### Timing Reference (at 30fps)

| Timing | Frames | Duration |
|--------|--------|----------|
| Quick fade | 15 | 0.5s |
| Normal fade | 30 | 1s |
| Slow fade | 60 | 2s |
| Stagger delay | 3–5 | Between list items |
| Scene buffer | 30 | Between sections |

---

## Effect Categories

### Ambient (Background/Mood)

| Effect | Use When |
|--------|----------|
| `AmbientBackground` (particles) | Code/tech discussions |
| `Vignette` | Almost always — draws eyes to center |
| `ShiftingGradient` | Topic transitions, section intros |
| Aurora (react-bits) | AI/ML topics, "wow" moments |

Backgrounds must be **subtle** — never compete with content. Match particle color to topic.

### Text Effects (Emphasis/Reveal)

| Effect | Use When |
|--------|----------|
| `AnimatedLine` (word-by-word) | Voiceover sync, key statements |
| `TypedText` | Commands, technical terms (use string slicing, not per-char opacity) |
| `GlitchText` | Bugs, security, system failures |
| `ShinyText` | Key terms, first introduction |
| `GradientText` | Titles, section headers |
| `BlurText` | Dramatic reveals |

Emphasize **1–3 key terms per sentence max**. If everything is special, nothing is.

### Data Effects

| Effect | Use When |
|--------|----------|
| `CountUp` | Stats, measurements, comparisons |
| `StatGrid` | Multiple related numbers |

Reserve CountUp for impressive stats. Pause after big numbers land.

### Transitions (Scene Changes)

| Pattern | Use When |
|---------|----------|
| Fade to black | Major topic shifts |
| Crossfade | Related concept transitions |
| `FocusBlur` | Moving attention to new element |
| PixelTransition | Tech topic transitions |

Most transitions should be cuts or fades. Save fancy ones for section boundaries.

### Diagrams

Build diagrams **piece by piece** with narration — never show all at once.

---

## Visual Density

| Density | When |
|---------|------|
| Sparse (1–2 elements) | Opening statements, powerful quotes |
| Medium (3–4 elements) | Most explanations, labeled diagrams |
| Dense (5+ elements) | Timelines, system diagrams, recaps |

**Rule**: Complex ideas = simpler visuals. Simple ideas can have richer visuals.

---

## System Panel Design Language

Our signature aesthetic for technical content.

| Element | Purpose | Sizing |
|---------|---------|--------|
| **Corner Brackets** | Frame content, tech aesthetic | 14x14px, L-shaped borders |
| **Scan Lines** | "Processing" feel | Animated gradient line |
| **Type Badges** | Categorize: AI/CODE/DATA | Colored label, top-right, 12px |
| **Pulsing Glow** | "Alive" feel | `Math.sin(frame * 0.08) * 0.15 + 0.85` |
| **Gradient Arrows** | Show flow between elements | — |

Panel sizing: title 28px+, description 18px, padding 32px 48px, border 3px, radius 16px.

- **Full treatment** (brackets + badge + scan line): Key concept boxes, data flows
- **Minimal** (brackets + badge): Timeline eras
- **Skip**: Captions, labels, background elements

---

## Quick Decision Tree

```
KEY TERM introduced first time?   → ShinyText or emphasis color + weight
Showing GROWTH or SCALE?          → CountUp animation
DRAMATIC moment or REVEAL?        → BlurText entrance, slow spring
ERROR or PROBLEM?                 → GlitchText, red emphasis
HIERARCHY or LAYERS?              → Build diagram piece by piece
TRANSITION between topics?        → Fade to black or crossfade
BACKGROUND while talking?         → Subtle particles, vignette
```

---

## Anti-Patterns

1. **Motion sickness** — too many things moving at once
2. **Christmas tree** — too many colors competing
3. **Effect soup** — effects because you can, not because they help
4. **Dead air** — static screens with voiceover (always have SOMETHING moving)
5. **Distraction** — effect draws attention away from the key point
6. **CSS animations** — using CSS transitions/Tailwind animate instead of Remotion spring/interpolate

---

## Scene Checklist

- [ ] All text meets minimum size requirements **for the target format**
- [ ] Primary text uses high-contrast colors (#E5E7EB+)
- [ ] Safe margins respected (5%+ all edges, platform safe zones for shorts)
- [ ] No critical content in shorts top 15% or bottom 20%
- [ ] No large empty unused areas
- [ ] One clear focal point at a time
- [ ] All animations use `spring()` / `interpolate()`, not CSS
- [ ] All `<Sequence>` elements have `premountFor` set
- [ ] No distracting peripheral motion during important content
