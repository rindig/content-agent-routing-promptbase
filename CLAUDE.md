# Eduba Content System — Quick Reference

**Read this first.** It maps the workspace structure so you know where to go for specific tasks.

For deep context on any workspace, read its `CONTEXT.md`. This file is just the map.

---

## Folder Structure

```
Content Writing/
├── CONTEXT.md                      ← Full system overview (comprehensive)
├── CLAUDE.md                       ← You are here (quick reference)
│
├── brand-vault/                    ← Brand identity, voice, pillars (READ-ONLY)
│   ├── CONTEXT.md
│   ├── who-jake-is.md
│   ├── voice-and-tone.md
│   ├── brand-story.md
│   └── content-pillars.md
│
├── script-lab/                     ← Write scripts here
│   ├── CONTEXT.md
│   ├── hook-system.md
│   ├── script-templates.md
│   ├── short-form/[P1-P5]/
│   ├── long-form/[P1-P5]/
│   └── linkedin/
│
├── topic-engine/                   ← Brainstorm & track topics
│   ├── CONTEXT.md
│   ├── topic-bank.md               ← 50 topics (T-01 to T-50)
│   └── brainstorm.md
│
├── products-and-offers/            ← Product strategy & monetization
│   ├── CONTEXT.md
│   ├── audience-segments.md
│   ├── tier-1-digital/PRODUCTS.md
│   ├── tier-2-courses/PRODUCTS.md
│   └── tier-3-consulting/PRODUCTS.md
│
├── platform-playbook/              ← Distribution strategy
│   ├── CONTEXT.md
│   ├── funnel-architecture.md
│   ├── tiktok-reels.md
│   ├── youtube.md
│   └── linkedin.md
│
├── production-rhythm/              ← Weekly workflow & analytics
│   ├── CONTEXT.md
│   ├── weekly-flow.md
│   └── analytics-tracker.md
│
└── animation-studio/               ← Script → Video production
    ├── CONTEXT.md
    ├── docs/
    │   ├── CONTEXT.md
    │   ├── component-registry.md
    │   └── design-system.md
    ├── workflows/
    │   ├── CONTEXT.md
    │   ├── 01-scripts/[short|long]/[P1-P5]/       ← Scripts land here
    │   ├── 02-specs/[short|long]/[P1-P5]/         ← Specs generated here
    │   ├── 03-builds/[active|complete]/           ← Compositions built here
    │   └── 04-renders/[short|long]/[P1-P5]/       ← Videos rendered here
    ├── src/                        ← Remotion code (components, compositions)
    └── node_modules/               ← Dependencies
```

---

## Quick Navigation

**Want to...?** → **Read this:**

- **Understand the brand/voice** → `brand-vault/CONTEXT.md`
- **Write a script** → `script-lab/CONTEXT.md` + `hook-system.md` + `script-templates.md`
- **Find a topic to write about** → `topic-engine/topic-bank.md`
- **Brainstorm new ideas** → `topic-engine/brainstorm.md`
- **Connect content to products** → `products-and-offers/CONTEXT.md`
- **Optimize for a platform** → `platform-playbook/[platform].md`
- **Plan the week** → `production-rhythm/weekly-flow.md`
- **Generate animation spec** → `animation-studio/workflows/01-scripts/CONTEXT.md`
- **Build animation** → `animation-studio/workflows/02-specs/CONTEXT.md`
- **Render video** → `animation-studio/workflows/03-builds/CONTEXT.md`
- **Review renders** → `animation-studio/workflows/04-renders/CONTEXT.md`

---

## The Workflow

```
brand-vault (identity) → topic-engine (ideas) → script-lab (writing)
    ↓
animation-studio (production: script → spec → build → render)
    ↓
platform-playbook (distribution) → production-rhythm (analytics) → loop back
```

---

## ID Systems

- **Pillars:** `P1` (Layers Beneath), `P2` (Right Tool), `P3` (Methods Not Tools), `P4` (Builder's Architecture), `P5` (Honest Take)
- **Topics:** `T-01` to `T-50` (initial), `T-51+` (new)
- **Hook Types:** `1` (Quiet Reveal), `2` (Number Anchor), `3` (Reframe), `4` (Counter-Position), `5` (Earned Authority), `6` (Question Spiral)
- **Scripts:** `[PILLAR]-[slug]-[status].md` (e.g., `P1-hello-world-final.md`)
- **Renders:** `T-[id]-[slug]-v[version].mov` (e.g., `T-01-hello-world-v1.mov`)

---

## File Placement Rules

### Scripts
- **Draft/Review:** `script-lab/[short|long]/P[X]-[slug]-[draft|review].md`
- **Final:** `script-lab/[short|long]/P[X]-[slug]-final.md`
- **Ready for animation:** Copy to `animation-studio/workflows/01-scripts/[short|long]/P[X]-[pillar-name]/[slug].md`

### Animation Specs
- `animation-studio/workflows/02-specs/[short|long]/P[X]-[pillar-name]/[slug]-spec.md`

### Animation Builds
- **Active:** `animation-studio/workflows/03-builds/active/[slug].md`
- **Complete:** `animation-studio/workflows/03-builds/complete/[short|long]/P[X]-[pillar-name]/[slug].md`

### Rendered Videos
- `animation-studio/workflows/04-renders/[short|long]/P[X]-[pillar-name]/T-[id]-[slug]-v[version].[mov|mp4]`

---

## Token Management

**Each workspace is siloed.** You don't need to load everything.

- Writing a script? → Load `brand-vault/voice-and-tone.md` + `script-lab/hook-system.md` + `script-templates.md`
- Generating a spec? → Load `01-scripts/[file]` + `docs/component-registry.md` + `docs/design-system.md`
- Building animation? → Load `02-specs/[file]` + `docs/component-registry.md` + `docs/design-system.md`
- Rendering? → Just the composition name and render settings

The CONTEXT.md files tell you what to load for each task. Don't load everything at once.

---

## Special Notes

- **brand-vault is READ-ONLY** — Don't edit it per project. It's the DNA.
- **Skills available:** `remotion-best-practices` — But prefer CONTEXT.md files first to save tokens.
- **Animation Studio uses Remotion** — React-based video rendering, frame-driven animations.
- **Design Rules (animation):** Title 72px+, Body 48px+, Code 32px+. Use `spring()` not CSS. Vertical 1080x1920 or Horizontal 1920x1080, 30fps.

---

## When You First Start Working

1. Read this file (you just did)
2. Identify your task (writing? animating? planning?)
3. Navigate to the relevant workspace
4. Read that workspace's `CONTEXT.md`
5. Do the work
6. Reference other workspaces only as needed via cross-references in CONTEXT files

That's it. The system is designed so you don't need all the context, just the right context.
