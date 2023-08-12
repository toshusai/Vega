import { memo, useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Pencil } from "tabler-icons-react";

import {
  AutoHeightTextarea,
  Flex,
  IconButton,
  iconProps,
} from "@/riapp-ui/src";

export const EditableView = memo(function EditableView(props: {
  text: string;
  onChange: (value: string) => void;
}) {
  const [eidtable, setEditable] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(props.text);

  useEffect(() => {
    if (eidtable) {
      inputRef.current?.focus();
    }
  }, [eidtable]);
  return (
    <Flex>
      {eidtable ? (
        <div
          css={css`
            width: 16px;
          `}
        />
      ) : (
        <IconButton
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setEditable(!eidtable);
            inputRef.current?.focus();
          }}
        >
          <Pencil {...iconProps} />
        </IconButton>
      )}
      {!eidtable ? (
        <div
          css={css`
            padding-left: 8px;
            width: 100%;
            max-width: 100%;
          `}
        >
          {props.text}
        </div>
      ) : (
        <AutoHeightTextarea
          style={{ width: "100%", maxWidth: "100%" }}
          value={removeLineBreaks(value)}
          ref={inputRef}
          onBlur={() => {
            setEditable(false);
          }}
          onChange={(value) => {
            props.onChange(removeLineBreaks(value));
          }}
          onInput={(value) => {
            setValue(value);
          }}
        />
      )}
    </Flex>
  );
});

function removeLineBreaks(str: string) {
  return str.replace(/\n/g, "");
}
