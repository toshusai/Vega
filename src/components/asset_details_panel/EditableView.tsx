import { memo, useEffect, useRef, useState } from "react";
import { css } from "styled-components";
import { Pencil } from "tabler-icons-react";

import { IconButton, iconProps, VInput } from "@/riapp-ui/src";

export const EditableView = memo(function EditableView(props: {
  text: string;
  onChange: (value: string) => void;
}) {
  const [eidtable, setEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (eidtable) {
      inputRef.current?.focus();
    }
  }, [eidtable]);
  return (
    <>
      {!eidtable && (
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
            width: 120px;
            white-space: nowrap;
            padding-left: 8px;
          `}
        >
          {props.text}
        </div>
      ) : (
        <VInput
          style={{ width: "100%" }}
          value={props.text}
          ref={inputRef}
          onBlur={() => {
            setEditable(false);
          }}
          onChange={(value) => {
            props.onChange(value);
          }}
          onInput={(value) => {
            props.onChange(value);
          }}
        />
      )}
    </>
  );
});
