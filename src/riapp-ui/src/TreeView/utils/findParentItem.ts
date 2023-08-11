import { TreeViewItem } from "../TreeItem";

function findParentItem(
  items: TreeViewItem[],
  id: string
): TreeViewItem | null {
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
