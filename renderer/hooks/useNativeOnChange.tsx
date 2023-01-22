import { useEffect, useRef, useState } from "react";

export function useNativeOnChange<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement
>(
  propsValue: string | number,
  propsOnChange: (value: number | string) => void
) {
  const inputRef = useRef<T>(null);
  const [value, setValue] = useState(propsValue);
  useEffect(() => {
    const onChange = (e: InputEvent) => {
      const target = e.target as T;
      if (typeof propsValue === "string") {
        propsOnChange?.(target.value);
      } else if (target instanceof HTMLInputElement) {
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
