# Why I Built a Routing Architecture for AI Agents

> **Separation of concerns — applied to AI context windows instead of code modules.**

This is the system I use to run my entire content operation with AI agents — scripting, animation specs, topic research, platform optimization, production tracking. Every piece flows through here.

But this isn't a content system. It's a software architecture problem that happens to produce content. And the solution is the same one engineers have been reaching for since the 1970s.

---

## The Problem Nobody Talks About

Most people using AI agents dump everything into one conversation. Brand guidelines, templates, hooks, platform specs, product strategy — all of it. Every time.

Here's what's actually happening: **you're recreating the monolith problem.**

| Monolithic App | Monolithic Context |
|---|---|
| Every module sees every other module | Every file loaded into every conversation |
| Works at small scale, breaks at growth | Works for one task, degrades across a session |
| Change in payments breaks notifications | Voice rules bleed into animation timing |
| Fix: microservices with clear contracts | Fix: routing layers with selective loading |

The context window is not a filing cabinet. It's working memory. Load 15,000 tokens when the agent needs 4,000, and those extra 11,000 tokens aren't neutral — they're noise that dilutes the signal.

---

## The Engineering Principle

> **Give each process exactly the data it needs, and nothing else.**

| Paradigm | How It Applies |
|---|---|
| **Microservices** | Each service owns its data, exposes a contract |
| **Unix philosophy** | Each program does one thing, communicates through pipes |
| **Good API design** | Each endpoint returns the minimum viable response |
| **This system** | Each agent loads exactly the files — and *sections* of files — it needs |

No agent loads everything. No file contains information that belongs somewhere else.

---

## How It Actually Works

Three layers. If you've worked with a load balancer → app servers → database, the mental model is the same.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 0 — System Prompt (CLAUDE.md)                        │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  Always loaded. Folder map + ID systems.                    │
│  The DNS of the system — resolves names to locations.       │
│  ~800 tokens. Paid every conversation, so it stays lean.    │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — Routing Table (CONTEXT.md)                       │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  Maps tasks → workspaces. "Writing a script? Go here."      │
│  A load balancer. Directs traffic, doesn't do work.         │
│  ~300 tokens. Read once per session.                        │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2 — Workspace Context (per-folder CONTEXT.md)        │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  What to load, in what order, for what task.                │
│  The app servers. Each knows its domain + dependencies.     │
│  ~200-500 tokens each. Agent stops here if it has enough.   │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — Content Files (loaded selectively)               │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  The actual reference material.                             │
│  Loaded per the CONTEXT.md routing tables — not all at once.│
│  ~500-3000 tokens each. Only what the task requires.        │
└─────────────────────────────────────────────────────────────┘
```

**The agent reads down and stops as soon as it has what it needs.** A rendering agent might stop at Layer 1. A script-writing agent follows cross-references down to Layer 3 for specific voice rules. No agent ever reads the entire system.

---

## The Workspace Map

```
Content Writing/
│
├── CLAUDE.md ─────────────── Layer 0 (always loaded)
├── CONTEXT.md ────────────── Layer 1 (task → workspace routing)
├── README.md ─────────────── You are here
├── SYSTEM-ARCHITECTURE.md ── Technical reference
│
├── brand-vault/ ──────────── READ-ONLY brand DNA
├── script-lab/ ───────────── Script writing (hooks, templates, review)
├── topic-engine/ ─────────── Idea pipeline (50+ tracked topics)
├── products-and-offers/ ──── Monetization tiers
├── platform-playbook/ ────── Distribution strategy per platform
├── production-rhythm/ ────── Weekly workflow + analytics
└── animation-studio/ ─────── Remotion video production pipeline
    ├── docs/                  Component registry + design system
    ├── workflows/             4-stage: script → spec → build → render
    └── src/                   React/Remotion source code
