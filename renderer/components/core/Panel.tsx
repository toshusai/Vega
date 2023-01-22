import { FC } from "react";
import styled from "styled-components";

export const Panel: FC<{
  width: number | string;
  height: number | string;
  box?: boolean;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <PanelRoot
      style={{
        width:
          typeof props.width === "string" ? props.width : props.width + "%",
        height:
          typeof props.height === "string" ? props.height : props.height + "%",
        background: props.box ? "transparent" : undefined,
        ...props.style,
      }}
    >
      <PanelInner>{props.children}</PanelInner>
    </PanelRoot>
  );
};

const PanelRoot = styled.div`
  background-color: var(--color-background);
  border-radius: 8px;
  position: relative;
  height: 100%;
  width: 100%;
`;

const PanelInner = styled.div`
  margin: 8px 4px;
  position: relative;
  height: calc(100% - 16px);
  width: calc(100% - 8px);
`;
