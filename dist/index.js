"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var electron_1 = __importDefault(require("electron"));
var PROXY_PORT = 3000;
var isDev = process.env.NODE_ENV === "development";
// The url load first by electron.
var indexUrl = "";
if (isDev) {
    //   const httpProxy = require("http-proxy");
    //   const proxy = httpProxy.createProxyServer({
    //     target: `http://localhost:${NUXT_PORT}`,
    //   });
    //   proxy.on(
    //     "proxyReq",
    //     function (_req: http.ClientRequest, _: any, res: http.ServerResponse) {}
    //   );
    //   proxy.listen(PROXY_PORT);
    indexUrl = "http://localhost:".concat(PROXY_PORT);
}
else {
    var server = http_1.default.createServer(function (req, res) {
        var _a, _b;
        var baseDir = path_1.default.resolve(__dirname, "../../dist/renderer");
        // redirect Docs to docs (for docsify)
        if (!((_a = req.url) === null || _a === void 0 ? void 0 : _a.match(/^\/docs/))) {
            req.url = "/static/docs/index.html";
        }
        // redirect Nuxt pages to index.html
        if (!((_b = req.url) === null || _b === void 0 ? void 0 : _b.match(/^\/_nuxt|\/static/))) {
            req.url = "/index.html";
        }
        var responseContent = fs_1.default.readFileSync(baseDir + req.url);
        res.write(responseContent);
        res.end();
    });
    server.listen();
    // @ts-ignore
    var port = server.address().port;
    indexUrl = "http://localhost:".concat(port);
}
var win = null;
var app = electron_1.default.app;
var newWin = function () {
    win = new electron_1.default.BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            webSecurity: false,
        },
    });
    win.on("closed", function () { return (win = null); });
    win.loadURL(indexUrl);
};
app.on("ready", newWin);
app.on("window-all-closed", function () { return app.quit(); });
app.on("activate", function () { return win === null && newWin(); });
//# sourceMappingURL=index.js.map