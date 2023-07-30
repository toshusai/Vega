import type { Meta, StoryObj } from "@storybook/react";
import { TimeView } from ".";
const meta = {
  component: TimeView,
} satisfies Meta<typeof TimeView>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
  args: {
    pxPerSec: 100,
    fps: 60,
    frameMode: false,
    offsetSec: 0,
  },
};
