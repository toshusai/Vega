import { FC, memo, useEffect, useRef, useState } from "react";
import { StyledInput } from "./StyledInput";
import { useNativeOnChange } from "./useNativeOnChange";

type ClickEditInputProps = {
  value?: string;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
};

export const ClickEditInput: FC<ClickEditInputProps> = (props) => {
  const { inputRef, value, setValue } = useNativeOnChange(
    props.value,
    props.onChange
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

export const MemoClickEditInput = memo(ClickEditInput, (prev, next) => {
  return prev.value === next.value && prev.onChange === next.onChange;
});
