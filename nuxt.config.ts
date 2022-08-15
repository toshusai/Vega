import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: './src',
  ssr: false,
  router: {
    base: process.env.NODE_ENV === 'production' ? '/vega/' : '/'
  },
  components: {
    global: true,
    dirs: ['~/components', '~/components/panels']
  }
})
