import { defineConfig, loadEnv } from 'vite';
import plugin from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [plugin(), createHtmlPlugin({
      inject: {
        data: {
          domain: env.VITE_PUBLIC_DOMAIN,
        },
      },
    })],
        server: {
            port: 11534,
            strictPort: true,
            middlewareMode: false
        },
        define: {
            // Make env variables available to the app
            'process.env.VITE_API_URL_HTTP': JSON.stringify(env.VITE_API_URL_HTTP)
        }
    };
});
