import { GlobalStyle } from "../components/core/GlobalStyle";
import styled from "styled-components";
import { Panel } from "../components/core/Panel";
import { Timeline } from "../components/Timeline";
import { Provider } from "react-redux";
import store from "../store";
import { Preview } from "../components/Preview";
import { AssetPanel } from "../components/AssetPanel";
import { KeyboardInput } from "../KeyboardInput";

const IndexPage = () => {
  KeyboardInput.init();
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <VPanelBox>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "4px",
              height: "calc(100% - 8px)",
              width: "calc(100% - 8px)",
            }}
          >
            <HPanelBox>
              <VPanelBox
                style={{
                  width: "40%",
                }}
              >
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
              <HPanelBox
                style={{
                  width: "50%",
                }}
              >
                <Panel />
                <HPanelDivider />
                <AssetPanel />
              </HPanelBox>
            </HPanelBox>
          </div>
        </VPanelBox>
      </Provider>
    </>
  );
};

const VPanelDivider = styled.div`
  width: 100%;
  min-height: 4px;
  background-color: var(--color-panel-divider);
  cursor: row-resize;
  user-select: none;
`;

const HPanelDivider = styled.div`
  min-width: 4px;
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
