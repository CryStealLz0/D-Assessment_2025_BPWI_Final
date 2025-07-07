import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'src', 'public'),
    build: {
        outDir: resolve(__dirname, 'dist'),
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
            includeAssets: [
                'favicon.png',
                'icons/icon.png',
                'icons/icon-splash.png',
            ],
            manifest: {
                name: 'StoryMapKita',
                short_name: 'StoryMap',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                icons: [
                    {
                        src: 'icons/icon.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
