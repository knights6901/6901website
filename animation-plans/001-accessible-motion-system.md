# 001 - Establish one accessible motion system

- **Status**: TODO
- **Commit**: 4ca9cb1
- **Severity**: HIGH
- **Category**: Accessibility, easing, duration, cohesion
- **Estimated scope**: 3 shared files plus page-level overrides

## Problem

The project has strong easing tokens but no site-wide reduced-motion or reduced-transparency behavior. Generic reveal classes also use long 600-700ms movement on nearly every section.

```css
/* public/css/main.css:247 - current */
.reveal {
  opacity: 0;
  transform: translateY(36px);
  transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
}
```

The timeline dot also begins at `scale(0)`, which violates physical continuity.

```css
/* public/css/team.css:144 - current */
@keyframes dotPop {
  from { transform: scale(0); box-shadow: 0 0 0 0 var(--purple-glow); }
  to   { transform: scale(1); box-shadow: 0 0 12px 2px rgba(123,31,162,0.45); }
}
```

## Target

- Keep the existing `--ease-out` token and add `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` and `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`.
- Reduce ordinary reveal travel to 16-24px and use 450-550ms only for rare marketing entrances.
- Replace all `scale(0)` entrances with `scale(0.95)` plus opacity.
- Under `prefers-reduced-motion: reduce`, remove position, scale, parallax, tilt, and scroll-scrub movement while retaining 200ms opacity and color feedback.
- Under `prefers-reduced-transparency: reduce`, replace blurred translucent surfaces with near-solid graphite.
- Gate hover movement behind `@media (hover: hover) and (pointer: fine)`.

## Repo conventions to follow

- Motion tokens live in `:root` in `public/css/main.css`.
- Existing strong ease-out: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`.
- Existing IntersectionObserver in `public/js/main.js:64-80` should remain the visibility trigger.

## Steps

1. Consolidate motion curves and durations in `public/css/main.css`.
2. Tighten shared reveal movement and eliminate arbitrary delay classes where sequence does not explain content.
3. Add reduced-motion, reduced-transparency, contrast, and hover-capability media queries.
4. Update page styles so every positional animation degrades to opacity or a static state.
5. Replace the timeline's `scale(0)` keyframe with a visible initial form.

## Boundaries

- Do not remove useful focus, color, or opacity feedback.
- Do not add a second animation library for predetermined CSS transitions.
- Do not alter factual copy or routes.

## Verification

- **Mechanical**: run `npm run build` and expect exit code 0.
- **Feel check**: inspect the homepage, mobile menu, timeline, and gallery at normal speed and 10% DevTools playback. Confirm content begins visibly, no element appears from nothing, and section entrances do not delay reading.
- Toggle reduced motion and confirm large movement stops while focus, opacity, and color feedback remain.
- Toggle reduced transparency and confirm navigation remains legible without blur.
- **Done when**: every animated page has an explicit accessible fallback and no `scale(0)` entrance remains.

