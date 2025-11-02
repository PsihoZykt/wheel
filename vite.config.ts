import path from 'path';
import fs from 'fs';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/wheel/' : '/',
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    {
      name: 'full-reload',
      handleHotUpdate({ server }) {
        server.ws.send({ type: 'full-reload' });
        return [];
      },
    },
    {
      name: 'create-nojekyll',
      closeBundle() {
        const distPath = path.join(process.cwd(), 'dist');
        if (fs.existsSync(distPath)) {
          fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
        }
      },
    },
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "${path.join(process.cwd(), 'src/_mantine').replace(/\\/g, '/')}" as mantine;`,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '^/api.*': 'http://localhost:8000',
    },
  },
});
