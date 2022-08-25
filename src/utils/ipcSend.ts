
export function ipcSend (name: string, ...args: unknown[]) {
  return new Promise((resolve) => {
    window.ipcRenderer.on(name, (_, ...args) => {
      resolve(args)
    })
    window.ipcRenderer.send(name, ...args)
  })
}
