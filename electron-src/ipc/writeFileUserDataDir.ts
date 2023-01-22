import { join } from "path";
import { app, ipcMain } from "electron";
import { writeFileSync } from "fs";
import { WRITE_FILE_USER_DATA_DIR } from "./const";

export const initWriteFileUserDataDir = () => {
  ipcMain.on(WRITE_FILE_USER_DATA_DIR, (e, path: string, data: string) => {
    try {
      const dir = app.getPath("userData");
      writeFileSync(join(dir, path), data);
      e.returnValue = true;
    } catch {
      e.returnValue = false;
    }
  });
};
