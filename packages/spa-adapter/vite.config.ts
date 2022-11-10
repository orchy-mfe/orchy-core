import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/spa-adapter',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})
