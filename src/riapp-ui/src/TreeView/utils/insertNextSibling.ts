import { TreeViewItem } from "../TreeItem";

export function insertNextSibling<T>(
  items: TreeViewItem<T>[],
  id: string,
  newItem: TreeViewItem<T>
): TreeViewItem<T>[] {
  const newItems: TreeViewItem<T>[] = [];
  for (const item of items) {
    if (item.id === id) {
      newItems.push(item);
      newItems.push(newItem);
      continue;
    }
    if (item.children) {
      item.children = insertNextSibling(item.children, id, newItem);
    }
    newItems.push(item);
  }
  return newItems;
}
