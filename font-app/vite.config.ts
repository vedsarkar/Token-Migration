import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port 3031 — leaves 3030 (color mapper) and 5173 (ROB default) untouched
// so all three dev servers can run side-by-side.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3031,
    strictPort: true,
    open: true,
  },
  preview: {
    port: 3031,
    strictPort: true,
  },
});
