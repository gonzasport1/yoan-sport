import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api-sports-football': {
        target: 'https://v3.football.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sports-football/, ''),
        headers: {
          'x-apisports-key': '4a69fe331e801e26eb969eeed610f474'
        }
      },
      '/api-sports-basketball': {
        target: 'https://v1.basketball.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sports-basketball/, ''),
        headers: {
          'x-apisports-key': '4a69fe331e801e26eb969eeed610f474'
        }
      },
      '/api-sports-baseball': {
        target: 'https://v1.baseball.api-sports.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-sports-baseball/, ''),
        headers: {
          'x-apisports-key': '4a69fe331e801e26eb969eeed610f474'
        }
      }
    }
  }
})
