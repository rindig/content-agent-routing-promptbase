# Stage 3: Builds — Composition Development

## What This Folder Is

This is the **build tracking** stage. Metadata files here track which animations are being built and which are done. The actual composition code lives in `../../src/compositions/` — this folder is the status board, not the workshop.

---

## Your Job as a Build Agent

**Input:** A spec from `../02-specs/` — a detailed blueprint with BEATS constants, frame-range blocks, and inline component props.

**Output:** A working Remotion composition in `../../src/compositions/[Format]/[ProjectName]/` that matches the spec.

**Your task is translation, not interpretation.** The spec already made the creative decisions. You turn frame-range blocks into React components and BEATS constants into timing code.

---

## What You Need to Load

Load these **before starting any build**:

| File | Why | Path |
|------|-----|------|
| **The spec** | Your blueprint — scene breakdown, BEATS, visual descriptions | `../02-specs/[format]/[pillar]/[slug]-spec.md` |
| **Component registry** | Available shared components and their props | `../../docs/component-registry.md` |
| **Design system** | Colors, typography, springs, layout constants | `../../docs/design-system.md` |

**Don't load:** Other specs, other compositions (unless reusing a specific pattern), scripts, rendered videos.

For Remotion API patterns (spring, interpolate, Sequence, TransitionSeries), use the `remotion-best-practices` skill — don't rely on examples in this file.

---

## Cross-References to Other Stages

You don't need deep context on other folders, but here's what they do and when you'd look at them:

| Stage | What It Contains | When You'd Reference It |
|-------|-----------------|------------------------|
| `01-scripts/` | Narrative scripts | Almost never — the spec already distilled the content |
| `02-specs/` | Animation blueprints | **Always** — this is your primary input |
| `04-renders/` | Rendered video files | Never — you're upstream of rendering |
| `../../docs/` | Design system + component registry | **Always** — your visual rules and component API |
| `../../src/` | Composition source code | When building — this is where your code goes |

---

## Folder Structure

```
03-builds/
├── CONTEXT.md (you are here)
├── active/                     ← Currently being built
│   └── [slug].md
└── complete/                   ← Built, tested, ready to render
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

## Build File Format

### Active Build — `active/[slug].md`

```markdown
---
project: [Title]
composition: [CompositionName]
spec: ../02-specs/[format]/[pillar]/[slug]-spec.md
status: building
---

## Progress
- [x] Composition folder + constants set up
- [x] Scene 1: Hook
- [ ] Scene 2: Context
- [ ] Scene 3: Core
- [ ] Scene 4: Resolution
- [ ] Scene 5: Closing
- [ ] Full composition test in Remotion Studio

## Notes
- [Any blockers, custom component decisions, deviations from spec]
```

### Complete Build — `complete/[format]/[pillar]/[slug].md`

```markdown
---
project: [Title]
composition: [CompositionName]
spec: ../../02-specs/[format]/[pillar]/[slug]-spec.md
composition-path: ../../src/compositions/[Format]/[ProjectName]/index.tsx
resolution: [1080x1920 | 1920x1080]
fps: 30
duration: [frames] ([seconds]s)
status: ready-to-render
---

## Version History
- v1: Initial build — [date or description]
```

---

## Build Workflow

### 1. Create active build file
Create `active/[slug].md` with the metadata and progress checklist.

### 2. Set up composition folder
```
../../src/compositions/[Format]/[ProjectName]/
├── index.tsx          ← Main composition (assembles scenes via Sequence)
├── scenes/            ← Individual scene components
├── components/        ← Project-specific custom components
└── constants/         ← colors.ts, timing.ts (BEATS from spec go here)
```

### 3. Translate the spec scene-by-scene

For each scene in the spec:

1. **Copy the BEATS constant** from the spec directly into your scene file or `constants/timing.ts`
2. **Read each frame-range block** and translate the visual description to JSX + Remotion springs/interpolations
3. **Use inline component props from the spec** — they're already written for you (e.g., `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" springPreset="bouncy"`)
4. **Import shared components** from `@/components/core/` per the component registry
5. **Build custom components** described in the spec's "Project-Specific Components" section

### 4. Register the composition
Add the composition to `../../src/index.ts` with correct dimensions, fps, and duration from the spec header.

### 5. Test in Remotion Studio
Run `npm run dev`, preview the composition, verify against the spec.

### 6. Move to complete
Move the file from `active/` to `complete/[format]/[pillar]/`, add the composition path, set status to `ready-to-render`.

---

## Build Quality Checklist

A build is complete when:

- [ ] Every scene from the spec is implemented
- [ ] BEATS constants match the spec's frame numbers
- [ ] Component props match the spec's inline descriptions
- [ ] Colors, typography, and springs follow the design system
- [ ] Closing scene follows the standard pattern (BlurText + accent + glow + hold)
- [ ] Composition registered in `src/index.ts`
- [ ] Previewed in Remotion Studio — animations smooth, text readable, timing correct
- [ ] Build file moved to `complete/` with metadata filled

---

## What NOT to Do

- **Don't store code here** — code goes in `../../src/compositions/`
- **Don't render from here** — rendering is stage 4 (`../04-renders/`)
- **Don't build without a spec** — every build maps to a spec in `../02-specs/`
- **Don't reinterpret the script** — the spec already made the creative decisions
- **Don't duplicate Remotion API patterns here** — use the `remotion-best-practices` skill
