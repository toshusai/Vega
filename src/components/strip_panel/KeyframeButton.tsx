import { IconKey } from "@tabler/icons-react";
import { FC } from "react";

import { IconButton, iconProps, ToolTip } from "@/app-ui/src";

export const KeyframeButton: FC<{
  onClick: () => void;
  highlight: boolean;
  active: boolean;
}> = (props) => {
  return (
    <ToolTip content="Add keyFrame">
      <IconButton>
        <IconKey
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
      </IconButton>
    </ToolTip>
  );
};
