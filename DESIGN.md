---
name: KnightFall FRC 6901
description: A fun, modern student robotics identity built around cinematic product presentation and human energy.
---

# Design System: KnightFall FRC 6901

## Creative North Star

**Playful engineering in motion**

KnightFall should feel like a talented student team showing what it built, not a military dashboard or a corporate technology template. The experience combines Apple-like product cinema with the warmth of a modern creative studio. The robot earns the most dramatic stage. Students, competition, outreach, and sponsors carry the rest of the story through real photography, expressive type, and tactile motion.

Reference images live in `design-references/`. `homepage-direction.png` and `sections-direction.png` define the current visual language. Page-specific references may inform layout, but the current references control tone.

## Brand Personality

- Curious, energetic, capable, and welcoming
- Professional enough for sponsors, human enough for students
- Experimental in composition, familiar in navigation
- Confident without becoming severe

## Color

- **Deep Charcoal** `#0a0a0d`: primary canvas
- **Aubergine Black** `#121019`: lifted dark surface
- **Knight Purple** `#5d3194`: primary action and selected state
- **Purple Ink** `#c6a4ef`: focus, highlights, and small moments of energy
- **Warm White** `#f4f0e8`: primary type
- **Machined Silver** `#cbc7ce`: secondary type and metal cues

Purple is a signal color. It identifies interaction, selection, and team identity. It does not wash every section. Red does not appear in the interface. Real photographs keep their natural color.

## Typography

`Bebas Neue` remains the display face. `DM Sans` remains the body and interface face. Display type may be oversized, shifted, or layered with photography. Body text stays calm, sentence case, and comfortably readable.

Headlines are expressive but short. Labels describe real content. Avoid invented telemetry, fake metrics, decorative jargon, and tiny interface copy.

## Layout

Use an asymmetric editorial grid with generous breathing room. Large rounded image crops, floating layers, occasional overlap, and varied section composition create rhythm. Avoid repeated equal card grids. A visitor should understand each page immediately even when the composition is unusual.

The homepage order is fixed:

1. Lancelot robot experience
2. Student recruitment
3. Sponsors and partnership

Team, Seasons, and Photos each use a distinct composition within the same system.

## Shape and Material

- Soft radii between 16px and 40px for photography and major surfaces
- Small radii for compact controls
- Thin borders with low contrast
- Charcoal and aubergine layers instead of hard metal slabs
- Fine grain and soft specular highlights used sparingly
- Translucency only where it creates meaningful depth

Do not use excessive pills, clipped military panels, dense CAD grids, neon fog, or glass effects on every element.

## Motion

The signature sequence is Lancelot: one complete 360 degree orbit, verified subsystem focus moments, then the full robot returning at the end. The outlined 6901 brightens as the final assembly returns. Desktop uses scroll control. Mobile uses a shorter sequence and permits touch rotation.

Supporting motion uses smooth, interruptible ease-out timing, soft depth shifts, image reveals, accordion expansion, and restrained pointer-responsive light. The GLB remains the only heavy real-time 3D scene. Other depth effects use CSS transforms and compositing.

Reduced-motion mode shows a stable robot and removes scroll-linked movement. Reduced-transparency mode replaces blurred layers with opaque surfaces.

## Content and Evidence

- Preserve all existing routes, content, images, logos, sponsors, form behavior, and gallery records.
- Add facts only when supported by official FIRST or The Blue Alliance sources.
- Treat KnightFall as the public brand.
- Do not invent robot specifications, mechanism functions, achievements, testimonials, or sponsor metrics.

## Performance

- Keep model updates tied to animation frames and pause them offscreen.
- Use one WebGL scene only.
- Lazy-load below-fold media and reserve space for images.
- Prefer transforms and opacity for motion.
- Adapt model render quality to device capability.
- Keep the page useful before the GLB loads and when WebGL fails.
