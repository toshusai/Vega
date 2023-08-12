import { TreeViewItem } from "../TreeItem";

export function findParentItem<T>(
  items: TreeViewItem<T>[],
  id: string
): TreeViewItem<T> | null {
  for (const item of items) {
    if (item.children) {
      for (const child of item.children) {
        if (child.id === id) {
          return item;
        }
      }
      const found = findParentItem(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
