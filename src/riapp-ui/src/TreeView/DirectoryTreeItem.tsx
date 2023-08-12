import React, { useState } from "react";
import styled from "styled-components";

import { TreeItem, TreeViewItem } from "./TreeItem";
import { TreeView, WithTreeItemEvent } from "./TreeView";
import { useIsSelectedItem } from "./useIsSelectedItem";

export const DirectoryTreeItem = React.memo(function DirectoryTreeView<
  U,
  T extends TreeViewItem<U>
>(props: {
  item: T;
  depth?: number;
  renderItem: (item: T) => React.ReactNode;
  onMouseDown?: WithTreeItemEvent<U, T>;
  onMouseMove?: WithTreeItemEvent<U, T>;
  onMouseUp?: WithTreeItemEvent<U, T>;
  onClick?: WithTreeItemEvent<U, T>;
}) {
  const [open, setOpen] = useState(true);
  const depth = props.depth ?? 0;
  const isSelected = useIsSelectedItem(props.item);
  return (
    <TreeViewRootUl>
      <TreeItem
        depth={depth}
        selected={isSelected}
        onMouseDown={(e) => props.onMouseDown?.(props.item, e)}
        onMouseMove={(e) => props.onMouseMove?.(props.item, e)}
        onMouseUp={(e) => props.onMouseUp?.(props.item, e)}
        onClick={(e) => props.onClick?.(props.item, e)}
      >
        {(props.item.children?.length ?? 0) > 0 ? (
          <Button onClick={() => setOpen(!open)}>{open ? "-" : "+"}</Button>
        ) : (
          <Button style={{ visibility: "hidden" }}>-</Button>
        )}
        <div
          style={{
            pointerEvents: "none",
          }}
        >
          {props.renderItem(props.item)}
        </div>
      </TreeItem>
      {open && (
        <TreeView
          depth={depth + 1}
          items={props.item.children}
          renderItem={props.renderItem as any}
          onMouseMove={props.onMouseMove as any}
          onMouseDown={props.onMouseDown as any}
          onMouseUp={props.onMouseUp as any}
          onClick={props.onClick as any}
        />
      )}
    </TreeViewRootUl>
  );
});

const Button = styled.button`
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  color: var(--color-text);
  width: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TreeViewRootUl = styled.ul`
  padding: 0;
  margin: 0;

  user-select: none;
  width: 100%;
`;
