import { FC } from "react";

import { useNativeOnChange } from "@/hooks/useNativeOnChange";

import { StyledTextarea } from "./styled/StyledTextarea";
import { ClickEditInputProps } from "./VInput";

export const VTextarea: FC<ClickEditInputProps> = (props) => {
  const { inputRef, value, setValue } = useNativeOnChange<HTMLTextAreaElement>(
    props.value ?? "",
    (value) => props.onChange?.(value as string)
  );
  return (
    <>
      <StyledTextarea
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
