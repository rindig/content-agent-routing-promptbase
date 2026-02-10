# Why I Built a Routing Architecture for AI Agents

> **Separation of concerns, applied to AI context windows instead of code modules.**

This is the system I use to run my entire content operation with AI agents. Scripting, animation specs, topic research, platform optimization, production tracking. Every piece flows through here.

But this isn't really a content system. It's a software architecture problem that happens to produce content. And the solution is the same one engineers have been reaching for since the 1970s.

---

## The Problem Nobody Talks About

Most people using AI agents dump everything into one conversation. Brand guidelines, templates, hooks, platform specs, product strategy, all of it, every time. And then they wonder why the output gets progressively worse, why the agent starts hallucinating rules from three files ago, and why their API bill looks like a phone number.

Here's what's actually happening. You're recreating the monolith problem.

| Monolithic App | Monolithic Context |
|---|---|
| Every module sees every other module | Every file loaded into every conversation |
| Works at small scale, breaks at growth | Works for one task, degrades across a session |
| Change in payments breaks notifications | Voice rules bleed into animation timing |
| Fix: microservices with clear contracts | Fix: routing layers with selective loading |

The context window is not a filing cabinet. It's working memory. And when you load 15,000 tokens into an agent that needs 4,000 of them, the extra 11,000 aren't neutral. They're noise. The agent starts blending voice rules with platform specs, confusing animation timing with script structure, pulling from brand strategy docs when it should be writing code.

---

## The Engineering Principle

> **Give each process exactly the data it needs, and nothing else.**

| Paradigm | How It Applies |
|---|---|
| **Microservices** | Each service owns its data, exposes a contract |
| **Unix philosophy** | Each program does one thing, communicates through pipes |
| **Good API design** | Each endpoint returns the minimum viable response |
| **This system** | Each agent loads exactly the files, and the *sections* of files, it needs |

No agent loads everything. No file contains information that belongs in another file.

---

## How It Actually Works

Three layers. If you've worked with a load balancer in front of app servers in front of a database, the mental model is the same.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 0 — System Prompt (CLAUDE.md)                        │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  Always loaded. Folder map + ID systems.                    │
│  The DNS of the system. Resolves names to locations.        │
│  ~800 tokens. Paid every conversation, so it stays lean.    │
└──────────────────────────┬──────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1 — Routing Table (CONTEXT.md)                       │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  │
│  Maps tasks to workspaces. "Writing a script? Go here."     │
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
│  Loaded per the CONTEXT.md routing tables, not all at once. │
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

> Every piece of information lives in exactly one place. Other files point to it, they never copy it.

| Information | Lives In | Referenced By |
|---|---|---|
| Voice rules | `voice-and-tone.md` | script-lab, hook-system |
| Pillar definitions | `content-pillars.md` | script-lab, topic-engine |
| ID systems | `CLAUDE.md` | everywhere (Layer 0) |
| Spec format | `02-specs/CONTEXT.md` | 01-scripts, 03-builds |
| Design rules | `design-system.md` | animation-studio/docs |
| Remotion patterns | Skills system | nowhere in filesystem |

The moment the same rule exists in two files, they will inevitably drift. Someone updates one and forgets the other. Now you have two rules and the agent has no way to know which one is current.

### 2. One-Way Dependencies

```
✅  script-lab/CONTEXT.md  ──→  "read brand-vault for voice"
❌  brand-vault/CONTEXT.md  ──→  "script-lab reads us for voice"
```

Bidirectional references create the same problem as circular dependencies in code. Every new workspace would need to update every workspace that references it. That's **O(n²) maintenance**. One-way references scale linearly. If you've ever untangled a circular import in Python, you already know this.

### 3. Selective Section Loading

This is the highest-leverage pattern in the whole system.

| File | Total Lines | Lines an Agent Needs | What Gets Skipped |
|---|---|---|---|
| `voice-and-tone.md` | 174 | ~80 (voice rules) | Strategic rationale, brand philosophy |
| `who-jake-is.md` | 95 | ~15 (one-liner + surfacing rule) | Full credential backstory |
| `content-pillars.md` | 120 | ~25 (one pillar section) | The other four pillars |

