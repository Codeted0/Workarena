import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  css: {
    postcss: './postcss.config.cjs',
  },

  build: {
    outDir: 'dist',
  },

  server: {
    open: true, // Opens the app in the browser automatically
  },

  // Fix for Vercel refresh issue
  resolve: {
    alias: {
      '/@': '/src',
    },
  },
})
