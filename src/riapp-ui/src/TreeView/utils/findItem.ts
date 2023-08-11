import { TreeViewItem } from "../TreeItem";

function findItem(items: TreeViewItem[], id: string): TreeViewItem | null {
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
