import { FC } from "react";
import styled from "styled-components";

export const Panel: FC = (props) => {
  return (
    <PanelRoot>
      <PanelInner>{props.children}</PanelInner>
    </PanelRoot>
  );
};

export const PanelRoot = styled.div`
  background-color: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
`;

export const PanelInner = styled.div`
  margin: 8px 4px;
  position: relative;
  height: calc(100% - 16px);
  width: calc(100% - 8px);
  /* height: 100%; */
  /* width: 100%; */
`;
