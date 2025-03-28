import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => (
    {
        plugins: [plugin()],
        base: mode === 'production' ? '/TomsPortfolio/' : '/TomsPortfolio-QA/',
        server: {
            port: 11534,
        }
    }));