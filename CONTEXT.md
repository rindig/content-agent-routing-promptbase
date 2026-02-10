# Eduba Content System

## What This Is

A siloed workspace system for creating educational content about AI and technology. Each workspace handles one phase of the content lifecycle. An agent drops into a workspace, reads its CONTEXT.md, does its work, and exits.

**CLAUDE.md** (always loaded in system prompt) has the full folder map, ID systems, and file placement rules. This file is routing only.

---

## Cross-Workspace Flow

```
brand-vault (identity)
    ↓ informs
topic-engine (ideas) → script-lab (writing)
    ↓
animation-studio (production: script → spec → build → render)
    ↓
platform-playbook (distribution) → production-rhythm (analytics) → loop back
```

---

## Task Routing

| Your Task | Go Here | You'll Also Need |
|-----------|---------|-----------------|
| **Write a script** | `script-lab/CONTEXT.md` | `brand-vault/CONTEXT.md` for voice loading guidance |
| **Brainstorm topics** | `topic-engine/CONTEXT.md` | `brand-vault/content-pillars.md` for pillar fit |
| **Generate animation spec** | `animation-studio/workflows/01-scripts/CONTEXT.md` | `animation-studio/docs/` for components + design system |
| **Build animation** | `animation-studio/workflows/03-builds/CONTEXT.md` | `animation-studio/docs/` for components + design system |
| **Render video** | `animation-studio/workflows/04-renders/CONTEXT.md` | — |
| **Connect content to products** | `products-and-offers/CONTEXT.md` | — |
| **Optimize for a platform** | `platform-playbook/CONTEXT.md` | — |
| **Plan the week** | `production-rhythm/CONTEXT.md` | — |
| **Understand brand identity** | `brand-vault/CONTEXT.md` | Full read of all brand-vault files |

---

## Workspace Purpose (One Line Each)

| Workspace | Purpose |
|-----------|---------|
| `brand-vault/` | Brand identity, voice rules, content pillars. **READ-ONLY.** |
| `script-lab/` | Write and refine scripts (short-form, long-form, LinkedIn). |
| `topic-engine/` | Brainstorm, track, and prioritize content topics. |
| `products-and-offers/` | Product strategy and monetization tiers. |
| `platform-playbook/` | Distribution strategy per platform. |
| `production-rhythm/` | Weekly workflow and analytics tracking. |
| `animation-studio/` | Script → spec → build → render pipeline. |

Each workspace has its own CONTEXT.md with full details. Read that, not this file, when working in a workspace.
