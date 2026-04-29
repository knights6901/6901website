/* =============================================
   TEAM PAGE JS
   ============================================= */

console.log('🚀 team.js loaded');

/* ── TIMELINE STAGGER ──────────────────────── */
(function () {
  const items = document.querySelectorAll('.t-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger each item slightly
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

/* ── PACKAGE CARD TILT ─────────────────────── */
(function () {
  document.querySelectorAll('.pkg').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * 4;
      const ry = ((e.clientX - cx) / (r.width  / 2)) * -4;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── SPONSOR CARD TILT ─────────────────────── */
(function () {
  document.querySelectorAll('.sp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * 5;
      const ry = ((e.clientX - cx) / (r.width  / 2)) * -5;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

(function () {
  function initContactForm() {
    console.log('Contact form script loaded');
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');
    console.log('Form element:', form);
    console.log('Status element:', status);

    if (!form || !status) {
      console.error('Contact form or status element not found');
      return;
    }

    form.addEventListener('submit', event => {
      console.log('Form submitted!');
      event.preventDefault();

      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      console.log('Form data:', { name, email, message });

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

      console.log('Sending to Cloudflare Worker...');

      fetch('https://website-discord-webhook.team-67a.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message, submissionId, timestamp, page: window.location.href, turnstileToken })
      })
      .then(response => {
        console.log('Worker response status:', response.status);
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Worker error: ${response.status} - ${text}`);
          });
        }
        return response;
      })
      .then(() => {
        console.log('Successfully sent via Worker');
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
        console.error('Error sending via Worker:', error);
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