import http from 'http'
import fs from 'fs'
import path from 'path'
import electron from 'electron'
import { init } from './ipc'

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
  indexUrl = `http://localhost:${PROXY_PORT}/app`
} else {
  const server = http.createServer(function (req, res) {
    const baseDir = path.resolve(__dirname, '../.output/public')

    let url = req.url?.replace(/^\/Vega\//, '/') || '/'
    if (url.endsWith('/app')) {
      url = url.replace('/app', '')
    }

    let filePath = baseDir + url
    if (!fs.statSync(filePath).isFile()) {
      filePath = baseDir + '/index.html'
    }

    const responseContent = fs.readFileSync(filePath)
    // set script header
    if (url.match(/(\.js|\.mjs)$/)) {
      res.setHeader('Content-Type', 'text/javascript')
    }
    if (url.match(/(\.mp4|\.webm)$/)) {
      res.setHeader('Content-Type', 'video/mp4')
    }
    res.write(responseContent)
    res.end()
  })

  server.listen()
  const address = server.address()
  if (typeof address === 'object') {
    indexUrl = `http://localhost:${address?.port}/app`
  }
}

let win: electron.BrowserWindow | null = null
const app = electron.app
const newWin = () => {
  init()
  win = new electron.BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.on('closed', () => (win = null))
  win.loadURL(indexUrl)
}

app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
