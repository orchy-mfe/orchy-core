/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/orchy-wc.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  },
  server: {
    proxy: {
      '/api': {target: 'http://localhost:3000'}
    },
  },
  test: {
    environment: 'happy-dom',
    mockReset: true
  },
})
