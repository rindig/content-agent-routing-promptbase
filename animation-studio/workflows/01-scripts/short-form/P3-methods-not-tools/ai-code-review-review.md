# How to Use AI for Code Review

---
**Metadata:**
- Pillar: P3 (Methods, Not Tools)
- Hook Type: Reframe (#3)
- Funnel: Middle
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~110
- Status: review
- Topic ID: T-30

---

## SCRIPT

**HOOK:**
Most people use AI to write code. Fewer people realize it's often better at reviewing code.

**BUILD:**
Here's why. When AI writes code, it's generating from probability. When it reviews code, it's pattern-matching against millions of examples of good and bad code it's seen in training. Pattern matching is what these models are fundamentally built for.

The method that works across every model:

Give it the code. Then give it a role: "You are a senior engineer reviewing this for production readiness." Then give it specific things to look for: security vulnerabilities, performance bottlenecks, edge cases, readability issues.

Don't just ask "is this good?" That gets you a generic "looks good!" Ask it to find specific categories of problems. The more specific your review criteria, the more useful the review.

**LAND:**
AI as a writer is impressive. AI as a reviewer is often more valuable. And almost nobody is using it that way.

---

## ANIMATION NOTES
Code block appearing. First: AI writes code (flowing text, generative). Then: code block is already written, AI scans it with different "lenses" (security lens, performance lens, edge case lens). Each lens highlights different issues in different colors. The review reveals things the human missed. The visual message: reviewing > generating.
