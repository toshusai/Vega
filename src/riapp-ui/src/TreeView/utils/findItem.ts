import { TreeViewItem } from "../TreeItem";

export function findItem<T>(
  items: TreeViewItem<T>[],
  id: string
): TreeViewItem<T> | null {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
