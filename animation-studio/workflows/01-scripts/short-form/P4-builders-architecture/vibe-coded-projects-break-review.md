# Why Vibe-Coded Projects Break

---
**Metadata:**
- Pillar: P4 (Builder's Architecture)
- Hook Type: Counter-Position (#4)
- Funnel: Middle
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~115
- Status: review
- Topic ID: T-40

---

## SCRIPT

**HOOK:**
"Vibe coding" is when you describe what you want to AI and it generates the code. You don't really understand the code. You just know it works. Until it doesn't.

**BUILD:**
Here's where vibe-coded projects consistently break.

First, at the boundaries. Where one piece of AI-generated code meets another. The AI didn't coordinate between them because each prompt was separate. So they make different assumptions about data formats, error handling, and naming.

Second, at edge cases. The AI generated code for the expected path. The unexpected path wasn't in the prompt, so it wasn't in the code.

Third, at maintenance. Six months later, something breaks. Nobody understands the code because nobody wrote it intentionally. Fixing one thing breaks three others.

**LAND:**
The fix isn't "stop using AI for code." The fix is one additional step: understand what the AI built before you ship it. Read the code. Trace the logic. Ask the AI to explain its choices. That's the gap between a prototype and a product.

---

## ANIMATION NOTES
Show a project building rapidly via AI (code blocks assembling fast). Looks great. Then zoom into the boundaries between components: gaps, misalignment. Zoom into edge cases: missing paths. Fast-forward six months: a bug appears, developer looks at the code confused. Then the fix: the developer reading and understanding each component, adding the missing architecture. Same speed, but with comprehension.
