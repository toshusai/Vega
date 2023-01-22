import { FC, useRef, useState } from "react";
import { StyledContextMenuButton } from "../components/ContextMenu";
import { filePick } from "./filePick";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { DropdownMenu } from "./DropdownMenu";
import { DeviceFloppy, File } from "tabler-icons-react";
import { iconProps } from "../components/iconProps";
import { download } from ".";
import store from "../store";
import { actions } from "../store/scene";

export const MenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
    window.addEventListener("mousedown", handleMouseDown, {
      capture: true,
    });
  };

  const handleFilePick = () => {
    filePick((str) => {
      const json = JSON.parse(str);

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

      store.dispatch(actions.setAll(json));
      setShowMenu(false);
    });
  };

  const handleSave = () => {
    const data = store.getState();
    const json = JSON.stringify(
      data,
      (_, value) => {
        if (Array.isArray(value) && value instanceof Array) {
          return [...value].sort();
        }
        if (value instanceof Object) {
          const ordered = {};
          Object.keys(value)
            .sort()
            .forEach((key) => {
              ordered[key] = value[key];
            });

          return ordered;
        }

        return value;
      },
      2
    );
    download(json, "vega.json");
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
      <HeaderMenuButton onClick={handleClick}>File</HeaderMenuButton>
      {showMenu && (
        <DropdownMenu>
          <StyledContextMenuButton onClick={handleFilePick}>
            <File {...iconProps} />
            <div style={{ marginLeft: "2px" }}>Open</div>
          </StyledContextMenuButton>
          <StyledContextMenuButton onClick={handleSave}>
            <DeviceFloppy {...iconProps} />
            <div style={{ marginLeft: "2px" }}>Save</div>
          </StyledContextMenuButton>
        </DropdownMenu>
      )}
    </div>
  );
};
