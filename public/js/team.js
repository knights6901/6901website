/* KnightFall team page interactions: one-time timeline reveal, accessible outreach details, and contact delivery. */
(function () {
  const items = document.querySelectorAll('.t-item');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;
  const page = document.querySelector('.team-page');
  page?.classList.add('team-motion');
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }), { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
})();

(function () {
  const modal = document.getElementById('outreach-modal');
  const image = document.getElementById('outreach-modal-image');
  const title = document.getElementById('outreach-modal-title');
  const description = document.getElementById('outreach-modal-description');
  const page = document.querySelector('.team-page');
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('.site-footer');
  if (!modal || !image || !title || !description) return;
  let previouslyFocused = null;
  let bodyOverflow = '';
  const background = [page, header, footer].filter(Boolean);
  const setBackgroundInert = (inert) => background.forEach((element) => { element.inert = inert; });
  const close = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = bodyOverflow;
    setBackgroundInert(false);
    image.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
    previouslyFocused?.focus();
  };
  const open = (button) => {
    previouslyFocused = button;
    bodyOverflow = document.body.style.overflow;
    image.src = button.dataset.image || '';
    image.alt = button.dataset.alt || button.dataset.title || 'Outreach image';
    title.textContent = button.dataset.title || '';
    description.textContent = button.dataset.description || '';
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setBackgroundInert(true);
    requestAnimationFrame(() => modal.querySelector('.outreach-modal-close')?.focus());
  };
  document.querySelectorAll('.outreach-card-button').forEach((button) => button.addEventListener('click', () => open(button)));
  modal.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', close));
  window.addEventListener('keydown', (event) => {
    if (modal.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hidden);
    const first = focusable[0]; const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
})();

(function () {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  if (!form || !status) return;
  const submitButton = form.querySelector('[type="submit"]');
  const setStatus = (message, type) => { status.textContent = message; status.className = `contact-status ${type}`; };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    const fields = [name, email, message];
    const firstInvalid = fields.find((field) => !field.value.trim());
    if (firstInvalid) { setStatus('Please fill in your name, email, and message before sending.', 'error'); firstInvalid.focus(); return; }
    if (!email.validity.valid) { setStatus('Enter a valid email address before sending.', 'error'); email.focus(); return; }
    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!turnstileToken) { setStatus('Please complete the security check.', 'error'); return; }
    const label = submitButton?.querySelector('span'); const originalLabel = label?.textContent;
    submitButton.disabled = true; form.setAttribute('aria-busy', 'true'); if (label) label.textContent = 'Sending…';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' CT';
    try {
      const response = await fetch('https://website-discord-webhook.team-67a.workers.dev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.value.trim(), email: email.value.trim(), message: message.value.trim(), submissionId: crypto.randomUUID(), timestamp, page: window.location.href, turnstileToken }) });
      if (!response.ok) throw new Error('Message delivery failed.');
      setStatus('Message sent successfully! We will reach out soon.', 'success'); form.reset();
      const container = form.querySelector('.cf-turnstile');
      if (window.turnstile && container) window.turnstile.reset(container);
    } catch (_) { setStatus('We could not send your message. Please try again or email outreach@knights6901.org.', 'error'); }
    finally { submitButton.disabled = false; form.removeAttribute('aria-busy'); if (label) label.textContent = originalLabel || 'Send Message'; }
  });
})();
