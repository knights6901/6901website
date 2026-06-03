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
  { src: '/images/photo_gallery/IMG_2358.avif',   alt: '2026 Robot shooting in field',          label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/match.avif',      alt: '2026 Team announced during match',      label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/match2.avif',                  alt: '2026 Drive team',          label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/pitcrew.avif',    alt: '2026 Pit crew working hard',            label: '2026 — Pit Crew',           year: '2026' },
  { src: '/images/photo_gallery/programming.avif',alt: '2026 Programming team in pit',          label: '2026 — Pit crew',           year: '2026' },
  { src: '/images/photo_gallery/robot.avif',      alt: '2026 Robot shooting in field 2',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/robotfield.avif', alt: '2026 Robot shooting in field 3',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/robotled.avif',   alt: '2026 Robot with leds',                  label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match.avif',  alt: '2026 Team announced during match',      label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match2.avif', alt: '2026 Robot shooting in field 4',        label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match3.avif', alt: '2026 Robot in field',                   label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026match4.avif', alt: '2026 Robot in field 2',                 label: '2026 — Match Day',          year: '2026' },
  { src: '/images/photo_gallery/2026pitcrew.avif',alt: '2026 pit crew working hard 2',          label: '2026 — Pit Crew',           year: '2026' },
  { src: '/images/photo_gallery/2026semispirit.avif',         alt: '2026 Waving team flag',     label: '2026 — Team Spirit',        year: '2026' },
  { src: '/images/photo_gallery/2026teampic.avif',            alt: '2026 Team Picture',         label: '2026 — Rebuilt',            year: '2026' },
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

/* ── BUILD GALLERY ─────────────────────────── */
(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  PHOTOS.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'g-item reveal';
    item.dataset.year = p.year;
    item.dataset.idx  = i;
    item.innerHTML = `
      <img src="${p.src}" alt="${p.alt}" loading="lazy">
      <div class="g-overlay">
        <div class="g-label">${p.label}</div>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });

  // trigger reveal observer on newly created items
  setTimeout(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    grid.querySelectorAll('.g-item').forEach(el => io.observe(el));
  }, 50);
})();

/* ── FILTER ────────────────────────────────── */
window.filterGallery = function (year, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.g-item').forEach(item => {
    const match = year === 'all' || item.dataset.year === year;
    item.classList.toggle('hidden', !match);
  });

  // rebuild visible list for lightbox
  buildVisible();
};

/* ── LIGHTBOX ──────────────────────────────── */
let visiblePhotos = [...PHOTOS];
let currentIdx = 0;

function buildVisible() {
  const active = document.querySelector('.filter-btn.active');
  const year = active ? active.dataset.year : 'all';
  visiblePhotos = year === 'all'
    ? [...PHOTOS]
    : PHOTOS.filter(p => p.year === year);
}

function openLightbox(globalIdx) {
  buildVisible();
  const photo = PHOTOS[globalIdx];
  currentIdx = visiblePhotos.indexOf(photo);
  if (currentIdx < 0) currentIdx = 0;
  showPhoto(currentIdx);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showPhoto(i) {
  const p = visiblePhotos[i];
  if (!p) return;
  const img = document.getElementById('lb-img');
  const cap = document.getElementById('lb-caption');
  const cnt = document.getElementById('lb-count');
  img.style.opacity = '0';
  img.style.transform = 'scale(0.97)';
  setTimeout(() => {
    img.src = p.src;
    img.alt = p.alt;
    cap.textContent = p.label;
    cnt.textContent = (i + 1) + ' / ' + visiblePhotos.length;
    img.style.opacity = '';
    img.style.transform = '';
  }, 150);
  img.style.transition = 'opacity 0.25s, transform 0.25s';
  currentIdx = i;
}

window.navLightbox = function (dir) {
  let next = currentIdx + dir;
  if (next < 0) next = visiblePhotos.length - 1;
  if (next >= visiblePhotos.length) next = 0;
  showPhoto(next);
};

window.closeLightbox = function () {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
};

document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
});

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  navLightbox(-1);
  if (e.key === 'ArrowRight') navLightbox(1);
  if (e.key === 'Escape')     closeLightbox();
});
