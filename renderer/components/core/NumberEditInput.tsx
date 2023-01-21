import { FC, useState } from "react";
import { getDragHander } from "../getDragHander";
import { StyledInput } from "./StyledInput";
import { useNativeOnChange } from "./useNativeOnChange";

type NumberEditInputProps = {
  value?: number;
  style?: React.CSSProperties;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
};

export const NumberEditInput: FC<NumberEditInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const { inputRef, value, setValue } = useNativeOnChange(
    props.value,
    props.onChange
  );

  const handleMouseDown = getDragHander(
    (ctx) => {
      ctx.startEvent.preventDefault();
      setValue(props.value + ctx.diffX);
      props.onInput?.(props.value + ctx.diffX);
    },
    (ctx) => {
      ctx.startEvent.preventDefault();
    },
    (ctx) => {
      if (ctx.diffX === 0 && ctx.diffY === 0) {
        setIsFocused(true);
        inputRef.current?.focus();
      } else {
        props.onChange?.(props.value + ctx.diffX);
      }
    }
  );

  return (
    <StyledInput
      ref={inputRef}
      type="number"
      readOnly={!isFocused}
      value={value}
      style={{
        cursor: isFocused ? "default" : "ew-resize",
        userSelect: isFocused ? "text" : "none",
      }}
      onMouseDown={handleMouseDown}
      onChange={(e) => {
        props.onInput?.(e.target.valueAsNumber);
        setValue(e.target.valueAsNumber);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          setIsFocused(false);
          inputRef.current?.blur();
        }
      }}
      onFocus={() => {
        setIsFocused(true);
      }}
      onBlur={() => {
        setIsFocused(false);
      }}
    />
  );
};
