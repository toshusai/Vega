import { IconPencil } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

import { AutoHeightTextarea, IconButton, iconProps } from "@/app-ui/src";

const Flex = styled.div`
  display: flex;
`;

export function EditableView(props: {
  text: string;
  onChange: (value: string) => void;
}) {
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [value, setValue] = useState(props.text);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);
  return (
    <Flex>
      {editable ? (
        <div
          css={css`
            width: 16px;
          `}
        />
      ) : (
        <IconButton
          style={{ marginLeft: "auto" }}
          onClick={() => {
            setEditable(!editable);
            inputRef.current?.focus();
          }}
        >
          <IconPencil {...iconProps} />
        </IconButton>
      )}
      {!editable ? (
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
}

function removeLineBreaks(str: string) {
  return str.replace(/\n/g, "");
}
