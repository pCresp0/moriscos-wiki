import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/moriscos-wiki/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // El service worker se registra a mano en src/main.jsx.
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'favicon.png',
        'icons/favicon-32.png',
        'icons/favicon-16.png',
        'icons/apple-touch-icon.png',
        'icons/apple-touch-icon-167x167.png',
        'icons/apple-touch-icon-152x152.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'images/escudo-moriscos-160.jpg',
        'images/og-default.png',
      ],
      manifest: {
        name: 'Moriscos · Historia, Lugares y Curiosidades',
        short_name: 'Moriscos',
        description:
          'Historia, geografía, etnografía y memoria viva de Moriscos (Salamanca, La Armuña) y el entorno de La Flecha.',
        lang: 'es',
        start_url: '/moriscos-wiki/',
        scope: '/moriscos-wiki/',
        display: 'standalone',
        background_color: '#241E18',
        theme_color: '#724828',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: '/moriscos-wiki/index.html',
        // Se precachea woff2 (soportado por todos los navegadores actuales) y
        // no woff, para no duplicar el peso de las tipografías sin conexión.
        globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp,woff2}'],
        globIgnores: ['**/originals/**'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
    }),
  ],
});
