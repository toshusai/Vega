import { readFileUserDataDir } from "../ipc/readFileUserDataDir";

export function readRecentFiles() {
  let fileJson = readFileUserDataDir("recentFiles.json");
  if (fileJson === false) {
    // throw new Error("Could not read recent files");
    fileJson = "[]";
  }
  const recentFiles = JSON.parse(fileJson);
  return recentFiles;
}
