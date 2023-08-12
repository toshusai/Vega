import { useCallback, useState } from "react";
import { TreeViewItem } from "./TreeItem";
import { PosType } from "./utils/checkPosType";
import { findItem, pushItem } from "./utils";
import { insertNextSibling } from "./utils";
import { insertPrevSibling } from "./utils";
import { removeItem } from "./utils";

export function useTreeItems<T>(
  items: TreeViewItem<T>[]
): [
  TreeViewItem<T>[],
  (
    sourceItem: TreeViewItem<T>,
    targetItem: TreeViewItem<T>,
    pos: PosType
  ) => void
] {
  const [itemsState, setItems] = useState(items);

  const handleOrderChange = useCallback(
    (
      sourceItem: TreeViewItem<T>,
      targetItem: TreeViewItem<T>,
      pos: PosType
    ) => {
      setItems((items) => {
        if (!items) return;
        let newItems = JSON.parse(JSON.stringify(items));
        const parent = findItem(newItems, sourceItem.id);
        if (parent && findItem([parent], targetItem.id)) {
          return newItems;
        }
        if (pos === PosType.Middle) {
          if (targetItem.children !== undefined) {
            newItems = removeItem(newItems, sourceItem.id);
            newItems = pushItem(newItems, targetItem.id, sourceItem);
          }
        } else if (pos === PosType.Bottom) {
          newItems = removeItem(newItems, sourceItem.id);
          newItems = insertNextSibling(newItems, targetItem.id, sourceItem);
        } else if (pos === PosType.Top) {
          newItems = removeItem(newItems, sourceItem.id);
          newItems = insertPrevSibling(newItems, targetItem.id, sourceItem);
        }
        return newItems;
      });
    },
    [items]
  );

  return [itemsState, handleOrderChange];
}