```

---

## The Patterns That Make It Work

### 1. Canonical Sources

> Every piece of information lives in exactly one place. Other files point to it — never copy it.

| Information | Lives In | Referenced By |
|---|---|---|
| Voice rules | `voice-and-tone.md` | script-lab, hook-system |
| Pillar definitions | `content-pillars.md` | script-lab, topic-engine |
| ID systems | `CLAUDE.md` | everywhere (Layer 0) |
| Spec format | `02-specs/CONTEXT.md` | 01-scripts, 03-builds |
| Design rules | `design-system.md` | animation-studio/docs |
| Remotion patterns | Skills system | nowhere in filesystem |

The moment the same rule exists in two files, they will inevitably drift. One-source, many-references.

### 2. One-Way Dependencies

```
✅  script-lab/CONTEXT.md  ──→  "read brand-vault for voice"
❌  brand-vault/CONTEXT.md  ──→  "script-lab reads us for voice"
```

Bidirectional references = circular dependencies. Every new workspace would update every workspace that references it. That's **O(n²) maintenance**. One-way references scale linearly.

### 3. Selective Section Loading

This is the highest-leverage pattern in the system.

| File | Total Lines | Lines an Agent Needs | What Gets Skipped |
|---|---|---|---|
| `voice-and-tone.md` | 174 | ~80 (voice rules) | Strategic rationale, brand philosophy |
| `who-jake-is.md` | 95 | ~15 (one-liner + surfacing rule) | Full credential backstory |
| `content-pillars.md` | 120 | ~25 (one pillar section) | The other four pillars |

The routing table doesn't say "load this file." It says "load *these sections* of this file." Same principle as database views — comprehensive data underneath, projected queries on top.

---

## What I Learned Building This

<details>
<summary><b>Version 1: The monolith</b> — everything in one file</summary>

Worked for about two weeks. That's roughly how long it takes for any project to outgrow a single-file architecture.
</details>

<details>
<summary><b>Version 2: The distributed monolith</b> — split into folders, duplicated everywhere</summary>

Every workspace described its relationship to every other workspace. Updating a rule in one place meant hunting down four other files that said the same thing. Classic content drift.
</details>

<details>
<summary><b>Version 3: The routing architecture</b> — current system</summary>

Follows a principle I learned maintaining cryptographic systems in the Marines: **the system that works is the one where every component has one job, and the interfaces between components are explicit and documented.** In crypto, ambiguity in interfaces gets people killed. In content systems, it wastes money and produces bad output. The engineering principle is identical.
</details>

### The Biggest Single Improvement

The animation spec format. I was writing specs as prose:

```
❌  "The text should fade in with a bouncy spring effect"
```

The agent interpreted that differently every time. When I switched to code blueprints:

```typescript
✅  const BEATS = { TITLE_IN: 0, SUBTITLE: 30, SCENE_END: 90 };
    // AnimatedText variant="title" size={52} entrance="scale"
    //   springPreset="bouncy" startFrame={BEATS.TITLE_IN}
```

Output quality jumped immediately. **Interpretation introduces variance. Translation preserves intent.**

---

## The Numbers

| Task | Files Loaded | Tokens | Without Routing |
|---|---|---|---|
| Write a script | voice rules + hooks + template | ~4,000 | ~15,000+ |
| Generate animation spec | script + registry + design system | ~5,000 | ~12,000+ |
| Research topics | pillars + topic bank | ~2,500 | ~15,000+ |
| Plan the week | weekly flow + analytics | ~1,500 | ~15,000+ |
| Render a video | composition name | ~500 | ~15,000+ |

That's not just a cost difference. It's a quality difference. Every token of irrelevant context is a token of diluted attention. The agent writing your script doesn't need to know your LinkedIn posting schedule. Give it exactly what it needs, and the output is measurably better.

---

## If You're Building Something Similar

The principles transfer to any system where AI agents need structured context.

| # | Principle | Why |
|---|---|---|
| 1 | **Map your information architecture first** | Before writing a single prompt, figure out what exists, where it canonically lives, and which tasks need which pieces |
| 2 | **Routing files ≠ content files** | A CONTEXT.md tells the agent what to load. It doesn't contain the knowledge itself. The moment it does, you've created a maintenance burden |
| 3 | **One-way dependencies only** | A → B is fine. B → A back is a design problem. If both need shared info, put it in C |
| 4 | **Route to sections, not files** | Loading 80 lines instead of 174 compounds across every conversation |
| 5 | **Write for machines, store for humans** | Brand docs explain *why*. Routing layers extract *what*. Both exist. Neither serves both audiences |

The system in this repo is specific to content production, but the architecture isn't. It's dependency injection for AI agents. If your agents need context, and that context has structure, this pattern works.

---

<p align="center">
  <i>Built by <a href="https://github.com/RinDig">Jake Haas</a> — software engineer, content architect, professional overthinker about abstraction layers.</i>
</p>
