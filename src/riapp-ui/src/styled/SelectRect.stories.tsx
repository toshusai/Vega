import type { Meta, StoryObj } from "@storybook/react";
import { SelectRectDiv } from "./SelectRect";
import { useSelectRect } from "../hooks";
const meta = {
  component: SelectRectDiv,
} satisfies Meta<typeof SelectRectDiv>;

export default meta;

export const Basic: StoryObj<typeof meta> = {
  render: (args) => {
    const { handleMouseDownForSelect, rect } = useSelectRect();
    return (
      <div
        onMouseDown={handleMouseDownForSelect}
        style={{
          width: "100%",
          height: "256px",
          border: "1px solid var(--color-border)",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          lineHeight: "256px",
          userSelect: "none",
        }}
      >
        drag to select
        <SelectRectDiv
          $height={rect?.height ?? 0}
          $width={rect?.width ?? 0}
          $left={rect?.left ?? 0}
          $top={rect?.top ?? 0}
        />
      </div>
    );
  },
};
