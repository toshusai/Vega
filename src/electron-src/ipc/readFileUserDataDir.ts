import { app, ipcMain } from "electron";
import { readFileSync } from "fs";
import { join } from "path";

import { READ_FILE_USER_DATA_DIR } from "./const";

export const initReadFileUserDataDir = () => {
  ipcMain.on(READ_FILE_USER_DATA_DIR, (e, path: string) => {
    try {
      const dir = app.getPath("userData");
      const data = readFileSync(join(dir, path)).toString();
      e.returnValue = data;
    } catch {
      e.returnValue = false;
    }
  });
};
