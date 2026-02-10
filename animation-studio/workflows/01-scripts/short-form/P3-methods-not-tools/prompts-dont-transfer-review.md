# Why Your Prompts Don't Transfer Between Models

---
**Metadata:**
- Pillar: P3 (Methods, Not Tools)
- Hook Type: Question Spiral (#6)
- Funnel: Middle
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~110
- Status: review
- Topic ID: T-24

---

## SCRIPT

**HOOK:**
You write a perfect prompt in ChatGPT. It works beautifully. You copy it to Claude or Gemini. It gives you something completely different. Why?

**BUILD:**
Because each model was trained on different data, with different reinforcement signals, and different system-level instructions that you can't see. The same words activate different patterns in different models.

This is why tool-specific prompt tricks are fragile. "Say this exact phrase for better results" works until the model updates or you switch platforms.

What transfers is architecture. Clear context, well-defined tasks, explicit output formats, and good examples work in every model. Because you're not relying on a quirk of one model's training. You're relying on the fundamental structure of how language models process information.

**LAND:**
Learn the structure, not the tricks. The tricks expire. The structure is the same across every model you'll ever use.

---

## ANIMATION NOTES
Same prompt entering three different model boxes (ChatGPT, Claude, Gemini). Three different outputs emerge. Then: restructure the prompt into the architectural layers (Context, Task, Format, Examples). Same structured prompt enters all three models. Outputs converge. Not identical, but consistently good. The structure is the common thread.
