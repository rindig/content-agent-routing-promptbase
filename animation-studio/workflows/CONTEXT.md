# Workflows — The 4-Stage Pipeline

## What This Folder Is

This is the production pipeline. Four stages, each with its own folder and CONTEXT.md. An agent drops into one stage, reads that stage's CONTEXT.md, does its work, and writes output to the next stage.

```
01-scripts/  →  02-specs/  →  03-builds/  →  04-renders/
  (input)      (blueprint)    (code)         (video)
```

---

## Agent Routing

**Figure out which stage you're in, then go read that CONTEXT.md.** Don't read all four — each stage is siloed by design.

| Your Task | Read This | Your Input | Your Output |
|-----------|-----------|------------|-------------|
| Script → Spec | `01-scripts/CONTEXT.md` + `02-specs/CONTEXT.md` | Script + component registry + design system | Spec file in `02-specs/` |
| Spec → Build | `03-builds/CONTEXT.md` | Spec + component registry + design system | Composition code in `../../src/compositions/` |
| Build → Render | `04-renders/CONTEXT.md` | Composition name + render settings from `03-builds/complete/` | Video file in `04-renders/` |

Every agent also needs `../docs/component-registry.md` and `../docs/design-system.md` (except rendering, which just needs a composition name).

---

## Folder Organization

All stages follow the same structure:

```
[stage]/
├── CONTEXT.md
├── short-form/
│   ├── P1-layers-beneath/
│   ├── P2-right-tool/
│   ├── P3-methods-not-tools/
│   ├── P4-builders-architecture/
│   └── P5-honest-take/
└── long-form/
    └── [same pillar structure]
```

Exception: `03-builds/` uses `active/` and `complete/` instead of format folders at the top level.

---

## File Naming at Each Stage

| Stage | Pattern | Example |
|-------|---------|---------|
| 01-scripts | `[slug].md` | `hello-world.md` |
| 02-specs | `[slug]-spec.md` | `hello-world-spec.md` |
| 03-builds | `[slug].md` | `hello-world.md` |
| 04-renders | `T-[id]-[slug]-v[n].[ext]` | `T-01-hello-world-v1.mov` |

---

## Pipeline Rules

1. **Flow is one-way.** Scripts → specs → builds → renders. Don't reverse-engineer earlier stages from later ones.
2. **Stages are siloed.** Each agent loads only its input + component registry + design system. No cross-loading.
3. **If something changes upstream, re-run forward.** Changed script? Regenerate spec. Changed spec? Rebuild composition. Always propagate forward.
4. **Each stage's CONTEXT.md is the authority** for that stage's format, process, and quality standards. This file is just the routing map.
