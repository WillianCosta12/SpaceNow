import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow CORS in development for NASA API calls
    cors: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-map':    ['leaflet', 'react-leaflet'],
          'vendor-http':   ['axios'],
        },
      },
    },
  },
})
