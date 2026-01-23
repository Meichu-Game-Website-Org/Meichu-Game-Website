import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/2026/',
  server: {
    port: 22026, // Convention: 20000 + Year
    hmr: {
        port: 22026,
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~bootstrap': path.resolve(__dirname, '../../node_modules/bootstrap'),
    },
  },
})
