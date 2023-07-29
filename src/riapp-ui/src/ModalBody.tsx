import { FC } from "react";
import { X } from "tabler-icons-react";

import { Card } from "./Card";
import { iconProps } from "./iconProps";
import { PanelBody } from "./PanelBody";
import { TransparentIconButton } from "./TransparentIconButton";

export const ModalBody: FC<{
  title?: string;
  onClose?: () => void;
}> = (props) => {
  return (
    <Card
      width={"auto"}
      height={"auto"}
      style={{
        margin: "auto",
        padding: "8px",
      }}
    >
      <PanelBody
        style={{
          height: "100%",
          margin: "0 8px",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ width: "16px" }}></div>
          <div style={{ margin: "auto", fontWeight: "bold" }}>
            {props.title}
          </div>
          <div>
            <TransparentIconButton onClick={props.onClose}>
              <X {...iconProps} />
            </TransparentIconButton>
          </div>
        </div>
        {props.children}
      </PanelBody>
    </Card>
  );
};
