import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 'resolve' does not exist in type 'ElectronViteConfigExport'
  // this config is just a vite config
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src')
    }
  },
  plugins: [react()]
})
