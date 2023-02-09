import { FC, memo } from "react";

import { useNativeOnChange } from "./utils/useNativeOnChange";

import { StyledInput } from "./styled/StyledInput";

export type ClickEditInputProps = {
  value?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
};

export const VInput: FC<ClickEditInputProps> = (props) => {
  const { inputRef, value, setValue } = useNativeOnChange(
    props.value ?? "",
    (value) => props.onChange?.(value as string)
  );

  return (
    <>
      <StyledInput
        onChange={(e) => {
          props.onInput?.(e.target.value);
          setValue(e.target.value);
        }}
        ref={inputRef}
        style={props.style}
        value={value}
      />
    </>
  );
};

export const MemoClickEditInput = memo(VInput, (prev, next) => {
  return prev.value === next.value && prev.onChange === next.onChange;
});
