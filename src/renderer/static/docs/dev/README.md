# Development

## Setup Environment

### 0. Basic dependency 
- Node.js v14 or later.
- Google Chrome 92 or later.

### 1. Install npm dependencies.

```
yarn
```

### 2. Copy static JavaScript libraries.

```
sh scripts/copy-static-js.sh
```

### 3. Run Nuxt dev server.
```
yarn dev
```

### 4. Run up proxy server

You need proxy for `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy`

You can use any proxy server you like(ex. Nginx).

This is Node.js server example.

```javascript
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({ target: "http://localhost:9999" });
proxy.on("proxyReq", function (req, _, res) {
  if (req.path.startsWith("/editor")) {
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  }
});

proxy.listen(9000);
```

### 5. Develop
