# Script Lab

## What This Workspace Is

Where scripts get written, refined, and finalized. Short-form, long-form, and LinkedIn content all start here.

---

## Folder Structure

```
script-lab/
├── CONTEXT.md (you are here)
├── hook-system.md          ← 6 hook types with examples and choosing guide
├── script-templates.md     ← Templates, pre-scripting questions, non-negotiable rules, review checklist
├── short-form/P[1-5]/      ← Short-form scripts by pillar
├── long-form/P[1-5]/       ← Long-form scripts by pillar
└── linkedin/               ← LinkedIn posts
```

---

## What to Load Before Writing

| File | Why |
|------|-----|
| `../brand-vault/CONTEXT.md` | Tells you exactly which brand-vault sections to read for scripting |
| `hook-system.md` | 6 hook types — pick one before you start |
| `script-templates.md` | The template for your format + pre-scripting questions + review checklist |

`script-templates.md` is the canonical reference for script structure and rules. The review checklist there is your final check before marking a script as `final`.

---

## The Process

1. **Load brand context** — follow `../brand-vault/CONTEXT.md`'s "Writing a script" table
2. **Answer the 7 pre-scripting questions** in `script-templates.md`
3. **Pick a hook type** from `hook-system.md`
4. **Write using the template** for your format (short-form, long-form, or LinkedIn)
5. **Review against the checklist** at the bottom of `script-templates.md`

---

## Naming Convention

**Format:** `P[X]-[slug]-[status].md`

**Statuses:** `draft` → `review` → `final`

**Examples:**
- `P1-hello-world-draft.md`
- `P3-prompt-architecture-review.md`
- `P5-ai-replace-programmers-final.md`

Pillar codes: P1 (Layers Beneath), P2 (Right Tool), P3 (Methods Not Tools), P4 (Builder's Architecture), P5 (Honest Take). Full pillar descriptions are in `../brand-vault/content-pillars.md`.

---

## When a Script Is Final

A `final` script is ready for the animation pipeline. Copy it to `../animation-studio/workflows/01-scripts/[format]/P[X]-[pillar-name]/[slug].md` to start production.

---

## What NOT to Do

- **Don't skip the pre-scripting questions** — they prevent unfocused scripts
- **Don't write without loading voice rules** — `../brand-vault/CONTEXT.md` tells you exactly what to read
- **Don't create new hook types** — use the 6 in `hook-system.md`
