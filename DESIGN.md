---
name: KnightFall Engineering Portfolio
description: A cinematic, student-built robotics portfolio in charcoal, silver, and KnightFall purple.
---

# KnightFall design system

## Overview

The robot is an exhibit; the team is the story. Present KnightFall like an independent engineering studio: confident condensed typography, large real photographs, generous negative space, and one exceptional interactive object. Preserve the energy of students making things together. This is not a fictional aerospace company or a military interface.

The current direction is user-authorized original art direction, replacing earlier reference-image layouts. Homepage hierarchy: Lancelot, joining the build, competition evidence, partners, and the people behind the robot.

## Colors

Charcoal `#0b0b0e`, lifted charcoal `#151419`, silver-white `#f2f0f5`, secondary silver `#c0bdc6`, muted text `#8d8997`, Knight purple `#7851d1`, and lavender `#b89ae8`. Purple is concentrated in deliberate material fields and the robot, not every surface. No red UI. Photographs retain natural color. Light mode uses a warm silver canvas and dark plum ink; photographic exhibits can remain dark with explicitly light text.

## Typography

Self-hosted Barlow Condensed, 600 and 700, for cover headlines and large numerals. Manrope for body copy and controls. Headlines use short, tightly set uppercase compositions; normal reading copy uses sentence case and 1.65–1.8 line height. Small labels remain readable. Avoid invented telemetry and decorative technical jargon.

## Layout

Full-width exhibit followed by asymmetric editorial sections. Shared page gutter: clamp(1.25rem, 4vw, 5rem). Navigation stays conventional. The homepage title, image, text, and action are all visible without competing at laptop sizes. On mobile, text and model stack, photos crop deliberately, controls remain at least 44px, and the robot sequence shortens.

## Elevation & Depth

Lancelot is the only WebGL scene. A single purple material field and thin stage markings establish depth without obscuring the CAD. Real photography and slight scroll-linked offsets carry the rest of the experience. Use composited transforms, no extra particle renderers or continuously running background canvases.

## Shapes

Broad rectangular compositions, fine dividers, 12px photographic corners, 8px controls. Large circular geometry belongs only to the robot stage. No repeated floating glass cards, tilted fake engineering diagrams, or arbitrary rounded pills.

## Components

- Header: slim, full-width, logo at left, conventional links and theme switch at right. Mobile menu supports focus containment and Escape.
- Robot: scroll-only complete overview orbit, existing verified component focus, final full assembly and centered 6901 illumination. No camera drag, zoom, or keyboard controls. No substitute photo while loading. A short reveal of the actual sword logo dismisses independently of model download.
- Motion: deliberate 500–700ms entrances, 180–240ms interaction feedback, reversible scroll progress. Pause offscreen and honor reduced motion. Never hide essential content until an animation succeeds.
- Recruitment: real workshop images, clear roles, direct contact action.
- Sponsors: equal neutral presentation. No sponsor receives a branded purple background that implies preference.
- Refinement: preserve the cinematic portfolio layout (variance 7, motion 6, density 4). The stationary wordmark arrives with a brief fade. Let the typography-over-robot composition supply depth, without additional animated background objects. Sponsor logos reveal their original colors on an equal silver surface on hover and keyboard focus; touch devices get the full-color version by default. Student roles use native expandable descriptions, not decorative buttons.
- Hero typography responds to viewport height as well as width, with title and introduction in separate grid rows. Invisible exhibit captions never intercept navigation. Reduced motion leaves the title and role descriptions static, and removes orbital tracking.
- Keep the hero clean: the user rejected moving letters, the purple text shimmer, the triangle, and the machined loop as visual clutter. No replacement decorative loop or pause control. Preserve the oversized title over Lancelot, purple headline emphasis, and the scroll-driven robot story. The loader reveals the actual SwordLogo.png through a soft mask, with no approximate drawing or shape swap.
- Footer: oversized KnightFall signature, complete navigation, location, and Instagram.

## Do’s and Don’ts

Keep existing records, assets, routes, form, gallery, and season interactions. Add no unverified robot specifications, results, or testimonials. Make copy sound like students who build robots, not marketing boilerplate. Avoid em dashes. Never trade mobile legibility or the working model for an ornamental effect. Keep the site usable with failed WebGL, reduced motion, and slow connections.

## Sponsor artwork provenance

Color versions added on 2026-09-05, with all original assets retained: [Boeing blue artwork](https://www.boeing.com/content/dam/boeing/v2/common/boeing-logo-blue.png) and the inline color logo from [Leidos's official homepage](https://www.leidos.com). Dallas College and Raising Cane's use the existing full-color files. No sponsor colors were guessed or generated.
