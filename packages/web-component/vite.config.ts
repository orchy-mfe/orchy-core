/// <reference types="vitest" />
import {defineConfig} from 'vite'
import {visualizer} from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [visualizer()],
  build: {
    lib: {
      entry: 'src/orchy-wc.ts',
      formats: ['es'],
      fileName: 'orchy-wc'
    },
    rollupOptions: {
      external: [
        '@orchy-mfe/models',
        '@orchy-mfe/page-builder',
      ]
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
  define: {
    'process.env': process.env
  }
})
