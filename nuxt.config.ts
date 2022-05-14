import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: "./src",
  ssr: false,
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true,
  },
  components: {
    global: true,
    dirs: ["~/components", "~/components/panels"],
  },
});
