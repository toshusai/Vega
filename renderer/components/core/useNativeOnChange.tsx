import { useEffect, useRef, useState } from "react";

export function useNativeOnChange(
  propsValue: string | number,
  propsOnChange: (value: number | string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(propsValue);
  useEffect(() => {
    const onChange = (e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (typeof propsValue === "string") {
        propsOnChange?.(target.value);
      } else {
        propsOnChange?.(target.valueAsNumber);
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener("change", onChange);
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("change", onChange);
      }
    };
  }, [propsValue]);

  useEffect(() => {
    if (propsValue !== value) {
      setValue(propsValue);
    }
  }, [propsValue]);
  return { inputRef, value, setValue };
}
