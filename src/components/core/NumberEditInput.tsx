import { FC, useState } from "react";

import { useNativeOnChange } from "@/hooks/useNativeOnChange";
import { getDragHander } from "@/utils/getDragHander";

import { StyledInput } from "./styled/StyledInput";

type NumberEditInputProps = {
  value?: number;
  scale?: number;
  view?: (value: number) => string;
  style?: React.CSSProperties;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
  min?: number;
  max?: number;
};

function minMax(value: number, min: number, max: number) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export const NumberEditInput: FC<NumberEditInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const { inputRef, value, setValue } = useNativeOnChange(
    props.value ?? 0,
    (value) => props.onChange?.(value as number)
  );

  const _minMax = (value: number) => {
    return minMax(
      value,
      props.min ?? Number.MIN_SAFE_INTEGER,
      props.max ?? Number.MAX_SAFE_INTEGER
    );
  };

  const handleMouseDown = getDragHander(
    (ctx) => {
      ctx.startEvent.preventDefault();
      let value = (props.value ?? 0) + ctx.diffX * (props.scale ?? 1);
      value = _minMax(value);
      setValue(value);
      props.onInput?.(value);
    },
    (ctx) => {
      ctx.startEvent.preventDefault();
    },
    (ctx) => {
      if (ctx.diffX === 0 && ctx.diffY === 0) {
        setIsFocused(true);
        inputRef.current?.focus();
        inputRef.current?.select();
      } else {
        let value =  (props.value ?? 0) + ctx.diffX * (props.scale ?? 1);
        value = _minMax(value);
        props.onChange?.(value);
      }
    }
  );

  return (
    <StyledInput
      ref={inputRef}
      type="number"
      readOnly={!isFocused}
      value={
        props.view
          ? props.view(value as number)
          : isNaN(value as number)
          ? "0"
          : value
      }
      style={{
        cursor: isFocused ? "default" : "ew-resize",
        userSelect: isFocused ? "text" : "none",
      }}
      onMouseDown={handleMouseDown}
      onChange={(e) => {
        const value = _minMax(e.target.valueAsNumber);
        props.onInput?.(value);
        setValue(value);
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
