# Component Registry

## Core Components — `src/components/core/`

### AnimatedText
**Import:** `import { AnimatedText } from '../../components/core'`

Spring-animated text with enforced style-guide minimums. Clamps font sizes to design system floors.

```tsx
<AnimatedText
  variant="hero"       // hero | title | body | code | label
  size={84}            // clamped to variant minimum
  color="bright"       // light | bright | muted | dark | custom hex
  entrance="slideUp"   // fade | slideUp | slideDown | scale | none
  startFrame={0}
  springPreset="gentle" // gentle | bouncy | snappy | slow
  align="center"
>
  Your Text Here
</AnimatedText>
```

**Variant defaults:**
| Variant | Min | Default | Font |
|---------|-----|---------|------|
| hero | 64px | 72px | Inter 700 |
| title | 48px | 56px | Inter 600 |
| body | 40px | 48px | Inter 400 |
| code | 28px | 32px | JetBrains Mono 400 |
| label | 24px | 28px | Inter 500 |

---

### SceneContainer
**Import:** `import { SceneContainer } from '../../components/core'`

Base scene wrapper with safe margins, background presets, and fade in/out.

```tsx
<SceneContainer
  background="dark"       // dark | surface | warm | cosmic | light | custom hex
  safeMargin="recommended" // minimum (5%) | recommended (8%) | none | number
  fadeIn={true}
  fadeInDuration={30}
  fadeOut={true}
  fadeOutStart={240}
  fadeOutDuration={30}
>
  {/* Scene content */}
</SceneContainer>
```

---

### SafeAreaGuide (dev only)
**Import:** `import { SafeAreaGuide } from '../../components/core'`

Red overlay showing safe margins. For development/debugging only.

```tsx
<SafeAreaGuide margin={8} />
```

---

## Effects — `src/components/core/effects/`

**Barrel import:** `import { GlitchText, ShinyText, BlurText, CountUp } from '../../components/core/effects'`

### GlitchText
Chromatic aberration glitch with red/cyan layers. Use for errors, bugs, dramatic moments.

```tsx
<GlitchText
  startFrame={0}
  intensity={1}        // 0-1
  speed={3}            // lower = faster
  enableShadows={true}
  color="#ffffff"
  fontSize={72}
>
  ERROR
</GlitchText>
```

### GlitchBurst
Periodic glitch that activates in bursts. Subtler than constant GlitchText.

```tsx
<GlitchBurst
  startFrame={0}
  burstInterval={90}   // frames between bursts
  burstDuration={15}   // frames per burst
  fontSize={72}
>
  UNSTABLE
</GlitchBurst>
```

---

### ShinyText
Animated shine sweep across text. Use for first mention of key terms.

```tsx
<ShinyText
  startFrame={0}
  color="#888888"
  shineColor="#ffffff"
  duration={60}        // frames per sweep
  pauseDuration={30}   // frames between sweeps
  direction="left"
  fontSize={48}
>
  memory
</ShinyText>
```

### GradientText
Animated gradient color shift. Use for AI concepts, abstract ideas.

```tsx
<GradientText
  startFrame={0}
  colors={['#5227FF', '#FF9FFC', '#B19EEF']}
  duration={120}
  direction="horizontal"  // horizontal | vertical | diagonal
  yoyo={true}
  fontSize={48}
>
  artificial intelligence
</GradientText>
```

---

### BlurText
Word-by-word or letter-by-letter blur reveal. Use for dramatic entrances.

```tsx
<BlurText
  startFrame={0}
  animateBy="words"    // words | letters
  direction="bottom"   // top | bottom | left | right
  staggerDelay={4}     // frames between each element
  blurAmount={10}
  distance={30}
  fontSize={48}
>
  This reveals word by word
</BlurText>
```

### FocusBlur
Blur in → sharp → blur out. Use to focus attention temporarily.

```tsx
<FocusBlur
  startFrame={0}
  focusFrame={30}
  blurOutFrame={120}
  blurAmount={8}
>
  <div>Focus on this content</div>
</FocusBlur>
```

---

### CountUp
Animated number counting. Use for stats, metrics, growth.

```tsx
<CountUp
  to={1000000}
  from={0}
  startFrame={0}
  duration={60}
  prefix="$"
  suffix="+"
  separator=","
  decimals={0}
  useSpring={true}
  color="#3b82f6"
  fontSize={56}
/>
```

### CountUpWithLabel
CountUp with an animated label underneath.

```tsx
<CountUpWithLabel
  to={99.9}
  suffix="%"
  decimals={1}
  label="ACCURACY"
  labelPosition="bottom"
  startFrame={0}
  fontSize={56}
/>
```

### StatGrid
Grid of multiple CountUp stats. Use for data comparison scenes.

```tsx
<StatGrid
  stats={[
    { value: 1000000, label: 'Users', suffix: '+' },
    { value: 99.9, label: 'Uptime', suffix: '%', decimals: 1 },
    { value: 50, label: 'Countries' },
  ]}
  startFrame={0}
  staggerDelay={15}
  columns={3}
  accentColor="#3b82f6"
  fontSize={56}
/>
```

---

## Project-Specific Components

These live in `src/compositions/[Project]/components/` and are not shared.

### AgentDeconstruction
| Component | Purpose |
|-----------|---------|
| AgentLoop | Animated agent loop diagram |
| AsyncPipeline | Async flow visualization |
| EthicsEngineInterface | Ethics engine UI mockup |
| ExplodedLayers | Layered exploded-view diagram + RatioBar |
| FullStack | Full stack visualization |
| JSONFlow | JSON data flow animation |
| MCPArchitecture | MCP protocol architecture diagram |
| ParsingPipeline | Parsing pipeline stages |
| ProtocolTimeline | Protocol evolution timeline |
| ScreenFrame | Monitor/screen frame wrapper |

### Memory
| Component | Purpose |
|-----------|---------|
| AbstractionStack | Abstraction layers stack |
| AbstractionTimeline | Timeline of abstraction evolution |
| AbstractSyntaxTree | AST tree visualization |
| AmbientBackground + Vignette | Particle background + edge vignette (shared cross-project) |
| AnimatedLine | SVG animated line drawing |
| CodeBlock | Syntax-highlighted code display |
| CodeDataBoundary | Code vs data boundary diagram |
| CodeLayerStack | Code layers visualization |
| ContextWindowDiagram | Context window visualization |
| MadLibsPage | Mad libs style fill-in page |
| MemoryLayerDetail | Memory layer detailed view |
| MemoryPyramid | Memory hierarchy pyramid |
| PromptAssemblyStream | Prompt assembly animation |
| QuoteCard | Styled quote card |

### StackBeneathStack
| Component | Purpose |
|-----------|---------|
| ChatInterface | Chat UI mockup |
| CodeBlock | Code display (project-specific version) |
| LayerStack | Stack layers with highlight animation |
| TreeNode + TreeConnection | Tree node visualization |
| TypewriterText | Typewriter text animation |

### HowIMakeTheseAnimations
| Component | Purpose |
|-----------|---------|
| VideoPlaceholder | Placeholder for video embeds |

---

## Cross-Project Usage

`AmbientBackground` and `Vignette` from Memory are imported by AgentDeconstruction scenes:
```tsx
import { AmbientBackground, Vignette } from '../../Memory/components/AmbientBackground';
```
