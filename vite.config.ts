/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'MathQuest: Adventure Math',
        short_name: 'MathQuest',
        description:
          'Learn math through epic boss battles! A fantasy adventure game for ages 5-11.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f1222',
        theme_color: '#0f1222',
        orientation: 'any',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        // Only precache the app shell + build output (JS/CSS/HTML) — keeps
        // the install payload under iOS Safari's ~50 MB cache quota.
        globPatterns: ['**/*.{js,css,html,svg}'],
        // Game images, sounds, and maps are cached on first use via
        // runtime caching rules below (CacheFirst). This means the first
        // load of each world/boss requires network, but all subsequent
        // loads are instant — even offline.
        runtimeCaching: [
          {
            // Game images — avatars, bosses, backgrounds, maps, crystals, etc.
            urlPattern: /\/assets\/.*\.(?:png|jpg|jpeg|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'game-images',
              expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Sound effects
            urlPattern: /\/assets\/.*\.(?:wav|mp3|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'game-audio',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts CSS
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
