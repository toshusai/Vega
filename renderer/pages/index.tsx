import { GlobalStyle } from "../components/core/GlobalStyle";
import styled from "styled-components";
import { Panel } from "../components/core/Panel";
import { Timeline } from "../components/Timeline";
import { Provider } from "react-redux";
import store from "../store";
import { Preview } from "../components/Preview";
import { AssetPanel } from "../components/AssetPanel";

const IndexPage = () => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <VPanelBox>
          <HPanelBox>
            <VPanelBox>
              <Panel />
              <VPanelDivider />
              <Panel />
            </VPanelBox>
            <HPanelDivider />
            <Preview />
          </HPanelBox>
          <VPanelDivider />
          <HPanelBox>
            <Timeline />
            <HPanelDivider />
            <HPanelBox>
              <Panel />
              <HPanelDivider />
              <AssetPanel />
            </HPanelBox>
          </HPanelBox>
        </VPanelBox>
      </Provider>
    </>
  );
};

const VPanelDivider = styled.div`
  width: 100%;
  height: 8px;
  background-color: var(--color-panel-divider);
  cursor: row-resize;
  user-select: none;
`;

const HPanelDivider = styled.div`
  width: 8px;
  height: 100%;
  background-color: var(--color-panel-divider);
  cursor: col-resize;
  user-select: none;
`;

const VPanelBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const HPanelBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export default IndexPage;
