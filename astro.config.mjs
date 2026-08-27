// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// ⚠️ PLACEHOLDER — set this to the real domain before the first public deploy.
// An independent domain was chosen (see DEPLOY.md step 3); this is a stand-in,
// not a registered address. Changing it also means updating:
//   public/robots.txt   (the Sitemap: line)
//   REDIRECTS.md        (every NEW-DOMAIN occurrence)
export const SITE = 'https://ls3lab.example';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
  // Off deliberately: the HTML minifier collapses the whitespace between an
  // inline <a> and the text around it, so links fuse into their neighbours
  // ("check theadmissions pagesfor the dates"). The few KB are worth it.
  compressHTML: false,
  devToolbar: { enabled: false },
});
