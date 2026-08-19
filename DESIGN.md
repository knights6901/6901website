---
name: KnightFall FRC 6901
description: KnightFall's established purple-and-black robotics identity, refined with precise motion and polished interaction.
---

# Design System: KnightFall FRC 6901

## Overview

**Creative North Star: "KnightFall, in motion"**

The current KnightFall site is the foundation: dark purple-and-black surfaces, condensed display type, team photography, direct section labels, and an energetic competition feel. The refinement adds Apple-like physical motion, better responsive behavior, restrained translucent materials, and more disciplined spacing without sanding away the team's original personality.

The interface avoids generic neon technology styling. Purple behaves as the team's owned signal color, not as a glow applied to every object. Motion is orchestrated around the robot and the story of building it; all secondary interactions remain restrained and fast.

**Key Characteristics:**

- Robot-first composition with real KnightFall imagery
- Deep charcoal surfaces with one consistent knight-purple accent
- Strong condensed display typography paired with a calm, highly legible body face
- Smoked glass and precise technical detailing used selectively
- Scroll-driven storytelling with static and reduced-motion fallbacks

## Colors

The palette is black and purple with cool neutral whites and graphite layers.

### Primary

- **Knight Purple** (`#5d3194`): Brand fills, selected states, and primary calls to action.
- **Purple Ink** (`#c6a4ef`): High-contrast accent text, focus rings, and the robot progress line.

### Neutral

- **Pit Black** (`#080808`): Primary background, slightly lifted from pure black.
- **Graphite Bay** (`#0d0d0d`, `#111111`): Secondary surfaces and section separation.
- **Machined Silver** (`#888888`, `#cccccc`): Secondary copy and quiet UI.
- **Signal White** (`#f0f0f0`): Primary typography and controls.

### Named Rules

**The Purple Signal Rule.** Purple identifies importance and interaction. It never becomes ambient decoration across every surface.

**The No Red Rule.** Red is outside the KnightFall identity and must not appear in decorative UI, imagery treatments, or status accents.

## Typography

`Bebas Neue` remains the display face from the original site. `DM Sans` remains the body and interface face. This pairing is part of KnightFall's existing visual character and should not be replaced without a full brand decision.

Display typography is left aligned by default and uses short, decisive lines. Body copy remains sentence case with comfortable leading and a practical reading width. Technical labels are rare and only appear when they add real meaning.

## Layout

Desktop layouts use an asymmetric editorial grid: large robot imagery owns one side or the full field while content locks to a stable reading column. Section compositions should vary between pinned media, full-width photography, compact evidence bands, and focused conversion blocks.

Mobile layouts collapse to one column with the robot remaining first. Navigation, calls to action, and essential facts stay available without depending on hover or WebGL. The opening viewport must make the team, robot, and main action clear without requiring scroll.

## Elevation & Depth

Depth comes from tonal layering, image lighting, restrained translucency, and the physical presence of the robot. Shadows are soft and local. Outer neon glows and constant bloom are prohibited. Smoked-glass surfaces may appear over photography only when they preserve legibility without blur support.

**The Robot Owns the Light Rule.** The strongest lighting and depth treatment belongs to the robot experience. Supporting sections stay quieter so the focal object keeps its authority.

## Shapes

The form language is engineered and taut. Buttons use a 6px radius; major photo overlays use a 24px radius. Most sections remain border-led and square so the site does not become a field of rounded cards.

## Motion

The signature effect is a scroll-driven product reveal: the original centered KnightFall hero lifts away while Lancelot rises from depth, then completes one 360-degree camera orbit. The outlined 6901, aura, robot, vignette, and foreground copy occupy separate visual layers. The scroll handler is frame-coalesced, updates the model directly, and pauses outside the story viewport. Interface transitions use strong ease-out curves and remain under 300ms; longer timings are reserved for explanatory marketing reveals. Reduced-motion mode removes scroll-linked movement and presents the hero and robot as static content.

## Do's and Don'ts

### Do:

- **Do** let real robot, pit, drive-team, and outreach photography carry the story.
- **Do** use purple as the one consistent accent across the entire site.
- **Do** make motion respond to scroll, focus, hover, and press with clear purpose.
- **Do** preserve fast, readable fallbacks for mobile, reduced motion, and no-WebGL clients.

### Don't:

- **Don't** use red anywhere in the visual system.
- **Don't** use generic purple neon clouds, excessive glow, or repetitive card grids.
- **Don't** hide essential content inside a 3D canvas.
- **Don't** invent robot specifications, sponsor metrics, testimonials, or competition results.
