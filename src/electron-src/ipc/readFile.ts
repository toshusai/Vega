import { ipcMain } from "electron";
import { readFileSync } from "fs";

import { READ_FILE } from "./const";

export const initReadFile = () => {
  ipcMain.on(READ_FILE, (e, path) => {
    try {
      const data = readFileSync(path).toString();
      e.returnValue = data;
    } catch {
      e.returnValue = false;
    }
  });
};
