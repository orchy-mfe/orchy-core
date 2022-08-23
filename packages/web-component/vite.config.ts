/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/my-element.ts',
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
    globals: true,
    environment: 'happy-dom',
  },
})
