import { TreeViewItem } from "../TreeItem";

export function removeItem(items: TreeViewItem[], id: string): TreeViewItem[] {
  const newItems: TreeViewItem[] = [];
  for (const item of items) {
    if (item.id === id) {
      continue;
    }
    if (item.children) {
      item.children = removeItem(item.children, id);
    }
    if (item.children?.length === 0) {
      delete item.children;
    }
    newItems.push(item);
  }
  return newItems;
}
