import { READ_FILE_USER_DATA_DIR } from "@/electron-src/ipc/const";

export function isElectron() {
  return navigator.userAgent.toLowerCase().indexOf(" electron/") > -1;
}

export function toUserDataLocalPath(path: string) {
  return `userData_${path}`;
}

/**
 * Reads a file in the userData directory
 * @param path relative path from userData directory e.g. "recent-projects.json"
 * @returns file data
 */
export function readFileUserDataDir(path: string): string | false {
  if (!isElectron()) {
    return localStorage.getItem(toUserDataLocalPath(path)) || false;
  }
  const res = ipcRenderer.sendSync(READ_FILE_USER_DATA_DIR, path);
  return res;
}
