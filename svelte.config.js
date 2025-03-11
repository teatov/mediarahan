import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex()],

  kit: {
    adapter: adapter(),
    csrf: { checkOrigin: true },
    csp: {
      mode: 'auto',
      directives: { 'script-src': ['self'] },
    },
  },

  extensions: ['.svelte', '.svx'],
};

export default config;
