import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config.
 *
 * `base` is set to `/Token-Migration/` for production builds because the app
 * is served from a sub-path on GitHub Pages
 * (https://vedsarkar.github.io/Token-Migration/). Dev keeps the default `/`
 * so http://localhost:3030/ continues to work unchanged.
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Token-Migration/' : '/',
  plugins: [react()],
  server: {
    port: 3030,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 3030,
    strictPort: true,
  },
}));
