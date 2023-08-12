import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "./TreeView";

const meta = {
  component: TreeView,
} satisfies Meta<typeof TreeView>;

export default meta;

const items: any[] = [
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
export const Basic: StoryObj<typeof meta> = {
  args: {
    items: items,
    renderItem: (item: any) => {
      return <div>{item.data.name}</div>;
    },
  },
};
