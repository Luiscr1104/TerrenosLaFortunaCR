// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// Dominio principal
const SITE_URL = 'https://www.terrenoslafortunacr.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel({}),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),

    // 🗺️ Sitemap simple para todo el sitio (solo en inglés)
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
