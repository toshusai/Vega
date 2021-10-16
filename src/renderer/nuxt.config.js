export default {
  server: {
    port: 9999,
  },
  ssr: false,
  target: "static",
  head: {
    title: "Vega",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    script: [{ src: "/static/js/ccapture.js/CCapture.all.min.js" }],
  },
  render: {
    static: {
      setHeaders(res) {
        res.setHeader("Access-Control-Allow-Origin", "cdn.jsdelivr.net");
      },
    },
  },

  css: ["~/assets/reset.css", "~/assets/global.css"],

  // components: true,

  buildModules: ["@nuxt/typescript-build"],

  generate: {
    dir: "../../dist/renderer",
  },

  // https://github.com/nuxt/nuxt.js/issues/9224#issuecomment-893289291
  build: {
    babel: {
      plugins: [
        ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
      ],
    },
    extend(config) {
      config.performance = config.performance || {};
      config.performance.maxEntrypointSize = 1000 * 1024;
      config.performance.maxAssetSize = 1000 * 1024;
      config.optimization.splitChunks.maxSize = 100 * 1024;
    },
  },
};
