import { Key, KeyboardInput } from "@/app-ui/src/KeyboardInput";
import { writeFile } from "@/ipc/writeFile";
import store from "@/store";
import { appAction } from "@/store/app";
import { actions } from "@/store/scene";
import { UndoManager } from "@/UndoManager";

import { checkFocus } from "./checkFocus";
import { sortStringify } from "./formatForSave";
import { registerGlobalVar } from "./registerGlobalVar";

export function initGlobalEvent() {
  registerGlobalVar();
  KeyboardInput.init(() => {
    document.addEventListener("visibilitychange", () => {
      store.dispatch(actions.setIsPlaying(false));
      document.querySelectorAll("video").forEach((video) => {
        video.pause();
      });
      document.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
      });
    });

    KeyboardInput.addKeyDownListener(Key.KeyS, (e) => {
      if (checkFocus()) {
        return;
      }
      e.preventDefault();
      if (KeyboardInput.isPressed(Key.Meta)) {
        const url = store.getState().app.currentPath;
        const data = sortStringify(store.getState().scene);
        if (!writeFile(url, data)) {
          throw new Error("Failed to save file");
        }
        store.dispatch(appAction.setReadedDataJsonString(data));
        // NOTE: This is a hack for FileWatcher that subscribes UndoManager
        UndoManager.main.emit("change");
      }
    });

    KeyboardInput.addKeyDownListener(Key.KeyZ, (e) => {
      if (checkFocus()) {
        return;
      }
      e.preventDefault();
      if (
        KeyboardInput.isPressed(Key.Shift) &&
        KeyboardInput.isPressed(Key.Meta)
      ) {
        UndoManager.main.redo();
      } else {
        if (KeyboardInput.isPressed(Key.Meta)) {
          UndoManager.main.undo();
        }
      }
    });
  });
}
