import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// SECURITY NOTE:
// Do NOT inject secrets into the client bundle.
// This project runs without any external AI keys.

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('@supabase/')) {
            return 'supabase';
          }
          if (id.includes('react-hook-form')) {
            return 'forms';
          }
          return 'vendor';
        },
      },
    },
  },
});
