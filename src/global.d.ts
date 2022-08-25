import { ipcRenderer } from 'electron'
declare global {
  interface Window {
    ipcRenderer: {
      on: (
        name: string,
        cb: (e: unknown, params: unknown) => void
      ) => void;
      send: (name: string, params: unknown) => void;
    };
  }
}
