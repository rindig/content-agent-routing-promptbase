# System Architecture — How the Agent Routing Works

This document explains why the system is designed this way, how agents navigate it, and how to maintain it.

---

## The Problem This Solves

Every AI agent has a limited context window. Loading your entire content system into one conversation burns tokens on files the agent doesn't need and dilutes the context that matters. The result: worse outputs, higher costs, and agents that lose focus mid-task.

The fix: **give each agent exactly the right context for its job, and nothing else.**

---

## The Three-Layer Architecture

```
┌─────────────────────────────────────────────────┐
│  LAYER 0: CLAUDE.md                             │
│  Always in system prompt. Every conversation.   │
│  Contains: folder map, ID systems, file rules.  │
│  Purpose: orientation. "Where am I?"            │
│  Token cost: ~800 tokens (always loaded)        │
└─────────────────────────┬───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│  LAYER 1: Top-level CONTEXT.md                  │
│  Read on entry to the workspace.                │
│  Contains: task routing table only.             │
│  Purpose: navigation. "Where do I go?"          │
│  Token cost: ~300 tokens (read once)            │
└─────────────────────────┬───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│  LAYER 2: Workspace CONTEXT.md files            │
│  Read per-task, per-workspace.                  │
│  Contains: scope, what-to-load tables, process. │
│  Purpose: instruction. "What do I do?"          │
│  Token cost: ~200-500 tokens each               │
└─────────────────────────┬───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────┐
│  LAYER 3: Content files                         │
│  Loaded selectively per the CONTEXT.md tables.  │
│  Contains: the actual reference material.       │
│  Purpose: knowledge. "What do I need to know?"  │
│  Token cost: varies (500-3000 tokens each)      │
└─────────────────────────────────────────────────┘
```

**An agent reads down the layers, stopping as soon as it has what it needs.** A rendering agent might only need Layers 0-1. A script-writing agent reads down to Layer 3 (voice rules, hook system, templates). No agent reads everything.

---

## How Agents Navigate the System

### Scenario: You ask an agent to write a script

```
1. CLAUDE.md (auto-loaded)
   → Agent sees: "Writing a script? → script-lab/CONTEXT.md"

2. script-lab/CONTEXT.md
   → Agent sees: "Load brand-vault/CONTEXT.md for voice guidance"
   → Agent sees: "Load hook-system.md and script-templates.md"

3. brand-vault/CONTEXT.md
   → Agent sees the "Writing a script" table:
     • voice-and-tone.md → only "Voice Rules" section
     • who-jake-is.md → only "One-Sentence Version" + "Surfacing Rule"
     • content-pillars.md → only the specific pillar section

4. Agent loads ONLY those sections, writes the script.
```

