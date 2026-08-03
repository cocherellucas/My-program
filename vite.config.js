import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Cartes de source en production : sans elles, une erreur sur mobile ne donne
    // qu'un nom minifié illisible (« Cannot access 'V' before initialization ») et
    // reste indiagnostiquable. Les .map ne sont téléchargées que si la console est
    // ouverte — aucun coût pour l'utilisateur normal.
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
