import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'esbuild',
        outDir: 'build',
        target: 'es2020',
        rollupOptions: {
            input: {
                sideBar: resolve(__dirname, 'src/sideBar/SideBar.tsx'),
                panel: resolve(__dirname, 'src/panel/Panel.tsx'),
            },
            output: {
                entryFileNames: `[name].js`,
                chunkFileNames: `[name].js`,
                assetFileNames: `[name].[ext]`,
            },
        },
    },
});
