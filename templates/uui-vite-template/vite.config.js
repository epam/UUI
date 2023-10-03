import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svgr(), react()],
    optimizeDeps: {},
    test: {
        include: ['**/*.test.tsx'],
        globals: true,
        environment: 'jsdom',
        setupFiles: 'vitest-setup.js',
        deps: {
            web: {
                transformCss: false,
                transformAssets: false,
            },
        },
    },
});
