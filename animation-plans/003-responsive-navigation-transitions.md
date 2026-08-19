# 003 - Make navigation transitions responsive

- **Status**: TODO
- **Commit**: 4ca9cb1
- **Severity**: MEDIUM
- **Category**: Interruptibility, duration, spatial consistency
- **Estimated scope**: 2 files

## Problem

Every internal navigation click is blocked for 480ms while a purple keyframe overlay runs. The transition restarts from a fixed keyframe and makes normal navigation feel slower.

```js
/* public/js/main.js:99 - current */
a.addEventListener('click', e => {
  e.preventDefault();
  overlay.classList.add('entering');
  setTimeout(() => {
    window.location.href = href;
  }, 480);
});
```

## Target

- Prefer the browser View Transition API when available, with no artificial wait before navigation.
- When it is unavailable, navigate normally rather than blocking the click with a timer.
- Keep the mobile menu transition interruptible with `opacity` and `transform` at 240ms using `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`.
- Enter and exit along the same spatial path.

## Repo conventions to follow

- Shared navigation behavior lives in `public/js/main.js`.
- Shared navigation material and transition styles live in `public/css/main.css`.

## Steps

1. Remove the injected `.page-transition` overlay and click-delay timer.
2. Add progressive View Transition styling only where supported by Astro and the browser.
3. Tighten the mobile menu to a 240ms interruptible transition and preserve the current top-origin spatial relationship.
4. Keep reduced-motion behavior as a short crossfade.

## Boundaries

- Do not change route URLs or navigation labels.
- Do not delay navigation for decorative motion.
- Do not require JavaScript for links to function.

## Verification

- **Mechanical**: run `npm run build` and expect exit code 0.
- **Feel check**: rapidly open and close the mobile menu and confirm it reverses from its current position. Follow internal links and confirm navigation begins immediately.
- Test with reduced motion and confirm the mobile menu uses a short opacity transition without translation.
- **Done when**: no navigation `setTimeout` remains and all links work without the animation script.

