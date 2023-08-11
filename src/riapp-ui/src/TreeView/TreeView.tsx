import React from "react";

import { DirectoryTreeItem } from "./DirectoryTreeItem";
import { TreeItem, TreeViewItem } from "./TreeItem";

export const TreeView = React.memo(function TreeView(props: {
  items?: TreeViewItem[];
  renderItem: (item: TreeViewItem) => React.ReactNode;
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
}) {
  const depth = props.depth ?? 0;
  return (
    <>
      {props.items?.map((item) => {
        return (
          <React.Fragment key={item.id}>
            {item.children ? (
              <DirectoryTreeItem
                id={item.id}
                name={item.name}
                children={item.children}
                depth={depth}
                onMouseDown={props.onMouseDown}
                onMouseMove={props.onMouseMove}
                onMouseUp={props.onMouseUp}
              />
            ) : (
              <TreeItem
                style={{
                  marginLeft: "12px",
                }}
                onMouseDown={(e) => props.onMouseDown?.(item, e)}
                onMouseMove={props.onMouseMove}
                onMouseUp={(e) => props.onMouseUp?.(item, e)}
                depth={depth}
              >
                {item.name}
              </TreeItem>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});
