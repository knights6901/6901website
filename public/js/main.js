/* =============================================
   KNIGHTS ROBOTICS 6901 — SHARED JS
   ============================================= */

/* ── CURSOR ────────────────────────────────── */
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Use transform instead of left/top — avoids layout reflow and lets the
  // ring's CSS transition run on the compositor thread (smooth even when the
  // main thread is busy, e.g. canvas animation on the home page).
  document.addEventListener('mousemove', e => {
    const t = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    dot.style.transform  = t;
    ring.style.transform = t;
  });

  document.querySelectorAll('a, button, .g-item, .sp-card, .stat, .pkg').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // hide on mobile
  if ('ontouchstart' in window) {
    dot.style.display = ring.style.display = 'none';
  }
})();

/* ── STICKY HEADER ─────────────────────────── */
(function () {
  const hdr = document.querySelector('.site-header');
  if (!hdr) return;
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── HAMBURGER / MOBILE MENU ───────────────── */
(function () {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL ─────────────────────────── */
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  const selectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-scale',
    '.t-item', '.o-card', '.sp-card', '.pkg', '.stat'
  ];
  document.querySelectorAll(selectors.join(',')).forEach(el => io.observe(el));
})();

/* ── PAGE TRANSITION ───────────────────────── */
(function () {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // leaving animation on internal nav clicks
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      a.target === '_blank'
    ) return;

    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => {
        window.location.href = href;
      }, 480);
    });
  });

  // entering animation on load
  overlay.classList.add('leaving');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('leaving');
  }, { once: true });
})();

/* ── ACTIVE NAV LINK ───────────────────────── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(a => {
    const ahref = a.getAttribute('href') || '';
    const afile = ahref.split('/').pop().split('#')[0];
    if (afile === path || (path === '' && afile === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
