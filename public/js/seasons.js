/* One-time archive reveals, kept separate from the Team page interactions. */
(function () {
  const page = document.querySelector('.seasons-page');
  const entries = page?.querySelectorAll('.season-entry');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!page || !entries?.length || reduceMotion || !('IntersectionObserver' in window)) {
    entries?.forEach((entry) => entry.classList.add('visible'));
    return;
  }

  page.classList.add('season-motion');
  const observer = new IntersectionObserver((observations) => {
    observations.forEach((observation) => {
      if (!observation.isIntersecting) return;
      observation.target.classList.add('visible');
      observer.unobserve(observation.target);
    });
  }, { threshold: 0.14 });

  entries.forEach((entry) => observer.observe(entry));
})();
