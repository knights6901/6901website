/* Homepage motion: sword signature handoff and slight scroll-linked photo offsets. */
(function () {
  const loader = document.getElementById('site-loader');
  const closing = document.querySelector('.closing-photo');
  const closingImage = document.getElementById('closing-image');
  const joinWorktable = document.querySelector('.join-worktable');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  let closingVisible = false;
  let joinVisible = false;
  let frame = 0;

  // Let the sword finish drawing, then reveal the title.
  window.setTimeout(() => {
    if (loader) {
      loader.classList.add('is-ready');
      loader.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.add('hero-live');
  }, 1750);

  function update() {
    frame = 0;
    if (document.hidden || (!closingVisible && !joinVisible)) return;
    // Read layout before style updates, once per visible photo composition.
    const joinRect = joinVisible && joinWorktable ? joinWorktable.getBoundingClientRect() : null;
    const closingRect = closingVisible && closing ? closing.getBoundingClientRect() : null;

    if (!reduceMotion.matches) {
      if (joinRect) {
        const depth = clamp((window.innerHeight - joinRect.top) / (window.innerHeight + joinRect.height));
        joinWorktable.style.setProperty('--main-photo-y', `${(0.5 - depth) * 1.6}rem`);
        joinWorktable.style.setProperty('--build-photo-y', `${(0.5 - depth) * 3.2}rem`);
      }
    }

    if (closingRect && closingImage) {
      if (reduceMotion.matches) {
        closingImage.style.transform = 'none';
      } else {
        const progress = clamp((window.innerHeight - closingRect.top) / (window.innerHeight + closingRect.height));
        closingImage.style.transform = `translate3d(0, ${(0.5 - progress) * 4}%, 0) scale(1.04)`;
      }
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === closing) closingVisible = entry.isIntersecting;
      if (entry.target === joinWorktable) joinVisible = entry.isIntersecting;
    });
    if (closingVisible || joinVisible) schedule();
  }, { rootMargin: '75% 0px' });

  if (closing) observer.observe(closing);
  if (joinWorktable) observer.observe(joinWorktable);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reduceMotion.addEventListener('change', schedule);
})();
