# Design Patterns for the AI Era

---
**Metadata:**
- Pillar: P4 (Builder's Architecture)
- Hook Type: Quiet Reveal (#1)
- Funnel: Middle
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~120
- Status: review
- Topic ID: T-33

---

## SCRIPT

**HOOK:**
Software design patterns have been around since the 1990s. Most of them still work perfectly in the AI era. A few need updating.

**BUILD:**
The patterns that haven't changed: separation of concerns (keep different responsibilities in different modules), dependency injection (make components swappable), and the repository pattern (abstract your data access so you can change where data comes from without rewriting everything).

The patterns that are new: the AI gateway pattern, where all AI calls route through a single layer so you can swap models, add fallbacks, and monitor costs in one place. The human-in-the-loop pattern, where the system is designed from the start to escalate uncertain AI outputs to a person. And the prompt versioning pattern, where prompts are treated like code with version control, testing, and rollback capability.

**LAND:**
The old patterns give you structure. The new patterns give you control over the unpredictable parts. You need both.

---

## ANIMATION NOTES
Classic design pattern diagrams (clean, architectural) on the left side, labeled "still works." New AI-era patterns on the right, labeled "new." The AI gateway pattern shown as a routing layer between application and multiple AI models. Human-in-the-loop shown as a decision diamond with a human icon. Prompt versioning shown like Git branches but for prompts.
