import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
// GitHub Pages: 若仓库名为 personal-blog，则 base 为 '/personal-blog/'
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE ?? '/personal-blog/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
