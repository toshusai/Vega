import { TreeViewItem } from "../TreeItem";

function replaceItem(
  items: TreeViewItem[],
  id: string,
  newItem: TreeViewItem
): TreeViewItem[] {
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
