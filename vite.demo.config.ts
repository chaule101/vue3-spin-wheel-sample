import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/vue3-spin-wheel-sample/' : '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 3001,
    open: true,
    host: '0.0.0.0'
  }
}))

