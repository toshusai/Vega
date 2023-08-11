import { TreeViewItem } from "../TreeItem";

export function insertNextSibling(
  items: TreeViewItem[],
  id: string,
  newItem: TreeViewItem
): TreeViewItem[] {
  const newItems: TreeViewItem[] = [];
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
