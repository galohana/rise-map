import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Dev-only: proxy /api to the local serverless runtime (vercel dev on :5190).
  // No effect on the production build.
  server: {
    proxy: {
      '/api': 'http://localhost:5190',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-map': ['maplibre-gl', 'react-map-gl/maplibre'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
})
