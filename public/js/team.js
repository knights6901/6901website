/* =============================================
   TEAM PAGE JS
   ============================================= */

/* ── TIMELINE STAGGER ──────────────────────── */
(function () {
  const items = document.querySelectorAll('.t-item');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('team-motion');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

(function () {
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');

    if (!form || !status) {
      return;
    }

    form.addEventListener('submit', event => {
      event.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in your name, email, and message before sending.';
        status.className = 'contact-status error';
        return;
      }

      const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;
      
      if (!turnstileToken) {
        status.textContent = 'Please complete the security check.';
        status.className = 'contact-status error';
        return;
      }

      const submissionId = crypto.randomUUID();

      function formatCST(date = new Date()) {
        return date.toLocaleString("en-US", {
          timeZone: "America/Chicago",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) + " CT";
      }

      const timestamp = formatCST(new Date());

      fetch('https://website-discord-webhook.team-67a.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message, submissionId, timestamp, page: window.location.href, turnstileToken })
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Worker error: ${response.status} - ${text}`);
          });
        }
        return response;
      })
      .then(() => {
        status.textContent = 'Message sent successfully! We will reach out soon.';
        status.className = 'contact-status success';
        form.reset();
        
        // Reset Turnstile widget to prevent token reuse
        if (window.turnstile) {
          const turnstileContainer = form.querySelector('.cf-turnstile');
          if (turnstileContainer) {
            window.turnstile.reset(turnstileContainer);
          }
        }
      })
      .catch(error => {
        status.textContent = 'Error: ' + error.message;
        status.className = 'contact-status error';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();

/* ── SECTION ACTIVE NAV LINK ────────────────────────────────── */
(function () {
  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => io.observe(s));
})();
