import React, { useState } from "react";
import styled from "styled-components";

import { TreeView } from "./TreeView";
import { TreeItem, TreeViewItem } from "./TreeItem";

export const DirectoryTreeItem = React.memo(function DirectoryTreeView(
  props: TreeViewItem & {
    depth?: number;
    onMouseDown?: (
      item: TreeViewItem,
      e: React.MouseEvent<HTMLElement, MouseEvent>
    ) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onMouseUp?: (
      item: TreeViewItem,
      e: React.MouseEvent<HTMLElement, MouseEvent>
    ) => void;
  }
) {
  const [open, setOpen] = useState(true);
  const depth = props.depth ?? 0;
  return (
    <TreeViewRootUl>
      <TreeItem
        depth={depth}
        onMouseDown={(e) =>
          props.onMouseDown?.(
            {
              id: props.id,
              name: props.name,
              children: props.children,
            },
            e
          )
        }
        onMouseMove={props.onMouseMove}
        onMouseUp={(e) =>
          props.onMouseUp?.(
            {
              id: props.id,
              name: props.name,
              children: props.children,
            },
            e
          )
        }
      >
        <Button onClick={() => setOpen(!open)}>{open ? "-" : "+"}</Button>
        <div
          style={{
            pointerEvents: "none",
          }}
        >
          {props.name}
        </div>
      </TreeItem>
      {open && (
        <TreeView
          depth={depth + 1}
          items={props.children}
          renderItem={(item) => {
            return item.name;
          }}
          onMouseDown={props.onMouseDown}
          onMouseMove={props.onMouseMove}
          onMouseUp={props.onMouseUp}
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
