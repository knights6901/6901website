/* =============================================
   INDEX PAGE JS
   ============================================= */

/* ── PARTICLE CANVAS ───────────────────────── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 55;
  const PURPLE = [123, 31, 162];

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.45 + 0.1,
      life: Math.random() * 200 + 80,
      age: 0
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(mkParticle());

  let mouseX = -9999, mouseY = -9999;
  canvas.closest('.hero')?.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age++;
      if (p.age > p.life) { particles[i] = mkParticle(); continue; }

      // repel from mouse
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.vx += dx / dist * 0.04;
        p.vy += dy / dist * 0.04;
      }

      p.vx *= 0.99; p.vy *= 0.99;
      p.x += p.vx; p.y += p.vy;

      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      // fade in/out
      const fadeLen = 30;
      let a = p.alpha;
      if (p.age < fadeLen) a *= p.age / fadeLen;
      if (p.age > p.life - fadeLen) a *= (p.life - p.age) / fadeLen;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PURPLE[0]},${PURPLE[1]},${PURPLE[2]},${a})`;
      ctx.fill();
    }

    // draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(171,71,188,${(1 - d / 100) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── COUNTER ANIMATION ─────────────────────── */
(function () {
  const stats = document.querySelectorAll('.stat-number[data-count]');
  if (!stats.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = 1400;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const prog = Math.min(elapsed / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        const val = Math.round(ease * target);
        el.textContent = prefix + val + suffix;
        if (prog < 1) requestAnimationFrame(tick);
        else el.innerHTML = el.dataset.final || (prefix + target + suffix);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
})();
