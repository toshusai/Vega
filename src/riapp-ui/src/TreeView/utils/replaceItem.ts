import { TreeViewItem } from "../TreeItem";

function replaceItem<T>(
  items: TreeViewItem<T>[],
  id: string,
  newItem: TreeViewItem<T>
): TreeViewItem<T>[] {
  return items.map((item) => {
    if (item.id === id) {
      return newItem;
    }
    if (item.children) {
      return {
        ...item,
        children: replaceItem(item.children, id, newItem),
      };
    }
    return item;
  });
}
