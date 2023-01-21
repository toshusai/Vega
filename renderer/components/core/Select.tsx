import { FC } from "react";
import { StyledSelect } from "./StyledSelect";

type Item = {
  label: string;
  value: string;
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
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </StyledSelect>
  );
};
