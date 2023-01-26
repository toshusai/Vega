import store from "../store";
import { Key, KeyboardInput } from "../KeyboardInput";
import { formatForSave } from "./formatForSave";
import { writeFile } from "../ipc/writeFile";
import { appAction } from "../store/app";
import { UndoManager } from "../UndoManager";

export function initGlobalEvent() {
  KeyboardInput.init(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.querySelectorAll("video").forEach((video) => {
          video.pause();
        });
        document.querySelectorAll("audio").forEach((audio) => {
          audio.pause();
        });
      } else {
      }
    });
    KeyboardInput.addKeyDownListener(Key.KeyS, (e) => {
      const el = document.activeElement;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
      if (KeyboardInput.isPressed(Key.Meta)) {
        const url = store.getState().app.currentPath;
        const data = formatForSave(store.getState().scene);
        if (!writeFile(url, data)) {
          throw new Error("Failed to save file");
        }
        store.dispatch(appAction.setReadedDataJsonString(data));
        // NOTE: This is a hack for FileWatcher that subscribes UndoManager
        UndoManager.main.emit("change");
      }
    });
    KeyboardInput.addKeyDownListener(Key.KeyZ, (e) => {
      e.preventDefault();
      if (KeyboardInput.isPressed(Key.Shift) &&
        KeyboardInput.isPressed(Key.Meta)) {
        UndoManager.main.redo();
      } else {
        if (KeyboardInput.isPressed(Key.Meta)) {
          UndoManager.main.undo();
        }
      }
    });
  });
}
