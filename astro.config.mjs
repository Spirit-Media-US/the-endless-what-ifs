import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Each cloned site MUST set PUBLIC_SITE_URL (in .env locally and in the
// CF Pages production env). The fallback is intentionally a fake string so a
// missed configuration is caught in QA (canonical/og:url will render with
// example.com and grep visibly) instead of shipping silently.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://example.com',
  integrations: [sitemap()],
  build: {
    // Trait 6: Astro inlines small stylesheets, externalizes larger ones.
    // scripts/async-css.mjs converts the externalized bundles to async via the
    // media="print" onload swap so they never block first paint.
    inlineStylesheets: 'auto',
  },
  vite: {
    server: { allowedHosts: ['preview.spiritmediapublishing.com'] },
    plugins: [tailwindcss()],
  },
});
