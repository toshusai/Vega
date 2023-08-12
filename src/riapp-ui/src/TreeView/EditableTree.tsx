import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { Key, KeyboardInput } from "../KeyboardInput";
import { useDragHandler } from "../utils";
import { TreeViewItem } from "./TreeItem";
import { TreeView } from "./TreeView";
import { checkPosType, checkPosType2, PosType } from "./utils/checkPosType";
import { SelectedItemsContext } from "./SelectedItemsContext";

export function EditableTree<U, T extends TreeViewItem<U>>(props: {
  items?: T[];
  renderItem: (item: T) => React.ReactNode;
  depth?: number;
  onOrderChange?: (start: T, end: T, pos: PosType) => void;
  onChangeSelection?: (items: T[]) => void;
  onClick?: (item: T) => void;
}) {
  const lineRef = React.useRef<HTMLDivElement>(null);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [pos, setPos] = useState<PosType | null>(null);

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    props.onChangeSelection?.(selectedItems);
  }, [selectedItems]);

  const handleMouseDown = useDragHandler(
    (ctx) => {
      setDragging(true);
      const e = ctx.event;
      const tx = e.clientX;
      const ty = e.clientY;
      if (dragRef.current) {
        dragRef.current.style.top = ty - 12 + "px";
        dragRef.current.style.left = tx + "px";
      }
    },
    undefined,
    () => {
      setDragging(false);
    }
  );

  const handleMouseDownMemo = React.useCallback(
    (item: T, e: React.MouseEvent<Element, MouseEvent>) => {
      handleMouseDown(e);
      if (KeyboardInput.isPressed(Key.Shift)) {
        setSelectedItems((items) => {
          return [...(items ?? []), item];
        });
      } else if (!selectedItems.find((i) => i.id === item.id)) {
        setSelectedItems([item]);
      }
    },
    [handleMouseDown, selectedItems]
  );

  const handleMouseMove = React.useCallback(
    (item: T, e: React.MouseEvent<Element, MouseEvent>) => {
      if (dragging) {
        const posType =
          item.children === undefined
            ? checkPosType2(e.nativeEvent)
            : checkPosType(e.nativeEvent);
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON") return;
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
        if (posType !== undefined) setPos(posType);
        if (lineRef.current) {
          lineRef.current.style.top = top + "px";
          const style = getComputedStyle(target);
          const pd = style.getPropertyValue("padding-left");
          const left = parseInt(pd.substring(0, pd.length - 2));
          lineRef.current.style.marginLeft = left + "px";
          lineRef.current.style.width = target.clientWidth - left + "px";
          lineRef.current.style.visibility = "visible";
        }
      }
    },
    [dragging]
  );

  const handleMouseUpMemo = React.useCallback(
    (item: T, e: React.MouseEvent<Element, MouseEvent>) => {
      if (dragging) {
        selectedItems.forEach((i) => {
          props.onOrderChange?.(i, item, pos ?? PosType.Middle);
        });
      } else {
        if (!KeyboardInput.isPressed(Key.Shift)) {
          setSelectedItems([item]);
        }
      }
      setDragging(false);
      setPos(null);
      lineRef.current?.style.setProperty("visibility", "hidden");
    },
    [dragging, selectedItems, props, pos]
  );

  const handleMouseLeave = React.useCallback(() => {
    setPos(null);
    lineRef.current?.style.setProperty("visibility", "hidden");
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    setPos(null);
    if (dragging) {
      lineRef.current?.style.setProperty("visibility", "visible");
    }
  }, [dragging]);

  const memoTreeView = React.useMemo(() => {
    return (
      <TreeView
        items={props.items}
        depth={props.depth}
        renderItem={(item) => {
          return props.renderItem(item as any);
        }}
        onMouseMove={handleMouseMove as any}
        onMouseDown={handleMouseDownMemo as any}
        onMouseUp={handleMouseUpMemo as any}
      />
    );
  }, [
    props,
    handleMouseMove,
    handleMouseDownMemo,
    handleMouseUpMemo,
    selectedItems,
  ]);

  const ref = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <SelectedItemsContext.Provider value={selectedItems}>
        <EditableTreeRoot
          ref={ref}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <InsertionLine pos={pos ?? undefined} ref={lineRef} />
          {memoTreeView}
        </EditableTreeRoot>
        {dragging &&
          ReactDOM.createPortal(
            <DragDiv ref={dragRef}>
              {props.renderItem(selectedItems[0] as any)}
              <div>
                {selectedItems.length > 1 && `+${selectedItems.length - 1}`}
              </div>
            </DragDiv>,
            document.body
          )}
      </SelectedItemsContext.Provider>
    </>
  );
}

const DragDiv = styled.div`
  position: absolute;
  display: flex;
  gap: 8px;
  z-index: 1000;
  pointer-events: none;
  top: -9999px;
`;

const InsertionLine = styled.div<{
  pos?: PosType;
}>`
  display: flex;
  position: absolute;
  visibility: hidden;
  width: 100%;
  height: ${(props) => (props.pos === PosType.Middle ? "12px" : "1px")};
  background-color: ${(props) =>
    props.pos === PosType.Middle ? "transparent" : "var(--color-primary)"};
  border: ${(props) =>
    props.pos === PosType.Middle ? "1px dashed var(--color-primary)" : "none"};
  z-index: 1000;
  pointer-events: none;
  transform: translateY(-1px);
`;

const EditableTreeRoot = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
`;
