import type { Meta, StoryObj } from "@storybook/react";
import { VNumberInput } from ".";
import { useState } from "react";

const meta = {
  component: VNumberInput,
  argTypes: {},
} satisfies Meta<typeof VNumberInput>;

export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: (args) => {
    const [value, setValue] = useState(0);
    return <VNumberInput {...args} value={value} onInput={setValue} />;
  },
};
