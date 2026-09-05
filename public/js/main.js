/* KnightFall shared interaction layer. */

/* Site theme follows the system until the visitor chooses a preference. */
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    toggle?.setAttribute('aria-label', `Use ${nextTheme} mode`);
    toggle?.setAttribute('title', `Use ${nextTheme} mode`);
    themeColor?.setAttribute('content', theme === 'light' ? '#eeedf1' : '#0b0b0e');
  }

  applyTheme(root.dataset.theme || (systemTheme.matches ? 'light' : 'dark'));
  toggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('knightfall-theme', theme); } catch { /* Theme still works for this visit. */ }
    applyTheme(theme);
  });
  systemTheme.addEventListener('change', (event) => {
    try {
      if (!localStorage.getItem('knightfall-theme')) applyTheme(event.matches ? 'light' : 'dark');
    } catch { applyTheme(event.matches ? 'light' : 'dark'); }
  });
})();

/* A quiet, one-time arrival gives each editorial page a shared stage. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  requestAnimationFrame(() => document.body.classList.add('page-enter'));
})();

/* Sticky header state without a continuous scroll listener. */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const sentinel = document.createElement('span');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:40px;width:1px;height:1px;pointer-events:none';
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  });
  observer.observe(sentinel);
})();

/* Mobile navigation with keyboard and focus handling. */
(function () {
  const button = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!button || !menu) return;

  function setOpen(open) {
    button.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menu.setAttribute('aria-hidden', String(!open));
    menu.inert = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.querySelector('a')?.focus();
    }
  }

  button.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (event) => {
    if (event.matches && menu.classList.contains('open')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('open')) return;

    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
      return;
    }

    if (event.key !== 'Tab') return;
    const controls = [button, ...menu.querySelectorAll('a')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
})();

/* One-time content reveals; content remains visible when JavaScript is absent. */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.t-item', '.o-card', '.sp-card', '.pkg', '.stat'
  ];
  const elements = document.querySelectorAll(selectors.join(','));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.documentElement.classList.add('motion-ready');
  elements.forEach((element) => observer.observe(element));
})();

/* Current-page navigation state. */
(function () {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const hash = window.location.hash;
  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach((link) => {
    const destination = new URL(link.href, window.location.href);
    const destinationPath = destination.pathname.replace(/\/$/, '') || '/';
    const isCurrentPage = !destination.hash && destinationPath === path;
    const isCurrentSection = Boolean(hash) && destinationPath === path && destination.hash === hash;
    if (isCurrentPage || isCurrentSection) {
      link.classList.add('active');
      link.setAttribute('aria-current', isCurrentSection ? 'location' : 'page');
    }
  });
})();
