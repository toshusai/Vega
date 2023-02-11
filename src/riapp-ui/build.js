const { build } = require("esbuild");
const pkg = require("./package.json");

// const dependencies = Object.keys(pkg.dependencies ?? {});
const peerDependencies = Object.keys(pkg.peerDependencies ?? {});

const external = [...peerDependencies];

const entryFile = "src/index.ts";
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  external,
  logLevel: "info",
  minify: true,
  sourcemap: false,
};

build({
  ...shared,
  format: "esm",
  outfile: pkg.module,
  jsx: "transform",
  target: ["ES6"],
});

build({
  ...shared,
  format: "cjs",
  outfile: pkg.main,
  target: ["ES6"],
});
