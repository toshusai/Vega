import type { Meta, StoryObj } from "@storybook/react";

import { EditableTree } from "./EditableTree";
import { useCallback, useState } from "react";
import { TreeViewItem } from "./TreeItem";
import { PosType } from "./utils/checkPosType";
import { containItem, pushItem } from "./utils";
import { insertNextSibling } from "./utils";
import { insertPrevSibling } from "./utils";
import { removeItem } from "./utils";
const meta = {
  component: EditableTree,
} satisfies Meta<typeof EditableTree>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
  args: {
    items: [
      {
        id: "root",
        name: "root",
        children: [
          {
            id: "child1",
            name: "child1",
          },
          {
            id: "child2",
            name: "child2",
          },
          {
            id: "child3",
            name: "child3",
            children: [
              {
                id: "child3-1",
                name: "child3-1",
              },
              {
                id: "child3-2",
                name: "child3-2",
              },
            ],
          },
          {
            id: "child4",
            name: "child4",
          },
        ],
      },
    ],
    renderItem: (item) => {
      return <div>{item.name}</div>;
    },
  },
  render: (props) => {
    const [items, setItems] = useState(props.items);

    const handleOrderChange = useCallback(
      async (
        sourceItem: TreeViewItem,
        targetItem: TreeViewItem,
        pos: PosType
      ) => {
        setItems((items) => {
          if (!items) return;
          let newItems = JSON.parse(JSON.stringify(items));
          if (containItem(newItems, sourceItem.id, targetItem.id)) {
            return newItems;
          }
          if (pos === PosType.Middle) {
            newItems = removeItem(newItems, sourceItem.id);
            newItems = pushItem(newItems, targetItem.id, sourceItem);
          } else if (pos === PosType.Bottom) {
            newItems = removeItem(newItems, sourceItem.id);
            newItems = insertNextSibling(newItems, targetItem.id, sourceItem);
          } else if (pos === PosType.Top) {
            newItems = removeItem(newItems, sourceItem.id);
            newItems = insertPrevSibling(newItems, targetItem.id, sourceItem);
          }
          return newItems;
        });
      },
      [items]
    );
    return (
      <>
        <EditableTree
          {...props}
          onOrderChange={handleOrderChange}
          items={items}
        />
      </>
    );
  },
};
