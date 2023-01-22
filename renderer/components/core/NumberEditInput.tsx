import { FC, useState } from "react";
import { pureFinalPropsSelectorFactory } from "react-redux/es/connect/selectorFactory";
import { getDragHander } from "../../utils/getDragHander";
import { StyledInput } from "./styled/StyledInput";
import { useNativeOnChange } from "../../hooks/useNativeOnChange";

type NumberEditInputProps = {
  value?: number;
  scale?: number;
  view?: (value: number) => string;
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
      setValue(props.value + ctx.diffX * (props.scale ?? 1));
      props.onInput?.(props.value + ctx.diffX * (props.scale ?? 1));
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
        props.onChange?.(props.value + ctx.diffX * (props.scale ?? 1));
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
