/// <reference types="vitest" />
import {defineConfig} from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/orchy-wc.ts',
      formats: ['es']
    },
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
  define: {
    'process.env': process.env
  }
})
