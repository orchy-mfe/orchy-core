import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        target: 'esnext',
        lib: {
            entry: './src/index.ts',
            name: 'PageBuilder'
        }
    },
    test: {
        environment: 'happy-dom',
        coverage: {
            enabled: true
        }
    },
})