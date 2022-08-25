
export function ipcSend<T> (name: string, params: unknown) {
  return new Promise<T>((resolve) => {
    window.ipcRenderer.on(name, (e) => {
      resolve(e as T)
    })
    window.ipcRenderer.send(name, params)
  })
}
