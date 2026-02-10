# What JavaScript Actually Does in Your Browser

---
**Metadata:**
- Pillar: P1 (Layers Beneath)
- Hook Type: Quiet Reveal (#1)
- Funnel: Top
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~115
- Status: review
- Topic ID: T-55
- **NEW SCRIPT** - Following viral pattern

---

## SCRIPT

**HOOK (0-5s):**
When a website runs JavaScript, you probably think the code just executes. It doesn't. Not directly.

**BUILD (5-30s):**
Here's what actually happens. Your browser reads the JavaScript source code and parses it into an abstract syntax tree. That tree gets compiled into bytecode. The bytecode feeds into a JIT compiler, which translates hot paths into optimized machine code on the fly.

All of this while you're scrolling. The browser is compiling, optimizing, garbage collecting, managing memory, and executing millions of operations per second to make the page feel responsive.

If the code tries to do something slow, like a big loop, the browser might pause rendering, drop frames, or even ask if you want to kill the script.

**LAND (30-35s):**
You see a smooth webpage. Underneath, a JavaScript engine is running a full compiler pipeline in real-time. Every scroll, every click, powered by layers you never see.

---

## ANIMATION NOTES
Show JavaScript code on screen. Peel back layers: Source Code → Parser → AST → Bytecode → JIT Compiler → Machine Code. Show these layers executing in parallel while a webpage scrolls smoothly on top. Final frame: the clean webpage on top, the complex engine underneath running continuously.
