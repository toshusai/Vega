import { WRITE_FILE } from "@/electron-src/ipc/const";

import { isElectron } from "./readFileUserDataDir";

/**
 * Writes data to a file
 * @param url file url should be started with file://
 * @param data data to write
 * @returns
 */
export function writeFile(url: string, data: string) {
  if (!isElectron()) {
    localStorage.setItem(url, data);
    return true;
  }
  const res = ipcRenderer.sendSync(
    WRITE_FILE,
    url.replace("file://", ""),
    data
  );
  return res;
}
