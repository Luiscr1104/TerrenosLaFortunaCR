// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import partytown from '@astrojs/partytown';

const SITE_URL = 'https://www.buylandcr.com';

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
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
