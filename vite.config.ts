import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        {
          name: 'spa-fallback',
          enforce: 'pre',
          configureServer(server) {
            // Run middleware immediately (before Vite's middleware)
            server.middlewares.use((req, res, next) => {
              if (!req.url) return next();
              
              const url = req.url.split('?')[0];
              
              // Skip Vite internal requests, static assets, and API routes
              if (
                url.startsWith('/@') ||
                url.startsWith('/node_modules') ||
                url.match(/\.[a-zA-Z0-9]+$/) ||
                url.startsWith('/api') ||
                url === '/index.html' ||
                url === '/'
              ) {
                return next();
              }
              
              // For all SPA routes, rewrite to index.html
              req.url = '/index.html';
              next();
            });
          },
        },
        react(),
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      appType: 'spa',
    };
});