The routing table doesn't say "load this file." It says "load *these sections* of this file." Same principle as database views. The underlying data is comprehensive, but different consumers query different projections of that data based on what they actually need.

---

## What I Learned Building This

<details>
<summary><b>Version 1: The monolith</b></summary>

Everything in one file. It worked for about two weeks. That's roughly how long it takes for the scope of any project to outgrow a single-file architecture.
</details>

<details>
<summary><b>Version 2: The distributed monolith</b></summary>

Split into folders, but duplicated information everywhere. Every workspace described its relationship to every other workspace. Updating a rule in one place meant hunting down four other files that said the same thing. Classic content drift.
</details>

<details>
<summary><b>Version 3: The routing architecture (current)</b></summary>

Follows a principle I learned maintaining cryptographic systems in the Marines: the system that works is the one where every component has one job, and the interfaces between components are explicit and documented. In crypto, ambiguity in interfaces gets people killed. In content systems, it wastes money and produces bad output. The engineering principle is identical regardless.
</details>

### The Biggest Single Improvement

The animation spec format. I was writing specs as prose descriptions:

```
❌  "The text should fade in with a bouncy spring effect"
```

The agent interpreted that differently every time. When I switched to code blueprints:

```typescript
✅  const BEATS = { TITLE_IN: 0, SUBTITLE: 30, SCENE_END: 90 };
    // AnimatedText variant="title" size={52} entrance="scale"
    //   springPreset="bouncy" startFrame={BEATS.TITLE_IN}
```

The output quality jumped immediately. Prose descriptions require interpretation, and interpretation introduces variance every single time. Code blueprints only require translation, and translation preserves intent. That single shift in how we write specs changed everything about the quality of what came out the other end.

---

## The Numbers

| Task | Files Loaded | Tokens | Without Routing |
|---|---|---|---|
| Write a script | voice rules + hooks + template | ~4,000 | ~15,000+ |
| Generate animation spec | script + registry + design system | ~5,000 | ~12,000+ |
| Research topics | pillars + topic bank | ~2,500 | ~15,000+ |
| Plan the week | weekly flow + analytics | ~1,500 | ~15,000+ |
| Render a video | composition name | ~500 | ~15,000+ |

The cost savings are nice, but I think the more interesting thing is what happens to output quality. Every token of irrelevant context is a token of diluted attention. The agent writing your script doesn't need to know your LinkedIn posting schedule. When you give it exactly what it needs and nothing else, the outputs get noticeably better. I don't think most people realize how much of their "AI isn't good enough" frustration is actually a context architecture problem.

---

## If You're Building Something Similar

These principles transfer to any system where AI agents need structured context.

| # | Principle | Why |
|---|---|---|
| 1 | **Map your information architecture first** | Before writing a single prompt, figure out what information exists, where it canonically lives, and which tasks need which pieces |
| 2 | **Routing files ≠ content files** | A CONTEXT.md tells the agent what to load. It doesn't contain the knowledge itself. The moment it starts containing reference material, you've created a maintenance burden |
| 3 | **One-way dependencies only** | A → B is fine. B → A back means you probably need a third location C that both reference |
| 4 | **Route to sections, not just files** | Loading 80 lines instead of 174 compounds across every single conversation you run |
| 5 | **Write for machines, store for humans** | The brand docs explain *why* each rule exists. The routing layer extracts just the *what*. Both versions exist, and neither tries to serve both audiences |

The system in this repo is built for content production specifically, but the architecture underneath it isn't. It's really just dependency injection applied to AI agents. If your agents need context and that context has any structure to it at all, this pattern works.

---

<p align="center">
  <i>Built by <a href="https://github.com/RinDig">Jake van Clief</a> — software engineer, content architect, professional overthinker about abstraction layers.</i>
</p>
