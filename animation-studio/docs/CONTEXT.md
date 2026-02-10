# Docs — Component Registry & Design System

## What This Folder Is

The reference library for building animations. Two files that every spec-generation and build agent needs.

---

## Files

| File | What It Contains | When to Load |
|------|-----------------|-------------|
| `component-registry.md` | All available components (core + effects), their props, and usage examples | Always — before writing specs or building compositions |
| `design-system.md` | Colors, typography, springs, layout, effect categories, anti-patterns | Always — the visual rules for everything |

---

## How to Use These Docs

**Spec agents:** Reference both files to know what components exist and what visual rules to follow. The spec you write should use component names and props from the registry, and colors/springs/typography from the design system.

**Build agents:** Reference both files to know how to import and configure components. The design system's spring configs and color palette are your constants. For Remotion API patterns (spring, interpolate, Sequence), use the `remotion-best-practices` skill instead of these docs.

---

## Pre-Animation Checklist

Before writing any spec or building any composition:
- [ ] Read `component-registry.md` — know what exists before proposing custom components
- [ ] Read `design-system.md` — know the color palette, typography scale, and spring configs
- [ ] Check for existing project-specific components in `../src/compositions/` that might be reusable
