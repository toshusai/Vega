import { FC } from "react";
import { Key } from "tabler-icons-react";

import { iconProps } from "@/components/core/iconProps";

import { KeyFrameIconButton } from "./strip_panel/styled/KeyFrameIconButton";

export const KeyframeButton: FC<{
  onClick: () => void;
  highlight: boolean;
  active: boolean;
}> = (props) => {
  return (
    <KeyFrameIconButton>
      <Key
        {...iconProps}
        onClick={props.onClick}
        color={
          props.highlight
            ? "var(--color-strip-selected)"
            : props.active
            ? "var(--color-primary)"
            : "white"
        }
      />
    </KeyFrameIconButton>
  );
};
