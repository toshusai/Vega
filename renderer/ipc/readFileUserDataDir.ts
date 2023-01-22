import { READ_FILE_USER_DATA_DIR } from "../../electron-src/ipc/const";

/**
 * Reads a file in the userData directory
 * @param path relative path from userData directory e.g. "recent-projects.json"
 * @returns file data
 */
export function readFileUserDataDir(path: string): string | false {
  const res = ipcRenderer.sendSync(READ_FILE_USER_DATA_DIR, path);
  return res;
}
