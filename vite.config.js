import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // server: {
    //     host: '0.0.0.0',
    //     hmr: {
    //         host, // Ini memberitahu browser untuk connect ke IP Anda
    //     },
    // },
    // server: {
    //     host: '0.0.0.0',
    //     hmr: {
    //         host: '192.168.18.51',
    //     },
    // },
    plugins: [
        tailwindcss(),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true,
            },
            manifest: {
                name: 'Fadhilah Berkah Inventory & POS',
                short_name: 'Fadhilah Berkah',
                description: 'Sistem Manajemen Inventaris & POS Fadhilah Berkah',
                theme_color: '#00b96b',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
