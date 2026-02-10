# Stage 4: Renders — Final Rendered Videos

## What This Folder Is

This is the **output stage** of the animation pipeline. Final rendered videos live here, organized by format and pillar for easy retrieval and distribution.

This is where the Remotion compositions from `../03-builds/` become actual video files (`.mov` or `.mp4`).

---

## Folder Structure

```
04-renders/
├── CONTEXT.md (you are here)
├── short-form/
│   ├── P1-layers-beneath/
│   │   ├── T-01-hello-world-v1.mov
│   │   ├── T-01-hello-world-v2-edited.mov
│   │   ├── T-08-cpu-clock-cycle-v1.mov
│   │   └── ...
│   ├── P2-right-tool/
│   │   ├── T-11-60-percent-database-v1.mov
│   │   ├── T-18-60-30-10-framework-v1.mov
│   │   └── ...
│   ├── P3-methods-not-tools/
│   ├── P4-builders-architecture/
│   └── P5-honest-take/
└── long-form/
    └── [same pillar structure]
```

---

## File Naming Convention

**Format:** `T-[topic-id]-[descriptive-slug]-v[version].[ext]`

**Examples:**
- `T-01-hello-world-v1.mov`
- `T-01-hello-world-v2-edited.mov`
- `T-18-60-30-10-framework-v1.mp4`
- `T-41-ai-replace-programmers-v3-final.mov`

**Why this naming convention:**
- **`T-[topic-id]`** — Maps back to the topic bank in `../../../topic-engine/topic-bank.md` for traceability
- **`[descriptive-slug]`** — Human-readable name matching the script/spec/build
- **`v[version]`** — Supports iterative rendering (v1, v2, v3, etc.)
- **`[ext]`** — `.mov` for ProRes (recommended for editing), `.mp4` for H.264 (smaller files, good for previews)

Optional suffixes:
- `-edited` — If post-production edits were made
- `-final` — If this is the final approved version
- `-preview` — If this is a lower-quality preview render

---

## How Videos Get Here

### Rendering from a Completed Build

1. **Read the build metadata**
   - File location: `../03-builds/complete/[format]/[pillar]/[project-name].md`
   - This file contains the render commands

2. **Run the render command**
   - Copy the command from the metadata file
   - Execute it in the terminal from the animation-studio root

**Example render commands:**

**ProRes (for CapCut editing):**
```bash
npx remotion render src/index.ts HelloWorld \
  workflows/04-renders/short-form/P1-layers-beneath/T-01-hello-world-v1.mov \
  --codec prores --prores-profile 4444 --jpeg-quality 100 \
  --width 1080 --height 1920 --concurrency 16
```

**H.264 (for preview or direct upload):**
```bash
npx remotion render src/index.ts HelloWorld \
  workflows/04-renders/short-form/P1-layers-beneath/T-01-hello-world-v1.mp4 \
  --codec h264 --crf 10 --jpeg-quality 100 \
  --width 1080 --height 1920 --concurrency 16
```

3. **The video is rendered**
   - Remotion processes the composition frame by frame
   - Progress is shown in the terminal
   - Final video is written to the path specified in the command

4. **The video appears in this folder**
   - Organized by format (short-form/long-form) and pillar (P1-P5)
   - Named with topic ID, slug, and version

---

## Render Formats

### ProRes 4444 (`.mov`)
**When to use:** For editing in CapCut or other video editors
**Why:** ProRes is an intra-frame codec (every frame is a keyframe), which means no compression artifacts when scrubbing, cutting, or editing. High quality, large file size.
**Typical file size:** 100-200MB for a 60-second short
**Command:**
```bash
--codec prores --prores-profile 4444 --jpeg-quality 100
```

### H.264 (`.mp4`)
**When to use:** For previews, direct uploads, or final distribution
**Why:** H.264 is an inter-frame codec (uses keyframes + deltas), which means smaller file size but can have artifacts when editing. Good for final delivery.
**Typical file size:** 10-30MB for a 60-second short (depends on CRF setting)
**Command:**
```bash
--codec h264 --crf 10 --jpeg-quality 100
```

**CRF values:**
- `10` = Near-lossless (recommended for final delivery)
- `18` = Visually lossless (good balance)
- `23` = Default (smaller files, slight quality loss)

---

## Resolution Settings

### Short-Form (Vertical 9:16)
- **Width:** 1080
- **Height:** 1920
- **FPS:** 30
- **Platforms:** TikTok, Instagram Reels, YouTube Shorts

**Render command flag:**
```bash
--width 1080 --height 1920
```

### Long-Form (Horizontal 16:9)
- **Width:** 1920
- **Height:** 1080
- **FPS:** 30
- **Platforms:** YouTube, LinkedIn video posts

**Render command flag:**
```bash
--width 1920 --height 1080
```

---

## Versioning and Iteration

### Why Versions?
Videos often need multiple renders:
- **v1:** Initial render to check timing and visuals
- **v2:** After adjustments to composition code (timing tweaks, color changes, etc.)
- **v3:** After post-production edits (voiceover adjustments, music, etc.)

