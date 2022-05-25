import http from 'http'
import fs from 'fs'
import path from 'path'
import electron from 'electron'

const PROXY_PORT = 3000

const isDev = process.env.NODE_ENV === 'development'

// The url load first by electron.
let indexUrl = ''

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
  indexUrl = `http://localhost:${PROXY_PORT}`
} else {
  const server = http.createServer(function (req, res) {
    const baseDir = path.resolve(__dirname, '../.output/public')
    // redirect Docs to docs (for docsify)
    // if (!req.url?.match(/^\/docs/)) {
    //   req.url = "/static/docs/index.html";
    // }
    // redirect Nuxt pages to index.html
    if (req.url == '/BigBuckBunny.mp4') {
      req.url = '/BigBuckBunny.mp4'
      if (req.url.match(/(\.mp4|\.webm)$/)) {
        res.setHeader('Content-Type', 'video/mp4')
      }
      const responseContent = fs.readFileSync(baseDir + req.url)
      res.write(responseContent)
      res.end()
      return
    }

    if (!req.url?.match(/^\/_nuxt|\/static/)) {
      req.url = '/index.html'
    }
    const responseContent = fs.readFileSync(baseDir + req.url)
    // set script header
    if (req.url.match(/(\.js|\.mjs)$/)) {
      res.setHeader('Content-Type', 'text/javascript')
    }
    if (req.url.match(/(\.mp4|\.webm)$/)) {
      res.setHeader('Content-Type', 'video/mp4')
    }

    res.write(responseContent)
    res.end()
  })

  server.listen()
  // @ts-ignore
  const port = server.address().port
  indexUrl = `http://localhost:${port}`
}

let win: any = null
const app = electron.app
const newWin = () => {
  win = new electron.BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      webSecurity: false
    }
  })
  win.on('closed', () => (win = null))
  win.loadURL(indexUrl)
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
