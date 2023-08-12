import { TreeViewItem } from "../TreeItem";

export function insertPrevSibling<T>(
  items: TreeViewItem<T>[],
  id: string,
  newItem: TreeViewItem<T>
): TreeViewItem<T>[] {
  const newItems: TreeViewItem<T>[] = [];
  for (const item of items) {
    if (item.id === id) {
      newItems.push(newItem);
      newItems.push(item);
      continue;
    }
    if (item.children) {
      item.children = insertPrevSibling(item.children, id, newItem);
    }
    newItems.push(item);
  }
  return newItems;
}
