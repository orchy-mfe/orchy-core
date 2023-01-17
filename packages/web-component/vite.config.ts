/// <reference types="vitest" />
import {visualizer} from 'rollup-plugin-visualizer'
import {defineConfig} from 'vite'

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
    mockReset: true,
    coverage: {
      enabled: true
    }
  },
  define: {
    'process.env': process.env
  }
})
