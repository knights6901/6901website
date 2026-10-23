---
name: KnightFall Engineering Portfolio
description: A cinematic, student-built robotics portfolio in charcoal, silver, and KnightFall purple.
---

# KnightFall design system

## Overview

The team is the story. Present KnightFall like an independent engineering studio: confident condensed typography, large real photographs, and generous negative space. Preserve the energy of students making things together. This is not a fictional aerospace company or a military interface.

The current direction is user-authorized original art direction, replacing earlier reference-image layouts. Homepage hierarchy: the KnightFall title spread, joining the build, competition evidence, partners, and the people behind the robot.

## Colors

Charcoal `#0b0b0e`, lifted charcoal `#151419`, silver-white `#f2f0f5`, secondary silver `#c0bdc6`, muted text `#8d8997`, Knight purple `#7851d1`, and lavender `#b89ae8`. Purple is concentrated in deliberate accents and material fields, not every surface. No red UI. Photographs retain natural color. Light mode uses a warm silver canvas and dark plum ink; photographic exhibits can remain dark with explicitly light text.

## Typography

Self-hosted Barlow Condensed, 600 and 700, for cover headlines and large numerals. Manrope for body copy and controls. Headlines use short, tightly set uppercase compositions; normal reading copy uses sentence case and 1.65–1.8 line height. Small labels remain readable. Avoid invented telemetry and decorative technical jargon.

## Layout

Full-width title spread followed by asymmetric editorial sections. Shared page gutter: clamp(1.25rem, 4vw, 5rem). Navigation stays conventional. The homepage title, image, text, and action are all visible without competing at laptop sizes. On mobile, the title spread collapses to its content height, photos crop deliberately, and controls remain at least 44px.

## Elevation & Depth

No WebGL scene. The Lancelot 3D model was taken off the homepage on 2026-10-23 at the user's request. Its files stay in `public/models/` but no page shows them; do not reintroduce it unless asked. A single purple material field behind the title establishes depth. Real photography and slight scroll-linked offsets carry the rest of the experience. Use composited transforms, no extra particle renderers or continuously running background canvases.

## Shapes

Broad rectangular compositions, fine dividers, 12px photographic corners, 8px controls. No repeated floating glass cards, tilted fake engineering diagrams, or arbitrary rounded pills.

## Components

- Header: slim, full-width, logo at left, conventional links and a binary light/dark switch at right. Default to the device appearance until the visitor chooses a theme. Mobile menu supports focus containment and Escape. Link arrows use shared SVG strokes, not platform-dependent text glyphs.
- Motion: deliberate 500–700ms entrances, 180–240ms interaction feedback, reversible scroll progress. Pause offscreen and honor reduced motion. Never hide essential content until an animation succeeds.
- Recruitment: real workshop images, clear roles, direct contact action.
- Sponsors: equal neutral presentation. No sponsor receives a branded purple background that implies preference.
- Refinement: preserve the cinematic portfolio layout (variance 7, motion 6, density 4). The stationary wordmark arrives with a brief fade. Let the oversized typography supply depth, without additional animated background objects. Sponsor logos reveal their original colors on an equal silver surface on hover and keyboard focus; touch devices get the full-color version by default. Student roles use native expandable descriptions, not decorative buttons.
- Hero typography responds to viewport height as well as width, with title and introduction in separate grid rows. Reduced motion leaves the title and role descriptions static.
- Keep the hero clean: the user rejected moving letters, the purple text shimmer, the triangle, and the machined loop as visual clutter. No replacement decorative loop or pause control. Preserve the oversized title and purple headline emphasis. The loader draws the actual SwordLogo.png stroke by stroke using a small SVG mask. Its final silhouette is the original logo, with no shape swap. The loader follows the active theme and is skipped for reduced motion.
- Footer: oversized KnightFall signature, complete navigation, location, and Instagram.

## Do’s and Don’ts

Keep existing records, assets, routes, form, gallery, and season interactions. Add no unverified robot specifications, results, or testimonials. Make copy sound like students who build robots, not marketing boilerplate. Avoid em dashes. Never trade mobile legibility for an ornamental effect. Keep the site usable with reduced motion and slow connections.

## Sponsor artwork provenance

Color versions added on 2026-09-05, with all original assets retained: [Boeing blue artwork](https://www.boeing.com/content/dam/boeing/v2/common/boeing-logo-blue.png) and the inline color logo from [Leidos's official homepage](https://www.leidos.com). Dallas College and Raising Cane's use the existing full-color files. No sponsor colors were guessed or generated.
