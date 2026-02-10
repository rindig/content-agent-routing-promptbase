# What Happens Inside a CPU in One Clock Cycle

---
**Metadata:**
- Pillar: P1 (Layers Beneath)
- Hook Type: Number Anchor (#2)
- Funnel: Top
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~110
- Status: review
- Topic ID: T-08

---

## SCRIPT

**HOOK:**
A modern CPU runs at roughly 4 billion cycles per second. Here's what happens in just one of those cycles.

**BUILD:**
The processor fetches an instruction from memory. It decodes that instruction to figure out what operation to perform. It executes the operation, maybe adding two numbers or comparing two values. And it writes the result back to a register.

Fetch, decode, execute, write. Four stages in one cycle. Four billion times per second.

And modern processors don't wait for one instruction to finish before starting the next. They pipeline them, overlapping stages so multiple instructions are in flight at the same time.

**LAND:**
Every single thing your computer does, from rendering video to running AI models, is built on top of this loop. Fetch, decode, execute, write. Billions of times a second. That's all there is underneath everything.

---

## ANIMATION NOTES
Show a single cycle as four stages in a horizontal pipeline. Instruction enters from the left, passes through each stage (each lights up). Then show pipelining: multiple instructions overlapping, flowing through like cars on a highway. Speed up the animation until it's a blur. Counter in the corner: "Cycles: 4,000,000,000/sec." Final zoom out to show this pipeline as the foundation layer beneath everything.
