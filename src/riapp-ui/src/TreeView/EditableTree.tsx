import React from "react";
import styled from "styled-components";
import { useDragHandler } from "../utils";
import { TreeViewItem } from "./TreeItem";
import { checkPosType, PosType } from "./utils/checkPosType";
import { TreeView } from "./TreeView";

export function EditableTree<U, T extends TreeViewItem<U>>(props: {
  items?: T[];
  renderItem: (item: T) => React.ReactNode;
  depth?: number;
  onOrderChange?: (start: T, end: T, pos: PosType) => void;
}) {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const di = React.useRef<T | null>(null);
  const pos = React.useRef<PosType | null>(null);
  const handleMouseDown = useDragHandler<
    | {
        el: HTMLElement | null;
      }
    | undefined,
    | {
        el: HTMLElement | null;
      }
    | undefined
  >(
    (ctx) => {
      const el = ctx.pass?.el;
      if (!el) return;
      const tx = ctx.startX + ctx.diffX;
      const ty = ctx.startY + ctx.diffY;
      el.style.top = ty + "px";
      el.style.left = tx + "px";

      const e = ctx.event;
      const posType = checkPosType(e);
      const target = e.target as HTMLElement;
      if (!ref.current?.contains(target)) {
        return;
      }
      let top = 0;
      if (posType === PosType.Top) {
        top = target.offsetTop;
      }
      if (posType === PosType.Bottom) {
        top = target.offsetTop + target.offsetHeight;
      }
      if (posType === PosType.Middle) {
        top = target.offsetTop + target.offsetHeight / 2 - 6;
      }
      pos.current = posType ?? null;
      if (lineRef.current) {
        lineRef.current.style.top = top + "px";
        const style = getComputedStyle(target);
        const pd = style.getPropertyValue("padding-left");
        const left = parseInt(pd.substring(0, pd.length - 2));
        lineRef.current.style.marginLeft = left + "px";
        lineRef.current.style.height =
          posType === PosType.Middle ? "12px" : "1px";
        lineRef.current.style.border =
          posType === PosType.Middle
            ? "1px solid var(--color-primary)"
            : "none";
        lineRef.current.style.backgroundColor =
          posType === PosType.Middle ? "transparent" : "";
        lineRef.current.style.width = target.clientWidth - left + "px";
        lineRef.current.style.visibility = "visible";
      }

      return {
        el,
      };
    },
    (ctx) => {
      const el = ctx.startEvent.target as HTMLElement;
      if (!el) {
        return;
      }
      if (el.tagName === "BUTTON") return;
      ctx.startEvent.stopImmediatePropagation();
      ctx.startEvent.preventDefault();
      ctx.startEvent.stopPropagation();
      const clone = el.cloneNode(true) as HTMLElement;
      clone.style.position = "absolute";
      clone.style.zIndex = "1000";
      clone.style.top = ctx.startEvent.clientY + "px";
      clone.style.left = ctx.startEvent.clientX + "px";
      clone.style.pointerEvents = "none";

      document.body.appendChild(clone);
      return {
        el: clone,
      };
    },
    (ctx) => {
      const el = ctx.pass?.el;
      if (!el) return;
      el.remove();
      if (lineRef.current) {
        lineRef.current.style.visibility = "hidden";
      }
    }
  );

  const handleMouseDownMemo = React.useCallback(
    (item: T, e: React.MouseEvent<Element, MouseEvent>) => {
      di.current = item;
      handleMouseDown(e);
    },
    [handleMouseDown]
  );

  const handleMouseUpMemo = React.useCallback(
    (item: T, e: React.MouseEvent<Element, MouseEvent>) => {
      if (!di.current) return;
      if (di.current.id === item.id) return;
      props.onOrderChange?.(di.current, item, pos.current ?? PosType.Middle);
      di.current = null;
    },
    []
  );

  const memoTreeView = React.useMemo(() => {
    return (
      <TreeView
        items={props.items}
        depth={props.depth}
        renderItem={props.renderItem as any}
        onMouseDown={handleMouseDownMemo as any}
        onMouseUp={handleMouseUpMemo as any}
      />
    );
  }, [
    handleMouseDownMemo,
    handleMouseUpMemo,
    props.depth,
    props.items,
    props.renderItem,
  ]);

  const handleMouseLeave = React.useCallback(() => {
    if (lineRef.current) {
      lineRef.current.style.visibility = "hidden";
    }
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    if (lineRef.current && di.current) {
      lineRef.current.style.visibility = "visible";
    }
  }, []);

  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <EditableTreeRoot
      ref={ref}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <InsertionLine ref={lineRef} />
      {memoTreeView}
    </EditableTreeRoot>
  );
}

const InsertionLine = styled.div`
  display: flex;
  position: absolute;
  visibility: hidden;
  width: 100%;
  height: 2px;
  background-color: var(--color-primary);
  z-index: 1000;
  pointer-events: none;
  transform: translateY(-1px);
`;

const EditableTreeRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
