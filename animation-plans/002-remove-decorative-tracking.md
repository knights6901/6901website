# 002 - Remove high-frequency decorative tracking

- **Status**: TODO
- **Commit**: 4ca9cb1
- **Severity**: HIGH
- **Category**: Purpose, frequency, performance, physicality
- **Estimated scope**: 3 files

## Problem

The custom cursor updates on every mousemove and changes layout-sized properties. Package and sponsor cards also map pointer position directly to rotation without spring interpolation or input gating.

```js
/* public/js/main.js:17 - current */
document.addEventListener('mousemove', e => {
  const t = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  dot.style.transform  = t;
  ring.style.transform = t;
});
```

```js
/* public/js/team.js:25 - current */
card.addEventListener('mousemove', e => {
  // ...
  card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
});
```

## Target

- Remove the site-wide custom cursor. Pointer shape is a familiar, high-frequency platform affordance and should remain native.
- Remove raw mouse-tracking tilt from functional sponsor and sponsorship elements.
- Give pressable elements immediate `:active { transform: scale(0.97) }` feedback with `transition: transform 160ms var(--ease-out)`.
- Keep hover state changes under 250ms and gate movement behind `@media (hover: hover) and (pointer: fine)`.

## Repo conventions to follow

- Shared button styles live in `public/css/main.css:205-244`.
- Purple remains the single interaction accent.
- Functional cards should use tone, border, and small elevation changes instead of pointer-following rotation.

## Steps

1. Delete cursor creation and tracking from `public/js/main.js` and its CSS from `public/css/main.css`.
2. Delete direct package and sponsor tilt listeners from `public/js/team.js`.
3. Add shared 160ms press feedback to buttons, links styled as buttons, gallery filters, and icon controls.
4. Gate remaining hover transforms to fine pointers.

## Boundaries

- Do not replace the cursor with another custom cursor implementation.
- Do not add magnetic buttons globally.
- Do not remove visible focus styles.

## Verification

- **Mechanical**: run `npm run build` and expect exit code 0.
- **Feel check**: move the pointer across the site and confirm the native cursor remains stable. Press buttons with mouse and touch; feedback begins on pointer-down and releases quickly.
- Confirm functional cards do not wobble under pointer movement.
- **Done when**: no document-level mousemove handler or card-tilt handler remains, and press feedback is consistent.

