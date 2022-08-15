import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: './src',
  ssr: false,
  app: {
    baseURL: '/vega'
  },
  components: {
    global: true,
    dirs: ['~/components', '~/components/panels']
  }
})
