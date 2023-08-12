import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";

import { Key, KeyboardInput } from "../KeyboardInput";
import { EditableTree } from "./EditableTree";
import { TreeViewItem } from "./TreeItem";
import { useTreeItems } from "./useTreeItems";
import { DummyClick } from "../../__tests__/DummyClick";
import { wait } from "../utils/wait";

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

export const Basic: StoryObj<typeof meta> = {
  args: {
    items,
  },
  render: (props) => {
    useEffect(() => {
      KeyboardInput.init(() => {});
    }, []);
    const [items, handleOrderChange] = useTreeItems<Data>(
      props.items as TreeViewItem<Data>[]
    );
    return (
      <>
        <EditableTree<Data, Item>
          onOrderChange={handleOrderChange}
          items={items as Item[]}
          renderItem={(item) => {
            return <div style={{}}>{item.data.name}</div>;
          }}
          onClick={(item) => {}}
        />
      </>
    );
  },
};

export const $Select2ItemsAndDaDToDir: StoryObj<typeof meta> = {
  args: {
    items,
  },
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mouse = new DummyClick();
    const lis = document.querySelectorAll(`li`);
    for (let i = 0; i < lis.length; i++) {
      const el = lis[i];
      if (el.textContent === "item-1") {
        await mouse.down(el);
        await mouse.up(el);
      }
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Shift" }));
      await wait(100);
      if (el.textContent === "item-3") {
        const p = await mouse.down(el);
        document.dispatchEvent(new KeyboardEvent("keyup", { key: "Shift" }));
        await wait(100);
        await mouse.move(p.x, p.y, p.x, p.y + 24, 1000);
        await mouse.upFromPos(p.x, p.y + 24);
      }
    }
    mouse.destory();
  },

  render: (props) => {
    useEffect(() => {
      KeyboardInput.init(() => {});
    }, []);
    const [items, handleOrderChange] = useTreeItems<Data>(
      props.items as TreeViewItem<Data>[]
    );
    return (
      <>
        <EditableTree<Data, Item>
          onOrderChange={handleOrderChange}
          items={items as Item[]}
          renderItem={(item) => {
            return <div style={{}}>{item.data.name}</div>;
          }}
          onClick={(item) => {}}
        />
      </>
    );
  },
};
