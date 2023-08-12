import React from "react";

import { DirectoryTreeItem } from "./DirectoryTreeItem";
import { TreeItem, TreeViewItem } from "./TreeItem";
import { useIsSelectedItem } from "./useIsSelectedItem";

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
  onMouseMove?: WithTreeItemEvent<U, T>;
  onMouseUp?: WithTreeItemEvent<U, T>;
  onClick?: WithTreeItemEvent<U, T>;
}) {
  const depth = props.depth ?? 0;
  return (
    <>
      {props.items?.map((item) => {
        return (
          <TreeItemOrDir
            key={item.id}
            item={item}
            depth={depth}
            renderItem={props.renderItem}
            onClick={props.onClick}
            onMouseDown={props.onMouseDown}
            onMouseMove={props.onMouseMove}
            onMouseUp={props.onMouseUp}
          />
        );
      })}
    </>
  );
});

function TreeItemOrDir<U, T extends TreeViewItem<U>>(props: {
  item: T;
  renderItem: (item: T) => React.ReactNode;
  depth?: number;
  onMouseDown?: WithTreeItemEvent<U, T>;
  onMouseMove?: WithTreeItemEvent<U, T>;
  onMouseUp?: WithTreeItemEvent<U, T>;
  onClick?: WithTreeItemEvent<U, T>;
}) {
  const item = props.item;
  const isSelected = useIsSelectedItem(item);
  return (
    <>
      {props.item.children !== undefined ? (
        <DirectoryTreeItem
          item={item}
          depth={props.depth}
          onMouseMove={props.onMouseMove as any}
          renderItem={props.renderItem as any}
          onMouseDown={props.onMouseDown as any}
          onMouseUp={props.onMouseUp as any}
        />
      ) : (
        <TreeItem
          selected={isSelected}
          onMouseDown={(e) => props.onMouseDown?.(item, e)}
          onMouseMove={(e) => props.onMouseMove?.(item, e)}
          onMouseUp={(e) => props.onMouseUp?.(item, e)}
          onClick={(e) => props.onClick?.(item, e)}
          depth={(props.depth ?? 0) + 1}
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
    </>
  );
}
