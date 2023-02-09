import { READ_FILE } from "@/electron-src/ipc/const";

/**
 * read file from disk
 *
 * @param url file url should be started with file://
 * @returns
 */
export function readFile(url: string) {
  const res = ipcRenderer.sendSync(READ_FILE, url.replace("file://", ""));
  return res;
}
