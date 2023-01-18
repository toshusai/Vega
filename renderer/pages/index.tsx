import { GlobalStyle } from "../components/core/GlobalStyle";
import styled from "styled-components";
import { Panel } from "../components/core/Panel";
import { Timeline } from "../components/Timeline";

const IndexPage = () => {
  return (
    <>
      <GlobalStyle />
      <PanelBox>
        <Timeline />
        <PanelDivider />
        <Panel />
      </PanelBox>
    </>
  );
};

const PanelDivider = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--color-panel-divider);
  cursor: row-resize;
  user-select: none;
`;

const PanelBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export default IndexPage;
