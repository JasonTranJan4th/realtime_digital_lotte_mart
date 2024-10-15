import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                register: resolve(__dirname, 'src/register/index.html'),
                search: resolve(__dirname, 'src/search/index.html'),
            }
        }
    }
})