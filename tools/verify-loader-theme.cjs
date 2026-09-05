// Focused browser checks for the sword signature, system theme, and SVG link icons.
const { chromium, webkit } = require(process.env.KNIGHTFALL_PLAYWRIGHT || 'playwright');
const { PNG } = require(require.resolve('pngjs', { paths: [process.env.KNIGHTFALL_PLAYWRIGHT || '.'] }));
const { mkdirSync, existsSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const output = path.join(require('node:os').tmpdir(), 'knightfall-loader-qa');
  mkdirSync(output, { recursive: true });
  const base = 'http://127.0.0.1:4340';
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const blocked of [false, true]) {
      const context = await browser.newContext({ colorScheme: 'light' });
      if (blocked) await context.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } });
      });
      const page = await context.newPage();
      await page.goto(`${base}/team`, { waitUntil: 'networkidle' });
      const theme = () => page.locator('html').getAttribute('data-theme');
      assert.equal(await theme(), 'light', 'System light is the default even without storage');
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
      await page.getByRole('button', { name: 'Use light mode', exact: true }).click();
      assert.equal(await theme(), 'light');
      await page.emulateMedia({ colorScheme: 'light' });
      await page.emulateMedia({ colorScheme: 'dark' });
      assert.equal(await theme(), 'light', 'A manual choice survives system changes during this visit');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await theme(), blocked ? 'dark' : 'light', 'Persist explicit choice only when storage is available');
      await context.close();
    }
    const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1280, height: 800 } });
    await context.addInitScript(() => localStorage.setItem('knightfall-theme', 'invalid'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*.glb*', route => route.abort());
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', 'Invalid saved values fall back to system');
    await page.waitForFunction(() => document.querySelector('.site-loader').classList.contains('is-ready'));
    assert.equal(await page.locator('.site-loader').evaluate(e => getComputedStyle(e).pointerEvents), 'none', 'Loader cannot block the site on model failure');
    await page.addStyleTag({ content: '.site-loader { display:grid!important; opacity:1!important; visibility:visible!important; animation:none!important; transition:none!important; } .loader-mark { width:144px!important; }' });
    const ink = page.locator('.loader-ink');
    const frame = async time => {
      await ink.evaluateAll((elements, t) => elements.forEach(e => e.getAnimations().forEach(a => { a.pause(); a.currentTime = t; })), time);
      await page.screenshot({ path: path.join(output, `sword-${time}.png`) });
    };
    for (const time of [0, 350, 700, 1050, 1400]) await frame(time);
    // Completed strokes must reveal the exact original logo, not a different final silhouette.
    await page.addStyleTag({ content: '.loader-mark { width:500px!important; }' });
    const masked = PNG.sync.read(await page.locator('.loader-mark').screenshot());
    await page.locator('.loader-sword').evaluate(e => e.removeAttribute('mask'));
    const original = PNG.sync.read(await page.locator('.loader-mark').screenshot());
    let missing = 0;
    const missingBounds = [500, 500, 0, 0];
    for (let i = 0; i < masked.data.length; i += 4) {
      if (Math.abs(masked.data[i] - original.data[i]) > 5) {
        missing++;
        const x = (i / 4) % masked.width, y = Math.floor(i / 4 / masked.width);
        missingBounds[0] = Math.min(missingBounds[0], x); missingBounds[1] = Math.min(missingBounds[1], y);
        missingBounds[2] = Math.max(missingBounds[2], x); missingBounds[3] = Math.max(missingBounds[3], y);
      }
    }
    assert.ok(missing < 10, `Completed sword differs from the actual logo at ${missing} pixels, bounds ${missingBounds}`);
    for (const route of ['', '/team', '/seasons', '/pictures']) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.ok(await page.locator('.link-arrow svg').count() > 0);
      assert.equal(await page.locator('body').innerText().then(text => /[↗↖↘↙→←]/u.test(text)), false, 'No platform-dependent arrow glyphs');
      assert.ok(await page.locator('.link-arrow').evaluateAll(els => els.every(e => e.getAttribute('aria-hidden') === 'true')));
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.site-loader').evaluate(e => getComputedStyle(e).display), 'none');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('Passed: system defaults, manual choice, denied storage, invalid preference, loader lifecycle, exact final sword, reduced motion, SVG arrows.');
    console.log(`Screenshots: ${output}`);
  } finally { await browser.close(); }
  console.log(`WebKit available locally: ${existsSync(webkit.executablePath())}`);
})().catch(error => { console.error(error); process.exit(1); });
