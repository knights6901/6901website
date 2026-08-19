# 004 - Build the scroll-controlled robot story

- **Status**: TODO
- **Commit**: 4ca9cb1
- **Severity**: HIGH
- **Category**: Explanation, scroll-driven motion, accessibility
- **Estimated scope**: homepage, homepage CSS/JS, one model asset

## Problem

The homepage currently presents only atmospheric text and glow. It does not demonstrate the robot, which the user confirmed is the homepage's first priority. The user supplied `Lancelot.glb` for a real 360-degree experience.

## Target

- Use one sticky homepage stage approximately 360-420 viewport heights tall.
- Keep a real `<model-viewer>` instance pinned within a `min-height: 100dvh` viewport.
- Map the local section progress from 0 to 1 directly to `turntableRotation` from 0 to `2 * Math.PI`; scrolling backward must rotate backward with no restart or direction mismatch.
- Schedule scroll work through one passive listener plus one `requestAnimationFrame` update. Do not update React state or run a perpetual loop.
- Reveal a maximum of four factual process chapters at section progress thresholds. Transitions use opacity and at most 16px movement for 240ms with `--ease-out`.
- Show a real photo poster before the GLB loads and retain all explanatory content as semantic HTML outside the canvas.
- Under reduced motion, disable scroll rotation, show a static three-quarter view, and keep all chapter content readable in normal document flow.

## Repo conventions to follow

- Homepage files are `src/pages/index.astro`, `public/css/index.css`, and `public/js/index.js`.
- Purple and black remain the only brand palette.
- The eventual web model lives at `public/models/lancelot.glb`; the original user file remains untouched.

## Steps

1. Optimize the supplied GLB and validate its header and declared byte length.
2. Add `@google/model-viewer` through the existing Astro build and render one accessible custom element with a descriptive `alt` value and photo poster.
3. Recompose the homepage around the sticky robot stage, then student recruitment, then current sponsors.
4. Implement local scroll progress with a passive listener and rAF coalescing; write only `turntableRotation`, progress-bar `transform`, and discrete chapter state.
5. Add loading, no-JavaScript, no-WebGL, and reduced-motion fallbacks.

## Boundaries

- Do not invent robot specifications or mechanism claims.
- Do not put essential text inside the WebGL canvas.
- Do not load a second 3D engine or a second copy of the model.
- Do not auto-rotate when the user is not scrolling.

## Verification

- **Mechanical**: run `npm run build` and expect exit code 0. Validate the output GLB header is `glTF`, version is 2, and its declared length equals its file length.
- **Feel check**: scroll forward and backward slowly. The robot must follow the scrollbar 1:1, never jump, and never continue moving after scroll stops. Inspect at 10% playback and confirm chapter transitions do not double-expose.
- Test desktop, touch scrolling, reduced motion, disabled JavaScript, slow network, and failed model loading.
- **Done when**: the robot is the unmistakable first subject, rotation is locally scroll-controlled and reversible, and every visitor can still understand the page without WebGL.
