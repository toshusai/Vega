import { FC, memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  display: block;
  color: var(--color-text);
  box-sizing: border-box;
  font-size: 12px;
  line-height: 12px;
  margin: 0;
  border: 1px solid var(--color-border);
  background-color: var(--color-input-background);
  border-radius: 8px;
  height: 16px;
  padding-left: 8px;
  caret-color: red;

  :focus {
    outline: none;
    border-radius: 8px;
    background-color: var(--color-input-background-focus);
  }

  font-family: "Ricty Diminished";
`;

type Props = {
  value?: string | number;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;
};

export const ClickEditInput: FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onChange = (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      props.onChange?.(target.value);
    };
    if (inputRef.current) {
      inputRef.current.addEventListener("change", onChange);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("change", onChange);
      }
    };
  }, [props.value]);
  const [value, setValue] = useState(props.value);
  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);
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
