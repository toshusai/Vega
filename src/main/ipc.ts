import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { readFileSync, writeFileSync } from 'original-fs'

export function init () {
  ipcMain.on('getProjectById', (e, name) => {
    const path = app.getPath('userData')
    const res = readFileSync(path + '/' + name).toString()
    e.sender.send('getProjectById', JSON.parse(res))
  })

  const saveFile = 'saveFile'
  ipcMain.on(saveFile, async (e, data: string) => {
    // saveFileボタンが押されたとき
    const win = BrowserWindow.getFocusedWindow()
    if (!win) {
      return e.sender.send(saveFile, false)
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
      return e.sender.send(saveFile, true)
    }
    return e.sender.send(saveFile, false)
  })
}
