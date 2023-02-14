import { FC } from "react";
import { Plus } from "tabler-icons-react";

import { iconProps } from "./iconProps";
import { IconButton } from "./styled/IconButton";

type Item = {
  label: string;
  value: string;
};

type Props = {
  items: Item[];
  onChange: (value: string) => void;
};

export const DropdownLike: FC<Props> = (props) => {
  return (
    <IconButton
      style={{
        position: "relative",
        boxSizing: "border-box",
      }}
      as="div"
    >
      <Plus {...iconProps} />
      <select
        value=""
        style={{
          position: "absolute",
          left: "-1px",
          top: "-1px",
          width: "16px",
          minHeight: "16px",
          height: "16px",
          background: "transparent",
          appearance: "none",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          display: "flex",
          padding: "0",
          boxSizing: "border-box",
          color: "transparent",
        }}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      >
        <option value="" disabled>
          Actions
        </option>
        {props.items.map((item) => {
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </IconButton>
  );
};
