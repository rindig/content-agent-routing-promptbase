# Why I Built a Routing Architecture for AI Agents

This is the system I use to run my entire content operation with AI agents scripting, animation specs, topic research, platform optimization, production tracking. Every piece flows through here.

But this isn't a content system. It's a software architecture problem that happens to produce content. And the solution is the same one engineers have been reaching for since the 1970s: **separation of concerns**.

---

## The Problem Nobody Talks About

Most people using AI agents dump everything into one conversation. Brand guidelines, templates, hooks, platform specs, product strategy  all of it. Every time. And then they wonder why the output gets progressively worse, why the agent starts hallucinating rules from three files ago, and why their API bill looks like a phone number.

Here's what's actually happening: you're recreating the monolith problem.

A monolithic application puts everything in one process. Every module can see every other module. It works at small scale. Then the codebase grows, the team grows, and suddenly a change in the payment module breaks the notification system because they shared a data structure nobody remembered existed.

That's exactly what happens when you load 15,000 tokens of context into an agent that needs 4,000 of them. The other 11,000 tokens aren't neutral. They're noise. They dilute the signal. The agent starts blending voice rules with platform specs, confusing animation timing with script structure, pulling from brand strategy docs when it should be writing code.

The context window is not a filing cabinet. It's working memory. And working memory has the same constraint it has in every system that has ever existed: **the more irrelevant information you put in, the worse the processing of relevant information gets.**

---

## The Engineering Principle

The fix is the same fix we've applied to software for decades: **give each process exactly the data it needs, and nothing else.**

In microservices, each service owns its data and exposes a contract. In Unix, each program does one thing and communicates through pipes. In good API design, each endpoint returns the minimum viable response.

This system does the same thing for AI agents. Each agent gets routed to exactly the files — and exactly the *sections* of files — it needs for its specific task. A script-writing agent loads voice rules and hook types. An animation spec agent loads the component registry and design system. A topic research agent loads the content pillars and topic bank.

No agent loads everything. No file contains information that belongs somewhere else.

---

## How It Actually Works

The architecture has three layers. If you've ever worked with a load balancer in front of application servers in front of a database, the mental model is the same.

**Layer 0 — the system prompt.** Always loaded. This is the folder map and ID system. It tells the agent where things are. It's the DNS of the system  it resolves names to locations. About 800 tokens. You pay this cost every conversation, so it has to be lean.

**Layer 1 — the routing table.** A single file at the project root that maps tasks to workspaces. "Writing a script? Go here. Generating a spec? Go there." It's a load balancer. It doesn't do the work. It directs traffic. About 300 tokens.

**Layer 2 — workspace context.** Each folder has a CONTEXT.md that tells the agent what to load and in what order. These are the application servers. They know their domain. They know their dependencies. They don't know about other workspaces except through explicit, one-way references.

The agent reads down the layers and stops as soon as it has what it needs. A rendering agent might stop at Layer 1. A script-writing agent reads down to Layer 2 and follows the cross-references to load specific sections of brand voice files. No agent ever reads the entire system.

---

## The Patterns That Make It Work

### Canonical Sources

Every piece of information lives in exactly one place. Voice rules live in `voice-and-tone.md`. Pillar definitions live in `content-pillars.md`. Animation timing standards live in `design-system.md`. Nowhere else.

Other files that need that information don't copy it. They point to it. A reference, not a duplicate.

This is the single-source-of-truth principle, and violating it is how systems rot. The moment the same rule exists in two files, they will inevitably drift. Someone updates one and forgets the other. Now you have two rules, and the agent has no way to know which is current.

### One-Way Dependencies

The script-lab CONTEXT.md says "read brand-vault for voice guidance." The brand-vault CONTEXT.md does *not* say "script-lab reads us for voice guidance."

This matters because bidirectional references create the same problem as circular dependencies in code. Every new workspace would need to update every workspace that references it. That's O(n²) maintenance. One-way references scale linearly.

If you've ever untangled a circular import in Python or a circular dependency in a build system, you know why this matters. The solution is always the same: establish a clear dependency direction and don't let things point backward.

### Selective Section Loading

This is where it gets interesting. The brand voice file is 174 lines. A script-writing agent needs about 80 of those lines — the actual voice rules. The other 94 lines are strategic rationale explaining *why* those rules exist. That's valuable context for a human doing a brand review. It's dead weight for an agent writing a Tuesday afternoon script.

So the routing table doesn't just say "load this file." It says "load lines 64-143 of this file." The agent gets the rules without the philosophy. The file stays intact as a complete strategic document. Both use cases are served.

This is the same principle behind database views. The underlying data is comprehensive. Different consumers query different projections of that data based on what they actually need.

---

## What I Learned Building This

The first version of this system was one giant document. Everything in one file. It worked for about two weeks, which is roughly how long it takes for the scope of any project to outgrow a single-file architecture.

The second version split things into folders but duplicated information across CONTEXT files. Every workspace described its relationship to every other workspace. When I updated a rule in one place, I had to hunt down four other files that said the same thing. Classic content drift.

The current version follows a principle I learned maintaining cryptographic systems in the Marines: **the system that works is the one where every component has one job, and the interfaces between components are explicit and documented.** In crypto, ambiguity in interfaces gets people killed. In content systems, it just wastes money and produces bad output. But the engineering principle is identical.

The biggest single improvement came from the animation spec format. I was writing specs as prose descriptions — "the text should fade in with a bouncy spring effect." The agent interpreted that differently every time. When I switched to writing specs as code blueprints — with exact frame numbers, TypeScript constants for timing, and inline component props — the output quality jumped immediately. The spec went from something the agent had to interpret into something it could translate. Interpretation introduces variance. Translation preserves intent.

---

## The Numbers

A script-writing task loads about 4,000 tokens of targeted material. Without the routing system, the same task would load 15,000+ tokens — most of it irrelevant to writing a script.

That's not just a cost difference. It's a quality difference. Every token of irrelevant context is a token of diluted attention. The agent writing your script doesn't need to know your posting schedule on LinkedIn. It needs voice rules, a hook type, and a template. Give it exactly that, and the output is measurably better.

---

## If You're Building Something Similar

The principles transfer to any system where AI agents need structured context:

1. **Map your information architecture first.** Before you write a single prompt, figure out what information exists, where it canonically lives, and which tasks need which pieces.

2. **Routing files are not content files.** A CONTEXT.md tells the agent what to load. It doesn't contain the actual knowledge. The moment your routing file starts containing reference material, you've created a maintenance burden.

3. **One-way dependencies only.** Workspace A can reference Workspace B. Workspace B should not reference Workspace A back. If you need bidirectional awareness, you have a design problem — the shared information should probably live in a third location that both reference.

4. **Selective loading is the highest-leverage optimization.** Don't just route to files. Route to sections of files. The difference between loading a full 174-line brand document and loading the 80 lines an agent actually needs compounds across every single conversation.

5. **Write for machines, store for humans.** The brand strategy docs are written for humans — they explain the *why* behind every rule. The routing layer translates those docs into machine-actionable instructions — just the rules, just the constraints, just the patterns. Both versions exist. Neither tries to serve both audiences.

The system in this repo is specific to content production, but the architecture isn't. It's dependency injection for AI agents. If your agents need context, and that context has structure, this pattern works.

---

*Built by [Jake Haas](https://github.com/RinDig) — software engineer, content architect, professional overthinker about abstraction layers.*
