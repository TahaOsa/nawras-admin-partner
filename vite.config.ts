import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },

  // Development server configuration
  server: {
    port: 5173,
    host: true, // Allow external connections
    cors: true,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },

  // Environment variables
  envPrefix: 'VITE_',
})
