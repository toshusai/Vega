import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // These are the aliases we set up in tsconfig.json
      '@': '/src'
    }
  }
})
