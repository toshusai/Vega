import { FC } from "react";
import styled from "styled-components";
import { COLOR_BACKGROUND_NAME } from "./styled";

export const Card: FC<{
  width?: number | string;
  height?: number | string;
  box?: boolean;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <CardRoot
      style={{
        width:
          typeof props.width === "string" ? props.width : props.width + "%",
        height:
          typeof props.height === "string" ? props.height : props.height + "%",
        background: props.box ? "transparent" : undefined,
        ...props.style,
      }}
    >
      <CardInner>{props.children}</CardInner>
    </CardRoot>
  );
};

const CardRoot = styled.div`
  background-color: var(${COLOR_BACKGROUND_NAME});
  position: relative;
  height: 100%;
  width: 100%;
`;

const CardInner = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
