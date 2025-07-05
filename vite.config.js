import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: '/D-Assessment_2025_BPW1_Final/', // ⚠️ Wajib sesuai GitHub Pages subfolder
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
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            strategies: 'injectManifest',
            srcDir: '.',
            filename: 'service-worker.js',

            manifest: {
                name: 'StoryMapKita',
                short_name: 'StoryMap',
                start_url: '/D-Assessment_2025_BPW1_Final/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#00ADB5',
                icons: [
                    {
                        src: '/D-Assessment_2025_BPW1_Final/icons/icon.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/D-Assessment_2025_BPW1_Final/icons/icon-splash.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },

            devOptions: {
                enabled: true,
                type: 'module',
            },
        }),
    ],
});
