import { FC, useState } from "react";
import { ArrowRight, type IconProps } from "tabler-icons-react";

import { MenuItemBase } from "./MenuItemBase";
import { StyledContextMenuButton } from "../context_menu";
import { iconProps } from "../iconProps";
import { DropdownMenu } from "../DropdownMenu";

export function MenuWithClildren(props: {
  title: string;
  leftIcon?: FC<IconProps>;
  children: React.ReactNode;
}) {
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
    }, 200);
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
      <MenuItemBase text={props.title} leftIcon={props.leftIcon}>
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
      </MenuItemBase>
    </StyledContextMenuButton>
  );
}
