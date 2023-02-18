const path = require("path");
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ["page.tsx"],
  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
