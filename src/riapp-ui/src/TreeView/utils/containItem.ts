import { TreeViewItem } from "../TreeItem";

export function containItem<T>(
  items: TreeViewItem<T>[],
  parentId: string,
  childId: string
): boolean {
  return items.some((item) => {
    if (item.id === parentId) {
      if (!item.children) {
        return false;
      }
      return item.children.some((child) => child.id === childId);
    } else if (item.children) {
      return containItem(item.children, parentId, childId);
    }
    return false;
  });
}
