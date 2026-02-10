# APIs Explained

## Overview
- **ID**: T-32
- **Slug**: apis-explained
- **Pillar**: P4 (Builder's Architecture)
- **Format**: short-form
- **Duration**: 38s / 1140 frames
- **Resolution**: 1080x1920 (9:16) @ 30fps
- **Source script**: ../01-scripts/short-form/P4-builders-architecture/apis-explained-review.md
- **Accent colors**: techBlue (#3B82F6), insightOrange (#F59E0B), solutionGreen (#10B981), aiPurple (#8B5CF6)
- **Core metaphor**: An API is a restaurant menu -- one piece of software publishes what it can do, another reads the menu and orders, without needing to know how the kitchen works.
- **Key visual**: A customer (App A) orders from a menu (API docs), a waiter carries the request to a kitchen (server), and the kitchen returns a prepared dish (response) -- then zooming out to reveal millions of these interactions running simultaneously as a massive digital food court.
- **Frame number convention**: Global

---

## Color Flow

| Scene | Dominant Color | Mood |
|-------|---------------|------|
| Hook | insightOrange #F59E0B | Warm familiarity, "aha" simplicity |
| Context | solutionGreen #10B981 | Friendly, approachable restaurant scene |
| Core | techBlue #3B82F6 | Technical flow, request/response cycle |
| Resolution | aiPurple #8B5CF6 | Scale, interconnectedness |
| Closing | insightOrange #F59E0B | Takeaway warmth |

---

## Project-Specific Components

### RestaurantTable

A simple flat illustration of a table with a seated figure (App A).

- **Props:** `label: string, color: string, x: number, y: number, startFrame: number, springPreset: "snappy" | "gentle" | "bouncy"`
- Table: 280w x 20h rounded rectangle, surface (#12121A) fill, 2px border `color`, 12px radius, centered at `x`
- Figure: Simplified circle head (40px diameter, `color` fill) + trapezoid body (60w top, 80w bottom, 60h, `color` at 80% opacity), positioned above table at `y - 100`
- Label badge below table: `label` text in Inter 500, 28px, `#E5E7EB`, bg surface (#12121A), 8px padding, 2px border `color`, 8px radius
- **Entrance:** opacity 0 to 1 + scale 0.9 to 1.0 (spring: named preset) starting at `startFrame`

### MenuItem

A single line item representing an API endpoint on a menu card.

- **Props:** `endpoint: string, description: string, color: string, startFrame: number, staggerIndex: number`
- Container: 700w, 60h, bg surface (#12121A), 1px border panelBorder (#1A1A24), 8px radius
- Left: `endpoint` in JetBrains Mono 400, 28px, `color`
- Right: `description` in Inter 400, 24px, textMuted (#9CA3AF)
- **Entrance:** each item slides in from right (translateX 60 to 0, spring: snappy) staggered by `staggerIndex * 6` frames from `startFrame`
- **Highlight:** when "selected," border transitions to `color` at 80% opacity, bg brightens to surfaceAlt (#1A1A24) + left text glows (text-shadow: 0 0 8px `color` at 40% opacity) over 10 frames

### MenuCard

A card container holding multiple MenuItems, styled as a restaurant menu / API docs panel.

- **Props:** `title: string, items: Array<{endpoint, description}>, color: string, startFrame: number`
- Panel: 760w, auto height, bg codeBg (#12121A) fill, 16px radius, 2px border `color` at 30% opacity
- **Panel chrome:** Top row: three 12px circles (red #EF4444, amber #F59E0B, green #10B981) with 8px gap. Title bar: `title` in Inter 600, 32px, `#E5E7EB`, centered, 24px below dots
- Horizontal divider: 1px line, textDim (#6B7280) at 30%, 16px below title
- Items render below divider with 8px vertical gap
- **Entrance:** opacity 0 to 1 + scale 0.97 to 1.0 (spring: gentle) starting at `startFrame`

### RequestArrow

Animated directional arrow showing data flowing from one element to another.

- **Props:** `fromX: number, fromY: number, toX: number, toY: number, color: string, startFrame: number, drawDuration: number, label?: string, labelColor?: string`
- 3px stroke, `color`, with 10px chevron arrowhead at destination
- Draws along path over `drawDuration` frames using `interpolate` on SVG `strokeDashoffset`
- Animated dot (8px circle, `color`, 100% opacity) travels along path from 0% to 100% over `drawDuration` frames starting at `startFrame`
- Optional `label` renders centered above the arrow midpoint: Inter 500, 24px, `labelColor` or textMuted, bg dark (#0A0A0F) with 6px horizontal padding
- **Trail effect:** dot leaves a fading trail (3 trailing circles at 60%, 30%, 10% opacity, 4px apart)

### KitchenBox

A rectangular panel representing the server / backend kitchen.

- **Props:** `label: string, sublabel?: string, color: string, width: number, height: number, x: number, y: number, startFrame: number`
- Box: `width` x `height`, bg surface (#12121A), 3px border `color`, 16px radius
- Interior: gear icon (SVG, 40px, `color` at 40% opacity, rotates continuously at `frame * 0.8` degrees) centered horizontally
- Label: Inter 600, 36px, `#E5E7EB`, centered below gear
- Sublabel: Inter 400, 24px, textMuted (#9CA3AF), centered below label
- **Entrance:** opacity 0 to 1 + translateY 40 to 0 (spring: snappy) starting at `startFrame`
- **Processing state:** gear rotation speed doubles (`frame * 1.6`), border pulses (opacity oscillates `Math.sin(frame * 0.15) * 0.3 + 0.7`), and a scan line (2px gradient, `color` at 20% opacity) sweeps top to bottom over 30 frames

### ResponsePlate

A circular element representing the returned data / "dish."

- **Props:** `label: string, color: string, size: number, startFrame: number`
- Circle: `size` diameter, bg `color` at 15% fill, 2px solid `color` border
- Label: Inter 500, 24px, `#E5E7EB`, centered
- Radial glow: `color` at 8% opacity, radius `size * 1.5`, behind the circle
- **Entrance:** scale 0 to 1.0 (spring: bouncy) starting at `startFrame`

### FoodCourtGrid

A grid of miniaturized restaurant interactions representing the scale of the internet.

- **Props:** `count: number, columns: number, startFrame: number, staggerDelay: number`
- Each cell: 80w x 100h, contains a simplified dot-figure (12px circle, random accent color from palette), a tiny arrow (1px), and a tiny box (20x16, matching color)
- Grid centered in frame, cells staggered in by `staggerDelay` frames each (top-left to bottom-right)
- **Entrance per cell:** opacity 0 to 1 + scale 0 to 1 (spring: snappy) staggered
- **Idle animation:** each cell's arrow pulses opacity (`Math.sin((frame - startFrame + cellIndex * 8) * 0.1) * 0.3 + 0.7`) -- creates a "breathing" data-flow effect across the grid

---

## Scene Breakdown

### Scene 1: Hook (0s-3s, frames 0-90)

**Narration:** > "An API is just a menu for software."

**Visuals:**

- **Frames 0-15**: Dark bg (#0A0A0F) with `AmbientBackground` (particleCount: 25, color: #F59E0B at 10% opacity, speed: 0.2). `Vignette` overlay (opacity: 0.5). Clean, still. 15 frames of breathing room.

- **Frames 15-45**: Center screen at Y: 850. The word `API` enters via `GlitchText startFrame={15} intensity={0.8} speed={4} fontSize={96} color="#3B82F6" enableShadows={true}`. Chromatic aberration splits red/cyan +/-5px. The text feels technical, intimidating. At frame 35, a subtle `ShinyText` sweep runs across the letters (shineColor: #FFFFFF, duration: 20).

- **Frames 45-55**: The glitch subsides (intensity interpolates from 0.8 to 0 over 10 frames). `API` text dims to 50% opacity and scales down from 1.0 to 0.7 (spring: snappy). It translates upward from Y: 850 to Y: 550.

- **Frames 55-75**: Below the dimmed API text at Y: 780, the phrase `= a menu for software` enters via `BlurText startFrame={55} animateBy="words" direction="bottom" staggerDelay={5} blurAmount={10} distance={25} fontSize={52} color="#F59E0B"`. The word "menu" is the accent hit. A thin horizontal rule (insightOrange #F59E0B, 2px height, 40% opacity) draws itself beneath both lines -- width interpolates from 0 to 700px over 15 frames starting at frame 65 (spring: gentle).

- **Frames 75-90**: Both text elements hold. The horizontal rule completes. A soft radial glow fades in behind "menu" -- insightOrange at 5% opacity, 200px radius, centered on the word. Opacity interpolates 0% to 5% over 15 frames. The "aha" settles.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 0,
  API_GLITCH_IN: 15,
  SHINE_SWEEP: 35,
  GLITCH_FADE: 45,
  API_SHRINK_UP: 45,
  MENU_TEXT_IN: 55,
  UNDERLINE_DRAW: 65,
  GLOW_IN: 75,
  SCENE_END: 90,
};
```

**Components:** GlitchText, ShinyText, BlurText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 2: Context — The Restaurant (3s-10s, frames 90-300)

**Narration:** > "When you go to a restaurant, you don't walk into the kitchen and cook your own food. You look at the menu, pick what you want, and someone brings it to you. You don't need to know how the kitchen works. You just need to know what's available and how to order it."

**Visuals:**

- **Frames 90-110**: Previous text fades out (opacity 1.0 to 0, 20 frames). Clean transition to dark bg (#0A0A0F). `AmbientBackground` color shifts from insightOrange to solutionGreen (particle color interpolates #F59E0B to #10B981 over 20 frames).

- **Frames 110-140**: `RestaurantTable label="You" color="#10B981" x={540} y={1400} startFrame={110} springPreset="bouncy"` enters bottom-center of frame. The figure scales in with a slight bounce. At frame 125: a thought bubble (three circles ascending, 8px/12px/16px, solutionGreen at 30% opacity) appears above the figure's head, spring: snappy, indicating thinking.

- **Frames 140-180**: `MenuCard title="MENU" items={[{endpoint: "Pasta", description: "house special"}, {endpoint: "Steak", description: "grilled"}, {endpoint: "Salad", description: "fresh"}]} color="#10B981" startFrame={140}` appears at Y: 700, centered. The card scales in (0.97 to 1.0) with terminal dots at top. Each MenuItem slides in staggered (6 frames apart, starting frame 150). The thought bubble fades out (opacity to 0 over 10 frames starting at frame 145).

- **Frames 180-210**: The second MenuItem ("Steak") highlights -- border brightens to solutionGreen at 80%, bg shifts to surfaceAlt, left text gains glow. A small checkmark icon (16px, solutionGreen) fades in to the right of "Steak" at frame 190 (spring: bouncy). The other items dim to 40% opacity over 15 frames starting at frame 195.

- **Frames 210-240**: `KitchenBox label="Kitchen" sublabel="(you can't see inside)" color="#6B7280" width={400} height={200} x={540} y={300} startFrame={210}`. Enters from top. The sublabel is textDim (#6B7280), emphasizing opacity. A dashed border (4px dash, 4px gap) at 30% opacity outlines the kitchen box -- "hidden from view" aesthetic. Gear icon begins slow rotation.

- **Frames 240-265**: `RequestArrow fromX={540} fromY={680} toX={540} toY={500} color="#10B981" startFrame={240} drawDuration={20} label="order" labelColor="#10B981"`. Arrow draws upward from menu card to kitchen. The animated dot travels up. At frame 250, the KitchenBox enters processing state: gear doubles speed, border pulses, scan line sweeps.

- **Frames 265-290**: Kitchen processing completes. `ResponsePlate label="Steak" color="#10B981" size={80} startFrame={268}` bounces into existence at Y: 680 (between kitchen and table). `RequestArrow fromX={540} fromY={500} toX={540} toY={1350} color="#F59E0B" startFrame={272} drawDuration={18} label="served" labelColor="#F59E0B"`. Arrow draws downward from kitchen toward the table. The ResponsePlate follows the arrow down, translating from Y: 680 to Y: 1300 over 18 frames (spring: gentle).

- **Frames 290-300**: The full scene holds: customer at bottom, menu in middle (faded to 30% opacity at frame 285 over 10 frames), kitchen at top (gear returns to slow rotation), food delivered. `AnimatedText variant="label" size={28} color="#9CA3AF" entrance="fade" startFrame={292} springPreset="gentle"` at Y: 1550 reading "No kitchen knowledge required." -- subtle reinforcement.

**BEATS:**
```typescript
const BEATS = {
  HOOK_TEXT_OUT: 90,
  PARTICLE_COLOR_SHIFT: 90,
  TABLE_IN: 110,
  THOUGHT_BUBBLE: 125,
  MENU_CARD_IN: 140,
  THOUGHT_BUBBLE_OUT: 145,
  MENU_ITEMS_STAGGER: 150,
  STEAK_HIGHLIGHT: 180,
  CHECKMARK_IN: 190,
  OTHER_ITEMS_DIM: 195,
  KITCHEN_IN: 210,
  ORDER_ARROW_DRAW: 240,
  KITCHEN_PROCESSING: 250,
  RESPONSE_PLATE_IN: 268,
  SERVED_ARROW_DRAW: 272,
  MENU_DIM: 285,
  LABEL_IN: 292,
  SCENE_END: 300,
};
```

**Components:** RestaurantTable, MenuCard, MenuItem (x3), KitchenBox, RequestArrow (x2), ResponsePlate, AnimatedText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 3: Core — The API Translation (10s-22s, frames 300-660)

**Narration:** > "An API is exactly that. One piece of software publishes a menu: here are the things I can do. Another piece of software reads the menu and makes a request. The first software processes the request and sends back the result. Every time an app checks the weather, processes a payment, or sends a notification, it's reading a menu and placing an order."

**Visuals:**

- **Frames 300-330**: All previous elements fade out (opacity to 0 over 20 frames). Clean transition. `AmbientBackground` particles shift to techBlue (#3B82F6 at 12% opacity). At frame 310: `AnimatedText variant="title" size={48} color="#3B82F6" entrance="scale" startFrame={310} springPreset="bouncy"` at Y: 200 reading "How an API Actually Works". The title shines: `ShinyText startFrame={315} shineColor="#FFFFFF" duration={30} fontSize={48}`.

- **Frames 330-360**: Left side of frame at X: 270. `RestaurantTable label="App A" color="#3B82F6" x={270} y={900} startFrame={330} springPreset="snappy"` -- the requesting application. Small code bracket icons (20px, techBlue at 40%) flank the figure to distinguish it as software, not a person. At frame 340: right side at X: 810. `KitchenBox label="App B" sublabel="(the server)" color="#8B5CF6" width={360} height={180} x={810} y={900} startFrame={340}` -- the responding application. Gear icon in aiPurple.

- **Frames 360-410**: Between the two apps at X: 540, Y: 600. `MenuCard title="API Documentation" items={[{endpoint: "GET /weather", description: "current conditions"}, {endpoint: "POST /payment", description: "process charge"}, {endpoint: "POST /notify", description: "send alert"}]} color="#3B82F6" startFrame={360}` scales in. Each MenuItem staggers in starting frame 370 (6 frames apart). The title "API Documentation" uses `GradientText colors={["#3B82F6", "#8B5CF6"]} direction="horizontal" duration={90} fontSize={32}`. The terminal dots glow subtly.

- **Frames 410-430**: The first MenuItem ("GET /weather") highlights -- border to techBlue 80%, glow on endpoint text. A small cursor icon (blinking block, 16px, techBlue, toggles every 12 frames) appears at the left edge of the item, indicating selection. The other items hold at normal opacity.

- **Frames 430-465**: `RequestArrow fromX={270} fromY={850} toX={540} toY={620} color="#3B82F6" startFrame={430} drawDuration={15} label="reads menu" labelColor="#3B82F6"` draws from App A to the menu card. At frame 440: the highlighted MenuItem pulses once (scale 1.0 to 1.03 to 1.0 over 10 frames, spring: snappy). At frame 445: `RequestArrow fromX={540} fromY={620} toX={810} toY={850} color="#F59E0B" startFrame={445} drawDuration={15} label="request" labelColor="#F59E0B"` draws from menu card to App B. The animated dot carries an orange glow trail.

- **Frames 465-500**: App B (KitchenBox) enters processing state: gear doubles rotation, border pulses aiPurple, scan line sweeps. The MenuCard dims to 40% opacity over 15 frames (starting frame 465). `AnimatedText variant="code" size={32} color="#8B5CF6" entrance="fade" startFrame={475} springPreset="gentle"` inside the KitchenBox reading "processing..." with a blinking cursor appended (toggling every 10 frames).

- **Frames 500-535**: Processing completes. "processing..." text fades out (frame 500, 10 frames). `ResponsePlate label="72F / Sunny" color="#10B981" size={90} startFrame={505}` bounces into existence at X: 810, Y: 700. `RequestArrow fromX={810} fromY={750} toX={270} toY={850} color="#10B981" startFrame={510} drawDuration={20} label="response" labelColor="#10B981"` draws from App B back to App A. The ResponsePlate follows the arrow path, translating from X: 810 to X: 350 over 20 frames (spring: gentle). At frame 525, App A's label badge border flashes solutionGreen (2px, 80% opacity) for 3 frames -- acknowledgment.

- **Frames 535-580**: The full request-response cycle is visible. All arrows hold at 40% opacity. At frame 540, three example labels appear stacked vertically at Y: 1400, Y: 1470, Y: 1540, each entering via `AnimatedText variant="label" size={28} entrance="slideUp" springPreset="snappy"` staggered by 8 frames:
  - Frame 540: "checks the weather" in techBlue (#3B82F6)
  - Frame 548: "processes a payment" in insightOrange (#F59E0B)
  - Frame 556: "sends a notification" in aiPurple (#8B5CF6)
  Each has a small filled circle (10px) to its left in matching color.

- **Frames 580-620**: The three labels highlight in sequence. At frame 580: "checks the weather" brightens (text-shadow glow, 0 0 12px techBlue at 40%), the others remain normal. At frame 595: first label dims to 50%, "processes a payment" brightens with its own glow. At frame 610: second dims, "sends a notification" brightens. Each highlight lasts 15 frames, creating a cascading pulse.

- **Frames 620-660**: All example labels fade to 30% opacity (15 frames). The central diagram (App A, Menu, App B) scales down from 1.0 to 0.85 (spring: gentle, 30 frames starting at frame 620). Everything shifts upward by 100px (translateY interpolation) -- clearing space for the next scene. At frame 650: elements begin fading out (opacity to 0 over 30 frames, continues into Scene 4 transition).

**BEATS:**
```typescript
const BEATS = {
  PREV_ELEMENTS_OUT: 300,
  PARTICLE_SHIFT_BLUE: 310,
  TITLE_IN: 310,
  TITLE_SHINE: 315,
  APP_A_IN: 330,
  APP_B_IN: 340,
  API_DOCS_CARD_IN: 360,
  MENU_ITEMS_STAGGER: 370,
  WEATHER_HIGHLIGHT: 410,
  CURSOR_BLINK_START: 410,
  READ_ARROW_DRAW: 430,
  ITEM_PULSE: 440,
  REQUEST_ARROW_DRAW: 445,
  KITCHEN_PROCESSING: 465,
  MENU_DIM: 465,
  PROCESSING_TEXT_IN: 475,
  PROCESSING_TEXT_OUT: 500,
  RESPONSE_PLATE_IN: 505,
  RESPONSE_ARROW_DRAW: 510,
  APP_A_ACK_FLASH: 525,
  EXAMPLE_WEATHER: 540,
  EXAMPLE_PAYMENT: 548,
  EXAMPLE_NOTIFY: 556,
  HIGHLIGHT_WEATHER: 580,
  HIGHLIGHT_PAYMENT: 595,
  HIGHLIGHT_NOTIFY: 610,
  EXAMPLES_DIM: 620,
  DIAGRAM_SCALE_DOWN: 620,
  FADE_OUT_START: 650,
  SCENE_END: 660,
};
```

**Components:** RestaurantTable, KitchenBox, MenuCard, MenuItem (x3), RequestArrow (x3), ResponsePlate, AnimatedText (x4), ShinyText, GradientText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 4: Resolution — The Internet as a Food Court (22s-30s, frames 660-900)

**Narration:** > "The entire internet runs on software politely asking other software for things. That's all an API is."

**Visuals:**

- **Frames 660-690**: Previous elements finish fading out (if any remain). Clean dark bg (#0A0A0F). `AmbientBackground` particles shift to aiPurple (#8B5CF6 at 10% opacity, speed: 0.4). At frame 670: a single miniaturized restaurant interaction (simplified: dot-figure, arrow, box) appears at center screen X: 540, Y: 960, scale 0.5 -- a tiny echo of the diagram we just saw. Uses `RestaurantTable` and `KitchenBox` at reduced size. `RequestArrow` draws between them over 15 frames (spring: snappy). The response arrow draws back at frame 685.

- **Frames 690-740**: The single interaction holds for a beat. At frame 695: `FoodCourtGrid count={24} columns={6} startFrame={695} staggerDelay={2}` begins populating. The grid fills outward from the center interaction, each cell appearing with staggered scale-in (spring: snappy). 24 cells x 2 frame stagger = 48 frames to fill completely. As each row completes, it gains a subtle connecting line (1px, textDim at 20%) between cells -- the "network."

- **Frames 740-780**: All 24 grid cells are now visible. The idle animation activates: arrows across the grid pulse in waves (`Math.sin` offset per cell). `CountUp from={0} to={1000000} startFrame={740} duration={30} separator="," fontSize={64} color="#8B5CF6" useSpring={true}` appears at Y: 350, centered. Below at Y: 430: `AnimatedText variant="body" size={36} color="#9CA3AF" entrance="fade" startFrame={748} springPreset="gentle"` reading "API calls per second". The count reaches 1,000,000 at frame 770.

- **Frames 780-810**: The count holds. At frame 785: `AnimatedText variant="title" size={52} color="#F59E0B" entrance="scale" startFrame={785} springPreset="bouncy"` at Y: 1500 reading "Software asking software." Key reframe line. Wrapped in `ShinyText startFrame={790} shineColor="#FFFFFF" duration={30} fontSize={52}`. A thin accent underline (insightOrange, 2px, 60% opacity) draws beneath it over 15 frames starting at frame 795.

- **Frames 810-840**: The FoodCourtGrid cells begin dimming from the edges inward -- outermost cells first, each ring dimming to 25% opacity over 15 frames, staggered inward by 5 frames per ring. The center cell remains at full brightness longest. The CountUp dims to 40% (15 frames starting at 815). The grid dissolves into a soft constellation pattern as the dimming completes.

- **Frames 840-870**: Only the center grid cell, the reframe text "Software asking software," and a subtle radial glow remain visible. The center cell's arrow pulses steadily (one full cycle per 20 frames, opacity 0.5 to 1.0). The glow (aiPurple at 4%, 500px radius) is centered behind the grid. Everything else is at 10-25% opacity.

- **Frames 870-900**: All remaining elements fade out -- opacity interpolates to 0 over 30 frames (spring: slow). Clean fade to black.

**BEATS:**
```typescript
const BEATS = {
  PREV_FADE_COMPLETE: 660,
  PARTICLE_SHIFT_PURPLE: 670,
  SINGLE_INTERACTION_IN: 670,
  SINGLE_RESPONSE: 685,
  GRID_POPULATE_START: 695,
  GRID_IDLE_ACTIVE: 740,
  COUNTUP_START: 740,
  CALLS_LABEL_IN: 748,
  COUNTUP_COMPLETE: 770,
  REFRAME_TEXT_IN: 785,
  SHINE_SWEEP: 790,
  UNDERLINE_DRAW: 795,
  GRID_EDGE_DIM: 810,
  COUNTUP_DIM: 815,
  CENTER_FOCUS: 840,
  RADIAL_GLOW_IN: 840,
  FADE_TO_BLACK: 870,
  SCENE_END: 900,
};
```

**Components:** RestaurantTable (mini), KitchenBox (mini), RequestArrow (mini), FoodCourtGrid, CountUp, AnimatedText (x2), ShinyText, AmbientBackground, Vignette
**Background:** dark (#0A0A0F)

---

### Scene 5: Closing (30s-38s, frames 900-1140)

**Narration:** None -- text only.

**Visuals:**

- **Frames 900-940**: Clean dark bg (#0A0A0F). Breathing room -- nothing on screen. 40 frames of stillness. `Vignette` (opacity: 0.4) fades in over 20 frames starting at frame 920.

- **Frames 940-1000**: First line enters at Y: 800, centered:
  `BlurText startFrame={940} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={44} color="#E5E7EB"`:
  "The internet runs on software"

- **Frames 1000-1050**: Second line enters at Y: 880, centered:
  `BlurText startFrame={1000} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={48} color="#F59E0B"`:
  "politely asking other software for things."
  Key line -- accent color (insightOrange). Slightly larger (48px) for emphasis.

- **Frames 1040-1070**: Third line enters at Y: 980, centered:
  `BlurText startFrame={1040} animateBy="words" direction="bottom" staggerDelay={4} blurAmount={8} distance={30} fontSize={40} color="#9CA3AF"`:
  "That's all an API is."
  Understated -- muted color, slightly smaller.

- **Frames 1060-1080**: Subtle radial glow fades in behind the accent-colored second line -- insightOrange #F59E0B at 4% opacity, 400px radius, centered at Y: 880. Opacity interpolates from 0% to 4% over 20 frames.

- **Frames 1080-1140**: Clean hold. No animation. All three lines visible. 60 frames (2 seconds) of stillness. The message lands.

**BEATS:**
```typescript
const BEATS = {
  BREATHING_ROOM: 900,
  VIGNETTE_IN: 920,
  LINE_1_START: 940,
  LINE_2_START: 1000,
  LINE_3_START: 1040,
  GLOW_IN: 1060,
  HOLD_START: 1080,
  SCENE_END: 1140,
};
```

**Components:** BlurText (x3), Vignette
**Background:** dark (#0A0A0F)
