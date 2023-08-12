import React from "react";

import { DirectoryTreeItem } from "./DirectoryTreeItem";
import { TreeItem, TreeViewItem } from "./TreeItem";

export type WithTreeItemEvent<U, T extends TreeViewItem<U>> = (
  item: T,
  e: React.MouseEvent<HTMLElement, MouseEvent>
) => void;

export const TreeView = React.memo(function TreeView<
  U,
  T extends TreeViewItem<U>
>(props: {
  items?: T[];
  renderItem: (item: T) => React.ReactNode;
  depth?: number;
  onMouseDown?: WithTreeItemEvent<U, T>;
  onMouseMove?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onMouseUp?: WithTreeItemEvent<U, T>;
}) {
  const depth = props.depth ?? 0;
  return (
    <>
      {props.items?.map((item) => {
        return (
          <React.Fragment key={item.id}>
            {item.children !== undefined ? (
              <DirectoryTreeItem
                item={item}
                depth={depth}
                onMouseMove={props.onMouseMove}
                renderItem={props.renderItem as any}
                onMouseDown={props.onMouseDown as any}
                onMouseUp={props.onMouseUp as any}
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
                <div
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  {props.renderItem(item)}
                </div>
              </TreeItem>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});
