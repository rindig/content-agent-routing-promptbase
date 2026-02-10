# How Encryption Actually Works

## Overview
- **ID**: T-07
- **Slug**: encryption-works
- **Pillar**: P1 (Layers Beneath)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P1-layers-beneath/encryption-works-review.md
- **Accent colors**: techBlue (#3B82F6), insightOrange (#F59E0B), errorRed (#EF4444), solutionGreen (#10B981)
- **Core metaphor**: The lock is public, the key is just a number too big to guess -- security through mathematical inevitability, not secrecy.
- **Key visual**: A message and a key feed into a visible function box producing scrambled output, while an adversary's brute-force counter spins hopelessly toward 10^18 years.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | errorRed #EF4444 | Gravity, stakes, military tension |
| Context | techBlue #3B82F6 | Analytical, technical setup |
| Core | insightOrange #F59E0B | Discovery, the "aha" of why it works |
| Resolution | solutionGreen #10B981 | Elegance, clarity, resolution |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### EncryptionFunctionBox

A centered processing unit that takes two inputs (message + key) from above, shows a transformation, and emits scrambled output below.

- **Props:** `startFrame: number, processStartFrame: number, outputFrame: number, width: number, height: number`
- Box: 700w x 140h, surface (#12121A) fill, 3px border techBlue (#3B82F6), 16px border-radius, centered at X: 540
- **Interior:** Label `f(message, key)` in JetBrains Mono 32px, techBlue (#3B82F6), centered
- **Input arrows:** Two SVG paths from top-left (message) and top-right (key) converging into box top edge, 2px stroke techBlue at 60% opacity. Draw via strokeDashoffset interpolation over 20 frames starting at `startFrame`
- **Processing phase:** At `processStartFrame`, interior text pulses opacity `Math.sin(frame * 0.2) * 0.3 + 0.7` and border glows techBlue at 15% opacity, 8px blur
- **Output arrow:** Single SVG path from box bottom edge downward, 2px stroke techBlue at 60% opacity, draws over 15 frames starting at `outputFrame`
- **Box entrance:** opacity 0 to 1 + scale 0.94 to 1.0 (spring: snappy) starting at `startFrame`

### KeyCounter

A brute-force attempt counter showing an adversary cycling through keys.

- **Props:** `startFrame: number, spinDuration: number, width: number, y: number`
- Panel: `width` x 120h, surface (#12121A) fill, 2px border errorRed (#EF4444), 12px border-radius
- **Top row:** Three 10px circles (red #EF4444, amber #F59E0B, green #10B981) with 6px gap -- terminal chrome
- **Counter line:** JetBrains Mono 28px, errorRed (#EF4444). Displays `Key: 0x` followed by rapidly cycling hex characters (6 chars, each cycling through 0-F every 2 frames using `Math.floor(frame * 8) % 16` converted to hex). Starts cycling at `startFrame`
- **Timer line:** Below counter, Inter 400 24px, #9CA3AF. Text: "Estimated time:" then a `CountUp` from 1 to a target number with suffix
- **Panel entrance:** opacity 0 to 1 + translateY from 30px to 0 (spring: snappy) starting at `startFrame - 10`

### LockKeyDiagram

Final summary visual: public algorithm with lock icon, hidden key with question mark.

- **Props:** `startFrame: number, y: number`
- Two side-by-side panels, each 420w x 200h, 20px gap between them, centered at X: 540
- **Left panel (Algorithm):** surface (#12121A) fill, 3px border solutionGreen (#10B981), 12px radius. Top: lock icon (Unicode U+1F512 rendered as SVG, 48px, solutionGreen). Below: "AES-256" in JetBrains Mono 28px, solutionGreen. Below: "PUBLIC" label 20px, solutionGreen at 60% opacity
- **Right panel (Key):** surface (#12121A) fill, 3px border insightOrange (#F59E0B), 12px radius. Top: question mark "?" in Inter 700 56px, insightOrange. Below: "256-bit number" in JetBrains Mono 24px, insightOrange at 80% opacity. Below: "HIDDEN" label 20px, insightOrange at 60% opacity
- **Entrance:** Left panel slides in from X: -40 to 0 offset (spring: bouncy) at `startFrame`. Right panel slides in from X: +40 to 0 offset (spring: bouncy) at `startFrame + 8`

---

## Scene Breakdown

### Scene 1: Hook (0s-3s, frames 0-90)

**Narration:** > "I spent 8 years working with cryptographic systems in the Marine Corps. The kind where if the encryption fails, the consequences aren't a data breach. They're much worse than that."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 20, color: #EF4444 at 8% opacity, speed: 0.2). `Vignette` (opacity: 0.7) fades in over 10 frames. A single horizontal scan line (2px, errorRed #EF4444 at 12% opacity) sweeps top-to-bottom, Y interpolates from 0 to 1920 over 90 frames.

- **Frames 15-35**: Center screen at Y: 780: `AnimatedText variant="title" size={56} color="#EF4444" entrance="fade" startFrame={15} springPreset="gentle"` reading "8 YEARS". Below at Y: 860: `AnimatedText variant="body" size={40} color="#9CA3AF" entrance="fade" startFrame={22} springPreset="gentle"` reading "Cryptographic Systems". Below at Y: 920: `AnimatedText variant="label" size={28} color="#6B7280" entrance="fade" startFrame={28} springPreset="gentle"` reading "U.S. Marine Corps".

- **Frames 35-55**: "8 YEARS" text wrapped in `ShinyText startFrame={35} shineColor="#FFFFFF" duration={30} color="#EF4444" fontSize={56}` -- a single sweep to emphasize the credential. A subtle pulsing glow behind the title: errorRed #EF4444 at 4% opacity, 200px radius, opacity oscillates `Math.sin(frame * 0.1) * 0.02 + 0.04`.

- **Frames 55-70**: All three text lines dim -- opacity interpolates from 1.0 to 0.3 over 15 frames. At frame 55, a new line enters at Y: 1050: `AnimatedText variant="body" size={44} color="#EF4444" entrance="slideUp" startFrame={55} springPreset="snappy"` reading "The consequences aren't a data breach." Text has a subtle text-shadow glow: errorRed at 20% opacity, 6px blur.

- **Frames 70-90**: The consequence line holds at full opacity for 10 frames, then all elements begin fading out -- opacity interpolates from current to 0 over 10 frames starting at frame 80. Clean transition to black.

**BEATS:**
```typescript
const BEATS = {
  AMBIENT_IN: 0,
  VIGNETTE_IN: 0,
  SCAN_LINE_START: 0,
  YEARS_TITLE_IN: 15,
  CRYPTO_LABEL_IN: 22,
  MARINES_LABEL_IN: 28,
  SHINE_SWEEP: 35,
  GLOW_PULSE_START: 35,
  CREDENTIAL_DIM: 55,
  CONSEQUENCE_LINE_IN: 55,
  CONSEQUENCE_HOLD: 65,
  SCENE_FADE_OUT: 80,
  SCENE_END: 90,
};
```

**Components:** AnimatedText (x4), ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context (3s-10s, frames 90-300)

**Narration:** > "So here's how encryption actually works, in the simplest terms I can manage. You take your message and a key, a very large number, and you run them through a mathematical function that scrambles the message into something unreadable. The only way to unscramble it is to have the right key and run the reverse function."

**Visuals:**

- **Frames 90-110**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 25, color: #3B82F6 at 10% opacity, speed: 0.3). `Vignette` (opacity: 0.5). At Y: 200, centered: `AnimatedText variant="title" size={48} color="#3B82F6" entrance="slideDown" startFrame={92} springPreset="snappy"` reading "How Encryption Works". Wrapped in `ShinyText startFrame={98} shineColor="#FFFFFF" duration={40} fontSize={48}`.

- **Frames 110-140**: The title dims to opacity 0.4 over 10 frames starting at frame 130. At Y: 480, left-aligned at X: 100: message text appears character-by-character. `AnimatedText variant="code" size={32} color="#E5E7EB" entrance="none" startFrame={110}` -- use string slicing on `"ATTACK AT DAWN"` (1.5 chars/frame, so `text.slice(0, Math.floor(interpolate(frame - 110, [0, 20], [0, 14], {extrapolateRight: 'clamp'})))`). Blinking block cursor (2px wide, #E5E7EB, toggle every 15 frames) follows last character.

- **Frames 140-165**: At Y: 480, right-aligned at X: 980: key appears. `AnimatedText variant="code" size={28} color="#F59E0B" entrance="fade" startFrame={140} springPreset="gentle"` reading "Key: 7A3F...B91E". The key text is truncated with ellipsis to suggest massive length. A small label below at Y: 520: `AnimatedText variant="label" size={20} color="#9CA3AF" entrance="fade" startFrame={148} springPreset="gentle"` reading "256-bit number". Radial glow behind the key: insightOrange #F59E0B at 5% opacity, 150px radius.

- **Frames 165-195**: `EncryptionFunctionBox startFrame={165} processStartFrame={180} outputFrame={195} width={700} height={140}` enters at Y: 620, centered. Input arrows draw from message (X: 300, Y: 510) and key (X: 780, Y: 510) converging into the box top. Box label `f(message, key)` visible. Message text and key text both get a connecting line (2px, respective colors at 40% opacity) extending down toward the box.

- **Frames 195-220**: Box processing animation: border glow intensifies from 8px to 16px blur, techBlue at 20% opacity. Output arrow draws downward from box bottom over 15 frames. At Y: 830: scrambled output text types in character-by-character: `AnimatedText variant="code" size={32} color="#EF4444" entrance="none" startFrame={200}` -- string slicing on `"5F2A 9C8E 1B7D 03FA"` (2 chars/frame over 15 frames). Each character block has a subtle red glow (errorRed at 10% opacity, 4px blur).

- **Frames 220-250**: Full pipeline visible: message + key -> function -> scrambled output. At Y: 930: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={225} springPreset="gentle"` reading "Unreadable without the key". The word "key" colored insightOrange (#F59E0B). A thin horizontal divider line (1px, #3B82F6 at 20% opacity) fades in at Y: 960, width interpolates from 0 to 800px over 20 frames centered.

- **Frames 250-275**: Everything above the divider dims to opacity 0.3 over 15 frames. Below the divider at Y: 1020: reverse function diagram appears. `AnimatedText variant="code" size={28} color="#10B981" entrance="slideUp" startFrame={255} springPreset="snappy"` reading "f_inverse(scrambled, key) = message". The word "key" is colored insightOrange (#F59E0B), "message" is colored #E5E7EB. A small lock icon (SVG, 24px, solutionGreen) appears to the left at X: 100, Y: 1020 with entrance scale from 0 to 1 (spring: bouncy) at frame 260.

- **Frames 275-300**: All elements fade out -- opacity interpolates from current values to 0 over 25 frames. Clean transition.

**BEATS:**
```typescript
const BEATS = {
  AMBIENT_PARTICLES_IN: 90,
  TITLE_IN: 92,
  TITLE_SHINE: 98,
  MESSAGE_TYPE_START: 110,
  TITLE_DIM: 130,
  KEY_IN: 140,
  KEY_LABEL_IN: 148,
  FUNCTION_BOX_IN: 165,
  INPUT_ARROWS_DRAW: 165,
  BOX_PROCESS_START: 180,
  OUTPUT_ARROW_DRAW: 195,
  SCRAMBLED_TYPE_START: 200,
  PIPELINE_COMPLETE: 220,
  UNREADABLE_LABEL_IN: 225,
  DIVIDER_IN: 240,
  UPPER_DIM: 250,
  REVERSE_FUNCTION_IN: 255,
  LOCK_ICON_IN: 260,
  SCENE_FADE_OUT: 275,
  SCENE_END: 300,
};
```

**Components:** AnimatedText (x7), ShinyText, EncryptionFunctionBox, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 3: Core (10s-22s, frames 300-660)

**Narration:** > "The security doesn't come from hiding the method. The method is public. Everyone knows how AES encryption works. The security comes from the key being so large that trying every possible combination would take longer than the remaining life of the universe."

**Visuals:**

- **Frames 300-320**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 30, color: #F59E0B at 10% opacity, speed: 0.25). `Vignette` (opacity: 0.5). At Y: 350, centered: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" startFrame={302} springPreset="bouncy"` reading "Where does the security come from?". Wrapped in `ShinyText startFrame={308} shineColor="#FFFFFF" duration={40} fontSize={52}`.

- **Frames 320-360**: Title dims to opacity 0.3 over 10 frames starting at frame 350. Two panels emerge side-by-side, centered. Left panel at X: 160, Y: 530: surface (#12121A) fill, 440w x 300h, 3px border errorRed (#EF4444) at 60% opacity, 12px radius. Entrance: opacity 0 to 1, translateX from -30 to 0 (spring: snappy) at frame 320. Interior top: `GlitchText startFrame={325} intensity={0.6} speed={4} color="#EF4444" fontSize={28}` reading "HIDING THE METHOD". Below at Y: 610: red X mark (SVG, 48px, errorRed) scales in from 0 to 1 (spring: bouncy) at frame 335. Below at Y: 680: strikethrough text `AnimatedText variant="body" size={32} color="#6B7280" entrance="fade" startFrame={340} springPreset="gentle"` reading "Security by obscurity" with a 2px horizontal line (errorRed at 50% opacity) drawing across the text width over 15 frames starting at frame 345.

- **Frames 360-400**: Right panel at X: 520, Y: 530: surface (#12121A) fill, 440w x 300h, 3px border solutionGreen (#10B981), 12px radius. Entrance: opacity 0 to 1, translateX from +30 to 0 (spring: snappy) at frame 360. Interior top: `AnimatedText variant="title" size={28} color="#10B981" entrance="slideUp" startFrame={365} springPreset="snappy"` reading "THE KEY SIZE". Below at Y: 610: checkmark (SVG, 48px, solutionGreen) scales in from 0 to 1 (spring: bouncy) at frame 375. Below at Y: 680: `AnimatedText variant="body" size={32} color="#E5E7EB" entrance="fade" startFrame={380} springPreset="gentle"` reading "Mathematical impossibility". The word "impossibility" wrapped in `ShinyText startFrame={385} shineColor="#10B981" duration={30} fontSize={32}`.

- **Frames 400-430**: Both panels visible. Left panel border pulses once: errorRed opacity interpolates 0.6 -> 1.0 -> 0.4 over 20 frames (frame 400-420). Left panel then dims entirely to opacity 0.25 over 10 frames (420-430). Right panel border brightens: solutionGreen opacity interpolates from 1.0 to 1.0 (steady), glow intensifies -- box-shadow 0 0 12px solutionGreen at 15% opacity fades in over 15 frames starting at frame 410.

- **Frames 430-460**: Both panels slide out -- translateY interpolates from 0 to -40, opacity to 0 over 20 frames (spring: gentle) starting at frame 430. Title ("Where does the security come from?") also fades fully to 0. New visual center-screen: at Y: 450, centered: `AnimatedText variant="code" size={36} color="#3B82F6" entrance="fade" startFrame={445} springPreset="snappy"` reading "AES-256". Below at Y: 520: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="slideUp" startFrame={450} springPreset="gentle"` reading "The algorithm is public.". The word "public" colored solutionGreen (#10B981).

- **Frames 460-500**: "AES-256" text and "public" text hold. Below at Y: 620: a document icon (SVG, 40px, #9CA3AF) fades in at frame 460, with lines representing published spec. Next to it: `AnimatedText variant="label" size={24} color="#9CA3AF" entrance="fade" startFrame={465} springPreset="gentle"` reading "Published standard -- NIST, 2001". A thin connecting bracket (1px, #3B82F6 at 30% opacity) draws from AES-256 to the spec reference over 15 frames starting at frame 470.

- **Frames 500-530**: All upper elements dim to opacity 0.2 over 15 frames starting at frame 500. New focal point: at Y: 750, centered: `AnimatedText variant="title" size={48} color="#F59E0B" entrance="scale" startFrame={505} springPreset="bouncy"` reading "But the key...". Radial glow behind text: insightOrange #F59E0B at 6% opacity, 250px radius, fades in over 15 frames.

- **Frames 530-560**: Below "But the key..." at Y: 850: a key visualization. A long string of hex characters types in: `AnimatedText variant="code" size={24} color="#F59E0B" entrance="none" startFrame={530}` -- string slicing on `"7A3F 8B2C 5E19 D4A0 6F7B 2C8E 1A3D 9F0B C5E2 8D4A 7B1F 3E6C 0A9D 5F2B 8C4E 1D7A"` at 3 chars/frame over 30 frames. The text wraps across two lines (max-width 880px). Each completed 4-char block gets a brief brightness pulse (opacity spikes to 1.0 then settles to 0.8 over 5 frames).

- **Frames 560-590**: Below the hex string at Y: 960: `AnimatedText variant="body" size={36} color="#E5E7EB" entrance="slideUp" startFrame={565} springPreset="gentle"` reading "2^256 possible combinations". The "2^256" portion is `AnimatedText variant="code" size={40} color="#F59E0B" entrance="scale" startFrame={562} springPreset="bouncy"`. A subtle particle burst (6 particles, insightOrange at 20% opacity, radiate outward 40px then fade) triggers at frame 568 centered on "2^256".

- **Frames 590-630**: Adversary enters. At Y: 1150, centered: `KeyCounter startFrame={595} spinDuration={60} width={800} y={1150}`. The hex counter spins rapidly. Timer line shows: `CountUp from={1} to={100000000} startFrame={600} duration={30} separator="," fontSize={24} color="#EF4444"` with suffix " years". After count completes, text changes (crossfade 10 frames) to: `AnimatedText variant="code" size={28} color="#EF4444" entrance="fade" startFrame={632} springPreset="snappy"` reading "~10^18 years to try all keys". The "10^18" wrapped in `GlitchBurst startFrame={635} burstInterval={60} burstDuration={8} fontSize={28}` -- subtle instability on the absurd number.

- **Frames 630-660**: The KeyCounter panel border flashes rapidly -- errorRed opacity oscillates `Math.sin(frame * 0.5) * 0.3 + 0.5` for 15 frames (visual: futility). Then panel dims to opacity 0.3 over 15 frames (645-660). The hex key string and "2^256" text remain at moderate brightness (0.6 opacity). All other elements fade to 0 over the last 15 frames. Clean exit.

**BEATS:**
```typescript
const BEATS = {
  AMBIENT_IN: 300,
  QUESTION_TITLE_IN: 302,
  TITLE_SHINE: 308,
  LEFT_PANEL_IN: 320,
  GLITCH_HIDING: 325,
  X_MARK_IN: 335,
  STRIKETHROUGH_IN: 340,
  STRIKETHROUGH_DRAW: 345,
  TITLE_DIM: 350,
  RIGHT_PANEL_IN: 360,
  KEY_SIZE_LABEL_IN: 365,
  CHECK_MARK_IN: 375,
  IMPOSSIBILITY_IN: 380,
  IMPOSSIBILITY_SHINE: 385,
  LEFT_PANEL_PULSE: 400,
  RIGHT_PANEL_GLOW: 410,
  LEFT_PANEL_DIM: 420,
  PANELS_EXIT: 430,
  AES_LABEL_IN: 445,
  PUBLIC_TEXT_IN: 450,
  SPEC_ICON_IN: 460,
  NIST_LABEL_IN: 465,
  BRACKET_DRAW: 470,
  UPPER_DIM: 500,
  BUT_THE_KEY_IN: 505,
  KEY_GLOW_IN: 505,
  HEX_TYPE_START: 530,
  COMBINATIONS_TEXT_IN: 562,
  COMBINATIONS_LABEL_IN: 565,
  PARTICLE_BURST: 568,
  ADVERSARY_PANEL_IN: 585,
  COUNTER_SPIN_START: 595,
  YEARS_COUNT_START: 600,
  ABSURD_NUMBER_IN: 632,
  GLITCH_BURST_10_18: 635,
  COUNTER_FLASH: 630,
  COUNTER_DIM: 645,
  SCENE_FADE_OUT: 645,
  SCENE_END: 660,
};
```

**Components:** AnimatedText (x10), ShinyText (x2), GlitchText, GlitchBurst, EncryptionFunctionBox (reference from Scene 2 concept), KeyCounter, CountUp, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution (22s-30s, frames 660-900)

**Narration:** > "That's it. The lock is public. The key is just a number. And the number is too big to guess. Elegant problems often have elegant solutions."

**Visuals:**

- **Frames 660-690**: Dark bg (#0A0A0F). `AmbientBackground` (particleCount: 20, color: #10B981 at 10% opacity, speed: 0.2). `Vignette` (opacity: 0.5). At Y: 300, centered: `AnimatedText variant="title" size={56} color="#E5E7EB" entrance="scale" startFrame={663} springPreset="bouncy"` reading "That's it." Clean, declarative. The period punctuates. Subtle radial glow: #E5E7EB at 3% opacity, 200px radius, fades in over 15 frames.

- **Frames 690-710**: "That's it." dims to opacity 0.4 over 10 frames (700-710). `LockKeyDiagram startFrame={692} y={600}` enters -- left panel (Algorithm/PUBLIC) slides in from left, right panel (Key/HIDDEN) slides in from right, staggered by 8 frames. Lock icon in left panel: solutionGreen, SVG 48px. Question mark in right panel: insightOrange, Inter 700 56px.

- **Frames 710-740**: Left panel (PUBLIC algorithm) gets a solutionGreen border glow: 0 0 10px #10B981 at 12% opacity, fades in over 15 frames starting at frame 710. A small tag below left panel at Y: 820: `AnimatedText variant="label" size={22} color="#10B981" entrance="fade" startFrame={718} springPreset="gentle"` reading "Everyone can see the lock". Right panel (HIDDEN key) gets an insightOrange border glow: 0 0 10px #F59E0B at 12% opacity, fades in over 15 frames starting at frame 720. A small tag below right panel at Y: 820: `AnimatedText variant="label" size={22} color="#F59E0B" entrance="fade" startFrame={726} springPreset="gentle"` reading "No one can guess the key".

- **Frames 740-770**: Between the two panels, a "vs" or connection element: at X: 540, Y: 600: `AnimatedText variant="label" size={24} color="#6B7280" entrance="scale" startFrame={742} springPreset="bouncy"` reading "+" (plus sign, connecting the two ideas). Below the diagram at Y: 900: `AnimatedText variant="body" size={40} color="#E5E7EB" entrance="slideUp" startFrame={750} springPreset="gentle"` reading "The number is too big to guess." The words "too big" colored insightOrange (#F59E0B), with `ShinyText startFrame={755} shineColor="#FFFFFF" duration={30} fontSize={40}`.

- **Frames 770-810**: All diagram elements hold steady. Below at Y: 1000: a thin horizontal line (1px, solutionGreen at 30% opacity) draws from center outward (width 0 to 600px) over 15 frames starting at frame 770. Below the line at Y: 1050: `AnimatedText variant="title" size={48} color="#10B981" entrance="slideUp" startFrame={780} springPreset="gentle"` reading "Elegant problems,". At Y: 1120: `AnimatedText variant="title" size={48} color="#10B981" entrance="slideUp" startFrame={788} springPreset="gentle"` reading "elegant solutions." The word "elegant" in the second line wrapped in `ShinyText startFrame={792} shineColor="#FFFFFF" duration={40} fontSize={48}`.

- **Frames 810-840**: Radial glow intensifies behind the "elegant solutions" text: solutionGreen #10B981 at 6% opacity, 350px radius, centered at Y: 1120, fades in over 20 frames. The LockKeyDiagram panels dim to opacity 0.3 over 15 frames (810-825). "That's it." fades to 0 over 10 frames (810-820). Focus narrows to the closing statement.

- **Frames 840-870**: "too big to guess" line dims to opacity 0.3 (840-855). The two "elegant" lines remain at full brightness. A subtle pulse on the solutionGreen glow: radius oscillates 350px to 380px and back over 30 frames using `Math.sin(frame * 0.08) * 15 + 365`.

- **Frames 870-900**: All remaining elements fade out -- opacity interpolates from current to 0 over 30 frames (spring: slow). Clean transition to black.

**BEATS:**
```typescript
const BEATS = {
  AMBIENT_IN: 660,
  THATS_IT_IN: 663,
  THATS_IT_GLOW: 665,
  LOCK_DIAGRAM_IN: 692,
  THATS_IT_DIM: 700,
  LEFT_PANEL_GLOW: 710,
  LEFT_LABEL_IN: 718,
  RIGHT_PANEL_GLOW: 720,
  RIGHT_LABEL_IN: 726,
  PLUS_SIGN_IN: 742,
  TOO_BIG_TEXT_IN: 750,
  TOO_BIG_SHINE: 755,
  DIVIDER_DRAW: 770,
  ELEGANT_LINE_1_IN: 780,
  ELEGANT_LINE_2_IN: 788,
  ELEGANT_SHINE: 792,
  RESOLUTION_GLOW_IN: 810,
  DIAGRAM_DIM: 810,
  THATS_IT_OUT: 810,
  UPPER_TEXT_DIM: 840,
  GLOW_PULSE: 840,
  SCENE_FADE_OUT: 870,
  SCENE_END: 900,
};
```

**Components:** AnimatedText (x8), ShinyText (x2), LockKeyDiagram, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-930**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 30 frames of stillness. `Vignette` (opacity: 0.4) fades in over 15 frames starting at frame 915.

- **Frames 930-980**: First line enters at Y: 800, centered:
  `BlurText startFrame={930} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "The lock is public."

- **Frames 980-1020**: Second line enters at Y: 880, centered:
  `BlurText startFrame={980} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#F59E0B"`:
  "The key is just a number too big to guess."
  Key line -- accent color (insightOrange). This is the core reframe.

- **Frames 1020-1050**: Third line enters at Y: 980, centered:
  `BlurText startFrame={1020} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "Elegant problems, elegant solutions."
  Understated -- muted color, slightly smaller.

- **Frames 1050-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 880. Opacity interpolates from 0% to 4% over 20 frames starting at frame 1050. A secondary micro-glow (solutionGreen #10B981 at 2% opacity, 200px radius) fades in at Y: 980 behind the third line, starting at frame 1060 over 15 frames.

- **Frames 1080-1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. The message lands.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 900,
  VIGNETTE_IN: 915,
  LINE_1_START: 930,
  LINE_2_START: 980,
  LINE_3_START: 1020,
  ACCENT_GLOW_IN: 1050,
  SECONDARY_GLOW_IN: 1060,
  HOLD_START: 1080,
  SCENE_END: 1140,
};
```

**Components:** BlurText (x3), Vignette
**Background:** dark (#0A0A0F)
