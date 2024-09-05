import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    browser: {
      provider: 'playwright',
      enabled: true,
      name: 'chromium',
    },
  },
})
