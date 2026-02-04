import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'charts-vendor';
            }
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler') ||
              id.includes('zustand')
            ) {
              return 'react-core';
            }

            if (id.includes('@tanstack')) {
              return 'data-vendor';
            }

            if (
              id.includes('lucide') ||
              id.includes('dompurify') ||
              id.includes('clsx') ||
              id.includes('tailwind-merge')
            ) {
              return 'ui-vendor';
            }
          }

          if (id.includes('@academic/common')) {
            return 'academic-common';
          }
        },
      },
    },
  },
});
