import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import serviceWorkerPlugin from './service-worker-plugin.js';
import { resolve } from 'path';

// Determine base path dynamically - use environment variable if available, otherwise default
const basePath = process.env.BASE_PATH || '/';

// Ensure service worker is accessible during development
const publicDir = resolve(__dirname, 'public');
const swSource = resolve(publicDir, 'service-worker.js');

// Log configuration for debugging
console.log(`Base path: ${basePath}`);
console.log(`Service worker source: ${swSource}`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    serviceWorkerPlugin(),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: basePath, // Use repository name as base path for GitHub Pages
  server: {
    host: true,
    port: 3000,
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['lucide-react'],
          'chart-libs': ['recharts'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-link', '@tiptap/extension-image', '@tiptap/extension-highlight'],
        }
      }
    }
  }
});
