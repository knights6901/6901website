import { defineConfig } from 'astro/config';

export default defineConfig({
  // For GitHub Pages deployment with custom domain
  site: 'https://knights6901.org',
  base: '/',
  output: 'static',
  outDir: './dist',
});
