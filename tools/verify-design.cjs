// Local browser checks. Uses the desktop's bundled Playwright, not a site dependency.
const { chromium } = require(process.env.KNIGHTFALL_PLAYWRIGHT || 'playwright');
const { mkdirSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const output = process.env.KNIGHTFALL_QA_DIR || path.join(require('node:os').tmpdir(), 'knightfall-design-qa');
  mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  const base = 'http://127.0.0.1:4340';
  async function shot(name) {
    await page.screenshot({ path: path.join(output, `${name}.png`), animations: 'disabled' });
  }
  async function inspect(name) {
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: horizontal overflow`);
    console.log(name, JSON.stringify(await page.evaluate(() => ({
      width: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.currentSrc),
      heading: document.querySelector('h1')?.innerText,
      modelLoaded: document.querySelector('model-viewer')?.loaded,
      modelFocus: document.querySelector('.robot-stage')?.dataset.focus,
      theme: document.documentElement.dataset.theme,
    }))));
  }
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('model-viewer')?.loaded, null, { timeout: 25000 });
  await page.waitForTimeout(800);
  await inspect('home-desktop');
  await shot('home-desktop');
  assert.equal(await page.locator('.hero-brand-energy, .hero-geometry, .stage-orbit, .title-motion-toggle').count(), 0, 'Rejected decorative effects must be removed');
  assert.equal(await page.locator('.hero-brand').evaluate(e => getComputedStyle(e).transform), 'none', 'Letterforms stay still');
  // Hero content must fit short, wide windows, not just a tall design canvas.
  for (const [width, height] of [[1920, 650], [1440, 600], [2560, 900], [1024, 768], [390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(400);
    const layout = await page.evaluate(() => {
      const brand = document.querySelector('.hero-brand').getBoundingClientRect();
      const intro = document.querySelector('.hero-intro').getBoundingClientRect();
      const links = [...document.querySelectorAll('.hero-actions a')];
      return {
        gap: intro.top - brand.bottom,
        actionsFit: links.every(link => link.getBoundingClientRect().bottom < innerHeight),
        clickable: links.every(link => {
          const r = link.getBoundingClientRect();
          return link.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
      };
    });
    assert.ok(layout.gap >= 12, `${width}x${height}: headline spacing ${layout.gap}`);
    assert.ok(layout.actionsFit, `${width}x${height}: hero links below viewport`);
    assert.ok(layout.clickable, `${width}x${height}: an overlay blocks hero links`);
    await shot(`hero-${width}x${height}`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.hero-actions .btn').click();
  await page.waitForURL(/\/team\/?$/);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('.site-loader').classList.contains('is-ready'));
  const popupPromise = page.waitForEvent('popup');
  // Verify the external target without depending on Instagram's login/network state.
  await page.context().route('https://www.instagram.com/**', route => route.fulfill({ body: 'External navigation test' }));
  await page.locator('.hero-social').click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  assert.ok(popup.url().startsWith('https://www.instagram.com/frc6901/'));
  await popup.close();
  for (const [name, progress] of [['overview', .24], ['intake', .43], ['finish', 1]]) {
    await page.evaluate(p => {
      const story = document.querySelector('.robot-story');
      scrollTo({ top: (story.offsetHeight - document.querySelector('.robot-stage').offsetHeight) * p, behavior: 'instant' });
    }, progress);
    await page.waitForTimeout(1100);
    await shot(name);
  }
  for (const [name, selector] of [['join', '#join'], ['field', '.proof-moment'], ['sponsors', '#sponsors'], ['closing', '.closing-photo']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    await shot(name);
  }
  const firstRole = page.locator('.discipline-list summary').first();
  await firstRole.focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.discipline-list details').first().getAttribute('open'), '');
  await shot('role-keyboard-open');
  await page.keyboard.press('Enter');
  const firstSponsor = page.locator('.home-sponsor').first();
  await firstSponsor.hover();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.home-sponsor img')).filter === 'none');
  assert.equal(await firstSponsor.locator('img').evaluate(img => getComputedStyle(img).filter), 'none');
  await shot('sponsor-color-hover');
  await page.getByRole('button', { name: 'Use light mode', exact: true }).click();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(800);
  await shot('home-light');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Use dark mode', exact: true }).click();
  await page.waitForTimeout(800);
  await inspect('home-mobile');
  await shot('home-mobile');
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.waitForTimeout(800);
  await inspect('home-tablet');
  await shot('home-tablet');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await shot('mobile-menu');
  await page.keyboard.press('Escape');
  console.log('menu-escape', await page.getByRole('button', { name: 'Open navigation', exact: true }).getAttribute('aria-expanded'));
  await page.locator('#join').scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await shot('join-mobile');
  await page.locator('.discipline-list summary').nth(2).click();
  assert.equal(await page.locator('.discipline-list details').nth(2).getAttribute('open'), '');
  await shot('role-mobile-open');
  for (const route of ['team', 'seasons', 'pictures']) {
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await inspect(`${route}-mobile`);
    await shot(`${route}-mobile`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(400);
    await shot(`${route}-desktop`);
    await page.getByRole('button', { name: 'Use light mode', exact: true }).click();
    await shot(`${route}-light`);
    await page.getByRole('button', { name: 'Use dark mode', exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    if (route === 'seasons') {
      const entry = page.locator('.season-entry').nth(1);
      await entry.locator('summary').click();
      assert.equal(await entry.getAttribute('open'), '');
      await shot('season-panel-mobile');
    }
    if (route === 'team') {
      assert.equal(await page.locator('#contact-name').getAttribute('autocomplete'), 'name');
      assert.equal(await page.locator('#contact-email').getAttribute('type'), 'email');
      await page.locator('.outreach-card-button').first().click();
      assert.equal(await page.locator('#outreach-modal').getAttribute('aria-hidden'), 'false');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#outreach-modal').getAttribute('aria-hidden'), 'true');
    }
    if (route === 'pictures') {
      assert.equal(await page.locator('.g-item').count(), 71);
      await page.getByRole('button', { name: '2026 Season', exact: true }).click();
      await page.waitForTimeout(700);
      assert.equal(await page.locator('.filter-btn[data-year="2026"]').getAttribute('aria-pressed'), 'true');
      await page.locator('.g-item:not(.hidden)').first().click();
      assert.equal(await page.locator('#lightbox').getAttribute('aria-hidden'), 'false');
      await page.getByRole('button', { name: 'Next photo', exact: true }).click();
      await shot('lightbox-mobile');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#lightbox').getAttribute('aria-hidden'), 'true');
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(base, { waitUntil: 'networkidle' });
  await shot('reduced-mobile');
  assert.equal(await page.evaluate(() => document.querySelector('.robot-story').offsetHeight <= 900), true);
  const failurePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await failurePage.route('**/models/**', route => route.abort());
  await failurePage.goto(base, { waitUntil: 'networkidle' });
  await failurePage.waitForSelector('.model-unavailable', { timeout: 20000 });
  assert.equal(await failurePage.evaluate(() => document.querySelector('.robot-story').offsetHeight <= 900), true, 'Failure state must collapse the scroll exhibit');
  await failurePage.screenshot({ path: path.join(output, 'failed-model-mobile.png') });
  await failurePage.close();
  assert.deepEqual(failures, [], 'No runtime errors across routes');
  console.log('errors', failures);
  console.log('screenshots', output);
  await browser.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