**Total context loaded:** ~4,000 tokens of targeted material.
**Without this system:** Agent would load all brand files (~6,000 tokens of strategy rationale it doesn't need) plus duplicate info from 3-4 CONTEXT files.

### Scenario: You ask an agent to generate an animation spec

```
1. CLAUDE.md (auto-loaded)
   → "Generate animation spec? → animation-studio/workflows/01-scripts/CONTEXT.md"

2. 01-scripts/CONTEXT.md
   → "Load the script, component registry, design system, and 02-specs/CONTEXT.md"

3. 02-specs/CONTEXT.md
   → Agent gets the spec format: BEATS constants, frame-range blocks,
     inline props, standard clip arc, closing pattern, quality checklist

4. Agent reads the script, generates a spec.
```

**No brand-vault loaded.** No voice rules. No pillar descriptions. The spec agent doesn't write words — it designs visuals. Different job, different context.

### Scenario: You use subagents in parallel

```
Main agent → spawns 3 subagents:

  Subagent A: "Write the script"
    → Loads: script-lab + brand-vault sections + hook-system + templates
    → Context: ~4,000 tokens

  Subagent B: "Research the topic"
    → Loads: topic-engine + content-pillars
    → Context: ~2,000 tokens

  Subagent C: "Check platform fit"
    → Loads: platform-playbook/tiktok-reels.md
    → Context: ~1,500 tokens

Each subagent gets exactly what it needs. None waste tokens on the others' context.
```

---

## Key Design Patterns

### 1. One-Way Cross-References

Every workspace points **outward** to what it needs. No workspace points back.

```
script-lab/CONTEXT.md says: "Read brand-vault for voice"
brand-vault/CONTEXT.md does NOT say: "script-lab reads us for voice"
```

Why: If A references B and B references A, you get N-squared redundancy. Every new workspace would add cross-references to every other workspace. One-way pointers scale linearly.

### 2. Selective Section Routing

Brand-vault/CONTEXT.md doesn't just say "read voice-and-tone.md." It says:

> Read the "Voice Rules for Content" section (6 rules) + "What the Voice Is NOT"

This means a 174-line file gets loaded as ~80 lines of actionable rules. The other 94 lines of strategic rationale stay unloaded.

### 3. Canonical Sources

Every piece of information has ONE canonical home:

| Information | Canonical Source | NOT Duplicated In |
|-------------|-----------------|-------------------|
| Voice rules | `voice-and-tone.md` | script-lab, hook-system |
| Pillar definitions | `content-pillars.md` | script-lab, CLAUDE.md |
| ID systems | `CLAUDE.md` | topic-engine, CONTEXT.md |
| Spec format | `02-specs/CONTEXT.md` | 01-scripts, 03-builds |
| Design rules | `design-system.md` | animation-studio/docs, CLAUDE.md |
| Remotion API patterns | `remotion-best-practices` skill | nowhere in the filesystem |

If you need to update a rule, you update it in ONE place. Every other file just points there.

### 4. CONTEXT.md = Routing, Not Content

CONTEXT.md files answer three questions:
1. **What is this folder?** (one sentence)
2. **What do I load?** (table of files + sections)
3. **What's the process?** (numbered steps)

They never contain the actual reference material — that lives in content files. This means CONTEXT files stay small (25-80 lines) and never go stale because they don't duplicate the content they route to.

---

## The Spec Blueprint Philosophy

The animation specs deserve special mention because the format directly impacts output quality.

**Old approach:** Prose descriptions → agent interprets → builds animation
**New approach:** Code blueprints → agent translates → builds animation

The difference:

| Element | Old | New |
|---------|-----|-----|
| Timing | "Text fades in with spring" | `AnimatedText variant="title" size={52} entrance="scale" springPreset="bouncy" startFrame={50}` |
| Structure | Free-form paragraphs | Frame-range micro-blocks (10-40 frames each) |
| Constants | None | `const BEATS = { ELEMENT_IN: 0, NEXT: 30, SCENE_END: 90 }` per scene |
| Colors | Chosen per-scene | Theme-level assignment at spec top |
| Closing | Varies | Standard pattern: BlurText + accent + glow + 2s hold |

The BEATS constant is the single biggest quality driver — it forces the spec author to think through exact timing, which produces better pacing, which produces better animations. And the builder can copy it directly into code.

---

## Maintaining the System

### When to edit a CONTEXT.md
- A new file is added to a workspace → update the file table
- A workflow step changes → update the process
- A cross-reference is added → add a one-way pointer (outward only)

### When NOT to edit a CONTEXT.md
- Don't add strategic rationale or "why" explanations — those belong in content files
- Don't duplicate content from sub-files — point to them
- Don't add bidirectional cross-references — keep them one-way

### Warning signs a CONTEXT.md has grown too large
- Over 80 lines → probably duplicating content
- Contains code examples → those belong in content files or skills
- Contains "Why It Works" sections → that's strategic rationale, not routing
- References the same info that another CONTEXT.md also contains → find the canonical source and point to it

### Adding a new workspace
1. Create `new-workspace/CONTEXT.md` following the pattern: what is it, what to load, process
2. Add one row to `CONTEXT.md` (top-level) task routing table
3. Add one row to `CLAUDE.md` folder structure (if it's a permanent workspace)
4. Add one-way cross-references FROM the new workspace TO existing ones (not the reverse)

---

## Current System Map

```
Content Writing/
│
├── CLAUDE.md ─────────────── Layer 0 (always loaded, ~800 tokens)
├── CONTEXT.md ────────────── Layer 1 (routing table, ~300 tokens)
├── SYSTEM-ARCHITECTURE.md ── This file (human reference, never loaded by agents)
│
├── brand-vault/ ──────────── READ-ONLY brand DNA
│   ├── CONTEXT.md             → Selective section routing tables
│   ├── who-jake-is.md         → Identity + credential surfacing rule
│   ├── voice-and-tone.md      → 6 voice rules + anti-patterns
│   ├── brand-story.md         → Long-game brand narrative
│   └── content-pillars.md     → P1-P5 definitions + example topics
│
├── script-lab/ ───────────── Script writing workspace
│   ├── CONTEXT.md             → Process + what-to-load table
│   ├── hook-system.md         → 6 hook types + choosing guide
│   ├── script-templates.md    → Templates + rules + review checklist
│   ├── short-form/P[1-5]/
│   ├── long-form/P[1-5]/
│   └── linkedin/
│
├── topic-engine/ ─────────── Idea pipeline
│   ├── CONTEXT.md             → Process (check bank → capture → formalize)
│   ├── topic-bank.md          → T-01 to T-50+ with status tracking
│   └── brainstorm.md          → Raw idea capture
│
├── products-and-offers/ ──── Monetization
│   ├── CONTEXT.md             → Tier structure + cross-references
│   ├── audience-segments.md
│   ├── tier-1-digital/
│   ├── tier-2-courses/
│   └── tier-3-consulting/
│
├── platform-playbook/ ────── Distribution
│   ├── CONTEXT.md             → File table + use cases
│   ├── funnel-architecture.md
│   ├── tiktok-reels.md
│   ├── youtube.md
│   └── linkedin.md
│
├── production-rhythm/ ────── Operations
│   ├── CONTEXT.md             → Weekly flow + analytics
│   ├── weekly-flow.md
│   └── analytics-tracker.md
│
└── animation-studio/ ─────── Production pipeline
    ├── CONTEXT.md             → Entry point + routing
    ├── docs/
    │   ├── CONTEXT.md         → Component registry + design system pointers
    │   ├── component-registry.md
    │   └── design-system.md
    ├── workflows/
    │   ├── CONTEXT.md         → 4-stage pipeline routing
    │   ├── 01-scripts/        → Finalized scripts (input)
    │   ├── 02-specs/          → Animation blueprints (BEATS + frame blocks)
    │   ├── 03-builds/         → Build tracking (active/complete)
    │   └── 04-renders/        → Rendered videos (output)
    └── src/                   → Remotion source code
```

---

## Quick Reference: Token Budget by Task

| Task | Files Loaded | Est. Tokens |
|------|-------------|-------------|
| Write a short-form script | script-lab CONTEXT + brand-vault sections + hook-system + template | ~4,000 |
| Brainstorm topics | topic-engine CONTEXT + content-pillars | ~2,500 |
| Generate animation spec | 01-scripts CONTEXT + 02-specs CONTEXT + script + component registry + design system | ~5,000 |
| Build animation | 03-builds CONTEXT + spec + component registry + design system | ~4,500 |
| Render video | 04-renders CONTEXT + composition name | ~500 |
| Plan the week | production-rhythm CONTEXT + weekly-flow | ~1,500 |
| Full brand review | All brand-vault files | ~6,000 |

These are estimates. The point is: no single task requires loading more than ~5,000 tokens of reference material, even though the full system is 15,000+ tokens.
