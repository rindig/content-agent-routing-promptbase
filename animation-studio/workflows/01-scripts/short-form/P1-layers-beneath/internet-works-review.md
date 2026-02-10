# How the Internet Actually Works in 60 Seconds

---
**Metadata:**
- Pillar: P1 (Layers Beneath)
- Hook Type: Number Anchor (#2)
- Funnel: Top
- Platforms: Multi (TikTok / Reels / YouTube Shorts)
- Word Count: ~120
- Status: review
- Topic ID: T-03

---

## SCRIPT

**HOOK:**
Every time you load a webpage, your computer sends out a request that travels through roughly 15 to 20 different machines before reaching the server that has what you're looking for.

**BUILD:**
Your request gets chopped into packets. Each packet gets a header with the destination address. Those packets don't all take the same route. They bounce through routers, each one making a decision about the fastest path forward.

When they arrive at the server, out of order, the server reassembles them, processes your request, chops the response into new packets, and sends them back through a completely different set of routers.

Your browser reassembles everything and paints pixels on your screen.

**LAND:**
All of this happens in about 200 milliseconds. That's faster than a blink. And every single step was built by someone solving one specific problem really well.

---

## ANIMATION NOTES
Visualize a packet being "stamped" with an address header. Show 3-4 packets taking different colored paths through a network of routers (nodes lighting up as packets pass). Arrival, reassembly animation (puzzle pieces coming together). Reverse journey in different paths. Timer counting up to 200ms in the corner.
