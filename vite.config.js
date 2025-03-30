import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  css: {
    postcss: './postcss.config.cjs',
  },

  server: {
    historyApiFallback: true, // Ensures React Router handles routing
  },

  build: {
    outDir: 'dist',
  },
})
