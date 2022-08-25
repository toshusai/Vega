import { ipcRenderer, app, BrowserWindow, dialog, ipcMain } from 'electron'
import { readFileSync, writeFileSync } from 'original-fs'

export function init () {
  ipcMain.on('getProjectById', (e, path) => {
    // const path = app.getPath('userData')
    const res = readFileSync(path).toString()
    e.sender.send('getProjectById', JSON.parse(res))
  })

  const SAVE_NEW_FILE = 'SAVE_NEW_FILE'
  ipcMain.on(SAVE_NEW_FILE, async (e, data: string) => {
    // saveFileボタンが押されたとき
    const win = BrowserWindow.getFocusedWindow()
    if (!win) {
      return e.sender.send(SAVE_NEW_FILE, false)
    }
    const res = await dialog.showSaveDialog(win, {
      filters: [
        {
          name: 'project',
          extensions: ['json']
        }
      ]
    })
    if (res.filePath) {
      writeFileSync(res.filePath, data)
      return e.sender.send(SAVE_NEW_FILE, res.filePath)
    }
    return e.sender.send(SAVE_NEW_FILE, false)
  })

  const SAVE_FILE = 'SAVE_FILE'
  ipcMain.on(SAVE_FILE, (e, { path, data }) => {
    writeFileSync(path, data)
    return e.sender.send(SAVE_FILE)
  })
}
