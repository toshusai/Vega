import { TreeViewItem } from "../TreeItem";

export function pushItem(
  items: TreeViewItem[],
  parentId: string,
  addItem: TreeViewItem
): TreeViewItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      if (!item.children) {
        item.children = [];
      }
      item.children.push(addItem);
    } else if (item.children) {
      item.children = pushItem(item.children, parentId, addItem);
    }
    return item;
  });
}


