import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Media Vizard - AI-Powered Image Redaction & Privacy Protection',
        short_name: 'MediaVizard',
        description: 'Protect your privacy with AI-powered image face redaction. Process files locally for maximum security.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tensorflow-models',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@mediapipe/face_mesh': path.resolve(__dirname, 'src/shims/mediapipe-face-mesh-shim.js'),
      '@mediapipe/face_detection': path.resolve(__dirname, 'src/shims/mediapipe-face-detection-shim.js')
    }
  },
  optimizeDeps: {
    include: ['@tensorflow/tfjs', '@tensorflow-models/face-detection']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'tensorflow': ['@tensorflow/tfjs', '@tensorflow-models/face-detection'],
        }
      }
    }
  }
})