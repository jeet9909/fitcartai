import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the build works at a domain root (Vercel/Netlify) AND
  // under a sub-path (GitHub Pages: /fitcartai/) without reconfiguration.
  base: './',
  plugins: [react()],
  server: { port: 5173, open: false },
})
