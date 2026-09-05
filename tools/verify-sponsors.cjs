const { chromium } = require(process.env.KNIGHTFALL_PLAYWRIGHT || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { mkdirSync } = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const output = path.join(require('node:os').tmpdir(), 'knightfall-design-qa');
    mkdirSync(output, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
    for (const route of ['', 'team']) {
      await page.goto(`http://127.0.0.1:4340/${route}`, { waitUntil: 'networkidle' });
      const logos = page.locator(route ? '.sponsor-item > a' : '.home-sponsor');
      for (const theme of ['dark', 'light']) {
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        for (const index of [0, 1]) {
          const logo = logos.nth(index);
          await logo.scrollIntoViewIfNeeded();
          await page.waitForTimeout(800);
          await logo.hover();
          await page.waitForTimeout(900);
          const info = await logo.locator('img').evaluate(img => ({ src: img.getAttribute('src'), filter: getComputedStyle(img).filter, loaded: img.complete && img.naturalWidth > 0 }));
          assert.ok(info.loaded);
          assert.ok(info.src.includes('-color.'));
          console.log(route || 'home', theme, index, info, 'hovered', await logo.evaluate(a => a.matches(':hover')));
          assert.equal(info.filter, 'none');
          await logo.screenshot({ path: path.join(output, `${route || 'home'}-${theme}-sponsor-${index}.png`) });
          await logo.focus();
          assert.equal(await logo.evaluate(a => document.activeElement === a), true);
        }
      }
    }
    console.log('Boeing and Leidos: hover and focus checks passed on both pages and themes.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
