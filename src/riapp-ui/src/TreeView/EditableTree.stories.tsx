import type { Meta, StoryObj } from "@storybook/react";

import { EditableTree } from "./EditableTree";
import { TreeViewItem } from "./TreeItem";
import { containItem, findParentItem } from "./utils";
import { useTreeItems } from "./useTreeItems";

const meta = {
  component: EditableTree,
} satisfies Meta<typeof EditableTree>;

export default meta;

type Item = TreeViewItem<Data>;

type Data = {
  name: string;
};

const items: Item[] = [
  {
    id: "root",
    data: {
      name: "root",
    },
    children: [
      {
        id: "item-1",
        data: {
          name: "item-1",
        },
      },
      {
        id: "item-2",
        data: {
          name: "item-2",
        },
      },
      {
        id: "dir-2",
        data: {
          name: "dir-2",
        },
        children: [
          {
            id: "item-3",
            data: {
              name: "item-3",
            },
          },
          {
            id: "item-4",
            data: {
              name: "item-4",
            },
          },
        ],
      },
      {
        id: "dir-1",
        children: [],
        data: {
          name: "dir-1",
        },
      },
    ],
  },
];

const renderItem: (item: Item) => React.ReactNode = (item: Item) => {
  return <div>{item.data.name}</div>;
};

export const Basic: StoryObj<typeof meta> = {
  args: {
    items,
  },
  render: (props) => {
    const [items, handleOrderChange] = useTreeItems<Data>(
      props.items as TreeViewItem<Data>[]
    );
    return (
      <>
        <EditableTree<Data, Item>
          onOrderChange={handleOrderChange}
          items={items as Item[]}
          renderItem={renderItem}
        />
      </>
    );
  },
};
