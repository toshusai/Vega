import { WRITE_FILE } from "../../electron-src/ipc/const";

/**
 * Writes data to a file
 * @param url file url should be started with file://
 * @param data data to write
 * @returns
 */
export function writeFile(url: string, data: string) {
  const res = ipcRenderer.sendSync(
    WRITE_FILE,
    url.replace("file://", ""),
    data
  );
  return res;
}
