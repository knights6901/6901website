/* =============================================
   PICTURES PAGE JS
   ============================================= */

/* ── GALLERY DATA ──────────────────────────── */
const PHOTOS = [
  { src: '/images/photo_gallery/IMG_3660.avif',   alt: '2023 leads getting ready to play',      label: '2023 — Match Day',       year: '2023' },
  { src: '/images/photo_gallery/IMG_3653.avif',   alt: '2023 Robot in pit',                     label: '2023 — Robot in Pit',    year: '2023' },
  { src: '/images/photo_gallery/IMG_3664.avif',   alt: '2023 Pit Crew working hard',            label: '2023 — Pit Crew',        year: '2023' },
  { src: '/images/photo_gallery/IMG_3665.avif',   alt: '2023 Pit Crew working hard 2',          label: '2023 — Pit Crew',        year: '2023' },
  { src: '/images/photo_gallery/IMG_3670.avif',   alt: '2023 Seniors getting ready',            label: '2023 — Seniors',         year: '2023' },
  { src: '/images/photo_gallery/IMG_3681.avif',   alt: '2023 Inside of pit crew angle',         label: '2023 — Pit View',        year: '2023' },
  { src: '/images/photo_gallery/IMG_3685.avif',   alt: '2023 Pit crew top view',                label: '2023 — Top View',        year: '2023' },
  { src: '/images/photo_gallery/senoirs2023.webp',alt: '2023 Senior picture with awards',       label: '2023 — Senior Awards',   year: '2023' },
  { src: '/images/photo_gallery/IMG_4566.avif',   alt: '2023 Scouts planning strategy',         label: '2023 — Scouting',        year: '2023' },
  { src: '/images/photo_gallery/IMG_4571.avif',   alt: '2023 Scouts talking strategy',          label: '2023 — Strategy',        year: '2023' },
  { src: '/images/photo_gallery/2018matchday.avif',            alt: '2018 Team before match',   label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2018pitcrew.avif',             alt: '2018 Pit crew',            label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2018pitcrew2.avif',            alt: '2018 Pit crew 2',          label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2018pitcrew3.avif',            alt: '2018 Pit crew 3',          label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2018robot.avif',               alt: '2018 Power Up Robot',      label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2018teampic.avif',             alt: '2018 Team Picture',        label: '2018 — Power Up',        year: 'history' },
  { src: '/images/photo_gallery/2019 DEEP SPACE.avif',         alt: '2019 Team Picture',        label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019field.avif',               alt: '2019 Field view',          label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019match.avif',               alt: '2019 During match view',   label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019match2.avif',              alt: '2019 Before match view',   label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019robot.avif',               alt: '2019 Deep Space robot',    label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019robot2.avif',              alt: '2019 Deep Space robot 2',  label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019robot3.avif',              alt: '2019 Deep Space robot 3',  label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019strat.avif',               alt: '2019 Strategy meeting',    label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019team.avif',                alt: '2019 Team Picture',        label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2019team2.avif',               alt: '2019 Team Picture 2',      label: '2019 — Deep Space',      year: 'history' },
  { src: '/images/photo_gallery/2020 INFINITE RECHARGE.webp',  alt: '2020 Field',               label: '2020 — Infinite Recharge', year: 'history' },
  { src: '/images/photo_gallery/2021 VIRTUAL CHALLENGE.webp',  alt: 'Virtual Challenge',        label: '2021 — Virtual Challenge', year: 'history' },
  { src: '/images/photo_gallery/IMG_2295.avif',                alt: '2026 Pit Crew front view', label: '2026 — Pit Crew',          year: '2026' },
  { src: '/images/photo_gallery/IMG_2293.avif',   alt: '2026 Competition field side view',      label: '2026 — Competition Field', year: '2026' },
  { src: '/images/photo_gallery/web/IMG_2358.webp',   alt: '2026 Robot shooting in field',          label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/web/match.webp',      alt: '2026 Team announced during match',      label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/match2.avif',                  alt: '2026 Drive team',          label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/web/pitcrew.webp',    alt: '2026 Pit crew working hard',            label: '2026 — Pit Crew',           year: '2026' },
  { src: '/images/photo_gallery/programming.avif',alt: '2026 Programming team in pit',          label: '2026 — Pit crew',           year: '2026' },
  { src: '/images/photo_gallery/robot.avif',      alt: '2026 Robot shooting in field 2',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/robotfield.avif', alt: '2026 Robot shooting in field 3',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/robotled.avif',   alt: '2026 Robot with leds',                  label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match.avif',  alt: '2026 Team announced during match',      label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/web/2026match2.webp', alt: '2026 Robot shooting in field 4',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match3.avif', alt: '2026 Robot in field',                   label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match4.avif', alt: '2026 Robot in field 2',                 label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026pitcrew.avif',alt: '2026 pit crew working hard 2',          label: '2026 — Pit Crew',           year: '2026' },
  { src: '/images/photo_gallery/2026semispirit.avif',         alt: '2026 Waving team flag',     label: '2026 — Team Spirit',        year: '2026' },
  { src: '/images/photo_gallery/2026teampic.avif',            alt: '2026 Team Picture',         label: '2026 — Team',               year: '2026' },
  { src: '/images/photo_gallery/award.webp',      alt: '2025 Rising allstar award',             label: '2025 — Team Award',         year: '2025' },
  { src: '/images/photo_gallery/compfield.webp',  alt: '2025 Competition field side view',      label: '2025 — Competition Field',  year: '2025' },
  { src: '/images/photo_gallery/robot.webp',      alt: '2025 Robot on match field',             label: '2025 — Match Day',          year: '2025' },
  { src: '/images/photo_gallery/robot2.webp',     alt: '2025 Robot before match',               label: '2025 — Match Day',          year: '2025' },
  { src: '/images/photo_gallery/robot3.webp',     alt: '2025 Robot before match 2',             label: '2025 — Match Day',          year: '2025' },
  { src: '/images/photo_gallery/robot4.webp',     alt: '2025 Robot on match field',             label: '2025 — Match Day',          year: '2025' },
  { src: '/images/photo_gallery/team.webp',       alt: '2025 Team with robot',                  label: '2025 — Team',               year: '2025' },
  { src: '/images/photo_gallery/team2.webp',      alt: '2025 Team picture',                     label: '2025 — Team',               year: '2025' },
  { src: '/images/photo_gallery/cheering2024.avif',           alt: '2024 Team cheering',        label: '2024 — Team Spirit',        year: '2024' },
  { src: '/images/photo_gallery/driveteam2024.avif',          alt: '2024 Drive Team',           label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/pitcrew2024.avif',            alt: '2024 Pit crew side view',   label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/robot_2_2024.avif',           alt: '2024 Robot in field',       label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/robot_4_2024.avif',           alt: '2024 Robot in field 3',     label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/driveteam_2_2024.avif',       alt: '2024 Drive Team 2',         label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/teampic2024.avif',            alt: '2024 Team picture',         label: '2024 — Team',               year: '2024' },
  { src: '/images/photo_gallery/2024driveteam.avif',          alt: '2024 Drive Team',           label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/2024driveteam2.avif',         alt: '2024 Drive Team 3',         label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/2024driveteam3.avif',         alt: '2024 Drive Team 4',         label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/2024pitcrew.avif',            alt: '2024 Pit crew side view 2', label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/2024pitcrew2.avif',           alt: '2024 Pit crew side view 3', label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/2024pitcrew3.avif',           alt: '2024 Pit crew side view 4', label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/2024pitcrew4.avif',           alt: '2024 Pit crew side view 5', label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/2024robot.avif',              alt: '2024 Robot in field',       label: '2024 — Match Day',          year: '2024' },
  { src: '/images/photo_gallery/2024spirit.avif',             alt: '2024 Team cheering 2',        label: '2024 — Team Spirit',        year: '2024' },
  { src: '/images/photo_gallery/2024pitcrew5.avif',           alt: '2024 Pit crew up close',    label: '2024 — Pit Crew',           year: '2024' },
  { src: '/images/photo_gallery/2024team.avif',               alt: '2024 Team picture 2',       label: '2024 — Team',               year: '2024' },

];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeGridAnimations = new Map();

/* ── BUILD GALLERY ─────────────────────────── */
(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  PHOTOS.forEach((p, i) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'g-item';
    item.dataset.year = p.year;
    item.dataset.idx  = i;
    item.setAttribute('aria-label', `View photo: ${p.label}`);

    const image = document.createElement('img');
    image.src = p.src;
    image.alt = p.alt;
    image.loading = 'lazy';
    image.decoding = 'async';

    const overlay = document.createElement('span');
    overlay.className = 'g-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'g-label';
    label.textContent = p.label;
    overlay.append(label);
    item.append(image, overlay);
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        revealGridItem(entry.target, index);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  grid.querySelectorAll('.g-item').forEach(el => io.observe(el));
})();

/* ── FILTER ────────────────────────────────── */
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const galleryStatus = document.getElementById('gallery-status');

function trackGridAnimation(item, animation) {
  activeGridAnimations.set(item, animation);
  animation.finished.catch(() => {}).finally(() => {
    if (activeGridAnimations.get(item) === animation) activeGridAnimations.delete(item);
  });
}

function revealGridItem(item, order = 0) {
  item.classList.add('is-entered');
  if (reducedMotion.matches) return;

  const animation = item.animate(
    [
      { opacity: 0, transform: 'translateY(12px) scale(0.992)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ],
    {
      duration: 360,
      delay: Math.min(order * 28, 84),
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'backwards',
    },
  );
  trackGridAnimation(item, animation);
}

function captureGridPositions(items) {
  activeGridAnimations.forEach(animation => {
    try { animation.commitStyles(); } catch (_) { /* Older browsers can skip freezing. */ }
  });

  const positions = new Map();
  items.forEach(item => {
    if (!item.classList.contains('hidden')) {
      positions.set(item, {
        rect: item.getBoundingClientRect(),
        opacity: getComputedStyle(item).opacity,
      });
    }
  });

  activeGridAnimations.forEach(animation => animation.cancel());
  activeGridAnimations.clear();
  items.forEach(item => {
    item.style.removeProperty('opacity');
    item.style.removeProperty('transform');
  });
  return positions;
}

function animateFilteredGrid(items, previousPositions) {
  if (!previousPositions || reducedMotion.matches) return;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let enteringOrder = 0;

  items.forEach(item => {
    if (item.classList.contains('hidden') || !item.classList.contains('is-entered')) return;
    const next = item.getBoundingClientRect();
    if (next.bottom < -160 || next.top > viewportHeight + 160) return;

    const previous = previousPositions.get(item);
    let keyframes;
    let delay = 0;
    if (previous) {
      const deltaX = previous.rect.left - next.left;
      const deltaY = previous.rect.top - next.top;
      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;
      keyframes = [
        { opacity: previous.opacity, transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ];
    } else {
      keyframes = [
        { opacity: 0, transform: 'translate3d(0, 10px, 0) scale(0.99)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
      ];
      delay = Math.min(enteringOrder * 20, 80);
      enteringOrder += 1;
    }

    const animation = item.animate(keyframes, {
      duration: 280,
      delay,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'backwards',
    });
    trackGridAnimation(item, animation);
  });
}

function filterGallery(year, btn, shouldAnimate = true) {
  const items = [...document.querySelectorAll('.g-item')];
  const previousPositions = shouldAnimate && !reducedMotion.matches
    ? captureGridPositions(items)
    : null;

  filterButtons.forEach(b => {
    b.classList.toggle('active', b === btn);
    b.setAttribute('aria-pressed', String(b === btn));
  });
  btn.classList.add('active');

  let visibleCount = 0;
  items.forEach(item => {
    const match = year === 'all' || item.dataset.year === year;
    item.classList.toggle('hidden', !match);
    item.setAttribute('aria-hidden', String(!match));
    if (match) visibleCount += 1;
  });

  animateFilteredGrid(items, previousPositions);
  buildVisible(year);
  if (galleryStatus) galleryStatus.textContent = `${visibleCount} photos shown.`;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => filterGallery(button.dataset.year, button));
});

/* ── LIGHTBOX ──────────────────────────────── */
let visiblePhotos = [...PHOTOS];
let currentIdx = 0;
let lastFocusedElement = null;
let activeImageAnimation = null;
let activeMetaAnimations = [];
let imageRequestId = 0;
let bodyOverflow = '';
let isFirstLightboxImage = true;

function buildVisible(selectedYear) {
  const active = document.querySelector('.filter-btn.active');
  const year = selectedYear || (active ? active.dataset.year : 'all');
  visiblePhotos = year === 'all'
    ? [...PHOTOS]
    : PHOTOS.filter(p => p.year === year);
}

function openLightbox(globalIdx) {
  buildVisible();
  const photo = PHOTOS[globalIdx];
  currentIdx = visiblePhotos.indexOf(photo);
  if (currentIdx < 0) currentIdx = 0;
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  bodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  isFirstLightboxImage = true;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  showPhoto(currentIdx);
  requestAnimationFrame(() => lightbox.querySelector('.lb-close')?.focus());
}

function animateImage(img, direction, isOpening) {
  if (reducedMotion.matches) {
    if (activeImageAnimation) activeImageAnimation.cancel();
    activeImageAnimation = null;
    return;
  }

  const wasAnimating = Boolean(activeImageAnimation);
  const computed = getComputedStyle(img);
  const fromOpacity = wasAnimating ? computed.opacity : (isOpening ? 0 : 0.68);
  const fromTransform = wasAnimating && computed.transform !== 'none'
    ? computed.transform
    : isOpening
      ? 'scale(0.975)'
      : `translate3d(${direction * 12}px, 0, 0) scale(0.992)`;
  if (activeImageAnimation) activeImageAnimation.cancel();
  const animation = img.animate(
    [
      { opacity: fromOpacity, transform: fromTransform },
      { opacity: 1, transform: 'scale(1)' },
    ],
    { duration: isOpening ? 260 : 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'none' },
  );
  activeImageAnimation = animation;
  animation.finished.catch(() => {}).finally(() => {
    if (activeImageAnimation === animation) activeImageAnimation = null;
  });
}

function animateLightboxMeta() {
  activeMetaAnimations.forEach(animation => animation.cancel());
  activeMetaAnimations = [];
  if (reducedMotion.matches) return;

  ['lb-caption', 'lb-count'].forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    const animation = element.animate(
      [
        { opacity: 0.42, transform: 'translate(-50%, 4px)' },
        { opacity: 1, transform: 'translate(-50%, 0)' },
      ],
      { duration: 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'none' },
    );
    activeMetaAnimations.push(animation);
  });
}

function showPhoto(i, direction = 0) {
  const p = visiblePhotos[i];
  if (!p) return;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  const cnt = document.getElementById('lb-count');
  if (!img || !cap || !cnt) return;

  currentIdx = i;
  cap.textContent = p.label;
  cnt.textContent = `${i + 1} / ${visiblePhotos.length}`;
  if (direction) animateLightboxMeta();
  const requestId = ++imageRequestId;
  const applyPhoto = () => {
    if (requestId !== imageRequestId) return;
    img.src = p.src;
    img.alt = p.alt;
    animateImage(img, direction, isFirstLightboxImage);
    isFirstLightboxImage = false;
  };

  if (img.src.endsWith(p.src)) {
    applyPhoto();
    return;
  }

  const preload = new Image();
  preload.onload = applyPhoto;
  preload.onerror = applyPhoto;
  preload.src = p.src;
}

function navLightbox(dir) {
  let next = currentIdx + dir;
  if (next < 0) next = visiblePhotos.length - 1;
  if (next >= visiblePhotos.length) next = 0;
  showPhoto(next, dir);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (activeImageAnimation) activeImageAnimation.cancel();
  activeImageAnimation = null;
  activeMetaAnimations.forEach(animation => animation.cancel());
  activeMetaAnimations = [];
  imageRequestId += 1;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = bodyOverflow;
  lastFocusedElement?.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lb.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev')?.addEventListener('click', () => navLightbox(-1));
  lb.querySelector('.lb-next')?.addEventListener('click', () => navLightbox(1));
});

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); navLightbox(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); navLightbox(1); }
  if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
  if (e.key !== 'Tab') return;

  const focusable = [...lb.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter(element => element instanceof HTMLElement && !element.hidden);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

const initialFilter = document.querySelector('.filter-btn.active');
if (initialFilter) filterGallery(initialFilter.dataset.year, initialFilter, false);