### How to Version
- Increment the version number in the filename
- Add optional suffixes for clarity (e.g., `-edited`, `-final`)
- Keep old versions unless disk space is an issue (they're useful for comparison)

**Example progression:**
1. `T-01-hello-world-v1.mov` — Initial render
2. `T-01-hello-world-v2.mov` — After adjusting timing in the composition
3. `T-01-hello-world-v3-edited.mov` — After adding voiceover and music in CapCut
4. `T-01-hello-world-v4-final.mov` — Final approved version

---

## Post-Production Workflow

### Typical Post-Production Steps (Outside This Workspace)

1. **Render the animation** (this workspace, Stage 4)
   - Output: `T-01-hello-world-v1.mov`

2. **Import into CapCut** (separate workflow)
   - Add voiceover narration
   - Add background music
   - Add captions (burned-in subtitles)
   - Fine-tune timing if needed

3. **Export from CapCut**
   - Save as new version: `T-01-hello-world-v2-edited.mov`
   - Optionally move this back into `04-renders/` for safekeeping

4. **Final QC** (quality check)
   - Watch the full video
   - Check for audio sync issues
   - Check for visual errors
   - Verify captions are accurate

5. **Distribute** (platform-playbook workflow)
   - Upload to TikTok, Instagram, YouTube
   - Reference `../../../platform-playbook/` for platform-specific optimization

---

## AI Agent Instructions: Post-Production Editing

If you're an AI agent tasked with reviewing or editing a rendered video, here's your workflow:

### Step 1: Locate the Rendered Video
- File location: `04-renders/[format]/[pillar]/T-[id]-[slug]-v[version].mov`
- Note the version number

### Step 2: Review the Video
If you can play/analyze video files:
- Check timing (do scenes start and end at the right moments?)
- Check visuals (are text, diagrams, and animations clear and readable?)
- Check transitions (are they smooth?)
- Identify any issues (too fast, too slow, text too small, colors off, etc.)

### Step 3: Identify Needed Changes
If changes are needed:
- **Composition-level changes** (timing, visuals, animations) → Go back to `../03-builds/` and edit the composition code, then re-render
- **Post-production changes** (voiceover, music, captions) → Note them for manual editing in CapCut or similar

### Step 4: Document Changes
- Create a review note in the build metadata file (`../03-builds/complete/[format]/[pillar]/[project-name].md`)
- List what needs to change and why

**Example review note:**
```markdown
## Review Notes for v1

Issues found:
- [ ] Scene 3 (layer diagram) builds too slowly — reduce duration from 30 seconds to 20 seconds
- [ ] Closing title card text is too small — increase from 64px to 72px
- [ ] Spring animation on code block is too bouncy — reduce stiffness from 150 to 100

Next steps:
- Edit composition code in ../../src/compositions/ShortForm/HelloWorld/index.tsx
- Re-render as v2
```

### Step 5: If Re-Rendering
- Make the composition changes
- Re-render with an incremented version number
- Output to the same folder: `T-01-hello-world-v2.mov`

---

## Token Management

When working with renders, you only need:
- The rendered video file (if you can analyze video)
- The build metadata (to understand what composition was rendered and how)
- Potentially the spec (to verify the video matches the intended design)

You do NOT need:
- The original script (you're way downstream of that)
- Other renders (unless comparing versions)
- The composition code (unless you're making changes)

Keep your context focused. Load only what you need for the current review or edit.

---

## What NOT to Do in This Folder

**Don't edit videos directly here.** This is storage for rendered outputs. Editing happens in CapCut or other tools, then edited versions get saved back here with new version numbers.

**Don't delete old versions unless disk space is critical.** Keeping v1, v2, v3, etc. allows for comparison and rollback if needed.

**Don't render directly to this folder without following the naming convention.** Always use the `T-[id]-[slug]-v[version].[ext]` format for traceability.

---

## Render Performance Tips

### Speed Up Rendering
- **Increase `--concurrency`** — Use more CPU cores (e.g., `--concurrency 16` on a powerful machine)
- **Render at a lower quality for previews** — Use `--crf 23` for H.264 previews, then render at `--crf 10` for final

### Reduce File Size
- **Use H.264 instead of ProRes** for final delivery (smaller files)
- **Adjust CRF value** — Higher CRF = smaller file, lower quality (start at 18, adjust as needed)

### Troubleshooting
- **Render fails** — Check the composition code for errors. Run `npm run dev` to preview in Remotion Studio first.
- **Render is slow** — Check concurrency setting, close other apps, ensure enough disk space
- **Output looks wrong** — Verify the composition code matches the spec. Re-test in Remotion Studio.

---

## Summary

- **This folder contains:** Final rendered videos organized by format and pillar
- **Organized by:** `short-form/` or `long-form/` → `P1-P5/` → video files
- **File naming:** `T-[topic-id]-[descriptive-slug]-v[version].[ext]`
- **Generated from:** Compositions in `../03-builds/complete/` rendered via Remotion CLI
- **Next step:** Post-production editing (voiceover, music, captions) and platform distribution
- **Formats:** ProRes `.mov` for editing, H.264 `.mp4` for delivery
- **Versioning:** v1, v2, v3, etc. for iterative improvements

If you're rendering, copy the command from the build metadata, execute it, and the video appears here. If you're reviewing, check the video quality, note any issues, and either re-render or move to post-production. That's it.
