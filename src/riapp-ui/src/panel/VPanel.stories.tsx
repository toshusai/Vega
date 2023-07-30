import type { Meta, StoryObj } from "@storybook/react";
import { HPanel, VPanel } from ".";
import styled, { css } from "styled-components";
import { ExampleDiv, ExampleDiv2, ExampleDiv3, Root } from "./__stories__/ExampleDiv";

const meta = {
  component: VPanel,
} satisfies Meta<typeof VPanel>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
  args: {
    top: <ExampleDiv>top</ExampleDiv>,
    bottom: <ExampleDiv2>bottom</ExampleDiv2>,
  },
  render: (args) => {
    return (
      <Root>
        <VPanel {...args} />
      </Root>
    );
  },
};

export const WithHPanel: StoryObj<typeof meta> = {
  args: {
    top: (
      <div
        style={{
          width: "100%",
        }}
      >
        <HPanel
          left={<ExampleDiv>left</ExampleDiv>}
          right={<ExampleDiv2>right</ExampleDiv2>}
        />
      </div>
    ),
    bottom: <ExampleDiv3>bottom</ExampleDiv3>,
  },
  render: (args) => {
    return (
      <Root>
        <VPanel {...args} />
      </Root>
    );
  },
};
