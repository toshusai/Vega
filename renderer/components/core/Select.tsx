import { FC } from "react";
import { StyledSelect } from "./StyledSelect";

export type Item = {
  label: string;
  value: string;
  disabled?: boolean;
};
type Props = {
  items: Item[];
  value: string;
  onChange: (value: string) => void;
};

export const Select: FC<Props> = (props) => {
  return (
    <StyledSelect
      value={props.value}
      onChange={(e) => {
        props.onChange(e.target.value);
      }}
    >
      {props.items.map((item) => {
        return (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        );
      })}
    </StyledSelect>
  );
};
