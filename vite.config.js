import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/D-Assessment_2025_BPW1_Final/',
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src', 'public'),
    build: {
        outDir: resolve(__dirname, 'docs'),
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
});
