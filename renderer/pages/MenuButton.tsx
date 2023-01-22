import { FC, useRef, useState } from "react";
import { StyledContextMenuButton } from "../components/ContextMenu";
import { filePick } from "./filePick";
import { HeaderMenuButton } from "./HeaderMenuButton";
import { DropdownMenu } from "./DropdownMenu";

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
    });
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
            Open
          </StyledContextMenuButton>
        </DropdownMenu>
      )}
    </div>
  );
};
