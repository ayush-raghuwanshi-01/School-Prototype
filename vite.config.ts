import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Sandbox previews are proxied from a *.e2b.app host, so any host is allowed.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
  },
  build: {
    // Recharts + the console tables are the heavy end; split them from the
    // public site (already lazy-loaded) and keep the warning threshold honest.
    chunkSizeWarningLimit: 820,
  },
})
