import { IconDeviceFloppy } from "@tabler/icons-react";
import { FC, useEffect, useState } from "react";
import { Clock, File } from "tabler-icons-react";

import {
  iconProps,
  MenuItem,
  MenuWithClildren,
  StyledContextMenuButton,
  ToolBarMenu,
} from "@/app-ui/src";
import { readFile } from "@/ipc/readFile";
import { writeFileUserDataDir } from "@/ipc/writeFileUserDataDir";
import { loadAllAssets } from "@/rendering/recorder";
import store from "@/store";
import { appAction } from "@/store/app";
import { actions, SceneState } from "@/store/scene";
import { UndoManager } from "@/UndoManager";
import { compareScene } from "@/utils/compareScene";
import { download } from "@/utils/download";
import { filePick } from "@/utils/filePick";
import { sortStringify } from "@/utils/formatForSave";
import { readRecentFiles } from "@/utils/readRecentFiles";

export const MenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      const scene = store.getState().scene;
      const old = JSON.parse(store.getState().app.readedDataJsonString);
      if (!compareScene(scene, old)) {
        setHasChanged(true);
      } else {
        setHasChanged(false);
      }
    };

    UndoManager.main.addEventListener("change", handleChange);
    return () => {
      UndoManager.main.removeEventListener("change", handleChange);
    };
  }, []);

  const handleFilePick = () => {
    filePick((str, path) => {
      const json = JSON.parse(str) as SceneState;

      const recentFiles = readRecentFiles();
      if (!recentFiles.includes(path)) {
        recentFiles.push(path);
      }
      writeFileUserDataDir("recentFiles.json", JSON.stringify(recentFiles));

      const walk = (obj: any) => {
        if (obj instanceof Object) {
          const keys = Object.keys(obj);
          keys.forEach((key) => {
            if (Array.isArray(obj[key])) {
              obj[key] = [...obj[key]].sort();
            }
            walk(obj[key]);
          });
        }
      };
      walk(json);
      loadAllAssets(json);
      store.dispatch(actions.setAll(json));
      store.dispatch(appAction.setReadedDataJsonString(str));
      store.dispatch(appAction.setCurrentPath(path));
      setShowMenu(false);
    });
  };

  const handleSave = () => {
    const data = store.getState();
    const json = sortStringify(data.scene);
    download(json, "vega.json");
    setShowMenu(false);
  };

  return (
    <>
      <ToolBarMenu
        title={`File${hasChanged ? "*" : ""}`}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      >
        <StyledContextMenuButton onClick={handleFilePick}>
          <MenuItem
            leftIcon={<File {...iconProps} />}
            text="Open"
            shortcut="⌘ O"
          ></MenuItem>
        </StyledContextMenuButton>

        <RecentFilesMenu
          onClose={() => {
            setShowMenu(false);
          }}
        />

        <StyledContextMenuButton onClick={handleSave}>
          <MenuItem
            leftIcon={<IconDeviceFloppy {...iconProps} />}
            text="Save"
            shortcut="⌘ S"
          ></MenuItem>
        </StyledContextMenuButton>
      </ToolBarMenu>
    </>
  );
};

export function openFile(path: string) {
  const recentFiles = readRecentFiles();
  if (!recentFiles.includes(path)) {
    recentFiles.push(path);
  }
  const projectDataStr = readFile(path);
  const projectData = JSON.parse(projectDataStr);
  loadAllAssets(projectData);
  store.dispatch(actions.setAll(projectData));
  store.dispatch(appAction.setReadedDataJsonString(projectDataStr));
  store.dispatch(appAction.setCurrentPath(path));
  writeFileUserDataDir("recentFiles.json", JSON.stringify(recentFiles));
}

function RecentFilesMenu(props: { onClose?: () => void }) {
  const [showMenu, setShowMenu] = useState(false);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);
  const handleOpen = (path: string) => () => {
    openFile(path);
    props.onClose?.();
    setShowMenu(false);
  };

  useEffect(() => {
    const recentFiles = readRecentFiles();
    setRecentFiles(recentFiles);
  }, []);
  return (
    <MenuWithClildren
      title={"Open Recent"}
      leftIcon={<Clock {...iconProps} />}
      setShowMenu={setShowMenu}
      showMenu={showMenu}
    >
      {recentFiles.map((path) => {
        return (
          <StyledContextMenuButton key={path} onClick={handleOpen(path)}>
            <MenuItem text={path}></MenuItem>
          </StyledContextMenuButton>
        );
      })}
    </MenuWithClildren>
  );
}
