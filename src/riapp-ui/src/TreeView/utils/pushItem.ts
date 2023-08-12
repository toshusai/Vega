import { TreeViewItem } from "../TreeItem";

export function pushItem<T>(
  items: TreeViewItem<T>[],
  parentId: string,
  addItem: TreeViewItem<T>
): TreeViewItem<T>[] {
  return items.map((item) => {
    if (item.id === parentId) {
      if (item.children) {
        item.children.push(addItem);
      }
    } else if (item.children) {
      item.children = pushItem(item.children, parentId, addItem);
    }
    return item;
  });
}
