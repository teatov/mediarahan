import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  server: {
    port: Number(process.env.PORT!),
    origin: process.env.ORIGIN!,
    strictPort: true,
  },
});
