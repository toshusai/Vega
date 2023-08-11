import { TreeViewItem } from "../TreeItem";

export function insertPrevSibling(
  items: TreeViewItem[],
  id: string,
  newItem: TreeViewItem
): TreeViewItem[] {
  const newItems: TreeViewItem[] = [];
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
