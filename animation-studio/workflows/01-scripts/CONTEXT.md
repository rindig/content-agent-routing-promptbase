# Stage 1: Scripts — Ready for Animation

## What This Folder Is

This is the **input stage** of the animation pipeline. Finalized scripts from `../../../script-lab/` land here when they're ready to be turned into animations.

This folder is **read-only for the pipeline**. Scripts are written and refined in script-lab, then copied here at `final` status. If a script needs changes, edit it in script-lab and re-copy.

---

## How Scripts Get Here

1. Script written in `../../../script-lab/short-form/` as `P1-hello-world-draft.md`
2. Script refined to `P1-hello-world-review.md`
3. Script finalized to `P1-hello-world-final.md`
4. Script copied to `01-scripts/short-form/P1-layers-beneath/hello-world.md`

The script is now **ready for animation**.

---

## What's in These Scripts

Each script file contains:
- **Frontmatter:** Metadata (title, pillar, hook-type, funnel position, implicit offer, status, topic-id)
- **HOOK:** The opening 5-10 seconds
- **BUILD:** The middle section with progressive depth
- **LAND:** The closing reframe (final 5-10 seconds)

Scripts are written for **voiceover**, not silent reading. They're meant to be spoken aloud and paired with animations.

---

## Folder Structure

```
01-scripts/
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

**File naming:** `[descriptive-slug].md` — human-readable, no pillar prefix or topic ID (that's what folders are for).

---

## Your Job as a Spec Generation Agent

**Input:** A script from this folder.
**Output:** A spec in `../02-specs/[format]/[pillar]/[slug]-spec.md`.

### What to Load

| File | Why | Path |
|------|-----|------|
| **The script** | Your narrative source | This folder |
| **Component registry** | Know what visual components exist | `../../docs/component-registry.md` |
| **Design system** | Visual rules, colors, springs, layout | `../../docs/design-system.md` |
| **Spec format guide** | How to write a proper spec | `../02-specs/CONTEXT.md` |

### The Process

1. **Read the script** — understand the hook, build, and land beats
2. **Identify the core metaphor** — what's the central analogy? (This goes in the spec header)
3. **Identify the key visual** — what's the single most memorable visual moment?
4. **Map narrative beats to scenes** — typically Hook (0-3s), Context (3-10s), Core (10-22s), Resolution (22-30s), Closing (30-38s) for short-form
5. **For each scene, ask:**
   - What visual illustrates this concept? (diagram, code, comparison, timeline, mockup?)
   - Which components from the registry fit? What needs to be custom?
   - What's the dominant color/mood? (Maps to the Color Flow table)
6. **Write the spec** following the format in `../02-specs/CONTEXT.md` — frame-range micro-blocks, BEATS constants, inline component props, exact values throughout

The spec format guide in `../02-specs/CONTEXT.md` is the authority on what a good spec looks like. Read it before writing your first spec.

---

## What NOT to Do

- **Don't edit scripts here** — changes happen in script-lab, then re-copy
- **Don't generate specs here** — specs go in `../02-specs/`
- **Don't store incomplete scripts** — only `final` status scripts belong here

---

## Token Management

When generating specs, you need: the script + component registry + design system + spec format guide.

You do NOT need: other scripts, previous specs, composition code, rendered videos.
