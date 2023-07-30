import type { Meta, StoryObj } from "@storybook/react";
import { HPanel, VPanel } from ".";
import {
  ExampleDiv,
  ExampleDiv2,
  ExampleDiv3,
  Root,
} from "./__stories__/ExampleDiv";

const meta = {
  component: HPanel,
} satisfies Meta<typeof HPanel>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
  args: {
    left: <ExampleDiv>left</ExampleDiv>,
    right: <ExampleDiv2>right</ExampleDiv2>,
  },
  render: (args) => (
    <Root>
      <HPanel {...args} />
    </Root>
  ),
};

export const WithVPanel: StoryObj<typeof meta> = {
  args: {
    left: (
      <div
        style={{
          width: "100%",
        }}
      >
        <VPanel
          top={<ExampleDiv>top</ExampleDiv>}
          bottom={<ExampleDiv2>bottom</ExampleDiv2>}
        />
      </div>
    ),
    right: <ExampleDiv3>right</ExampleDiv3>,
  },
  render: (args) => {
    return (
      <Root>
        <HPanel {...args} />
      </Root>
    );
  },
};
