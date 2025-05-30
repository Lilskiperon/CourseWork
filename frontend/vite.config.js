import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@assets': '/src/assets',
    },
  },
  server: {
    host: '26.84.9.17',
    changeOrigin: true,
  },
})
