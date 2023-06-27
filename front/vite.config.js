import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
const path = require('path')
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
