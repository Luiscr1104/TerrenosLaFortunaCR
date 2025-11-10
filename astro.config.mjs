// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless'; // o '@astrojs/vercel/edge'

export default defineConfig({
  output: 'server',          // necesario para SSR (prerender=false)
  adapter: vercel({}),       // 👈 pasa un objeto (aunque esté vacío)
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});
