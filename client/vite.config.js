import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,//debug
        secure: false,//debug
        // rewrite: (path) => path.replace(/^\/api/, '/api/v1') // Optional
        // secure: false, // Only needed if backend uses self-signed HTTPS
      }
    }
  }
})