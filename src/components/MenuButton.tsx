import { FC, ReactChild, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Clock,
  DeviceFloppy,
  File,
  type IconProps,
} from "tabler-icons-react";

import { readFile } from "@/ipc/readFile";
import { writeFileUserDataDir } from "@/ipc/writeFileUserDataDir";
import { loadAllAssets } from "@/rendering/recorder";
import { DropdownMenu , iconProps , StyledContextMenuButton,ToolbarButton  } from "@/shared/src";
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
  const ref = useRef<HTMLDivElement>(null);
  const [recentFiles, setRecentFiles] = useState<string[]>([]);

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

  const handleClick = () => {
    setShowMenu(!showMenu);
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && ref.current.contains(e.target as Node)) {
        return;
      }
      setShowMenu(false);
      window.removeEventListener("mousedown", handleMouseDown, {
        capture: true,
      });
    };
    const recentFiles = readRecentFiles();
    setRecentFiles(recentFiles);
    window.addEventListener("mousedown", handleMouseDown, {
      capture: true,
    });
  };

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
  const handleOpen = (path: string) => () => {
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
    setShowMenu(false);
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        position: "relative",
      }}
    >
      <ToolbarButton onClick={handleClick}>
        File{hasChanged ? "*" : null}
      </ToolbarButton>
      {showMenu && (
        <DropdownMenu>
          <StyledContextMenuButton onClick={handleFilePick}>
            <MenuItem leftIcon={File} text="Open" shortcut="⌘ O"></MenuItem>
          </StyledContextMenuButton>

          <MenuWithClildren title={"Open Recent"} leftIcon={Clock}>
            {recentFiles.map((path) => {
              return (
                <StyledContextMenuButton key={path} onClick={handleOpen(path)}>
                  <MenuItem text={path}></MenuItem>
                </StyledContextMenuButton>
              );
            })}
          </MenuWithClildren>

          <StyledContextMenuButton onClick={handleSave}>
            <MenuItem
              leftIcon={DeviceFloppy}
              text="Save"
              shortcut="⌘ S"
            ></MenuItem>
          </StyledContextMenuButton>
        </DropdownMenu>
      )}
    </div>
  );
};

const MenuItem: FC<{
  leftIcon?: FC<IconProps>;
  text: string;
  shortcut?: string;
}> = (props) => {
  return (
    <>
      {props.leftIcon ? (
        props.leftIcon({
          ...iconProps,
          style: {
            ...iconProps.style,
            margin: "",
          },
        })
      ) : (
        <div style={{ marginLeft: "12px" }}></div>
      )}
      <div style={{ marginLeft: "2px", marginRight: "8px" }}>{props.text}</div>
      <div
        style={{
          marginLeft: "auto",
          color: "rgba(255, 255, 255, 0.5)",
          display: "flex",
          whiteSpace: "nowrap",
        }}
      >
        {props.shortcut}
      </div>
      <div style={{ marginRight: "12px" }}></div>
    </>
  );
};

type Props = {
  title: ReactChild;
  leftIcon?: FC<IconProps>;
};
const MenuWithClildren: FC<Props> = (props) => {
  const [showMenu, setShowMenu] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const onMouseEnter = () => {
    setShowMenu(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
  const onMouseLeave = () => {
    const id = setTimeout(() => {
      if (timeoutId) {
        setShowMenu(false);
      }
    }, 100);
    setTimeoutId(id);
  };

  return (
    <StyledContextMenuButton
      style={{
        display: "flex",
        position: "relative",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.leftIcon ? (
        props.leftIcon({
          ...iconProps,
          style: {
            ...iconProps.style,
            marginLeft: "",
          },
        })
      ) : (
        <div style={{ marginLeft: "12px" }}></div>
      )}
      <div style={{ marginLeft: "2px", marginRight: "8px" }}>{props.title}</div>
      <ArrowRight
        {...iconProps}
        color={"rgba(255, 255, 255, 0.5)"}
        style={{
          ...iconProps.style,
          marginRight: "",
          marginLeft: "auto",
        }}
      />
      {showMenu && (
        <DropdownMenu
          style={{
            position: "absolute",
            left: "calc(100%)",
            top: "-2px",
          }}
        >
          {props.children}
        </DropdownMenu>
      )}
    </StyledContextMenuButton>
  );
};
