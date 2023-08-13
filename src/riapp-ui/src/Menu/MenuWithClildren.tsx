import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, type IconProps } from "tabler-icons-react";

import { StyledContextMenuButton } from "../context_menu";
import { DropdownMenu } from "../DropdownMenu";
import { iconProps } from "../iconProps";
import { MenuItemBase } from "./MenuItemBase";

function tryRepeatUntilSuccess(
  func: () => void,
  interval: number,
  timeout: number
) {
  const startTime = Date.now();
  const id = setInterval(() => {
    if (Date.now() - startTime > timeout) {
      clearInterval(id);
      return;
    }
    try {
      func();
      clearInterval(id);
    } catch (e) {
      console.error(e);
    }
  }, interval);
}

export function MenuWithClildren(props: {
  title: string;
  leftIcon?: FC<IconProps>;
  children: React.ReactNode;
  showMenu: boolean;
  setShowMenu: (showMenu: boolean) => void;
}) {
  const { showMenu, setShowMenu } = props;
  const _id = useRef<NodeJS.Timeout | null>(null);
  const onMouseEnter = useCallback(() => {
    setShowMenu(true);
    if (_id.current != null) {
      clearTimeout(_id.current);
      _id.current = null;
    }
  }, []);
  const onMouseLeave = useCallback(() => {
    _id.current = setTimeout(() => {
      setShowMenu(false);
      _id.current = null;
    }, 100);
  }, [setShowMenu]);

  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useKeyboardMenuHandler(ref, showMenu, setShowMenu, buttonRef);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") {
        setShowMenu(true);
        tryRepeatUntilSuccess(
          () => {
            if (!ref.current) throw new Error("ref.current is null");
            const focusableElements = getFocusableElements(ref.current);
            if (!focusableElements) throw new Error("no focusable");
            const focusableElement = focusableElements?.[0];
            if (!focusableElement || !(focusableElement instanceof HTMLElement))
              throw new Error("no focusable");
            focusableElement?.focus();
          },
          10,
          1000
        );
      }
    },
    [ref, setShowMenu]
  );

  return (
    <>
      <StyledContextMenuButton
        ref={buttonRef}
        style={{
          display: "flex",
          position: "relative",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onMouseEnter}
        onKeyDown={handleKeyDown}
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
        </MenuItemBase>
        <div
          style={{
            width: "5px",
            position: "absolute",
            right: "-5px",
            height: "100%",
          }}
        ></div>
      </StyledContextMenuButton>
      {showMenu && (
        <DropdownMenu
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          ref={ref}
          style={{
            position: "absolute",
            left: "calc(100%)",
            top: "-2px",
          }}
        >
          {props.children}
        </DropdownMenu>
      )}
    </>
  );
}

function getFocusableElements(element: HTMLElement) {
  return element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
}

export function useKeyboardMenuHandler(
  ref: React.RefObject<HTMLDivElement>,
  showMenu: boolean,
  setShowMenu: (showMenu: boolean) => void,
  buttonRef?: React.RefObject<HTMLButtonElement>
) {
  useEffect(() => {
    if (showMenu) {
      const focusableElements = getFocusableElements(
        ref.current as HTMLDivElement
      );
      let index = -1;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setShowMenu(false);
        } else if (e.key === "Tab") {
          setShowMenu(false);
        } else if (e.key === "ArrowDown") {
          if (!focusableElements) return;
          index++;
          if (index >= focusableElements?.length) {
            index = 0;
          }
          const focusableElement = focusableElements?.[index];
          if (!focusableElement || !(focusableElement instanceof HTMLElement))
            return;
          focusableElement?.focus();
        } else if (e.key === "ArrowUp") {
          if (!focusableElements) return;
          index--;
          if (index < 0) {
            index = focusableElements?.length - 1;
          }
          const focusableElement = focusableElements?.[index];
          if (!focusableElement || !(focusableElement instanceof HTMLElement))
            return;
          focusableElement?.focus();
        } else if (e.key === "ArrowLeft") {
          setShowMenu(false);
          buttonRef?.current?.focus();
        }
      };
      const handleMouseDown = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement) {
          if (ref.current?.contains(e.target)) {
            return;
          }

          setShowMenu(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("mousedown", handleMouseDown, {
        capture: true,
      });
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mousedown", handleMouseDown);
      };
    }
  }, [buttonRef, ref, setShowMenu, showMenu]);
}
