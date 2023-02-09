import { ipcMain } from "electron";
import { writeFileSync } from "fs";

import { WRITE_FILE } from "./const";

export const initWriteFile = () => {
  ipcMain.on(WRITE_FILE, (e, path, data) => {
    try {
      writeFileSync(path, data);
      e.returnValue = true;
    } catch {
      e.returnValue = false;
    }
  });
};
