import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.linemate.io',
        changeOrigin: true,
        secure: false,
        headers: {
          'Origin': 'https://linemate.io',
          'Referer': 'https://linemate.io/'
        }
      }
    }
  }
});
