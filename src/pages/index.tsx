import React, { FC } from "react";
import { Provider } from "react-redux";
import styled from "styled-components";

import { AssetDetailsPanel } from "@/components/asset_details_panel/AssetDetailsPanel";
import { AssetPanel } from "@/components/assets_panel/AssetPanel";
import { GlobalStyle } from "@/components/core/styled/GlobalStyle";
import { KeyFramePanel } from "@/components/keyframes_panel/KeyFramePanel";
import { MenuButton } from "@/components/MenuButton";
import { Preview } from "@/components/preview_panel/Preview";
import { RecordMenuButton } from "@/components/RecordMenuButton";
import { SettingsMenuButton } from "@/components/SettingsMenuButton";
import { StripPanel } from "@/components/strip_panel/StripPanel";
import { Timeline } from "@/components/timeline_panel/Timeline";
import store from "@/store";
import { getDragHander } from "@/utils/getDragHander";
import { initGlobalEvent } from "@/utils/initGlobalEvent";

if (typeof window !== "undefined") {
  window.React = React;
  window.styled = styled;
}

const IndexPage = () => {
  initGlobalEvent();
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
          <RecordMenuButton />
          <SettingsMenuButton />
        </div>

        <div
          style={{
            padding: "4px",
            // 20px header + 8px padding
            height: "calc(100% - 28px)",
            width: "calc(100% - 8px)",
            overflow: "hidden",
          }}
        >
          <VPanelBox2
            top={
              <HPanelBox2
                left={
                  <VPanelBox2 top={<StripPanel />} bottom={<KeyFramePanel />} />
                }
                right={<Preview />}
                defaultRate={0.3}
              />
            }
            bottom={
              <HPanelBox2
                left={<Timeline />}
                right={
                  <HPanelBox2
                    left={<AssetDetailsPanel />}
                    right={<AssetPanel />}
                  />
                }
                defaultRate={0.7}
              />
            }
          />
        </div>
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
const VPanelBox2: FC<{
  top: React.ReactNode;
  bottom: React.ReactNode;
  defaultRate?: number;
}> = (props) => {
  const [rate, setRate] = React.useState(props.defaultRate ?? 0.5);
  const topHeight = `calc(${(rate * 100).toFixed(0)}% - 2px)`;
  const bottomHeight = `calc(${(1 - rate) * 100}% - 2px)`;
  const handleMouseDown = getDragHander((ctx) => {
    const { diffY } = ctx;
    const el = ctx.startEvent.target as HTMLElement;
    const ctxWidth = el.parentElement?.clientHeight ?? 0;
    const newRate = Math.max(0, Math.min(1, rate + diffY / ctxWidth));
    setRate(newRate);
  });
  return (
    <VPanelBox>
      <Panel2
        style={{
          height: topHeight,
        }}
      >
        {props.top}
      </Panel2>
      <VPanelDivider onMouseDown={handleMouseDown} />
      <Panel2
        style={{
          height: bottomHeight,
        }}
      >
        {props.bottom}
      </Panel2>
    </VPanelBox>
  );
};

const Panel2 = styled.div`
  position: relative;
  display: flex;
  /* height: 100%; */
  /* width: 100%; */
`;

const HPanelBox = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const HPanelBox2: FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRate?: number;
}> = (props) => {
  const [rate, setRate] = React.useState(props.defaultRate ?? 0.5);
  const leftWidth = `calc(${rate * 100}% - 2px)`;
  const rightWidth = `calc(${(1 - rate) * 100}% - 2px)`;
  const handleMouseDown = getDragHander((ctx) => {
    const { diffX } = ctx;
    const el = ctx.startEvent.target as HTMLElement;
    const ctxWidth = el.parentElement?.clientWidth ?? 0;
    const newRate = Math.max(0, Math.min(1, rate + diffX / ctxWidth));
    setRate(newRate);
  });
  return (
    <HPanelBox>
      <Panel2
        style={{
          width: leftWidth,
        }}
      >
        {props.left}
      </Panel2>
      <HPanelDivider onMouseDown={handleMouseDown} />
      <Panel2
        style={{
          width: rightWidth,
        }}
      >
        {props.right}
      </Panel2>
    </HPanelBox>
  );
};

export default IndexPage;
