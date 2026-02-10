# Animation Studio

## What This Is

The production workspace. Finalized scripts from the content system become animated videos here using Remotion (React-based video rendering).

This is **downstream** from the content system:
```
brand-vault (identity) → script-lab (writing) → animation-studio (production) → platform-playbook (distribution)
```

---

## Where to Go

| You Want To... | Go Here |
|----------------|---------|
| **Generate a spec from a script** | `workflows/01-scripts/CONTEXT.md` → `workflows/02-specs/CONTEXT.md` |
| **Build a composition from a spec** | `workflows/03-builds/CONTEXT.md` |
| **Render a video** | `workflows/04-renders/CONTEXT.md` |
| **Understand the pipeline** | `workflows/CONTEXT.md` |
| **Look up available components** | `docs/component-registry.md` |
| **Look up visual design rules** | `docs/design-system.md` |
| **Learn Remotion API patterns** | Use the `remotion-best-practices` skill |

**Don't read everything.** Identify your task, go to that stage's CONTEXT.md, load only what it tells you to load.

---

## Folder Map

```
animation-studio/
├── CONTEXT.md                  ← You are here. Entry point.
│
├── docs/                       ← Reference docs (load per-task, not all at once)
│   ├── component-registry.md   ← Available components and their props
│   └── design-system.md        ← Colors, typography, springs, layout rules
│
├── workflows/                  ← The 4-stage production pipeline
│   ├── CONTEXT.md              ← Pipeline overview + agent routing
│   ├── 01-scripts/             ← Finalized scripts (input from script-lab)
│   ├── 02-specs/               ← Animation blueprints (BEATS, frame-range blocks)
│   ├── 03-builds/              ← Build tracking (active / complete)
│   └── 04-renders/             ← Rendered video files
│
├── src/                        ← Remotion source code
│   ├── index.ts                ← Composition registration
│   ├── components/core/        ← Shared reusable components
│   └── compositions/           ← Per-video composition code
│       ├── ShortForm/
│       └── LongForm/
│
└── public/                     ← Static assets (images, fonts)
```

---

## Hard Rules

1. **Readability first.** Title 72px+, body 48px+, code 32px+. High contrast on dark backgrounds. 5% safe margins.
2. **Remotion only.** All animations use `spring()` / `interpolate()` via `useCurrentFrame()`. CSS transitions are forbidden.
3. **Check before building.** Always check `docs/component-registry.md` before creating new components. Reusable → `src/components/core/`. Project-specific → `src/compositions/[Project]/components/`.
4. **Specs are code blueprints.** Every spec includes BEATS constants, frame-range micro-blocks, and inline component props. See `workflows/02-specs/CONTEXT.md`.

---

## Formats

| Format | Resolution | Aspect | Platform |
|--------|-----------|--------|----------|
| Short-form | 1080x1920 | 9:16 | TikTok, Reels, Shorts |
| Long-form | 1920x1080 | 16:9 | YouTube |

Both at **30fps**.

---

## When to Use This Workspace

**Use it for:** Generating specs, building compositions, rendering videos — anything in the script-to-video pipeline.

**Don't use it for:** Writing scripts (script-lab), brainstorming topics (topic-engine), brand decisions (brand-vault), distribution strategy (platform-playbook).
