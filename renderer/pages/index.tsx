import { GlobalStyle } from "../components/core/GlobalStyle";
import styled from "styled-components";
import { Panel } from "../components/core/Panel";
import { Timeline } from "../components/Timeline";
import { Provider, useDispatch } from "react-redux";
import store from "../store";
import { Preview } from "../components/Preview";
import { AssetPanel } from "../components/AssetPanel";
import { Key, KeyboardInput, UndoManager } from "../KeyboardInput";
import { AssetDetailsPanel } from "../components/AssetDetailsPanel";
import { StripPanel } from "../components/StripPanel";
import { actions } from "../store/scene";
import { KeyFramePanel } from "../components/KeyFramePanel";
import { MenuButton } from "./MenuButton";
export function download(blob: Blob | string, name: string) {
  const link = document.createElement("a");
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }
  if (typeof blob === "string") {
    link.href = "data:text/json;charset=utf-8," + encodeURIComponent(blob);
  } else {
    link.href = URL.createObjectURL(blob);
  }
  link.download = name;
  link.dispatchEvent(new MouseEvent("click"));
  link.remove();
}

const IndexPage = () => {
  KeyboardInput.init(() => {
    KeyboardInput.addKeyDownListener(Key.KeyZ, (e) => {
      e.preventDefault();
      if (
        KeyboardInput.isPressed(Key.Shift) &&
        KeyboardInput.isPressed(Key.Meta)
      ) {
        UndoManager.main.redo();
      } else {
        if (KeyboardInput.isPressed(Key.Meta)) {
          UndoManager.main.undo();
        }
      }
    });
  });
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <div
          style={{
            display: "flex",
            height: "16px",
            padding: "4px 4px 0px 4px",
          }}
        >
          <MenuButton />
        </div>
        <VPanelBox
          style={{
            height: "calc(100% - 24px)",
          }}
        >
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
                <StripPanel />
                <VPanelDivider />
                <KeyFramePanel />
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
                <AssetDetailsPanel />
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
