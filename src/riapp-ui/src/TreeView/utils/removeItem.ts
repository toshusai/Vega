import { TreeViewItem } from "../TreeItem";

export function removeItem<T>(
  items: TreeViewItem<T>[],
  id: string
): TreeViewItem<T>[] {
  const newItems: TreeViewItem<T>[] = [];
  for (const item of items) {
    if (item.id === id) {
      continue;
    }
    if (item.children) {
      item.children = removeItem(item.children, id);
    }
    newItems.push(item);
  }
  return newItems;
}
