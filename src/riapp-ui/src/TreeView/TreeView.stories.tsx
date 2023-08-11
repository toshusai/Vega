import type { Meta, StoryObj } from "@storybook/react";
import { TreeView } from "./TreeView";

const meta = {
  component: TreeView,
} satisfies Meta<typeof TreeView>;

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
};
